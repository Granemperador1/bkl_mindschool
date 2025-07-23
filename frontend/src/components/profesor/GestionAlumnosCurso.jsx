import React, { useState } from "react";
import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING } from "../../theme/branding/branding";

const cardStyle = {
  background: COLORS.surface,
  borderRadius: BORDER_RADIUS.lg,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  padding: SPACING[5],
  marginBottom: SPACING[4],
  display: "flex",
  alignItems: "center",
  gap: SPACING[5],
};
const avatarStyle = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: COLORS.primary,
  color: COLORS.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: FONT_SIZES.xl,
  marginRight: SPACING[4],
};
const emailStyle = {
  color: COLORS.textSecondary,
  fontSize: FONT_SIZES.sm,
};
const tipoAccesoStyle = {
  background: COLORS.primary,
  color: COLORS.white,
  borderRadius: 12,
  padding: "2px 10px",
  fontSize: FONT_SIZES.xs,
  marginLeft: SPACING[3],
};
const formStyle = {
  display: "flex",
  gap: SPACING[3],
  marginBottom: SPACING[4],
};
const inputStyle = {
  flex: 1,
  padding: "8px 12px",
  borderRadius: BORDER_RADIUS.md,
  border: `1px solid ${COLORS.border}`,
  fontSize: FONT_SIZES.base,
};
const buttonStyle = {
  background: COLORS.primary,
  color: COLORS.white,
  border: "none",
  borderRadius: BORDER_RADIUS.md,
  padding: "8px 18px",
  fontWeight: FONT_WEIGHTS.semibold,
  fontSize: FONT_SIZES.base,
  cursor: "pointer",
  transition: "background 0.2s",
};
const sectionTitle = {
  fontSize: FONT_SIZES.xl,
  fontWeight: FONT_WEIGHTS.bold,
  color: COLORS.primary,
  margin: `${SPACING[6]} 0 ${SPACING[3]} 0`,
};
const divider = {
  border: "none",
  borderTop: `1px solid ${COLORS.border}`,
  margin: `${SPACING[5]} 0`,
};

const GestionAlumnosCurso = ({
  alumnos = [],
  onInvitar,
  onGenerarCodigo,
  onAgregarManual,
  codigoInvitacion,
}) => {
  const [emailInvitar, setEmailInvitar] = useState("");
  const [emailManual, setEmailManual] = useState("");

  return (
    <div className="gestion-alumnos-curso">
      <h2 style={sectionTitle}>Alumnos inscritos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: SPACING[4] }}>
        {alumnos.length === 0 && <div style={{ color: COLORS.textSecondary }}>No hay alumnos inscritos.</div>}
        {alumnos.map((alumno) => (
          <div key={alumno.id} style={cardStyle}>
            <div style={avatarStyle}>{alumno.name?.charAt(0)?.toUpperCase() || "A"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.lg }}>{alumno.name}</div>
              <div style={emailStyle}>{alumno.email}</div>
            </div>
            <div style={tipoAccesoStyle}>{alumno.tipo_acceso}</div>
          </div>
        ))}
      </div>

      <hr style={divider} />

      <h3 style={sectionTitle}>Invitar alumno por correo</h3>
      <form
        style={formStyle}
        onSubmit={(e) => {
          e.preventDefault();
          onInvitar(emailInvitar);
          setEmailInvitar("");
        }}
      >
        <input
          type="email"
          placeholder="Correo del alumno"
          value={emailInvitar}
          onChange={(e) => setEmailInvitar(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Invitar</button>
      </form>

      <hr style={divider} />

      <h3 style={sectionTitle}>Generar código de invitación</h3>
      <div style={{ display: "flex", alignItems: "center", gap: SPACING[4], marginBottom: SPACING[4] }}>
        <button onClick={onGenerarCodigo} style={buttonStyle}>Generar código</button>
        {codigoInvitacion && (
          <div style={{
            background: COLORS.white,
            border: `2px solid ${COLORS.primary}`,
            color: COLORS.primary,
            borderRadius: BORDER_RADIUS.md,
            padding: "8px 18px",
            fontWeight: FONT_WEIGHTS.bold,
            fontSize: FONT_SIZES.lg,
            marginLeft: SPACING[3],
            display: "flex",
            alignItems: "center",
            gap: SPACING[2],
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            letterSpacing: 1,
          }}>
            <span style={{ color: COLORS.primary, fontWeight: 700 }}>{codigoInvitacion}</span>
            <button
              style={{ ...buttonStyle, background: COLORS.primary, color: COLORS.white, padding: "4px 10px", fontSize: FONT_SIZES.sm, marginLeft: 8 }}
              onClick={() => navigator.clipboard.writeText(codigoInvitacion)}
              type="button"
            >
              Copiar
            </button>
          </div>
        )}
      </div>

      <hr style={divider} />

      <h3 style={sectionTitle}>Agregar alumno manualmente</h3>
      <form
        style={formStyle}
        onSubmit={(e) => {
          e.preventDefault();
          onAgregarManual(emailManual);
          setEmailManual("");
        }}
      >
        <input
          type="email"
          placeholder="Correo del alumno"
          value={emailManual}
          onChange={(e) => setEmailManual(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Agregar</button>
      </form>
    </div>
  );
};

export default GestionAlumnosCurso;
