import React, { useState } from "react";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../theme/branding/branding";

const mockRespuestas = [
  {
    id: 1,
    estudiante: "Juan Pérez",
    examen: "Examen Matemáticas",
    pregunta: "¿Cuál es el resultado de 2 + 2?",
    respuesta: "4",
    correcta: true,
    puntos: 1,
  },
  {
    id: 2,
    estudiante: "Ana Gómez",
    examen: "Examen Matemáticas",
    pregunta: "¿Cuál es el resultado de 2 + 2?",
    respuesta: "3",
    correcta: false,
    puntos: 0,
  },
  {
    id: 3,
    estudiante: "Juan Pérez",
    examen: "Examen Matemáticas",
    pregunta: "¿La tierra es plana?",
    respuesta: "Falso",
    correcta: true,
    puntos: 1,
  },
];

const RespuestasExamenPanel = () => {
  const [respuestas] = useState(mockRespuestas);

  return (
    <div
      style={{
        padding: SPACING[8],
        background: COLORS.background,
        minHeight: "100vh",
        fontFamily: FONTS.main,
      }}
    >
      <h1
        style={{
          color: COLORS.primary,
          fontSize: FONT_SIZES["3xl"],
          fontWeight: FONT_WEIGHTS.bold,
          marginBottom: SPACING[6],
        }}
      >
        Respuestas de Exámenes
      </h1>
      <table
        style={{
          width: "100%",
          background: COLORS.surface,
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.md,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: COLORS.surfaceLight }}>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Estudiante
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Examen
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Pregunta
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Respuesta
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Correcta
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Puntos
            </th>
          </tr>
        </thead>
        <tbody>
          {respuestas.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: SPACING[4] }}>{r.estudiante}</td>
              <td style={{ padding: SPACING[4] }}>{r.examen}</td>
              <td style={{ padding: SPACING[4] }}>{r.pregunta}</td>
              <td style={{ padding: SPACING[4] }}>{r.respuesta}</td>
              <td
                style={{
                  padding: SPACING[4],
                  color: r.correcta ? COLORS.success : COLORS.error,
                }}
              >
                {r.correcta ? "Sí" : "No"}
              </td>
              <td style={{ padding: SPACING[4] }}>{r.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RespuestasExamenPanel;
