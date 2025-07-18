import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gatoEstudio from "../assets/gato_estudio.mp4";
import introVideo from "../assets/intro.mp4";
import Mascota from "../theme/branding/Mascota";
import api from "../utils/axiosConfig";

const frasesExito = [
  "¡Transforma tu futuro hoy!",
  "Aprende, crece, conquista.",
  "Donde los sueños se convierten en logros.",
  "La educación que te impulsa.",
  "¡Haz que tu potencial brille!",
  "Estudia a tu ritmo, alcanza tus metas.",
  "El conocimiento es tu mejor inversión.",
  "Sé el protagonista de tu aprendizaje.",
  "Innovación educativa a tu alcance.",
  "¡Despierta tu genio interior!",
  "Aprender nunca fue tan divertido.",
  "Tu éxito comienza aquí.",
  "Construye el futuro que imaginas.",
  "La plataforma de los que quieren más.",
  "¡Rompe tus límites con MindSchool!",
  "La mejor versión de ti está a un clic.",
];

const cursosDestacados = [
  {
    nombre: "Programación Creativa",
    descripcion:
      "Aprende a programar desde cero con proyectos reales y divertidos.",
    imagen:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
  },
  {
    nombre: "Matemáticas para la Vida",
    descripcion:
      "Domina las matemáticas aplicadas a problemas cotidianos y profesionales.",
    imagen:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    nombre: "Comunicación Efectiva",
    descripcion:
      "Mejora tu expresión oral y escrita para destacar en cualquier entorno.",
    imagen:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
  },
  {
    nombre: "Ciencia y Creatividad",
    descripcion:
      "Explora el mundo científico con experimentos y retos innovadores.",
    imagen:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];

const beneficios = [
  { icon: "⏰", texto: "Aprendizaje flexible a tu propio ritmo." },
  { icon: "🎓", texto: "Instructores expertos en la industria." },
  { icon: "📜", texto: "Certificaciones reconocidas." },
  { icon: "🤝", texto: "Comunidad activa para networking." },
  { icon: "🔒", texto: "Plataforma segura y fácil de usar." },
  { icon: "💡", texto: "Recursos interactivos y soporte 24/7." },
];

const testimonios = [
  {
    texto:
      "Gracias a MindSchool, pude cambiar mi carrera. ¡Altamente recomendado!",
    autor: "Juan P.",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    texto:
      "La mejor plataforma para aprender y conectar con otros estudiantes.",
    autor: "María L.",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    texto: "Los cursos son prácticos y los profesores muy atentos.",
    autor: "Carlos G.",
    foto: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const frasesMotivacionales = [
  "En MindSchool, cada paso que das es un avance hacia tu mejor versión.",
  "¡Atrévete a aprender, crecer y transformar tu futuro con nosotros!",
  "El conocimiento es la llave que abre todas las puertas.",
  "Nunca es tarde para aprender algo nuevo.",
  "Tu futuro empieza hoy, ¡hazlo increíble!",
];

const fadeInStyle = {
  animation: "fadeInLanding 1.2s cubic-bezier(.4,2,.6,1)",
  opacity: 1,
};

const keyframes = `
@keyframes fadeInLanding {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}`;

// Fondo animado/interactivo tipo esporas
function FondoEsporas() {
  const canvasRef = useRef(null);
  const esporas = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Crear esporas
    const N = 32;
    esporas.current = Array.from({ length: N }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 16 + Math.random() * 18,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
      color: `hsl(${Math.random() * 360}, 80%, 70%)`,
      alpha: 0.18 + Math.random() * 0.22,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const e of esporas.current) {
        // Interacción con el mouse
        const dist = Math.hypot(e.x - mouse.current.x, e.y - mouse.current.y);
        let scale = 1;
        if (dist < 120) scale = 1.25;
        if (dist < 60) scale = 1.5;
        ctx.save();
        ctx.globalAlpha = e.alpha;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * scale, 0, 2 * Math.PI);
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 24 * scale;
        ctx.fill();
        ctx.restore();
      }
    }
    function update() {
      for (const e of esporas.current) {
        e.x += e.dx;
        e.y += e.dy;
        if (e.x < -40) e.x = width + 40;
        if (e.x > width + 40) e.x = -40;
        if (e.y < -40) e.y = height + 40;
        if (e.y > height + 40) e.y = -40;
      }
    }
    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    });
    canvas.addEventListener("mouseleave", () => {
      mouse.current = { x: -1000, y: -1000 };
    });
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        zIndex: 0,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    />
  );
}


