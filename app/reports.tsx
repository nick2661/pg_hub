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
import { mockExpenses, getDashboardSummary } from '@/constants/MockData';

export default function ReportsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const summary = getDashboardSummary();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(2); // October 2025
  const months = ['August 2025', 'September 2025', 'October 2025', 'November 2025'];

  const trendData = [
    { month: 'May', revenue: 380, fill: 74 },
    { month: 'Jun', revenue: 395, fill: 79 },
    { month: 'Jul', revenue: 410, fill: 83 },
    { month: 'Aug', revenue: 405, fill: 81 },
    { month: 'Sep', revenue: 420, fill: 87 },
    { month: 'Oct', revenue: 415, fill: 85 },
  ];

  const handleDownload = (format: 'PDF' | 'Excel') => {
    Alert.alert(
      'Export Financial Report',
      `Full P&L and occupancy statement for ${months[currentMonthIndex]} successfully exported as ${format}.`,
      [{ text: 'Download File' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Financial Analytics</Text>
        <TouchableOpacity style={styles.exportHeaderBtn} onPress={() => handleDownload('PDF')}>
          <Ionicons name="download-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Month Selector Capsule */}
      <View style={styles.monthSelectorSection}>
        <View style={styles.monthSelector}>
          <TouchableOpacity
            disabled={currentMonthIndex === 0}
            onPress={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
            style={[styles.arrowBtn, currentMonthIndex === 0 && { opacity: 0.3 }]}
          >
            <Ionicons name="chevron-back" size={18} color="#F8FAFC" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{months[currentMonthIndex]}</Text>
          <TouchableOpacity
            disabled={currentMonthIndex === months.length - 1}
            onPress={() => setCurrentMonthIndex(prev => Math.min(months.length - 1, prev + 1))}
            style={[styles.arrowBtn, currentMonthIndex === months.length - 1 && { opacity: 0.3 }]}
          >
            <Ionicons name="chevron-forward" size={18} color="#F8FAFC" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Cards Row */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, CardStyles.glassBorder]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: StatusColors.successBg }]}>
              <Ionicons name="trending-up" size={16} color={StatusColors.success} />
            </View>
            <Text style={styles.kpiLabel}>Revenue</Text>
            <Text style={[styles.kpiNumber, { color: '#10B981' }]}>
              ₹{(summary.totalRevenue / 1000).toFixed(0)}K
            </Text>
          </View>

          <View style={[styles.kpiCard, CardStyles.glassBorder]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: StatusColors.errorBg }]}>
              <Ionicons name="trending-down" size={16} color={StatusColors.error} />
            </View>
            <Text style={styles.kpiLabel}>Expenses</Text>
            <Text style={[styles.kpiNumber, { color: '#F43F5E' }]}>
              ₹{(summary.totalExpenses / 1000).toFixed(0)}K
            </Text>
          </View>

          <View style={[styles.kpiCard, CardStyles.glassBorder]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: StatusColors.infoBg }]}>
              <Ionicons name="wallet-outline" size={16} color={StatusColors.info} />
            </View>
            <Text style={styles.kpiLabel}>Net Profit</Text>
            <Text style={[styles.kpiNumber, { color: '#38BDF8' }]}>
              ₹{(summary.netProfit / 1000).toFixed(0)}K
            </Text>
          </View>
        </View>

        {/* 6-Month Revenue Bar Chart */}
        <View style={[styles.card, CardStyles.glassBorder]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>6-Month Revenue Trend</Text>
            <Text style={styles.cardSubtitle}>₹ in Thousands</Text>
          </View>

          <View style={styles.chartContainer}>
            {trendData.map((item, index) => {
              const isCurrent = index === trendData.length - 1;
              return (
                <View key={item.month} style={styles.chartCol}>
                  <Text style={[styles.barVal, isCurrent && { color: '#FF6B6B', fontWeight: '700' }]}>
                    {item.revenue}k
                  </Text>
                  <View style={styles.barTrack}>
                    <LinearGradient
                      colors={isCurrent ? ['#FF6B6B', '#EE5253'] : ['#38BDF8', '#1E293B']}
                      style={[styles.barBar, { height: `${item.fill}%` }]}
                    />
                  </View>
                  <Text style={[styles.barMonth, isCurrent && { color: '#FF6B6B', fontWeight: '800' }]}>
                    {item.month}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Expense Category Breakdown */}
        <View style={[styles.card, CardStyles.glassBorder]}>
          <Text style={[styles.cardTitle, { marginBottom: Spacing.md }]}>
            Monthly Operating Expenses
          </Text>

          <View style={styles.expenseList}>
            {mockExpenses.map((exp, index) => {
              const barColors = ['#38BDF8', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
              const barColor = barColors[index % barColors.length];

              return (
                <View key={exp.category} style={styles.expenseItem}>
                  <View style={styles.expenseTopRow}>
                    <Text style={styles.expenseCategory}>{exp.category}</Text>
                    <Text style={styles.expenseAmt}>
                      ₹{exp.amount.toLocaleString()} ({exp.percentage}%)
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${exp.percentage}%`,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Export Buttons */}
        <View style={styles.downloadRow}>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => handleDownload('PDF')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#EE5253']}
              style={styles.btnGradient}
            >
              <Ionicons name="document-text-outline" size={17} color="#FFF" />
              <Text style={styles.downloadBtnText}>Export PDF Statement</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.downloadBtn, { backgroundColor: '#111A2E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]}
            onPress={() => handleDownload('Excel')}
          >
            <View style={styles.btnContent}>
              <Ionicons name="grid-outline" size={17} color="#38BDF8" />
              <Text style={[styles.downloadBtnText, { color: '#38BDF8' }]}>Export Excel</Text>
            </View>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#090D16',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  exportHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthSelectorSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: '#090D16',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radii.full,
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
  },
  arrowBtn: {
    padding: 4,
  },
  monthText: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: FontSizes.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 110,
    gap: Spacing.md,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.md,
    alignItems: 'center',
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  kpiNumber: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: Spacing.sm,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barVal: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
  },
  barTrack: {
    width: 22,
    height: 90,
    borderRadius: Radii.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  barBar: {
    width: '100%',
    borderRadius: Radii.xs,
  },
  barMonth: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 6,
  },
  expenseList: {
    gap: Spacing.md,
  },
  expenseItem: {
    gap: 4,
  },
  expenseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseCategory: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  expenseAmt: {
    fontSize: FontSizes.xs,
    color: '#94A3B8',
  },
  progressTrack: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2.5,
  },
  downloadRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  downloadBtn: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 8,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 8,
  },
  downloadBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: FontSizes.xs,
    letterSpacing: 0.3,
  },
});
