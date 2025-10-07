// Dark theme utilities for dashboard components to match Chainex-style UI

export const dashboardTheme = {
  // Card styling - transparent or gray-950
  card: "bg-gray-950/80 backdrop-blur-sm border-gray-800/50",
  cardHeader: "border-gray-800/30",
  cardTitle: "text-white",
  cardDescription: "text-white/80",
  
  // Button styling
  buttonPrimary: "bg-gray-900/80 hover:bg-gray-800/80 border border-gray-700/50 text-white backdrop-blur-sm",
  buttonSecondary: "bg-gray-800/60 hover:bg-gray-700/60 text-white border border-gray-700/50",
  
  // Input styling
  input: "bg-gray-900/80 border-gray-800/50 text-white placeholder:text-white/60",
  select: "bg-gray-900/80 border-gray-800/50 text-white",
  textarea: "bg-gray-900/80 border-gray-800/50 text-white placeholder:text-white/60",
  
  // Text colors
  textPrimary: "text-white",
  textSecondary: "text-white/80",
  textMuted: "text-white/60",
  
  // Background colors
  backgroundPrimary: "bg-gray-950/50",
  backgroundSecondary: "bg-gray-900/50",
  
  // Border colors
  borderPrimary: "border-gray-800/50",
  borderSecondary: "border-gray-700/50",
  
  // Accent colors
  accentGreen: "text-green-400",
  accentBlue: "text-blue-400",
  accentOrange: "text-orange-400",
  accentPurple: "text-purple-400",
  
  // Status colors - catchy solid colors
  success: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
  warning: "text-amber-400 bg-amber-500/20 border-amber-500/30",
  error: "text-rose-400 bg-rose-500/20 border-rose-500/30",
  info: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
  
  // Notification colors - catchy and vibrant
  notificationSuccess: "text-emerald-300 bg-emerald-600/30 border-emerald-600/40",
  notificationWarning: "text-amber-300 bg-amber-600/30 border-amber-600/40",
  notificationError: "text-rose-300 bg-rose-600/30 border-rose-600/40",
  notificationInfo: "text-cyan-300 bg-cyan-600/30 border-cyan-600/40"
};

export const applyDarkTheme = (className: string = "") => {
  return `${dashboardTheme.card} ${className}`;
};

export const getCardTheme = () => dashboardTheme.card;
export const getTextTheme = () => dashboardTheme.textPrimary;
export const getButtonTheme = () => dashboardTheme.buttonPrimary;
export const getInputTheme = () => dashboardTheme.input;
