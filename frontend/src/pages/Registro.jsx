import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SCHOOL_NAME,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  TRANSITIONS,
} from "../theme/branding/branding";
import videoSorpresa from "../assets/videos/sorpresa.mp4";
import { GoogleLogin } from '@react-oauth/google';
import EstudianteDashboard from './EstudianteDashboard';
import SeleccionTipoUsuario from './SeleccionTipoUsuario';

const EyeIcon = ({ visible, onClick }) => (
  <span
    onClick={onClick}
    style={{
      position: "absolute",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: COLORS.textMuted,
      fontSize: 20,
      userSelect: "none",
      transition: TRANSITIONS.base,
    }}
    title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    {visible ? (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ) : (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M17.94 17.94A9.97 9.97 0 0 1 12 19c-5.4 0-9-7-9-7a17.6 17.6 0 0 1 4.06-5.06M21 21 3 3m7.5 7.5A3 3 0 0 0 12 15a3 3 0 0 0 2.5-4.5"
        />
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M9.88 9.88A3 3 0 0 1 15 12c0 .83-.34 1.58-.88 2.12"
        />
      </svg>
    )}
  </span>
);

const animatedBg = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 0,
  background:
    "linear-gradient(270deg, #2563EB, #F97316, #3B82F6, #FB923C, #2563EB)",
  backgroundSize: "1200% 1200%",
  animation: "gradientBG 18s ease-in-out infinite",
};

const keyframes = `
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
}
`;

