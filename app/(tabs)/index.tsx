import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { Brand, StatusColors } from '@/constants/Colors';
import { Spacing, Radii, FontSizes, CardStyles } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import {
  getDashboardSummary,
  mockRecentActivity,
  mockProperties,
  mockPayments,
} from '@/constants/MockData';

type DateRangeType = 'this_month' | 'last_month' | 'custom';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const summary = getDashboardSummary();

  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  // Date range filter state for revenue summary
  const [dateRange, setDateRange] = useState<DateRangeType>('this_month');
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [customPreset, setCustomPreset] = useState<'q3' | '90days' | 'fy'>('q3');
  const [customStartDate, setCustomStartDate] = useState('2025-07-01');
  const [customEndDate, setCustomEndDate] = useState('2025-09-30');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastRefreshedTime(`Today at ${timeStr}`);
    }, 750);
  }, []);

  // Dynamic Revenue Summary calculation based on selected Date Range
  const revenueSummaryData = useMemo(() => {
    if (dateRange === 'this_month') {
      return {
        label: 'October 2025',
        subLabel: 'Active Billing Cycle (Oct 1 – Oct 31)',
        totalRevenue: 415000,
        totalCollected: 315000,
        pendingDues: 85000,
        overdueDues: 15000,
        duesPendingCount: 4,
        collectionPct: 76,
        residentsSummary: '8 of 12 residents paid',
        growthText: '+14.2%',
        growthSub: 'vs Sep cycle',
        isPositive: true,
      };
    } else if (dateRange === 'last_month') {
      return {
        label: 'September 2025',
        subLabel: 'Settled Cycle (Sep 1 – Sep 30)',
        totalRevenue: 395000,
        totalCollected: 382000,
        pendingDues: 8000,
        overdueDues: 5000,
        duesPendingCount: 1,
        collectionPct: 97,
        residentsSummary: '11 of 12 residents paid',
        growthText: '+9.8%',
        growthSub: 'vs Aug cycle',
        isPositive: true,
      };
    } else {
      // Custom range
      const presetLabel =
        customPreset === '90days'
          ? 'Last 90 Days'
          : customPreset === 'fy'
          ? 'FY 2024-25'
          : 'Q3 2025 (Jul – Sep)';
      return {
        label: presetLabel,
        subLabel: `${customStartDate} → ${customEndDate}`,
        totalRevenue: 1190000,
        totalCollected: 1115000,
        pendingDues: 55000,
        overdueDues: 20000,
        duesPendingCount: 2,
        collectionPct: 94,
        residentsSummary: '34 of 36 collections cleared',
        growthText: '+21.4%',
        growthSub: 'consolidated run rate',
        isPositive: true,
      };
    }
  }, [dateRange, customPreset, customStartDate, customEndDate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleSelectPreset = (preset: 'q3' | '90days' | 'fy') => {
    setCustomPreset(preset);
    if (preset === 'q3') {
      setCustomStartDate('2025-07-01');
      setCustomEndDate('2025-09-30');
    } else if (preset === '90days') {
      setCustomStartDate('2025-07-28');
      setCustomEndDate('2025-10-26');
    } else if (preset === 'fy') {
      setCustomStartDate('2024-04-01');
      setCustomEndDate('2025-03-31');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Modern Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <View style={styles.livePulseDot} />
            <Text style={styles.brandBadgeText}>PG HUB PRO</Text>
          </View>
          <Text style={styles.brandPropertyTag}>Sunshine Living • HSR</Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => router.push('/ai-caller')}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.aiQuickBadge}
            >
              <Ionicons name="sparkles" size={13} color="#FFF" />
              <Text style={styles.aiQuickText}>AI</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => Alert.alert('Notifications', '3 rent payments due today. 1 pending KYC verification.')}
          >
            <Ionicons name="notifications-outline" size={20} color="#F8FAFC" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={() => router.push('/(tabs)/more')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#F59E0B']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>R</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B6B"
            colors={['#FF6B6B', '#8B5CF6']}
            title="Pull down to refresh metrics..."
            titleColor="#94A3B8"
          />
        }
      >
        {/* Welcome Headline & Refresh Status */}
        <View style={styles.headlineSection}>
          <View style={styles.greetingHeaderRow}>
            <View>
              <Text style={styles.greetingSub}>{getGreeting()},</Text>
              <Text style={styles.greetingTitle}>Rahul Sharma</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshIndicatorPill}
              onPress={onRefresh}
              activeOpacity={0.7}
            >
              <Ionicons
                name="sync"
                size={12}
                color={refreshing ? Brand.coral : '#94A3B8'}
              />
              <Text style={styles.refreshIndicatorText}>
                {refreshing ? 'Updating...' : `Refreshed ${lastRefreshedTime}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── BENTO GRID SECTION ── */}
        <View style={styles.bentoContainer}>
          {/* Bento Tile 1: Hero Occupancy & Bed Capacity */}
          <TouchableOpacity
            style={[styles.heroBentoCard, CardStyles.glassBorder]}
            activeOpacity={0.88}
            onPress={() => router.push('/property/1')}
          >
            <LinearGradient
              colors={['#18233C', '#111A2E']}
              style={styles.heroCardGradient}
            >
              <View style={styles.heroTopRow}>
                <View style={styles.heroTagPill}>
                  <View style={styles.pulseGreen} />
                  <Text style={styles.heroTagText}>LIVE OCCUPANCY</Text>
                </View>
                <View style={styles.viewGridAction}>
                  <Text style={styles.viewGridText}>Bed Matrix</Text>
                  <Ionicons name="chevron-forward" size={14} color={Brand.coral} />
                </View>
              </View>

              <View style={styles.heroMainRow}>
                <View style={styles.heroStatCol}>
                  <View style={styles.pctRow}>
                    <Text style={styles.heroPercentageText}>{summary.occupancyRate}%</Text>
                    <Text style={styles.heroPercentageSub}>capacity</Text>
                  </View>
                  <Text style={styles.heroStatDetail}>
                    {summary.occupiedBeds} occupied <Text style={styles.dimText}>•</Text> {summary.vacantBeds} beds vacant
                  </Text>
                </View>

                {/* Donut progress ring representation */}
                <View style={styles.ringVisual}>
                  <View style={styles.ringOuter}>
                    <View style={styles.ringInner}>
                      <Ionicons name="bed" size={20} color={Brand.coral} />
                      <Text style={styles.ringCountText}>{summary.occupiedBeds}/{summary.totalBeds}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Gradient Progress Bar */}
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${summary.occupancyRate}%` }]}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* ── DATE-RANGE FILTER SECTION FOR REVENUE SUMMARY ── */}
          <View style={[styles.revenueFilterSection, CardStyles.glassBorder]}>
            <View style={styles.revenueHeaderRow}>
              <View style={styles.revenueTitleCol}>
                <View style={styles.revenueIconTagRow}>
                  <Ionicons name="wallet-outline" size={15} color="#38BDF8" />
                  <Text style={styles.revenueSectionTitle}>Revenue Summary</Text>
                </View>
                <Text style={styles.revenuePeriodSub}>{revenueSummaryData.subLabel}</Text>
              </View>

              {/* Date Range Filter Pills */}
              <View style={styles.filterPillGroup}>
                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    dateRange === 'this_month' && styles.filterPillActive,
                  ]}
                  onPress={() => setDateRange('this_month')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      dateRange === 'this_month' && styles.filterPillTextActive,
                    ]}
                  >
                    This Month
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    dateRange === 'last_month' && styles.filterPillActive,
                  ]}
                  onPress={() => setDateRange('last_month')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      dateRange === 'last_month' && styles.filterPillTextActive,
                    ]}
                  >
                    Last Month
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    dateRange === 'custom' && styles.filterPillActive,
                  ]}
                  onPress={() => {
                    setDateRange('custom');
                    setIsCustomModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={11}
                    color={dateRange === 'custom' ? '#FFF' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.filterPillText,
                      dateRange === 'custom' && styles.filterPillTextActive,
                    ]}
                  >
                    Custom
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Consolidated Range KPI Strip */}
            <View style={styles.rangeStripCard}>
              <View style={styles.rangeStripRow}>
                <View style={styles.rangeStatBlock}>
                  <Text style={styles.rangeStatLabel}>TARGET RENT</Text>
                  <Text style={styles.rangeStatValue}>
                    {formatCurrency(revenueSummaryData.totalRevenue)}
                  </Text>
                </View>
                <View style={styles.rangeDivider} />
                <View style={styles.rangeStatBlock}>
                  <Text style={styles.rangeStatLabel}>COLLECTED ({revenueSummaryData.collectionPct}%)</Text>
                  <Text style={[styles.rangeStatValue, { color: '#34D399' }]}>
                    {formatCurrency(revenueSummaryData.totalCollected)}
                  </Text>
                </View>
                <View style={styles.rangeDivider} />
                <View style={styles.rangeStatBlock}>
                  <Text style={styles.rangeStatLabel}>REMAINING</Text>
                  <Text style={[styles.rangeStatValue, { color: '#FBBF24' }]}>
                    {formatCurrency(revenueSummaryData.pendingDues)}
                  </Text>
                </View>
              </View>

              {/* Progress bar track */}
              <View style={styles.rangeProgressTrack}>
                <LinearGradient
                  colors={['#10B981', '#34D399']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.rangeProgressFill,
                    { width: `${Math.min(100, revenueSummaryData.collectionPct)}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Bento Row 2: Financial Stats (2 Cards based on selected range) */}
          <View style={styles.bentoRow}>
            {/* Tile 2: Rent Collected */}
            <TouchableOpacity
              style={[styles.smallBentoCard, CardStyles.glassBorder]}
              activeOpacity={0.85}
              onPress={() => router.push('/(tabs)/payments')}
            >
              <LinearGradient
                colors={['#14223A', '#0F1A2E']}
                style={styles.smallCardGradient}
              >
                <View style={styles.smallCardHeader}>
                  <View style={[styles.cardIconBadge, { backgroundColor: StatusColors.successBg }]}>
                    <Ionicons name="trending-up" size={18} color={StatusColors.success} />
                  </View>
                  <View style={styles.growthPill}>
                    <Text style={styles.growthText}>{revenueSummaryData.growthText}</Text>
                  </View>
                </View>
                <Text style={styles.cardValueText}>{formatCurrency(revenueSummaryData.totalCollected)}</Text>
                <Text style={styles.cardLabelText}>Rent Collected</Text>
                <Text style={styles.cardSubText}>{revenueSummaryData.residentsSummary}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tile 3: Pending Dues & AI Recovery */}
            <TouchableOpacity
              style={[styles.smallBentoCard, CardStyles.glassBorder]}
              activeOpacity={0.85}
              onPress={() => router.push('/ai-caller')}
            >
              <LinearGradient
                colors={['#1F1A2B', '#161426']}
                style={styles.smallCardGradient}
              >
                <View style={styles.smallCardHeader}>
                  <View style={[styles.cardIconBadge, { backgroundColor: StatusColors.warningBg }]}>
                    <Ionicons name="alert-circle" size={18} color={StatusColors.warning} />
                  </View>
                  <View style={styles.dueCountPill}>
                    <Text style={styles.dueCountText}>{revenueSummaryData.duesPendingCount} OVERDUE</Text>
                  </View>
                </View>
                <Text style={[styles.cardValueText, { color: '#FBBF24' }]}>
                  {formatCurrency(revenueSummaryData.pendingDues)}
                </Text>
                <Text style={styles.cardLabelText}>Pending Dues</Text>
                <View style={styles.aiActionRow}>
                  <Ionicons name="sparkles" size={11} color={Brand.coral} />
                  <Text style={styles.aiActionText}>Trigger AI Calls →</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CUSTOM DATE RANGE MODAL ── */}
        <Modal
          visible={isCustomModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsCustomModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, CardStyles.glassBorder]}>
              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={styles.modalTitle}>Custom Date Range</Text>
                  <Text style={styles.modalSubtitle}>Select aggregation timeframe</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setIsCustomModalVisible(false)}
                >
                  <Ionicons name="close" size={18} color="#F8FAFC" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSectionLabel}>QUICK PRESETS</Text>
              <View style={styles.presetChipsRow}>
                <TouchableOpacity
                  style={[styles.presetChip, customPreset === 'q3' && styles.presetChipActive]}
                  onPress={() => handleSelectPreset('q3')}
                >
                  <Text style={[styles.presetChipText, customPreset === 'q3' && styles.presetChipTextActive]}>
                    Q3 (Jul - Sep)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.presetChip, customPreset === '90days' && styles.presetChipActive]}
                  onPress={() => handleSelectPreset('90days')}
                >
                  <Text style={[styles.presetChipText, customPreset === '90days' && styles.presetChipTextActive]}>
                    Last 90 Days
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.presetChip, customPreset === 'fy' && styles.presetChipActive]}
                  onPress={() => handleSelectPreset('fy')}
                >
                  <Text style={[styles.presetChipText, customPreset === 'fy' && styles.presetChipTextActive]}>
                    FY 2024-25
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSectionLabel}>CUSTOM DATE SPAN</Text>
              <View style={styles.dateInputsRow}>
                <View style={styles.dateInputCol}>
                  <Text style={styles.dateFieldLabel}>START DATE</Text>
                  <TextInput
                    style={styles.dateTextInput}
                    value={customStartDate}
                    onChangeText={setCustomStartDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#64748B"
                  />
                </View>

                <View style={styles.dateInputCol}>
                  <Text style={styles.dateFieldLabel}>END DATE</Text>
                  <TextInput
                    style={styles.dateTextInput}
                    value={customEndDate}
                    onChangeText={setCustomEndDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#64748B"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyRangeBtn}
                onPress={() => {
                  setDateRange('custom');
                  setIsCustomModalVisible(false);
                }}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#EE5253']}
                  style={styles.applyRangeGradient}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                  <Text style={styles.applyRangeText}>Apply Custom Range</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ── QUICK ACTIONS CAPSULES ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionMeta}>1-Tap Automations</Text>
        </View>

        <View style={styles.quickCapsulesGrid}>
          {/* Action 1: AI Calling (Feature 23) */}
          <TouchableOpacity
            style={[styles.actionCapsule, CardStyles.glassBorder]}
            onPress={() => router.push('/ai-caller')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.capsuleIconBg}
            >
              <Ionicons name="sparkles" size={18} color="#FFF" />
            </LinearGradient>
            <View style={styles.capsuleTextCol}>
              <Text style={styles.capsuleTitle}>AI Rent Call</Text>
              <Text style={styles.capsuleSub}>Auto phone agent</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#64748B" />
          </TouchableOpacity>

          {/* Action 2: WhatsApp Reminder */}
          <TouchableOpacity
            style={[styles.actionCapsule, CardStyles.glassBorder]}
            onPress={() => Alert.alert('Bulk WhatsApp Dispatch', 'Sending polite rent reminder messages with UPI payment links to 4 overdue tenants.')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#25D366', '#128C7E']}
              style={styles.capsuleIconBg}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
            </LinearGradient>
            <View style={styles.capsuleTextCol}>
              <Text style={styles.capsuleTitle}>WhatsApp</Text>
              <Text style={styles.capsuleSub}>Bulk reminders</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#64748B" />
          </TouchableOpacity>

          {/* Action 3: New Check-In */}
          <TouchableOpacity
            style={[styles.actionCapsule, CardStyles.glassBorder]}
            onPress={() => router.push('/tenant/checkin')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B6B', '#EE5253']}
              style={styles.capsuleIconBg}
            >
              <Ionicons name="person-add" size={18} color="#FFF" />
            </LinearGradient>
            <View style={styles.capsuleTextCol}>
              <Text style={styles.capsuleTitle}>Check-In</Text>
              <Text style={styles.capsuleSub}>KYC & Bed assign</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#64748B" />
          </TouchableOpacity>

          {/* Action 4: Invoicing */}
          <TouchableOpacity
            style={[styles.actionCapsule, CardStyles.glassBorder]}
            onPress={() => router.push('/invoice')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#38BDF8', '#0284C7']}
              style={styles.capsuleIconBg}
            >
              <Ionicons name="receipt" size={18} color="#FFF" />
            </LinearGradient>
            <View style={styles.capsuleTextCol}>
              <Text style={styles.capsuleTitle}>Invoicing</Text>
              <Text style={styles.capsuleSub}>Generate bills</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* ── MANAGED PROPERTIES CAROUSEL ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Managed Properties</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/properties')}>
            <Text style={styles.viewAllBtn}>See All ({mockProperties.length}) →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.propertiesScroll}
        >
          {mockProperties.map((property) => {
            const occupancyPct = Math.round((property.occupiedBeds / property.totalBeds) * 100);
            return (
              <TouchableOpacity
                key={property.id}
                style={[styles.propertyCard, CardStyles.glassBorder]}
                activeOpacity={0.85}
                onPress={() => router.push(`/property/${property.id}`)}
              >
                <LinearGradient
                  colors={['#172238', '#10182A']}
                  style={styles.propertyCardGradient}
                >
                  <View style={styles.propHeaderRow}>
                    <View style={styles.propIconBox}>
                      <Ionicons name="business" size={18} color={Brand.coral} />
                    </View>
                    <View style={styles.propOccupancyPill}>
                      <Text style={styles.propOccupancyText}>{occupancyPct}% full</Text>
                    </View>
                  </View>

                  <Text style={styles.propName} numberOfLines={1}>{property.name}</Text>
                  <Text style={styles.propAddress} numberOfLines={1}>
                    <Ionicons name="location-outline" size={11} color="#64748B" /> {property.address}
                  </Text>

                  {/* Bed stats progress */}
                  <View style={styles.propProgressTrack}>
                    <View
                      style={[
                        styles.propProgressFill,
                        {
                          width: `${occupancyPct}%`,
                          backgroundColor: occupancyPct > 80 ? StatusColors.success : StatusColors.warning,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.propFooterRow}>
                    <Text style={styles.propBedsText}>
                      <Text style={{ color: '#F8FAFC', fontWeight: '700' }}>{property.occupiedBeds}</Text>/{property.totalBeds} beds
                    </Text>
                    <Text style={styles.propRevText}>{formatCurrency(property.monthlyRevenue)}/mo</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── LIVE ACTIVITY FEED ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/payments')}>
            <Text style={styles.viewAllBtn}>History →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityFeedBox}>
          {mockRecentActivity.map((activity, index) => {
            const isPayment = activity.type === 'payment';
            const isCheckin = activity.type === 'checkin';
            const isReminder = activity.type === 'reminder';

            return (
              <View
                key={activity.id}
                style={[
                  styles.activityItem,
                  index < mockRecentActivity.length - 1 && styles.activityBorder,
                ]}
              >
                <View
                  style={[
                    styles.activityIconCircle,
                    {
                      backgroundColor: isPayment
                        ? StatusColors.successBg
                        : isCheckin
                        ? StatusColors.infoBg
                        : isReminder
                        ? Brand.whatsappBg
                        : 'rgba(255, 255, 255, 0.08)',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      isPayment
                        ? 'cash-outline'
                        : isCheckin
                        ? 'log-in-outline'
                        : isReminder
                        ? 'chatbubbles-outline'
                        : 'log-out-outline'
                    }
                    size={16}
                    color={
                      isPayment
                        ? StatusColors.success
                        : isCheckin
                        ? StatusColors.info
                        : isReminder
                        ? Brand.whatsapp
                        : StatusColors.warning
                    }
                  />
                </View>

                <View style={styles.activityInfoCol}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySub}>{activity.subtitle}</Text>
                </View>

                <Text style={styles.activityTime}>{activity.timestamp}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#090D16',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  brandRow: {
    gap: 3,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FF6B6B',
  },
  brandPropertyTag: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    fontWeight: '500',
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
  },
  aiQuickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
    gap: 2,
  },
  aiQuickText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: FontSizes.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 130, // GUARANTEES content never hides behind bottom tab bar
  },
  headlineSection: {
    marginBottom: Spacing.lg,
  },
  greetingSub: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  greetingTitle: {
    fontSize: FontSizes['3xl'],
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  bentoContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  heroBentoCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  heroCardGradient: {
    padding: Spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  pulseGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  heroTagText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  viewGridAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewGridText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
  },
  heroMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroStatCol: {
    flex: 1,
  },
  pctRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  heroPercentageText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1,
  },
  heroPercentageSub: {
    fontSize: FontSizes.sm,
    color: '#64748B',
    fontWeight: '600',
  },
  heroStatDetail: {
    fontSize: FontSizes.sm,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  dimText: {
    color: '#475569',
  },
  ringVisual: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 3,
    borderColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    alignItems: 'center',
  },
  ringCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  smallBentoCard: {
    flex: 1,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  smallCardGradient: {
    padding: Spacing.md,
  },
  smallCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  growthText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  dueCountPill: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  dueCountText: {
    color: '#F43F5E',
    fontSize: 9,
    fontWeight: '800',
  },
  cardValueText: {
    fontSize: FontSizes['2xl'],
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  cardLabelText: {
    fontSize: FontSizes.xs,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 1,
  },
  cardSubText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  aiActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  aiActionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  sectionMeta: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  viewAllBtn: {
    fontSize: FontSizes.xs,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  quickCapsulesGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A2E',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  capsuleIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capsuleTextCol: {
    flex: 1,
  },
  capsuleTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  capsuleSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  propertiesScroll: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  propertyCard: {
    width: 200,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  propertyCardGradient: {
    padding: Spacing.md,
  },
  propHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  propIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propOccupancyPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  propOccupancyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  propName: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  propAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  propProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  propProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  propFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propBedsText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  propRevText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  activityFeedBox: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  activityIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfoCol: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  activitySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  activityTime: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },
  greetingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  refreshIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    marginTop: 4,
  },
  refreshIndicatorText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  revenueFilterSection: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  revenueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  revenueTitleCol: {
    gap: 2,
  },
  revenueIconTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  revenueSectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  revenuePeriodSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  filterPillGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radii.full,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 2,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
  },
  filterPillActive: {
    backgroundColor: '#FF6B6B',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rangeStripCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: Radii.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: Spacing.xs,
  },
  rangeStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeStatBlock: {
    flex: 1,
    alignItems: 'center',
  },
  rangeStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#64748B',
    marginBottom: 2,
  },
  rangeStatValue: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  rangeDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  rangeProgressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  rangeProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#94A3B8',
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetChipActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.18)',
    borderColor: '#FF6B6B',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  presetChipTextActive: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  dateInputsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  dateInputCol: {
    flex: 1,
  },
  dateFieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  dateTextInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radii.md,
    color: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  applyRangeBtn: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  applyRangeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  applyRangeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FontSizes.sm,
  },
});
