// Sistema de diseño estandarizado para MindSchool
// Tema oscuro moderno con acentos azules

export const COLORS = {
  // Colores principales
  primary: "#2563EB", // Azul principal
  secondary: "#3B82F6", // Azul secundario
  accent: "#60A5FA", // Azul claro para acentos

  // Colores de fondo
  background: "#0F172A", // Fondo principal muy oscuro
  surface: "#1E293B", // Superficies de tarjetas
  surfaceLight: "#334155", // Superficies más claras
  surfaceHover: "#475569", // Hover states

  // Colores de texto
  text: "#F8FAFC", // Texto principal
  textSecondary: "#CBD5E1", // Texto secundario
  textMuted: "#94A3B8", // Texto atenuado

  // Colores de estado
  success: "#10B981", // Verde para éxito
  warning: "#F59E0B", // Amarillo para advertencias
  error: "#EF4444", // Rojo para errores
  info: "#3B82F6", // Azul para información

  // Colores de borde
  border: "#334155",
  borderLight: "#475569",

  // Gradientes
  gradientPrimary: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
  gradientSurface: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
  gradientBackground: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",

  // Overlays
  overlay: "rgba(15, 23, 42, 0.8)",
  overlayLight: "rgba(15, 23, 42, 0.6)",
};

export const FONTS = {
  main: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  heading:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
};

export const FONT_SIZES = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
};

export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export const SPACING = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
};

export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
};

export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  glow: "0 0 20px rgba(37, 99, 235, 0.3)",
};

export const TRANSITIONS = {
  fast: "150ms ease-in-out",
  base: "200ms ease-in-out",
  slow: "300ms ease-in-out",
  slower: "500ms ease-in-out",
};

export const BREAKPOINTS = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Configuración de la escuela
export const SCHOOL_NAME = "MindSchool";
export const SCHOOL_TAGLINE = "Aprende, crece, innova";

// Componentes estandarizados
export const COMPONENT_STYLES = {
  // Botones
  button: {
    primary: {
      background: COLORS.gradientPrimary,
      color: COLORS.text,
      border: "none",
      borderRadius: BORDER_RADIUS.lg,
      padding: `${SPACING[3]} ${SPACING[6]}`,
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      cursor: "pointer",
      transition: TRANSITIONS.base,
      boxShadow: SHADOWS.md,
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: SHADOWS.lg,
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    secondary: {
      background: "transparent",
      color: COLORS.primary,
      border: `2px solid ${COLORS.primary}`,
      borderRadius: BORDER_RADIUS.lg,
      padding: `${SPACING[3]} ${SPACING[6]}`,
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      cursor: "pointer",
      transition: TRANSITIONS.base,
      "&:hover": {
        background: COLORS.primary,
        color: COLORS.text,
      },
    },
    ghost: {
      background: "transparent",
      color: COLORS.textSecondary,
      border: "none",
      borderRadius: BORDER_RADIUS.lg,
      padding: `${SPACING[2]} ${SPACING[4]}`,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      cursor: "pointer",
      transition: TRANSITIONS.base,
      "&:hover": {
        background: COLORS.surfaceHover,
        color: COLORS.text,
      },
    },
  },

  // Inputs
  input: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.lg,
    padding: `${SPACING[3]} ${SPACING[4]}`,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    transition: TRANSITIONS.base,
    "&:focus": {
      outline: "none",
      borderColor: COLORS.primary,
      boxShadow: `0 0 0 3px ${COLORS.primary}20`,
    },
    "&::placeholder": {
      color: COLORS.textMuted,
    },
  },

  // Tarjetas
  card: {
    background: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[6],
    boxShadow: SHADOWS.lg,
    border: `1px solid ${COLORS.border}`,
    transition: TRANSITIONS.base,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: SHADOWS.xl,
    },
  },

  // Modales
  modal: {
    overlay: {
      background: COLORS.overlay,
      backdropFilter: "blur(8px)",
    },
    content: {
      background: COLORS.surface,
      borderRadius: BORDER_RADIUS.xl,
      border: `1px solid ${COLORS.border}`,
      boxShadow: SHADOWS["2xl"],
    },
  },
};

// Utilidades CSS para responsividad
export const RESPONSIVE_UTILS = {
  // Contenedores responsivos
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: `0 ${SPACING[4]}`,
    "@media (min-width: 640px)": {
      padding: `0 ${SPACING[6]}`,
    },
    "@media (min-width: 1024px)": {
      padding: `0 ${SPACING[8]}`,
    },
  },

  // Grid responsivo
  grid: {
    display: "grid",
    gap: SPACING[6],
    gridTemplateColumns: "repeat(1, 1fr)",
    "@media (min-width: 640px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (min-width: 1280px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
  },

  // Flex responsivo
  flex: {
    display: "flex",
    flexDirection: "column",
    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  },
};

// Animaciones
export const ANIMATIONS = {
  fadeIn: {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  slideIn: {
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(0)" },
  },
  scaleIn: {
    from: { transform: "scale(0.9)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  },
  pulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 },
  },
};

// Media queries helpers
export const MEDIA_QUERIES = {
  xs: `@media (min-width: ${BREAKPOINTS.xs})`,
  sm: `@media (min-width: ${BREAKPOINTS.sm})`,
  md: `@media (min-width: ${BREAKPOINTS.md})`,
  lg: `@media (min-width: ${BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${BREAKPOINTS.xl})`,
  "2xl": `@media (min-width: ${BREAKPOINTS["2xl"]})`,
};
