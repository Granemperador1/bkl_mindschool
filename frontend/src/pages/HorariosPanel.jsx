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

const mockHorarios = [
  {
    id: 1,
    curso: "Matemáticas IV",
    dia: "Lunes",
    hora_inicio: "08:00",
    hora_fin: "10:00",
    aula: "A1",
    tipo: "presencial",
    url_meeting: "",
  },
  {
    id: 2,
    curso: "Biología II",
    dia: "Martes",
    hora_inicio: "10:00",
    hora_fin: "12:00",
    aula: "B2",
    tipo: "virtual",
    url_meeting: "https://meet.ejemplo.com/biologia",
  },
  {
    id: 3,
    curso: "Física II",
    dia: "Miércoles",
    hora_inicio: "12:00",
    hora_fin: "14:00",
    aula: "C3",
    tipo: "hibrida",
    url_meeting: "https://meet.ejemplo.com/fisica",
  },
];

const HorariosPanel = () => {
  const [horarios] = useState(mockHorarios);

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
        Horarios de Clases
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
              Curso
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Día</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Hora Inicio
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Hora Fin
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Aula</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Tipo</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Enlace
            </th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((h) => (
            <tr key={h.id}>
              <td style={{ padding: SPACING[4] }}>{h.curso}</td>
              <td style={{ padding: SPACING[4] }}>{h.dia}</td>
              <td style={{ padding: SPACING[4] }}>{h.hora_inicio}</td>
              <td style={{ padding: SPACING[4] }}>{h.hora_fin}</td>
              <td style={{ padding: SPACING[4] }}>{h.aula}</td>
              <td style={{ padding: SPACING[4] }}>
                {h.tipo.charAt(0).toUpperCase() + h.tipo.slice(1)}
              </td>
              <td style={{ padding: SPACING[4] }}>
                {h.url_meeting ? (
                  <a
                    href={h.url_meeting}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: COLORS.primary,
                      color: COLORS.surface,
                      padding: SPACING[2],
                      borderRadius: BORDER_RADIUS.sm,
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    Enlace Virtual
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HorariosPanel;
