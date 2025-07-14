import React from "react";
import {
  COLORS,
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../theme/branding/branding";

const MateriasGrid = ({ materias, onSelectMateria }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 32,
      margin: "40px 0",
    }}
  >
    {materias.map((materia) => (
      <div
        key={materia.id}
        style={{
          background: COLORS.surface,
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.md,
          cursor: "pointer",
          overflow: "hidden",
          border: `2px solid ${COLORS.primary}20`,
          transition: "all 0.2s",
        }}
        onClick={() => onSelectMateria(materia)}
      >
        <img
          src={materia.imagen}
          alt={materia.nombre}
          style={{ width: "100%", height: 120, objectFit: "cover" }}
          loading="lazy"
        />
        <div style={{ padding: 16 }}>
          <div
            style={{
              fontWeight: FONT_WEIGHTS.bold,
              fontSize: FONT_SIZES.lg,
              color: COLORS.text,
            }}
          >
            {materia.nombre}
          </div>
          <div
            style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.textSecondary,
              marginTop: 8,
            }}
          >
            {materia.grupos?.length || 0} grupos
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default MateriasGrid;
