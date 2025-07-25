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

const MensajesPanel = () => {
  const { usuario } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("recibidos");
  const [form, setForm] = useState({
    destinatario_id: "",
    asunto: "",
    contenido: "",
    prioridad: "normal",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Log para depuración de usuario y roles
  React.useEffect(() => {
    console.log("[MensajesPanel] usuario:", usuario);
  }, [usuario]);

  useEffect(() => {
    fetchMensajes();
    fetchUsuarios();
  }, [activeTab]);

  const fetchMensajes = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "recibidos"
          ? "/mensajes/recibidos"
          : "/mensajes/enviados";
      const response = await api.get(endpoint);
      setMensajes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching mensajes:", error);
      setError("Error al cargar los mensajes");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      // Si el usuario es admin, usa /usuarios; si no, usa /usuarios/contactos
      if (usuario?.roles?.includes("admin")) {
        const response = await api.get("/usuarios");
        setUsuarios(response.data.data || []);
      } else {
        const response = await api.get("/usuarios/contactos");
        setUsuarios(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEnviando(true);

    if (!form.destinatario_id || !form.asunto || !form.contenido) {
      setError("Destinatario, asunto y contenido son obligatorios");
      setEnviando(false);
      return;
    }

    try {
      const response = await api.post("/mensajes", {
        ...form,
        remitente_id: usuario.id,
      });

      setMensajes([...mensajes, response.data.data]);
      setShowForm(false);
      setForm({
        destinatario_id: "",
        asunto: "",
        contenido: "",
        prioridad: "normal",
      });
      setSuccess("Mensaje enviado exitosamente");
    } catch (error) {
      console.error("Error creating mensaje:", error);
      setError(error.response?.data?.message || "Error al enviar el mensaje");
    } finally {
      setEnviando(false);
    }
  };

  const handleMarkAsRead = async (mensajeId) => {
    try {
      await api.put(`/mensajes/${mensajeId}/leer`);
      setMensajes(
        mensajes.map((msg) =>
          msg.id === mensajeId ? { ...msg, leido: true } : msg,
        ),
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este mensaje?")
    ) {
      return;
    }

    try {
      await api.delete(`/mensajes/${id}`);
      setMensajes(mensajes.filter((msg) => msg.id !== id));
      setSuccess("Mensaje eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting mensaje:", error);
      setError("Error al eliminar el mensaje");
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return COLORS.error;
      case "media":
        return COLORS.warning;
      default:
        return COLORS.success;
    }
  };

  const getPrioridadLabel = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "Alta";
      case "media":
        return "Media";
      default:
        return "Normal";
    }
  };

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
        Mensajes Internos
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

      <div
        style={{ display: "flex", gap: SPACING[4], marginBottom: SPACING[6] }}
      >
        <button
          onClick={() => setActiveTab("recibidos")}
          style={{
            padding: SPACING[3],
            background:
              activeTab === "recibidos" ? COLORS.primary : COLORS.surface,
            color: activeTab === "recibidos" ? COLORS.surface : COLORS.text,
            border: `1px solid ${COLORS.border}`,
            borderRadius: BORDER_RADIUS.md,
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Recibidos
        </button>
        <button
          onClick={() => setActiveTab("enviados")}
          style={{
            padding: SPACING[3],
            background:
              activeTab === "enviados" ? COLORS.primary : COLORS.surface,
            color: activeTab === "enviados" ? COLORS.surface : COLORS.text,
            border: `1px solid ${COLORS.border}`,
            borderRadius: BORDER_RADIUS.md,
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Enviados
        </button>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: SPACING[3],
            background: COLORS.success,
            color: COLORS.surface,
            border: "none",
            borderRadius: BORDER_RADIUS.md,
            fontWeight: "600",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          + Nuevo Mensaje
        </button>
      </div>

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
            Nuevo Mensaje
          </h2>

          <select
            name="destinatario_id"
            value={form.destinatario_id}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <option value="">Seleccionar destinatario</option>
            {usuarios
              .filter((u) => u.id !== usuario.id)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.roles?.join(", ")})
                </option>
              ))}
          </select>

          <input
            name="asunto"
            placeholder="Asunto del mensaje"
            value={form.asunto}
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
            name="prioridad"
            value={form.prioridad}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <option value="normal">Prioridad Normal</option>
            <option value="media">Prioridad Media</option>
            <option value="alta">Prioridad Alta</option>
          </select>

          <textarea
            name="contenido"
            placeholder="Contenido del mensaje"
            value={form.contenido}
            onChange={handleInputChange}
            rows="5"
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
            disabled={enviando}
            style={{
              padding: SPACING[3],
              background: enviando ? COLORS.textMuted : COLORS.primary,
              color: '#fff',
              border: 'none',
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: enviando ? 'not-allowed' : 'pointer',
              opacity: enviando ? 0.7 : 1,
              marginTop: 8
            }}
          >
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>

          {enviando && (
            <span style={{ color: COLORS.primary, fontWeight: 500, marginLeft: 12 }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: 6 }}></i>
              Enviando mensaje, espera unos segundos...
            </span>
          )}

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
          Cargando mensajes...
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: SPACING[4] }}
        >
          {mensajes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: COLORS.text,
                padding: SPACING[8],
                background: "#23272f",
                borderRadius: 16,
                border: "2.5px solid #007bff",
                margin: "40px auto",
                maxWidth: 500,
                boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              }}
            >
              <div style={{ fontSize: "3.5rem", marginBottom: 16, color: "#007bff" }}>✉️</div>
              <h3 style={{ color: "#fff", marginBottom: 12, fontSize: "1.3rem", fontWeight: 700 }}>
                No hay mensajes {activeTab === "recibidos" ? "recibidos" : "enviados"}
              </h3>
              <p style={{ color: "#b0b8c1", fontSize: "1.08rem", marginBottom: 0 }}>
                {activeTab === "recibidos"
                  ? "Cuando recibas mensajes de otros usuarios, aparecerán aquí."
                  : "Cuando envíes mensajes, aparecerán aquí para tu referencia."}
              </p>
            </div>
          ) : (
            mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                style={{
                  background: mensaje.leido
                    ? COLORS.surface
                    : COLORS.surfaceLight,
                  borderRadius: BORDER_RADIUS.lg,
                  boxShadow: SHADOWS.md,
                  padding: SPACING[6],
                  borderLeft: `4px solid ${getPrioridadColor(mensaje.prioridad)}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: SPACING[4],
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: COLORS.text,
                        fontSize: FONT_SIZES.lg,
                        fontWeight: FONT_WEIGHTS.medium,
                        margin: 0,
                      }}
                    >
                      {mensaje.asunto}
                    </h3>
                    <p
                      style={{
                        color: COLORS.textSecondary,
                        fontSize: FONT_SIZES.sm,
                        margin: SPACING[2] + " 0 0 0",
                      }}
                    >
                      {activeTab === "recibidos"
                        ? `De: ${mensaje.remitente?.name}`
                        : `Para: ${mensaje.destinatario?.name}`}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: SPACING[2],
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        background: getPrioridadColor(mensaje.prioridad),
                        color: COLORS.surface,
                        padding: SPACING[1] + " " + SPACING[2],
                        borderRadius: BORDER_RADIUS.sm,
                        fontSize: FONT_SIZES.xs,
                        fontWeight: FONT_WEIGHTS.medium,
                      }}
                    >
                      {getPrioridadLabel(mensaje.prioridad)}
                    </span>
                    {!mensaje.leido && activeTab === "recibidos" && (
                      <span
                        style={{
                          background: COLORS.primary,
                          color: COLORS.surface,
                          padding: SPACING[1] + " " + SPACING[2],
                          borderRadius: BORDER_RADIUS.sm,
                          fontSize: FONT_SIZES.xs,
                          fontWeight: FONT_WEIGHTS.medium,
                        }}
                      >
                        Nuevo
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ color: COLORS.text, marginBottom: SPACING[4] }}>
                  {mensaje.contenido}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: COLORS.textSecondary,
                      fontSize: FONT_SIZES.sm,
                    }}
                  >
                    {new Date(mensaje.created_at).toLocaleDateString()}
                  </span>

                  <div style={{ display: "flex", gap: SPACING[2] }}>
                    {!mensaje.leido && activeTab === "recibidos" && (
                      <button
                        onClick={() => handleMarkAsRead(mensaje.id)}
                        style={{
                          background: COLORS.primary,
                          color: COLORS.surface,
                          border: "none",
                          borderRadius: BORDER_RADIUS.sm,
                          padding: SPACING[2],
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: FONT_SIZES.sm,
                        }}
                      >
                        Marcar como leído
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(mensaje.id)}
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MensajesPanel;
