import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, BORDER_RADIUS, SHADOWS } from '../theme/branding/branding';
import { useAuth } from '../context/AuthContext';

const SeleccionTipoUsuario = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const handleSeleccion = async (tipo) => {
    setLoading(true);
    setTipoSeleccionado(tipo);
    
    try {
      // Aquí podrías hacer una llamada al backend para actualizar el tipo de usuario
      // Por ahora, navegamos directamente a la página correspondiente
      setTimeout(() => {
        if (tipo === 'profesor') {
          navigate('/pago-profesor');
        } else {
          navigate('/pago-estudiante');
        }
      }, 1000);
    } catch (error) {
      console.error('Error al seleccionar tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.gradientBackground,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: FONTS.main
    }}>
      <div style={{
        background: 'white',
        borderRadius: BORDER_RADIUS['2xl'],
        padding: '40px',
        boxShadow: SHADOWS['2xl'],
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
                      <h1 style={{
              color: COLORS.text,
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
            ¡Bienvenido a MindSchool!
          </h1>
          <p style={{
            color: COLORS.text,
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Hola <strong>{usuario?.name}</strong>, nos alegra que te hayas unido a nuestra comunidad.
            <br />
            Para continuar, necesitamos saber cómo te gustaría participar:
          </p>
        </div>

        {/* Opciones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Opción Estudiante */}
                      <div
              onClick={() => handleSeleccion('estudiante')}
              style={{
                border: `3px solid ${tipoSeleccionado === 'estudiante' ? COLORS.primary : COLORS.border}`,
                borderRadius: BORDER_RADIUS.xl,
                padding: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: tipoSeleccionado === 'estudiante' ? `${COLORS.primary}05` : COLORS.surface,
                transform: tipoSeleccionado === 'estudiante' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: tipoSeleccionado === 'estudiante' ? SHADOWS.lg : SHADOWS.sm
              }}
            >
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px',
              color: COLORS.primary
            }}>
              👨‍🎓
            </div>
            <h3 style={{
              color: COLORS.primary,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Soy Estudiante
            </h3>
            <p style={{
              color: COLORS.text,
              lineHeight: '1.5'
            }}>
              Quiero aprender y acceder a cursos, tareas y recursos educativos.
            </p>
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: `${COLORS.primary}20`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '0.9rem',
              color: COLORS.primary
            }}>
              <strong>Incluye:</strong> Acceso a cursos, tareas, calificaciones y recursos
            </div>
          </div>

          {/* Opción Profesor */}
                      <div
              onClick={() => handleSeleccion('profesor')}
              style={{
                border: `3px solid ${tipoSeleccionado === 'profesor' ? COLORS.secondary : COLORS.border}`,
                borderRadius: BORDER_RADIUS.xl,
                padding: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: tipoSeleccionado === 'profesor' ? `${COLORS.secondary}05` : COLORS.surface,
                transform: tipoSeleccionado === 'profesor' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: tipoSeleccionado === 'profesor' ? SHADOWS.lg : SHADOWS.sm
              }}
            >
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px',
              color: COLORS.secondary
            }}>
              👨‍🏫
            </div>
            <h3 style={{
              color: COLORS.secondary,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Soy Profesor
            </h3>
            <p style={{
              color: COLORS.text,
              lineHeight: '1.5'
            }}>
              Quiero crear cursos, gestionar estudiantes y compartir conocimiento.
            </p>
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: `${COLORS.secondary}20`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '0.9rem',
              color: COLORS.secondary
            }}>
              <strong>Incluye:</strong> Crear cursos, gestionar estudiantes, recibir pagos
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: COLORS.primary,
            fontSize: '1.1rem'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: `2px solid ${COLORS.primary}`,
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Procesando tu selección...
          </div>
        )}

        {/* Información adicional */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: `${COLORS.background}`,
          borderRadius: BORDER_RADIUS.lg,
          fontSize: '0.9rem',
          color: COLORS.text
        }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>💡 ¿No estás seguro?</strong>
          </p>
          <p style={{ margin: 0 }}>
            Puedes cambiar tu tipo de cuenta más tarde desde tu perfil. 
            Esta selección nos ayuda a personalizar tu experiencia en MindSchool.
          </p>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @media (max-width: 768px) {
              .seleccion-container {
                padding: 20px !important;
              }
              .seleccion-container h1 {
                font-size: 2rem !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SeleccionTipoUsuario; 