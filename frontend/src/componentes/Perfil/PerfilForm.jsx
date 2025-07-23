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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label htmlFor="nombre" style={{ fontWeight: 600, marginBottom: 2 }}>Nombre:</label>
        <input id="nombre" name="nombre" type="text" value={form.name} onChange={handleChange} autoComplete="off" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label htmlFor="correo" style={{ fontWeight: 600, marginBottom: 2 }}>Correo:</label>
        <input id="correo" name="correo" type="email" value={form.email} onChange={handleChange} autoComplete="off" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label htmlFor="avatar" style={{ fontWeight: 600, marginBottom: 2 }}>Avatar (URL):</label>
        <input id="avatar" name="avatar" type="text" value={form.avatar_url} onChange={handleChange} autoComplete="off" />
      </div>
      <button type="submit" style={{ marginTop: 18 }}>Guardar cambios</button>
    </form>
  );
};

export default PerfilForm; 