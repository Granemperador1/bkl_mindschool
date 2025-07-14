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

const mockPlanes = [
  {
    id: 1,
    nombre: "Básico",
    descripcion: "Acceso a 3 cursos",
    precio: 10,
    moneda: "USD",
    duracion_dias: 30,
    caracteristicas: ["3 cursos", "Sin soporte prioritario"],
    activo: true,
  },
  {
    id: 2,
    nombre: "Premium",
    descripcion: "Acceso ilimitado",
    precio: 25,
    moneda: "USD",
    duracion_dias: null,
    caracteristicas: [
      "Cursos ilimitados",
      "Soporte prioritario",
      "Certificados",
    ],
    activo: true,
  },
  {
    id: 3,
    nombre: "Estudiante",
    descripcion: "Plan especial para estudiantes",
    precio: 5,
    moneda: "USD",
    duracion_dias: 90,
    caracteristicas: ["5 cursos", "Certificados"],
    activo: false,
  },
];

const PlanesPagoPanel = () => {
  const [planes] = useState(mockPlanes);
  const [mensaje, setMensaje] = useState("");

  const handleComprar = (plan) => {
    setMensaje(`¡Has adquirido el plan ${plan.nombre}!`);
    setTimeout(() => setMensaje(""), 3000);
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
        Planes de Pago
      </h1>
      {mensaje && (
        <div
          style={{
            color: COLORS.success,
            marginBottom: SPACING[4],
            fontWeight: FONT_WEIGHTS.bold,
          }}
        >
          {mensaje}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: SPACING[6],
        }}
      >
        {planes.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.lg,
              boxShadow: SHADOWS.md,
              padding: SPACING[6],
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <h2
              style={{
                color: COLORS.primary,
                fontSize: FONT_SIZES.xl,
                fontWeight: FONT_WEIGHTS.bold,
              }}
            >
              {plan.nombre}
            </h2>
            <p
              style={{ color: COLORS.textSecondary, marginBottom: SPACING[3] }}
            >
              {plan.descripcion}
            </p>
            <ul style={{ marginBottom: SPACING[3] }}>
              {plan.caracteristicas.map((c, i) => (
                <li key={i} style={{ color: COLORS.text }}>
                  {c}
                </li>
              ))}
            </ul>
            <div
              style={{
                fontSize: FONT_SIZES.lg,
                fontWeight: FONT_WEIGHTS.bold,
                marginBottom: SPACING[3],
              }}
            >
              {plan.precio} {plan.moneda}{" "}
              {plan.duracion_dias
                ? `/ ${plan.duracion_dias} días`
                : "/ ilimitado"}
            </div>
            <button
              disabled={!plan.activo}
              onClick={() => handleComprar(plan)}
              style={{
                padding: SPACING[3],
                background: plan.activo ? COLORS.primary : COLORS.textSecondary,
                color: COLORS.surface,
                border: "none",
                borderRadius: BORDER_RADIUS.md,
                fontWeight: "600",
                cursor: plan.activo ? "pointer" : "not-allowed",
              }}
            >
              {plan.activo ? "Comprar" : "No disponible"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanesPagoPanel;
