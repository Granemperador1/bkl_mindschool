import React, { useState, useEffect, useRef } from "react";
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
import PerfilForm from '../componentes/Perfil/PerfilForm';
import CambiarPasswordForm from '../componentes/Perfil/CambiarPasswordForm';

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
  const [entregaArchivos, setEntregaArchivos] = useState([]);
  const [comentarios, setComentarios] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [paying, setPaying] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const [showFormPago, setShowFormPago] = useState(false);
  const [formPago, setFormPago] = useState({
    nombre: "",
    tarjeta: "",
    expiracion: "",
    cvv: ""
  });
  const [payStep, setPayStep] = useState(0); // 0: área, 1: doc/profesor (si prof), 2: datos bancarios, 3: resumen/pago
  const [area, setArea] = useState(localStorage.getItem("area_usuario") || "");
  const [docProfesor, setDocProfesor] = useState(null);
  const [docTexto, setDocTexto] = useState("");
  const [docSubido, setDocSubido] = useState(false);
  const [aprobadoProfesor, setAprobadoProfesor] = useState(localStorage.getItem("aprobado_profesor") === "si");
  const fileInputRef = useRef();

  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Cambia la clave de localStorage para incluir el mes y año actual
  const getPagoKey = () => {
    const now = new Date();
    return `pago_mensualidad_${now.getFullYear()}_${now.getMonth() + 1}`;
  };

  useEffect(() => {
    const pago = localStorage.getItem(getPagoKey());
    const areaSaved = localStorage.getItem("area_usuario");
    if (!pago || !areaSaved) setShowPaywall(true);
  }, []);

  const handleSelectArea = (a) => {
    setArea(a);
    localStorage.setItem("area_usuario", a);
    setPayStep(a === "profesor" ? 1 : 2);
  };

  const handleInputPago = (e) => {
    setFormPago({ ...formPago, [e.target.name]: e.target.value });
  };

  const handleUploadDoc = (e) => {
    const file = e.target.files[0];
    setDocProfesor(file);
    setDocSubido(!!file);
  };

  const handleEnviarEvidencia = (e) => {
    e.preventDefault();
    if (!docProfesor || !docTexto) {
      setErrorPago("Sube tu documentación y escribe una referencia");
      return;
    }
    // Simula notificación al admin
    alert("¡Documentación enviada al admin! Se te notificará cuando seas aprobado como profesor.");
    localStorage.setItem("doc_profesor", "enviado");
    setPayStep(2);
    setErrorPago("");
    // Simula aprobación admin tras 5s (en real, esperar backend)
    setTimeout(() => {
      setAprobadoProfesor(true);
      localStorage.setItem("aprobado_profesor", "si");
      alert("¡Has sido aprobado como profesor! Ahora puedes realizar el pago y acceder a todas las funciones.");
    }, 5000);
  };

  const handlePagarMensualidad = async (e) => {
    e?.preventDefault?.();
    setPaying(true);
    setErrorPago("");
    if (!formPago.nombre || !formPago.tarjeta || !formPago.expiracion || !formPago.cvv) {
      setErrorPago("Completa todos los campos bancarios");
      setPaying(false);
      return;
    }
    if (area === "profesor" && !aprobadoProfesor) {
      setErrorPago("Debes esperar la aprobación del admin antes de pagar.");
      setPaying(false);
      return;
    }
    try {
      await new Promise((res) => setTimeout(res, 1200));
      localStorage.setItem(getPagoKey(), "ok");
      setPagoExitoso(true);
      setTimeout(() => {
        setShowPaywall(false);
        setPagoExitoso(false);
        setShowFormPago(false);
        setFormPago({ nombre: "", tarjeta: "", expiracion: "", cvv: "" });
        setPayStep(0);
      }, 1200);
    } catch (e) {
      setErrorPago("Error al procesar el pago. Intenta de nuevo.");
    } finally {
      setPaying(false);
    }
  };

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

      // 1. Crear la entrega (POST a /estudiante/tareas/{id}/entregar)
      const entregaRes = await api.post(
        `/estudiante/tareas/${selectedTarea.id}/entregar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // 2. Subir archivo multimedia a /api/multimedia si la entrega fue exitosa
      if (entregaRes.data && entregaRes.data.entrega && entregaRes.data.entrega.id) {
        const multimediaForm = new FormData();
        multimediaForm.append("file", uploadFile);
        multimediaForm.append("context", "entrega");
        multimediaForm.append("context_id", entregaRes.data.entrega.id);
        multimediaForm.append("type", uploadFile.type.startsWith("video") ? "video" : uploadFile.type.startsWith("image") ? "imagen" : "documento");
        await api.post("/multimedia", multimediaForm, { headers: { "Content-Type": "multipart/form-data" } });
        // Obtener archivos multimedia de la entrega
        const archivosRes = await api.get(`/multimedia/entrega/${entregaRes.data.entrega.id}`);
        setEntregaArchivos(archivosRes.data || []);
      }

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
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              background: COLORS.surface,
              borderRadius: 12,
              maxWidth: 420,
              width: "90vw",
              padding: 32,
              boxShadow: SHADOWS.lg,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 18 }}>
              Entregar Tarea
            </h2>
            <input
              type="file"
              accept="video/*,image/*,application/pdf"
              onChange={handleFileUpload}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <textarea
              placeholder="Comentarios (opcional)"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              style={{ width: "100%", minHeight: 60, marginBottom: 16, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
            />
            <button
              onClick={handleEntregarTarea}
              style={{
                background: COLORS.primary,
                color: COLORS.white,
                border: "none",
                borderRadius: BORDER_RADIUS.md,
                padding: `${SPACING[3]} ${SPACING[6]}`,
                fontSize: FONT_SIZES.base,
                fontWeight: FONT_WEIGHTS.semibold,
                cursor: "pointer",
                transition: TRANSITIONS.base,
                boxShadow: SHADOWS.md,
                width: "100%",
              }}
            >
              Subir Entrega
            </button>
            {/* Previsualización del archivo subido */}
            <PreviewArchivosDirect archivos={entregaArchivos} />
          </div>
        </div>
      )}

      {/* Modal de configuración de perfil y contraseña */}
      {showConfigModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.6)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setShowConfigModal(false)}
        >
          <div
            style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.xl,
              padding: 36,
              maxWidth: 480,
              width: "90vw",
              boxShadow: SHADOWS["2xl"],
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowConfigModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: COLORS.error,
                color: COLORS.white,
                border: "none",
                borderRadius: 6,
                padding: "4px 12px",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                zIndex: 2
              }}
            >✕</button>
            <h2 style={{ color: COLORS.primary, fontWeight: 700, marginBottom: 18 }}>Editar mis datos</h2>
            <PerfilForm />
            <hr style={{ margin: '32px 0', border: `1px solid ${COLORS.border}` }} />
            <CambiarPasswordForm />
          </div>
        </div>
      )}

      {/* MODAL DE WIZARD DE REGISTRO Y PAGO */}
      {showPaywall && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 40, minWidth: 320, maxWidth: 420, boxShadow: "0 8px 32px #0002", textAlign: "center", position: "relative" }}>
            {/* Flechita de regreso */}
            {payStep > 0 && (
              <button
                onClick={() => {
                  setPayStep(0);
                  setErrorPago("");
                }}
                style={{
                  position: "absolute", left: 16, top: 16, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#6366f1"
                }}
                aria-label="Regresar"
              >
                ←
              </button>
            )}
            <h2 style={{ color: "#1e293b", marginBottom: 16 }}>Bienvenido a MindSchool</h2>
            {payStep === 0 && (
              <>
                <p style={{ color: "#475569", marginBottom: 24 }}>
                  El primer mes es <b>gratis</b>.<br/>
                  El segundo mes se pagará <b>$100</b> (alumno) o <b>$50</b> (profesor) con acceso a todo el contenido.<br/>
                  Selecciona tu área para continuar:
                </p>
                <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 24 }}>
                  <button onClick={() => handleSelectArea("alumno")} style={{ padding: "12px 32px", background: area === "alumno" ? "#6366f1" : "#e0e7ef", color: area === "alumno" ? "#fff" : "#334155", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Alumno</button>
                  <button onClick={() => handleSelectArea("profesor")} style={{ padding: "12px 32px", background: area === "profesor" ? "#6366f1" : "#e0e7ef", color: area === "profesor" ? "#fff" : "#334155", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Profesor</button>
                </div>
              </>
            )}
            {payStep === 1 && area === "profesor" && (
              <form onSubmit={handleEnviarEvidencia} style={{ textAlign: "left" }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 500, color: "#334155" }}>Sube tu documentación (PDF/JPG)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" ref={fileInputRef} onChange={handleUploadDoc} style={{ width: "100%", marginTop: 4 }} />
                  {docSubido && <span style={{ color: "#22c55e", fontSize: 13 }}>Archivo subido</span>}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 500, color: "#334155" }}>Referencia o texto de aval</label>
                  <textarea value={docTexto} onChange={e => setDocTexto(e.target.value)} rows={3} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", marginTop: 4 }} />
                </div>
                <button type="submit" style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer", width: "100%" }}>
                  Enviar evidencia y notificar admin
                </button>
              </form>
            )}
            {((payStep === 2 && area === "profesor") || (payStep === 2 && area === "alumno")) && (
              <form onSubmit={(e) => { e.preventDefault(); setPayStep(3); }} style={{ textAlign: "left" }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 500, color: "#334155" }}>Nombre en la tarjeta</label>
                  <input name="nombre" value={formPago.nombre} onChange={handleInputPago} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 500, color: "#334155" }}>Número de tarjeta</label>
                  <input name="tarjeta" value={formPago.tarjeta} onChange={handleInputPago} maxLength={16} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", marginTop: 4 }} />
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, color: "#334155" }}>Expiración</label>
                    <input name="expiracion" value={formPago.expiracion} onChange={handleInputPago} placeholder="MM/AA" maxLength={5} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", marginTop: 4 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, color: "#334155" }}>CVV</label>
                    <input name="cvv" value={formPago.cvv} onChange={handleInputPago} maxLength={4} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", marginTop: 4 }} />
                  </div>
                </div>
                <button type="submit" style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer", width: "100%" }}>
                  Continuar
                </button>
              </form>
            )}
            {payStep === 3 && (
              <form onSubmit={handlePagarMensualidad} style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 18, color: "#475569" }}>
                  {area === "alumno" ? (
                    <>
                      <b>¡Primer mes gratis!</b><br/>
                      A partir del segundo mes pagarás <b>$100 MXN/mes</b> y tendrás acceso a todos los cursos.
                    </>
                  ) : (
                    <>
                      <b>¡Primer mes gratis!</b><br/>
                      A partir del segundo mes pagarás <b>$50 MXN/mes</b> y tendrás acceso a todas las funciones de profesor.<br/>
                      Tu documentación fue revisada y aprobada por el admin.
                    </>
                  )}
                </div>
                <button type="submit" disabled={paying || (area === "profesor" && !aprobadoProfesor)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: paying ? "not-allowed" : "pointer", width: "100%" }}>
                  {paying ? "Procesando..." : area === "alumno" ? "Finalizar y acceder" : !aprobadoProfesor ? "Esperando aprobación..." : "Pagar y acceder"}
                </button>
              </form>
            )}
            {errorPago && <div style={{ color: "#ef4444", marginTop: 12 }}>{errorPago}</div>}
            {pagoExitoso && <div style={{ color: "#22c55e", fontWeight: 600, marginTop: 16 }}>¡Registro y pago exitoso!</div>}
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

// Componente para previsualizar archivos multimedia (recibe prop archivos directamente)
function PreviewArchivosDirect({ archivos }) {
  if (!archivos || !archivos.length) return null;
  return (
    <div style={{ marginTop: 12, display: "flex", gap: 16, flexWrap: "wrap" }}>
      {archivos.map((a) => (
        <div key={a._id} style={{ maxWidth: 220 }}>
          {a.type === "video" ? (
            <video src={a.url} controls style={{ width: "100%", borderRadius: 8 }} />
          ) : a.type === "imagen" ? (
            <img src={a.url} alt={a.filename} style={{ width: "100%", borderRadius: 8 }} />
          ) : a.type === "documento" ? (
            <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.primary }}>
              <i className="fas fa-file-pdf" style={{ fontSize: 32 }}></i> {a.filename}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default EstudianteDashboard;
