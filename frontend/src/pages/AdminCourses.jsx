import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
} from "../theme/branding/branding";
import useApi from "../hooks/useApi";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [professors, setProfessors] = useState([]);

  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    fetchCourses();
    fetchProfessors();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { estado: statusFilter }),
      });

      const response = await api.get(`/cursos?${params}`);
      setCourses(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await api.get("/usuarios?role=profesor");
      setProfessors(response.data.data);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      await api.post("/cursos", courseData);
      setShowModal(false);
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleUpdateCourse = async (id, courseData) => {
    try {
      await api.put(`/cursos/${id}`, courseData);
      setShowModal(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este curso?")) {
      try {
        await api.delete(`/cursos/${id}`);
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const CourseModal = ({ course = null, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      titulo: course?.titulo || "",
      descripcion: course?.descripcion || "",
      duracion: course?.duracion || "",
      nivel: course?.nivel || "principiante",
      precio: course?.precio || "",
      estado: course?.estado || "activo",
      instructor_id: course?.instructor_id || "",
      imagen_url: course?.imagen_url || "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(course?.id, formData);
    };

    return (
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
            padding: "30px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: SHADOWS.xl,
          }}
        >
          <h2
            style={{
              color: COLORS.text,
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "20px",
              fontFamily: FONTS.heading,
            }}
          >
            {course ? "Editar Curso" : "Crear Nuevo Curso"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Título del Curso
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                required
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: COLORS.text,
                    fontWeight: "500",
                  }}
                >
                  Duración (horas)
                </label>
                <input
                  type="number"
                  value={formData.duracion}
                  onChange={(e) =>
                    setFormData({ ...formData, duracion: e.target.value })
                  }
                  required
                  min="1"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: BORDER_RADIUS.md,
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: COLORS.text,
                    fontWeight: "500",
                  }}
                >
                  Precio
                </label>
                <input
                  type="number"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: BORDER_RADIUS.md,
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: COLORS.text,
                    fontWeight: "500",
                  }}
                >
                  Nivel
                </label>
                <select
                  value={formData.nivel}
                  onChange={(e) =>
                    setFormData({ ...formData, nivel: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: BORDER_RADIUS.md,
                    fontSize: "14px",
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
                    marginBottom: "5px",
                    color: COLORS.text,
                    fontWeight: "500",
                  }}
                >
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: BORDER_RADIUS.md,
                    fontSize: "14px",
                  }}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="borrador">Borrador</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Instructor
              </label>
              <select
                value={formData.instructor_id}
                onChange={(e) =>
                  setFormData({ ...formData, instructor_id: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              >
                <option value="">Seleccionar instructor</option>
                {professors.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                URL de la Imagen (opcional)
              </label>
              <input
                type="url"
                value={formData.imagen_url}
                onChange={(e) =>
                  setFormData({ ...formData, imagen_url: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  background: COLORS.textSecondary,
                  color: COLORS.surface,
                  border: "none",
                  borderRadius: BORDER_RADIUS.md,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: COLORS.primary,
                  color: COLORS.surface,
                  border: "none",
                  borderRadius: BORDER_RADIUS.md,
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {course ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getStatusDisplayName = (status) => {
    const statusNames = {
      activo: "Activo",
      inactivo: "Inactivo",
      borrador: "Borrador",
    };
    return statusNames[status] || status;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      activo: COLORS.success,
      inactivo: COLORS.error,
      borrador: COLORS.warning,
    };
    return statusColors[status] || COLORS.textSecondary;
  };

  const getLevelDisplayName = (level) => {
    const levelNames = {
      principiante: "Principiante",
      intermedio: "Intermedio",
      avanzado: "Avanzado",
    };
    return levelNames[level] || level;
  };

  return (
    <div
      style={{
        padding: "30px",
        background: COLORS.background,
        minHeight: "calc(100vh - 70px)",
        fontFamily: FONTS.main,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                color: COLORS.text,
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "8px",
                fontFamily: FONTS.heading,
              }}
            >
              Gestión de Cursos
            </h1>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: "1rem",
              }}
            >
              Administra todos los cursos de la plataforma
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "12px 24px",
              background: COLORS.primary,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            + Nuevo Curso
          </button>
        </div>

        {/* Filtros */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            padding: "20px",
            marginBottom: "20px",
            boxShadow: SHADOWS.md,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Buscar
              </label>
              <input
                type="text"
                placeholder="Título del curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Filtrar por Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="borrador">Borrador</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tarjetas de cursos como acciones rápidas */}
        {!loading && courses.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              margin: "30px 0",
            }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                style={{
                  background: COLORS.surface,
                  borderRadius: BORDER_RADIUS.xl,
                  boxShadow: SHADOWS.lg,
                  border: `1px solid ${COLORS.border}`,
                  cursor: "pointer",
                  transition: "0.2s",
                  padding: 24,
                }}
                onClick={() => navigate(`/admin/cursos/${course.id}`)}
              >
                <img
                  src={
                    course.imagen ||
                    "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=2074"
                  }
                  alt={course.titulo}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: BORDER_RADIUS.md,
                    marginBottom: 12,
                  }}
                  loading="lazy"
                />
                <h3
                  style={{
                    color: COLORS.text,
                    fontWeight: 600,
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  {course.titulo}
                </h3>
                <div style={{ color: COLORS.textSecondary, fontSize: 14 }}>
                  {course.descripcion}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabla de cursos */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            overflow: "hidden",
            boxShadow: SHADOWS.md,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: COLORS.textSecondary,
              }}
            >
              Cargando cursos...
            </div>
          ) : (
            <>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: COLORS.background,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Curso
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Instructor
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Nivel
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Estado
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Precio
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={course.id}
                      style={{
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <td style={{ padding: "15px" }}>
                        <div>
                          <div
                            style={{
                              color: COLORS.text,
                              fontWeight: "600",
                              marginBottom: "5px",
                            }}
                          >
                            {course.titulo}
                          </div>
                          <div
                            style={{
                              color: COLORS.textSecondary,
                              fontSize: "0.9rem",
                              maxWidth: "300px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {course.descripcion}
                          </div>
                        </div>
                      </td>
                      <td
                        style={{ padding: "15px", color: COLORS.textSecondary }}
                      >
                        {course.instructor?.name || "Sin asignar"}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: BORDER_RADIUS.sm,
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            background: COLORS.accent,
                            color: COLORS.surface,
                          }}
                        >
                          {getLevelDisplayName(course.nivel)}
                        </span>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: BORDER_RADIUS.sm,
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            background: getStatusColor(course.estado),
                            color: COLORS.surface,
                          }}
                        >
                          {getStatusDisplayName(course.estado)}
                        </span>
                      </td>
                      <td
                        style={{ padding: "15px", color: COLORS.textSecondary }}
                      >
                        ${course.precio}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              setEditingCourse(course);
                              setShowModal(true);
                            }}
                            style={{
                              padding: "5px 10px",
                              background: COLORS.accent,
                              color: COLORS.surface,
                              border: "none",
                              borderRadius: BORDER_RADIUS.sm,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            style={{
                              padding: "5px 10px",
                              background: COLORS.error,
                              color: COLORS.surface,
                              border: "none",
                              borderRadius: BORDER_RADIUS.sm,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    borderTop: `1px solid ${COLORS.border}`,
                  }}
                >
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 12px",
                      background:
                        currentPage === 1
                          ? COLORS.textSecondary
                          : COLORS.primary,
                      color: COLORS.surface,
                      border: "none",
                      borderRadius: BORDER_RADIUS.sm,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    Anterior
                  </button>
                  <span
                    style={{
                      padding: "8px 12px",
                      color: COLORS.text,
                    }}
                  >
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 12px",
                      background:
                        currentPage === totalPages
                          ? COLORS.textSecondary
                          : COLORS.primary,
                      color: COLORS.surface,
                      border: "none",
                      borderRadius: BORDER_RADIUS.sm,
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CourseModal
          course={editingCourse}
          onSave={editingCourse ? handleUpdateCourse : handleCreateCourse}
          onClose={() => {
            setShowModal(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCourses;
