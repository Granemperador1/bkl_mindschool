import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaEdit,
  FaTrash,
  FaStar,
  FaClock,
  FaUser,
} from "react-icons/fa";
import CursosServicio from "../../servicios/CursosServicio";
import FiltrosCursos from "./FiltrosCursos";
import Paginacion from "../Comunes/Paginacion";
import GestionAlumnosCurso from "../../components/profesor/GestionAlumnosCurso";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../components/ThemeProvider";

/**
 * Componente para mostrar listado de cursos con filtros y búsqueda
 *
 * Características:
 * - Listado paginado de cursos
 * - Filtros avanzados
 * - Búsqueda por término
 * - Ordenamiento
 * - Acciones según rol de usuario
 * - Diseño responsive
 * - Modo oscuro/claro
 */
const ListadoCursos = () => {
  // Estados principales
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalCursos, setTotalCursos] = useState(0);

  // Estados de filtros y búsqueda
  const [filtros, setFiltros] = useState({
    nivel: "",
    instructor_id: "",
    precio_minimo: "",
    precio_maximo: "",
    duracion_minima: "",
    duracion_maxima: "",
    orden: "created_at",
    direccion: "desc",
  });

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Contextos
  const { usuario } = useAuth();
  const [cursoGestionAlumnos, setCursoGestionAlumnos] = useState(null);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [codigoInvitacion, setCodigoInvitacion] = useState("");
  const { isDarkMode } = useTheme();

  /**
   * Carga los cursos según los filtros y búsqueda actuales
   */
  const cargarCursos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      let respuesta;

      // Si hay término de búsqueda, usar búsqueda
      if (terminoBusqueda.trim()) {
        respuesta = await CursosServicio.buscar(terminoBusqueda.trim(), {
          ...filtros,
          page: paginaActual,
        });
      } else {
        // Usar filtros normales
        respuesta = await CursosServicio.obtenerListado({
          ...filtros,
          page: paginaActual,
        });
      }

      if (respuesta.exito) {
        setCursos(respuesta.datos.data || []);
        setTotalPaginas(respuesta.datos.last_page || 1);
        setTotalCursos(respuesta.datos.total || 0);
      } else {
        setError(respuesta.mensaje);
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setError("Error al cargar los cursos. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }, [filtros, terminoBusqueda, paginaActual]);

  /**
   * Efecto para cargar cursos cuando cambian los filtros o búsqueda
   */
  useEffect(() => {
    setPaginaActual(1); // Resetear a primera página
    cargarCursos();
  }, [cargarCursos]);

  /**
   * Maneja cambios en los filtros
   */
  const manejarCambioFiltros = (nuevosFiltros) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
  };

  /**
   * Maneja la búsqueda por término
   */
  const manejarBusqueda = (evento) => {
    evento.preventDefault();
    cargarCursos();
  };

  /**
   * Limpia todos los filtros y búsqueda
   */
  const limpiarFiltros = () => {
    setFiltros({
      nivel: "",
      instructor_id: "",
      precio_minimo: "",
      precio_maximo: "",
      duracion_minima: "",
      duracion_maxima: "",
      orden: "created_at",
      direccion: "desc",
    });
    setTerminoBusqueda("");
  };

  /**
   * Obtiene el color del badge según el nivel
   */
  const obtenerColorNivel = (nivel) => {
    switch (nivel) {
      case "principiante":
        return "success";
      case "intermedio":
        return "warning";
      case "avanzado":
        return "danger";
      default:
        return "secondary";
    }
  };

  /**
   * Formatea la duración en horas y minutos
   */
  const formatearDuracion = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    if (horas > 0) {
      return `${horas}h ${mins}m`;
    }
    return `${mins}m`;
  };

  /**
   * Formatea el precio
   */
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(precio);
  };

  /**
   * Renderiza una tarjeta de curso
   */
  const renderizarTarjetaCurso = (curso) => (
    <Col key={curso.id} lg={4} md={6} className="mb-4">
      <Card
        className={`h-100 curso-card ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
        style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Imagen del curso */}
        <div
          className="curso-imagen-container"
          style={{ height: "200px", overflow: "hidden" }}
        >
          {curso.imagen_url ? (
            <Card.Img
              variant="top"
              src={curso.imagen_url}
              alt={curso.titulo}
              style={{ height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                height: "100%",
                backgroundColor: isDarkMode ? "#343a40" : "#f8f9fa",
                color: isDarkMode ? "#adb5bd" : "#6c757d",
              }}
            >
              <FaUser size={48} />
            </div>
          )}

          {/* Badge de nivel */}
          <Badge
            bg={obtenerColorNivel(curso.nivel)}
            className="position-absolute top-0 end-0 m-2"
          >
            {curso.nivel}
          </Badge>
        </div>

        <Card.Body className="d-flex flex-column">
          {/* Título del curso */}
          <Card.Title className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>
            {curso.titulo}
          </Card.Title>

          {/* Descripción */}
          <Card.Text className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
            {curso.descripcion.length > 100
              ? `${curso.descripcion.substring(0, 100)}...`
              : curso.descripcion}
          </Card.Text>

          {/* Información del instructor */}
          {curso.instructor && (
            <div className="mb-2">
              <small className="text-muted">
                <FaUser className="me-1" />
                {curso.instructor.name}
              </small>
            </div>
          )}

          {/* Métricas del curso */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <FaClock className="me-1 text-muted" />
              <small className="text-muted">
                {formatearDuracion(curso.duracion)}
              </small>
            </div>

            <div className="d-flex align-items-center">
              <FaStar className="me-1 text-warning" />
              <small className="text-muted">
                {curso.inscripciones_count || 0} estudiantes
              </small>
            </div>
          </div>

          {/* Precio */}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold text-primary fs-5">
                {formatearPrecio(curso.precio)}
              </span>

              {/* Botones de acción */}
              <div className="btn-group" role="group">
                <Button
                  variant="outline-primary"
                  size="sm"
                  href={`/cursos/${curso.id}`}
                >
                  <FaEye className="me-1" />
                  Ver
                </Button>

                {/* Botones según rol */}
                {usuario &&
                  (usuario.roles.includes("admin") ||
                    (usuario.roles.includes("profesor") &&
                      curso.instructor_id === usuario.id)) && (
                    <>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        href={`/cursos/${curso.id}/editar`}
                      >
                        <FaEdit className="me-1" />
                        Editar
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => confirmarEliminacion(curso.id)}
                      >
                        <FaTrash className="me-1" />
                        Eliminar
                      </Button>
                    </>
                  )}
                {usuario?.role === "profesor" && (
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleGestionAlumnos(curso)}
                  >
                    <FaUser className="me-1" />
                    Gestionar alumnos
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  /**
   * Confirma la eliminación de un curso
   */
  const confirmarEliminacion = async (idCurso) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        const respuesta = await CursosServicio.eliminar(idCurso);
        if (respuesta.exito) {
          // Recargar cursos
          cargarCursos();
        } else {
          setError(respuesta.mensaje);
        }
      } catch (error) {
        setError("Error al eliminar el curso");
      }
    }
  };

  // Filtrar cursos por profesor actual si es profesor
  const cursosFiltrados =
    usuario?.role === "profesor"
      ? cursos.filter((c) => c.instructor_id === usuario.id)
      : cursos;

  // Función para cargar alumnos de un curso
  const fetchAlumnosCurso = async (cursoId) => {
    try {
      const res = await CursosServicio.obtenerDetalle(cursoId);
      setAlumnosCurso(res.datos.alumnos || []);
      setCodigoInvitacion(res.datos.codigo_invitacion || "");
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
    await CursosServicio.invitarAlumno(cursoGestionAlumnos.id, email);
    fetchAlumnosCurso(cursoGestionAlumnos.id);
  };
  const handleGenerarCodigo = async () => {
    if (!cursoGestionAlumnos) return;
    const res = await CursosServicio.generarCodigoInvitacion(
      cursoGestionAlumnos.id,
    );
    setCodigoInvitacion(res.datos.codigo_invitacion);
  };
  const handleAgregarManual = async (email) => {
    if (!cursoGestionAlumnos) return;
    await CursosServicio.agregarAlumnoManual(cursoGestionAlumnos.id, email);
    fetchAlumnosCurso(cursoGestionAlumnos.id);
  };

  /**
   * Renderiza el contenido principal
   */
  if (cargando && cursos.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando cursos...</span>
        </Spinner>
      </div>
    );
  }

  // Mostrar gestión de alumnos si está activa
  if (cursoGestionAlumnos) {
    return (
      <div>
        <button onClick={handleCerrarGestionAlumnos}>
          Volver a mis cursos
        </button>
        <h2>Gestión de alumnos para: {cursoGestionAlumnos.titulo}</h2>
        <GestionAlumnosCurso
          alumnos={alumnosCurso}
          onInvitar={handleInvitar}
          onGenerarCodigo={handleGenerarCodigo}
          onAgregarManual={handleAgregarManual}
          codigoInvitacion={codigoInvitacion}
        />
      </div>
    );
  }

  return (
    <div className={`listado-cursos ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Header con búsqueda y filtros */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className={`mb-0 ${isDarkMode ? "text-light" : ""}`}>
              Cursos Disponibles
            </h2>
            <small className="text-muted">
              {totalCursos} cursos encontrados
            </small>
          </Col>

          <Col md={6}>
            <div className="d-flex gap-2">
              {/* Búsqueda */}
              <Form onSubmit={manejarBusqueda} className="flex-grow-1">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar cursos..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    className={
                      isDarkMode ? "bg-dark text-light border-secondary" : ""
                    }
                  />
                  <Button variant="outline-secondary" type="submit">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>

              {/* Botón de filtros */}
              <Button
                variant={mostrarFiltros ? "primary" : "outline-secondary"}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <FaFilter className="me-1" />
                Filtros
              </Button>

              {/* Botón de ordenamiento */}
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const nuevaDireccion =
                    filtros.direccion === "asc" ? "desc" : "asc";
                  manejarCambioFiltros({ direccion: nuevaDireccion });
                }}
              >
                <FaSort className="me-1" />
                {filtros.direccion === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Filtros expandibles */}
      {mostrarFiltros && (
        <FiltrosCursos
          filtros={filtros}
          onChange={manejarCambioFiltros}
          onLimpiar={limpiarFiltros}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Mensaje de error */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Listado de cursos */}
      {cursosFiltrados.length > 0 ? (
        <>
          <Row>{cursosFiltrados.map(renderizarTarjetaCurso)}</Row>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambioPagina={setPaginaActual}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <FaSearch size={64} className="text-muted" />
          </div>
          <h4 className={isDarkMode ? "text-light" : ""}>
            No se encontraron cursos
          </h4>
          <p className="text-muted">
            {terminoBusqueda
              ? `No hay cursos que coincidan con "${terminoBusqueda}"`
              : "No hay cursos disponibles con los filtros aplicados"}
          </p>
          <Button variant="outline-primary" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListadoCursos;
