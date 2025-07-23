import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import AgendaCalendario from "./AgendaCalendario";
import { useAuth } from "../../context/AuthContext";

const EstudianteReservaAsesoria = () => {
  const { usuario } = useAuth();
  const [profesores, setProfesores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfesores();
  }, []);

  const fetchProfesores = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/profesores"); // Ajusta el endpoint si es necesario
      setProfesores(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) {
      setError("Error al cargar profesores");
    } finally {
      setLoading(false);
    }
  };

  const fetchDisponibilidad = async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/asesorias/disponibilidad-profesor/${id}`);
      setDisponibilidad(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) {
      setError("Error al cargar disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    if (profesorId) fetchDisponibilidad(profesorId);
  };

  const diasSemana = {
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Miercoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6,
    'Sabado': 6,
    'Domingo': 0,
  };

  function getProximaFecha(diaSemana) {
    const hoy = new Date();
    const diaActual = hoy.getDay(); // Domingo=0, Lunes=1...
    const diaObjetivo = diasSemana[diaSemana];
    let diff = diaObjetivo - diaActual;
    if (diff < 0) diff += 7;
    if (diff === 0) {
      // Si es hoy pero la hora ya pasó, sumar 7 días
      return hoy;
    }
    const proxima = new Date(hoy);
    proxima.setDate(hoy.getDate() + diff);
    return proxima;
  }

  const handleSeleccionar = async (bloque) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      // Calcular la próxima fecha real del día de la semana
      const fecha = getProximaFecha(bloque.dia_semana);
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      // Combinar fecha con hora usando espacio, no 'T'
      const inicio = `${yyyy}-${mm}-${dd} ${bloque.hora_inicio}`;
      const fin = `${yyyy}-${mm}-${dd} ${bloque.hora_fin}`;
      // Depuración: mostrar payload
      console.log({
        profesor_id: profesorId,
        estudiante_id: usuario?.id,
        fecha_hora_inicio: inicio,
        fecha_hora_fin: fin,
        dia_semana: bloque.dia_semana,
      });
      await api.post("/asesorias/reservar", {
        profesor_id: profesorId,
        estudiante_id: usuario?.id,
        fecha_hora_inicio: inicio,
        fecha_hora_fin: fin,
        dia_semana: bloque.dia_semana,
      });
      setSuccess("¡Asesoría reservada exitosamente!");
    } catch (e) {
      setError("No se pudo reservar la asesoría");
    } finally {
      setLoading(false);
    }
  };

  const profesoresFiltrados = profesores.filter((p) =>
    p.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.id + "").includes(busqueda)
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
      <h2>Reservar Asesoría</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#333" }}>
          Buscar profesor por nombre o ID:
        </label>
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Nombre o ID del profesor"
          style={{ 
            width: "100%", 
            padding: 12, 
            marginBottom: 8,
            border: "2px solid #ddd",
            borderRadius: 8,
            fontSize: 16,
            backgroundColor: "#fff",
            color: "#333"
          }}
        />
        <div style={{ 
          maxHeight: 200, 
          overflowY: "auto", 
          border: "2px solid #007bff", 
          borderRadius: 8,
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          {profesoresFiltrados.map((p) => (
            <div
              key={p.id}
              style={{ 
                padding: 12, 
                cursor: "pointer", 
                background: profesorId === p.id ? "#e3f2fd" : "#fff",
                borderBottom: "1px solid #eee",
                transition: "background-color 0.2s",
                color: "#333",
                fontWeight: profesorId === p.id ? "bold" : "normal"
              }}
              onClick={() => { setProfesorId(p.id); fetchDisponibilidad(p.id); }}
              onMouseEnter={(e) => {
                if (profesorId !== p.id) e.target.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                if (profesorId !== p.id) e.target.style.backgroundColor = "#fff";
              }}
            >
              {p.name} (ID: {p.id})
            </div>
          ))}
          {profesoresFiltrados.length === 0 && (
            <div style={{ padding: 12, color: '#666', textAlign: "center", fontStyle: "italic" }}>
              No se encontraron profesores
            </div>
          )}
        </div>
      </div>
      {profesorId && (
        <>
          <h4 style={{ marginTop: 24, color: "#333", borderBottom: "2px solid #007bff", paddingBottom: 8 }}>
            Disponibilidad del profesor
          </h4>
          <AgendaCalendario disponibilidad={disponibilidad} onSelectSlot={handleSeleccionar} />
        </>
      )}
      {error && <div style={{ color: "red", marginTop: 12, padding: 8, backgroundColor: "#ffebee", borderRadius: 4 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 12, padding: 8, backgroundColor: "#e8f5e9", borderRadius: 4 }}>{success}</div>}
    </div>
  );
};

export default EstudianteReservaAsesoria; 