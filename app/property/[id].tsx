import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { Brand, StatusColors } from '@/constants/Colors';
import { Spacing, Radii, FontSizes, CardStyles } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { mockProperties, Bed } from '@/constants/MockData';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const property = mockProperties.find(p => p.id === id) || mockProperties[0];
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);
  const [selectedBed, setSelectedBed] = useState<{ bed: Bed; roomNumber: string } | null>(null);

  const currentFloor = property.floors[selectedFloorIndex] || property.floors[0];

  const getBedStatusColor = (status: Bed['status']) => {
    switch (status) {
      case 'occupied': return '#10B981';
      case 'due': return '#F59E0B';
      case 'vacant': return '#64748B';
      case 'booked': return '#38BDF8';
      default: return '#64748B';
    }
  };

  const getBedStatusBg = (status: Bed['status']) => {
    switch (status) {
      case 'occupied': return 'rgba(16, 185, 129, 0.12)';
      case 'due': return 'rgba(245, 158, 11, 0.14)';
      case 'vacant': return 'rgba(255, 255, 255, 0.04)';
      case 'booked': return 'rgba(56, 189, 248, 0.14)';
      default: return 'rgba(255, 255, 255, 0.04)';
    }
  };

  const totalBeds = property.totalBeds;
  const occupiedBeds = property.occupiedBeds;
  const vacantBeds = totalBeds - occupiedBeds;
  const occupancyPct = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>{property.name}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            <Ionicons name="location-outline" size={11} color="#64748B" /> {property.address}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={() => router.push('/tenant/checkin')}
        >
          <Ionicons name="person-add" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Summary KPI Strip */}
      <View style={styles.kpiContainer}>
        <View style={[styles.kpiCard, CardStyles.glassBorder]}>
          <View style={styles.kpiPill}>
            <Text style={styles.kpiValue}>{property.totalBeds}</Text>
            <Text style={styles.kpiLabel}>Total Beds</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiPill}>
            <Text style={[styles.kpiValue, { color: '#34D399' }]}>{property.occupiedBeds}</Text>
            <Text style={styles.kpiLabel}>Occupied</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiPill}>
            <Text style={[styles.kpiValue, { color: '#94A3B8' }]}>{vacantBeds}</Text>
            <Text style={styles.kpiLabel}>Vacant</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiPill}>
            <Text style={[styles.kpiValue, { color: '#FF6B6B' }]}>{occupancyPct}%</Text>
            <Text style={styles.kpiLabel}>Occupancy</Text>
          </View>
        </View>
      </View>

      {/* Floor Navigation Segment */}
      <View style={styles.floorsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.floorsScroll}>
          {property.floors.map((floor, idx) => {
            const isSelected = selectedFloorIndex === idx;
            return (
              <TouchableOpacity
                key={floor.id}
                onPress={() => setSelectedFloorIndex(idx)}
                style={[
                  styles.floorTab,
                  isSelected ? styles.floorTabActive : styles.floorTabInactive,
                ]}
              >
                <Ionicons
                  name="layers-outline"
                  size={13}
                  color={isSelected ? '#FFF' : '#94A3B8'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.floorTabText,
                    { color: isSelected ? '#FFF' : '#94A3B8' },
                  ]}
                >
                  {floor.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Modern Status Legend */}
      <View style={styles.legendBar}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Rent Due</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#64748B' }]} />
          <Text style={styles.legendText}>Vacant</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]} />
          <Text style={styles.legendText}>Booked</Text>
        </View>
      </View>

      {/* Rooms & Beds Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.roomsGrid}>
          {currentFloor?.rooms.map((room) => {
            return (
              <View
                key={room.id}
                style={[styles.roomCard, CardStyles.glassBorder]}
              >
                <View style={styles.roomHeader}>
                  <View style={styles.roomBadge}>
                    <Text style={styles.roomNumber}>Room {room.number}</Text>
                  </View>
                  <Text style={styles.roomType}>{room.sharingType}-Sharing</Text>
                </View>

                {/* Bed list in room */}
                <View style={styles.bedsContainer}>
                  {room.beds.map((bed) => {
                    const statusColor = getBedStatusColor(bed.status);
                    const statusBg = getBedStatusBg(bed.status);

                    return (
                      <TouchableOpacity
                        key={bed.id}
                        style={[
                          styles.bedChip,
                          {
                            backgroundColor: statusBg,
                            borderColor: statusColor + '50',
                          },
                        ]}
                        activeOpacity={0.75}
                        onPress={() => setSelectedBed({ bed, roomNumber: room.number })}
                      >
                        <View style={[styles.bedIconBadge, { backgroundColor: statusColor }]}>
                          <Ionicons name="bed" size={11} color="#FFF" />
                        </View>
                        <View style={styles.bedInfoCol}>
                          <Text style={styles.bedLabel}>Bed {bed.label}</Text>
                          <Text
                            style={[
                              styles.bedTenantName,
                              { color: bed.status === 'vacant' ? '#64748B' : '#CBD5E1' },
                            ]}
                            numberOfLines={1}
                          >
                            {bed.tenantName || 'Vacant Available'}
                          </Text>
                        </View>
                        {bed.tenantInitials ? (
                          <View style={[styles.initialsBadge, { backgroundColor: statusColor }]}>
                            <Text style={styles.initialsText}>{bed.tenantInitials}</Text>
                          </View>
                        ) : (
                          <View style={styles.assignBadge}>
                            <Text style={styles.assignBadgeText}>+ Assign</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bed Detail Bottom Modal */}
      <Modal
        visible={!!selectedBed}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBed(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSelectedBed(null)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {selectedBed && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>
                      Room {selectedBed.roomNumber} • Bed {selectedBed.bed.label}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      {property.name} • {currentFloor.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modalStatusPill,
                      { backgroundColor: getBedStatusBg(selectedBed.bed.status) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalStatusText,
                        { color: getBedStatusColor(selectedBed.bed.status) },
                      ]}
                    >
                      {selectedBed.bed.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {selectedBed.bed.tenantName ? (
                  <View style={styles.modalTenantDetails}>
                    <View style={styles.tenantInfoRow}>
                      <LinearGradient
                        colors={['#FF6B6B', '#F59E0B']}
                        style={styles.tenantAvatar}
                      >
                        <Text style={styles.tenantAvatarText}>
                          {selectedBed.bed.tenantInitials || 'T'}
                        </Text>
                      </LinearGradient>
                      <View>
                        <Text style={styles.modalTenantName}>
                          {selectedBed.bed.tenantName}
                        </Text>
                        <Text style={styles.modalTenantMeta}>
                          Resident Occupant • Verified KYC
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalActionButtons}>
                      <TouchableOpacity
                        style={[styles.modalActionBtn, { backgroundColor: '#25D366' }]}
                        onPress={() => {
                          setSelectedBed(null);
                          Alert.alert('WhatsApp', `Opening WhatsApp for ${selectedBed.bed.tenantName}`);
                        }}
                      >
                        <Ionicons name="logo-whatsapp" size={17} color="#FFF" />
                        <Text style={styles.modalActionBtnText}>WhatsApp</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalActionBtn, { backgroundColor: '#38BDF8' }]}
                        onPress={() => {
                          setSelectedBed(null);
                          Alert.alert('Call Resident', `Calling ${selectedBed.bed.tenantName}`);
                        }}
                      >
                        <Ionicons name="call" size={17} color="#FFF" />
                        <Text style={styles.modalActionBtnText}>Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalActionBtn, { backgroundColor: '#FF6B6B' }]}
                        onPress={() => {
                          setSelectedBed(null);
                          router.push('/invoice');
                        }}
                      >
                        <Ionicons name="receipt" size={17} color="#FFF" />
                        <Text style={styles.modalActionBtnText}>Invoice</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.vacantModalBody}>
                    <Ionicons name="bed-outline" size={44} color="#64748B" />
                    <Text style={styles.vacantTitle}>Vacant Bed Available</Text>
                    <Text style={styles.vacantSubtitle}>
                      This bed is ready for immediate onboarding and resident allocation.
                    </Text>
                    <TouchableOpacity
                      style={styles.checkInCta}
                      onPress={() => {
                        setSelectedBed(null);
                        router.push('/tenant/checkin');
                      }}
                    >
                      <LinearGradient
                        colors={['#FF6B6B', '#EE5253']}
                        style={styles.checkInGradient}
                      >
                        <Ionicons name="person-add" size={16} color="#FFF" />
                        <Text style={styles.checkInCtaText}>Check-In New Resident Here</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
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
    marginRight: Spacing.md,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    marginTop: 1,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  kpiCard: {
    flexDirection: 'row',
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiPill: {
    alignItems: 'center',
    flex: 1,
  },
  kpiValue: {
    color: '#F8FAFC',
    fontSize: FontSizes.md,
    fontWeight: '800',
  },
  kpiLabel: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1,
    fontWeight: '600',
  },
  kpiDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  floorsBar: {
    paddingVertical: Spacing.sm,
  },
  floorsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  floorTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  floorTabActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  floorTabInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  floorTabText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  legendBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#0F1626',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 110, // Clean breathing room for room cards
  },
  roomsGrid: {
    gap: Spacing.md,
  },
  roomCard: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.md,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  roomBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.xs,
  },
  roomNumber: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: FontSizes.xs,
  },
  roomType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  bedsContainer: {
    gap: 6,
  },
  bedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radii.lg,
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  bedIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bedInfoCol: {
    flex: 1,
  },
  bedLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  bedTenantName: {
    fontSize: 10,
    marginTop: 1,
  },
  initialsBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  assignBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radii.xs,
  },
  assignBadgeText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalSheet: {
    backgroundColor: '#111A2E',
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    padding: Spacing.xl,
    paddingBottom: Spacing['3xl'],
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475569',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  modalSubtitle: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    marginTop: 2,
  },
  modalStatusPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  modalStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  modalTenantDetails: {
    gap: Spacing.lg,
  },
  tenantInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tenantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tenantAvatarText: {
    color: '#FFF',
    fontSize: FontSizes.md,
    fontWeight: '800',
  },
  modalTenantName: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  modalTenantMeta: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    marginTop: 1,
  },
  modalActionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radii.lg,
    gap: 6,
  },
  modalActionBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: FontSizes.xs,
  },
  vacantModalBody: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  vacantTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  vacantSubtitle: {
    fontSize: FontSizes.xs,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  checkInCta: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    width: '100%',
  },
  checkInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    gap: 6,
  },
  checkInCtaText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: FontSizes.sm,
  },
});
