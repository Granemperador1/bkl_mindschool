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

const mockTransacciones = [
  {
    id: 1,
    usuario: "Juan Pérez",
    plan: "Premium",
    monto: 25,
    moneda: "USD",
    estado: "completada",
    fecha_pago: "2024-07-01",
    metodo_pago: "tarjeta",
    referencia: "TXN12345",
  },
  {
    id: 2,
    usuario: "Ana Gómez",
    plan: "Básico",
    monto: 10,
    moneda: "USD",
    estado: "pendiente",
    fecha_pago: "",
    metodo_pago: "paypal",
    referencia: "TXN12346",
  },
  {
    id: 3,
    usuario: "Carlos Ramírez",
    plan: "Estudiante",
    monto: 5,
    moneda: "USD",
    estado: "fallida",
    fecha_pago: "",
    metodo_pago: "tarjeta",
    referencia: "TXN12347",
  },
];

const estados = {
  completada: "Completada",
  pendiente: "Pendiente",
  fallida: "Fallida",
  reembolsada: "Reembolsada",
  cancelada: "Cancelada",
};

const TransaccionesPanel = () => {
  const [transacciones] = useState(mockTransacciones);

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
        Historial de Transacciones
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
              Usuario
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Plan</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Monto
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Estado
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Fecha de Pago
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Método
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Referencia
            </th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map((t) => (
            <tr key={t.id}>
              <td style={{ padding: SPACING[4] }}>{t.usuario}</td>
              <td style={{ padding: SPACING[4] }}>{t.plan}</td>
              <td style={{ padding: SPACING[4] }}>
                {t.monto} {t.moneda}
              </td>
              <td
                style={{
                  padding: SPACING[4],
                  color:
                    t.estado === "completada"
                      ? COLORS.success
                      : t.estado === "pendiente"
                        ? COLORS.warning
                        : COLORS.error,
                }}
              >
                {estados[t.estado] || t.estado}
              </td>
              <td style={{ padding: SPACING[4] }}>{t.fecha_pago || "-"}</td>
              <td style={{ padding: SPACING[4] }}>{t.metodo_pago}</td>
              <td style={{ padding: SPACING[4] }}>{t.referencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransaccionesPanel;
