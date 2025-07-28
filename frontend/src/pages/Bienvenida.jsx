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

// Materias de maestros especiales como fallback
const materiasEspeciales = [
  {
    id: "especial-1",
    nombre: "Matemáticas Avanzadas",
    descripcion: "Con el Dr. Carlos Méndez, experto en análisis matemático y geometría diferencial. Más de 20 años de experiencia en investigación.",
    imagen_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80",
    precio: "Gratis",
    instructor: "Dr. Carlos Méndez",
    especialidad: "Análisis Matemático"
  },
  {
    id: "especial-2", 
    nombre: "Física Cuántica",
    descripcion: "Con la Dra. Ana Rodríguez, investigadora del CERN. Descubre los misterios del universo subatómico con experimentos prácticos.",
    imagen_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    precio: "Gratis",
    instructor: "Dra. Ana Rodríguez",
    especialidad: "Física de Partículas"
  },
  {
    id: "especial-3",
    nombre: "Literatura Clásica",
    descripcion: "Con el Prof. Miguel Ángel García, crítico literario reconocido. Explora las obras maestras de la literatura universal.",
    imagen_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
    precio: "Gratis",
    instructor: "Prof. Miguel Ángel García",
    especialidad: "Crítica Literaria"
  },
  {
    id: "especial-4",
    nombre: "Inteligencia Artificial",
    descripcion: "Con el Dr. Roberto Silva, experto en machine learning de Google. Aprende las últimas tecnologías de IA.",
    imagen_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80",
    precio: "Gratis",
    instructor: "Dr. Roberto Silva",
    especialidad: "Machine Learning"
  },
  {
    id: "especial-5",
    nombre: "Historia del Arte",
    descripcion: "Con la Dra. Elena Morales, curadora del Museo Nacional. Viaja a través de los movimientos artísticos más importantes.",
    imagen_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=400&q=80",
    precio: "Gratis",
    instructor: "Dra. Elena Morales",
    especialidad: "Historia del Arte"
  },
  {
    id: "especial-6",
    nombre: "Biología Molecular",
    descripcion: "Con el Dr. Fernando López, investigador del Instituto Pasteur. Descubre los secretos de la vida a nivel molecular.",
    imagen_url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f7?auto=format&fit=crop&w=400&q=80",
    precio: "Gratis",
    instructor: "Dr. Fernando López",
    especialidad: "Biología Molecular"
  }
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
  // Estado para cursos de la base de datos
  const [cursosDB, setCursosDB] = useState([]);
  const [cursosLoading, setCursosLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
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

  // Obtener cursos de la base de datos
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setCursosLoading(true);
        const response = await api.get("/cursos");
        const cursosFromDB = response.data.data || response.data || [];
        
        // Si no hay cursos en la BD, usar materias especiales
        if (cursosFromDB.length === 0) {
          setCursosDB(materiasEspeciales);
        } else {
          setCursosDB(cursosFromDB);
        }
      } catch (error) {
        console.error("Error al obtener cursos:", error);
        // En caso de error, usar materias especiales
        setCursosDB(materiasEspeciales);
      } finally {
        setCursosLoading(false);
      }
    };

    fetchCursos();
  }, []);

  // Auto-slide para el carrusel de cursos
  useEffect(() => {
    if (cursosDB.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(cursosDB.length / 3));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [cursosDB.length]);

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
    border: "2px solid #E2E8F0",
    borderRadius: "8px",
    padding: "16px 20px",
    fontSize: "16px",
    outline: "none",
    background: "#FFFFFF",
    color: "#1E293B",
    fontWeight: "500",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box",
  };
  
  const buttonStyle = {
    background: "#1E293B",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };
  
  const linkStyle = {
    color: "#1E293B",
    fontWeight: "600",
    fontSize: "16px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    borderBottom: "2px solid transparent",
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
    <div style={{
      minHeight: "100vh",
      background: "#FFFFFF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#000000",
      overflow: "hidden"
    }}>
      

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
      
      {/* PÁGINA COMPLETA FLUIDA */}
      <div style={{
        width: "100%",
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 25%, #334155 50%, #64748B 75%, #F8FAFC 100%)",
        minHeight: "100vh"
      }}>
        
        {/* HERO SECTION */}
        <section style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Background Brand */}
          <div style={{
            position: "absolute",
            top: "40px",
            left: "40px",
          fontSize: "48px",
            fontWeight: "900",
            color: "rgba(255, 255, 255, 0.1)",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "2px"
          }}>
            MIND SCHOOL
          </div>
          
          {/* Main Content */}
          <div style={{
            textAlign: "center",
            maxWidth: "800px",
          padding: "0 40px"
          }}>
            {/* Main Slogan */}
          <div style={{
            marginBottom: "60px"
          }}>
            <h1 style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#FFFFFF",
              margin: "0 0 8px 0",
              lineHeight: "1.1",
              letterSpacing: "-2px"
            }}>
                ¡TRANSFORMA
              </h1>
            <h1 style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#FF6B35",
              margin: "0 0 8px 0",
              lineHeight: "1.1",
              letterSpacing: "-2px"
            }}>
                TU FUTURO
              </h1>
            <h1 style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#FFFFFF",
              margin: "0",
              lineHeight: "1.1",
              letterSpacing: "-2px"
            }}>
                HOY!
              </h1>
            </div>
            
            {/* Changing Phrases */}
            <div style={{
            marginBottom: "60px",
            minHeight: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <p style={{
              fontSize: "24px",
              fontWeight: "600",
                color: "#FFFFFF",
                margin: "0",
                opacity: desaparecer ? 0 : 1,
                transition: "opacity 0.8s ease",
                textAlign: "center",
                maxWidth: "600px",
                lineHeight: "1.4"
              }}>
                {frasesExito[fraseActual]}
              </p>
            </div>
            
            {/* Call to Action Buttons */}
          <div style={{
            display: "flex",
            gap: "24px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
              <button 
                onClick={() => navigate('/registro')}
              style={{
                background: "#FF6B35",
                color: "#FFFFFF",
                border: "none",
                padding: "18px 48px",
                fontSize: "22px",
                fontWeight: "700",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                borderRadius: "16px"
              }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#E55A2B";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#FF6B35";
                  e.target.style.transform = "scale(1)";
                }}>
                Regístrate Gratis
              </button>
              <button 
                onClick={() => navigate('/login')}
              style={{
                background: "none",
                color: "#FF6B35",
                border: "2px solid #FF6B35",
                padding: "18px 40px",
                fontSize: "20px",
                fontWeight: "700",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                borderRadius: "16px"
              }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}>
                Inicia Sesión
              </button>
            </div>
          </div>
        </section>

      {/* CURSOS DESTACADOS - Slider con BD */}
      <section style={{ 
        width: '100vw', 
        padding: '80px 0', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '40px' 
      }}>
        <h2 style={{ 
          color: '#1E293B', 
          fontWeight: '800', 
          fontSize: '36px', 
          marginBottom: '20px', 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          Nuestros Cursos
        </h2>
        
        {cursosLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            color: '#64748B',
            fontSize: '18px'
          }}>
            Cargando cursos...
          </div>
        ) : cursosDB.length > 0 ? (
          <div style={{
            width: '100vw',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Contenedor del slider */}
            <div style={{
              display: 'flex',
              transition: 'transform 0.8s ease-in-out',
              transform: `translateX(-${currentSlide * 100}%)`,
              gap: '40px',
              padding: '0 40px'
            }}>
            {cursosDB.map((curso, idx) => (
              <div 
                key={curso.id || idx} 
                  className="card-curso" 
                  style={{ 
                    background: 'rgba(30, 41, 59, 0.05)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(30, 41, 59, 0.1)',
                    padding: '32px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '20px', 
                    minHeight: 320, 
                    width: 'calc(33.333% - 26.67px)', 
                    minWidth: '320px',
                    flexShrink: 0,
                    transition: 'all 0.3s ease', 
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.2)';
                    e.target.style.borderColor = '#FF6B35';
                    e.target.style.background = 'rgba(30, 41, 59, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                    e.target.style.borderColor = 'rgba(30, 41, 59, 0.1)';
                    e.target.style.background = 'rgba(30, 41, 59, 0.05)';
                  }}
                onClick={() => navigate(`/curso/${curso.id}`)}
              >
                <img 
                  src={curso.imagen_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80"} 
                  alt={curso.nombre} 
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      marginBottom: '8px' 
                    }} 
                  loading="lazy" 
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                  <div style={{
                    color: '#1E293B', 
                    fontWeight: '600', 
                    fontSize: '18px', 
                    textAlign: 'center', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                  {curso.nombre}
                </div>
                  <div style={{ 
                    color: '#64748B', 
                    fontSize: '14px', 
                    textAlign: 'center',
                    lineHeight: '1.5',
                    flex: 1
                  }}>
                  {curso.descripcion || 'Descripción no disponible'}
                </div>
                {curso.instructor && (
                    <div style={{
                      color: '#1E293B',
                      fontWeight: '500',
                      fontSize: '13px',
                      textAlign: 'center',
                      marginTop: '8px',
                      fontStyle: 'italic'
                    }}>
                    {curso.instructor}
                  </div>
                )}
                  <div style={{
                    color: '#FF6B35',
                    fontWeight: '600',
                    fontSize: '16px',
                    marginTop: '8px'
                  }}>
                  {curso.precio === 'Gratis' ? 'Gratis' : (curso.precio ? `$${curso.precio}` : 'Gratis')}
                </div>
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            color: '#64748B',
            fontSize: '18px'
          }}>
            Disfruta de nuestras materias especiales con maestros expertos.
          </div>
        )}
      </section>

      {/* BENEFICIOS - Integrado */}
      <section style={{ 
        width: '100%', 
        padding: '80px 24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '40px' 
      }}>
        <h2 style={{ 
          color: '#1E293B', 
          fontWeight: '800', 
          fontSize: '28px', 
          marginBottom: '30px', 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          ¿Por qué MindSchool?
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%'
        }}>
          {beneficios.map((b, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              padding: '20px',
              background: 'rgba(30, 41, 59, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(30, 41, 59, 0.1)',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)',
              minHeight: '70px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.15)';
              e.target.style.borderColor = '#FF6B35';
              e.target.style.background = 'rgba(30, 41, 59, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = 'rgba(30, 41, 59, 0.1)';
              e.target.style.background = 'rgba(30, 41, 59, 0.05)';
            }}
            >
              <div style={{
                fontSize: '28px',
                filter: 'none',
                minWidth: '36px',
                textAlign: 'center'
              }}>
                {b.icon}
              </div>
              <span style={{ 
                color: '#1E293B', 
                fontSize: '15px', 
                fontWeight: '500',
                lineHeight: '1.4'
              }}>
                {b.texto}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE NOSOTROS - Integrado */}
      <section
        style={{
          width: "100%",
          padding: "80px 24px",
          display: "flex",
          flexDirection: "row",
          gap: "60px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap"
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
              background: "#FF6B35",
              borderRadius: "12px",
              border: "1px solid #333333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: "600",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
            Foto del equipo
            </span>
          </div>
        </div>
        <div
          style={{
            flex: 2,
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: 1.6,
          }}
        >
          <h2
            style={{
              color: "#FF6B35",
              fontWeight: "700",
              fontSize: "28px",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
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
          boxShadow: "0 2px 12px #FF6B3522",
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
              boxShadow: "0 4px 24px #FF6B3533",
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
          <h2 style={{ color: "#000000", fontWeight: 700, fontSize: 24, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
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
                background: "#FF6B35",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontWeight: 600,
                fontSize: 16,
                cursor: enviando ? "not-allowed" : "pointer",
                marginTop: 6,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
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
            background: "linear-gradient(90deg, #FF6B35 0%, #E55A2B 100%)",
            border: "none",
            borderRadius: "50%",
            width: 64,
            height: 64,
            boxShadow: "0 4px 18px #FF6B3544",
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
        <style>{`@keyframes eggPulse { 0%{box-shadow:0 0 0 #FF6B3500;} 100%{box-shadow:0 0 24px #FF6B35aa;} }`}</style>
     </div>
     
     {showEgg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInEgg 0.5s",
          }}
          onClick={() => setShowEgg(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              boxShadow: "0 8px 32px #FF6B3555",
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
                color: "#FF6B35",
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
                background: "#FF6B35",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 24px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px #FF6B3533",
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
          background: "#000000",
          color: "#FFFFFF",
          padding: "32px 0 18px 0",
          marginTop: 48,
          textAlign: "center",
          borderTop: "2px solid #333333",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Hecho con <span style={{ color: "#FF6B35", fontSize: 22, verticalAlign: "middle" }}>♥</span> para la educación
       </div>
        <div style={{ fontSize: 15, marginBottom: 12 }}>
         &copy; {new Date().getFullYear()} MindSchool. Todos los derechos reservados.
       </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", fontSize: 15 }}>
          <a href="/aviso-legal" style={{ color: "#FF6B35", textDecoration: "none" }}>Aviso legal</a>
          <a href="/privacidad" style={{ color: "#FF6B35", textDecoration: "none" }}>Política de privacidad</a>
          <a href="#contacto" style={{ color: "#FF6B35", textDecoration: "none" }}>Contacto</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6B35", textDecoration: "none" }}>Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6B35", textDecoration: "none" }}>Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6B35", textDecoration: "none" }}>Instagram</a>
       </div>
     </footer>
      </div>
    </div>
  );
};

export default Bienvenida;