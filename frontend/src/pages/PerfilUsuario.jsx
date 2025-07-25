import React, { useState } from 'react';
import PerfilForm from '../componentes/Perfil/PerfilForm';
import CambiarPasswordForm from '../componentes/Perfil/CambiarPasswordForm';
import api from '../utils/axiosConfig';
import { COLORS } from "../theme/branding/branding";

const PerfilUsuario = () => {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/perfil", form);
      setSuccess("Perfil actualizado exitosamente");
    } catch (err) {
      setError("Error al actualizar el perfil");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#181e29',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1rem 2rem 1rem',
      gap: 48,
    }}>
      <div style={{
        background: '#23272f',
        borderRadius: 22,
        boxShadow: '0 6px 32px 0 rgba(0,123,255,0.13)',
        padding: '2.8rem 2.2rem 2.2rem 2.2rem',
        maxWidth: 520,
        width: '100%',
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        color: '#fff',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <span style={{ fontSize: 38, color: '#007bff' }}>
            <i className="fas fa-user-circle"></i>
          </span>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 28, margin: 0 }}>Editar Perfil</h2>
        </div>
        <PerfilForm />
      </div>
      <div style={{
        background: '#23272f',
        borderRadius: 22,
        boxShadow: '0 6px 32px 0 rgba(0,123,255,0.13)',
        padding: '2.8rem 2.2rem 2.2rem 2.2rem',
        maxWidth: 520,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        color: '#fff',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <span style={{ fontSize: 34, color: '#007bff' }}>
            <i className="fas fa-key"></i>
          </span>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 26, margin: 0 }}>Cambiar Contraseña</h2>
        </div>
        <CambiarPasswordForm />
      </div>
      <style>{`
        input, textarea {
          background: #1a2233 !important;
          color: #fff !important;
          border: 1.5px solid #007bff !important;
          border-radius: 8px !important;
          font-size: 1rem !important;
          padding: 10px 14px !important;
          margin-bottom: 12px !important;
        }
        input:focus, textarea:focus {
          outline: 2px solid #007bff !important;
          background: #23272f !important;
        }
        label, .perfil-label {
          color: #b0b8c1 !important;
          font-weight: 600 !important;
          margin-bottom: 6px !important;
        }
        button {
          background: #007bff !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 12px 0 !important;
          font-weight: 700 !important;
          font-size: 1.08rem !important;
          margin-top: 8px !important;
          transition: background 0.2s;
        }
        button:hover {
          background: #0056b3 !important;
        }
        h2, h3, h4, h5, h6 {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default PerfilUsuario; 