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
import { mockProperties, mockTenants, Tenant } from '@/constants/MockData';

export default function TenantCheckinScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(mockProperties[0].id);
  const [roomNumber, setRoomNumber] = useState('101');
  const [bedLabel, setBedLabel] = useState('B');
  const [monthlyRent, setMonthlyRent] = useState('11000');
  const [securityDeposit, setSecurityDeposit] = useState('22000');
  const [rentDueDay, setRentDueDay] = useState('5');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isAadhaarUploaded, setIsAadhaarUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProperty = mockProperties.find(p => p.id === selectedPropertyId) || mockProperties[0];

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter resident full name.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Required Field', 'Please enter resident phone number.');
      return;
    }

    setIsSubmitting(true);

    const newTenant: Tenant = {
      id: String(Date.now()),
      name: name.trim(),
      phone: phone.trim(),
      room: roomNumber,
      bed: bedLabel,
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      monthlyRent: parseInt(monthlyRent, 10) || 10000,
      securityDeposit: parseInt(securityDeposit, 10) || 20000,
      checkInDate: new Date().toISOString().split('T')[0],
      rentDueDay: parseInt(rentDueDay, 10) || 5,
      rentStatus: 'paid',
      aadhaarNumber: aadhaarNumber || '5821-4920-1928',
    };

    mockTenants.unshift(newTenant);

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Onboarding Successful! 🎉',
        `${name} has been checked into Room ${roomNumber} (Bed ${bedLabel}) at ${selectedProperty.name}. Welcome WhatsApp drafted.`,
        [
          {
            text: 'View Resident Profile',
            onPress: () => router.replace(`/tenant/${newTenant.id}`),
          },
          {
            text: 'Tenants Directory',
            onPress: () => router.back(),
          },
        ]
      );
    }, 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Resident Onboarding</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Personal Profile */}
        <View style={[styles.formCard, CardStyles.glassBorder]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-circle-outline" size={18} color="#FF6B6B" />
            <Text style={styles.sectionHeading}>Personal Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Legal Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Aryan Sharma"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Mobile Phone *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Emergency Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 99999 88888"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="resident@email.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Section 2: Property & Bed Selection */}
        <View style={[styles.formCard, CardStyles.glassBorder]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="business-outline" size={18} color="#38BDF8" />
            <Text style={styles.sectionHeading}>Bed Allocation</Text>
          </View>

          <Text style={styles.inputLabel}>Select Property</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.propSelector}>
            {mockProperties.map((p) => {
              const isSelected = selectedPropertyId === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.propOption,
                    isSelected ? styles.propOptionActive : styles.propOptionInactive,
                  ]}
                  onPress={() => setSelectedPropertyId(p.id)}
                >
                  <Text style={[styles.propOptionText, isSelected && { color: '#FFF', fontWeight: '800' }]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Room Number</Text>
              <TextInput
                style={styles.input}
                placeholder="101"
                placeholderTextColor="#64748B"
                value={roomNumber}
                onChangeText={setRoomNumber}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Bed Slot (A / B / C)</Text>
              <TextInput
                style={styles.input}
                placeholder="A"
                placeholderTextColor="#64748B"
                value={bedLabel}
                onChangeText={setBedLabel}
              />
            </View>
          </View>
        </View>

        {/* Section 3: Financial Terms */}
        <View style={[styles.formCard, CardStyles.glassBorder]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="cash-outline" size={18} color="#10B981" />
            <Text style={styles.sectionHeading}>Rent & Security Deposit</Text>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Monthly Rent (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={monthlyRent}
                onChangeText={setMonthlyRent}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Deposit (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={securityDeposit}
                onChangeText={setSecurityDeposit}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rent Due Day (1 - 31)</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={rentDueDay}
              onChangeText={setRentDueDay}
            />
          </View>
        </View>

        {/* Section 4: Digital KYC */}
        <View style={[styles.formCard, CardStyles.glassBorder]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#8B5CF6" />
            <Text style={styles.sectionHeading}>Digital KYC & Aadhaar</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Aadhaar Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="XXXX-XXXX-XXXX"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={aadhaarNumber}
              onChangeText={setAadhaarNumber}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.uploadBox,
              isAadhaarUploaded && styles.uploadBoxSuccess,
            ]}
            onPress={() => {
              setIsAadhaarUploaded(true);
              Alert.alert('Aadhaar Scanned', 'Aadhaar front & back verification documents captured.');
            }}
          >
            <Ionicons
              name={isAadhaarUploaded ? 'checkmark-circle' : 'camera-outline'}
              size={26}
              color={isAadhaarUploaded ? '#10B981' : '#8B5CF6'}
            />
            <Text style={styles.uploadText}>
              {isAadhaarUploaded ? 'Aadhaar Verified & Attached ✅' : 'Scan / Upload Aadhaar Card Photos'}
            </Text>
            <Text style={styles.uploadSub}>Instant OCR verification enabled</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Action */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#FF6B6B', '#EE5253']}
            style={styles.submitGradient}
          >
            <Ionicons name="checkmark-done" size={20} color="#FFF" />
            <Text style={styles.submitText}>
              {isSubmitting ? 'Onboarding Resident...' : 'Complete Resident Check-In'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: '#F8FAFC',
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
  formCard: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionHeading: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: FontSizes.sm,
    color: '#F8FAFC',
  },
  propSelector: {
    marginBottom: Spacing.md,
  },
  propOption: {
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  propOptionActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  propOptionInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  propOptionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
  },
  uploadBoxSuccess: {
    borderColor: 'rgba(16, 185, 129, 0.5)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  uploadText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
  },
  uploadSub: {
    fontSize: 10,
    color: '#64748B',
  },
  submitBtn: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  submitText: {
    color: '#FFF',
    fontSize: FontSizes.sm,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
