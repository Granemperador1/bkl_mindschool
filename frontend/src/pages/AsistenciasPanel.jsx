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

const AsistenciasPanel = () => {
  const { usuario } = useAuth();
  const [asistencias, setAsistencias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    estudiante_id: "",
    curso_id: "",
    fecha: "",
    estado: "presente",
    observaciones: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Verificar permisos
  const canManageAttendance =
    usuario?.roles?.includes("profesor") || usuario?.roles?.includes("admin");

  useEffect(() => {
    if (canManageAttendance) {
      fetchAsistencias();
      fetchCursos();
      fetchEstudiantes();
    }
  }, [canManageAttendance]);

  const fetchAsistencias = async () => {
    try {
      setLoading(true);
      const response = await api.get("/asistencias");
      setAsistencias(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching asistencias:", error);
      setError("Error al cargar las asistencias");
      setAsistencias([]);
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

  const fetchEstudiantes = async () => {
    try {
      const response = await api.get("/usuarios?role=estudiante");
      setEstudiantes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching estudiantes:", error);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.estudiante_id || !form.curso_id || !form.fecha) {
      setError("Estudiante, curso y fecha son obligatorios");
      return;
    }

    try {
      const response = await api.post("/asistencias", {
        ...form,
        registrador_id: usuario.id,
      });

      setAsistencias([...asistencias, response.data.data]);
      setShowForm(false);
      setForm({
        estudiante_id: "",
        curso_id: "",
        fecha: "",
        estado: "presente",
        observaciones: "",
      });
      setSuccess("Asistencia registrada exitosamente");
    } catch (error) {
      console.error("Error creating asistencia:", error);
      setError(
        error.response?.data?.message || "Error al registrar la asistencia",
      );
    }
  };

  const handleUpdate = async (id, newEstado) => {
    try {
      const response = await api.put(`/asistencias/${id}`, {
        estado: newEstado,
      });
      setAsistencias(
        asistencias.map((as) => (as.id === id ? response.data.data : as)),
      );
      setSuccess("Asistencia actualizada exitosamente");
    } catch (error) {
      console.error("Error updating asistencia:", error);
      setError("Error al actualizar la asistencia");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar este registro de asistencia?",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/asistencias/${id}`);
      setAsistencias(asistencias.filter((as) => as.id !== id));
      setSuccess("Asistencia eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting asistencia:", error);
      setError("Error al eliminar la asistencia");
    }
  };

  if (!canManageAttendance) {
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
          <p>No tienes permisos para gestionar asistencias.</p>
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
        Gestión de Asistencias
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
        + Registrar Asistencia
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
            Registrar Asistencia
          </h2>

          <select
            name="estudiante_id"
            value={form.estudiante_id}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <option value="">Seleccionar estudiante</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.name}
              </option>
            ))}
          </select>

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
            type="date"
            name="fecha"
            value={form.fecha}
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
            name="estado"
            value={form.estado}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <option value="presente">Presente</option>
            <option value="ausente">Ausente</option>
            <option value="tardanza">Tardanza</option>
            <option value="justificado">Justificado</option>
          </select>

          <textarea
            name="observaciones"
            placeholder="Observaciones (opcional)"
            value={form.observaciones}
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
            Registrar Asistencia
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
          Cargando asistencias...
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
                Estudiante
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Curso
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Fecha
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Estado
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Observaciones
              </th>
              <th style={{ padding: SPACING[4], color: COLORS.primary }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {asistencias.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: SPACING[8],
                    textAlign: "center",
                    color: COLORS.textSecondary,
                  }}
                >
                  No hay registros de asistencia
                </td>
              </tr>
            ) : (
              Array.isArray(asistencias) && asistencias.map((as) => (
                <tr key={as.id}>
                  <td style={{ padding: SPACING[4] }}>
                    {as.estudiante?.name || "-"}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    {as.curso?.titulo || "-"}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    {as.fecha ? new Date(as.fecha).toLocaleDateString() : "-"}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    <select
                      value={as.estado}
                      onChange={(e) => handleUpdate(as.id, e.target.value)}
                      style={{
                        padding: SPACING[1],
                        borderRadius: BORDER_RADIUS.sm,
                        border: `1px solid ${COLORS.border}`,
                        background:
                          as.estado === "presente"
                            ? COLORS.success
                            : as.estado === "ausente"
                              ? COLORS.error
                              : as.estado === "tardanza"
                                ? COLORS.warning
                                : COLORS.info,
                        color: COLORS.surface,
                      }}
                    >
                      <option value="presente">Presente</option>
                      <option value="ausente">Ausente</option>
                      <option value="tardanza">Tardanza</option>
                      <option value="justificado">Justificado</option>
                    </select>
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    {as.observaciones || "-"}
                  </td>
                  <td style={{ padding: SPACING[4] }}>
                    <button
                      onClick={() => handleDelete(as.id)}
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

export default AsistenciasPanel;
