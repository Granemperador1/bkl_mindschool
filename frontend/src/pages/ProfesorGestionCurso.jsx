import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axiosConfig";
import { COLORS, FONTS, SPACING, FONT_SIZES, FONT_WEIGHTS } from "../theme/branding/branding";
import GestionAlumnosCurso from "../components/profesor/GestionAlumnosCurso";

const ProfesorGestionCurso = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [codigoInvitacion, setCodigoInvitacion] = useState("");

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

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando curso...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: COLORS.error }}>{error}</div>;
  if (!curso) return <div style={{ padding: 40, textAlign: "center" }}>Curso no encontrado</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
      <h1 style={{ fontSize: FONT_SIZES["3xl"], fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 18 }}>
        {curso.titulo}
      </h1>
      <p style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.lg, marginBottom: 24 }}>{curso.descripcion}</p>
      <div style={{ marginBottom: 32 }}>
        <b>Cuatrimestre:</b> {curso.cuatrimestre || "No especificado"} <br />
        <b>Duración:</b> {curso.duracion || "No especificada"} <br />
        <b>Nivel:</b> {curso.nivel || "Principiante"} <br />
        <b>Estado:</b> {curso.estado || "Activo"}
      </div>
      <GestionAlumnosCurso
        alumnos={alumnos}
        onInvitar={handleInvitar}
        onGenerarCodigo={handleGenerarCodigo}
        onAgregarManual={handleAgregarManual}
        codigoInvitacion={codigoInvitacion}
      />
    </div>
  );
};

export default ProfesorGestionCurso; 