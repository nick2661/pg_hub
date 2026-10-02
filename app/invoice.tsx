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
import { mockTenants } from '@/constants/MockData';

export default function InvoiceScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [selectedTenantIndex, setSelectedTenantIndex] = useState(0);
  const tenant = mockTenants[selectedTenantIndex] || mockTenants[0];

  const baseRent = tenant.monthlyRent;
  const electricity = 850;
  const maintenance = 500;
  const grandTotal = baseRent + electricity + maintenance;
  const invoiceNumber = `INV-2025-${String(selectedTenantIndex + 42).padStart(4, '0')}`;

  const handleShare = (channel: 'whatsapp' | 'download' | 'share') => {
    if (channel === 'whatsapp') {
      Alert.alert(
        'WhatsApp Invoice Sent',
        `Official digital receipt for ₹${grandTotal.toLocaleString()} dispatched to ${tenant.name} (${tenant.phone}).`,
        [{ text: 'Great' }]
      );
    } else if (channel === 'download') {
      Alert.alert('Download Complete', `Tax-compliant PDF for ${invoiceNumber} saved to downloads folder.`, [{ text: 'Open PDF' }]);
    } else {
      Alert.alert('Share Link Copied', `Direct payment & receipt link: https://pghub.live/i/${invoiceNumber.toLowerCase()}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#090D16' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Modern Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Digital Tax Invoice</Text>
          <Text style={styles.headerSubtitle}>{invoiceNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.headerShareBtn}
          onPress={() => handleShare('share')}
          activeOpacity={0.7}
        >
          <Ionicons name="share-social-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Resident Horizontal Switcher */}
      <View style={styles.switcherSection}>
        <Text style={styles.switcherLabel}>SELECT RESIDENT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tenantScroll}>
          {mockTenants.map((t, idx) => {
            const isSelected = selectedTenantIndex === idx;
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.tenantPill,
                  isSelected ? styles.tenantPillActive : styles.tenantPillInactive,
                ]}
                onPress={() => setSelectedTenantIndex(idx)}
                activeOpacity={0.7}
              >
                <View style={[styles.tenantPillDot, { backgroundColor: isSelected ? '#FF6B6B' : '#64748B' }]} />
                <Text style={[styles.tenantPillText, isSelected && styles.tenantPillTextActive]}>
                  {t.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Luxury Glass Invoice Card */}
        <View style={[styles.invoiceCard, CardStyles.glassBorder]}>
          {/* Top Brand Banner inside Receipt */}
          <View style={styles.receiptTop}>
            <View>
              <View style={styles.brandRow}>
                <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.brandBadge}>
                  <Ionicons name="home" size={14} color="#FFF" />
                </LinearGradient>
                <Text style={styles.brandName}>PG HUB</Text>
                <View style={styles.proTag}>
                  <Text style={styles.proTagText}>TAX INVOICE</Text>
                </View>
              </View>
              <Text style={styles.propertyOwnerSub}>{tenant.propertyName}</Text>
              <Text style={styles.propertyAddr}>HSR Layout Sector 4, Bangalore, KA - 560102</Text>
            </View>

            <View style={styles.invoiceMetaCol}>
              <View style={styles.statusVerifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text style={styles.statusVerifiedText}>ISSUED</Text>
              </View>
              <Text style={styles.invDateText}>Date: 01 Oct 2025</Text>
              <Text style={styles.invDueDateText}>Due: 05 Oct 2025</Text>
            </View>
          </View>

          {/* Perforated Divider */}
          <View style={styles.perforatedRow}>
            <View style={styles.cutoutLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.cutoutRight} />
          </View>

          {/* Bill To Section */}
          <View style={styles.billToSection}>
            <Text style={styles.sectionHeading}>BILLED TO RESIDENT</Text>
            <View style={styles.residentRow}>
              <View style={styles.residentAvatar}>
                <Text style={styles.residentAvatarText}>
                  {tenant.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.billToName}>{tenant.name}</Text>
                <Text style={styles.billToMeta}>
                  Room {tenant.room} • Bed {tenant.bed} • {tenant.phone}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.itemDivider} />

          {/* Line Items Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.thDescription}>ITEM DESCRIPTION</Text>
              <Text style={styles.thAmount}>AMOUNT (INR)</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.itemInfoCol}>
                <Text style={styles.itemTitle}>Monthly Room Occupancy</Text>
                <Text style={styles.itemSub}>October 2025 Standard Cycle</Text>
              </View>
              <Text style={styles.itemAmount}>₹{baseRent.toLocaleString()}</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.itemInfoCol}>
                <Text style={styles.itemTitle}>Sub-Meter Electricity</Text>
                <Text style={styles.itemSub}>Meter units: 42 kWh @ ₹20/unit</Text>
              </View>
              <Text style={styles.itemAmount}>₹{electricity.toLocaleString()}</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.itemInfoCol}>
                <Text style={styles.itemTitle}>High-Speed WiFi & Maintenance</Text>
                <Text style={styles.itemSub}>300 Mbps unlimited fiber + weekly deep cleaning</Text>
              </View>
              <Text style={styles.itemAmount}>₹{maintenance.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.itemDivider} />

          {/* Total Row */}
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
              <Text style={styles.totalTaxNote}>Includes all applicable building charges</Text>
            </View>
            <Text style={styles.totalAmount}>₹{grandTotal.toLocaleString()}</Text>
          </View>

          {/* Payment Method / QR Note */}
          <View style={styles.paymentMethodCard}>
            <View style={styles.qrIconWrap}>
              <Ionicons name="qr-code-outline" size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payMethodTitle}>Instant UPI Auto-Reconciliation</Text>
              <Text style={styles.payMethodSub}>UPI ID: pghub@okhdfcbank • PhonePe / GPay / Paytm</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.btnWhatsapp}
            onPress={() => handleShare('whatsapp')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
              <Text style={styles.btnActionText}>Send PDF via WhatsApp</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDownload}
            onPress={() => handleShare('download')}
            activeOpacity={0.8}
          >
            <View style={styles.btnDownloadInner}>
              <Ionicons name="cloud-download-outline" size={18} color="#CBD5E1" />
              <Text style={styles.btnDownloadText}>Save Tax PDF to Storage</Text>
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
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 52,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#090D16',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  headerShareBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
  },
  switcherSection: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#0B111E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  switcherLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  tenantScroll: {
    gap: Spacing.xs,
    paddingBottom: 2,
  },
  tenantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
    borderWidth: 1,
    gap: 6,
  },
  tenantPillActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.14)',
    borderColor: '#FF6B6B',
  },
  tenantPillInactive: {
    backgroundColor: '#111A2E',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tenantPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tenantPillText: {
    color: '#94A3B8',
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  tenantPillTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 130, // Prevents overlay when scrolling
    gap: Spacing.lg,
  },
  invoiceCard: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  receiptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  brandBadge: {
    width: 26,
    height: 26,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: FontSizes.md,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  proTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  propertyOwnerSub: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  propertyAddr: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  invoiceMetaCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusVerifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  invDateText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  invDueDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  perforatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    marginHorizontal: -Spacing.lg,
  },
  cutoutLeft: {
    width: 14,
    height: 24,
    backgroundColor: '#090D16',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderStyle: 'dashed',
  },
  cutoutRight: {
    width: 14,
    height: 24,
    backgroundColor: '#090D16',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  billToSection: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  residentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  residentAvatar: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  residentAvatarText: {
    color: '#FF6B6B',
    fontSize: FontSizes.xs,
    fontWeight: '800',
  },
  billToName: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  billToMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: Spacing.md,
  },
  table: {
    gap: Spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  thDescription: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  thAmount: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfoCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  itemTitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  itemSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  totalTaxNote: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 2,
  },
  totalAmount: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: '#10B981',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  qrIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  payMethodTitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  payMethodSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  actionButtons: {
    gap: Spacing.sm,
  },
  btnWhatsapp: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  btnActionText: {
    color: '#FFF',
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnDownload: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#111A2E',
  },
  btnDownloadInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  btnDownloadText: {
    color: '#CBD5E1',
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
});
