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

const EstudianteCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos"); // todos, disponibles, inscritos
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [codigoInscripcion, setCodigoInscripcion] = useState("");

  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los cursos disponibles
      const cursosResponse = await api.get("/cursos");
      
      // Obtener cursos inscritos del estudiante
      const inscripcionesResponse = await api.get("/estudiante/materias");
      
      setCursos(Array.isArray(cursosResponse.data.data) ? cursosResponse.data.data : []);
      setCursosInscritos(Array.isArray(inscripcionesResponse.data) ? inscripcionesResponse.data : []);
    } catch (error) {
      console.error("Error fetching cursos:", error);
      setError("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirse = async (curso) => {
    setCursoSeleccionado(curso);
    setMostrarModal(true);
  };

  const confirmarInscripcion = async () => {
    if (!codigoInscripcion.trim()) {
      alert("Por favor ingresa el código de inscripción");
      return;
    }

    try {
      await api.post(`/cursos/${cursoSeleccionado.id}/inscribirse`, {
        codigo: codigoInscripcion
      });
      
      alert("¡Inscripción exitosa!");
      setMostrarModal(false);
      setCodigoInscripcion("");
      fetchCursos(); // Recargar datos
    } catch (error) {
      console.error("Error al inscribirse:", error);
      alert(error.response?.data?.message || "Error al inscribirse en el curso");
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

  const cursosFiltrados = cursos.filter(curso => {
    // Filtrar por búsqueda
    if (busqueda && !curso.titulo.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }

    // Filtrar por estado
    const estaInscrito = cursosInscritos.some(inscripcion => inscripcion.id === curso.id);
    
    switch (filtro) {
      case "disponibles":
        return !estaInscrito && curso.estado === "activo";
      case "inscritos":
        return estaInscrito;
      default:
        return curso.estado === "activo";
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
            Cargando cursos...
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
              Cursos Disponibles
            </h1>
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.textSecondary,
              }}
            >
              Explora y únete a los cursos que te interesan
            </p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div
          style={{
            display: "flex",
            gap: SPACING[4],
            marginBottom: SPACING[6],
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: SPACING[2],
              background: COLORS.surface,
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.lg,
              border: `1px solid ${COLORS.border}`,
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
              Todos
            </button>
            <button
              onClick={() => setFiltro("disponibles")}
              style={{
                padding: `${SPACING[2]} ${SPACING[4]}`,
                borderRadius: BORDER_RADIUS.md,
                border: "none",
                background: filtro === "disponibles" ? COLORS.primary : "transparent",
                color: filtro === "disponibles" ? COLORS.white : COLORS.text,
                cursor: "pointer",
                transition: TRANSITIONS.base,
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.medium,
              }}
            >
              Disponibles
            </button>
            <button
              onClick={() => setFiltro("inscritos")}
              style={{
                padding: `${SPACING[2]} ${SPACING[4]}`,
                borderRadius: BORDER_RADIUS.md,
                border: "none",
                background: filtro === "inscritos" ? COLORS.primary : "transparent",
                color: filtro === "inscritos" ? COLORS.white : COLORS.text,
                cursor: "pointer",
                transition: TRANSITIONS.base,
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.medium,
              }}
            >
              Mis Cursos
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar cursos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: `${SPACING[3]} ${SPACING[4]}`,
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.surface,
              color: COLORS.text,
              fontSize: FONT_SIZES.md,
              minWidth: "250px",
              outline: "none",
            }}
          />
        </div>

        {/* Grid de cursos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: SPACING[6],
          }}
        >
          {cursosFiltrados.map((curso) => {
            const estaInscrito = cursosInscritos.some(
              (inscripcion) => inscripcion.id === curso.id
            );

            return (
              <div
                key={curso.id}
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
                {/* Imagen del curso */}
                <div
                  style={{
                    height: "200px",
                    background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.accent}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {curso.imagen_url ? (
                    <img
                      src={curso.imagen_url}
                      alt={curso.titulo}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <i
                      className={getIconoMateria(curso.titulo)}
                      style={{
                        fontSize: "3rem",
                        color: COLORS.primary,
                      }}
                    />
                  )}
                  {estaInscrito && (
                    <div
                      style={{
                        position: "absolute",
                        top: SPACING[3],
                        right: SPACING[3],
                        background: COLORS.success,
                        color: COLORS.white,
                        padding: `${SPACING[1]} ${SPACING[3]}`,
                        borderRadius: BORDER_RADIUS.full,
                        fontSize: FONT_SIZES.xs,
                        fontWeight: FONT_WEIGHTS.bold,
                      }}
                    >
                      Inscrito
                    </div>
                  )}
                </div>

                {/* Contenido del curso */}
                <div style={{ padding: SPACING[6] }}>
                  <h3
                    style={{
                      fontSize: FONT_SIZES.xl,
                      fontWeight: FONT_WEIGHTS.bold,
                      marginBottom: SPACING[2],
                      color: COLORS.text,
                    }}
                  >
                    {curso.titulo}
                  </h3>
                  <p
                    style={{
                      fontSize: FONT_SIZES.md,
                      color: COLORS.textSecondary,
                      marginBottom: SPACING[4],
                      lineHeight: 1.5,
                    }}
                  >
                    {curso.descripcion}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: SPACING[4],
                      marginBottom: SPACING[4],
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: SPACING[2],
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.textSecondary,
                      }}
                    >
                      <i className="fas fa-user" />
                      <span>{curso.instructor?.name || "Sin asignar"}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: SPACING[2],
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.textSecondary,
                      }}
                    >
                      <i className="fas fa-clock" />
                      <span>{curso.duracion || "Sin especificar"}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: SPACING[2],
                      }}
                    >
                      <span
                        style={{
                          fontSize: FONT_SIZES.sm,
                          color: COLORS.textSecondary,
                        }}
                      >
                        Nivel:
                      </span>
                      <span
                        style={{
                          fontSize: FONT_SIZES.sm,
                          fontWeight: FONT_WEIGHTS.medium,
                          color: COLORS.primary,
                          textTransform: "capitalize",
                        }}
                      >
                        {curso.nivel || "Principiante"}
                      </span>
                    </div>

                    {estaInscrito ? (
                      <button
                        onClick={() => navigate(`/estudiante/curso/${curso.id}`)}
                        style={{
                          padding: `${SPACING[2]} ${SPACING[4]}`,
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
                        Ver Curso
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInscribirse(curso)}
                        style={{
                          padding: `${SPACING[2]} ${SPACING[4]}`,
                          background: COLORS.accent,
                          color: COLORS.white,
                          border: "none",
                          borderRadius: BORDER_RADIUS.md,
                          cursor: "pointer",
                          fontSize: FONT_SIZES.sm,
                          fontWeight: FONT_WEIGHTS.medium,
                          transition: TRANSITIONS.base,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = COLORS.accentDark;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = COLORS.accent;
                        }}
                      >
                        Inscribirse
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cursosFiltrados.length === 0 && (
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
              No se encontraron cursos
            </h3>
            <p>Intenta cambiar los filtros o la búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal de inscripción */}
      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.lg,
              padding: SPACING[8],
              maxWidth: "500px",
              width: "90%",
              boxShadow: SHADOWS.xl,
            }}
          >
            <h2
              style={{
                fontSize: FONT_SIZES.xl,
                fontWeight: FONT_WEIGHTS.bold,
                marginBottom: SPACING[4],
                color: COLORS.text,
              }}
            >
              Inscribirse en {cursoSeleccionado?.titulo}
            </h2>
            <p
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.textSecondary,
                marginBottom: SPACING[6],
              }}
            >
              Ingresa el código de inscripción proporcionado por tu profesor:
            </p>
            <input
              type="text"
              placeholder="Código de inscripción"
              value={codigoInscripcion}
              onChange={(e) => setCodigoInscripcion(e.target.value)}
              style={{
                width: "100%",
                padding: SPACING[4],
                borderRadius: BORDER_RADIUS.md,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.background,
                color: COLORS.text,
                fontSize: FONT_SIZES.md,
                marginBottom: SPACING[6],
                outline: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: SPACING[4],
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setCodigoInscripcion("");
                }}
                style={{
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  background: "transparent",
                  color: COLORS.textSecondary,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  cursor: "pointer",
                  fontSize: FONT_SIZES.md,
                  fontWeight: FONT_WEIGHTS.medium,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarInscripcion}
                style={{
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  background: COLORS.primary,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: BORDER_RADIUS.md,
                  cursor: "pointer",
                  fontSize: FONT_SIZES.md,
                  fontWeight: FONT_WEIGHTS.medium,
                }}
              >
                Inscribirse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteCursos; 