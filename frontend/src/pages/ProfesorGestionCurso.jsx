import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axiosConfig";
import { COLORS, FONTS, SPACING, FONT_SIZES, FONT_WEIGHTS } from "../theme/branding/branding";
import GestionAlumnosCurso from "../components/profesor/GestionAlumnosCurso";
import { useRef } from "react";

const tabs = [
  { key: "alumnos", label: "Alumnos" },
  { key: "tareas", label: "Tareas" },
];

const ProfesorGestionCurso = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [codigoInvitacion, setCodigoInvitacion] = useState("");
  const [tab, setTab] = useState("alumnos");
  const [tareas, setTareas] = useState([]);
  const [loadingTareas, setLoadingTareas] = useState(false);
  const [formTarea, setFormTarea] = useState({
    titulo: "",
    descripcion: "",
    fecha_asignacion: "",
    fecha_entrega: "",
    tipo: "individual",
    estado: "activa",
    puntos_maximos: 100,
  });
  const [creandoTarea, setCreandoTarea] = useState(false);
  const [mensajeTarea, setMensajeTarea] = useState("");
  const [errorTarea, setErrorTarea] = useState("");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const tiposValidos = ["individual", "grupal", "opcional"];
  const buttonStyle = {
    background: COLORS.primary,
    color: COLORS.white,
    border: "none",
    borderRadius: 6,
    padding: "8px 18px",
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.base,
    cursor: "pointer",
    transition: "background 0.2s",
  };
  const fileInputRef = useRef();
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [archivosTarea, setArchivosTarea] = useState([]);
  const [links, setLinks] = useState([{ url: "", descripcion: "" }]);
  const [imagenUrl, setImagenUrl] = useState("");
  const [modalTarea, setModalTarea] = useState(null);
  const [modalArchivos, setModalArchivos] = useState([]);
  // NUEVO: Estado para edición
  const [editandoTarea, setEditandoTarea] = useState(null);

  useEffect(() => {
    const fetchCurso = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/cursos/${id}`);
        const data = res.data.data || res.data;
        setCurso(data);
        setAlumnos(data.alumnos || []);
        setCodigoInvitacion(data.codigo_invitacion || "");
      } catch (e) {
        setError("Error al cargar el curso");
      } finally {
        setLoading(false);
      }
    };
    fetchCurso();
  }, [id]);

  useEffect(() => {
    if (tab === "tareas") {
      const fetchTareas = async () => {
        setLoadingTareas(true);
        try {
          const res = await api.get(`/cursos/${id}/tareas`);
          setTareas(res.data.data || []);
        } catch (e) {
          setTareas([]);
        } finally {
          setLoadingTareas(false);
        }
      };
      fetchTareas();
    }
  }, [tab, id]);

  // Acciones para gestión de alumnos
  const handleInvitar = async (email) => {
    await api.post(`/cursos/${id}/invitar`, { email });
    const res = await api.get(`/cursos/${id}`);
    setAlumnos(res.data.data.alumnos || []);
  };
  const handleGenerarCodigo = async () => {
    const res = await api.post(`/cursos/${id}/generar-codigo-invitacion`);
    // Intenta obtener el código tanto de la respuesta directa como de un refresco del curso
    let nuevoCodigo = res.data.codigo_invitacion || res.data.data?.codigo_invitacion || "";
    setCodigoInvitacion(nuevoCodigo);
    // Refresca el curso para asegurar que el código se muestre si la API lo guarda en el curso
    const refresco = await api.get(`/cursos/${id}`);
    setCodigoInvitacion(refresco.data.data?.codigo_invitacion || nuevoCodigo);
  };
  const handleAgregarManual = async (email) => {
    await api.post(`/cursos/${id}/agregar-alumno`, { email });
    const res = await api.get(`/cursos/${id}`);
    setAlumnos(res.data.data.alumnos || []);
  };

  const handleCrearTarea = async (e) => {
    e.preventDefault();
    setCreandoTarea(true);
    setMensajeTarea("");
    setErrorTarea("");
    if (!formTarea.titulo || !formTarea.descripcion || !formTarea.fecha_asignacion || !formTarea.fecha_entrega) {
      setErrorTarea("Completa todos los campos obligatorios.");
      setCreandoTarea(false);
      return;
    }
    if (formTarea.fecha_entrega < formTarea.fecha_asignacion) {
      setErrorTarea("La fecha de entrega debe ser igual o posterior a la de asignación.");
      setCreandoTarea(false);
      return;
    }
    let tipo = String(formTarea.tipo).toLowerCase();
    if (!tiposValidos.includes(tipo)) tipo = "individual";
    try {
      const datos = {
        titulo: formTarea.titulo,
        descripcion: formTarea.descripcion,
        fecha_asignacion: formTarea.fecha_asignacion,
        fecha_entrega: formTarea.fecha_entrega,
        tipo,
        estado: String(formTarea.estado).toLowerCase(),
        puntos_maximos: Number(formTarea.puntos_maximos),
        curso_id: id,
        imagen_url: imagenUrl,
        links: links.filter(l => l.url),
      };
      // Crear tarea en backend
      const tareaRes = await api.post(`/tareas`, datos);
      setMensajeTarea("¡Tarea creada exitosamente!");
      setFormTarea({ titulo: "", descripcion: "", fecha_asignacion: "", fecha_entrega: "", tipo: "individual", estado: "activa", puntos_maximos: 100 });
      setImagenUrl("");
      // Subir archivo si hay
      const file = fileInputRef.current?.files[0];
      if (file && tareaRes.data && tareaRes.data.mysql && tareaRes.data.mysql.id) {
        setSubiendoArchivo(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("context", "tarea");
        formData.append("context_id", tareaRes.data.mysql.id);
        formData.append("type", file.type.startsWith("video") ? "video" : file.type.startsWith("image") ? "imagen" : "documento");
        await api.post("/multimedia", formData, { headers: { "Content-Type": "multipart/form-data" } });
        setSubiendoArchivo(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      // Refrescar tareas y archivos
      const res = await api.get(`/cursos/${id}/tareas`);
      setTareas(res.data.data || []);
      if (tareaRes.data && tareaRes.data.mysql && tareaRes.data.mysql.id) {
        const archivosRes = await api.get(`/multimedia/tarea/${tareaRes.data.mysql.id}`);
        setArchivosTarea(archivosRes.data || []);
      }
    } catch (e) {
      setErrorTarea("Error al crear la tarea");
    } finally {
      setCreandoTarea(false);
      setSubiendoArchivo(false);
    }
  };

  // NUEVO: Función para iniciar edición
  const handleEditarTarea = (tarea) => {
    setEditandoTarea(tarea);
    setFormTarea({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fecha_asignacion: tarea.fecha_asignacion,
      fecha_entrega: tarea.fecha_entrega,
      tipo: tarea.tipo,
      estado: tarea.estado,
      puntos_maximos: tarea.puntos_maximos,
    });
    setImagenUrl(tarea.imagen_url || "");
    setLinks(Array.isArray(tarea.links) ? tarea.links : []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // NUEVO: Función para cancelar edición
  const handleCancelarEdicion = () => {
    setEditandoTarea(null);
    setFormTarea({ titulo: "", descripcion: "", fecha_asignacion: "", fecha_entrega: "", tipo: "individual", estado: "activa", puntos_maximos: 100 });
    setImagenUrl("");
    setLinks([{ url: "", descripcion: "" }]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  // NUEVO: Función para actualizar tarea
  const handleActualizarTarea = async (e) => {
    e.preventDefault();
    setCreandoTarea(true);
    setMensajeTarea("");
    setErrorTarea("");
    if (!formTarea.titulo || !formTarea.descripcion || !formTarea.fecha_asignacion || !formTarea.fecha_entrega) {
      setErrorTarea("Completa todos los campos obligatorios.");
      setCreandoTarea(false);
      return;
    }
    if (formTarea.fecha_entrega < formTarea.fecha_asignacion) {
      setErrorTarea("La fecha de entrega debe ser igual o posterior a la de asignación.");
      setCreandoTarea(false);
      return;
    }
    let tipo = String(formTarea.tipo).toLowerCase();
    if (!tiposValidos.includes(tipo)) tipo = "individual";
    try {
      const datos = {
        titulo: formTarea.titulo,
        descripcion: formTarea.descripcion,
        fecha_asignacion: formTarea.fecha_asignacion,
        fecha_entrega: formTarea.fecha_entrega,
        tipo,
        estado: String(formTarea.estado).toLowerCase(),
        puntos_maximos: Number(formTarea.puntos_maximos),
        imagen_url: imagenUrl,
        links: links.filter(l => l.url),
      };
      // Actualizar tarea en backend
      await api.put(`/tareas/${editandoTarea.id}`, datos);
      setMensajeTarea("¡Tarea actualizada exitosamente!");
      setEditandoTarea(null);
      setFormTarea({ titulo: "", descripcion: "", fecha_asignacion: "", fecha_entrega: "", tipo: "individual", estado: "activa", puntos_maximos: 100 });
      setImagenUrl("");
      setLinks([{ url: "", descripcion: "" }]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Refrescar tareas
      const res = await api.get(`/cursos/${id}/tareas`);
      setTareas(res.data.data || []);
    } catch (e) {
      setErrorTarea("Error al actualizar la tarea");
    } finally {
      setCreandoTarea(false);
    }
  };
  // NUEVO: Función para eliminar tarea
  const handleEliminarTarea = async (tarea) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete(`/tareas/${tarea.id}`);
      setMensajeTarea("Tarea eliminada exitosamente");
      // Refrescar tareas
      const res = await api.get(`/cursos/${id}/tareas`);
      setTareas(res.data.data || []);
      setModalTarea(null);
    } catch (e) {
      setErrorTarea(e.response?.data?.message || "No se pudo eliminar la tarea. Puede tener entregas asociadas.");
    }
  };

  // Cuando se abre el modal, consulta los archivos multimedia de la tarea seleccionada
  useEffect(() => {
    async function fetchModalArchivos() {
      if (modalTarea && modalTarea.id) {
        try {
          const res = await api.get(`/multimedia/tarea/${modalTarea.id}`);
          setModalArchivos(res.data || []);
        } catch {
          setModalArchivos([]);
        }
      } else {
        setModalArchivos([]);
      }
    }
    fetchModalArchivos();
  }, [modalTarea]);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando curso...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: COLORS.error }}>{error}</div>;
  if (!curso) return <div style={{ padding: 40, textAlign: "center" }}>Curso no encontrado</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
      <h1 style={{ fontSize: FONT_SIZES["3xl"], fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 18 }}>
        {curso?.titulo}
      </h1>
      <p style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.lg, marginBottom: 24 }}>{curso?.descripcion}</p>
      <div style={{ marginBottom: 32 }}>
        <b>Cuatrimestre:</b> {curso?.cuatrimestre || "No especificado"} <br />
        <b>Duración:</b> {curso?.duracion || "No especificada"} <br />
        <b>Nivel:</b> {curso?.nivel || "Principiante"} <br />
        <b>Estado:</b> {curso?.estado || "Activo"}
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: tab === t.key ? COLORS.primary : COLORS.surface,
              color: tab === t.key ? COLORS.white : COLORS.text,
              border: `1px solid ${COLORS.primary}`,
              borderRadius: 8,
              padding: "10px 28px",
              fontWeight: 600,
              fontSize: FONT_SIZES.base,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Contenido de la pestaña */}
      {tab === "alumnos" && (
        <GestionAlumnosCurso
          alumnos={alumnos}
          onInvitar={handleInvitar}
          onGenerarCodigo={handleGenerarCodigo}
          onAgregarManual={handleAgregarManual}
          codigoInvitacion={codigoInvitacion}
          cursoId={id}
        />
      )}
      {tab === "tareas" && (
        <div>
          <h2 style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 18 }}>
            Tareas del curso
          </h2>
          {/* Formulario para crear/editar tarea */}
          <form onSubmit={editandoTarea ? handleActualizarTarea : handleCrearTarea} style={{ background: COLORS.surface, borderRadius: 8, padding: 24, marginBottom: 32, boxShadow: "0 1px 4px #0001", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontWeight: 600 }}>Título *</label>
              <input
                type="text"
                value={formTarea.titulo}
                onChange={e => setFormTarea({ ...formTarea, titulo: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                required
              />
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Descripción *</label>
              <textarea
                value={formTarea.descripcion}
                onChange={e => setFormTarea({ ...formTarea, descripcion: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                required
              />
            </div>
            <div style={{ display: "flex", gap: 24, flexDirection: isMobile ? "column" : "row" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600 }}>Fecha de asignación *</label>
                <input
                  type="date"
                  value={formTarea.fecha_asignacion}
                  onChange={e => setFormTarea({ ...formTarea, fecha_asignacion: e.target.value })}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600 }}>Fecha de entrega *</label>
                <input
                  type="date"
                  value={formTarea.fecha_entrega}
                  onChange={e => setFormTarea({ ...formTarea, fecha_entrega: e.target.value })}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexDirection: isMobile ? "column" : "row" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600 }}>Tipo *</label>
                <select
                  value={formTarea.tipo}
                  onChange={e => setFormTarea({ ...formTarea, tipo: e.target.value })}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                  required
                >
                  <option value="individual">Individual</option>
                  <option value="grupal">Grupal</option>
                  <option value="opcional">Opcional</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600 }}>Estado *</label>
                <select
                  value={formTarea.estado}
                  onChange={e => setFormTarea({ ...formTarea, estado: e.target.value })}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                  required
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                  <option value="borrador">Borrador</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600 }}>Puntos máximos *</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formTarea.puntos_maximos}
                  onChange={e => setFormTarea({ ...formTarea, puntos_maximos: e.target.value })}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Archivo multimedia (opcional)</label>
              <input type="file" ref={fileInputRef} accept="video/*,image/*,application/pdf" style={{ width: isMobile ? "100%" : 320 }} />
            </div>
            {/* Imagen de portada */}
            <div>
              <label style={{ fontWeight: 600 }}>Imagen de portada (URL, opcional)</label>
              <input
                type="url"
                placeholder="https://... .jpg .png .webp"
                value={imagenUrl}
                onChange={e => setImagenUrl(e.target.value)}
                style={{ width: isMobile ? "100%" : 320, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
              />
              {imagenUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(imagenUrl) && (
                <div style={{ color: COLORS.error, fontSize: 13 }}>La URL debe ser de una imagen válida (.jpg, .jpeg, .png, .webp)</div>
              )}
            </div>
            {/* Links dinámicos */}
            <div>
              <label style={{ fontWeight: 600 }}>Links externos (opcional)</label>
              {links.map((link, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, flexDirection: isMobile ? "column" : "row" }}>
                  <input
                    type="url"
                    placeholder="URL (https://...)"
                    value={link.url}
                    onChange={e => {
                      const newLinks = [...links];
                      newLinks[idx].url = e.target.value;
                      setLinks(newLinks);
                    }}
                    style={{ flex: 2, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                  />
                  <input
                    type="text"
                    placeholder="Descripción (opcional)"
                    value={link.descripcion}
                    onChange={e => {
                      const newLinks = [...links];
                      newLinks[idx].descripcion = e.target.value;
                      setLinks(newLinks);
                    }}
                    style={{ flex: 2, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                  />
                  <button type="button" onClick={() => setLinks(links.filter((_, i) => i !== idx))} style={{ ...buttonStyle, background: COLORS.error, color: COLORS.white, padding: "4px 10px", fontSize: 14, minWidth: 0 }}>🗑️</button>
                </div>
              ))}
              <button type="button" onClick={() => setLinks([...links, { url: "", descripcion: "" }])} style={{ ...buttonStyle, marginTop: 4 }}>+ Agregar otro link</button>
            </div>
            {subiendoArchivo && <div style={{ color: COLORS.primary }}>Subiendo archivo...</div>}
            {errorTarea && <div style={{ color: COLORS.error }}>{errorTarea}</div>}
            {mensajeTarea && <div style={{ color: COLORS.success }}>{mensajeTarea}</div>}
            <button
              type="submit"
              disabled={creandoTarea}
              style={{
                background: COLORS.primary,
                color: COLORS.white,
                border: "none",
                borderRadius: 6,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: FONT_SIZES.base,
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              {creandoTarea ? (editandoTarea ? "Actualizando..." : "Creando...") : (editandoTarea ? "Actualizar Tarea" : "Crear Tarea")}
            </button>
            {editandoTarea && (
              <button type="button" onClick={handleCancelarEdicion} style={{ ...buttonStyle, background: COLORS.error, marginTop: 8 }}>Cancelar edición</button>
            )}
          </form>
          {/* Listado de tareas */}
          {loadingTareas ? (
            <div style={{ padding: 40, textAlign: "center" }}>Cargando tareas...</div>
          ) : tareas.length === 0 ? (
            <div style={{ color: COLORS.textSecondary, padding: 40, textAlign: "center" }}>No hay tareas registradas.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {tareas.map((tarea) => (
                <div key={tarea.id} style={{ background: COLORS.surfaceLight, borderRadius: 8, padding: 0, boxShadow: "0 1px 4px #0001", cursor: "pointer", overflow: "hidden", position: "relative" }} onClick={() => setModalTarea(tarea)}>
                  {tarea.imagen_url && /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(tarea.imagen_url) && (
                    <img src={tarea.imagen_url} alt="Portada" style={{ width: "100%", height: 180, objectFit: "cover", borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                  )}
                  <div style={{ padding: 18 }}>
                    <div style={{ fontWeight: 600, fontSize: FONT_SIZES.lg }}>{tarea.titulo}</div>
                    <div style={{ color: COLORS.textSecondary, margin: "6px 0" }}>{tarea.descripcion}</div>
                    <div style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                      Fecha de entrega: <b>{tarea.fecha_entrega}</b>
                    </div>
                    {/* Previsualización de archivos multimedia asociados */}
                    <PreviewArchivos tareaId={tarea.id} />
                    {/* Previsualización de links */}
                    <PreviewLinks links={tarea.links} />
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8 }}>
                    <button onClick={e => { e.stopPropagation(); handleEditarTarea(tarea); }} style={{ ...buttonStyle, background: COLORS.primary, fontSize: 14, padding: "4px 12px" }}>Editar</button>
                    <button onClick={e => { e.stopPropagation(); handleEliminarTarea(tarea); }} style={{ ...buttonStyle, background: COLORS.error, fontSize: 14, padding: "4px 12px" }}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Modal de previsualización de tarea */}
          {modalTarea && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setModalTarea(null)}>
              <div style={{ background: COLORS.surface, borderRadius: 12, maxWidth: 540, width: "90vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 32px #0008", padding: 0, position: "relative" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setModalTarea(null)} style={{ position: "absolute", top: 12, right: 16, background: COLORS.error, color: COLORS.white, border: "none", borderRadius: 6, padding: "4px 12px", fontWeight: 700, fontSize: 18, cursor: "pointer", zIndex: 2 }}>✕</button>
                {modalTarea.imagen_url && /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(modalTarea.imagen_url) && (
                  <img src={modalTarea.imagen_url} alt="Portada" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
                )}
                <div style={{ padding: 28 }}>
                  <div style={{ fontWeight: 700, fontSize: FONT_SIZES["2xl"], color: COLORS.primary, marginBottom: 10 }}>{modalTarea.titulo}</div>
                  <div style={{ color: COLORS.textSecondary, marginBottom: 18 }}>{modalTarea.descripcion}</div>
                  <div style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 10 }}>
                    Fecha de entrega: <b>{modalTarea.fecha_entrega}</b>
                  </div>
                  {/* Previsualización de archivos multimedia asociados en el modal */}
                  <div style={{ marginBottom: 16 }}>
                    <PreviewArchivosDirect archivos={modalArchivos} />
                  </div>
                  <PreviewLinks links={modalTarea.links} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfesorGestionCurso;

// Componente para previsualizar archivos multimedia asociados a una tarea
function PreviewArchivos({ tareaId }) {
  const [archivos, setArchivos] = useState([]);
  useEffect(() => {
    async function fetchArchivos() {
      try {
        const res = await api.get(`/multimedia/tarea/${tareaId}`);
        setArchivos(res.data || []);
      } catch {}
    }
    fetchArchivos();
  }, [tareaId]);
  if (!archivos.length) return null;
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

// Componente para previsualizar links
function PreviewLinks({ links }) {
  if (!links || !links.length) return null;
  return (
    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
      {links.map((l, idx) => (
        <PreviewLink key={idx} url={l.url} descripcion={l.descripcion} />
      ))}
    </div>
  );
}
// Componente para previsualizar un solo link
function PreviewLink({ url, descripcion }) {
  // Previsualización básica: YouTube, PDF, favicon, título
  const isYouTube = url && url.includes("youtube.com/watch?v=");
  const isPDF = url && url.endsWith(".pdf");
  const favicon = url ? `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}` : "";
  return (
    <div style={{ background: COLORS.surfaceLight, borderRadius: 6, padding: 8, display: "flex", alignItems: "center", gap: 10 }}>
      {isYouTube ? (
        <iframe width="120" height="68" src={`https://www.youtube.com/embed/${url.split("v=")[1]}`} title="YouTube video" frameBorder="0" allowFullScreen style={{ borderRadius: 4 }}></iframe>
      ) : isPDF ? (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.primary, display: "flex", alignItems: "center", gap: 6 }}>
          <i className="fas fa-file-pdf" style={{ fontSize: 24 }}></i> PDF
        </a>
      ) : (
        <img src={favicon} alt="favicon" style={{ width: 20, height: 20, borderRadius: 3, marginRight: 6 }} />
      )}
      <div style={{ flex: 1 }}>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.primary, fontWeight: 600, wordBreak: "break-all" }}>{url}</a>
        {descripcion && <div style={{ color: COLORS.textSecondary, fontSize: 13 }}>{descripcion}</div>}
      </div>
    </div>
  );
}

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