/**
 * PG Hub Modern Luxury Design System — Color Palette
 * Obsidian & Midnight theme with Radiant Coral & Emerald accents
 */

export const Brand = {
  // Midnight Obsidian base
  obsidian: '#090D16',
  obsidianElevated: '#0F1626',
  surfaceCard: '#131D31',
  surfaceCardElevated: '#18243D',
  surfaceSubtle: '#1C2B47',
  
  // Brand Primary & Accents
  navy: '#0F172A',
  navyLight: '#1E293B',
  navyDark: '#020617',
  coral: '#FF6B6B',
  coralLight: '#FFA8A8',
  coralDark: '#EE5253',
  coralGlow: 'rgba(255, 107, 107, 0.25)',
  
  // Action CTAs
  cta: '#FF5252',
  ctaGradient: ['#FF6B6B', '#EE5253'],
  ctaHover: '#D63031',
  white: '#FFFFFF',
  whatsapp: '#25D366',
  whatsappBg: 'rgba(37, 211, 102, 0.12)',

  // AI Theme
  aiIndigo: '#6366F1',
  aiViolet: '#8B5CF6',
  aiGradient: ['#8B5CF6', '#6366F1'],
  aiGlow: 'rgba(99, 102, 241, 0.25)',
};

export const StatusColors = {
  success: '#10B981',
  successLight: '#34D399',
  successBg: 'rgba(16, 185, 129, 0.12)',
  successBorder: 'rgba(16, 185, 129, 0.28)',
  
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  warningBorder: 'rgba(245, 158, 11, 0.28)',
  
  error: '#F43F5E',
  errorLight: '#FB7185',
  errorBg: 'rgba(244, 63, 94, 0.12)',
  errorBorder: 'rgba(244, 63, 94, 0.28)',
  
  info: '#38BDF8',
  infoLight: '#7DD3FC',
  infoBg: 'rgba(56, 189, 248, 0.12)',
  infoBorder: 'rgba(56, 189, 248, 0.28)',
};

export const BedStatus = {
  occupied: '#10B981',
  vacant: '#64748B',
  rentDue: '#F59E0B',
  booked: '#38BDF8',
};

const Colors = {
  light: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textDisabled: '#475569',
    textInverse: '#090D16',
    
    background: '#090D16',
    backgroundCard: '#111A2E',
    backgroundCardElevated: '#16223B',
    backgroundSubtle: '#1A2744',
    backgroundElevated: '#16223B',
    
    tint: '#FF6B6B',
    tabIconDefault: '#64748B',
    tabIconSelected: '#FF6B6B',
    tabBarBackground: 'rgba(11, 17, 30, 0.96)',
    tabBarBorder: 'rgba(255, 255, 255, 0.08)',
    
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.04)',
    borderActive: 'rgba(255, 107, 107, 0.4)',
    divider: 'rgba(255, 255, 255, 0.08)',
    
    primary: '#FF6B6B',
    primaryLight: '#FFA8A8',
    secondary: '#38BDF8',
    secondaryLight: '#7DD3FC',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
    headerBackground: '#090D16',
    headerText: '#F8FAFC',
    statusBarStyle: 'light' as const,
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textDisabled: '#475569',
    textInverse: '#090D16',
    
    background: '#090D16',
    backgroundCard: '#111A2E',
    backgroundCardElevated: '#16223B',
    backgroundSubtle: '#1A2744',
    backgroundElevated: '#16223B',
    
    tint: '#FF6B6B',
    tabIconDefault: '#64748B',
    tabIconSelected: '#FF6B6B',
    tabBarBackground: 'rgba(11, 17, 30, 0.96)',
    tabBarBorder: 'rgba(255, 255, 255, 0.08)',
    
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.04)',
    borderActive: 'rgba(255, 107, 107, 0.4)',
    divider: 'rgba(255, 255, 255, 0.08)',
    
    primary: '#FF6B6B',
    primaryLight: '#FFA8A8',
    secondary: '#38BDF8',
    secondaryLight: '#7DD3FC',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
    headerBackground: '#090D16',
    headerText: '#F8FAFC',
    statusBarStyle: 'light' as const,
  },
};

export default Colors;