const Bienvenida = () => {
  const navigate = useNavigate();
  const [fraseActual, setFraseActual] = useState(0);
  const [desaparecer, setDesaparecer] = useState(false);
  const [infoVisible, setInfoVisible] = useState(
    Array(cursosDestacados.length).fill(false),
  );
  // Estado para hover de tarjetas
  const [hoveredCard, setHoveredCard] = useState(null);
  // Estado para el carrusel de testimonios
  const [testimonioActual, setTestimonioActual] = useState(0);
  const [fraseMotivacionalActual, setFraseMotivacionalActual] = useState(0);
  const cambiarTestimonio = (dir) => {
    setTestimonioActual((prev) => {
      if (dir === "next") return (prev + 1) % testimonios.length;
      if (dir === "prev")
        return (prev - 1 + testimonios.length) % testimonios.length;
      return prev;
    });
  };

  useEffect(() => {
    const timeout1 = setTimeout(() => setDesaparecer(true), 3200);
    const timeout2 = setTimeout(() => {
      setFraseActual((prev) => (prev + 1) % frasesExito.length);
      setDesaparecer(false);
    }, 4000);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [fraseActual]);

  // Carrusel automático de testimonios
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonioActual((prev) => (prev + 1) % testimonios.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonios.length]);
  // Carrusel automático de frases motivacionales
  useEffect(() => {
    const timer = setInterval(() => {
      setFraseMotivacionalActual(
        (prev) => (prev + 1) % frasesMotivacionales.length,
      );
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (idx) => {
    setInfoVisible((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState("");
  const [error, setError] = useState("");

  const inputStyle = {
    border: "1.5px solid #3B82F6",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 16,
    outline: "none",
    background: "#f8fafc",
    color: "#222e3a",
    fontWeight: 500,
    boxShadow: "0 2px 8px #2563eb11",
    transition: "border 0.2s, box-shadow 0.2s",
  };
  const buttonStyle = {
    background: "linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "14px 0",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 12px #3B82F655",
    marginTop: 4,
    transition: "background 0.2s, box-shadow 0.2s",
    width: "100%",
  };
  const linkStyle = {
    color: "#2563EB",
    fontWeight: 700,
    fontSize: 18,
    textDecoration: "none",
    transition: "color 0.2s",
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmitContacto(e) {
    e.preventDefault();
    setEnviando(true);
    setExito("");
    setError("");
    try {
      await api.post("/contacto", form);
      setExito(
        "¡Mensaje enviado correctamente! Pronto nos pondremos en contacto.",
      );
      setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
    } catch (err) {
      setError("Ocurrió un error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const mensajesEasterEgg = [
    "¡Sigue aprendiendo, el futuro es tuyo! 🎉",
    "¡Eres increíble, nunca dejes de soñar! 😺",
    "¡Hoy es un gran día para aprender algo nuevo! 🚀",
    "¡La curiosidad es tu superpoder! 💡",
    "¡Haz clic y deja que la magia suceda! ✨",
    "¡MindSchool te acompaña en cada paso! 🧠",
  ];

  const [showEgg, setShowEgg] = useState(false);
  const [mensajeEgg, setMensajeEgg] = useState(
    mensajesEasterEgg[Math.floor(Math.random() * mensajesEasterEgg.length)],
  );

  function handleShowEgg() {
    setMensajeEgg(
      mensajesEasterEgg[Math.floor(Math.random() * mensajesEasterEgg.length)],
    );
    setShowEgg(true);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #1e293b 0%, #334155 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 0 48px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FondoEsporas />
      {/* Animación global para fade-in */}
      <style>{keyframes}
      {`
        .mascota-landing {
          position: absolute;
          top: 10px;
          left: 24px;
          z-index: 10;
        }
        @media (max-width: 900px) {
          .mascota-landing {
            left: 10px;
            top: 6px;
            width: 60px !important;
            height: 60px !important;
          }
        }
        @media (max-width: 900px) {
  .landing-header {
    max-width: 98vw !important;
    border-radius: 1.2rem !important;
    padding: 6px 2vw 0 2vw !important;
  }
  .landing-title {
    font-size: 1.2rem !important;
    max-width: 90vw !important;
    margin-bottom: 2px !important;
  }
  .frase-motivacional {
    font-size: 1.01rem !important;
    min-height: 22px !important;
    max-width: 92vw !important;
  }
  .landing-main, .landing-hero, .landing-cards {
    max-width: 98vw !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .landing-hero {
    flex-direction: column !important;
    gap: 18px !important;
    align-items: stretch !important;
    padding: 0 0 12px 0 !important;
  }
  .landing-hero-video {
    min-width: 0 !important;
    max-width: 100vw !important;
    height: 160px !important;
    border-radius: 14px !important;
  }
  .landing-hero-content {
    min-width: 0 !important;
    max-width: 100vw !important;
    padding: 0 2vw !important;
  }
  .landing-hero-content h1 {
    font-size: 1.45rem !important;
    line-height: 1.12 !important;
  }
  .landing-hero-content p {
    font-size: 1.01rem !important;
    margin-bottom: 10px !important;
  }
  .landing-buttons {
    flex-direction: column !important;
    gap: 14px !important;
    width: 100% !important;
    align-items: center !important;
    margin-top: 20px !important;
  }
  .landing-buttons button {
    width: 96vw !important;
    min-width: 0 !important;
    font-size: 1.07rem !important;
    padding: 14px 0 !important;
  }
  .landing-card {
    min-width: 0 !important;
    max-width: 98vw !important;
    margin: 0 auto 10px auto !important;
    padding: 12px 8px !important;
    border-radius: 12px !important;
  }
  .landing-form {
    max-width: 98vw !important;
    padding: 10px 2vw !important;
    border-radius: 14px !important;
  }
}
@media (max-width: 600px) {
          .landing-header {
            padding: 4px 1vw 0 1vw !important;
          }
          .landing-title {
            font-size: 1rem !important;
          }
          .landing-hero {
            gap: 10px !important;
          }
          .card-curso {
            min-width: 0 !important;
            max-width: 98vw !important;
            padding: 10px 2vw !important;
          }
        }
      `}</style>
      {/* Barra de navegación especial para la landing */}
      <div className="landing-header" style={{
  width: "100%",
  maxWidth: 1400,
  margin: "24px auto 0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 0,
  background: "rgba(30,41,59,0.95)",
  borderRadius: "2.5rem",
  boxShadow: "0 4px 32px rgba(30,41,59,0.18)",
  padding: "10px 16px 0 16px"
}}>
  <div className="landing-title" style={{
    fontFamily: "Poppins, Inter, Segoe UI, Arial, sans-serif",
    fontWeight: 900,
    fontSize: "2rem",
    color: "#3B82F6",
    textAlign: "center",
    width: "100%",
    marginBottom: 2,
    letterSpacing: 0.02,
    lineHeight: 1.1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }}>
    MindSchool
  </div>
  <div className="frase-motivacional" style={{
    fontSize: "1.08rem",
    color: "#fff",
    margin: "2px 0 8px 0",
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    minHeight: 26,
    letterSpacing: 0.01,
    lineHeight: 1.18
  }}>
    {frasesExito[fraseActual]}
  </div>
</div>
{/* Barra de navegación especial para la landing */}


      {/* HERO VISUAL Y COMPACTO */}
      <section
        style={{
          ...fadeInStyle,
          width: "100%",
          maxWidth: 1200,
          margin: "32px auto 0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 12px",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: 480,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(30,41,59,0.25)",
            background: "#222e3a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 280,
          }}
        >
          <video
            src={introVideo}
            autoPlay
            muted
            playsInline
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              background: "#111927",
            }}
            poster="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80"
          >
            Tu navegador no soporta el video HTML5.
          </video>
        </div>
        <div
          style={{
            flex: 2,
            minWidth: 320,
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <h1
            style={{
              color: "#3B82F6",
              fontSize: 38,
              fontWeight: 900,
              margin: 0,
              letterSpacing: 1,
              lineHeight: 1.1,
            }}
          >
            ¡Transforma tu aprendizaje con MindSchool!
          </h1>
          <h2
            style={{
              color: "#e0e7ef",
              fontSize: 20,
              fontWeight: 500,
              margin: 0,
              maxWidth: 600,
            }}
          >
            La plataforma más divertida y efectiva para estudiantes y profesores
          </h2>
          <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
            <button
              onClick={() => navigate("/registro")}
              style={{
                background: "linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 16,
                padding: "14px 38px",
                fontSize: 20,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(59,130,246,0.15)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Regístrate Gratis
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                color: "#3B82F6",
                border: "2px solid #3B82F6",
                borderRadius: 16,
                padding: "14px 28px",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px #3B82F655",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Inicia Sesión
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS: ¿Por qué MindSchool? */}
      <section style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto', padding: '32px 18px', background: 'rgba(34,46,58,0.96)', borderRadius: 28, boxShadow: '0 6px 32px #1e293b55', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <h2 style={{ color: '#bae6fd', fontWeight: 800, fontSize: 26, marginBottom: 8, letterSpacing: 1 }}>¿Por qué MindSchool?</h2>
        {beneficios.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 38, marginRight: 8, filter: 'drop-shadow(0 2px 8px #fff5)' }}>{b.icon}</span>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>{b.texto}</span>
          </div>
        ))}
      </section>

      {/* QUIZ DE ORIENTACIÓN */}
      <section style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto', padding: '32px 18px', background: 'rgba(59,130,246,0.10)', borderRadius: 28, boxShadow: '0 4px 24px #2563eb22', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
        <h2 style={{ color: '#3B82F6', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>¿No sabes por dónde empezar?</h2>
        <QuizOrientacion />
      </section>

      {/* TESTIMONIOS */}
      <section style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto', padding: '32px 18px', background: 'rgba(34,46,58,0.96)', borderRadius: 28, boxShadow: '0 6px 32px #1e293b55', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 340, gap: 18 }}>
        <h2 style={{ color: '#bae6fd', fontWeight: 800, fontSize: 26, marginBottom: 8, letterSpacing: 1 }}>Testimonios</h2>
        {/* ...carrusel de testimonios... */}
        <div style={{ width: "100%", maxWidth: 420, minHeight: 220 }}>
            {/* Aquí va el carrusel de testimonios existente */}
            {/* Testimonios */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                minHeight: 340,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Flecha izquierda */}
              <button
                onClick={() => cambiarTestimonio("prev")}
                style={{
                  position: "absolute",
                  left: -38,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(30,41,59,0.7)",
                  border: "none",
                  borderRadius: "50%",
                  width: 38,
                  height: 38,
                  color: "#3B82F6",
                  fontSize: 22,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #2563eb33",
                  zIndex: 2,
                  transition: "background 0.2s",
                }}
              >
                &lt;
              </button>
              {/* Testimonio actual */}
              <div
                key={testimonioActual}
                style={{
                  background: "rgba(34,46,58,0.82)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 32,
                  boxShadow: "0 8px 32px #1e293b66",
                  minHeight: 320,
                  minWidth: 320,
                  maxWidth: 420,
                  padding: "48px 32px 38px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  animation: "fadeInTestimonio 0.7s cubic-bezier(.4,2,.6,1)",
                  border: "3.5px solid #3B82F6",
                  zIndex: 1,
                }}
              >
                <img
                  src={testimonios[testimonioActual].foto}
                  alt={testimonios[testimonioActual].autor}
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: 16,
                    border: "3px solid #bae6fd",
                    boxShadow: "0 2px 12px #0007",
                  }}
                  loading="lazy"
                />
                <span
                  style={{
                    color: "#e0e7ef",
                    fontSize: 20,
                    textAlign: "center",
                    fontStyle: "italic",
                    marginBottom: 18,
                    textShadow: "0 2px 8px #0008",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 38,
                      color: "#3B82F6",
                      verticalAlign: "top",
                      marginRight: 6,
                    }}
                  >
                    “
                  </span>
                  {testimonios[testimonioActual].texto}
                  <span
                    style={{
                      fontSize: 38,
                      color: "#3B82F6",
                      verticalAlign: "bottom",
                      marginLeft: 6,
                    }}
                  >
                    ”
                  </span>
                </span>
                <span
                  style={{
                    color: "#3B82F6",
                    fontWeight: 700,
                    fontSize: 18,
                    marginTop: 8,
                  }}
                >
                  {testimonios[testimonioActual].autor}
                </span>
              </div>
              {/* Flecha derecha */}
              <button
                onClick={() => cambiarTestimonio("next")}
                style={{
                  position: "absolute",
                  right: -38,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(30,41,59,0.7)",
                  border: "none",
                  borderRadius: "50%",
                  width: 38,
                  height: 38,
                  color: "#3B82F6",
                  fontSize: 22,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #2563eb33",
                  zIndex: 2,
                  transition: "background 0.2s",
                }}
              >
                &gt;
              </button>
              {/* Dots indicadores */}
              <div
                style={{
                  position: "absolute",
                  bottom: 18,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 10,
                  zIndex: 3,
                }}
              >
                {testimonios.map((_, idx) => (
                  <span
                    key={idx}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background:
                        idx === testimonioActual ? "#3B82F6" : "#bae6fd",
                      opacity: idx === testimonioActual ? 1 : 0.5,
                      boxShadow:
                        idx === testimonioActual
                          ? "0 2px 8px #3B82F6aa"
                          : "none",
                      transition: "background 0.2s, opacity 0.2s",
                      cursor: "pointer",
                    }}
                    onClick={() => setTestimonioActual(idx)}
                  />
                ))}
              </div>
              <style>{`
                @keyframes fadeInTestimonio {
                  0% { opacity: 0; transform: scale(0.95) translateY(30px); }
                  100% { opacity: 1; transform: none; }
                }
              `}</style>
            </div>
          </div>
        
      </section>

       {/* CURSOS DESTACADOS */}
       <section style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto', padding: '32px 18px', background: 'rgba(59,130,246,0.10)', borderRadius: 28, boxShadow: '0 4px 24px #2563eb22', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, alignItems: 'stretch', minHeight: 340 }}>
        {cursosDestacados.map((curso, idx) => (
          <div key={curso.nombre} className="card-curso" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #2563eb22', padding: '18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minHeight: 180, width: '100%', maxWidth: 320, margin: '0 auto', transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'pointer' }}>
            <img src={curso.imagen} alt={curso.nombre} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} loading="lazy" />
            <div style={{ color: '#3B82F6', fontWeight: 800, fontSize: 20, textAlign: 'center', marginBottom: 4 }}>{curso.nombre}</div>
            <div style={{ color: '#222e3a', fontSize: 15, textAlign: 'center' }}>{curso.descripcion}</div>
          </div>
        ))}
      </section>

      {/* SOBRE NOSOTROS (quiénes somos + historia) */}
      <section
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "32px auto 0 auto",
          padding: "32px 18px",
          background: "rgba(34,46,58,0.96)",
          borderRadius: 28,
          boxShadow: "0 6px 32px #1e293b55",
          display: "flex",
          flexDirection: "row",
          gap: 38,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Foto del equipo/historia */}
          <div
            style={{
              width: 220,
              height: 220,
              background: "#bae6fd",
              borderRadius: 24,
              boxShadow: "0 2px 12px #2563eb33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: 20,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Foto del equipo
            </span>
          </div>
        </div>
        <div
          style={{
            flex: 2,
            color: "#e0e7ef",
            fontSize: 19,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          <h2
            style={{
              color: "#3B82F6",
              fontWeight: 800,
              fontSize: 32,
              marginBottom: 18,
            }}
          >
            Sobre MindSchool
          </h2>
          <p>
            Somos un equipo multidisciplinario apasionado por la educación, la
            tecnología y la creatividad. En MindSchool, creemos en el poder de
            la comunidad y la innovación para transformar vidas y abrir nuevas
            oportunidades de aprendizaje para todos.
          </p>
          <p>
            MindSchool nació del sueño de transformar la educación en una
            experiencia divertida, inclusiva y efectiva para todos. Nuestro
            equipo, apasionado por la innovación y el aprendizaje, ha trabajado
            incansablemente para crear una plataforma donde estudiantes y
            profesores puedan crecer juntos, compartir conocimientos y alcanzar
            sus metas.
          </p>
          <p>
            Creemos que cada persona tiene un potencial único, y nuestra misión
            es ayudar a descubrirlo y potenciarlo a través de la tecnología, la
            creatividad y la comunidad.
          </p>
        </div>
      </section>

      {/* CONTACTO VISUAL Y DESTACADO */}
      <section
        id="contacto"
        style={{
          width: "100%",
          maxWidth: 800,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 12px #2563eb22",
          padding: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* Video del gato que estudia */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: "#222e3a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          <video
            src={gatoEstudio}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              maxWidth: 380,
              maxHeight: 380,
              minHeight: 220,
              objectFit: "cover",
              borderRadius: 18,
              display: "block",
              background: "#222e3a",
              boxShadow: "0 4px 24px #2563eb33",
            }}
          />
        </div>
        {/* Formulario de contacto */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <h2 style={{ color: "#2563EB", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
            Contáctanos
          </h2>
          <form
            onSubmit={handleSubmitContacto}
            style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }}
            autoComplete="off"
          >
            <input
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
            />
            <input
              name="telefono"
              type="text"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
            />
            <input
              name="asunto"
              type="text"
              placeholder="Asunto"
              value={form.asunto}
              onChange={handleChange}
              style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
            />
            <textarea
              name="mensaje"
              placeholder="Mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              rows={3}
              style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1", resize: "vertical" }}
            />
            <button
              type="submit"
              disabled={enviando}
              style={{
                background: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontWeight: 700,
                fontSize: 16,
                cursor: enviando ? "not-allowed" : "pointer",
                marginTop: 6,
              }}
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
            {exito && <div style={{ color: "#16a34a", fontWeight: 700 }}>{exito}</div>}
            {error && <div style={{ color: "#dc2626", fontWeight: 700 }}>{error}</div>}
          </form>
        </div>
        {/* Estilos responsivos */}
        <style>{`
          @media (max-width: 700px) {
            #contacto {
              flex-direction: column !important;
              max-width: 98vw !important;
              border-radius: 10px !important;
            }
            #contacto > div {
              max-width: 100vw !important;
              padding: 0 !important;
            }
            #contacto video {
              max-width: 100vw !important;
              min-height: 180px !important;
              max-height: 260px !important;
              border-radius: 0 !important;
              margin-top: 12px !important;
              margin-bottom: 12px !important;
            }
            #contacto form {
              max-width: 98vw !important;
            }
          }
        `}</style>
      </section>
      {/* Easter Egg: Botón flotante e interacción */}
      <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 10000 }}>
        <button
          onClick={handleShowEgg}
          style={{
            background: "linear-gradient(90deg, #bae6fd 0%, #3B82F6 100%)",
            border: "none",
            borderRadius: "50%",
            width: 64,
            height: 64,
            boxShadow: "0 4px 18px #2563eb44",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            animation: "eggPulse 1.2s infinite alternate",
            transition: "box-shadow 0.2s",
          }}
          title="¡Haz clic para una sorpresa!"
        >
          <Mascota width={38} height={38} />
        </button>
        <style>{`@keyframes eggPulse { 0%{box-shadow:0 0 0 #2563eb00;} 100%{box-shadow:0 0 24px #3B82F6aa;} }`}</style>
      </div>
      {showEgg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30,41,59,0.75)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInEgg 0.5s",
          }}
          onClick={() => setShowEgg(false)}
        >
          <Confetti />
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              boxShadow: "0 8px 32px #2563eb55",
              padding: "48px 38px",
              minWidth: 320,
              maxWidth: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              animation: "eggPop 0.7s cubic-bezier(.4,2,.6,1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Mascota width={80} height={80} showVideo={true} />
            <div
              style={{
                color: "#3B82F6",
                fontWeight: 900,
                fontSize: 26,
                margin: "18px 0 8px 0",
                textAlign: "center",
              }}
            >
              {mensajeEgg}
            </div>
            <button
              onClick={() => setShowEgg(false)}
              style={{
                marginTop: 18,
                background: "#3B82F6",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 24px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px #2563eb33",
              }}
            >
              Cerrar
            </button>
          </div>
          <style>{`
            @keyframes fadeInEgg { 0%{opacity:0;} 100%{opacity:1;} }
            @keyframes eggPop { 0%{transform:scale(0.7);opacity:0;} 100%{transform:scale(1);opacity:1;} }
          `}</style>
        </div>
      )}
      {/* Footer profesional */}
      <footer
        style={{
          width: "100%",
          background: "#1e293b",
          color: "#cbd5e1",
          padding: "32px 0 18px 0",
          marginTop: 48,
          textAlign: "center",
          borderTop: "2px solid #334155",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Hecho con <span style={{ color: "#ef4444", fontSize: 22, verticalAlign: "middle" }}>♥</span> para la educación
        </div>
        <div style={{ fontSize: 15, marginBottom: 12 }}>
          &copy; {new Date().getFullYear()} MindSchool. Todos los derechos reservados.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", fontSize: 15 }}>
          <a href="/aviso-legal" style={{ color: "#60a5fa", textDecoration: "none" }}>Aviso legal</a>
          <a href="/privacidad" style={{ color: "#60a5fa", textDecoration: "none" }}>Política de privacidad</a>
          <a href="#contacto" style={{ color: "#60a5fa", textDecoration: "none" }}>Contacto</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "none" }}>Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "none" }}>Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "none" }}>Instagram</a>
        </div>
      </footer>
    </div>
  );
};

