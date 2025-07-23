import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Mascota from "../theme/branding/Mascota";

const EstudianteInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos"); // todos, activos, completados, cancelados

  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const fetchInscripciones = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/estudiante/materias");
      setInscripciones(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching inscripciones:", error);
      setError("Error al cargar las inscripciones");
    } finally {
      setLoading(false);
    }
  };

  const getIconoMateria = (nombre) => {
    const iconos = {
      matemáticas: "fas fa-calculator",
      biología: "fas fa-dna",
      física: "fas fa-atom",
      historia: "fas fa-landmark",
      literatura: "fas fa-book",
      inglés: "fas fa-language",
      programación: "fas fa-code",
      redes: "fas fa-network-wired",
      diseño: "fas fa-palette",
      administración: "fas fa-chart-line",
    };

    for (const [palabra, icono] of Object.entries(iconos)) {
      if (nombre.toLowerCase().includes(palabra)) {
        return icono;
      }
    }
    return "fas fa-graduation-cap";
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activo":
        return COLORS.success;
      case "completado":
        return COLORS.primary;
      case "cancelado":
        return COLORS.error;
      case "suspendido":
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "activo":
        return "Activo";
      case "completado":
        return "Completado";
      case "cancelado":
        return "Cancelado";
      case "suspendido":
        return "Suspendido";
      default:
        return estado;
    }
  };

  const inscripcionesFiltradas = inscripciones.filter(inscripcion => {
    switch (filtro) {
      case "activos":
        return inscripcion.estado === "activo";
      case "completados":
        return inscripcion.estado === "completado";
      case "cancelados":
        return inscripcion.estado === "cancelado";
      default:
        return true;
    }
  });

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
        <div style={{ textAlign: "center" }}>
          <Mascota width={80} height={80} />
          <div
            style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: FONT_WEIGHTS.medium,
              marginTop: SPACING[4],
            }}
          >
            Cargando inscripciones...
          </div>
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
        padding: SPACING[6],
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: SPACING[8],
            flexWrap: "wrap",
            gap: SPACING[4],
          }}
        >
          <div>
            <h1
              style={{
                fontSize: FONT_SIZES["3xl"],
                fontWeight: FONT_WEIGHTS.bold,
                color: COLORS.text,
                marginBottom: SPACING[2],
              }}
            >
              Mis Inscripciones
            </h1>
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.textSecondary,
              }}
            >
              Gestiona tus cursos inscritos
            </p>
          </div>

          <button
            onClick={() => navigate("/estudiante/cursos")}
            style={{
              padding: `${SPACING[3]} ${SPACING[6]}`,
              background: COLORS.primary,
              color: COLORS.white,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              cursor: "pointer",
              fontSize: FONT_SIZES.md,
              fontWeight: FONT_WEIGHTS.medium,
              transition: TRANSITIONS.base,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = COLORS.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = COLORS.primary;
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: SPACING[2] }} />
            Inscribirse en Nuevo Curso
          </button>
        </div>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            gap: SPACING[2],
            marginBottom: SPACING[6],
            background: COLORS.surface,
            padding: SPACING[3],
            borderRadius: BORDER_RADIUS.lg,
            border: `1px solid ${COLORS.border}`,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setFiltro("todos")}
            style={{
              padding: `${SPACING[2]} ${SPACING[4]}`,
              borderRadius: BORDER_RADIUS.md,
              border: "none",
              background: filtro === "todos" ? COLORS.primary : "transparent",
              color: filtro === "todos" ? COLORS.white : COLORS.text,
              cursor: "pointer",
              transition: TRANSITIONS.base,
              fontSize: FONT_SIZES.sm,
              fontWeight: FONT_WEIGHTS.medium,
            }}
          >
            Todos ({inscripciones.length})
          </button>
          <button
            onClick={() => setFiltro("activos")}
            style={{
              padding: `${SPACING[2]} ${SPACING[4]}`,
              borderRadius: BORDER_RADIUS.md,
              border: "none",
              background: filtro === "activos" ? COLORS.primary : "transparent",
              color: filtro === "activos" ? COLORS.white : COLORS.text,
              cursor: "pointer",
              transition: TRANSITIONS.base,
              fontSize: FONT_SIZES.sm,
              fontWeight: FONT_WEIGHTS.medium,
            }}
          >
            Activos ({inscripciones.filter(i => i.estado === "activo").length})
          </button>
          <button
            onClick={() => setFiltro("completados")}
            style={{
              padding: `${SPACING[2]} ${SPACING[4]}`,
              borderRadius: BORDER_RADIUS.md,
              border: "none",
              background: filtro === "completados" ? COLORS.primary : "transparent",
              color: filtro === "completados" ? COLORS.white : COLORS.text,
              cursor: "pointer",
              transition: TRANSITIONS.base,
              fontSize: FONT_SIZES.sm,
              fontWeight: FONT_WEIGHTS.medium,
            }}
          >
            Completados ({inscripciones.filter(i => i.estado === "completado").length})
          </button>
        </div>

        {/* Lista de inscripciones */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: SPACING[6],
          }}
        >
          {inscripcionesFiltradas.map((inscripcion) => (
            <div
              key={inscripcion.id}
              style={{
                background: COLORS.surface,
                borderRadius: BORDER_RADIUS.lg,
                overflow: "hidden",
                boxShadow: SHADOWS.md,
                border: `1px solid ${COLORS.border}`,
                transition: TRANSITIONS.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = SHADOWS.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = SHADOWS.md;
              }}
            >
              {/* Header con estado */}
              <div
                style={{
                  padding: SPACING[4],
                  background: `${getEstadoColor(inscripcion.estado)}10`,
                  borderBottom: `1px solid ${COLORS.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: SPACING[3],
                  }}
                >
                  <i
                    className={getIconoMateria(inscripcion.nombre)}
                    style={{
                      fontSize: FONT_SIZES.xl,
                      color: getEstadoColor(inscripcion.estado),
                    }}
                  />
                  <div>
                    <h3
                      style={{
                        fontSize: FONT_SIZES.lg,
                        fontWeight: FONT_WEIGHTS.bold,
                        color: COLORS.text,
                        marginBottom: SPACING[1],
                      }}
                    >
                      {inscripcion.nombre}
                    </h3>
                    <p
                      style={{
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.textSecondary,
                      }}
                    >
                      Prof. {inscripcion.profesor}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    padding: `${SPACING[1]} ${SPACING[3]}`,
                    background: getEstadoColor(inscripcion.estado),
                    color: COLORS.white,
                    borderRadius: BORDER_RADIUS.full,
                    fontSize: FONT_SIZES.xs,
                    fontWeight: FONT_WEIGHTS.bold,
                    textTransform: "uppercase",
                  }}
                >
                  {getEstadoTexto(inscripcion.estado)}
                </span>
              </div>

              {/* Contenido */}
              <div style={{ padding: SPACING[6] }}>
                {/* Progreso */}
                <div style={{ marginBottom: SPACING[4] }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: SPACING[2],
                    }}
                  >
                    <span
                      style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: FONT_WEIGHTS.medium,
                        color: COLORS.text,
                      }}
                    >
                      Progreso del curso
                    </span>
                    <span
                      style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: FONT_WEIGHTS.bold,
                        color: COLORS.primary,
                      }}
                    >
                      {inscripcion.progreso || 0}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: COLORS.border,
                      borderRadius: BORDER_RADIUS.full,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${inscripcion.progreso || 0}%`,
                        height: "100%",
                        background: COLORS.primary,
                        borderRadius: BORDER_RADIUS.full,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Estadísticas */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: SPACING[4],
                    marginBottom: SPACING[4],
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: SPACING[3],
                      background: COLORS.background,
                      borderRadius: BORDER_RADIUS.md,
                    }}
                  >
                    <div
                      style={{
                        fontSize: FONT_SIZES.xl,
                        fontWeight: FONT_WEIGHTS.bold,
                        color: COLORS.primary,
                        marginBottom: SPACING[1],
                      }}
                    >
                      {inscripcion.calificacion || "N/A"}
                    </div>
                    <div
                      style={{
                        fontSize: FONT_SIZES.xs,
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                      }}
                    >
                      Calificación
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: SPACING[3],
                      background: COLORS.background,
                      borderRadius: BORDER_RADIUS.md,
                    }}
                  >
                    <div
                      style={{
                        fontSize: FONT_SIZES.xl,
                        fontWeight: FONT_WEIGHTS.bold,
                        color: COLORS.warning,
                        marginBottom: SPACING[1],
                      }}
                    >
                      {inscripcion.tareas_pendientes || 0}
                    </div>
                    <div
                      style={{
                        fontSize: FONT_SIZES.xs,
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                      }}
                    >
                      Tareas Pendientes
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div
                  style={{
                    display: "flex",
                    gap: SPACING[3],
                  }}
                >
                  <button
                    onClick={() => navigate(`/estudiante/curso/${inscripcion.id}`)}
                    style={{
                      flex: 1,
                      padding: SPACING[3],
                      background: COLORS.primary,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: BORDER_RADIUS.md,
                      cursor: "pointer",
                      fontSize: FONT_SIZES.sm,
                      fontWeight: FONT_WEIGHTS.medium,
                      transition: TRANSITIONS.base,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = COLORS.primaryDark;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = COLORS.primary;
                    }}
                  >
                    <i className="fas fa-play" style={{ marginRight: SPACING[2] }} />
                    Continuar
                  </button>
                  <button
                    onClick={() => navigate("/estudiante/calificaciones")}
                    style={{
                      flex: 1,
                      padding: SPACING[3],
                      background: "transparent",
                      color: COLORS.primary,
                      border: `1px solid ${COLORS.primary}`,
                      borderRadius: BORDER_RADIUS.md,
                      cursor: "pointer",
                      fontSize: FONT_SIZES.sm,
                      fontWeight: FONT_WEIGHTS.medium,
                      transition: TRANSITIONS.base,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = COLORS.primary;
                      e.target.style.color = COLORS.white;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = COLORS.primary;
                    }}
                  >
                    <i className="fas fa-chart-line" style={{ marginRight: SPACING[2] }} />
                    Calificaciones
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {inscripcionesFiltradas.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: SPACING[12],
              color: COLORS.textSecondary,
            }}
          >
            <Mascota width={100} height={100} />
            <h3
              style={{
                fontSize: FONT_SIZES.xl,
                fontWeight: FONT_WEIGHTS.medium,
                marginTop: SPACING[4],
                marginBottom: SPACING[2],
              }}
            >
              No tienes inscripciones
            </h3>
            <p style={{ marginBottom: SPACING[6] }}>
              {filtro === "todos" 
                ? "Aún no te has inscrito en ningún curso"
                : "No hay inscripciones con el filtro seleccionado"
              }
            </p>
            <button
              onClick={() => navigate("/estudiante/cursos")}
              style={{
                padding: `${SPACING[3]} ${SPACING[6]}`,
                background: COLORS.primary,
                color: COLORS.white,
                border: "none",
                borderRadius: BORDER_RADIUS.md,
                cursor: "pointer",
                fontSize: FONT_SIZES.md,
                fontWeight: FONT_WEIGHTS.medium,
                transition: TRANSITIONS.base,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = COLORS.primaryDark;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = COLORS.primary;
              }}
            >
              Explorar Cursos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstudianteInscripciones; 