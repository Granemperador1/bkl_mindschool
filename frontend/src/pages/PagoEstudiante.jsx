import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, BORDER_RADIUS, SHADOWS } from '../theme/branding/branding';
import { useAuth } from '../context/AuthContext';

const PagoEstudiante = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  React.useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
  }, [usuario, navigate]);

  const [formData, setFormData] = useState({
    // Información personal
    nombreCompleto: usuario?.name || '',
    telefono: '',
    edad: '',
    nivelEducativo: '',
    
    // Información bancaria
    banco: '',
    tipoCuenta: 'corriente',
    numeroCuenta: '',
    titularCuenta: '',
    clabe: '',
    
    // Código de clase
    codigoClase: '',
    
    // Información adicional
    intereses: '',
    objetivos: ''
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Datos del estudiante:', formData);
      
      // Simular envío
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error al enviar datos:', error);
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep1 = () => (
    <div>
      <h3 style={{ color: COLORS.primary, marginBottom: '20px' }}>
        👤 Información Personal
      </h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Nombre Completo *
          </label>
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Teléfono *
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Edad *
          </label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            required
            min="5"
            max="100"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Nivel Educativo *
          </label>
          <select
            name="nivelEducativo"
            value={formData.nivelEducativo}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          >
            <option value="">Selecciona tu nivel educativo</option>
            <option value="primaria">Primaria</option>
            <option value="secundaria">Secundaria</option>
            <option value="preparatoria">Preparatoria/Bachillerato</option>
            <option value="universidad">Universidad</option>
            <option value="posgrado">Posgrado</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Código de Clase (Opcional)
          </label>
          <input
            type="text"
            name="codigoClase"
            value={formData.codigoClase}
            onChange={handleChange}
            placeholder="Ingresa tu código de clase especial si tienes uno"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          />
          <small style={{ color: COLORS.textSecondary, fontSize: '0.8rem', marginTop: '5px', display: 'block' }}>
            Si tienes un código de profesor especial, ingrésalo aquí. Si no tienes uno, puedes dejarlo vacío.
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Áreas de Interés
          </label>
          <textarea
            name="intereses"
            value={formData.intereses}
            onChange={handleChange}
            placeholder="¿Qué te gustaría aprender? (Ej: matemáticas, programación, idiomas...)"
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text,
              resize: 'vertical'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Objetivos de Aprendizaje
          </label>
          <textarea
            name="objetivos"
            value={formData.objetivos}
            onChange={handleChange}
            placeholder="¿Cuáles son tus objetivos académicos o profesionales?"
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text,
              resize: 'vertical'
            }}
          />
        </div>
      </div>
    </div>
  );



  const renderStep3 = () => (
    <div>
      <h3 style={{ color: COLORS.primary, marginBottom: '20px' }}>
        💳 Información Bancaria
      </h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Banco *
          </label>
          <select
            name="banco"
            value={formData.banco}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          >
            <option value="">Selecciona tu banco</option>
            <option value="banamex">Banamex</option>
            <option value="bancomer">Bancomer</option>
            <option value="santander">Santander</option>
            <option value="hsbc">HSBC</option>
            <option value="banorte">Banorte</option>
            <option value="inbursa">Inbursa</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Tipo de Cuenta *
          </label>
          <select
            name="tipoCuenta"
            value={formData.tipoCuenta}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          >
            <option value="corriente">Cuenta Corriente</option>
            <option value="ahorro">Cuenta de Ahorro</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Número de Cuenta *
          </label>
          <input
            type="text"
            name="numeroCuenta"
            value={formData.numeroCuenta}
            onChange={handleChange}
            required
            placeholder="Número de cuenta bancaria"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Titular de la Cuenta *
          </label>
          <input
            type="text"
            name="titularCuenta"
            value={formData.titularCuenta}
            onChange={handleChange}
            required
            placeholder="Nombre completo del titular"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            CLABE (18 dígitos) *
          </label>
          <input
            type="text"
            name="clabe"
            value={formData.clabe}
            onChange={handleChange}
            required
            placeholder="CLABE interbancaria"
            maxLength="18"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: '1rem',
              background: 'white',
              color: COLORS.text
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h3 style={{ color: COLORS.primary, marginBottom: '20px' }}>
        ✅ Confirmación Final
      </h3>
      
      <div style={{
        background: `${COLORS.background}`,
        padding: '20px',
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: '20px'
      }}>
        <h4 style={{ color: COLORS.primary, marginBottom: '15px' }}>
          Resumen de tu información:
        </h4>
        
        <div style={{ display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
          <div><strong>Nombre:</strong> {formData.nombreCompleto}</div>
          <div><strong>Teléfono:</strong> {formData.telefono}</div>
          <div><strong>Edad:</strong> {formData.edad} años</div>
          <div><strong>Nivel Educativo:</strong> {formData.nivelEducativo}</div>
          {formData.codigoClase && (
            <div><strong>Código de Clase:</strong> {formData.codigoClase}</div>
          )}
          <div><strong>Banco:</strong> {formData.banco}</div>
          <div><strong>Tipo de Cuenta:</strong> {formData.tipoCuenta}</div>
        </div>
      </div>

      <div style={{
        background: `${COLORS.primary}10`,
        padding: '15px',
        borderRadius: BORDER_RADIUS.md,
        border: `1px solid ${COLORS.primary}30`
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: COLORS.primary }}>
          <strong>📋 Próximos pasos:</strong>
        </p>
        <ul style={{ margin: '10px 0 0 20px', fontSize: '0.9rem' }}>
          <li>Procesaremos tu información de pago</li>
          <li>Te contactaremos para coordinar tu primera clase</li>
          <li>Recibirás acceso a tu curso personalizado</li>
        </ul>
      </div>
    </div>
  );

  const steps = [
    { title: 'Información Personal', icon: '👤' },
    { title: 'Información Bancaria', icon: '💳' },
    { title: 'Confirmación', icon: '✅' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.gradientBackground,
      padding: '20px',
      fontFamily: FONTS.main
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: BORDER_RADIUS['2xl'],
        boxShadow: SHADOWS['2xl'],
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: COLORS.gradientPrimary,
          color: COLORS.textLight,
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
            👨‍🎓 ¡Registro Exitoso!
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            ¡Bienvenido a Mind School! Ahora completa tu información para comenzar a aprender
          </p>
          {usuario && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '10px 20px',
              borderRadius: '8px',
              marginTop: '15px',
              display: 'inline-block'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                👋 Hola, <strong>{usuario.name}</strong> ({usuario.email})
              </p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px 30px',
          background: COLORS.background,
          borderBottom: `1px solid ${COLORS.border}`
        }}>
          {steps.map((stepInfo, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step <= index + 1 ? COLORS.primary : COLORS.textMuted,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginBottom: '5px'
              }}>
                {stepInfo.icon}
              </div>
              <span style={{
                fontSize: '0.8rem',
                color: step <= index + 1 ? COLORS.primary : COLORS.textMuted,
                textAlign: 'center'
              }}>
                {stepInfo.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={{ padding: '30px' }}>
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep3()}
            {step === 3 && renderStep4()}

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '30px',
              gap: '15px'
            }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    padding: '12px 24px',
                    border: `1px solid ${COLORS.border}`,
                    background: 'white',
                    color: COLORS.text,
                    borderRadius: BORDER_RADIUS.md,
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ← Anterior
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    padding: '12px 24px',
                    background: COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: BORDER_RADIUS.md,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginLeft: 'auto'
                  }}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: loading ? COLORS.textLight : COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: BORDER_RADIUS.md,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    marginLeft: 'auto'
                  }}
                >
                  {loading ? 'Enviando...' : 'Completar Registro'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PagoEstudiante; 