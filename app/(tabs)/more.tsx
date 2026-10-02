import React from 'react';
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
import { mockExpenses, getDashboardSummary } from '@/constants/MockData';

interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  color?: string;
  badge?: string;
}

export default function MoreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const summary = getDashboardSummary();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'ANALYTICS & INTELLIGENCE',
      items: [
        { icon: 'bar-chart-outline', label: 'Financial Reports & P&L', subtitle: 'Revenue, expense ratios & analytics', color: '#38BDF8', badge: 'PRO' },
        { icon: 'sparkles-outline', label: 'AI Voice Calling Bot', subtitle: 'Feature 23 • Natural voice collection', color: '#8B5CF6', badge: 'AI' },
        { icon: 'document-text-outline', label: 'Digital Invoice Templates', subtitle: 'Auto itemized bills with UPI QR', color: '#F59E0B' },
        { icon: 'download-outline', label: 'Export Tax Records', subtitle: 'Excel & PDF monthly exports', color: '#10B981' },
      ],
    },
    {
      title: 'OPERATIONS & ACCESS',
      items: [
        { icon: 'people-outline', label: 'Staff & Manager Roles', subtitle: 'Warden & housekeeping access', color: '#6366F1' },
        { icon: 'calendar-outline', label: 'Rent Due & Grace Period', subtitle: 'Default 5th of month (3-day grace)', color: '#FF6B6B' },
        { icon: 'shield-checkmark-outline', label: 'Digital KYC & Aadhaar', subtitle: 'Instant ID verification engine', color: '#10B981' },
        { icon: 'finger-print-outline', label: 'Police Verification Tracking', subtitle: 'Tenant compliance logs', color: '#F43F5E' },
      ],
    },
    {
      title: 'PAYMENTS & INTEGRATIONS',
      items: [
        { icon: 'logo-whatsapp', label: 'WhatsApp Cloud API', subtitle: 'Automated 1-click reminders connected', color: '#25D366', badge: 'Active' },
        { icon: 'card-outline', label: 'Payment Gateway (UPI AutoPay)', subtitle: 'Razorpay & PhonePe merchant account', color: '#38BDF8' },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { icon: 'notifications-outline', label: 'Notification Settings', color: '#F59E0B' },
        { icon: 'help-circle-outline', label: '24/7 Priority Support', subtitle: 'support@pghub.app', color: '#38BDF8' },
        { icon: 'star-outline', label: 'Rate PG Hub App', color: '#FBBF24' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.pageEyebrow}>CONTROL CENTER</Text>
          <Text style={styles.pageTitle}>Executive Hub</Text>
        </View>
        <View style={styles.hostBadge}>
          <Text style={styles.hostBadgeText}>PRO HOST</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, CardStyles.glassBorder]}>
          <LinearGradient
            colors={['#17233B', '#111A2E']}
            style={styles.profileCardGradient}
          >
            <View style={styles.profileRow}>
              <View style={styles.avatarWrap}>
                <LinearGradient
                  colors={['#FF6B6B', '#F59E0B']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarLetter}>R</Text>
                </LinearGradient>
              </View>
              <View style={styles.profileInfoCol}>
                <Text style={styles.profileName}>Rahul Sharma</Text>
                <Text style={styles.profileSubtitle}>Sunshine Living Host • 3 Properties</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#FBBF24" />
                  <Text style={styles.ratingText}>4.9/5 Rating</Text>
                  <Text style={{ color: '#475569' }}>•</Text>
                  <Text style={styles.ratingText}>49 Total Beds</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Financial KPI Banner */}
        <TouchableOpacity
          style={[styles.financeCard, CardStyles.glassBorder]}
          activeOpacity={0.85}
          onPress={() => router.push('/reports')}
        >
          <LinearGradient
            colors={['#14223A', '#0F1A2E']}
            style={styles.financeGradient}
          >
            <View style={styles.financeHeaderRow}>
              <View style={styles.liveTagRow}>
                <View style={styles.greenPulse} />
                <Text style={styles.financeHeaderTitle}>MONTHLY P&L SNAPSHOT</Text>
              </View>
              <View style={styles.viewReportsAction}>
                <Text style={styles.viewReportsText}>Full Report →</Text>
              </View>
            </View>

            <View style={styles.kpiRow}>
              <View style={styles.kpiItem}>
                <Text style={styles.kpiLabel}>Revenue</Text>
                <Text style={styles.kpiValueRevenue}>{formatCurrency(summary.totalRevenue)}</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiItem}>
                <Text style={styles.kpiLabel}>Expenses</Text>
                <Text style={styles.kpiValueExpenses}>{formatCurrency(summary.totalExpenses)}</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiItem}>
                <Text style={styles.kpiLabel}>Net Profit</Text>
                <Text style={styles.kpiValueProfit}>{formatCurrency(summary.netProfit)}</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Expense Category Breakdown */}
        <TouchableOpacity
          style={[styles.expenseCard, CardStyles.glassBorder]}
          activeOpacity={0.85}
          onPress={() => router.push('/reports')}
        >
          <View style={styles.expenseHeaderRow}>
            <Text style={styles.expenseTitle}>Operating Expenses</Text>
            <Text style={styles.expenseSub}>October 2025</Text>
          </View>

          <View style={styles.expenseBarsContainer}>
            {mockExpenses.map((exp, index) => {
              const barColors = ['#38BDF8', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
              const barColor = barColors[index % barColors.length];

              return (
                <View key={exp.category} style={styles.expenseBarItem}>
                  <View style={styles.expenseLabelRow}>
                    <Text style={styles.expenseCatName}>{exp.category}</Text>
                    <Text style={styles.expenseAmountText}>₹{exp.amount.toLocaleString()} ({exp.percentage}%)</Text>
                  </View>
                  <View style={styles.expenseTrack}>
                    <View style={[styles.expenseFill, { width: `${exp.percentage}%`, backgroundColor: barColor }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>

        {/* Grouped Modern Menu Cards */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={[styles.menuBox, CardStyles.glassBorder]}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuRow,
                    index < section.items.length - 1 && styles.menuRowBorder,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.label.includes('Financial Reports')) {
                      router.push('/reports');
                    } else if (item.label.includes('AI Voice Calling')) {
                      router.push('/ai-caller');
                    } else if (item.label.includes('Invoice Templates') || item.label.includes('Export Tax')) {
                      router.push('/invoice');
                    } else {
                      Alert.alert(item.label, item.subtitle || 'Active in PG Hub.');
                    }
                  }}
                >
                  <View style={[styles.menuIconCircle, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>

                  <View style={styles.menuTextCol}>
                    <Text style={styles.menuItemTitle}>{item.label}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>

                  {item.badge && (
                    <View style={[styles.menuBadge, { backgroundColor: item.badge === 'AI' ? '#8B5CF6' : Brand.coral }]}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}

                  <Ionicons name="chevron-forward" size={16} color="#64748B" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to log out of PG Hub?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive' },
          ])}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#F43F5E" />
          <Text style={styles.logoutBtnText}>Sign Out of PG Hub</Text>
        </TouchableOpacity>

        {/* Version Badge */}
        <View style={styles.versionFooter}>
          <Text style={styles.versionText}>PG Hub Enterprise v1.2.0 • Build 240</Text>
        </View>
      </ScrollView>
    </View>
  );
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
  hostBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  hostBadgeText: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 140, // Prevents tab bar overlaying
  },
  profileCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  profileCardGradient: {
    padding: Spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#FFF',
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  profileInfoCol: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  profileSubtitle: {
    fontSize: FontSizes.xs,
    color: '#94A3B8',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  financeCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  financeGradient: {
    padding: Spacing.md,
  },
  financeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  financeHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  viewReportsAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewReportsText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  kpiValueRevenue: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  kpiValueExpenses: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F43F5E',
  },
  kpiValueProfit: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#10B981',
  },
  kpiDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  expenseCard: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  expenseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  expenseTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  expenseSub: {
    fontSize: 11,
    color: '#64748B',
  },
  expenseBarsContainer: {
    gap: Spacing.sm,
  },
  expenseBarItem: {
    gap: 4,
  },
  expenseLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseCatName: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  expenseAmountText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  expenseTrack: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  expenseFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  menuSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  menuBox: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  menuBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  menuBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.25)',
    borderRadius: Radii.xl,
    paddingVertical: 14,
    gap: 8,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  logoutBtnText: {
    color: '#F43F5E',
    fontSize: FontSizes.sm,
    fontWeight: '800',
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  versionText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },
});