// Componente QuizOrientacion
function QuizOrientacion() {
  const preguntas = [
    {
      texto: "¿Qué te gustaría mejorar primero?",
      icon: "💡",
      opciones: [
        { label: "Programación", value: "programacion", icon: "💻" },
        { label: "Matemáticas", value: "matematicas", icon: "📐" },
        { label: "Comunicación", value: "comunicacion", icon: "🗣️" },
        { label: "Ciencia y Creatividad", value: "ciencia", icon: "🔬" },
      ],
    },
    {
      texto: "¿Prefieres aprender a tu ritmo o con retos?",
      icon: "⏰",
      opciones: [
        { label: "A mi ritmo", value: "ritmo", icon: "🏃‍♂️" },
        { label: "Con retos", value: "retos", icon: "🏆" },
      ],
    },
    {
      texto: "¿Te gustaría obtener un certificado?",
      icon: "🎓",
      opciones: [
        { label: "Sí", value: "certificado", icon: "✅" },
        { label: "No es necesario", value: "no_certificado", icon: "🙅‍♂️" },
      ],
    },
  ];
  const recomendaciones = {
    programacion: "¡Te recomendamos el curso de Programación Creativa! 🚀",
    matematicas: "¡Matemáticas para la Vida es ideal para ti! 📐",
    comunicacion: "¡Comunicación Efectiva te ayudará a destacar! 🗣️",
    ciencia: "¡Ciencia y Creatividad es tu mejor opción! 🔬",
  };
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [finalizado, setFinalizado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [animando, setAnimando] = useState(false);

  // Animación de carga antes de mostrar la primera pregunta
  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 1200);
    return () => clearTimeout(t);
  }, []);

  function handleRespuesta(valor) {
    setAnimando(true);
    setTimeout(() => {
      setAnimando(false);
      const nuevas = [...respuestas, valor];
      setRespuestas(nuevas);
      if (paso < preguntas.length - 1) {
        setPaso(paso + 1);
      } else {
        setFinalizado(true);
      }
    }, 650);
  }
  if (cargando) {
    // Animación de carga vistosa
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 160,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 48,
            color: "#3B82F6",
            marginBottom: 12,
            animation: "spinQuiz 1.2s linear infinite",
          }}
        >
          🔄
        </div>
        <div
          style={{
            color: "#2563EB",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          Preparando tu experiencia personalizada...
        </div>
        <style>{`@keyframes spinQuiz { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }`}</style>
      </div>
    );
  }
  if (finalizado) {
    const area = respuestas[0];
    return (
      <div
        style={{
          marginTop: 10,
          fontSize: 22,
          color: "#2563EB",
          fontWeight: 700,
          background: "rgba(224,231,239,0.98)",
          borderRadius: 22,
          padding: "28px 32px",
          boxShadow: "0 4px 18px #2563eb22",
          display: "inline-block",
          animation: "fadeInQuiz 0.7s cubic-bezier(.4,2,.6,1)",
          maxWidth: 420,
        }}
      >
        <span style={{ fontSize: 32, marginRight: 12 }}>🎉</span>
        {recomendaciones[area] ||
          "¡Explora todos nuestros cursos y encuentra el ideal para ti!"}
        <style>{`@keyframes fadeInQuiz { 0%{opacity:0;transform:scale(0.95);} 100%{opacity:1;transform:none;} }`}</style>
      </div>
    );
  }
  return (
    <div
      style={{
        margin: "0 auto",
        marginTop: 18,
        background: "rgba(34,46,58,0.92)",
        borderRadius: 28,
        boxShadow: "0 8px 32px #2563eb33",
        padding: "38px 28px 32px 28px",
        maxWidth: 420,
        minWidth: 260,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        animation: "fadeInQuizCard 0.8s cubic-bezier(.4,2,.6,1)",
        overflow: "hidden",
      }}
    >
      {/* Animación de entrada */}
      <style>{`
        @keyframes fadeInQuizCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: none; }
        }
      `}</style>
      {/* Pregunta */}
      <div
        style={{
          marginBottom: 24,
          opacity: animando ? 0 : 1,
          transform: animando ? "translateY(30px) scale(0.95)" : "none",
          transition: "all 0.6s cubic-bezier(.4,2,.6,1)",
          minHeight: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: "#fff",
          fontWeight: 800,
          letterSpacing: 0.5,
          textAlign: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 32 }}>{preguntas[paso].icon}</span>
        {preguntas[paso].texto}
      </div>
      {/* Opciones */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 600 ? "1fr" : `repeat(${preguntas[paso].opciones.length > 2 ? 2 : 1}, 1fr)`,
          gap: 18,
          width: "100%",
          justifyItems: "center",
          opacity: animando ? 0 : 1,
          transform: animando ? "translateY(30px) scale(0.95)" : "none",
          transition: "all 0.6s cubic-bezier(.4,2,.6,1)",
        }}
      >
        {preguntas[paso].opciones.map((op) => (
          <button
            key={op.value}
            onClick={() => handleRespuesta(op.value)}
            style={{
              background: "linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "18px 12px",
              fontSize: 18,
              fontWeight: 700,
              cursor: animando ? "not-allowed" : "pointer",
              boxShadow: "0 2px 12px #3B82F655",
              minWidth: 0,
              minHeight: 54,
              width: "100%",
              margin: "0 0 8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "transform 0.2s, box-shadow 0.2s",
              outline: "none",
              opacity: animando ? 0.7 : 1,
              pointerEvents: animando ? "none" : "auto",
            }}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            disabled={animando}
          >
            <span style={{ fontSize: 22 }}>{op.icon}</span>
            {op.label}
          </button>
        ))}
      </div>
      {/* Animación de salida/entrada */}
      {animando && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(59,130,246,0.10)",
            zIndex: 2,
            animation: "fadeInQuiz 0.7s cubic-bezier(.4,2,.6,1)",
          }}
        >
          <span
            style={{
              fontSize: 44,
              color: "#3B82F6",
              animation: "bounceQuiz 0.7s infinite alternate",
            }}
          >
            ✨
          </span>
          <style>{`@keyframes bounceQuiz { 0%{transform:translateY(0);} 100%{transform:translateY(-12px);} } @keyframes fadeInQuiz { 0%{opacity:0;} 100%{opacity:1;} }`}</style>
        </div>
      )}
    </div>
  );
}

function Confetti() {
  // Confeti simple con CSS
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {[...Array(32)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80}%`,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: `hsl(${Math.random() * 360}, 90%, 65%)`,
            opacity: 0.85,
            animation: `confetti-fall 1.8s ${Math.random()}s cubic-bezier(.4,2,.6,1) infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-40px) scale(1); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(80vh) scale(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default Bienvenida;
