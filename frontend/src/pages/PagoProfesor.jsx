import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, BORDER_RADIUS, SHADOWS } from '../theme/branding/branding';
import { useAuth } from '../context/AuthContext';

const PagoProfesor = () => {
  const [formData, setFormData] = useState({
    // Información personal
    nombreCompleto: '',
    telefono: '',
    especialidad: '',
    
    // Comprobantes docentes
    tituloAcademico: '',
    institucion: '',
    fechaGraduacion: '',
    certificadoDocente: null,
    cv: null,
    
    // Información bancaria
    banco: '',
    tipoCuenta: 'corriente',
    numeroCuenta: '',
    titularCuenta: '',
    clabe: '',
    
    // Información adicional
    experiencia: '',
    cursosImpartidos: '',
    disponibilidad: 'tiempo_completo'
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Datos del profesor:', formData);
      
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
        📋 Información Personal
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
            Especialidad *
          </label>
          <input
            type="text"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            required
            placeholder="Ej: Matemáticas, Física, Programación..."
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
            Años de Experiencia
          </label>
          <textarea
            name="experiencia"
            value={formData.experiencia}
            onChange={handleChange}
            placeholder="Describe tu experiencia docente..."
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

  const renderStep2 = () => (
    <div>
      <h3 style={{ color: COLORS.primary, marginBottom: '20px' }}>
        🎓 Comprobantes Docentes
      </h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            Título Académico *
          </label>
          <input
            type="text"
            name="tituloAcademico"
            value={formData.tituloAcademico}
            onChange={handleChange}
            required
            placeholder="Ej: Licenciatura en Matemáticas"
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
            Institución *
          </label>
          <input
            type="text"
            name="institucion"
            value={formData.institucion}
            onChange={handleChange}
            required
            placeholder="Universidad o institución donde obtuviste tu título"
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
            Fecha de Graduación *
          </label>
          <input
            type="date"
            name="fechaGraduacion"
            value={formData.fechaGraduacion}
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
            Certificado de Título (PDF) *
          </label>
          <input
            type="file"
            name="certificadoDocente"
            onChange={handleChange}
            accept=".pdf"
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
          <small style={{ color: COLORS.textLight }}>
            Sube tu certificado de título en formato PDF (máx. 5MB)
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: COLORS.text }}>
            CV/Currículum Vitae (PDF)
          </label>
          <input
            type="file"
            name="cv"
            onChange={handleChange}
            accept=".pdf"
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
          <small style={{ color: COLORS.textLight }}>
            Opcional: Sube tu CV en formato PDF (máx. 5MB)
          </small>
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
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
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
            Clave de Seguridad (3 dígitos) *
          </label>
          <input
            type="text"
            name="clabe"
            value={formData.clabe}
            onChange={handleChange}
            required
            placeholder="Clave de 3 dígitos"
            maxLength="3"
            pattern="[0-9]{3}"
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
          <div><strong>Especialidad:</strong> {formData.especialidad}</div>
          <div><strong>Título:</strong> {formData.tituloAcademico}</div>
          <div><strong>Institución:</strong> {formData.institucion}</div>
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
          <li>Revisaremos tu documentación (1-2 días hábiles)</li>
          <li>Te notificaremos por email cuando tu cuenta sea aprobada</li>
          <li>Podrás comenzar a crear cursos y recibir estudiantes</li>
        </ul>
      </div>
    </div>
  );

  const steps = [
    { title: 'Información Personal', icon: '👤' },
    { title: 'Comprobantes Docentes', icon: '🎓' },
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
            🎓 Registro de Profesor
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            Completa tu información para comenzar a enseñar en MindSchool
          </p>
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
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

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

              {step < 4 ? (
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

export default PagoProfesor; 