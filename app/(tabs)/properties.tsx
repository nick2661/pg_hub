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
import { mockProperties } from '@/constants/MockData';

export default function PropertiesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [searchText, setSearchText] = useState('');

  const filteredProperties = mockProperties.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.pageEyebrow}>PORTFOLIO</Text>
          <Text style={styles.pageTitle}>Properties</Text>
        </View>
        <TouchableOpacity
          style={styles.addPropertyBtn}
          onPress={() => router.push('/tenant/checkin')}
        >
          <LinearGradient
            colors={['#FF6B6B', '#EE5253']}
            style={styles.addPropertyGradient}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addPropertyText}>Add New</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modern Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by property or location..."
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
      </View>

      {/* Properties List with Generous Bottom Padding */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.propertiesList}>
          {filteredProperties.map((property) => {
            const occupancyPct = Math.round((property.occupiedBeds / property.totalBeds) * 100);
            const vacantBeds = property.totalBeds - property.occupiedBeds;
            const isHigh = occupancyPct > 80;

            return (
              <TouchableOpacity
                key={property.id}
                style={[styles.propertyCard, CardStyles.glassBorder]}
                activeOpacity={0.88}
                onPress={() => router.push(`/property/${property.id}`)}
              >
                <LinearGradient
                  colors={['#17233B', '#111A2E']}
                  style={styles.cardGradient}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.propIconBox}>
                      <Ionicons name="business" size={20} color={Brand.coral} />
                    </View>
                    <View style={styles.propInfoCol}>
                      <Text style={styles.propName}>{property.name}</Text>
                      <Text style={styles.propAddress}>
                        <Ionicons name="location-outline" size={12} color="#64748B" /> {property.address}
                      </Text>
                    </View>
                    <View style={styles.chevronPill}>
                      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                    </View>
                  </View>

                  {/* Occupancy Indicator Bar */}
                  <View style={styles.occupancyBarContainer}>
                    <View style={styles.occupancyLabelRow}>
                      <View style={styles.occupancyLiveRow}>
                        <View style={[styles.statusDot, { backgroundColor: isHigh ? StatusColors.success : StatusColors.warning }]} />
                        <Text style={styles.occupancyLabel}>Occupancy Rate</Text>
                      </View>
                      <Text style={[styles.occupancyPercentText, { color: isHigh ? '#34D399' : '#FBBF24' }]}>
                        {occupancyPct}%
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <LinearGradient
                        colors={isHigh ? ['#10B981', '#34D399'] : ['#F59E0B', '#FBBF24']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${occupancyPct}%` }]}
                      />
                    </View>
                  </View>

                  {/* Micro Metric Pills */}
                  <View style={styles.metricsRow}>
                    <View style={styles.metricPill}>
                      <Ionicons name="bed-outline" size={14} color="#38BDF8" />
                      <Text style={styles.metricText}>
                        <Text style={{ color: '#F8FAFC', fontWeight: '700' }}>{property.occupiedBeds}</Text>/{property.totalBeds} Beds
                      </Text>
                    </View>

                    <View style={styles.metricPill}>
                      <Ionicons name="layers-outline" size={14} color="#8B5CF6" />
                      <Text style={styles.metricText}>
                        {property.floors.length} Floors
                      </Text>
                    </View>

                    <View style={[styles.metricPill, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                      <Ionicons name="trending-up" size={14} color="#10B981" />
                      <Text style={[styles.metricText, { color: '#10B981', fontWeight: '700' }]}>
                        {formatCurrency(property.monthlyRevenue)}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {filteredProperties.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={44} color="#475569" />
              <Text style={styles.emptyTitle}>No properties found</Text>
              <Text style={styles.emptySub}>Try searching with a different name or location.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button (Cleanly elevated above bottom tab bar) */}
      <TouchableOpacity
        style={styles.floatingFab}
        onPress={() => router.push('/tenant/checkin')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#FF6B6B', '#EE5253']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.fabLabel}>Add Tenant</Text>
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
  addPropertyBtn: {
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  addPropertyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 4,
  },
  addPropertyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
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
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: FontSizes.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 140, // Prevents tab bar overlaying
  },
  propertiesList: {
    gap: Spacing.md,
  },
  propertyCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  propIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propInfoCol: {
    flex: 1,
  },
  propName: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  propAddress: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    marginTop: 2,
  },
  chevronPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  occupancyBarContainer: {
    marginBottom: Spacing.md,
  },
  occupancyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  occupancyLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  occupancyLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  occupancyPercentText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.sm,
    gap: 6,
  },
  metricText: {
    fontSize: 11,
    color: '#94A3B8',
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
  fabLabel: {
    color: '#FFF',
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
