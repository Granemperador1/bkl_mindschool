import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
import api from "../utils/axiosConfig";
import CuatrimestreSelector from "../components/profesor/CuatrimestreSelector";
import MateriasGrid from "../components/profesor/MateriasGrid";
import GruposMenu from "../components/profesor/GruposMenu";
import GrupoDetalle from "../components/profesor/GrupoDetalle";
import TareaModal from "../components/profesor/TareaModal";
import CalificarModal from "../components/profesor/CalificarModal";
import DetalleTareaModal from "../components/profesor/DetalleTareaModal";
import GestionAlumnosCurso from "../components/profesor/GestionAlumnosCurso";
import CursosServicio from "../servicios/CursosServicio";

// Eliminar los datos mock de cuatrimestres y materias

function ProfesorPanel() {
  const { usuario, isProfesorEspecial } = useAuth();
  const navigate = useNavigate();
  const [cuatrimestreSeleccionado, setCuatrimestreSeleccionado] =
    useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [materiasPorCuatrimestre, setMateriasPorCuatrimestre] = useState({});
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [cursoGestionAlumnos, setCursoGestionAlumnos] = useState(null);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [codigoInvitacion, setCodigoInvitacion] = useState("");
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  // 1. Estado para el formulario de creación de curso
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
  const [mensajeCurso, setMensajeCurso] = useState("");
  const [errorCurso, setErrorCurso] = useState("");
  const formRef = useRef(null);

  // --- PROFESORES ESPECIALES ---
  const SEMESTRES_ESPECIALES = [
    {
      key: "1",
      nombre: "Primer semestre de bachillerato",
      imagen: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
      materias: [
        "HISTORIA DE MEXICO 1",
        "INGLES",
        "MANTENIMIENTO Y REDES DE COMPUTO",
        "GEOGRAFIA",
        "DERECHO",
        "PROBABILIDAD Y ESTADISTICA",
        "VIDA SALUDABLE",
        "FILOSOFIA",
        "ECOLOGIA Y MEDIO AMBIENTE",
        "DISEÑO DIGITAL",
      ],
    },
    {
      key: "2",
      nombre: "Segundo semestre de bachillerato",
      imagen: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
      materias: [
        "BIOLOGIA 2",
        "LITERATURA 2",
        "MANTENIMIENTO Y REDES DE COMPUTO",
        "GEOGRAFIA",
        "ESTRUCTURA SOCIOECONOMICA DE MEXICO",
        "DERECHO 1",
        "VIDA SALUDABLE",
        "FILOSOFIA",
        "ECOLOGIA Y MEDIO AMBIENTE",
        "MUNDO DE EMOCIONES",
      ],
    },
    {
      key: "3",
      nombre: "Tercer semestre de bachillerato",
      imagen: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
      materias: [
        "QUIMICA 2",
        "MATEMATICAS 1V",
        "BIOLOGIA 2",
        "FISICA 2",
        "HISTORIA DE MEXICO 2",
        "INGLES 1V",
        "GEOGRAFIA",
        "VIDA SALUDABLE",
        "FILOSOFIA",
        "ECOLOGIA Y MEDIO AMBIENTE",
      ],
    },
  ];
  const [semestreEspecialSeleccionado, setSemestreEspecialSeleccionado] = useState(null);
  // Estado para materia especial seleccionada
  const [materiaEspecialSeleccionada, setMateriaEspecialSeleccionada] = useState(null);
  const [activeTab, setActiveTab] = useState("calendario");
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [showCrearGrupoModal, setShowCrearGrupoModal] = useState(false);

  // 1. Agregar función para validar formato de imagen
  const esUrlImagenValida = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  };

  // Función para cargar datos de la materia especial
  const cargarDatosMateriaEspecial = async (materia) => {
    try {
      // Simular carga de datos para materias especiales
      // En un caso real, aquí harías llamadas a la API
      setGrupos([
        {
          id: 1,
          nombre: "Grupo A",
          descripcion: "Grupo principal de la materia",
          codigo: "GRP001",
          capacidad_maxima: 25,
          miembros: []
        }
      ]);
      
      setAlumnos([
        {
          id: 1,
          name: "Juan Pérez",
          email: "juan@ejemplo.com",
          racha_entregas: 5
        },
        {
          id: 2,
          name: "María García",
          email: "maria@ejemplo.com",
          racha_entregas: 8
        }
      ]);
      
      setTareas([
        {
          id: 1,
          titulo: "Tarea 1: Introducción",
          descripcion: "Primera tarea de la materia",
          fecha_entrega: "2025-08-15",
          tipo: "archivo",
          estado: "Activa"
        }
      ]);
    } catch (error) {
      console.error("Error cargando datos de materia especial:", error);
    }
  };

  // Cargar cursos/materias del profesor
  useEffect(() => {
    const fetchMaterias = async () => {
      setLoadingMaterias(true);
      try {
        // Intentar cargar desde la API real
        const res = await api.get("/profesor/cursos");
        console.log("Respuesta de /profesor/cursos:", res.data);
        const materiasAgrupadas = {};
        res.data.data.forEach((curso) => {
          const cuatri = curso.cuatrimestre || "otros";
          if (!materiasAgrupadas[cuatri]) materiasAgrupadas[cuatri] = [];
          materiasAgrupadas[cuatri].push({
            id: curso.id,
            nombre: curso.titulo,
            imagen:
              curso.imagen ||
              "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=2074",
            grupos: [
              {
                id: 1,
                nombre: "Grupo Único",
                alumnos: (curso.inscripciones || []).map(
                  (i) => i.alumno?.name || "Alumno",
                ),
                tareas: (curso.lecciones || []).map((l) => l.titulo),
              },
            ],
          });
        });
        setMateriasPorCuatrimestre(materiasAgrupadas);
      } catch (e) {
        // Si falla la API, dejar vacío
        setMateriasPorCuatrimestre({});
      } finally {
        setLoadingMaterias(false);
      }
    };
    fetchMaterias();
  }, []);

  // Función para cargar alumnos de un curso
  const fetchAlumnosCurso = async (cursoId) => {
    try {
      const res = await api.get(`/cursos/${cursoId}`);
      // Suponiendo que el backend retorna los alumnos en una relación 'alumnos'
      setAlumnosCurso(res.data.alumnos || []);
      setCodigoInvitacion(res.data.codigo_invitacion || "");
    } catch (e) {
      setAlumnosCurso([]);
      setCodigoInvitacion("");
    }
  };

  // Funciones para la gestión de alumnos
  const handleGestionAlumnos = (curso) => {
    setCursoGestionAlumnos(curso);
    fetchAlumnosCurso(curso.id);
  };
  const handleCerrarGestionAlumnos = () => {
    setCursoGestionAlumnos(null);
    setAlumnosCurso([]);
    setCodigoInvitacion("");
  };
  const handleInvitar = async (email) => {
    if (!cursoGestionAlumnos) return;
    await api.post(`/cursos/${cursoGestionAlumnos.id}/invitar`, { email });
    fetchAlumnosCurso(cursoGestionAlumnos.id);
  };
  const handleGenerarCodigo = async () => {
    if (!cursoGestionAlumnos) return;
    const res = await api.post(
      `/cursos/${cursoGestionAlumnos.id}/generar-codigo-invitacion`,
    );
    setCodigoInvitacion(res.data.codigo_invitacion);
  };
  const handleAgregarManual = async (email) => {
    if (!cursoGestionAlumnos) return;
    await api.post(`/cursos/${cursoGestionAlumnos.id}/agregar-alumno`, {
      email,
    });
    fetchAlumnosCurso(cursoGestionAlumnos.id);
  };

  // Generar calendario
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const today = new Date();

    let calendarHTML = [];

    // Encabezados
    dayNames.forEach((day) => {
      calendarHTML.push(
        <div
          key={`header-${day}`}
          style={{
            textAlign: "center",
            padding: SPACING[3],
            fontSize: FONT_SIZES.sm,
            color: COLORS.textMuted,
            fontWeight: FONT_WEIGHTS.medium,
          }}
        >
          {day}
        </div>,
      );
    });

    // Días vacíos al principio
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarHTML.push(<div key={`empty-${i}`} style={{ height: 60 }}></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      const hasEvent = Math.random() > 0.7;

      calendarHTML.push(
        <div
          key={day}
          style={{
            height: 60,
            background: isToday ? `${COLORS.primary}20` : COLORS.surface,
            border: isToday ? `1px solid ${COLORS.primary}` : "none",
            borderRadius: BORDER_RADIUS.base,
            padding: SPACING[2],
            cursor: "pointer",
            transition: TRANSITIONS.base,
            position: "relative",
          }}
          onMouseEnter={(e) =>
            (e.target.style.background = COLORS.surfaceHover)
          }
          onMouseLeave={(e) =>
            (e.target.style.background = isToday
              ? `${COLORS.primary}20`
              : COLORS.surface)
          }
        >
          <div style={{ fontSize: FONT_SIZES.sm, marginBottom: 4 }}>{day}</div>
          {hasEvent && (
            <div
              style={{
                position: "absolute",
                bottom: 5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: COLORS.primary,
              }}
            ></div>
          )}
        </div>,
      );
    }

    return calendarHTML;
  };

  const getMonthYear = (date) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // Estilos base
  const styles = {
    container: {
      minHeight: "100vh",
      background: COLORS.background,
      color: COLORS.text,
      paddingTop: 80,
      fontFamily: FONTS.main,
    },
    welcomeSection: {
      textAlign: "center",
      marginTop: SPACING[10],
      padding: `${SPACING[10]} ${SPACING[5]}`,
      background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070") center/cover`,
      borderRadius: BORDER_RADIUS.xl,
      margin: SPACING[5],
      boxShadow: SHADOWS.lg,
    },
    welcomeTitle: {
      fontSize: FONT_SIZES["5xl"],
      marginBottom: SPACING[8],
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
      fontWeight: FONT_WEIGHTS.bold,
    },
    welcomeSubtitle: {
      fontSize: FONT_SIZES["2xl"],
      marginBottom: SPACING[12],
      color: COLORS.textSecondary,
      maxWidth: 600,
      lineHeight: 1.6,
      margin: `0 auto ${SPACING[12]}`,
    },
    cuatrimestresGrid: {
      display: "grid",
      gap: SPACING[10],
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      justifyContent: "center",
      maxWidth: 1200,
      margin: "0 auto",
      padding: `0 ${SPACING[5]}`,
    },
    cuatrimestreCard: {
      background: COLORS.surface,
      borderRadius: BORDER_RADIUS.xl,
      overflow: "hidden",
      boxShadow: SHADOWS.lg,
      transition: TRANSITIONS.base,
      cursor: "pointer",
      border: `1px solid ${COLORS.border}`,
    },
    cuatrimestreImage: {
      width: "100%",
      height: 200,
      objectFit: "cover",
    },
    cuatrimestreContent: {
      padding: SPACING[6],
    },
    cuatrimestreTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      marginBottom: SPACING[3],
      color: COLORS.text,
    },
    cuatrimestreDescription: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZES.base,
      lineHeight: 1.6,
    },
    materiasGrid: {
      display: "grid",
      gap: SPACING[6],
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      marginTop: SPACING[8],
    },
    materiaCard: {
      background: COLORS.surfaceLight,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      boxShadow: SHADOWS.md,
      transition: TRANSITIONS.base,
      cursor: "pointer",
      border: `1px solid ${COLORS.border}`,
    },
    materiaTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.semibold,
      marginBottom: SPACING[3],
      color: COLORS.text,
    },
    materiaInfo: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZES.sm,
      marginBottom: SPACING[2],
    },
    calendarContainer: {
      background: COLORS.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING[6],
      boxShadow: SHADOWS.lg,
      border: `1px solid ${COLORS.border}`,
      marginTop: SPACING[8],
    },
    calendarHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING[6],
    },
    calendarTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
    },
    calendarNav: {
      display: "flex",
      gap: SPACING[3],
    },
    calendarNavButton: {
      background: COLORS.surfaceLight,
      border: `1px solid ${COLORS.border}`,
      borderRadius: BORDER_RADIUS.md,
      padding: `${SPACING[2]} ${SPACING[4]}`,
      cursor: "pointer",
      transition: TRANSITIONS.base,
      color: COLORS.text,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
    },
    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: SPACING[2],
    },
    statsGrid: {
      display: "grid",
      gap: SPACING[6],
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      marginTop: SPACING[8],
    },
    statCard: {
      background: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      textAlign: "center",
      boxShadow: SHADOWS.md,
      border: `1px solid ${COLORS.border}`,
    },
    statNumber: {
      fontSize: FONT_SIZES["3xl"],
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
      marginBottom: SPACING[2],
    },
    statLabel: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.medium,
    },
  };

  // 3. Función para manejar el envío del formulario
  const handleCrearCurso = async (e) => {
    e.preventDefault();
    setCreandoCurso(true);
    setMensajeCurso("");
    setErrorCurso("");
    if (
      !formCurso.titulo ||
      !formCurso.descripcion ||
      !formCurso.cuatrimestre ||
      !formCurso.duracion ||
      !formCurso.nivel ||
      !formCurso.estado
    ) {
      setErrorCurso("Completa todos los campos obligatorios.");
      setCreandoCurso(false);
      return;
    }
    if (formCurso.imagen && !esUrlImagenValida(formCurso.imagen)) {
      setErrorCurso("La URL de la imagen no es válida.");
      setCreandoCurso(false);
      return;
    }
    const datos = {
      titulo: formCurso.titulo,
      descripcion: formCurso.descripcion,
      cuatrimestre: formCurso.cuatrimestre,
      imagen: formCurso.imagen,
      duracion: parseInt(formCurso.duracion),
      nivel: formCurso.nivel,
      estado: formCurso.estado,
      instructor_id: usuario?.id,
    };
    const res = await CursosServicio.crear(datos);
    if (res.exito) {
      setMensajeCurso("¡Curso creado exitosamente!");
      setFormCurso({
        titulo: "",
        descripcion: "",
        cuatrimestre: "",
        imagen: "",
        duracion: "",
        nivel: "principiante",
        estado: "activo",
      });
      setShowCreateCourseModal(false);
      // Refrescar cursos
      setLoadingMaterias(true);
      try {
        const res = await api.get("/profesor/cursos");
        const materiasAgrupadas = {};
        res.data.data.forEach((curso) => {
          const cuatri = curso.cuatrimestre || "otros";
          if (!materiasAgrupadas[cuatri]) materiasAgrupadas[cuatri] = [];
          materiasAgrupadas[cuatri].push({
            id: curso.id,
            nombre: curso.titulo,
            imagen:
              curso.imagen ||
              "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=2074",
            grupos: [
              {
                id: 1,
                nombre: "Grupo Único",
                alumnos: (curso.inscripciones || []).map(
                  (i) => i.alumno?.name || "Alumno",
                ),
                tareas: (curso.lecciones || []).map((l) => l.titulo),
              },
            ],
          });
        });
        setMateriasPorCuatrimestre(materiasAgrupadas);
      } catch (e) {
        setMateriasPorCuatrimestre({});
      } finally {
        setLoadingMaterias(false);
      }
    } else {
      setErrorCurso(res.mensaje || "Error al crear el curso");
    }
    setCreandoCurso(false);
  };

  // Render especial para profesores especiales
  if (isProfesorEspecial) {
    return (
      <div style={{ ...styles.container, paddingTop: 8 }}>
        <div style={{ height: "8px" }} />
        {/* Bienvenida */}
        <div
          className="bienvenida-animada"
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.xl,
            padding: `${SPACING[6]} ${SPACING[8]}`,
            margin: `${SPACING[3]} auto`,
            boxShadow: SHADOWS.lg,
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: SPACING[6],
            flexWrap: "wrap",
            maxWidth: 900,
            animation: "fadeSlideIn 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ fontSize: FONT_SIZES["3xl"], fontWeight: FONT_WEIGHTS.bold, color: COLORS.text }}>
              Bienvenido, {usuario?.name || "Profesor"}
            </h1>
            <p style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary, maxWidth: 400, lineHeight: 1.5, margin: "0 auto" }}>
              Accede a los semestres y tira de materias especial.
            </p>
          </div>
        </div>
        {/* Selección de semestre */}
        {!semestreEspecialSeleccionado && (
          <>
            <h2 style={{ fontSize: FONT_SIZES["2xl"], textAlign: "center", fontWeight: FONT_WEIGHTS.bold, color: COLORS.text, margin: "32px 0 24px 0" }}>
              Selecciona un semestre
            </h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginBottom: 48 }}>
              {SEMESTRES_ESPECIALES.map((sem) => (
                <div
                  key={sem.key}
                  style={{ ...styles.cuatrimestreCard, width: 280, cursor: "pointer" }}
                  onClick={() => setSemestreEspecialSeleccionado(sem)}
                >
                  <img src={sem.imagen} alt={sem.nombre} style={{ width: "100%", height: 180, objectFit: "contain", background: "#f4f4f4" }} />
                  <div style={{ padding: 24 }}>
                    <h3 style={{ ...styles.cuatrimestreTitle, textAlign: "center" }}>{sem.nombre}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Tira de materias especial */}
        {semestreEspecialSeleccionado && (
          <div style={{ maxWidth: 600, margin: "0 auto", background: COLORS.surface, borderRadius: BORDER_RADIUS.xl, boxShadow: SHADOWS.lg, padding: 32 }}>
            <button
              onClick={() => setSemestreEspecialSeleccionado(null)}
              style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 22, cursor: "pointer", marginBottom: 18 }}
            >
              ← Volver a semestres
            </button>
            <h2 style={{ textAlign: "center", color: COLORS.primary, fontWeight: 700, marginBottom: 24 }}>{semestreEspecialSeleccionado.nombre}</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {semestreEspecialSeleccionado.materias.map((mat, idx) => (
                <li key={mat} style={{ background: COLORS.surfaceLight, marginBottom: 12, borderRadius: 8, padding: "14px 18px", fontSize: 18, fontWeight: 500, color: COLORS.text, boxShadow: SHADOWS.sm, cursor: "pointer" }}
                  onClick={() => {
                  console.log("🎯 Navegando a materia especial:", mat);
                  // Navegar a la página de gestión de materia especial
                  navigate(`/profesor/materia-especial/${encodeURIComponent(mat)}/gestionar`);
                }}
                >
                  {idx + 1}. {mat}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Panel de gestión de materia especial */}
        {materiaEspecialSeleccionada && (
          <div style={{ ...styles.container, paddingTop: 8 }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", background: COLORS.surface, borderRadius: BORDER_RADIUS.xl, boxShadow: SHADOWS.lg, padding: 32 }}>
              <button
                onClick={() => setMateriaEspecialSeleccionada(null)}
                style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 22, cursor: "pointer", marginBottom: 18 }}
              >
                ← Volver a materias
              </button>
              <h2 style={{ textAlign: "center", color: COLORS.primary, fontWeight: 700, marginBottom: 24 }}>{materiaEspecialSeleccionada.nombre} <span style={{ color: COLORS.textSecondary, fontSize: 18 }}>({materiaEspecialSeleccionada.semestre})</span></h2>
              
              {/* Pestañas de gestión */}
              <div style={{ marginTop: 32 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: `1px solid ${COLORS.border}` }}>
                  {["calendario", "grupos", "alumnos", "tareas"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        background: activeTab === tab ? COLORS.primary : "transparent",
                        color: activeTab === tab ? COLORS.white : COLORS.text,
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px 8px 0 0",
                        cursor: "pointer",
                        fontSize: FONT_SIZES.base,
                        fontWeight: FONT_WEIGHTS.medium,
                        transition: TRANSITIONS.base,
                      }}
                    >
                      {tab === "calendario" && "📅 Calendario"}
                      {tab === "grupos" && "👥 Grupos"}
                      {tab === "alumnos" && "👨‍🎓 Alumnos"}
                      {tab === "tareas" && "📝 Tareas"}
                    </button>
                  ))}
                </div>

                {/* Contenido de las pestañas */}
                {activeTab === "calendario" && (
                  <div style={{ background: COLORS.surfaceLight, borderRadius: BORDER_RADIUS.lg, padding: 24 }}>
                    <h3 style={{ fontSize: FONT_SIZES.xl, marginBottom: 16, color: COLORS.primary }}>📅 Calendario de Actividades</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
                      {generateCalendar(currentDate)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                      <button onClick={prevMonth} style={{ background: COLORS.primary, color: COLORS.white, border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
                        ← Mes anterior
                      </button>
                      <span style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.medium }}>{getMonthYear(currentDate)}</span>
                      <button onClick={nextMonth} style={{ background: COLORS.primary, color: COLORS.white, border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
                        Mes siguiente →
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "grupos" && (
                  <div style={{ background: COLORS.surfaceLight, borderRadius: BORDER_RADIUS.lg, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ fontSize: FONT_SIZES.xl, color: COLORS.primary }}>👥 Grupos de Trabajo</h3>
                      <button 
                        onClick={() => setShowCrearGrupoModal(true)}
                        style={{ background: COLORS.primary, color: COLORS.white, border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: FONT_SIZES.sm }}
                      >
                        ➕ Crear Grupo
                      </button>
                    </div>
                    <div style={{ display: "grid", gap: 16 }}>
                      {grupos.map((grupo) => (
                        <div key={grupo.id} style={{ background: COLORS.surface, padding: 16, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <h4 style={{ fontSize: FONT_SIZES.lg, marginBottom: 4 }}>{grupo.nombre}</h4>
                              <p style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>{grupo.descripcion}</p>
                              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                                <span style={{ fontSize: FONT_SIZES.sm, color: COLORS.primary }}>Código: {grupo.codigo}</span>
                                <span style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>Alumnos: {grupo.miembros?.length || 0}/{grupo.capacidad_maxima}</span>
                              </div>
                            </div>
                            <button style={{ background: COLORS.secondary, color: COLORS.white, border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: FONT_SIZES.sm }}>
                              Gestionar
                            </button>
                          </div>
                        </div>
                      ))}
                      {grupos.length === 0 && (
                        <div style={{ textAlign: "center", padding: 40, color: COLORS.textSecondary }}>
                          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                          <p>No hay grupos creados para esta materia</p>
                          <button 
                            onClick={() => setShowCrearGrupoModal(true)}
                            style={{ background: COLORS.primary, color: COLORS.white, border: "none", padding: "12px 24px", borderRadius: 6, cursor: "pointer", marginTop: 16 }}
                          >
                            Crear primer grupo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "alumnos" && (
                  <div style={{ background: COLORS.surfaceLight, borderRadius: BORDER_RADIUS.lg, padding: 24 }}>
                    <h3 style={{ fontSize: FONT_SIZES.xl, marginBottom: 16, color: COLORS.primary }}>👨‍🎓 Alumnos Inscritos</h3>
                    <div style={{ display: "grid", gap: 16 }}>
                      {alumnos.map((alumno) => (
                        <div key={alumno.id} style={{ background: COLORS.surface, padding: 16, borderRadius: 8, border: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontWeight: FONT_WEIGHTS.bold }}>
                              {alumno.name?.charAt(0) || "A"}
                            </div>
                            <div>
                              <h4 style={{ fontSize: FONT_SIZES.lg, marginBottom: 2 }}>{alumno.name}</h4>
                              <p style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>{alumno.email}</p>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: FONT_WEIGHTS.medium }}>
                              Racha: {alumno.racha_entregas || 0}
                            </div>
                          </div>
                        </div>
                      ))}
                      {alumnos.length === 0 && (
                        <div style={{ textAlign: "center", padding: 40, color: COLORS.textSecondary }}>
                          <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍🎓</div>
                          <p>No hay alumnos inscritos en esta materia</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "tareas" && (
                  <div style={{ background: COLORS.surfaceLight, borderRadius: BORDER_RADIUS.lg, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ fontSize: FONT_SIZES.xl, color: COLORS.primary }}>📝 Tareas Asignadas</h3>
                      <button 
                        onClick={() => setShowTaskModal(true)}
                        style={{ background: COLORS.primary, color: COLORS.white, border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: FONT_SIZES.sm }}
                      >
                        ➕ Crear Tarea
                      </button>
                    </div>
                    <div style={{ display: "grid", gap: 16 }}>
                      {tareas.map((tarea) => (
                        <div key={tarea.id} style={{ background: COLORS.surface, padding: 16, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: FONT_SIZES.lg, marginBottom: 4 }}>{tarea.titulo}</h4>
                              <p style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 8 }}>{tarea.descripcion}</p>
                              <div style={{ display: "flex", gap: 16, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                                <span>📅 Entrega: {new Date(tarea.fecha_entrega).toLocaleDateString()}</span>
                                <span>📁 Tipo: {tarea.tipo}</span>
                                <span>📊 Estado: {tarea.estado || "Activa"}</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button style={{ background: COLORS.secondary, color: COLORS.white, border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: FONT_SIZES.sm }}>
                                Ver
                              </button>
                              <button style={{ background: COLORS.accent, color: COLORS.white, border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: FONT_SIZES.sm }}>
                                Calificar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {tareas.length === 0 && (
                        <div style={{ textAlign: "center", padding: 40, color: COLORS.textSecondary }}>
                          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                          <p>No hay tareas asignadas para esta materia</p>
                          <button 
                            onClick={() => setShowTaskModal(true)}
                            style={{ background: COLORS.primary, color: COLORS.white, border: "none", padding: "12px 24px", borderRadius: 6, cursor: "pointer", marginTop: 16 }}
                          >
                            Crear primera tarea
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista principal - Selección de cuatrimestre
  return (
    <>
      {/* Eliminada la barra de navegación personalizada para evitar duplicidad */}
      <div style={{ height: "40px" }} />
      <div style={{ ...styles.container, paddingTop: 8 }}>
        {/* Espacio mínimo entre la barra y la tarjeta de bienvenida */}
        <div style={{ height: "8px" }} />
        <div style={{ ...styles.container, paddingTop: 8 }}>
          {/* Tarjeta de bienvenida con mascota - Separada de los cuatrimestres */}
          {!cuatrimestreSeleccionado && (
            <div
              className="bienvenida-animada"
              style={{
                background: COLORS.surface,
                borderRadius: BORDER_RADIUS.xl,
                padding: `${SPACING[6]} ${SPACING[8]}`,
                margin: `${SPACING[3]} auto`,
                boxShadow: SHADOWS.lg,
                border: `1px solid ${COLORS.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: SPACING[6],
                flexWrap: "wrap",
                maxWidth: 900,
                animation: "fadeSlideIn 1s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 180,
                  maxWidth: 220,
                }}
              >
                <video
                  width={140}
                  height={140}
                  autoPlay
                  loop
                  muted
                  style={{
                    objectFit: "contain",
                    borderRadius: BORDER_RADIUS.lg,
                    background: COLORS.background,
                    boxShadow: SHADOWS.md,
                  }}
                >
                  <source src="/extratemporaneo/profes.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
                <div
                  style={{
                    background: `${COLORS.primary}20`,
                    color: COLORS.primary,
                    padding: `${SPACING[2]} ${SPACING[4]}`,
                    borderRadius: BORDER_RADIUS.lg,
                    fontSize: FONT_SIZES.sm,
                    fontWeight: FONT_WEIGHTS.medium,
                    textAlign: "center",
                    marginTop: SPACING[3],
                    maxWidth: 180,
                  }}
                >
                  ¡Tu asistente virtual está listo! 🎓
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  flex: 1,
                  minWidth: 220,
                  maxWidth: 500,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: SPACING[2],
                }}
              >
                <h1
                  style={{
                    fontSize: FONT_SIZES["3xl"],
                    marginBottom: SPACING[2],
                    fontWeight: FONT_WEIGHTS.bold,
                    color: COLORS.text,
                  }}
                >
                  Bienvenido, {usuario?.name || "Profesor"}
                </h1>
                <p
                  style={{
                    fontSize: FONT_SIZES.md,
                    color: COLORS.textSecondary,
                    maxWidth: 400,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  ¡Listo para administrar tus cursos y grupos!
                </p>
              </div>
            </div>
          )}

          {/* Vista principal - Selección de cuatrimestre */}
          {!cuatrimestreSeleccionado && (
            <>
              <h2
                style={{
                  fontSize: FONT_SIZES["3xl"],
                  marginBottom: SPACING[4],
                  textAlign: "center",
                  fontWeight: FONT_WEIGHTS.bold,
                  color: COLORS.text,
                }}
              >
                Selecciona el cuatrimestre que deseas administrar
              </h2>
              {/* Acciones rápidas */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: SPACING[6],
                  marginBottom: SPACING[8],
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={{
                    background: COLORS.primary,
                    color: COLORS.surface,
                    border: "none",
                    borderRadius: BORDER_RADIUS.lg,
                    padding: `${SPACING[3]} ${SPACING[6]}`,
                    fontSize: FONT_SIZES.base,
                    fontWeight: FONT_WEIGHTS.semibold,
                    cursor: "pointer",
                    transition: TRANSITIONS.base,
                    boxShadow: SHADOWS.md,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onClick={() => setShowCreateCourseModal(true)}
                >
                  <i className="fas fa-plus"></i>
                  Crear Curso
                </button>
                <button
                  style={{
                    background: COLORS.secondary,
                    color: COLORS.surface,
                    border: "none",
                    borderRadius: BORDER_RADIUS.lg,
                    padding: `${SPACING[3]} ${SPACING[6]}`,
                    fontSize: FONT_SIZES.base,
                    fontWeight: FONT_WEIGHTS.semibold,
                    cursor: "pointer",
                    transition: TRANSITIONS.base,
                    boxShadow: SHADOWS.md,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onClick={() =>
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    })
                  }
                >
                  <i className="fas fa-list"></i>
                  Ver todos los cursos
                </button>
                <button
                  style={{
                    background: COLORS.accent,
                    color: COLORS.surface,
                    border: "none",
                    borderRadius: BORDER_RADIUS.lg,
                    padding: `${SPACING[3]} ${SPACING[6]}`,
                    fontSize: FONT_SIZES.base,
                    fontWeight: FONT_WEIGHTS.semibold,
                    cursor: "pointer",
                    transition: TRANSITIONS.base,
                    boxShadow: SHADOWS.md,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onClick={() => (window.location.href = "/recursos")}
                >
                  <i className="fas fa-folder-open"></i>
                  Ir a recursos
                </button>
              </div>
              <div style={styles.cuatrimestresGrid}>
                {/* Aquí se muestran solo los cuatrimestres/cursos reales */}
                {Object.keys(materiasPorCuatrimestre).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: COLORS.textSecondary,
                      width: "100%",
                    }}
                  >
                    No tienes cursos registrados aún.
                  </div>
                ) : (
                  Object.keys(materiasPorCuatrimestre).map((cuatri) => (
                    materiasPorCuatrimestre[cuatri].map((materia) => (
                      <div
                        key={materia.id}
                        style={{ ...styles.cuatrimestreCard, marginBottom: 24 }}
                        onClick={() => navigate(`/profesor/curso/${materia.id}/gestionar`)}
                      >
                        <img
                          src={materia.imagen}
                          alt={materia.nombre}
                          style={styles.cuatrimestreImage}
                        />
                        <div style={styles.cuatrimestreContent}>
                          <h3 style={styles.cuatrimestreTitle}>{materia.nombre}</h3>
                          <p style={styles.cuatrimestreDescription}>
                            Administra este curso
                          </p>
                        </div>
                      </div>
                    ))
                  ))
                )}
              </div>
              {/* Modal para crear curso (estructura base, puedes completarla luego) */}
              {showCreateCourseModal && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      background: COLORS.surface,
                      padding: 32,
                      borderRadius: BORDER_RADIUS.lg,
                      minWidth: 320,
                      maxWidth: 400,
                    }}
                  >
                    <h2 style={{ color: COLORS.text, marginBottom: 16 }}>
                      Crear Curso
                    </h2>
                    <form ref={formRef} onSubmit={handleCrearCurso}>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: COLORS.text, fontWeight: 500 }}>
                          Título *
                        </label>
                        <input
                          type="text"
                          value={formCurso.titulo}
                          onChange={(e) =>
                            setFormCurso({
                              ...formCurso,
                              titulo: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: COLORS.text, fontWeight: 500 }}>
                          Descripción *
                        </label>
                        <textarea
                          value={formCurso.descripcion}
                          onChange={(e) =>
                            setFormCurso({
                              ...formCurso,
                              descripcion: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          rows={3}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: COLORS.text, fontWeight: 500 }}>
                          Cuatrimestre *
                        </label>
                        <select
                          value={formCurso.cuatrimestre}
                          onChange={(e) =>
                            setFormCurso({
                              ...formCurso,
                              cuatrimestre: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          required
                        >
                          <option value="">Selecciona...</option>
                          <option value="cuarto">Cuarto Cuatrimestre</option>
                          <option value="quinto">Quinto Cuatrimestre</option>
                          <option value="sexto">Sexto Cuatrimestre</option>
                          <option value="otros">Otros</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: COLORS.text, fontWeight: 500 }}>
                          Duración (minutos) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formCurso.duracion}
                          onChange={(e) =>
                            setFormCurso({
                              ...formCurso,
                              duracion: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: COLORS.text, fontWeight: 500 }}>
                          Nivel *
                        </label>
                        <select
                          value={formCurso.nivel}
                          onChange={(e) =>
                            setFormCurso({
                              ...formCurso,
                              nivel: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          required
                        >
                          <option value="principiante">Principiante</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: COLORS.text, fontWeight: 500 }}>
                          Estado *
                        </label>
                        <select
                          value={formCurso.estado}
                          onChange={(e) =>
                            setFormCurso({
                              ...formCurso,
                              estado: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          required
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                          <option value="borrador">Borrador</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: COLORS.text, fontWeight: 500 }}>
                          Imagen (URL)
                        </label>
                        <input
                          type="text"
                          value={formCurso.imagen}
                          onChange={(e) =>
                            setFormCurso({
                              ...formCurso,
                              imagen: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          placeholder="https://..."
                        />
                        {formCurso.imagen &&
                          !esUrlImagenValida(formCurso.imagen) && (
                            <div
                              style={{
                                color: "red",
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              La URL debe terminar en .jpg, .jpeg, .png, .webp,
                              .gif o .svg
                            </div>
                          )}
                        {esUrlImagenValida(formCurso.imagen) && (
                          <div style={{ marginTop: 8, textAlign: "center" }}>
                            <img
                              src={formCurso.imagen}
                              alt="Vista previa"
                              style={{
                                maxWidth: 180,
                                maxHeight: 120,
                                borderRadius: 8,
                                border: `1px solid ${COLORS.border}`,
                              }}
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                      {errorCurso && (
                        <div style={{ color: "red", marginBottom: 8 }}>
                          {errorCurso}
                        </div>
                      )}
                      {mensajeCurso && (
                        <div style={{ color: "green", marginBottom: 8 }}>
                          {mensajeCurso}
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 8,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setShowCreateCourseModal(false)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 6,
                            border: "none",
                            background: COLORS.secondary,
                            color: COLORS.surface,
                            cursor: "pointer",
                          }}
                        >
                          Cerrar
                        </button>
                        <button
                          type="submit"
                          disabled={creandoCurso}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 6,
                            border: "none",
                            background: COLORS.primary,
                            color: COLORS.surface,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          {creandoCurso ? "Creando..." : "Crear Curso"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Vista de materias */}
          {cuatrimestreSeleccionado && !materiaSeleccionada && (
            <div style={{ padding: SPACING[5] }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: SPACING[8],
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: COLORS.text,
                    fontSize: FONT_SIZES.xl,
                    cursor: "pointer",
                    marginRight: SPACING[5],
                    transition: TRANSITIONS.base,
                  }}
                  onClick={() => setCuatrimestreSeleccionado(null)}
                  onMouseEnter={(e) => (e.target.style.color = COLORS.primary)}
                  onMouseLeave={(e) => (e.target.style.color = COLORS.text)}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <h2
                  style={{
                    fontSize: FONT_SIZES["3xl"],
                    color: COLORS.text,
                    fontWeight: FONT_WEIGHTS.bold,
                  }}
                >
                  {cuatrimestreSeleccionado.nombre}
                </h2>
              </div>

              {loadingMaterias ? (
                <div style={{ textAlign: "center", padding: SPACING[10] }}>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{
                      fontSize: FONT_SIZES["3xl"],
                      color: COLORS.primary,
                    }}
                  ></i>
                  <p
                    style={{
                      marginTop: SPACING[4],
                      color: COLORS.textSecondary,
                    }}
                  >
                    Cargando materias...
                  </p>
                </div>
              ) : (
                <div style={styles.materiasGrid}>
                  {(
                    materiasPorCuatrimestre[cuatrimestreSeleccionado.key] || []
                  ).map((materia) => (
                    <div
                      key={materia.id}
                      style={{
                        ...styles.materiaCard,
                        transform: "translateY(0)",
                        transition: TRANSITIONS.base,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-10px)";
                        e.target.style.boxShadow = `0 15px 30px ${COLORS.primary}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = SHADOWS.md;
                      }}
                      onClick={() => setMateriaSeleccionada(materia)}
                    >
                      <img
                        src={materia.imagen}
                        alt={materia.nombre}
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: BORDER_RADIUS.md,
                          marginBottom: SPACING[4],
                        }}
                      />
                      <h3 style={styles.materiaTitle}>{materia.nombre}</h3>
                      <div style={styles.materiaInfo}>
                        <p>
                          <i
                            className="fas fa-users"
                            style={{ marginRight: SPACING[2] }}
                          ></i>
                          {materia.grupos.length} grupo
                          {materia.grupos.length !== 1 ? "s" : ""}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: SPACING[2],
                            marginTop: SPACING[3],
                          }}
                        >
                          {materia.grupos.map((grupo) => (
                            <span
                              key={grupo.id}
                              style={{
                                background: `${COLORS.primary}20`,
                                color: COLORS.primary,
                                padding: `${SPACING[1]} ${SPACING[3]}`,
                                borderRadius: "20px",
                                fontSize: FONT_SIZES.sm,
                                fontWeight: FONT_WEIGHTS.medium,
                              }}
                            >
                              {grupo.nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Vista de grupos */}
          {materiaSeleccionada && (
            <div style={{ padding: SPACING[5] }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: SPACING[8],
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: COLORS.text,
                    fontSize: FONT_SIZES.xl,
                    cursor: "pointer",
                    marginRight: SPACING[5],
                    transition: TRANSITIONS.base,
                  }}
                  onClick={() => setMateriaSeleccionada(null)}
                  onMouseEnter={(e) => (e.target.style.color = COLORS.primary)}
                  onMouseLeave={(e) => (e.target.style.color = COLORS.text)}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <h2
                  style={{
                    fontSize: FONT_SIZES["3xl"],
                    color: COLORS.text,
                    fontWeight: FONT_WEIGHTS.bold,
                  }}
                >
                  {materiaSeleccionada.nombre}
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: SPACING[8],
                  height: "calc(100vh - 300px)",
                }}
              >
                {/* Menú lateral de grupos */}
                <div
                  style={{
                    width: 300,
                    background: COLORS.surface,
                    borderRadius: BORDER_RADIUS.xl,
                    padding: SPACING[6],
                    boxShadow: SHADOWS.lg,
                    border: `1px solid ${COLORS.border}`,
                    overflowY: "auto",
                  }}
                >
                  <h3
                    style={{
                      fontSize: FONT_SIZES.xl,
                      marginBottom: SPACING[6],
                      color: COLORS.primary,
                      paddingBottom: SPACING[3],
                      borderBottom: `1px solid ${COLORS.border}`,
                      fontWeight: FONT_WEIGHTS.bold,
                    }}
                  >
                    Grupos
                  </h3>
                  <div>
                    {materiaSeleccionada.grupos.map((grupo, index) => (
                      <div
                        key={grupo.id}
                        style={{
                          padding: SPACING[4],
                          marginBottom: SPACING[3],
                          borderRadius: BORDER_RADIUS.md,
                          cursor: "pointer",
                          transition: TRANSITIONS.base,
                          display: "flex",
                          alignItems: "center",
                          gap: SPACING[3],
                          background:
                            grupoSeleccionado?.id === grupo.id
                              ? COLORS.surfaceHover
                              : "transparent",
                          borderLeft:
                            grupoSeleccionado?.id === grupo.id
                              ? `4px solid ${COLORS.primary}`
                              : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (grupoSeleccionado?.id !== grupo.id) {
                            e.target.style.background = COLORS.surfaceHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (grupoSeleccionado?.id !== grupo.id) {
                            e.target.style.background = "transparent";
                          }
                        }}
                        onClick={() => setGrupoSeleccionado(grupo)}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: COLORS.primary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: FONT_SIZES.sm,
                            color: COLORS.white,
                            fontWeight: FONT_WEIGHTS.bold,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div
                          style={{
                            fontSize: FONT_SIZES.base,
                            fontWeight: FONT_WEIGHTS.medium,
                          }}
                        >
                          {grupo.nombre}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contenido del grupo seleccionado */}
                {grupoSeleccionado && (
                  <div
                    style={{
                      flex: 1,
                      background: COLORS.surface,
                      borderRadius: BORDER_RADIUS.xl,
                      padding: SPACING[8],
                      boxShadow: SHADOWS.lg,
                      border: `1px solid ${COLORS.border}`,
                      overflowY: "auto",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: SPACING[8],
                        paddingBottom: SPACING[4],
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: FONT_SIZES["2xl"],
                          marginBottom: SPACING[3],
                          fontWeight: FONT_WEIGHTS.bold,
                        }}
                      >
                        {grupoSeleccionado.nombre}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: SPACING[6],
                          fontSize: FONT_SIZES.sm,
                          color: COLORS.textSecondary,
                        }}
                      >
                        <span>
                          <i
                            className="fas fa-user-graduate"
                            style={{ marginRight: SPACING[2] }}
                          ></i>
                          {grupoSeleccionado.alumnos.length} alumnos
                        </span>
                        <span>
                          <i
                            className="fas fa-tasks"
                            style={{ marginRight: SPACING[2] }}
                          ></i>
                          {grupoSeleccionado.tareas.length} tareas
                        </span>
                      </div>
                    </div>

                    {/* Sección de Alumnos */}
                    <div style={{ marginBottom: SPACING[10] }}>
                      <h4
                        style={{
                          fontSize: FONT_SIZES.xl,
                          marginBottom: SPACING[6],
                          display: "flex",
                          alignItems: "center",
                          gap: SPACING[3],
                          color: COLORS.primary,
                          paddingBottom: SPACING[3],
                          borderBottom: `1px solid ${COLORS.border}`,
                          fontWeight: FONT_WEIGHTS.bold,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: `${COLORS.primary}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: FONT_SIZES.base,
                            color: COLORS.primary,
                          }}
                        >
                          <i className="fas fa-users"></i>
                        </div>
                        Alumnos
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                          gap: SPACING[5],
                        }}
                      >
                        {grupoSeleccionado.alumnos.map((alumno, index) => (
                          <div
                            key={alumno + "-" + index}
                            style={{
                              background: COLORS.surfaceLight,
                              borderRadius: BORDER_RADIUS.lg,
                              padding: SPACING[5],
                              display: "flex",
                              alignItems: "center",
                              gap: SPACING[4],
                            }}
                          >
                            <div
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                background: COLORS.primary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: FONT_SIZES.xl,
                                fontWeight: FONT_WEIGHTS.bold,
                                color: COLORS.white,
                              }}
                            >
                              {alumno.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: FONT_SIZES.lg,
                                  marginBottom: SPACING[2],
                                  fontWeight: FONT_WEIGHTS.medium,
                                }}
                              >
                                {alumno}
                              </div>
                              <div
                                style={{
                                  fontSize: FONT_SIZES.sm,
                                  color: COLORS.textSecondary,
                                  display: "flex",
                                  gap: SPACING[4],
                                  marginBottom: SPACING[2],
                                }}
                              >
                                <span>Actividades: 8/10</span>
                                <span>Calificación: 9.2</span>
                              </div>
                              <div
                                style={{
                                  height: 8,
                                  background: COLORS.surface,
                                  borderRadius: 4,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    background: COLORS.primary,
                                    borderRadius: 4,
                                    width: "92%",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sección de Calendario */}
                    <div style={{ marginBottom: SPACING[10] }}>
                      <h4
                        style={{
                          fontSize: FONT_SIZES.xl,
                          marginBottom: SPACING[6],
                          display: "flex",
                          alignItems: "center",
                          gap: SPACING[3],
                          color: COLORS.primary,
                          paddingBottom: SPACING[3],
                          borderBottom: `1px solid ${COLORS.border}`,
                          fontWeight: FONT_WEIGHTS.bold,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: `${COLORS.primary}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: FONT_SIZES.base,
                            color: COLORS.primary,
                          }}
                        >
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                        Calendario
                      </h4>
                      <div
                        style={{
                          background: COLORS.surfaceLight,
                          borderRadius: BORDER_RADIUS.lg,
                          padding: SPACING[6],
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
                          <div
                            style={{
                              display: "flex",
                              gap: SPACING[3],
                            }}
                          >
                            <button
                              style={{
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: "50%",
                                width: 36,
                                height: 36,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: COLORS.text,
                                transition: TRANSITIONS.base,
                              }}
                              onClick={prevMonth}
                              onMouseEnter={(e) =>
                                (e.target.style.background =
                                  COLORS.surfaceHover)
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.background = COLORS.surface)
                              }
                            >
                              <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                              style={{
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: "50%",
                                width: 36,
                                height: 36,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: COLORS.text,
                                transition: TRANSITIONS.base,
                              }}
                              onClick={nextMonth}
                              onMouseEnter={(e) =>
                                (e.target.style.background =
                                  COLORS.surfaceHover)
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.background = COLORS.surface)
                              }
                            >
                              <i className="fas fa-chevron-right"></i>
                            </button>
                          </div>
                          <div
                            style={{
                              fontSize: FONT_SIZES.lg,
                              fontWeight: FONT_WEIGHTS.medium,
                            }}
                          >
                            {getMonthYear(currentDate)}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            gap: SPACING[2],
                          }}
                        >
                          {generateCalendar(currentDate)}
                        </div>
                      </div>
                    </div>

                    {/* Sección de Tareas */}
                    <div>
                      <h4
                        style={{
                          fontSize: FONT_SIZES.xl,
                          marginBottom: SPACING[6],
                          display: "flex",
                          alignItems: "center",
                          gap: SPACING[3],
                          color: COLORS.primary,
                          paddingBottom: SPACING[3],
                          borderBottom: `1px solid ${COLORS.border}`,
                          fontWeight: FONT_WEIGHTS.bold,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: `${COLORS.primary}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: FONT_SIZES.base,
                            color: COLORS.primary,
                          }}
                        >
                          <i className="fas fa-tasks"></i>
                        </div>
                        Tareas
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                          gap: SPACING[5],
                        }}
                      >
                        {grupoSeleccionado.tareas.map((tarea, index) => (
                          <div
                            key={tarea + "-" + index}
                            style={{
                              background: COLORS.surfaceLight,
                              borderRadius: BORDER_RADIUS.lg,
                              padding: SPACING[5],
                              transition: TRANSITIONS.base,
                              borderLeft: `4px solid ${COLORS.primary}`,
                              transform: "translateY(0)",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-5px)";
                              e.target.style.boxShadow = SHADOWS.lg;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = "none";
                            }}
                          >
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
                                  fontSize: FONT_SIZES.lg,
                                  fontWeight: FONT_WEIGHTS.medium,
                                }}
                              >
                                {tarea}
                              </div>
                              <div
                                style={{
                                  background: `${COLORS.primary}20`,
                                  color: COLORS.primary,
                                  padding: `${SPACING[1]} ${SPACING[3]}`,
                                  borderRadius: "20px",
                                  fontSize: FONT_SIZES.xs,
                                  fontWeight: FONT_WEIGHTS.medium,
                                }}
                              >
                                Por calificar
                              </div>
                            </div>
                            <div
                              style={{
                                marginBottom: SPACING[4],
                                color: COLORS.textSecondary,
                                fontSize: FONT_SIZES.sm,
                              }}
                            >
                              Tarea asignada el 10/12/2023. Entrega: 15/12/2023
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: FONT_SIZES.sm,
                                color: COLORS.textSecondary,
                                marginBottom: SPACING[4],
                              }}
                            >
                              <span>
                                <i
                                  className="fas fa-file"
                                  style={{ marginRight: SPACING[2] }}
                                ></i>{" "}
                                12 entregas
                              </span>
                              <span>
                                <i
                                  className="fas fa-clock"
                                  style={{ marginRight: SPACING[2] }}
                                ></i>{" "}
                                5 días restantes
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: SPACING[3],
                              }}
                            >
                              <button
                                style={{
                                  background: COLORS.primary,
                                  color: COLORS.white,
                                  border: "none",
                                  borderRadius: BORDER_RADIUS.md,
                                  padding: `${SPACING[2]} ${SPACING[4]}`,
                                  fontSize: FONT_SIZES.sm,
                                  cursor: "pointer",
                                  transition: TRANSITIONS.base,
                                  fontWeight: FONT_WEIGHTS.medium,
                                }}
                                onClick={() => setShowGradeModal(true)}
                                onMouseEnter={(e) =>
                                  (e.target.style.background =
                                    COLORS.primaryDark)
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.background = COLORS.primary)
                                }
                              >
                                Calificar
                              </button>
                              <button
                                style={{
                                  background: COLORS.surfaceLight,
                                  color: COLORS.text,
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: BORDER_RADIUS.md,
                                  padding: `${SPACING[2]} ${SPACING[4]}`,
                                  fontSize: FONT_SIZES.sm,
                                  cursor: "pointer",
                                  transition: TRANSITIONS.base,
                                  fontWeight: FONT_WEIGHTS.medium,
                                }}
                                onClick={() => setShowDetailModal(true)}
                                onMouseEnter={(e) =>
                                  (e.target.style.background =
                                    COLORS.surfaceHover)
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.background =
                                    COLORS.surfaceLight)
                                }
                              >
                                Ver detalles
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Botón para crear nueva tarea */}
                        <div
                          style={{
                            background: COLORS.surfaceLight,
                            borderRadius: BORDER_RADIUS.lg,
                            padding: SPACING[5],
                            transition: TRANSITIONS.base,
                            border: `2px dashed ${COLORS.border}`,
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = COLORS.primary;
                            e.target.style.background = `${COLORS.primary}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = COLORS.border;
                            e.target.style.background = COLORS.surfaceLight;
                          }}
                          onClick={() => setShowTaskModal(true)}
                        >
                          <div
                            style={{
                              fontSize: FONT_SIZES.lg,
                              fontWeight: FONT_WEIGHTS.medium,
                              marginBottom: SPACING[2],
                            }}
                          >
                            Asignar nueva tarea
                          </div>
                          <div
                            style={{
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.textSecondary,
                              marginBottom: SPACING[4],
                            }}
                          >
                            Crear una nueva tarea para este grupo
                          </div>
                          <button
                            style={{
                              background: COLORS.primary,
                              color: COLORS.white,
                              border: "none",
                              borderRadius: BORDER_RADIUS.md,
                              padding: `${SPACING[2]} ${SPACING[4]}`,
                              fontSize: FONT_SIZES.sm,
                              cursor: "pointer",
                              transition: TRANSITIONS.base,
                              fontWeight: FONT_WEIGHTS.medium,
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.background = COLORS.primaryDark)
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.background = COLORS.primary)
                            }
                          >
                            <i
                              className="fas fa-plus"
                              style={{ marginRight: SPACING[2] }}
                            ></i>
                            Crear tarea
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Modales */}
          <TareaModal
            open={showTaskModal}
            onClose={() => setShowTaskModal(false)}
          />
          <CalificarModal
            open={showGradeModal}
            onClose={() => setShowGradeModal(false)}
          />
          <DetalleTareaModal
            open={showDetailModal}
            onClose={() => setShowDetailModal(false)}
          />
        </div>
      </div>
      {/* En el render, mostrar la gestión de alumnos si está activa */}
      {cursoGestionAlumnos && (
        <GestionAlumnosCurso
          alumnos={alumnosCurso}
          onInvitar={handleInvitar}
          onGenerarCodigo={handleGenerarCodigo}
          onAgregarManual={handleAgregarManual}
          codigoInvitacion={codigoInvitacion}
          onCerrar={handleCerrarGestionAlumnos}
        />
      )}
    </>
  );
}

export default ProfesorPanel;
