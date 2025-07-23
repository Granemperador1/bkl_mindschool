import React, { useEffect, useState } from 'react';
import AsesoriasServicio from './servicios/AsesoriasServicio';
import AsesoriaCard from './AsesoriaCard';
import { useAuth } from '../../context/AuthContext';

const ListaAsesorias = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    cargarAsesorias();
  }, []);

  const cargarAsesorias = async () => {
    setLoading(true);
    try {
      const res = await AsesoriasServicio.listarAsesorias();
      setAsesorias(res.data);
    } catch (e) {
      alert('Error al cargar asesorías');
    }
    setLoading(false);
  };

  const unirseVideollamada = (enlace) => {
    window.open(enlace, '_blank');
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <h2 style={{ 
        textAlign: "center", 
        color: "#333", 
        marginBottom: 32,
        fontSize: "2rem",
        fontWeight: "bold",
        borderBottom: "3px solid #007bff",
        paddingBottom: 12
      }}>
        Mis Asesorías
      </h2>
      
      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: 40,
          color: "#666"
        }}>
          <div style={{ fontSize: "1.2rem", marginBottom: 16 }}>Cargando asesorías...</div>
          <div style={{ fontSize: "3rem" }}>⏳</div>
        </div>
      ) : (
        asesorias.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {asesorias.map((asesoria, idx) => (
              <AsesoriaCard key={asesoria.id || idx} asesoria={asesoria} onJoin={unirseVideollamada} />
            ))}
          </div>
        ) : (
          usuario?.roles?.includes('profesor') ? (
            <div style={{ 
              textAlign: "center",
              padding: 60,
              background: "#23272f",
              borderRadius: 16,
              border: "2.5px solid #007bff",
              margin: "40px auto",
              maxWidth: 500,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: 16, color: "#007bff" }}>📅</div>
              <h3 style={{ color: "#fff", marginBottom: 12, fontSize: "1.5rem", fontWeight: 700 }}>
                No tienes asesorías agendadas
              </h3>
              <p style={{ color: "#b0b8c1", fontSize: "1.1rem", lineHeight: 1.5, maxWidth: 400, margin: "0 auto" }}>
                Cuando un estudiante reserve una asesoría contigo, aparecerá aquí para que puedas gestionarla.
              </p>
            </div>
          ) : (
            <div style={{ 
              textAlign: "center",
              padding: 60,
              background: "#23272f",
              borderRadius: 16,
              border: "2.5px solid #007bff",
              margin: "40px auto",
              maxWidth: 500,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: 16, color: "#007bff" }}>📅</div>
              <h3 style={{ color: "#fff", marginBottom: 12, fontSize: "1.5rem", fontWeight: 700 }}>
                No tienes asesorías agendadas
              </h3>
              <p style={{ color: "#b0b8c1", fontSize: "1.1rem", lineHeight: 1.5, maxWidth: 400, margin: "0 auto" }}>
                Cuando reserves una asesoría con un profesor, aparecerá aquí para que puedas gestionarla.
              </p>
              <div style={{ marginTop: 24 }}>
                <button style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
                onClick={() => window.location.href = "/estudiante/solicitar-asesoria"}
                >
                  Solicitar Asesoría
                </button>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default ListaAsesorias; 