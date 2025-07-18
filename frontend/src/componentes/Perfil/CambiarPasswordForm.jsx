import React, { useState } from 'react';
import { usePerfil } from '../../hooks/usePerfil';

const CambiarPasswordForm = () => {
  const { cambiarContrasena, loading, error } = usePerfil();
  const [form, setForm] = useState({
    password_actual: '',
    password: '',
    password_confirmation: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (form.password !== form.password_confirmation) {
      setMensaje('La nueva contraseña y la confirmación no coinciden');
      return;
    }
    try {
      await cambiarContrasena(form);
      setMensaje('Contraseña actualizada correctamente');
      setForm({ password_actual: '', password: '', password_confirmation: '' });
    } catch {
      setMensaje('Error al cambiar la contraseña');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', marginTop: 32 }}>
      <h2>Cambiar Contraseña</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: mensaje.includes('correctamente') ? 'green' : 'red' }}>{mensaje}</p>}
      <div>
        <label>Contraseña actual:</label>
        <input
          type="password"
          name="password_actual"
          value={form.password_actual}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nueva contraseña:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
        />
      </div>
      <div>
        <label>Confirmar nueva contraseña:</label>
        <input
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          required
          minLength={8}
        />
      </div>
      <button type="submit" disabled={loading}>Cambiar contraseña</button>
    </form>
  );
};

export default CambiarPasswordForm; 