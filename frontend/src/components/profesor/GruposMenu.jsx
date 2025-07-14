import React from "react";
import {
  COLORS,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
} from "../../theme/branding/branding";

const GruposMenu = ({ grupos, seleccionado, onSelect }) => (
  <div
    style={{
      width: 220,
      background: COLORS.surfaceLight,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <div
      style={{
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.base,
        color: COLORS.primary,
        marginBottom: SPACING[4],
      }}
    >
      Grupos
    </div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {grupos.map((grupo, idx) => (
        <li
          key={grupo.id || idx}
          style={{
            padding: `${SPACING[3]} ${SPACING[2]}`,
            borderRadius: BORDER_RADIUS.base,
            background:
              seleccionado?.id === grupo.id ? COLORS.primary : "transparent",
            color: seleccionado?.id === grupo.id ? COLORS.white : COLORS.text,
            fontWeight: FONT_WEIGHTS.medium,
            cursor: "pointer",
            marginBottom: SPACING[2],
            transition: "all 0.2s",
          }}
          onClick={() => onSelect(grupo)}
        >
          {grupo.nombre}
        </li>
      ))}
    </ul>
  </div>
);

export default GruposMenu;
