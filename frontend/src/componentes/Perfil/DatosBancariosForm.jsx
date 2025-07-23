import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DatosBancariosForm = () => {
  const [form, setForm] = useState({ banco: '', clabe: '', titular: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Obtener datos bancarios actuales
    const fetchDatos = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/datos-bancarios');
        if (res.data.data) {
          setForm({
            banco: res.data.data.banco || '',
            clabe: res.data.data.clabe || '',
            titular: res.data.data.titular || '',
          });
        }
      } catch (err) {
        // No mostrar error si no tiene datos aún
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);
    try {
      await axios.post('/api/datos-bancarios', form);
      setMensaje('¡Datos bancarios guardados correctamente!');
    } catch (err) {
      setMensaje('Error al guardar los datos bancarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h2 style={{ marginBottom: 18 }}>Datos Bancarios</h2>
      {loading && <p>Cargando...</p>}
      {mensaje && (
        <p style={{ color: mensaje.includes('guardados') ? 'green' : 'red' }}>{mensaje}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <label style={{ marginBottom: 4 }}>Banco:</label>
        <input
          type="text"
          name="banco"
          value={form.banco}
          onChange={handleChange}
          required
          maxLength={100}
          style={{ padding: '10px', borderRadius: 8, border: '1px solid #334155', background: '#1E293B', color: '#F8FAFC', fontSize: 16 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <label style={{ marginBottom: 4 }}>CLABE:</label>
        <input
          type="text"
          name="clabe"
          value={form.clabe}
          onChange={handleChange}
          required
          maxLength={30}
          style={{ padding: '10px', borderRadius: 8, border: '1px solid #334155', background: '#1E293B', color: '#F8FAFC', fontSize: 16 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        <label style={{ marginBottom: 4 }}>Titular:</label>
        <input
          type="text"
          name="titular"
          value={form.titular}
          onChange={handleChange}
          required
          maxLength={100}
          style={{ padding: '10px', borderRadius: 8, border: '1px solid #334155', background: '#1E293B', color: '#F8FAFC', fontSize: 16 }}
        />
      </div>
      <button type="submit" disabled={loading} style={{
        background: '#2563EB',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '12px 0',
        fontSize: 16,
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: 8,
      }}>Guardar datos bancarios</button>
    </form>
  );
};

export default DatosBancariosForm; 