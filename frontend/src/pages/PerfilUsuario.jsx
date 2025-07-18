import React from 'react';
import PerfilForm from '../componentes/Perfil/PerfilForm';
import CambiarPasswordForm from '../componentes/Perfil/CambiarPasswordForm';

const PerfilUsuario = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-fondo, #f8fafc)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        background: 'var(--color-superficie, #fff)',
        borderRadius: 16,
        boxShadow: '0 2px 16px 0 rgba(30,64,175,0.08)',
        padding: '2rem',
        maxWidth: 500,
        width: '100%',
        marginBottom: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <PerfilForm />
      </div>
      <div style={{
        background: 'var(--color-superficie, #fff)',
        borderRadius: 16,
        boxShadow: '0 2px 16px 0 rgba(30,64,175,0.08)',
        padding: '2rem',
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <CambiarPasswordForm />
      </div>
    </div>
  );
};

export default PerfilUsuario; 