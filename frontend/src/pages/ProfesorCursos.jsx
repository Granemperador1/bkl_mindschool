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

const ProfesorCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos"); // todos, activos, inactivos
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formCurso, setFormCurso] = useState({
    titulo: "",
    descripcion: "",
    cuatrimestre: "",
    imagen: "",
    duracion: "",
    nivel: "principiante",
    estado: "activo",
  });
  const [creandoCurso, setCreandoCurso] = useState(false);

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

      const response = await api.get("/profesor/cursos");
      setCursos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cursos:", error);
      setError("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCurso = async (e) => {
    e.preventDefault();
    
    if (!formCurso.titulo.trim() || !formCurso.descripcion.trim()) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setCreandoCurso(true);
      await api.post("/cursos", formCurso);
      
      alert("¡Curso creado exitosamente!");
      setMostrarModal(false);
      setFormCurso({
        titulo: "",
        descripcion: "",
        cuatrimestre: "",
        imagen: "",
        duracion: "",
        nivel: "principiante",
        estado: "activo",
      });
      fetchCursos(); // Recargar datos
    } catch (error) {
      console.error("Error al crear curso:", error);
      alert(error.response?.data?.message || "Error al crear el curso");
    } finally {
      setCreandoCurso(false);
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
      case "inactivo":
        return COLORS.error;
      case "borrador":
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const cursosFiltrados = cursos.filter(curso => {
    // Filtrar por búsqueda
    if (busqueda && !curso.titulo.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }

    // Filtrar por estado
    switch (filtro) {
      case "activos":
        return curso.estado === "activo";
      case "inactivos":
        return curso.estado === "inactivo";
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
              Mis Cursos
            </h1>
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.textSecondary,
              }}
            >
              Gestiona y administra tus cursos
            </p>
          </div>

          <button
            onClick={() => setMostrarModal(true)}
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
            Crear Nuevo Curso
          </button>
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
              Activos
            </button>
            <button
              onClick={() => setFiltro("inactivos")}
              style={{
                padding: `${SPACING[2]} ${SPACING[4]}`,
                borderRadius: BORDER_RADIUS.md,
                border: "none",
                background: filtro === "inactivos" ? COLORS.primary : "transparent",
                color: filtro === "inactivos" ? COLORS.white : COLORS.text,
                cursor: "pointer",
                transition: TRANSITIONS.base,
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.medium,
              }}
            >
              Inactivos
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
          {cursosFiltrados.map((curso) => (
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
                <div
                  style={{
                    position: "absolute",
                    top: SPACING[3],
                    right: SPACING[3],
                    background: getEstadoColor(curso.estado),
                    color: COLORS.white,
                    padding: `${SPACING[1]} ${SPACING[3]}`,
                    borderRadius: BORDER_RADIUS.full,
                    fontSize: FONT_SIZES.xs,
                    fontWeight: FONT_WEIGHTS.bold,
                    textTransform: "uppercase",
                  }}
                >
                  {curso.estado}
                </div>
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
                    <i className="fas fa-users" />
                    <span>{curso.inscripciones?.length || 0} estudiantes</span>
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
                      Cuatrimestre:
                    </span>
                    <span
                      style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: FONT_WEIGHTS.medium,
                        color: COLORS.accent,
                      }}
                    >
                      {curso.cuatrimestre || "No especificado"}
                    </span>
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
                    onClick={() => navigate(`/profesor/dashboard?curso=${curso.id}`)}
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
                    <i className="fas fa-cog" style={{ marginRight: SPACING[2] }} />
                    Gestionar
                  </button>
                  <button
                    onClick={() => navigate(`/profesor/estudiantes?curso=${curso.id}`)}
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
                    <i className="fas fa-users" style={{ marginRight: SPACING[2] }} />
                    Estudiantes
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              No tienes cursos
            </h3>
            <p style={{ marginBottom: SPACING[6] }}>
              {filtro === "todos" 
                ? "Aún no has creado ningún curso"
                : "No hay cursos con el filtro seleccionado"
              }
            </p>
            <button
              onClick={() => setMostrarModal(true)}
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
              Crear Primer Curso
            </button>
          </div>
        )}
      </div>

      {/* Modal de crear curso */}
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
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: SHADOWS.xl,
            }}
          >
            <h2
              style={{
                fontSize: FONT_SIZES.xl,
                fontWeight: FONT_WEIGHTS.bold,
                marginBottom: SPACING[6],
                color: COLORS.text,
              }}
            >
              Crear Nuevo Curso
            </h2>
            
            <form onSubmit={handleCrearCurso}>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACING[4] }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: SPACING[2],
                      fontSize: FONT_SIZES.md,
                      fontWeight: FONT_WEIGHTS.medium,
                      color: COLORS.text,
                    }}
                  >
                    Título del Curso *
                  </label>
                  <input
                    type="text"
                    value={formCurso.titulo}
                    onChange={(e) => setFormCurso({...formCurso, titulo: e.target.value})}
                    required
                    style={{
                      width: "100%",
                      padding: SPACING[3],
                      borderRadius: BORDER_RADIUS.md,
                      border: `1px solid ${COLORS.border}`,
                      background: COLORS.background,
                      color: COLORS.text,
                      fontSize: FONT_SIZES.md,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: SPACING[2],
                      fontSize: FONT_SIZES.md,
                      fontWeight: FONT_WEIGHTS.medium,
                      color: COLORS.text,
                    }}
                  >
                    Descripción *
                  </label>
                  <textarea
                    value={formCurso.descripcion}
                    onChange={(e) => setFormCurso({...formCurso, descripcion: e.target.value})}
                    required
                    rows={4}
                    style={{
                      width: "100%",
                      padding: SPACING[3],
                      borderRadius: BORDER_RADIUS.md,
                      border: `1px solid ${COLORS.border}`,
                      background: COLORS.background,
                      color: COLORS.text,
                      fontSize: FONT_SIZES.md,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACING[4] }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: SPACING[2],
                        fontSize: FONT_SIZES.md,
                        fontWeight: FONT_WEIGHTS.medium,
                        color: COLORS.text,
                      }}
                    >
                      Cuatrimestre
                    </label>
                    <input
                      type="text"
                      value={formCurso.cuatrimestre}
                      onChange={(e) => setFormCurso({...formCurso, cuatrimestre: e.target.value})}
                      style={{
                        width: "100%",
                        padding: SPACING[3],
                        borderRadius: BORDER_RADIUS.md,
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.background,
                        color: COLORS.text,
                        fontSize: FONT_SIZES.md,
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: SPACING[2],
                        fontSize: FONT_SIZES.md,
                        fontWeight: FONT_WEIGHTS.medium,
                        color: COLORS.text,
                      }}
                    >
                      Duración
                    </label>
                    <input
                      type="text"
                      value={formCurso.duracion}
                      onChange={(e) => setFormCurso({...formCurso, duracion: e.target.value})}
                      placeholder="ej: 8 semanas"
                      style={{
                        width: "100%",
                        padding: SPACING[3],
                        borderRadius: BORDER_RADIUS.md,
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.background,
                        color: COLORS.text,
                        fontSize: FONT_SIZES.md,
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACING[4] }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: SPACING[2],
                        fontSize: FONT_SIZES.md,
                        fontWeight: FONT_WEIGHTS.medium,
                        color: COLORS.text,
                      }}
                    >
                      Nivel
                    </label>
                    <select
                      value={formCurso.nivel}
                      onChange={(e) => setFormCurso({...formCurso, nivel: e.target.value})}
                      style={{
                        width: "100%",
                        padding: SPACING[3],
                        borderRadius: BORDER_RADIUS.md,
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.background,
                        color: COLORS.text,
                        fontSize: FONT_SIZES.md,
                        outline: "none",
                      }}
                    >
                      <option value="principiante">Principiante</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: SPACING[2],
                        fontSize: FONT_SIZES.md,
                        fontWeight: FONT_WEIGHTS.medium,
                        color: COLORS.text,
                      }}
                    >
                      Estado
                    </label>
                    <select
                      value={formCurso.estado}
                      onChange={(e) => setFormCurso({...formCurso, estado: e.target.value})}
                      style={{
                        width: "100%",
                        padding: SPACING[3],
                        borderRadius: BORDER_RADIUS.md,
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.background,
                        color: COLORS.text,
                        fontSize: FONT_SIZES.md,
                        outline: "none",
                      }}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="borrador">Borrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: SPACING[2],
                      fontSize: FONT_SIZES.md,
                      fontWeight: FONT_WEIGHTS.medium,
                      color: COLORS.text,
                    }}
                  >
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formCurso.imagen}
                    onChange={(e) => setFormCurso({...formCurso, imagen: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    style={{
                      width: "100%",
                      padding: SPACING[3],
                      borderRadius: BORDER_RADIUS.md,
                      border: `1px solid ${COLORS.border}`,
                      background: COLORS.background,
                      color: COLORS.text,
                      fontSize: FONT_SIZES.md,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: SPACING[4],
                  justifyContent: "flex-end",
                  marginTop: SPACING[6],
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setFormCurso({
                      titulo: "",
                      descripcion: "",
                      cuatrimestre: "",
                      imagen: "",
                      duracion: "",
                      nivel: "principiante",
                      estado: "activo",
                    });
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
                  type="submit"
                  disabled={creandoCurso}
                  style={{
                    padding: `${SPACING[3]} ${SPACING[6]}`,
                    background: creandoCurso ? COLORS.textSecondary : COLORS.primary,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: BORDER_RADIUS.md,
                    cursor: creandoCurso ? "not-allowed" : "pointer",
                    fontSize: FONT_SIZES.md,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  {creandoCurso ? "Creando..." : "Crear Curso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesorCursos; 