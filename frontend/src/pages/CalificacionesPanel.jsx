import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axiosConfig";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  TRANSITIONS,
} from "../theme/branding/branding";

const CalificacionesPanel = () => {
  const { usuario } = useAuth();
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [cursos, setCursos] = useState([]);
  const [promedioGeneral, setPromedioGeneral] = useState(0);

  useEffect(() => {
    fetchCalificaciones();
    fetchCursos();
  }, []);

  const fetchCalificaciones = async () => {
    try {
      setLoading(true);
      const response = await api.get("/calificaciones");
      setCalificaciones(response.data.data || []);

      // Calcular promedio general
      if (response.data.data && response.data.data.length > 0) {
        const total = response.data.data.reduce(
          (sum, cal) => sum + parseFloat(cal.calificacion),
          0,
        );
        setPromedioGeneral(total / response.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching calificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await api.get("/cursos");
      setCursos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cursos:", error);
    }
  };

  const getColorCalificacion = (calificacion) => {
    if (calificacion >= 90) return COLORS.success;
    if (calificacion >= 80) return "#4CAF50";
    if (calificacion >= 70) return COLORS.warning;
    return COLORS.error;
  };

  const getIconoTipo = (tipo) => {
    const iconos = {
      tarea: "📝",
      examen: "📋",
      proyecto: "📁",
      participacion: "💬",
      quiz: "❓",
      trabajo_final: "📚",
    };
    return iconos[tipo] || "📊";
  };

  const getEstadoColor = (estado) => {
    const colores = {
      borrador: COLORS.textMuted,
      publicada: COLORS.success,
      revisada: COLORS.primary,
    };
    return colores[estado] || COLORS.textMuted;
  };

  const filteredCalificaciones = calificaciones.filter((cal) => {
    if (filterTipo && cal.tipo_evaluacion !== filterTipo) return false;
    if (filterCurso && cal.curso_id !== parseInt(filterCurso)) return false;
    if (filterEstado && cal.estado !== filterEstado) return false;
    return true;
  });

  // NUEVO: Exportar calificaciones
  const handleExportar = async () => {
    try {
      if (!filterCurso) {
        alert("Selecciona un curso para exportar sus calificaciones");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/profesor/cursos/${filterCurso}/exportar-calificaciones`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al exportar calificaciones");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `calificaciones_curso_${filterCurso}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("No se pudo exportar calificaciones");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: COLORS.background,
          color: COLORS.text,
          fontFamily: FONTS.main,
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.medium,
          }}
        >
          Cargando calificaciones...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
        fontFamily: FONTS.main,
        padding: SPACING[8],
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: SPACING[8],
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: FONT_SIZES["4xl"],
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.primary,
            marginBottom: SPACING[4],
          }}
        >
          📊 Panel de Calificaciones
        </h1>
        <p
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.textMuted,
            marginBottom: SPACING[6],
          }}
        >
          Revisa tu progreso académico y calificaciones
        </p>
      </div>

      {/* Promedio General */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.primary}25)`,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING[8],
          marginBottom: SPACING[8],
          border: `1px solid ${COLORS.primary}30`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES["5xl"],
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.primary,
            marginBottom: SPACING[2],
          }}
        >
          {promedioGeneral.toFixed(1)}
        </div>
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.textMuted,
          }}
        >
          Promedio General
        </div>
      </div>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          gap: SPACING[4],
          marginBottom: SPACING[8],
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          style={{
            padding: `${SPACING[3]} ${SPACING[4]}`,
            borderRadius: BORDER_RADIUS.md,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            color: COLORS.text,
            fontSize: FONT_SIZES.base,
            minWidth: "150px",
          }}
        >
          <option value="">Todos los tipos</option>
          <option value="tarea">Tareas</option>
          <option value="examen">Exámenes</option>
          <option value="proyecto">Proyectos</option>
          <option value="participacion">Participación</option>
          <option value="quiz">Quizzes</option>
          <option value="trabajo_final">Trabajo Final</option>
        </select>

        <select
          value={filterCurso}
          onChange={(e) => setFilterCurso(e.target.value)}
          style={{
            padding: `${SPACING[3]} ${SPACING[4]}`,
            borderRadius: BORDER_RADIUS.md,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            color: COLORS.text,
            fontSize: FONT_SIZES.base,
            minWidth: "200px",
          }}
        >
          <option value="">Todos los cursos</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.titulo}
            </option>
          ))}
        </select>

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          style={{
            padding: `${SPACING[3]} ${SPACING[4]}`,
            borderRadius: BORDER_RADIUS.md,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            color: COLORS.text,
            fontSize: FONT_SIZES.base,
            minWidth: "150px",
          }}
        >
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="publicada">Publicada</option>
          <option value="revisada">Revisada</option>
        </select>
        <button
          onClick={handleExportar}
          style={{
            background: COLORS.success,
            color: COLORS.white,
            border: "none",
            borderRadius: BORDER_RADIUS.md,
            padding: "10px 22px",
            fontWeight: FONT_WEIGHTS.semibold,
            fontSize: FONT_SIZES.base,
            cursor: "pointer",
            transition: "background 0.2s",
            marginLeft: 12,
          }}
        >
          <i className="fas fa-file-excel" style={{ marginRight: 8 }}></i> Exportar Excel
        </button>
      </div>

      {/* Lista de Calificaciones */}
      <div
        style={{
          display: "grid",
          gap: SPACING[4],
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        }}
      >
        {filteredCalificaciones.map((calificacion) => (
          <div
            key={calificacion.id}
            style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.lg,
              padding: SPACING[6],
              border: `1px solid ${COLORS.border}`,
              boxShadow: SHADOWS.md,
              transition: TRANSITIONS.default,
            }}
          >
            {/* Header de la calificación */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: SPACING[4],
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING[2],
                }}
              >
                <span style={{ fontSize: FONT_SIZES.xl }}>
                  {getIconoTipo(calificacion.tipo_evaluacion)}
                </span>
                <span
                  style={{
                    fontSize: FONT_SIZES.lg,
                    fontWeight: FONT_WEIGHTS.medium,
                    textTransform: "capitalize",
                  }}
                >
                  {calificacion.tipo_evaluacion.replace("_", " ")}
                </span>
              </div>
              <div
                style={{
                  fontSize: FONT_SIZES["2xl"],
                  fontWeight: FONT_WEIGHTS.bold,
                  color: getColorCalificacion(calificacion.calificacion),
                }}
              >
                {calificacion.calificacion}
              </div>
            </div>

            {/* Información del curso */}
            <div
              style={{
                marginBottom: SPACING[3],
                padding: SPACING[3],
                background: COLORS.background,
                borderRadius: BORDER_RADIUS.md,
              }}
            >
              <div
                style={{
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.medium,
                  color: COLORS.primary,
                  marginBottom: SPACING[1],
                }}
              >
                {calificacion.curso?.titulo || "Curso no disponible"}
              </div>
              {calificacion.leccion && (
                <div
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.textMuted,
                  }}
                >
                  Lección: {calificacion.leccion.titulo}
                </div>
              )}
            </div>

            {/* Detalles */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: SPACING[3],
              }}
            >
              <div
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.textMuted,
                }}
              >
                Peso: {(calificacion.peso * 100).toFixed(1)}%
              </div>
              <div
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: getEstadoColor(calificacion.estado),
                  textTransform: "capitalize",
                }}
              >
                {calificacion.estado}
              </div>
            </div>

            {/* Comentarios */}
            {calificacion.comentarios && (
              <div
                style={{
                  padding: SPACING[3],
                  background: `${COLORS.primary}10`,
                  borderRadius: BORDER_RADIUS.md,
                  border: `1px solid ${COLORS.primary}20`,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.text,
                  fontStyle: "italic",
                }}
              >
                "{calificacion.comentarios}"
              </div>
            )}

            {/* Fecha y evaluador */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: SPACING[3],
                fontSize: FONT_SIZES.xs,
                color: COLORS.textMuted,
              }}
            >
              <div>
                {new Date(calificacion.fecha_evaluacion).toLocaleDateString(
                  "es-ES",
                )}
              </div>
              <div>Evaluado por: {calificacion.evaluador?.name || "N/A"}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay calificaciones */}
      {filteredCalificaciones.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: SPACING[12],
            color: COLORS.textMuted,
          }}
        >
          <div
            style={{ fontSize: FONT_SIZES["2xl"], marginBottom: SPACING[4] }}
          >
            📊
          </div>
          <div style={{ fontSize: FONT_SIZES.lg, marginBottom: SPACING[2] }}>
            No se encontraron calificaciones
          </div>
          <div style={{ fontSize: FONT_SIZES.base }}>
            {filterTipo || filterCurso || filterEstado
              ? "Intenta cambiar los filtros de búsqueda"
              : "Aún no tienes calificaciones registradas"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalificacionesPanel;
