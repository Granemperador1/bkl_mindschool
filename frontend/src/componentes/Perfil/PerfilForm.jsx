import React, { useEffect, useState } from 'react';
import { usePerfil } from '../../hooks/usePerfil';

const PerfilForm = () => {
  const { perfil, loading, error, fetchPerfil, editarPerfil } = usePerfil();
  const [form, setForm] = useState({ name: '', email: '', avatar_url: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchPerfil();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (perfil) {
      setForm({
        name: perfil.name || '',
        email: perfil.email || '',
        avatar_url: perfil.avatar_url || ''
      });
    }
  }, [perfil]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      await editarPerfil(form);
      setMensaje('Perfil actualizado correctamente');
    } catch {
      setMensaje('Error al actualizar el perfil');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Editar Perfil</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: mensaje.includes('correctamente') ? 'green' : 'red' }}>{mensaje}</p>}
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Correo:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Avatar (URL):</label>
        <input
          type="url"
          name="avatar_url"
          value={form.avatar_url}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>Guardar cambios</button>
    </form>
  );
};

export default PerfilForm; 