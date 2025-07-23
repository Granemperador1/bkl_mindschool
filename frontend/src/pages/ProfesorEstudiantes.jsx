import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING } from "../theme/branding/branding";

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
const progresoBarStyle = (progreso) => ({
  width: `${progreso}%`,
  height: 8,
  background: COLORS.primary,
  borderRadius: 4,
  transition: "width 0.3s",
});
const progresoContainer = {
  background: COLORS.surfaceLight,
  borderRadius: 4,
  height: 8,
  width: "100%",
  marginTop: 6,
};
const estadoStyle = {
  background: COLORS.primary,
  color: COLORS.white,
  borderRadius: 12,
  padding: "2px 10px",
  fontSize: FONT_SIZES.xs,
  marginLeft: SPACING[3],
};

const ProfesorEstudiantes = () => {
  const [cursos, setCursos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cursoFiltro, setCursoFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      setLoading(true);
      try {
        const res = await api.get("/profesor/cursos");
        setCursos(res.data.data || []);
      } catch (e) {
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  // Construir lista de estudiantes agrupados por curso
  const estudiantesPorCurso = cursos.map((curso) => ({
    id: curso.id,
    nombre: curso.titulo,
    estudiantes: (curso.inscripciones || []).map((ins) => ({
      ...ins.alumno,
      progreso: ins.progreso ?? 0,
      estado: ins.estado,
      fecha_inscripcion: ins.fecha_inscripcion,
      curso: curso.titulo,
    })),
  }));

  // Filtrar por curso y búsqueda
  const cursosFiltrados = cursoFiltro
    ? estudiantesPorCurso.filter((c) => c.id === cursoFiltro)
    : estudiantesPorCurso;

  const estudiantesFiltrados = cursosFiltrados
    .flatMap((c) => c.estudiantes.map((e) => ({ ...e, curso: c.nombre })))
    .filter((e) =>
      e.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.email?.toLowerCase().includes(busqueda.toLowerCase())
    );

  return (
    <div style={{ background: COLORS.background, minHeight: "100vh", color: COLORS.text, fontFamily: "inherit", padding: SPACING[6] }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: FONT_SIZES["3xl"], fontWeight: FONT_WEIGHTS.bold, color: COLORS.text, marginBottom: SPACING[6] }}>
          Mis Estudiantes
        </h1>
        <div style={{ display: "flex", gap: SPACING[4], marginBottom: SPACING[6], flexWrap: "wrap" }}>
          <select
            value={cursoFiltro}
            onChange={(e) => setCursoFiltro(e.target.value)}
            style={{ padding: 10, borderRadius: BORDER_RADIUS.md, border: `1px solid ${COLORS.border}`, fontSize: FONT_SIZES.base }}
          >
            <option value="">Todos los cursos</option>
            {estudiantesPorCurso.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: 10, borderRadius: BORDER_RADIUS.md, border: `1px solid ${COLORS.border}`, fontSize: FONT_SIZES.base, minWidth: 260 }}
          />
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>Cargando estudiantes...</div>
        ) : estudiantesFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", color: COLORS.textSecondary, padding: 60 }}>No se encontraron estudiantes.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: SPACING[5] }}>
            {estudiantesFiltrados.map((est) => (
              <div key={est.id + est.curso} style={cardStyle}>
                <div style={avatarStyle}>{est.name?.charAt(0)?.toUpperCase() || "A"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.lg }}>{est.name}</div>
                  <div style={emailStyle}>{est.email}</div>
                  <div style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 }}>Curso: <b>{est.curso}</b></div>
                  <div style={progresoContainer}>
                    <div style={progresoBarStyle(est.progreso)}></div>
                  </div>
                  <div style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 }}>Progreso: {est.progreso}%</div>
                </div>
                <div style={estadoStyle}>{est.estado}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfesorEstudiantes; 