import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { Brand, StatusColors } from '@/constants/Colors';
import { Spacing, Radii, FontSizes, CardStyles } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { mockTenants } from '@/constants/MockData';

type FilterType = 'all' | 'active' | 'due' | 'checked_out';

export default function TenantsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Residents' },
    { key: 'active', label: 'Paid' },
    { key: 'due', label: 'Dues Pending' },
    { key: 'checked_out', label: 'Checked Out' },
  ];

  const filteredTenants = mockTenants.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchText.toLowerCase()) ||
      t.room.includes(searchText) ||
      t.phone.includes(searchText) ||
      t.propertyName.toLowerCase().includes(searchText.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case 'active': return t.rentStatus === 'paid';
      case 'due': return t.rentStatus === 'due' || t.rentStatus === 'pending' || t.rentStatus === 'overdue';
      default: return true;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'Paid', bg: StatusColors.successBg, color: StatusColors.success, dot: '#10B981' };
      case 'pending':
        return { text: 'Due Soon', bg: StatusColors.warningBg, color: StatusColors.warning, dot: '#F59E0B' };
      case 'due':
      case 'overdue':
        return { text: 'Overdue', bg: StatusColors.errorBg, color: StatusColors.error, dot: '#F43F5E' };
      default:
        return { text: status, bg: 'rgba(255,255,255,0.06)', color: '#94A3B8', dot: '#94A3B8' };
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const avatarGradients: [string, string][] = [
    ['#3B82F6', '#1D4ED8'],
    ['#EF4444', '#B91C1C'],
    ['#10B981', '#047857'],
    ['#F59E0B', '#B45309'],
    ['#8B5CF6', '#6D28D9'],
    ['#EC4899', '#BE185D'],
    ['#14B8A6', '#0F766E'],
    ['#F97316', '#C2410C'],
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.pageEyebrow}>DIRECTORY</Text>
          <Text style={styles.pageTitle}>Tenants</Text>
        </View>
        <TouchableOpacity
          style={styles.onboardBtn}
          onPress={() => router.push('/tenant/checkin')}
        >
          <LinearGradient
            colors={['#FF6B6B', '#EE5253']}
            style={styles.onboardGradient}
          >
            <Ionicons name="person-add" size={16} color="#FFF" />
            <Text style={styles.onboardText}>Check-In</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, room, or phone..."
            placeholderTextColor="#64748B"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive,
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive ? { color: '#F8FAFC', fontWeight: '800' } : { color: '#94A3B8' },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tenant Cards List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tenantList}>
          {filteredTenants.map((tenant, index) => {
            const badge = getStatusBadge(tenant.rentStatus);
            const gradientPair = avatarGradients[index % avatarGradients.length];

            return (
              <TouchableOpacity
                key={tenant.id}
                style={[styles.tenantCard, CardStyles.glassBorder]}
                activeOpacity={0.88}
                onPress={() => router.push(`/tenant/${tenant.id}`)}
              >
                <LinearGradient
                  colors={['#172238', '#111A2E']}
                  style={styles.cardGradient}
                >
                  {/* Avatar with Gradient */}
                  <View style={styles.avatarWrap}>
                    <LinearGradient
                      colors={gradientPair}
                      style={styles.avatarGradient}
                    >
                      <Text style={styles.avatarText}>{getInitials(tenant.name)}</Text>
                    </LinearGradient>
                  </View>

                  {/* Tenant Details */}
                  <View style={styles.tenantInfoCol}>
                    <View style={styles.tenantTopLine}>
                      <Text style={styles.tenantName} numberOfLines={1}>{tenant.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
                        <Text style={[styles.statusText, { color: badge.color }]}>{badge.text}</Text>
                      </View>
                    </View>

                    <Text style={styles.tenantRoomBed}>
                      Room {tenant.room} <Text style={{ color: '#475569' }}>•</Text> Bed {tenant.bed} <Text style={{ color: '#475569' }}>•</Text> {tenant.propertyName}
                    </Text>

                    <View style={styles.tenantBottomMeta}>
                      <Text style={styles.tenantRentAmt}>
                        ₹{tenant.monthlyRent.toLocaleString('en-IN')}<Text style={styles.perMo}>/mo</Text>
                      </Text>
                      <Text style={styles.dueDayText}>Due {tenant.rentDueDay}th</Text>
                    </View>
                  </View>

                  {/* Quick Action Buttons */}
                  <View style={styles.quickActionCol}>
                    <TouchableOpacity
                      style={styles.quickCircleBtn}
                      onPress={() => Alert.alert('Direct Call', `Dialing ${tenant.name} (${tenant.phone})...`)}
                    >
                      <Ionicons name="call-outline" size={16} color="#38BDF8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickCircleBtn, { backgroundColor: 'rgba(37, 211, 102, 0.12)' }]}
                      onPress={() => Alert.alert('WhatsApp Reminder', `Opening WhatsApp conversation with ${tenant.name} for payment collection.`)}
                    >
                      <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {filteredTenants.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={44} color="#475569" />
              <Text style={styles.emptyTitle}>No residents found</Text>
              <Text style={styles.emptySub}>Try searching with another keyword or filter.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingFab}
        onPress={() => router.push('/tenant/checkin')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#FF6B6B', '#EE5253']}
          style={styles.fabGradient}
        >
          <Ionicons name="person-add" size={20} color="#FFF" />
          <Text style={styles.fabText}>New Resident</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  onboardBtn: {
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  onboardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 4,
  },
  onboardText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: '#090D16',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing.md,
    height: 42,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: FontSizes.sm,
  },
  filterScroll: {
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterChipInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 140, // Prevents tab bar overlay
  },
  tenantList: {
    gap: Spacing.md,
  },
  tenantCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: FontSizes.md,
    fontWeight: '800',
  },
  tenantInfoCol: {
    flex: 1,
  },
  tenantTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  tenantName: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
    flex: 1,
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
  tenantRoomBed: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    marginBottom: 4,
  },
  tenantBottomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tenantRentAmt: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  perMo: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '400',
  },
  dueDayText: {
    fontSize: 10,
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    fontWeight: '600',
  },
  quickActionCol: {
    gap: Spacing.xs,
  },
  quickCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 6,
  },
  emptyTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: Spacing.sm,
  },
  emptySub: {
    fontSize: FontSizes.xs,
    color: '#64748B',
  },
  floatingFab: {
    position: 'absolute',
    bottom: 86,
    right: 20,
    borderRadius: Radii.full,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 99,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  fabText: {
    color: '#FFF',
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
