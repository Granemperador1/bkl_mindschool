import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../theme/branding/branding";

const ExamenesPanel = () => {
  const { usuario } = useAuth();
  const [examenes, setExamenes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    curso_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Verificar permisos
  const canManageExams =
    usuario?.roles?.includes("profesor") || usuario?.roles?.includes("admin");

  useEffect(() => {
    if (canManageExams) {
      fetchExamenes();
      fetchCursos();
    }
  }, [canManageExams]);

  const fetchExamenes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/examenes");
      setExamenes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching examenes:", error);
      setError("Error al cargar los exámenes");
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

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.titulo || !form.descripcion || !form.curso_id) {
      setError("Título, descripción y curso son obligatorios");
      return;
    }

    try {
      const response = await api.post("/examenes", {
        ...form,
        estado: "borrador",
        creador_id: usuario.id,
      });

      setExamenes([...examenes, response.data.data]);
      setShowForm(false);
      setForm({
        titulo: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        curso_id: "",
      });
      setSuccess("Examen creado exitosamente");
    } catch (error) {
      console.error("Error creating examen:", error);
      setError(error.response?.data?.message || "Error al crear el examen");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este examen?")) {
      return;
    }

    try {
      await api.delete(`/examenes/${id}`);
      setExamenes(examenes.filter((ex) => ex.id !== id));
      setSuccess("Examen eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting examen:", error);
      setError("Error al eliminar el examen");
    }
  };

  if (!canManageExams) {
    return (
      <div
        style={{
          padding: SPACING[8],
          background: COLORS.background,
          minHeight: "100vh",
          fontFamily: FONTS.main,
        }}
      >
        <div style={{ textAlign: "center", color: COLORS.error }}>
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para gestionar exámenes.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: SPACING[8],
        background: COLORS.background,
        minHeight: "100vh",
        fontFamily: FONTS.main,
      }}
    >
      <h1
        style={{
          color: COLORS.primary,
          fontSize: FONT_SIZES["3xl"],
          fontWeight: FONT_WEIGHTS.bold,
          marginBottom: SPACING[6],
        }}
      >
        Gestión de Exámenes
      </h1>

      {error && (
        <div
          style={{
            background: COLORS.error,
            color: COLORS.surface,
            padding: SPACING[4],
            borderRadius: BORDER_RADIUS.md,
            marginBottom: SPACING[4],
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: COLORS.success,
            color: COLORS.surface,
            padding: SPACING[4],
            borderRadius: BORDER_RADIUS.md,
            marginBottom: SPACING[4],
          }}
        >
          {success}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: SPACING[3],
          background: COLORS.primary,
          color: COLORS.surface,
          border: "none",
          borderRadius: BORDER_RADIUS.md,
          fontWeight: "600",
          marginBottom: SPACING[6],
          cursor: "pointer",
        }}
      >
        + Nuevo Examen
      </button>

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            background: COLORS.surface,
            padding: SPACING[6],
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.md,
            marginBottom: SPACING[8],
            maxWidth: 500,
          }}
        >
          <h2
            style={{
              color: COLORS.text,
              fontSize: FONT_SIZES.xl,
              fontWeight: FONT_WEIGHTS.medium,
              marginBottom: SPACING[4],
            }}
          >
            Crear Examen
          </h2>

          <input
            name="titulo"
            placeholder="Título del examen"
            value={form.titulo}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />

          <textarea
            name="descripcion"
            placeholder="Descripción del examen"
            value={form.descripcion}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />

          <select
            name="curso_id"
            value={form.curso_id}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.titulo}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />

          <input
            type="datetime-local"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />

          <button
            type="submit"
            style={{
              padding: SPACING[3],
              background: COLORS.success,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Crear Examen
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{
              marginLeft: SPACING[4],
              padding: SPACING[3],
              background: COLORS.error,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </form>
      )}

      {loading ? (
        <div
          style={{
            color: COLORS.textSecondary,
            textAlign: "center",
            padding: SPACING[8],
          }}
        >
          Cargando exámenes...
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.md,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: COLORS.surfaceLight }}>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Título
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Descripción
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Curso
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Estado
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Fecha Inicio
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Fecha Fin
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {examenes.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    padding: SPACING[8],
                    textAlign: "center",
                    color: COLORS.textSecondary,
                  }}
                >
                  No hay exámenes registrados
                </td>
              </tr>
            ) : (
              examenes.map((ex) => (
                <tr key={ex.id}>
                  <td style={{ padding: SPACING[4] }}>{ex.titulo}</td>
                  <td style={{ padding: SPACING[4] }}>{ex.descripcion}</td>
                  <td style={{ padding: SPACING[4] }}>
                    {ex.curso?.titulo || "-"}
                  </td>
                  <td
                    style={{
                      padding: SPACING[4],
                      color:
                        ex.estado === "activo"
                          ? COLORS.success
                          : COLORS.textSecondary,
                    }}
                  >
                    {ex.estado}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    {ex.fecha_inicio
                      ? new Date(ex.fecha_inicio).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    {ex.fecha_fin
                      ? new Date(ex.fecha_fin).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    <button
                      onClick={() => handleDelete(ex.id)}
                      style={{
                        background: COLORS.error,
                        color: COLORS.surface,
                        border: "none",
                        borderRadius: BORDER_RADIUS.sm,
                        padding: SPACING[2],
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamenesPanel;
