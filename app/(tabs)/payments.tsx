import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { Brand, StatusColors } from '@/constants/Colors';
import { Spacing, Radii, FontSizes, CardStyles } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { mockPayments } from '@/constants/MockData';

export default function PaymentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredPayments = mockPayments.filter(p => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const totalCollected = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = mockPayments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
  const totalAmount = totalCollected + totalPending;
  const collectionPct = Math.round((totalCollected / totalAmount) * 100);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return StatusColors.success;
      case 'pending': return StatusColors.warning;
      case 'overdue': return StatusColors.error;
      default: return '#94A3B8';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'paid': return StatusColors.successBg;
      case 'pending': return StatusColors.warningBg;
      case 'overdue': return StatusColors.errorBg;
      default: return 'rgba(255,255,255,0.06)';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.pageEyebrow}>FINANCE & RECOVERY</Text>
          <Text style={styles.pageTitle}>Rent Collection</Text>
        </View>
        <TouchableOpacity
          style={styles.cycleBadge}
          onPress={() => router.push('/reports')}
        >
          <Text style={styles.cycleBadgeText}>October 2025</Text>
          <Ionicons name="calendar-outline" size={13} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Collection Gauge Card */}
        <View style={[styles.heroCard, CardStyles.glassBorder]}>
          <LinearGradient
            colors={['#17233B', '#10182A']}
            style={styles.heroCardGradient}
          >
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroLabel}>Total Monthly Rent</Text>
                <Text style={styles.heroAmount}>{formatCurrency(totalAmount)}</Text>
              </View>
              <View style={styles.collectionPill}>
                <Text style={styles.collectionPillText}>{collectionPct}% Collected</Text>
              </View>
            </View>

            {/* Split Metrics (Collected vs Pending) */}
            <View style={styles.splitRow}>
              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <View style={[styles.metricDot, { backgroundColor: StatusColors.success }]} />
                  <Text style={styles.splitLabel}>Collected</Text>
                </View>
                <Text style={[styles.splitValue, { color: StatusColors.success }]}>
                  {formatCurrency(totalCollected)}
                </Text>
              </View>

              <View style={styles.splitDivider} />

              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <View style={[styles.metricDot, { backgroundColor: '#FBBF24' }]} />
                  <Text style={styles.splitLabel}>Pending Dues</Text>
                </View>
                <Text style={[styles.splitValue, { color: '#FBBF24' }]}>
                  {formatCurrency(totalPending)}
                </Text>
              </View>
            </View>

            {/* Dual Colored Progress Track */}
            <View style={styles.dualProgressTrack}>
              <View style={[styles.progressCollected, { width: `${collectionPct}%` }]} />
              <View style={[styles.progressPending, { width: `${100 - collectionPct}%` }]} />
            </View>
          </LinearGradient>
        </View>

        {/* 1-Tap Recovery Actions (AI Calling, WhatsApp, Invoices) */}
        <Text style={styles.sectionHeading}>Automated Recovery Actions</Text>
        <View style={styles.recoveryGrid}>
          {/* Action 1: AI Rent Caller (Feature 23) */}
          <TouchableOpacity
            style={[styles.recoveryCard, { borderColor: 'rgba(99, 102, 241, 0.3)' }]}
            activeOpacity={0.85}
            onPress={() => router.push('/ai-caller')}
          >
            <LinearGradient
              colors={['#1E1B38', '#141328']}
              style={styles.recoveryCardGradient}
            >
              <View style={styles.recoveryIconRow}>
                <LinearGradient
                  colors={['#8B5CF6', '#6366F1']}
                  style={styles.recoveryIconCircle}
                >
                  <Ionicons name="sparkles" size={16} color="#FFF" />
                </LinearGradient>
                <View style={styles.aiLiveBadge}>
                  <Text style={styles.aiLiveBadgeText}>FEATURE 23</Text>
                </View>
              </View>
              <Text style={styles.recoveryTitle}>AI Voice Calling</Text>
              <Text style={styles.recoverySub}>Automate phone calls with natural voice</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Action 2: WhatsApp Bulk Reminders */}
          <TouchableOpacity
            style={[styles.recoveryCard, { borderColor: 'rgba(37, 211, 102, 0.3)' }]}
            activeOpacity={0.85}
            onPress={() => Alert.alert('Bulk Reminders Sent', 'WhatsApp reminder links dispatched to 4 tenants with UPI QR.')}
          >
            <LinearGradient
              colors={['#142823', '#0F1E1B']}
              style={styles.recoveryCardGradient}
            >
              <View style={styles.recoveryIconRow}>
                <LinearGradient
                  colors={['#25D366', '#128C7E']}
                  style={styles.recoveryIconCircle}
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                </LinearGradient>
                <View style={[styles.aiLiveBadge, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]}>
                  <Text style={[styles.aiLiveBadgeText, { color: '#25D366' }]}>WHATSAPP</Text>
                </View>
              </View>
              <Text style={styles.recoveryTitle}>Bulk Reminders</Text>
              <Text style={styles.recoverySub}>1-click UPI links via WhatsApp</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Payment History & Filters */}
        <View style={styles.filterTabsRow}>
          <Text style={styles.sectionHeading}>Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/invoice')}>
            <Text style={styles.invoiceLink}>Generate Invoice →</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Segmented Control */}
        <View style={styles.segmentedFilter}>
          {(['all', 'paid', 'pending', 'overdue'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                onPress={() => setActiveFilterTab(tab)}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Transactions List */}
        <View style={styles.transactionList}>
          {filteredPayments.map((payment) => {
            const color = getStatusColor(payment.status);
            const bg = getStatusBg(payment.status);

            return (
              <TouchableOpacity
                key={payment.id}
                style={[styles.transactionCard, CardStyles.glassBorder]}
                activeOpacity={0.8}
                onPress={() => router.push('/invoice')}
              >
                <View style={styles.transLeft}>
                  <View style={[styles.transIconBox, { backgroundColor: bg }]}>
                    <Ionicons
                      name={payment.status === 'paid' ? 'checkmark-circle' : 'time-outline'}
                      size={20}
                      color={color}
                    />
                  </View>
                  <View>
                    <Text style={styles.transName}>{payment.tenantName}</Text>
                    <Text style={styles.transProperty}>{payment.propertyName}</Text>
                  </View>
                </View>

                <View style={styles.transRight}>
                  <Text style={styles.transAmount}>₹{payment.amount.toLocaleString('en-IN')}</Text>
                  <View style={[styles.statusPill, { backgroundColor: bg }]}>
                    <Text style={[styles.statusPillText, { color }]}>
                      {payment.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredPayments.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={40} color="#475569" />
              <Text style={styles.emptyTitle}>No transactions match filter</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  function setActiveFilterTab(tab: 'all' | 'paid' | 'pending' | 'overdue') {
    setActiveTab(tab);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#090D16',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  pageEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF6B6B',
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: FontSizes['3xl'],
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  cycleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    gap: 4,
  },
  cycleBadgeText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 140, // Prevents bottom tab bar overlay
  },
  heroCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  heroCardGradient: {
    padding: Spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  heroLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: FontSizes['4xl'],
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1,
    marginTop: 2,
  },
  collectionPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  collectionPillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  splitItem: {
    flex: 1,
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  splitLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  splitValue: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  splitDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: Spacing.md,
  },
  dualProgressTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    gap: 2,
  },
  progressCollected: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressPending: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  sectionHeading: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.2,
    marginBottom: Spacing.md,
  },
  recoveryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  recoveryCard: {
    flex: 1,
    borderRadius: Radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recoveryCardGradient: {
    padding: Spacing.md,
  },
  recoveryIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  recoveryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiLiveBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  aiLiveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 0.5,
  },
  recoveryTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  recoverySub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  filterTabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  invoiceLink: {
    fontSize: FontSizes.xs,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  segmentedFilter: {
    flexDirection: 'row',
    backgroundColor: '#111A2E',
    borderRadius: Radii.lg,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: Radii.md,
  },
  segmentBtnActive: {
    backgroundColor: '#FF6B6B',
  },
  segmentText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  transactionList: {
    gap: Spacing.sm,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111A2E',
    borderRadius: Radii.lg,
    padding: Spacing.md,
  },
  transLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  transIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transName: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  transProperty: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  transRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transAmount: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 6,
  },
  emptyTitle: {
    fontSize: FontSizes.xs,
    color: '#64748B',
  },
});
