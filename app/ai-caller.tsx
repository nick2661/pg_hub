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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { Brand, StatusColors } from '@/constants/Colors';
import { Spacing, Radii, FontSizes, CardStyles } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { mockTenants } from '@/constants/MockData';

interface CallLog {
  id: string;
  tenantName: string;
  room: string;
  phone: string;
  amount: number;
  date: string;
  status: 'Answered' | 'Promised' | 'No Answer' | 'Busy';
  transcript: string;
  language: string;
}

export default function AiCallerScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // Due / Overdue residents
  const dueTenants = mockTenants.filter(t => t.rentStatus === 'due' || t.rentStatus === 'pending' || t.rentStatus === 'overdue');
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>(
    dueTenants.map(t => t.id)
  );

  const [selectedScript, setSelectedScript] = useState<'gentle' | 'formal' | 'urgent'>('gentle');
  const [selectedLanguage, setSelectedLanguage] = useState<'Hindi' | 'English' | 'Kannada' | 'Telugu'>('Hindi');
  const [isCallingModalVisible, setIsCallingModalVisible] = useState(false);
  const [currentCallStep, setCurrentCallStep] = useState(0);

  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      id: 'log1',
      tenantName: 'Meera Reddy',
      room: '201',
      phone: '+91 43210 98765',
      amount: 10000,
      date: 'Yesterday, 5:30 PM',
      status: 'Promised',
      transcript: '"Namaste Meera ji. PG Hub automated assistant calling for Sunshine Living. October rent ₹10,000 is due." -> "Haan kal subah PhonePe se bhej dungi."',
      language: 'Hindi',
    },
    {
      id: 'log2',
      tenantName: 'Vikram Joshi',
      room: '305',
      phone: '+91 32109 87654',
      amount: 15000,
      date: 'Sep 24, 11:15 AM',
      status: 'No Answer',
      transcript: 'Call rang 45s without answer. Auto-fallback: WhatsApp reminder with Razorpay UPI payment link dispatched.',
      language: 'English',
    },
    {
      id: 'log3',
      tenantName: 'Sanya Singh',
      room: '403',
      phone: '+91 65432 10987',
      amount: 9000,
      date: 'Sep 22, 6:45 PM',
      status: 'Answered',
      transcript: '"Payment link received. Will pay right now via GooglePay."',
      language: 'Hindi',
    },
  ]);

  const toggleTenant = (id: string) => {
    if (selectedTenantIds.includes(id)) {
      setSelectedTenantIds(selectedTenantIds.filter(item => item !== id));
    } else {
      setSelectedTenantIds([...selectedTenantIds, id]);
    }
  };

  const startAiCallingSimulation = () => {
    if (selectedTenantIds.length === 0) {
      Alert.alert('No Residents Selected', 'Please select at least one resident to initiate AI reminder calls.');
      return;
    }

    setIsCallingModalVisible(true);
    setCurrentCallStep(1);

    setTimeout(() => {
      setCurrentCallStep(2); // Connected
    }, 1500);

    setTimeout(() => {
      setCurrentCallStep(3); // AI Speaking
    }, 2800);

    setTimeout(() => {
      setCurrentCallStep(4); // Tenant replied
    }, 4500);

    setTimeout(() => {
      setCurrentCallStep(5); // Call confirmed
      const firstTarget = dueTenants.find(t => selectedTenantIds.includes(t.id)) || dueTenants[0];
      setCallLogs(prev => [
        {
          id: `log-${Date.now()}`,
          tenantName: firstTarget.name,
          room: firstTarget.room,
          phone: firstTarget.phone,
          amount: firstTarget.monthlyRent,
          date: 'Just now',
          status: 'Promised',
          transcript: `"Namaste ${firstTarget.name.split(' ')[0]} ji. PG Hub rent reminder for ₹${firstTarget.monthlyRent.toLocaleString()}." -> "Transferring via UPI today evening."`,
          language: selectedLanguage,
        },
        ...prev,
      ]);
    }, 6000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <View style={styles.badgeRow}>
            <Text style={styles.headerTitle}>AI Rent Caller</Text>
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.aiTag}
            >
              <Ionicons name="sparkles" size={10} color="#FFF" />
              <Text style={styles.aiTagText}>FEATURE 23</Text>
            </LinearGradient>
          </View>
          <Text style={styles.headerSubtitle}>Conversational voice recovery bot</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero AI Technology Card */}
        <View style={[styles.aiBannerCard, CardStyles.glassBorder]}>
          <LinearGradient
            colors={['#1F1A3A', '#131126']}
            style={styles.aiBannerGradient}
          >
            <View style={styles.aiWaveformIcon}>
              <Ionicons name="mic" size={22} color="#818CF8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Smart Autonomous Phone Calls</Text>
              <Text style={styles.bannerDesc}>
                Calls residents in regional languages, detects payment commitments, logs call recordings, and sends instant UPI links.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Step 1: Select Due Tenants */}
        <View style={[styles.sectionCard, CardStyles.glassBorder]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Select Residents ({selectedTenantIds.length}/{dueTenants.length})
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (selectedTenantIds.length === dueTenants.length) {
                  setSelectedTenantIds([]);
                } else {
                  setSelectedTenantIds(dueTenants.map(t => t.id));
                }
              }}
            >
              <Text style={styles.selectAllBtn}>
                {selectedTenantIds.length === dueTenants.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tenantList}>
            {dueTenants.map((t) => {
              const isSelected = selectedTenantIds.includes(t.id);
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.tenantRow,
                    isSelected ? styles.tenantRowSelected : styles.tenantRowUnselected,
                  ]}
                  onPress={() => toggleTenant(t.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isSelected ? '#FF6B6B' : '#64748B'}
                  />
                  <View style={styles.tenantMeta}>
                    <Text style={styles.tenantName}>{t.name}</Text>
                    <Text style={styles.tenantSub}>Room {t.room} • {t.propertyName}</Text>
                  </View>
                  <View style={styles.tenantAmountCol}>
                    <Text style={styles.tenantRentDue}>₹{t.monthlyRent.toLocaleString()}</Text>
                    <Text style={styles.tenantDueTag}>Due {t.rentDueDay}th</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Language Selector */}
        <View style={[styles.sectionCard, CardStyles.glassBorder]}>
          <Text style={styles.sectionTitle}>Call Language</Text>
          <View style={styles.chipsRow}>
            {(['Hindi', 'English', 'Kannada', 'Telugu'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langChip,
                  selectedLanguage === lang ? styles.langChipActive : styles.langChipInactive,
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langChipText,
                    selectedLanguage === lang ? { color: '#FFF', fontWeight: '800' } : { color: '#94A3B8' },
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>Script Tone</Text>
          <View style={styles.scriptOptions}>
            {[
              { id: 'gentle', title: 'Gentle Reminder', desc: 'Friendly alert about the upcoming rent date.' },
              { id: 'formal', title: 'Due Notice', desc: 'Firm formal notice with SMS payment link.' },
              { id: 'urgent', title: 'Urgent Overdue', desc: 'Strict reminder highlighting late penalty policy.' },
            ].map((script) => {
              const isSelected = selectedScript === script.id;
              return (
                <TouchableOpacity
                  key={script.id}
                  style={[
                    styles.scriptCard,
                    isSelected ? styles.scriptCardSelected : styles.scriptCardUnselected,
                  ]}
                  onPress={() => setSelectedScript(script.id as any)}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? '#FF6B6B' : '#64748B'}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scriptTitle}>{script.title}</Text>
                    <Text style={styles.scriptDesc}>{script.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Trigger Call Button */}
        <TouchableOpacity
          style={styles.startCallBtn}
          onPress={startAiCallingSimulation}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            style={styles.startCallGradient}
          >
            <Ionicons name="call" size={18} color="#FFF" />
            <Text style={styles.startCallText}>
              Launch AI Calling ({selectedTenantIds.length} Residents)
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Call Logs & Transcripts */}
        <View style={[styles.sectionCard, CardStyles.glassBorder]}>
          <Text style={styles.sectionTitle}>Call History & Transcripts</Text>

          {callLogs.map((log, index) => (
            <View
              key={log.id}
              style={[
                styles.callLogItem,
                index < callLogs.length - 1 && styles.logBorder,
              ]}
            >
              <View style={styles.logTopRow}>
                <View>
                  <Text style={styles.logName}>{log.tenantName}</Text>
                  <Text style={styles.logMeta}>Room {log.room} • {log.date} • {log.language}</Text>
                </View>
                <View
                  style={[
                    styles.logStatusPill,
                    {
                      backgroundColor:
                        log.status === 'Promised'
                          ? StatusColors.successBg
                          : log.status === 'Answered'
                          ? StatusColors.infoBg
                          : StatusColors.warningBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.logStatusText,
                      {
                        color:
                          log.status === 'Promised'
                            ? StatusColors.success
                            : log.status === 'Answered'
                            ? StatusColors.info
                            : StatusColors.warning,
                      },
                    ]}
                  >
                    {log.status}
                  </Text>
                </View>
              </View>

              <View style={styles.transcriptBox}>
                <Ionicons name="chatbubble-ellipses-outline" size={13} color="#818CF8" style={{ marginTop: 2 }} />
                <Text style={styles.transcriptText}>{log.transcript}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Live AI Call Modal Simulation */}
      <Modal
        visible={isCallingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCallingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.callSimulationBox}>
            <View style={styles.callingWaveAnim}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                style={styles.waveGradient}
              >
                <Ionicons name="call" size={32} color="#FFF" />
              </LinearGradient>
            </View>

            <Text style={styles.simTitle}>PG Hub AI Calling Bot</Text>
            <Text style={styles.simLangTag}>{selectedLanguage} • {selectedScript.toUpperCase()} SCRIPT</Text>

            <View style={styles.stepBox}>
              {currentCallStep === 1 && (
                <Text style={styles.stepText}>📞 Connecting carrier line to resident...</Text>
              )}
              {currentCallStep === 2 && (
                <Text style={[styles.stepText, { color: '#34D399' }]}>
                  ✅ Call Connected • Listening
                </Text>
              )}
              {currentCallStep === 3 && (
                <View style={styles.speechBubble}>
                  <Text style={styles.speechAiLabel}>AI Bot Speaking:</Text>
                  <Text style={styles.speechAiText}>
                    "Namaste! This is PG Hub calling regarding your October room rent..."
                  </Text>
                </View>
              )}
              {currentCallStep === 4 && (
                <View style={[styles.speechBubble, { borderColor: 'rgba(56, 189, 248, 0.4)' }]}>
                  <Text style={[styles.speechAiLabel, { color: '#38BDF8' }]}>Resident Response:</Text>
                  <Text style={styles.speechAiText}>
                    "Noted, transferring ₹10,000 via PhonePe UPI in 1 hour."
                  </Text>
                </View>
              )}
              {currentCallStep >= 5 && (
                <View style={{ alignItems: 'center', gap: 4 }}>
                  <Text style={[styles.stepText, { color: '#34D399', fontWeight: '800' }]}>
                    🎉 Payment Commitment Confirmed!
                  </Text>
                  <Text style={{ color: '#94A3B8', fontSize: 11, textAlign: 'center' }}>
                    Promise logged. UPI payment QR link sent via WhatsApp.
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeSimBtn}
              onPress={() => setIsCallingModalVisible(false)}
            >
              <Text style={styles.closeSimBtnText}>
                {currentCallStep >= 5 ? 'Done & Review Log' : 'End Call'}
              </Text>
            </TouchableOpacity>
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.full,
    gap: 3,
  },
  aiTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  aiBannerCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  aiBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  aiWaveformIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    color: '#F8FAFC',
    fontSize: FontSizes.sm,
    fontWeight: '800',
  },
  bannerDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: '#111A2E',
    borderRadius: Radii.xl,
    padding: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  selectAllBtn: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  tenantList: {
    gap: Spacing.xs,
  },
  tenantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  tenantRowSelected: {
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  tenantRowUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tenantMeta: {
    flex: 1,
  },
  tenantName: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  tenantSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  tenantAmountCol: {
    alignItems: 'flex-end',
  },
  tenantRentDue: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: '#F43F5E',
  },
  tenantDueTag: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  langChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  langChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  langChipInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scriptOptions: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  scriptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  scriptCardSelected: {
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  scriptCardUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  scriptTitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  scriptDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  startCallBtn: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  startCallGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  startCallText: {
    color: '#FFF',
    fontSize: FontSizes.sm,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  callLogItem: {
    paddingVertical: Spacing.md,
    gap: 6,
  },
  logBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  logTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logName: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  logMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  logStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.xs,
  },
  logStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  transcriptBox: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    padding: Spacing.sm,
    borderRadius: Radii.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  transcriptText: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  callSimulationBox: {
    width: '100%',
    backgroundColor: '#111A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  callingWaveAnim: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  waveGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  simLangTag: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '700',
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  stepBox: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    width: '100%',
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  stepText: {
    color: '#F8FAFC',
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  speechBubble: {
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: '#818CF8',
    paddingLeft: 8,
  },
  speechAiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#818CF8',
    marginBottom: 2,
  },
  speechAiText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  closeSimBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: Radii.lg,
    width: '100%',
    alignItems: 'center',
  },
  closeSimBtnText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: FontSizes.sm,
  },
});
