import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
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

const RecursosPanel = () => {
  const api = useApi();
  const { usuario } = useAuth();
  const [recursos, setRecursos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "documento",
    url: "",
    curso_id: "",
    estado: "activo",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Verificar permisos
  const canManageResources =
    usuario?.roles?.includes("profesor") || usuario?.roles?.includes("admin");

  useEffect(() => {
    if (canManageResources) {
      fetchRecursos();
      fetchCursos();
    }
  }, [canManageResources]);

  const fetchRecursos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/recursos");
      setRecursos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching recursos:", error);
      setError("Error al cargar los recursos");
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
      const response = await api.post("/recursos", {
        ...form,
        creador_id: usuario.id,
      });

      setRecursos([...recursos, response.data.data]);
      setShowForm(false);
      setForm({
        titulo: "",
        descripcion: "",
        tipo: "documento",
        url: "",
        curso_id: "",
        estado: "activo",
      });
      setSuccess("Recurso creado exitosamente");
    } catch (error) {
      console.error("Error creating recurso:", error);
      setError(error.response?.data?.message || "Error al crear el recurso");
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const response = await api.put(`/recursos/${id}`, updates);
      setRecursos(
        recursos.map((recurso) =>
          recurso.id === id ? response.data.data : recurso,
        ),
      );
      setSuccess("Recurso actualizado exitosamente");
    } catch (error) {
      console.error("Error updating recurso:", error);
      setError("Error al actualizar el recurso");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este recurso?")
    ) {
      return;
    }

    try {
      await api.delete(`/recursos/${id}`);
      setRecursos(recursos.filter((recurso) => recurso.id !== id));
      setSuccess("Recurso eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting recurso:", error);
      setError("Error al eliminar el recurso");
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "documento":
        return "📄";
      case "video":
        return "🎥";
      case "audio":
        return "🎵";
      case "imagen":
        return "🖼️";
      case "enlace":
        return "🔗";
      default:
        return "📎";
    }
  };

  if (!canManageResources) {
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
          <p>No tienes permisos para gestionar recursos.</p>
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
        Gestión de Recursos
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
        + Nuevo Recurso
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
            Crear Recurso
          </h2>

          <input
            name="titulo"
            placeholder="Título del recurso"
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
            placeholder="Descripción del recurso"
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
            name="tipo"
            value={form.tipo}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <option value="documento">Documento</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="imagen">Imagen</option>
            <option value="enlace">Enlace</option>
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
            name="url"
            placeholder="URL del recurso (opcional)"
            value={form.url}
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
            Crear Recurso
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
          Cargando recursos...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: SPACING[6],
          }}
        >
          {recursos.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: COLORS.textSecondary,
                padding: SPACING[8],
              }}
            >
              No hay recursos registrados
            </div>
          ) : (
            recursos.map((recurso) => (
              <div
                key={recurso.id}
                style={{
                  background: COLORS.surface,
                  borderRadius: BORDER_RADIUS.lg,
                  boxShadow: SHADOWS.md,
                  padding: SPACING[6],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: SPACING[4],
                  }}
                >
                  <span
                    style={{
                      fontSize: FONT_SIZES["2xl"],
                      marginRight: SPACING[3],
                    }}
                  >
                    {getTipoIcon(recurso.tipo)}
                  </span>
                  <div>
                    <h3
                      style={{
                        color: COLORS.text,
                        fontSize: FONT_SIZES.lg,
                        fontWeight: FONT_WEIGHTS.medium,
                        margin: 0,
                      }}
                    >
                      {recurso.titulo}
                    </h3>
                    <p
                      style={{
                        color: COLORS.textSecondary,
                        fontSize: FONT_SIZES.sm,
                        margin: 0,
                      }}
                    >
                      {recurso.curso?.titulo || "Sin curso asignado"}
                    </p>
                  </div>
                </div>

                <p style={{ color: COLORS.text, marginBottom: SPACING[4] }}>
                  {recurso.descripcion}
                </p>

                {recurso.url && (
                  <a
                    href={recurso.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: COLORS.primary,
                      textDecoration: "none",
                      fontSize: FONT_SIZES.sm,
                    }}
                  >
                    Ver recurso →
                  </a>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: SPACING[4],
                  }}
                >
                  <select
                    value={recurso.estado}
                    onChange={(e) =>
                      handleUpdate(recurso.id, { estado: e.target.value })
                    }
                    style={{
                      padding: SPACING[2],
                      borderRadius: BORDER_RADIUS.sm,
                      border: `1px solid ${COLORS.border}`,
                      background:
                        recurso.estado === "activo"
                          ? COLORS.success
                          : COLORS.error,
                      color: COLORS.surface,
                      fontSize: FONT_SIZES.sm,
                    }}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>

                  <button
                    onClick={() => handleDelete(recurso.id)}
                    style={{
                      background: COLORS.error,
                      color: COLORS.surface,
                      border: "none",
                      borderRadius: BORDER_RADIUS.sm,
                      padding: SPACING[2],
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: FONT_SIZES.sm,
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecursosPanel;
