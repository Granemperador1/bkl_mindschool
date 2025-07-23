import React, { useEffect, useState } from 'react';
import AsesoriasServicio from './servicios/AsesoriasServicio';
import AgendaCalendario from './AgendaCalendario';
import { useAuth } from "../../context/AuthContext";

const ProfesorDisponibilidad = () => {
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [nuevoBloque, setNuevoBloque] = useState({ dia_semana: '', hora_inicio: '', hora_fin: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario && usuario.id) cargarDisponibilidad();
  }, [usuario]);

  const cargarDisponibilidad = async () => {
    if (!usuario || !usuario.id) {
      setError("No se pudo identificar al usuario. Por favor, vuelve a iniciar sesión.");
      return;
    }
    setLoading(true);
    try {
      const res = await AsesoriasServicio.getDisponibilidadProfesor(usuario.id);
      setDisponibilidad(res.data);
      setError("");
    } catch (e) {
      setError('Error al cargar disponibilidad');
    }
    setLoading(false);
  };

  const handleInput = e => {
    setNuevoBloque({ ...nuevoBloque, [e.target.name]: e.target.value });
  };

  const agregarBloque = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!usuario || !usuario.id) {
      setError("No se pudo identificar al usuario. Por favor, vuelve a iniciar sesión.");
      setLoading(false);
      return;
    }
    try {
      await AsesoriasServicio.definirDisponibilidad({
        profesor_id: usuario.id,
        dia_semana: nuevoBloque.dia_semana,
        hora_inicio: nuevoBloque.hora_inicio,
        hora_fin: nuevoBloque.hora_fin,
      });
      setNuevoBloque({ dia_semana: "", hora_inicio: "", hora_fin: "" });
      cargarDisponibilidad();
    } catch (e) {
      setError("Error al agregar bloque");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar bloque (requiere endpoint en backend)
  const eliminarBloque = async (bloqueId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este bloque de disponibilidad?')) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await AsesoriasServicio.eliminarDisponibilidad(bloqueId);
      await cargarDisponibilidad();
      setSuccess("Bloque eliminado correctamente.");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Error al eliminar bloque");
    } finally {
      setLoading(false);
    }
  };

  // Loader animado
  const Loader = () => (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '24px 0'
    }}>
      <div style={{
        border: '4px solid #2563eb33',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: 38,
        height: 38,
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
    </div>
  );

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: '#0a1736', // Azul oscuro consistente
      padding: '2.5rem 1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 700,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 32, marginBottom: 28, textAlign: 'center', letterSpacing: 1 }}>
          <span style={{ marginRight: 10, fontSize: 36, color: '#3b82f6' }}><i className="fas fa-calendar-alt"></i></span>
          Gestionar Disponibilidad de Asesorías
        </h1>
        <form onSubmit={agregarBloque} style={{
          display: 'flex',
          gap: 22,
          width: '100%',
          justifyContent: 'center',
          marginBottom: 18,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4 }}>Día:</label>
            <div style={{ position: 'relative' }}>
              <select value={nuevoBloque.dia_semana} onChange={e => setNuevoBloque({ ...nuevoBloque, dia_semana: e.target.value })} required style={{ padding: '10px 32px 10px 12px', borderRadius: 8, border: '1.5px solid #3b82f6', background: '#19213a', color: '#fff', fontSize: 16, minWidth: 120 }}>
                <option value="">Selecciona</option>
                {diasSemana.map(dia => <option key={dia} value={dia}>{dia}</option>)}
              </select>
              <span style={{ position: 'absolute', right: 10, top: 10, color: '#3b82f6', fontSize: 18 }}><i className="fas fa-calendar-day"></i></span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4 }}>Hora inicio:</label>
            <div style={{ position: 'relative' }}>
              <input type="time" name="hora_inicio" value={nuevoBloque.hora_inicio} onChange={handleInput} required style={{ padding: '10px 32px 10px 12px', borderRadius: 8, border: '1.5px solid #3b82f6', background: '#19213a', color: '#fff', fontSize: 16, minWidth: 120 }} />
              <span style={{ position: 'absolute', right: 10, top: 10, color: '#3b82f6', fontSize: 18 }}><i className="fas fa-clock"></i></span>
            </div>
            <span style={{ color: '#b0b8c1', fontSize: 13, marginTop: 2 }}>Formato: hh:mm (24h)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4 }}>Hora fin:</label>
            <div style={{ position: 'relative' }}>
              <input type="time" name="hora_fin" value={nuevoBloque.hora_fin} onChange={handleInput} required style={{ padding: '10px 32px 10px 12px', borderRadius: 8, border: '1.5px solid #3b82f6', background: '#19213a', color: '#fff', fontSize: 16, minWidth: 120 }} />
              <span style={{ position: 'absolute', right: 10, top: 10, color: '#3b82f6', fontSize: 18 }}><i className="fas fa-clock"></i></span>
            </div>
            <span style={{ color: '#b0b8c1', fontSize: 13, marginTop: 2 }}>Formato: hh:mm (24h)</span>
          </div>
          <button type="submit" style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 28px',
            fontWeight: 700,
            fontSize: 17,
            marginTop: 22,
            marginLeft: 10,
            boxShadow: '0 2px 8px #2563eb33',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'background 0.18s, box-shadow 0.18s',
            cursor: 'pointer',
          }}>
            <i className="fas fa-plus"></i> Agregar bloque
          </button>
        </form>
        <div style={{ width: '100%', marginTop: 18 }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Agenda</h2>
          {loading ? <p>Cargando...</p> : (
            <AgendaCalendario disponibilidad={disponibilidad} onSelectSlot={() => {}} mostrarSeleccion={false} />
          )}
        </div>
        <div style={{
          width: '100%',
          marginTop: 18,
          background: '#17213a',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          padding: '32px 24px',
          maxWidth: 700,
          marginBottom: 32,
        }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Bloques actuales</h2>
          {success && (
            <div style={{
              background: '#22c55e',
              color: '#fff',
              borderRadius: 8,
              padding: '10px 16px',
              fontWeight: 600,
              fontSize: 15,
              marginBottom: 12,
              textAlign: 'center',
            }}>{success}</div>
          )}
          {error && (
            <div style={{
              background: '#ef4444',
              color: '#fff',
              borderRadius: 8,
              padding: '10px 16px',
              fontWeight: 600,
              fontSize: 15,
              marginBottom: 12,
              textAlign: 'center',
            }}>{error}</div>
          )}
          {loading && <Loader />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {disponibilidad.map((slot, idx) => (
              <div key={slot.id || idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#1e2947',
                borderRadius: 12,
                boxShadow: '0 2px 8px #0002',
                padding: '14px 18px',
                color: '#fff',
                fontSize: 17,
              }}>
                <span style={{ fontWeight: 500 }}>
                  {slot.dia_semana} {slot.hora_inicio} - {slot.hora_fin}
                </span>
                <button
                  onClick={() => eliminarBloque(slot.id)}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 28px',
                    fontWeight: 700,
                    fontSize: 16,
                    boxShadow: '0 2px 8px #2563eb33',
                    cursor: 'pointer',
                    transition: 'background 0.18s, box-shadow 0.18s',
                    outline: 'none',
                  }}
                  onMouseEnter={e => e.target.style.background = '#1d4ed8'}
                  onMouseLeave={e => e.target.style.background = '#2563eb'}
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfesorDisponibilidad; 