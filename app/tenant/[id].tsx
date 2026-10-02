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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { Brand, StatusColors } from '@/constants/Colors';
import { Spacing, Radii, FontSizes, CardStyles } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { mockTenants, mockPayments } from '@/constants/MockData';

export default function TenantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const tenant = mockTenants.find(t => t.id === id) || mockTenants[0];
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const tenantPayments = mockPayments.filter(p => p.tenantName.toLowerCase() === tenant.name.toLowerCase());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'Rent Paid', bg: StatusColors.successBg, color: StatusColors.success, dot: '#10B981' };
      case 'pending':
        return { text: 'Due Soon', bg: StatusColors.warningBg, color: StatusColors.warning, dot: '#F59E0B' };
      case 'due':
      case 'overdue':
        return { text: 'Overdue', bg: StatusColors.errorBg, color: StatusColors.error, dot: '#F43F5E' };
      default:
        return { text: status, bg: 'rgba(255,255,255,0.06)', color: '#94A3B8', dot: '#94A3B8' };
    }
  };

  const statusBadge = getStatusBadge(tenant.rentStatus);

  const handleCheckout = () => {
    Alert.alert(
      'Resident Check-Out',
      `Are you sure you want to mark ${tenant.name} as checked out? Security deposit of ₹${tenant.securityDeposit.toLocaleString()} will be scheduled for refund.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Check-Out',
          style: 'destructive',
          onPress: () => {
            setIsCheckedOut(true);
            Alert.alert('Checked Out', `${tenant.name} is now marked as checked out. Bed ${tenant.bed} is vacant.`);
          },
        },
      ]
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
        <Text style={styles.headerTitle}>Resident Profile</Text>
        <TouchableOpacity style={styles.invoiceHeaderBtn} onPress={() => router.push('/invoice')}>
          <Ionicons name="receipt-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Identity Card */}
        <View style={[styles.profileCard, CardStyles.glassBorder]}>
          <LinearGradient
            colors={['#17233B', '#111A2E']}
            style={styles.cardGradient}
          >
            <View style={styles.profileRow}>
              <LinearGradient
                colors={['#FF6B6B', '#F59E0B']}
                style={styles.avatarWrap}
              >
                <Text style={styles.avatarText}>
                  {tenant.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </Text>
              </LinearGradient>

              <View style={styles.profileTextCol}>
                <Text style={styles.tenantName}>{tenant.name}</Text>
                <Text style={styles.roomSub}>
                  Room {tenant.room} (Bed {tenant.bed}) • {tenant.propertyName}
                </Text>
                <Text style={styles.phoneSub}>{tenant.phone}</Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: statusBadge.dot }]} />
                <Text style={[styles.statusText, { color: statusBadge.color }]}>
                  {isCheckedOut ? 'Checked Out' : statusBadge.text}
                </Text>
              </View>
            </View>

            {/* Quick Action Pill Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionPillBtn, { backgroundColor: 'rgba(37, 211, 102, 0.12)' }]}
                onPress={() => Alert.alert('WhatsApp', `Opening WhatsApp for ${tenant.name}`)}
              >
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                <Text style={[styles.actionPillText, { color: '#25D366' }]}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionPillBtn, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}
                onPress={() => Alert.alert('Call', `Dialing ${tenant.phone}...`)}
              >
                <Ionicons name="call" size={16} color="#38BDF8" />
                <Text style={[styles.actionPillText, { color: '#38BDF8' }]}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionPillBtn, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}
                onPress={() => router.push('/ai-caller')}
              >
                <Ionicons name="sparkles" size={15} color="#818CF8" />
                <Text style={[styles.actionPillText, { color: '#818CF8' }]}>AI Voice</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Financial Terms Bento */}
        <View style={[styles.card, CardStyles.glassBorder]}>
          <Text style={styles.cardHeading}>Lease & Rent Terms</Text>

          <View style={styles.bentoGrid}>
            <View style={styles.bentoCell}>
              <Text style={styles.cellLabel}>Monthly Rent</Text>
              <Text style={styles.cellValue}>₹{tenant.monthlyRent.toLocaleString()}</Text>
            </View>
            <View style={styles.bentoCell}>
              <Text style={styles.cellLabel}>Security Deposit</Text>
              <Text style={styles.cellValue}>₹{tenant.securityDeposit.toLocaleString()}</Text>
            </View>
            <View style={styles.bentoCell}>
              <Text style={styles.cellLabel}>Rent Due Date</Text>
              <Text style={[styles.cellValue, { color: '#FBBF24' }]}>{tenant.rentDueDay}th of month</Text>
            </View>
            <View style={styles.bentoCell}>
              <Text style={styles.cellLabel}>Occupancy Since</Text>
              <Text style={styles.cellValue}>{tenant.checkInDate}</Text>
            </View>
          </View>
        </View>

        {/* Digital KYC Verification */}
        <View style={[styles.card, CardStyles.glassBorder]}>
          <Text style={styles.cardHeading}>Digital KYC & ID Proof</Text>

          <View style={styles.kycRow}>
            <View style={styles.kycIconBox}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.kycTitle}>Government ID Verified</Text>
              <Text style={styles.kycSub}>Aadhaar: {tenant.aadhaarNumber || '5821-4920-1928'}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Aadhaar Document', 'Previewing encrypted Aadhaar document.')}>
              <Text style={styles.kycAction}>View Proof →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.kycRow}>
            <View style={[styles.kycIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
              <Ionicons name="document-text" size={18} color="#38BDF8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.kycTitle}>11-Month Rental Agreement</Text>
              <Text style={styles.kycSub}>Signed digital e-contract</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Rental Agreement', 'Opening PDF contract.')}>
              <Text style={styles.kycAction}>View PDF →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment History */}
        <View style={[styles.card, CardStyles.glassBorder]}>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.cardHeading}>Payment Timeline</Text>
            <TouchableOpacity onPress={() => router.push('/invoice')}>
              <Text style={styles.viewInvoiceLink}>Generate Invoice →</Text>
            </TouchableOpacity>
          </View>

          {tenantPayments.length > 0 ? (
            tenantPayments.map((p, idx) => (
              <View
                key={p.id}
                style={[styles.paymentItemRow, idx < tenantPayments.length - 1 && styles.itemBorder]}
              >
                <View style={[styles.payDot, { backgroundColor: p.status === 'paid' ? '#10B981' : '#F59E0B' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.payDateText}>{p.date}</Text>
                  <Text style={styles.payMethodSub}>UPI AutoPay • Verified</Text>
                </View>
                <Text style={styles.payAmountText}>₹{p.amount.toLocaleString()}</Text>
              </View>
            ))
          ) : (
            <View style={styles.paymentItemRow}>
              <View style={[styles.payDot, { backgroundColor: '#10B981' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.payDateText}>Oct 5, 2025</Text>
                <Text style={styles.payMethodSub}>PhonePe UPI Instant</Text>
              </View>
              <Text style={styles.payAmountText}>₹{tenant.monthlyRent.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Check-Out / Exit Action */}
        {!isCheckedOut && (
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color="#F43F5E" />
            <Text style={styles.checkoutBtnText}>Check Out Resident & Settle Deposit</Text>
          </TouchableOpacity>
        )}
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
  invoiceHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
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
  profileCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: FontSizes.lg,
    fontWeight: '800',
  },
  profileTextCol: {
    flex: 1,
  },
  tenantName: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  roomSub: {
    fontSize: FontSizes.xs,
    color: '#94A3B8',
    marginTop: 2,
  },
  phoneSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: Radii.md,
    gap: 6,
  },
  actionPillText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
  },
  cardHeading: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: Spacing.md,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.md,
  },
  bentoCell: {
    width: '50%',
  },
  cellLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cellValue: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 4,
  },
  kycIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycTitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  kycSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  kycAction: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: Spacing.md,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewInvoiceLink: {
    fontSize: FontSizes.xs,
    color: '#FF6B6B',
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  paymentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: Spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  payDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  payDateText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  payMethodSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  payAmountText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.25)',
    borderRadius: Radii.xl,
    paddingVertical: 14,
    gap: 8,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  checkoutBtnText: {
    color: '#F43F5E',
    fontSize: FontSizes.xs,
    fontWeight: '800',
  },
});
