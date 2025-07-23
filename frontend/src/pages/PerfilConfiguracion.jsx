import React from 'react';
import PerfilForm from '../componentes/Perfil/PerfilForm';
import CambiarPasswordForm from '../componentes/Perfil/CambiarPasswordForm';
import DatosBancariosForm from '../componentes/Perfil/DatosBancariosForm';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaKey, FaCog, FaUniversity, FaMoneyCheckAlt } from 'react-icons/fa';
import perfilIlustracion from '../assets/imagenes/perfil_ilustracion.png';
import bancoIlustracion from '../assets/imagenes/banco_ilustracion.png';
import configIlustracion from '../assets/imagenes/config_ilustracion.png';

const PerfilConfiguracion = () => {
  const { usuario } = useAuth();
  const esProfesor = usuario?.roles?.includes('profesor');
  const esEstudiante = usuario?.roles?.includes('estudiante');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-fondo, #f8fafc)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        background: 'var(--color-superficie, #fff)',
        borderRadius: 18,
        boxShadow: '0 2px 16px 0 rgba(30,64,175,0.08)',
        padding: '2.5rem 2rem',
        maxWidth: 600,
        width: '100%',
        marginBottom: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
      }}>
        {/* Sección Perfil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <FaUserCircle size={38} color="#2563EB" />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, color: '#2563EB', fontWeight: 800 }}>Mi Perfil</h2>
            <div style={{ color: '#64748B', fontSize: 15 }}>Actualiza tus datos personales</div>
          </div>
          <img src={perfilIlustracion} alt="Perfil" style={{ height: 54, marginLeft: 'auto' }} />
        </div>
        <PerfilForm />

        {/* Sección Cambiar Contraseña */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <FaKey size={32} color="#F59E42" />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: '#F59E42', fontWeight: 700 }}>Cambiar Contraseña</h2>
            <div style={{ color: '#64748B', fontSize: 15 }}>Mantén tu cuenta segura</div>
          </div>
        </div>
        <CambiarPasswordForm />

        {/* Sección Configuración */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <FaCog size={32} color="#10B981" />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: '#10B981', fontWeight: 700 }}>Configuración</h2>
            <div style={{ color: '#64748B', fontSize: 15 }}>Preferencias y notificaciones</div>
          </div>
          <img src={configIlustracion} alt="Configuración" style={{ height: 44, marginLeft: 'auto' }} />
        </div>
        {/* Aquí puedes agregar más campos de configuración si lo deseas */}
        <div style={{ color: '#64748B', fontSize: 15, marginBottom: 12 }}>
          (Próximamente: preferencias de idioma, notificaciones, etc.)
        </div>

        {/* Sección image.pngDatos Bancarios */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <FaUniversity size={32} color="#6366F1" />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: '#6366F1', fontWeight: 700 }}>
              {esProfesor ? 'Cuenta para recibir pagos' : 'Cuenta para realizar pagos'}
            </h2>
            <div style={{ color: '#64748B', fontSize: 15 }}>
              {esProfesor
                ? 'Registra tu cuenta bancaria para recibir tus pagos de MindSchool.'
                : 'Registra tu cuenta o método de pago preferido.'}
            </div>
          </div>
          <img src={bancoIlustracion} alt="Banco" style={{ height: 44, marginLeft: 'auto' }} />
        </div>
        <DatosBancariosForm />
      </div>
    </div>
  );
};

export default PerfilConfiguracion; 