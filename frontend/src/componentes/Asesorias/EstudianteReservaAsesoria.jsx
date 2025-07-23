import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import AgendaCalendario from "./AgendaCalendario";

const EstudianteReservaAsesoria = () => {
  const [profesores, setProfesores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          <AgendaCalendario disponibilidad={disponibilidad} onSeleccionar={() => {}} />
        </>
      )}
      {error && <div style={{ color: "red", marginTop: 12, padding: 8, backgroundColor: "#ffebee", borderRadius: 4 }}>{error}</div>}
    </div>
  );
};

export default EstudianteReservaAsesoria; 