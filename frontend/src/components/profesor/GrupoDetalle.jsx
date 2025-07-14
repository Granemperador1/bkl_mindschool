import React from "react";
import {
  COLORS,
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../theme/branding/branding";

const GrupoDetalle = ({
  grupo,
  onCrearTarea,
  onCalificarTarea,
  onVerDetalleTarea,
}) => (
  <div
    style={{
      flex: 1,
      padding: SPACING[6],
      background: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
      boxShadow: SHADOWS.md,
    }}
  >
    <h2
      style={{
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.xl,
        color: COLORS.primary,
        marginBottom: SPACING[4],
      }}
    >
      {grupo.nombre}
    </h2>
    <div style={{ marginBottom: SPACING[6] }}>
      <strong>Alumnos:</strong>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: SPACING[2],
        }}
      >
        {grupo.alumnos?.map((alumno, idx) => (
          <li
            key={alumno + idx}
            style={{
              background: COLORS.surfaceLight,
              borderRadius: BORDER_RADIUS.base,
              padding: SPACING[3],
              color: COLORS.text,
            }}
          >
            {alumno}
          </li>
        ))}
      </ul>
    </div>
    <div style={{ marginBottom: SPACING[6] }}>
      <strong>Tareas:</strong>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: SPACING[2],
        }}
      >
        {grupo.tareas?.map((tarea, idx) => (
          <li
            key={tarea + idx}
            style={{
              background: COLORS.surfaceLight,
              borderRadius: BORDER_RADIUS.base,
              padding: SPACING[3],
              color: COLORS.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{tarea}</span>
            <span>
              <button style={{ marginRight: 8 }} onClick={onCalificarTarea}>
                Calificar
              </button>
              <button onClick={onVerDetalleTarea}>Ver Detalle</button>
            </span>
          </li>
        ))}
      </ul>
      <button style={{ marginTop: SPACING[4] }} onClick={onCrearTarea}>
        + Crear Tarea
      </button>
    </div>
    <div>
      <strong>Calendario:</strong>
      <div
        style={{
          background: COLORS.surfaceLight,
          borderRadius: BORDER_RADIUS.base,
          padding: SPACING[4],
          marginTop: SPACING[2],
          color: COLORS.textMuted,
        }}
      >
        {/* Aquí puedes integrar un calendario real o un placeholder */}
        (Calendario de actividades próximamente)
      </div>
    </div>
  </div>
);

export default GrupoDetalle;
