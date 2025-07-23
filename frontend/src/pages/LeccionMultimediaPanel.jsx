import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";
import {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
} from "../theme/branding/branding";

const LeccionMultimediaPanel = ({ leccionId }) => {
  const [imagenes, setImagenes] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [orden, setOrden] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (leccionId) fetchImagenes();
    // eslint-disable-next-line
  }, [leccionId]);

  const fetchImagenes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/multimedia/leccion/${leccionId}`);
      setImagenes(res.data.data.filter((m) => m.tipo === "imagen"));
    } catch (e) {
      setError("Error al cargar imágenes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubir = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!archivo || !titulo) {
      setError("El título y la imagen son obligatorios");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("tipo", "imagen");
      formData.append("leccion_id", leccionId);
      formData.append("orden", orden);
      formData.append("estado", "activo");
      formData.append("url", archivo);
      await api.post("/multimedia", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setTitulo("");
      setDescripcion("");
      setArchivo(null);
      setOrden(1);
      setSuccess("Imagen subida exitosamente");
      fetchImagenes();
    } catch (e) {
      setError("Error al subir la imagen");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    try {
      await api.delete(`/multimedia/${id}`);
      setSuccess("Imagen eliminada");
      fetchImagenes();
    } catch (e) {
      setError("No se pudo eliminar la imagen");
    }
  };

  return (
    <div style={{ background: COLORS.surface, borderRadius: 12, padding: 32, boxShadow: SHADOWS.md, marginBottom: 32 }}>
      <h2 style={{ color: COLORS.primary, fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, marginBottom: 18 }}>
        Imágenes de la Lección
      </h2>
      <form onSubmit={handleSubir} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Título de la imagen"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
          required
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
        />
        <input
          type="number"
          min={1}
          value={orden}
          onChange={e => setOrden(e.target.value)}
          placeholder="Orden"
          style={{ width: 120, marginBottom: 8, marginRight: 12, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setArchivo(e.target.files[0])}
          style={{ marginBottom: 8 }}
          required
        />
        <button type="submit" style={{ background: COLORS.primary, color: COLORS.white, border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer", marginLeft: 12 }}>
          Subir Imagen
        </button>
      </form>
      {error && <div style={{ color: COLORS.error, marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: COLORS.success, marginBottom: 8 }}>{success}</div>}
      {loading ? (
        <div style={{ color: COLORS.textSecondary }}>Cargando imágenes...</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {imagenes.length === 0 ? (
            <div style={{ color: COLORS.textSecondary }}>No hay imágenes registradas</div>
          ) : (
            imagenes.map(img => (
              <div key={img.id} style={{ background: COLORS.surface, borderRadius: 8, boxShadow: SHADOWS.sm, padding: 12, maxWidth: 220 }}>
                <img src={img.url.startsWith("http") ? img.url : `/storage/${img.url}`} alt={img.titulo} style={{ width: 180, borderRadius: 8, marginBottom: 8 }} />
                <div style={{ fontWeight: 600 }}>{img.titulo}</div>
                <div style={{ fontSize: 13, color: COLORS.textSecondary }}>{img.descripcion}</div>
                <button onClick={() => handleEliminar(img.id)} style={{ background: COLORS.error, color: COLORS.white, border: "none", borderRadius: 6, padding: "4px 12px", fontWeight: 600, marginTop: 8, cursor: "pointer" }}>
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LeccionMultimediaPanel; 