const Registro = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    // role: "estudiante", // Eliminado del estado editable
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSorpresa, setShowSorpresa] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [googleSuccess, setGoogleSuccess] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  // Validación avanzada de contraseña
  const passwordRegex = /^.{8,}$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setLoading(true);
    setError("");
    setShowSorpresa(true);

    if (!passwordRegex.test(formData.password)) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      setShowSorpresa(false);
      setEnviando(false);
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      setShowSorpresa(false);
      setEnviando(false);
      return;
    }
    // Forzar el rol a 'estudiante' antes de enviar
    const dataToSend = { ...formData, role: 'estudiante' };

    try {
      const success = await register(dataToSend);
      if (success) {
        setTimeout(() => {
          setShowSorpresa(false);
          // Redirigir a la página de pago después del registro exitoso
          navigate('/pago-estudiante');
        }, 2000);
        return;
      }
    } catch (err) {
      console.error("Error real del backend:", err?.response?.data || err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        // Personalizar mensaje para 'validation.unique'
        const customMessages = errorMessages.map(msg =>
          msg.includes('validation.unique') || msg.toLowerCase().includes('unique')
            ? 'El correo electrónico ya está registrado. Por favor, usa otro.'
            : msg
        );
        setError(customMessages.join(", "));
      } else {
        setError("Error al registrar. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
      setShowSorpresa(false);
      setEnviando(false);
    }
  };

  return (
    <>
      <style>{keyframes}
      {`
        @media (max-width: 600px) {
          .registro-form-container {
            padding: 12px 2vw !important;
            max-width: 99vw !important;
          }
          .registro-form-card {
            padding: 18px 4vw !important;
            max-width: 99vw !important;
          }
          .registro-form-card input, .registro-form-card button {
            font-size: 1rem !important;
            padding: 10px 8px !important;
          }
        }
      `}</style>
      <div style={animatedBg} />
      {showSorpresa && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0008",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            src={videoSorpresa}
            width="400"
            height="auto"
            autoPlay
            muted
            style={{
              borderRadius: BORDER_RADIUS["2xl"],
              boxShadow: SHADOWS["2xl"],
            }}
          />
        </div>
      )}
      {/* MODAL DE WIZARD DE REGISTRO Y PAGO */}
      {showPaywall && <SeleccionTipoUsuario />}
      <div
        className="registro-form-container"
        style={{
          minHeight: "100vh",
          width: "100vw",
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: SPACING[5],
          fontFamily: FONTS.main,
        }}
      >
        <div
          className="registro-form-card"
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS["2xl"],
            boxShadow: SHADOWS["2xl"],
            padding: `${SPACING[10]} ${SPACING[8]}`,
            width: "100%",
            maxWidth: "480px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            border: `1px solid ${COLORS.border}`,
            backdropFilter: "blur(10px)",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          {/* Video de sorpresa */}
          <div
            style={{
              marginBottom: SPACING[5],
              width: "100%",
              maxWidth: "280px",
            }}
          >
            <video
              src={videoSorpresa}
              width="100%"
              height="auto"
              autoPlay
              muted
              loop
              style={{
                borderRadius: BORDER_RADIUS.xl,
                boxShadow: SHADOWS.lg,
                margin: "0 auto",
                display: "block",
                border: `1px solid ${COLORS.border}`,
              }}
            />
          </div>

          {/* Título de la escuela */}
          <h1
            style={{
              color: COLORS.primary,
              fontWeight: FONT_WEIGHTS.extrabold,
              fontSize: FONT_SIZES["4xl"],
              margin: `0 0 ${SPACING[3]} 0`,
              fontFamily: FONTS.heading,
              letterSpacing: "1px",
              textShadow: `0 2px 8px ${COLORS.primary}22`,
              lineHeight: 1.2,
            }}
          >
            {SCHOOL_NAME}
          </h1>

          {/* Mensaje de bienvenida */}
          <h2
            style={{
              color: COLORS.text,
              fontSize: FONT_SIZES.xl,
              fontWeight: FONT_WEIGHTS.semibold,
              marginBottom: SPACING[2],
              fontFamily: FONTS.heading,
            }}
          >
            ¡Crea tu cuenta y únete a la aventura!
          </h2>

          <p
            style={{
              color: COLORS.textSecondary,
              marginBottom: SPACING[8],
              fontSize: FONT_SIZES.base,
              fontWeight: FONT_WEIGHTS.medium,
              lineHeight: 1.6,
            }}
          >
            Regístrate para comenzar tu viaje de aprendizaje
          </p>

          {error && (
  <div
    role="alert"
    aria-live="assertive"
    style={{
      background: `${COLORS.error}15`,
      border: `1.5px solid ${COLORS.error}`,
      color: COLORS.error,
      padding: SPACING[3],
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING[5],
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      width: "100%",
      outline: '2px solid #fff',
      boxShadow: '0 0 0 2px #fff',
    }}
    tabIndex={-1}
  >
    {error}
  </div>
)}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: SPACING[5] }}>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                aria-label="Nombre completo"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: `${SPACING[3]} ${SPACING[4]}`,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontFamily: FONTS.main,
                  background: COLORS.surfaceLight,
                  color: COLORS.text,
                  outline: "none",
                  transition: TRANSITIONS.base,
                  boxSizing: "border-box",
                  fontWeight: FONT_WEIGHTS.medium,
                  letterSpacing: 0.2,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.border;
                  e.target.style.boxShadow = "none";
                }}
                aria-required="true"
                aria-describedby="name-ayuda"
              />
              <small id="name-ayuda" style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.xs, marginLeft: 2, display: "block", marginBottom: SPACING[2] }}>
                Escribe tu nombre completo.
              </small>
            </div>
            <div style={{ marginBottom: SPACING[5] }}>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                aria-label="Correo electrónico"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: `${SPACING[3]} ${SPACING[4]}`,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontFamily: FONTS.main,
                  background: COLORS.surfaceLight,
                  color: COLORS.text,
                  outline: "none",
                  transition: TRANSITIONS.base,
                  boxSizing: "border-box",
                  fontWeight: FONT_WEIGHTS.medium,
                  letterSpacing: 0.2,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.border;
                  e.target.style.boxShadow = "none";
                }}
                aria-required="true"
                aria-describedby="email-ayuda"
              />
              <small id="email-ayuda" style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.xs, marginLeft: 2, display: "block", marginBottom: SPACING[2] }}>
                Introduce tu correo electrónico válido.
              </small>
            </div>

            <div style={{ marginBottom: SPACING[5], position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                aria-label="Contraseña"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: `${SPACING[3]} ${SPACING[4]}`,
                  paddingRight: "48px",
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontFamily: FONTS.main,
                  background: COLORS.surfaceLight,
                  color: COLORS.text,
                  outline: "none",
                  transition: TRANSITIONS.base,
                  boxSizing: "border-box",
                  fontWeight: FONT_WEIGHTS.medium,
                  letterSpacing: 0.2,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.border;
                  e.target.style.boxShadow = "none";
                }}
                aria-required="true"
                aria-describedby="password-ayuda"
              />
              <small id="password-ayuda" style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.xs, marginLeft: 2, display: "block", marginBottom: SPACING[2] }}>
                La contraseña debe tener al menos 8 caracteres.
              </small>
              <EyeIcon
                visible={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div style={{ marginBottom: SPACING[5], position: "relative" }}>
              <input
                type={showPasswordConf ? "text" : "password"}
                name="password_confirmation"
                placeholder="Confirmar contraseña"
                aria-label="Confirmar contraseña"
                autoComplete="new-password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: `${SPACING[3]} ${SPACING[4]}`,
                  paddingRight: "48px",
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.lg,
                  fontSize: FONT_SIZES.base,
                  fontFamily: FONTS.main,
                  background: COLORS.surfaceLight,
                  color: COLORS.text,
                  outline: "none",
                  transition: TRANSITIONS.base,
                  boxSizing: "border-box",
                  fontWeight: FONT_WEIGHTS.medium,
                  letterSpacing: 0.2,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.border;
                  e.target.style.boxShadow = "none";
                }}
                aria-required="true"
                aria-describedby="passwordconf-ayuda"
              />
              <small id="passwordconf-ayuda" style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.xs, marginLeft: 2, display: "block", marginBottom: SPACING[2] }}>
                Repite tu contraseña exactamente igual para confirmar.
              </small>
              <EyeIcon
                visible={showPasswordConf}
                onClick={() => setShowPasswordConf(!showPasswordConf)}
              />
            </div>

            {/* El campo de rol se elimina completamente para seguridad, el backend asigna el rol 'estudiante' */}

            <button
  type="submit"
  disabled={loading || enviando}
  aria-busy={loading || enviando}
  aria-label={loading || enviando ? "Creando cuenta" : "Crear cuenta"}
  style={{
    width: "100%",
    background: COLORS.gradientPrimary,
    color: COLORS.text,
    border: "none",
    borderRadius: BORDER_RADIUS.lg,
    padding: `${SPACING[3]} ${SPACING[6]}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    cursor: loading || enviando ? "not-allowed" : "pointer",
    transition: TRANSITIONS.base,
    boxShadow: SHADOWS.md,
    fontFamily: FONTS.main,
    outline: loading || enviando ? `2px solid ${COLORS.primary}` : undefined,
    opacity: loading || enviando ? 0.8 : 1,
  }}
  onFocus={e => {
    e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}33`;
  }}
  onBlur={e => {
    e.target.style.boxShadow = SHADOWS.md;
  }}
