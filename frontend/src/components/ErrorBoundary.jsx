import React from 'react';
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from '../theme/branding/branding';
import Mascota from '../theme/branding/Mascota';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para que el siguiente render muestre la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aquí podrías enviar el error a un servicio de logging como Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: COLORS.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: SPACING[6],
            fontFamily: FONTS.main,
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              textAlign: 'center',
              background: COLORS.surface,
              padding: SPACING[8],
              borderRadius: BORDER_RADIUS.xl,
              boxShadow: SHADOWS.lg,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {/* Mascota triste */}
            <div style={{ marginBottom: SPACING[6] }}>
              <Mascota width={120} height={120} />
            </div>

            {/* Título */}
            <h1
              style={{
                fontSize: FONT_SIZES['2xl'],
                fontWeight: FONT_WEIGHTS.bold,
                color: COLORS.error,
                marginBottom: SPACING[4],
              }}
            >
              ¡Ups! Algo salió mal
            </h1>

            {/* Mensaje */}
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.textSecondary,
                marginBottom: SPACING[6],
                lineHeight: 1.6,
              }}
            >
              Lo sentimos, ha ocurrido un error inesperado. 
              Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
            </p>

            {/* Botones de acción */}
            <div
              style={{
                display: 'flex',
                gap: SPACING[4],
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: SPACING[6],
              }}
            >
              <button
                onClick={this.handleReload}
                style={{
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  background: COLORS.primary,
                  color: COLORS.surface,
                  border: 'none',
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.medium,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: SHADOWS.sm,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = COLORS.primaryDark;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = COLORS.primary;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🔄 Recargar página
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  padding: `${SPACING[3]} ${SPACING[6]}`,
                  background: COLORS.surface,
                  color: COLORS.primary,
                  border: `2px solid ${COLORS.primary}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.medium,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = COLORS.primary;
                  e.target.style.color = COLORS.surface;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = COLORS.surface;
                  e.target.style.color = COLORS.primary;
                }}
              >
                🏠 Ir al inicio
              </button>
            </div>

            {/* Detalles del error (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: SPACING[6] }}>
                <button
                  onClick={this.toggleDetails}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.textSecondary,
                    fontSize: FONT_SIZES.sm,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginBottom: SPACING[4],
                  }}
                >
                  {this.state.showDetails ? 'Ocultar detalles' : 'Mostrar detalles del error'}
                </button>

                {this.state.showDetails && (
                  <div
                    style={{
                      background: COLORS.background,
                      padding: SPACING[4],
                      borderRadius: BORDER_RADIUS.md,
                      textAlign: 'left',
                      fontSize: FONT_SIZES.sm,
                      fontFamily: 'monospace',
                      overflow: 'auto',
                      maxHeight: '300px',
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div style={{ marginBottom: SPACING[3] }}>
                      <strong>Error:</strong> {this.state.error?.toString()}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Información de contacto */}
            <div
              style={{
                marginTop: SPACING[6],
                padding: SPACING[4],
                background: `${COLORS.primary}10`,
                borderRadius: BORDER_RADIUS.md,
                border: `1px solid ${COLORS.primary}30`,
              }}
            >
              <p
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.textSecondary,
                  margin: 0,
                }}
              >
                Si el problema persiste, contacta a nuestro soporte técnico en{' '}
                <a
                  href="mailto:soporte@mindschool.com"
                  style={{
                    color: COLORS.primary,
                    textDecoration: 'none',
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  soporte@mindschool.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Si no hay error, renderizar los children normalmente
    return this.props.children;
  }
}

export default ErrorBoundary; 