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
  SCHOOL_NAME,
} from "../theme/branding/branding";
import Mascota from "../theme/branding/Mascota";
import alumnoVideo from "../assets/videos/alumno.mp4";

const EstudianteDashboard = () => {
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [showMateriaModal, setShowMateriaModal] = useState(false);
  const [showTareaModal, setShowTareaModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [comentarios, setComentarios] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tareasResponse, materiasResponse] = await Promise.all([
        api.get("/estudiante/tareas-pendientes"),
        api.get("/estudiante/materias"),
      ]);

      setTareas(Array.isArray(tareasResponse.data) ? tareasResponse.data : tareasResponse.data?.data || []);
      setMaterias(Array.isArray(materiasResponse.data) ? materiasResponse.data : materiasResponse.data?.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = COLORS.primary;
    event.currentTarget.style.background = `${COLORS.primary}10`;
  };

  const handleDragLeave = (event) => {
    event.currentTarget.style.borderColor = COLORS.border;
    event.currentTarget.style.background = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = COLORS.border;
    event.currentTarget.style.background = "";

    const file = event.dataTransfer.files[0];
    setUploadFile(file);
  };

  const handleEntregarTarea = async () => {
    if (!uploadFile) {
      alert("Por favor selecciona un archivo para subir");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("archivo", uploadFile);
      formData.append("comentarios", comentarios);

      await api.post(
        `/estudiante/tareas/${selectedTarea.id}/entregar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Tarea entregada exitosamente!");
      setShowUploadModal(false);
      setUploadFile(null);
      setComentarios("");
      fetchDashboardData(); // Recargar datos
    } catch (error) {
      console.error("Error entregando tarea:", error);
      alert("Error al entregar la tarea");
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return COLORS.error;
      case "media":
        return COLORS.warning;
      case "baja":
        return COLORS.success;
      default:
        return COLORS.textMuted;
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return COLORS.warning;
      case "vencida":
        return COLORS.error;
      case "entregada":
        return COLORS.success;
      default:
        return COLORS.textMuted;
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

  const filteredTareas = tareas.filter((tarea) => {
    if (filterMateria && tarea.materia.nombre !== filterMateria) return false;
    if (filterEstado && tarea.estado !== filterEstado) return false;
    return true;
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
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.medium,
          }}
        >
          Cargando...
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
      }}
    >
      {/* Eliminada la barra de navegación personalizada para evitar duplicidad */}

      {/* Contenido principal */}
      <div
        style={{
          paddingTop: 120,
          padding: `${SPACING[8]} ${SPACING[5]}`,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header con mascota */}
        <div
          className="dashboard-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: SPACING[10],
            marginBottom: SPACING[8],
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[8],
            boxShadow: SHADOWS.lg,
            border: `1px solid ${COLORS.border}`,
            gap: 32,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1
              style={{
                fontSize: FONT_SIZES["4xl"],
                fontWeight: FONT_WEIGHTS.bold,
                marginBottom: SPACING[3],
                color: COLORS.text,
                wordBreak: "break-word",
              }}
            >
              ¡Hola, {usuario?.name || "Estudiante"}! 👋
            </h1>
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.textSecondary,
                marginBottom: SPACING[4],
              }}
            >
              Tienes {filteredTareas.length} tareas pendientes
            </p>
            <div
              style={{
                display: "flex",
                gap: SPACING[4],
              }}
            >
              <button
                onClick={() => setShowConfigModal(true)}
                style={{
                  background: COLORS.gradientPrimary,
                  color: COLORS.text,
                  border: "none",
                  borderRadius: BORDER_RADIUS.lg,
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.semibold,
                  cursor: "pointer",
                  transition: TRANSITIONS.base,
                  boxShadow: SHADOWS.md,
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = SHADOWS.lg;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = SHADOWS.md;
                }}
              >
                <i
                  className="fas fa-cog"
                  style={{ marginRight: SPACING[2] }}
                ></i>
                Configuración
              </button>
            </div>
          </div>
          <div
            className="dashboard-header-video"
            style={{
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: BORDER_RADIUS.xl,
              background: COLORS.surfaceLight,
              boxShadow: SHADOWS.md,
              flexShrink: 0,
            }}
          >
            <video
              src={alumnoVideo}
              width="110"
              height="110"
              style={{ borderRadius: BORDER_RADIUS.xl, objectFit: "cover" }}
              autoPlay
              loop
              muted
            />
          </div>
        </div>

        {/* Filtros */}
        <div
          className="dashboard-filtros"
          style={{
            display: "flex",
            gap: SPACING[4],
            marginBottom: SPACING[6],
            flexWrap: "wrap",
          }}
        >
          <select
            value={filterMateria}
            onChange={(e) => setFilterMateria(e.target.value)}
            style={{
              padding: `${SPACING[3]} ${SPACING[4]}`,
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.lg,
              background: COLORS.surface,
              color: COLORS.text,
              fontSize: FONT_SIZES.base,
              fontWeight: FONT_WEIGHTS.medium,
              minWidth: 200,
              flex: 1,
              maxWidth: 320,
            }}
          >
            <option value="">Todas las materias</option>
            {materias.map((materia) => (
              <option key={materia.id} value={materia.nombre}>
                {materia.nombre}
              </option>
            ))}
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{
              padding: `${SPACING[3]} ${SPACING[4]}`,
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.lg,
              background: COLORS.surface,
              color: COLORS.text,
              fontSize: FONT_SIZES.base,
              fontWeight: FONT_WEIGHTS.medium,
              minWidth: 150,
              flex: 1,
              maxWidth: 220,
            }}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencida">Vencida</option>
            <option value="entregada">Entregada</option>
          </select>
        </div>

        {/* Grid de tareas */}
        <div
          className="dashboard-tareas"
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[6],
            boxShadow: SHADOWS.lg,
            border: `1px solid ${COLORS.border}`,
            marginBottom: SPACING[8],
            overflowX: "auto",
          }}
        >
          <table
            className="dashboard-tareas-table"
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    background: "#23272f",
                    color: "#fff",
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: FONT_SIZES.base,
                    padding: SPACING[4],
                    borderBottom: "3px solid #007bff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  Materia
                </th>
                <th
                  style={{
                    background: "#23272f",
                    color: "#fff",
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: FONT_SIZES.base,
                    padding: SPACING[4],
                    borderBottom: "3px solid #007bff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  Tarea
                </th>
                <th
                  style={{
                    background: "#23272f",
                    color: "#fff",
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: FONT_SIZES.base,
                    padding: SPACING[4],
                    borderBottom: "3px solid #007bff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  Fecha de Entrega
                </th>
                <th
                  style={{
                    background: "#23272f",
                    color: "#fff",
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: FONT_SIZES.base,
                    padding: SPACING[4],
                    borderBottom: "3px solid #007bff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  Prioridad
                </th>
                <th
                  style={{
                    background: "#23272f",
                    color: "#fff",
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: FONT_SIZES.base,
                    padding: SPACING[4],
                    borderBottom: "3px solid #007bff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  Estado
                </th>
                <th
                  style={{
                    background: "#23272f",
                    color: "#fff",
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: FONT_SIZES.base,
                    padding: SPACING[4],
                    borderBottom: "3px solid #007bff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTareas.map((tarea) => (
                <tr
                  key={tarea.id}
                  style={{ borderBottom: `1px solid ${COLORS.surfaceLight}` }}
                >
                  <td style={{ padding: SPACING[4] }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: SPACING[3],
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: COLORS.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: COLORS.white,
                          fontSize: FONT_SIZES.lg,
                        }}
                      >
                        <i
                          className={getIconoMateria(tarea.materia.nombre)}
                        ></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: FONT_WEIGHTS.semibold }}>
                          {tarea.materia.nombre}
                        </div>
                        <div
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: COLORS.textSecondary,
                          }}
                        >
                          {tarea.materia.instructor?.name || "Profesor"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    <div
                      style={{
                        fontWeight: FONT_WEIGHTS.semibold,
                        marginBottom: 4,
                      }}
                    >
                      {tarea.titulo}
                    </div>
                    <div
                      style={{
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.textSecondary,
                      }}
                    >
                      {tarea.descripcion}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: SPACING[4],
                      fontWeight: FONT_WEIGHTS.medium,
                    }}
                  >
                    {new Date(tarea.fecha_limite).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: SPACING[4],
                      color: getPriorityColor(tarea.prioridad),
                      fontWeight: FONT_WEIGHTS.bold,
                    }}
                  >
                    {tarea.prioridad.charAt(0).toUpperCase() +
                      tarea.prioridad.slice(1)}
                  </td>
                  <td
                    style={{
                      padding: SPACING[4],
                      color: getStatusColor(tarea.estado),
                      fontWeight: FONT_WEIGHTS.bold,
                    }}
                  >
                    {tarea.estado.charAt(0).toUpperCase() +
                      tarea.estado.slice(1)}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    <div style={{ display: "flex", gap: SPACING[2] }}>
                      <button
                        onClick={() => {
                          setSelectedTarea(tarea);
                          setShowTareaModal(true);
                        }}
                        style={{
                          background: COLORS.surfaceLight,
                          color: COLORS.text,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: BORDER_RADIUS.md,
                          padding: `${SPACING[2]} ${SPACING[4]}`,
                          fontSize: FONT_SIZES.sm,
                          cursor: "pointer",
                          fontWeight: FONT_WEIGHTS.medium,
                        }}
                      >
                        <i
                          className="fas fa-eye"
                          style={{ marginRight: 6 }}
                        ></i>{" "}
                        Ver
                      </button>
                      {tarea.estado !== "entregada" && (
                        <button
                          onClick={() => {
                            setSelectedTarea(tarea);
                            setShowUploadModal(true);
                          }}
                          style={{
                            background: COLORS.primary,
                            color: COLORS.white,
                            border: "none",
                            borderRadius: BORDER_RADIUS.md,
                            padding: `${SPACING[2]} ${SPACING[4]}`,
                            fontSize: FONT_SIZES.sm,
                            cursor: "pointer",
                            fontWeight: FONT_WEIGHTS.medium,
                          }}
                        >
                          <i
                            className="fas fa-upload"
                            style={{ marginRight: 6 }}
                          ></i>{" "}
                          Subir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grid de materias */}
        <div style={{ marginTop: SPACING[10], marginBottom: SPACING[8] }}>
          <h2
            style={{
              fontSize: FONT_SIZES["3xl"],
              fontWeight: FONT_WEIGHTS.bold,
              marginBottom: SPACING[6],
              color: COLORS.text,
            }}
          >
            Mis Materias
          </h2>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: SPACING[6],
                paddingBottom: SPACING[2],
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {materias.map((materia) => (
                <div
                  key={materia.id}
                  style={{
                    minWidth: 220,
                    height: 280,
                    background: COLORS.surface,
                    borderRadius: BORDER_RADIUS.lg,
                    overflow: "hidden",
                    boxShadow: SHADOWS.md,
                    cursor: "pointer",
                    position: "relative",
                    transition: TRANSITIONS.base,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                  onClick={() => {
                    setSelectedMateria(materia);
                    setShowMateriaModal(true);
                  }}
                >
                  <img
                    src={
                      materia.imagen ||
                      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2080"
                    }
                    alt={materia.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      padding: SPACING[4],
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                      fontSize: FONT_SIZES.lg,
                      fontWeight: FONT_WEIGHTS.bold,
                      color: COLORS.text,
                      zIndex: 2,
                      textAlign: "center",
                    }}
                  >
                    {materia.nombre}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles de tarea */}
      {showTareaModal && selectedTarea && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: COLORS.overlay,
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: SPACING[5],
          }}
        >
          <div
            style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.xl,
              padding: SPACING[8],
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: SHADOWS["2xl"],
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: SPACING[6],
              }}
            >
              <h2
                style={{
                  fontSize: FONT_SIZES["2xl"],
                  fontWeight: FONT_WEIGHTS.bold,
                  color: COLORS.text,
                  margin: 0,
                }}
              >
                {selectedTarea.titulo}
              </h2>
              <button
                onClick={() => setShowTareaModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: COLORS.textSecondary,
                  fontSize: FONT_SIZES.xl,
                  cursor: "pointer",
                  padding: SPACING[2],
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                background: COLORS.surfaceLight,
                borderRadius: BORDER_RADIUS.lg,
                padding: SPACING[4],
                marginBottom: SPACING[6],
              }}
            >
              <p
                style={{
                  color: COLORS.text,
                  fontSize: FONT_SIZES.base,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {selectedTarea.descripcion}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: SPACING[4],
                marginBottom: SPACING[6],
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.textSecondary,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  Materia
                </label>
                <p
                  style={{
                    fontSize: FONT_SIZES.base,
                    color: COLORS.text,
                    margin: 0,
                  }}
                >
                  {selectedTarea.materia.nombre}
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.textSecondary,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  Estado
                </label>
                <p
                  style={{
                    fontSize: FONT_SIZES.base,
                    color: getStatusColor(selectedTarea.estado),
                    margin: 0,
                  }}
                >
                  {selectedTarea.estado}
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.textSecondary,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  Prioridad
                </label>
                <p
                  style={{
                    fontSize: FONT_SIZES.base,
                    color: getPriorityColor(selectedTarea.prioridad),
                    margin: 0,
                  }}
                >
                  {selectedTarea.prioridad}
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.textSecondary,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  Fecha límite
                </label>
                <p
                  style={{
                    fontSize: FONT_SIZES.base,
                    color: COLORS.text,
                    margin: 0,
                  }}
                >
                  {new Date(selectedTarea.fecha_limite).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: SPACING[4],
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowTareaModal(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textSecondary,
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.medium,
                  cursor: "pointer",
                  transition: TRANSITIONS.base,
                }}
              >
                Cerrar
              </button>

              {selectedTarea.estado !== "entregada" && (
                <button
                  onClick={() => {
                    setShowTareaModal(false);
                    setShowUploadModal(true);
                  }}
                  style={{
                    background: COLORS.gradientPrimary,
                    color: COLORS.text,
                    border: "none",
                    padding: `${SPACING[3]} ${SPACING[6]}`,
                    borderRadius: BORDER_RADIUS.lg,
                    fontSize: FONT_SIZES.base,
                    fontWeight: FONT_WEIGHTS.semibold,
                    cursor: "pointer",
                    transition: TRANSITIONS.base,
                    boxShadow: SHADOWS.md,
                  }}
                >
                  Entregar Tarea
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de subida de archivo */}
      {showUploadModal && selectedTarea && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: COLORS.overlay,
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: SPACING[5],
          }}
        >
          <div
            style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.xl,
              padding: SPACING[8],
              maxWidth: 500,
              width: "100%",
              boxShadow: SHADOWS["2xl"],
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: SPACING[6],
              }}
            >
              <h2
                style={{
                  fontSize: FONT_SIZES["2xl"],
                  fontWeight: FONT_WEIGHTS.bold,
                  color: COLORS.text,
                  margin: 0,
                }}
              >
                Entregar Tarea
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: COLORS.textSecondary,
                  fontSize: FONT_SIZES.xl,
                  cursor: "pointer",
                  padding: SPACING[2],
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                background: COLORS.surfaceLight,
                borderRadius: BORDER_RADIUS.lg,
                padding: SPACING[4],
                marginBottom: SPACING[6],
                border: `2px dashed ${COLORS.border}`,
                textAlign: "center",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                style={{
                  cursor: "pointer",
                  display: "block",
                }}
              >
                <i
                  className="fas fa-cloud-upload-alt"
                  style={{
                    fontSize: FONT_SIZES["3xl"],
                    color: COLORS.primary,
                    marginBottom: SPACING[3],
                  }}
                ></i>
                <p
                  style={{
                    fontSize: FONT_SIZES.base,
                    color: COLORS.text,
                    margin: 0,
                  }}
                >
                  {uploadFile
                    ? uploadFile.name
                    : "Arrastra un archivo aquí o haz clic para seleccionar"}
                </p>
              </label>
            </div>

            <div style={{ marginBottom: SPACING[6] }}>
              <label
                style={{
                  fontSize: FONT_SIZES.base,
                  color: COLORS.text,
                  fontWeight: FONT_WEIGHTS.medium,
                  marginBottom: SPACING[2],
                  display: "block",
                }}
              >
                Comentarios (opcional)
              </label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Agrega comentarios sobre tu entrega..."
                style={{
                  width: "100%",
                  minHeight: 100,
                  padding: SPACING[3],
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.lg,
                  background: COLORS.surfaceLight,
                  color: COLORS.text,
                  fontSize: FONT_SIZES.base,
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: SPACING[4],
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textSecondary,
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.medium,
                  cursor: "pointer",
                  transition: TRANSITIONS.base,
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleEntregarTarea}
                disabled={!uploadFile}
                style={{
                  background: uploadFile
                    ? COLORS.gradientPrimary
                    : COLORS.surfaceHover,
                  color: COLORS.text,
                  border: "none",
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.semibold,
                  cursor: uploadFile ? "pointer" : "not-allowed",
                  transition: TRANSITIONS.base,
                  boxShadow: SHADOWS.md,
                }}
              >
                Entregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 700px) {
          .dashboard-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
            padding: 18px !important;
          }
          .dashboard-header-video {
            width: 100% !important;
            height: auto !important;
            margin: 0 auto 12px auto !important;
            justify-content: center !important;
          }
          .dashboard-header-video video {
            width: 100% !important;
            max-width: 220px !important;
            height: auto !important;
            margin: 0 auto !important;
            display: block !important;
          }
          .dashboard-filtros {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .dashboard-filtros select {
            min-width: 0 !important;
            max-width: 100vw !important;
            width: 100% !important;
            font-size: 1rem !important;
          }
          .dashboard-tareas {
            padding: 8px !important;
          }
          .dashboard-tareas-table {
            min-width: 520px !important;
            font-size: 0.97rem !important;
          }
          .dashboard-tareas-table th, .dashboard-tareas-table td {
            padding: 6px 4px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EstudianteDashboard;
