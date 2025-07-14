import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useApi from "../hooks/useApi";
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

const EstudianteProgreso = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [detalleCurso, setDetalleCurso] = useState(null);

  const navigate = useNavigate();
  const { usuario } = useAuth();
  const api = useApi();

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/estudiante/materias");
      setCursos(response.data || []);
      
      if (response.data && response.data.length > 0) {
        setCursoSeleccionado(response.data[0]);
        await fetchDetalleCurso(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching cursos:", error);
      setError("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalleCurso = async (cursoId) => {
    try {
      const response = await api.get(`/cursos/${cursoId}`);
      setDetalleCurso(response.data);
    } catch (error) {
      console.error("Error fetching detalle curso:", error);
    }
  };

  const handleCursoChange = async (curso) => {
    setCursoSeleccionado(curso);
    await fetchDetalleCurso(curso.id);
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

  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 80) return COLORS.success;
    if (porcentaje >= 60) return COLORS.warning;
    return COLORS.error;
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
        <div style={{ textAlign: "center" }}>
          <Mascota width={80} height={80} />
          <div
            style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: FONT_WEIGHTS.medium,
              marginTop: SPACING[4],
            }}
          >
            Cargando progreso...
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
              Mi Progreso
            </h1>
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.textSecondary,
              }}
            >
              Revisa tu avance en todos los cursos
            </p>
          </div>
        </div>

        {cursos.length === 0 ? (
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
              No tienes cursos inscritos
            </h3>
            <p style={{ marginBottom: SPACING[6] }}>
              Inscríbete en un curso para ver tu progreso
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
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: SPACING[8] }}>
            {/* Lista de cursos */}
            <div>
              <h2
                style={{
                  fontSize: FONT_SIZES.xl,
                  fontWeight: FONT_WEIGHTS.bold,
                  marginBottom: SPACING[4],
                  color: COLORS.text,
                }}
              >
                Mis Cursos
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACING[3] }}>
                {cursos.map((curso) => (
                  <div
                    key={curso.id}
                    onClick={() => handleCursoChange(curso)}
                    style={{
                      background: cursoSeleccionado?.id === curso.id ? COLORS.primary : COLORS.surface,
                      color: cursoSeleccionado?.id === curso.id ? COLORS.white : COLORS.text,
                      padding: SPACING[4],
                      borderRadius: BORDER_RADIUS.lg,
                      cursor: "pointer",
                      transition: TRANSITIONS.base,
                      border: `1px solid ${COLORS.border}`,
                    }}
                    onMouseEnter={(e) => {
                      if (cursoSeleccionado?.id !== curso.id) {
                        e.currentTarget.style.background = COLORS.surfaceHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (cursoSeleccionado?.id !== curso.id) {
                        e.currentTarget.style.background = COLORS.surface;
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: SPACING[3],
                        marginBottom: SPACING[2],
                      }}
                    >
                      <i
                        className={getIconoMateria(curso.nombre)}
                        style={{
                          fontSize: FONT_SIZES.lg,
                          color: cursoSeleccionado?.id === curso.id ? COLORS.white : COLORS.primary,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: FONT_SIZES.md,
                            fontWeight: FONT_WEIGHTS.bold,
                            marginBottom: SPACING[1],
                          }}
                        >
                          {curso.nombre}
                        </h3>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            opacity: 0.8,
                          }}
                        >
                          Prof. {curso.profesor}
                        </p>
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div style={{ marginBottom: SPACING[2] }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: SPACING[1],
                        }}
                      >
                        <span
                          style={{
                            fontSize: FONT_SIZES.xs,
                            fontWeight: FONT_WEIGHTS.medium,
                          }}
                        >
                          Progreso
                        </span>
                        <span
                          style={{
                            fontSize: FONT_SIZES.xs,
                            fontWeight: FONT_WEIGHTS.bold,
                          }}
                        >
                          {curso.progreso || 0}%
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: cursoSeleccionado?.id === curso.id ? "rgba(255,255,255,0.3)" : COLORS.border,
                          borderRadius: BORDER_RADIUS.full,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${curso.progreso || 0}%`,
                            height: "100%",
                            background: cursoSeleccionado?.id === curso.id ? COLORS.white : getColorPorcentaje(curso.progreso || 0),
                            borderRadius: BORDER_RADIUS.full,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Calificación */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: FONT_SIZES.xs,
                          opacity: 0.8,
                        }}
                      >
                        Calificación:
                      </span>
                      <span
                        style={{
                          fontSize: FONT_SIZES.sm,
                          fontWeight: FONT_WEIGHTS.bold,
                        }}
                      >
                        {curso.calificacion || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalle del curso seleccionado */}
            {cursoSeleccionado && (
              <div>
                <div
                  style={{
                    background: COLORS.surface,
                    borderRadius: BORDER_RADIUS.lg,
                    padding: SPACING[6],
                    boxShadow: SHADOWS.md,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: SPACING[4],
                      marginBottom: SPACING[6],
                    }}
                  >
                    <i
                      className={getIconoMateria(cursoSeleccionado.nombre)}
                      style={{
                        fontSize: FONT_SIZES["2xl"],
                        color: COLORS.primary,
                      }}
                    />
                    <div>
                      <h2
                        style={{
                          fontSize: FONT_SIZES["2xl"],
                          fontWeight: FONT_WEIGHTS.bold,
                          color: COLORS.text,
                          marginBottom: SPACING[1],
                        }}
                      >
                        {cursoSeleccionado.nombre}
                      </h2>
                      <p
                        style={{
                          fontSize: FONT_SIZES.md,
                          color: COLORS.textSecondary,
                        }}
                      >
                        Prof. {cursoSeleccionado.profesor}
                      </p>
                    </div>
                  </div>

                  {/* Estadísticas generales */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: SPACING[4],
                      marginBottom: SPACING[6],
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        padding: SPACING[4],
                        background: COLORS.background,
                        borderRadius: BORDER_RADIUS.md,
                      }}
                    >
                      <div
                        style={{
                          fontSize: FONT_SIZES["2xl"],
                          fontWeight: FONT_WEIGHTS.bold,
                          color: COLORS.primary,
                          marginBottom: SPACING[1],
                        }}
                      >
                        {cursoSeleccionado.progreso || 0}%
                      </div>
                      <div
                        style={{
                          fontSize: FONT_SIZES.sm,
                          color: COLORS.textSecondary,
                          textTransform: "uppercase",
                        }}
                      >
                        Progreso General
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        padding: SPACING[4],
                        background: COLORS.background,
                        borderRadius: BORDER_RADIUS.md,
                      }}
                    >
                      <div
                        style={{
                          fontSize: FONT_SIZES["2xl"],
                          fontWeight: FONT_WEIGHTS.bold,
                          color: COLORS.success,
                          marginBottom: SPACING[1],
                        }}
                      >
                        {cursoSeleccionado.calificacion || "N/A"}
                      </div>
                      <div
                        style={{
                          fontSize: FONT_SIZES.sm,
                          color: COLORS.textSecondary,
                          textTransform: "uppercase",
                        }}
                      >
                        Calificación Promedio
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        padding: SPACING[4],
                        background: COLORS.background,
                        borderRadius: BORDER_RADIUS.md,
                      }}
                    >
                      <div
                        style={{
                          fontSize: FONT_SIZES["2xl"],
                          fontWeight: FONT_WEIGHTS.bold,
                          color: COLORS.warning,
                          marginBottom: SPACING[1],
                        }}
                      >
                        {cursoSeleccionado.tareas_pendientes || 0}
                      </div>
                      <div
                        style={{
                          fontSize: FONT_SIZES.sm,
                          color: COLORS.textSecondary,
                          textTransform: "uppercase",
                        }}
                      >
                        Tareas Pendientes
                      </div>
                    </div>
                  </div>

                  {/* Progreso detallado */}
                  <div>
                    <h3
                      style={{
                        fontSize: FONT_SIZES.xl,
                        fontWeight: FONT_WEIGHTS.bold,
                        marginBottom: SPACING[4],
                        color: COLORS.text,
                      }}
                    >
                      Progreso Detallado
                    </h3>
                    
                    {detalleCurso?.lecciones ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: SPACING[3] }}>
                        {detalleCurso.lecciones.map((leccion, index) => (
                          <div
                            key={leccion.id || index}
                            style={{
                              padding: SPACING[4],
                              background: COLORS.background,
                              borderRadius: BORDER_RADIUS.md,
                              border: `1px solid ${COLORS.border}`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: SPACING[2],
                              }}
                            >
                              <h4
                                style={{
                                  fontSize: FONT_SIZES.md,
                                  fontWeight: FONT_WEIGHTS.medium,
                                  color: COLORS.text,
                                }}
                              >
                                Lección {index + 1}: {leccion.titulo}
                              </h4>
                              <span
                                style={{
                                  fontSize: FONT_SIZES.sm,
                                  fontWeight: FONT_WEIGHTS.bold,
                                  color: COLORS.primary,
                                }}
                              >
                                {leccion.completada ? "Completada" : "Pendiente"}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: FONT_SIZES.sm,
                                color: COLORS.textSecondary,
                                marginBottom: SPACING[2],
                              }}
                            >
                              {leccion.descripcion}
                            </p>
                            <div
                              style={{
                                width: "100%",
                                height: "4px",
                                background: COLORS.border,
                                borderRadius: BORDER_RADIUS.full,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: leccion.completada ? "100%" : "0%",
                                  height: "100%",
                                  background: leccion.completada ? COLORS.success : COLORS.border,
                                  borderRadius: BORDER_RADIUS.full,
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: SPACING[8],
                          color: COLORS.textSecondary,
                        }}
                      >
                        <i
                          className="fas fa-book-open"
                          style={{
                            fontSize: FONT_SIZES["3xl"],
                            marginBottom: SPACING[4],
                            opacity: 0.5,
                          }}
                        />
                        <p>No hay lecciones disponibles para mostrar el progreso detallado</p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div
                    style={{
                      display: "flex",
                      gap: SPACING[4],
                      marginTop: SPACING[6],
                    }}
                  >
                    <button
                      onClick={() => navigate(`/estudiante/curso/${cursoSeleccionado.id}`)}
                      style={{
                        flex: 1,
                        padding: SPACING[3],
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
                      <i className="fas fa-play" style={{ marginRight: SPACING[2] }} />
                      Continuar Aprendiendo
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
                        fontSize: FONT_SIZES.md,
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
                      Ver Calificaciones
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstudianteProgreso; 