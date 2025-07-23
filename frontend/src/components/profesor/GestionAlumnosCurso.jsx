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
  cursoId,
}) => {
  const [emailInvitar, setEmailInvitar] = useState("");
  const [emailManual, setEmailManual] = useState("");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

  // NUEVO: Exportar estudiantes
  const handleExportar = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/profesor/cursos/${cursoId}/exportar-estudiantes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al exportar estudiantes");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estudiantes_curso_${cursoId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("No se pudo exportar estudiantes");
    }
  };

  return (
    <div className="gestion-alumnos-curso">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={sectionTitle}>Alumnos inscritos</h2>
        <button onClick={handleExportar} style={{ ...buttonStyle, background: COLORS.success, fontSize: 15 }}>
          <i className="fas fa-file-excel" style={{ marginRight: 8 }}></i> Exportar Excel
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))", gap: SPACING[4] }}>
        {alumnos.length === 0 && <div style={{ color: COLORS.textSecondary }}>No hay alumnos inscritos.</div>}
        {alumnos.map((alumno) => (
          <div key={alumno.id} style={cardStyle}>
            <div style={avatarStyle}>{alumno.name?.charAt(0)?.toUpperCase() || "A"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.lg }}>{alumno.name}</div>
              <div style={emailStyle}>{alumno.email}</div>
              <div style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 }}>{alumno.tipo_acceso}</div>
            </div>
            <div style={tipoAccesoStyle}>{alumno.tipo_acceso}</div>
          </div>
        ))}
      </div>

      <hr style={divider} />

      <h3 style={sectionTitle}>Invitar alumno por correo</h3>
      <form
        style={{ ...formStyle, flexDirection: isMobile ? "column" : "row", gap: isMobile ? SPACING[2] : SPACING[3] }}
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
          style={{ ...inputStyle, width: isMobile ? "100%" : undefined }}
        />
        <button type="submit" style={{ ...buttonStyle, width: isMobile ? "100%" : undefined }}>Invitar</button>
      </form>

      <hr style={divider} />

      <h3 style={sectionTitle}>Generar código de invitación</h3>
      <div style={{ display: isMobile ? "block" : "flex", alignItems: "center", gap: isMobile ? SPACING[2] : SPACING[4], marginBottom: SPACING[4] }}>
        <button onClick={onGenerarCodigo} style={{ ...buttonStyle, width: isMobile ? "100%" : undefined, marginBottom: isMobile ? 8 : 0 }}>Generar código</button>
        {codigoInvitacion && (
          <div style={{
            background: COLORS.white,
            border: `2px solid ${COLORS.primary}`,
            color: COLORS.primary,
            borderRadius: BORDER_RADIUS.md,
            padding: "8px 18px",
            fontWeight: FONT_WEIGHTS.bold,
            fontSize: FONT_SIZES.lg,
            marginLeft: isMobile ? 0 : SPACING[3],
            marginTop: isMobile ? 8 : 0,
            display: "flex",
            alignItems: "center",
            gap: SPACING[2],
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            letterSpacing: 1,
            width: isMobile ? "100%" : undefined,
            justifyContent: isMobile ? "space-between" : undefined,
          }}>
            <span style={{ color: COLORS.primary, fontWeight: 700 }}>{codigoInvitacion}</span>
            <button
              style={{ ...buttonStyle, background: COLORS.primary, color: COLORS.white, padding: "4px 10px", fontSize: FONT_SIZES.sm, marginLeft: 8, width: isMobile ? "auto" : undefined }}
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
        style={{ ...formStyle, flexDirection: isMobile ? "column" : "row", gap: isMobile ? SPACING[2] : SPACING[3] }}
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
          style={{ ...inputStyle, width: isMobile ? "100%" : undefined }}
        />
        <button type="submit" style={{ ...buttonStyle, width: isMobile ? "100%" : undefined }}>Agregar</button>
      </form>
    </div>
  );
};

export default GestionAlumnosCurso;
