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

const mockPlantillas = [
  {
    id: 1,
    nombre: "Bienvenida",
    tipo: "email",
    asunto: "¡Bienvenido a la plataforma!",
    activa: true,
    idioma: "es",
  },
  {
    id: 2,
    nombre: "Recordatorio de tarea",
    tipo: "push",
    asunto: "Tienes una tarea pendiente",
    activa: true,
    idioma: "es",
  },
  {
    id: 3,
    nombre: "Alerta de pago",
    tipo: "email",
    asunto: "Tu pago fue recibido",
    activa: false,
    idioma: "es",
  },
];

const NotificacionesAdminPanel = () => {
  const [plantillas, setPlantillas] = useState(mockPlantillas);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "email",
    asunto: "",
    activa: true,
    idioma: "es",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.asunto) {
      setError("Nombre y asunto son obligatorios");
      return;
    }
    setPlantillas([...plantillas, { id: Date.now(), ...form }]);
    setShowForm(false);
    setForm({
      nombre: "",
      tipo: "email",
      asunto: "",
      activa: true,
      idioma: "es",
    });
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
        Plantillas de Notificaciones
      </h1>
      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: SPACING[3],
          background: COLORS.primary,
          color: COLORS.surface,
          border: "none",
          borderRadius: BORDER_RADIUS.md,
          fontWeight: "600",
          marginBottom: SPACING[6],
          cursor: "pointer",
        }}
      >
        + Nueva Plantilla
      </button>
      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            background: COLORS.surface,
            padding: SPACING[6],
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.md,
            marginBottom: SPACING[8],
            maxWidth: 500,
          }}
        >
          <h2
            style={{
              color: COLORS.text,
              fontSize: FONT_SIZES.xl,
              fontWeight: FONT_WEIGHTS.medium,
              marginBottom: SPACING[4],
            }}
          >
            Crear Plantilla
          </h2>
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <option value="email">Email</option>
            <option value="push">Push</option>
            <option value="sms">SMS</option>
            <option value="in_app">In App</option>
            <option value="webhook">Webhook</option>
          </select>
          <input
            name="asunto"
            placeholder="Asunto"
            value={form.asunto}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />
          <label style={{ display: "block", marginBottom: SPACING[3] }}>
            <input
              type="checkbox"
              name="activa"
              checked={form.activa}
              onChange={handleInputChange}
            />{" "}
            Activa
          </label>
          <input
            name="idioma"
            placeholder="Idioma"
            value={form.idioma}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />
          {error && (
            <div style={{ color: COLORS.error, marginBottom: SPACING[3] }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              padding: SPACING[3],
              background: COLORS.success,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{
              marginLeft: SPACING[4],
              padding: SPACING[3],
              background: COLORS.error,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </form>
      )}
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
              Nombre
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Tipo</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Asunto
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Activa
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Idioma
            </th>
          </tr>
        </thead>
        <tbody>
          {plantillas.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: SPACING[4] }}>{p.nombre}</td>
              <td style={{ padding: SPACING[4] }}>{p.tipo}</td>
              <td style={{ padding: SPACING[4] }}>{p.asunto}</td>
              <td
                style={{
                  padding: SPACING[4],
                  color: p.activa ? COLORS.success : COLORS.textSecondary,
                }}
              >
                {p.activa ? "Sí" : "No"}
              </td>
              <td style={{ padding: SPACING[4] }}>{p.idioma}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificacionesAdminPanel;
