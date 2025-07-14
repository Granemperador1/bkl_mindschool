import React from "react";
import {
  COLORS,
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../theme/branding/branding";

const CuatrimestreSelector = ({ cuatrimestres, seleccionado, onSelect }) => (
  <div
    style={{
      display: "flex",
      gap: 40,
      justifyContent: "center",
      margin: "40px 0",
    }}
  >
    {cuatrimestres.map((cuatri) => (
      <div
        key={cuatri.key}
        style={{
          width: 220,
          cursor: "pointer",
          borderRadius: BORDER_RADIUS.xl,
          boxShadow: SHADOWS.md,
          border:
            seleccionado?.key === cuatri.key
              ? `3px solid ${COLORS.primary}`
              : "3px solid transparent",
          overflow: "hidden",
          background: COLORS.surface,
          transition: "all 0.2s",
          filter: seleccionado?.key === cuatri.key ? "brightness(1.1)" : "none",
        }}
        onClick={() => onSelect(cuatri)}
      >
        <img
          src={cuatri.imagen}
          alt={cuatri.nombre}
          style={{ width: "100%", height: 120, objectFit: "cover" }}
          loading="lazy"
        />
        <div
          style={{
            padding: 16,
            fontWeight: FONT_WEIGHTS.medium,
            fontSize: FONT_SIZES.lg,
            color: COLORS.text,
            textAlign: "center",
          }}
        >
          {cuatri.nombre}
        </div>
      </div>
    ))}
  </div>
);

export default CuatrimestreSelector;
