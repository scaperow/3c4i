// Design System Tokens for AI Portal (东方极简 · 玄学 × 科技理性)

const DESIGN_SYSTEM = {
  colors: {
    background: '#F7F6F2', // 米白
    surface: '#FFFFFFCC', // 半透明白
    panel: '#F7F6F2E6', // 面板米白
    border: '#E0E0E0', // 细分隔线
    divider: '#D6D5D2', // 岩灰
    text: '#181A1B', // 墨黑
    textSecondary: '#5A6A7A', // 蓝灰
    primary: '#2A3A3F', // 黛青
    accent: '#C1442E', // 朱砂
    gold: '#BFA14A', // 暖金
    info: '#5A6A7A', // 冷色科技感
    success: '#4A5A5F',
    error: '#C1442E',
    disabled: '#D6D5D2',
    overlay: '#181A1B0D',
    gradient: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      accent: 'linear-gradient(135deg, #f59e42 0%, #f43f5e 100%)',
      info: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
    },
  },
  font: {
    body: 'Noto Sans SC, Inter, PingFang SC, Helvetica Neue, Arial, sans-serif',
    mono: 'Roboto Mono, Menlo, SF Mono, monospace',
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    size: {
      xs: '0.85rem',
      sm: '1rem',
      md: '1.25rem',
      lg: '1.5rem',
      xl: '2.25rem',
      display: '3.5rem',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '16px',
    xl: '36px',
  },
  shadow: {
    panel: '0 2px 16px rgba(24,26,27,0.06)',
    overlay: '0 4px 32px rgba(24,26,27,0.10)',
  },
  border: {
    thin: '1px solid #E0E0E0',
    thick: '2px solid #D6D5D2',
  },
  transition: {
    fast: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
    normal: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
  },
  z: {
    nav: 100,
    panel: 10,
    overlay: 200,
  },
  grid: {
    columns: 12,
    gutter: 24,
    maxWidth: 1200,
  },
};
export default DESIGN_SYSTEM;