>
  {loading || enviando ? "Creando cuenta..." : "Crear Cuenta"}
</button>
      {enviando && (
        <span style={{ color: COLORS.primary, fontWeight: 500, marginLeft: 8 }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: 6 }}></i>
          Registrando, espera unos segundos...
        </span>
      )}

          {/* Botón de Google Login */}
          <div style={{ margin: `${SPACING[5]} 0`, textAlign: 'center' }}>
            <div style={{ marginBottom: SPACING[2], color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>
              O regístrate con
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={async credentialResponse => {
                  setGoogleLoading(true);
                  setGoogleError("");
                  try {
                    const res = await fetch("/api/auth/google-register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ credential: credentialResponse.credential })
                    });
                    if (!res.ok) throw new Error("No se pudo registrar con Google");
                    setGoogleSuccess("¡Registro con Google exitoso!");
                    // Redirigir a la página de pago después del registro con Google
                    setTimeout(() => {
                      navigate('/pago-estudiante');
                    }, 1500);
                  } catch (err) {
                    setGoogleError("Error al registrarse con Google. Intenta de nuevo.");
                  } finally {
                    setGoogleLoading(false);
                  }
                }}
                onError={() => {
                  setGoogleError("Error al registrarse con Google. Intenta de nuevo.");
                }}
                width="260"
                locale="es"
                text="signup_with"
                shape="pill"
                theme="outline"
              />
              {googleLoading && (
                <div role="status" aria-live="polite" style={{ color: COLORS.primary, marginTop: SPACING[2] }}>
                  Procesando registro con Google...
                </div>
              )}
              {googleError && (
                <div role="alert" aria-live="assertive" style={{ color: COLORS.error, marginTop: SPACING[2] }}>
                  {googleError}
                </div>
              )}
              {googleSuccess && (
                <div role="status" aria-live="polite" style={{ color: COLORS.success, marginTop: SPACING[2] }}>
                  {googleSuccess}
                </div>
              )}
            </div>
          </div>
          </form>

          <div
            style={{
              marginTop: SPACING[8],
              paddingTop: SPACING[6],
              borderTop: `1px solid ${COLORS.border}`,
              width: "100%",
            }}
          >
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: FONT_SIZES.sm,
                marginBottom: SPACING[4],
              }}
            >
              ¿Ya tienes una cuenta?
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                color: COLORS.primary,
                border: `2px solid ${COLORS.primary}`,
                borderRadius: BORDER_RADIUS.lg,
                padding: `${SPACING[2]} ${SPACING[6]}`,
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.semibold,
                cursor: "pointer",
                transition: TRANSITIONS.base,
                fontFamily: FONTS.main,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = COLORS.primary;
                e.target.style.color = COLORS.text;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = COLORS.primary;
              }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registro;