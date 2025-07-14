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

const mockConfig = [
  {
    id: 1,
    tipo: "nueva_tarea",
    email: true,
    push: true,
    sms: false,
    in_app: true,
    webhook: false,
    activo: true,
  },
  {
    id: 2,
    tipo: "recordatorio_examen",
    email: true,
    push: false,
    sms: false,
    in_app: true,
    webhook: false,
    activo: true,
  },
  {
    id: 3,
    tipo: "calificacion",
    email: true,
    push: true,
    sms: false,
    in_app: true,
    webhook: false,
    activo: true,
  },
];

const tipos = {
  nueva_tarea: "Nueva Tarea",
  recordatorio_examen: "Recordatorio de Examen",
  calificacion: "Calificación",
};

const NotificacionesUsuarioPanel = () => {
  const [config, setConfig] = useState(mockConfig);

  const handleToggle = (id, campo) => {
    setConfig(
      config.map((c) => (c.id === id ? { ...c, [campo]: !c[campo] } : c)),
    );
  };

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
        Mis Preferencias de Notificación
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
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Tipo</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Email
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Push</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>SMS</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              In App
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Activo
            </th>
          </tr>
        </thead>
        <tbody>
          {config.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: SPACING[4] }}>{tipos[c.tipo] || c.tipo}</td>
              <td style={{ padding: SPACING[4] }}>
                <input
                  type="checkbox"
                  checked={c.email}
                  onChange={() => handleToggle(c.id, "email")}
                />
              </td>
              <td style={{ padding: SPACING[4] }}>
                <input
                  type="checkbox"
                  checked={c.push}
                  onChange={() => handleToggle(c.id, "push")}
                />
              </td>
              <td style={{ padding: SPACING[4] }}>
                <input
                  type="checkbox"
                  checked={c.sms}
                  onChange={() => handleToggle(c.id, "sms")}
                />
              </td>
              <td style={{ padding: SPACING[4] }}>
                <input
                  type="checkbox"
                  checked={c.in_app}
                  onChange={() => handleToggle(c.id, "in_app")}
                />
              </td>
              <td style={{ padding: SPACING[4] }}>
                <input
                  type="checkbox"
                  checked={c.activo}
                  onChange={() => handleToggle(c.id, "activo")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificacionesUsuarioPanel;
