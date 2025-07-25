import React, { useEffect, useState } from 'react';
import { usePerfil } from '../../hooks/usePerfil';

const PerfilForm = () => {
  const { perfil, loading, error, fetchPerfil, editarPerfil } = usePerfil();
  const [form, setForm] = useState({ name: '', email: '', avatar_url: '' });
  const [mensaje, setMensaje] = useState('');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', avatar_url: '' });

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

  const validateField = (name, value) => {
    if (name === 'name') {
      if (!value.trim()) return 'El nombre es obligatorio.';
    }
    if (name === 'email') {
      if (!value.trim()) return 'El correo es obligatorio.';
      if (!/^\S+@\S+\.\S+$/.test(value)) return 'El correo no es válido.';
    }
    if (name === 'avatar_url') {
      if (value && !/^https?:\/\/.+\..+/.test(value)) return 'El avatar debe ser una URL válida.';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
  };

  const validate = () => {
    const errors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      avatar_url: validateField('avatar_url', form.avatar_url),
    };
    setFieldErrors(errors);
    return errors.name || errors.email || errors.avatar_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setFormError('');
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
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
        <label htmlFor="name" style={{ fontWeight: 600, marginBottom: 2 }}>Nombre:</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} autoComplete="off" />
        {fieldErrors.name && <span style={{ color: '#ef4444', fontSize: 13 }}>{fieldErrors.name}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label htmlFor="email" style={{ fontWeight: 600, marginBottom: 2 }}>Correo:</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" />
        {fieldErrors.email && <span style={{ color: '#ef4444', fontSize: 13 }}>{fieldErrors.email}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label htmlFor="avatar_url" style={{ fontWeight: 600, marginBottom: 2 }}>Avatar (URL):</label>
        <input id="avatar_url" name="avatar_url" type="text" value={form.avatar_url} onChange={handleChange} autoComplete="off" />
        {fieldErrors.avatar_url && <span style={{ color: '#ef4444', fontSize: 13 }}>{fieldErrors.avatar_url}</span>}
      </div>
      <button type="submit" style={{ marginTop: 18 }} disabled={!!(fieldErrors.name || fieldErrors.email || fieldErrors.avatar_url)}>Guardar cambios</button>
      {formError && (
        <div style={{ marginTop: 10, color: '#ef4444', fontWeight: 600, textAlign: 'center' }}>{formError}</div>
      )}
      {mensaje && (
        <div style={{ marginTop: 10, color: mensaje.includes('Error') ? '#ef4444' : '#22c55e', fontWeight: 600, textAlign: 'center' }}>{mensaje}</div>
      )}
      {error && (
        <div style={{ marginTop: 10, color: '#ef4444', fontWeight: 600, textAlign: 'center' }}>{error}</div>
      )}
    </form>
  );
};

export default PerfilForm; 