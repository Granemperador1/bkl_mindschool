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
      

      {/* Estilos optimizados para móvil */}
      <style>{keyframes}
      {`
        /* Estilos base */
        .mobile-optimized {
          box-sizing: border-box;
        }
        
        /* Hero section responsive */
        .hero-section {
          min-height: 100vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        
        .hero-title {
          font-size: clamp(2rem, 8vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        
        .hero-subtitle {
          font-size: clamp(1rem, 4vw, 1.5rem);
          margin-bottom: 40px;
          max-width: 600px;
        }
        
        .hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 400px;
        }
        
        .hero-button {
          padding: 16px 32px;
          font-size: clamp(1rem, 4vw, 1.2rem);
          font-weight: 700;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .hero-button-primary {
          background: #FF6B35;
          color: #FFFFFF;
        }
        
        .hero-button-secondary {
          background: transparent;
          color: #FF6B35;
          border: 2px solid #FF6B35;
        }
        
        /* Cursos section responsive */
        .cursos-section {
          padding: 60px 20px;
        }
        
        .cursos-title {
          font-size: clamp(1.5rem, 6vw, 2.25rem);
          text-align: center;
          margin-bottom: 40px;
        }
        
        .cursos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .curso-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .curso-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.2);
        }
        
        .curso-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .curso-title {
          font-size: clamp(1rem, 4vw, 1.125rem);
          font-weight: 600;
          margin-bottom: 8px;
          color: #FFFFFF;
        }
        
        .curso-description {
          font-size: clamp(0.875rem, 3vw, 1rem);
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          margin-bottom: 12px;
        }
        
        .curso-instructor {
          font-size: clamp(0.75rem, 3vw, 0.875rem);
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }
        
        .curso-precio {
          font-size: clamp(0.875rem, 3vw, 1rem);
          color: #FF6B35;
          font-weight: 600;
          margin-top: 8px;
        }
        
        /* Beneficios section responsive */
        .beneficios-section {
          padding: 60px 20px;
          background: #FFFFFF;
        }
        
        .beneficios-title {
          font-size: clamp(1.5rem, 6vw, 2.25rem);
          text-align: center;
          margin-bottom: 40px;
          color: #1E293B;
        }
        
        .beneficios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .beneficio-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(30, 41, 59, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(30, 41, 59, 0.1);
          transition: all 0.3s ease;
        }
        
        .beneficio-icon {
          font-size: clamp(1.5rem, 5vw, 2rem);
          min-width: 40px;
        }
        
        .beneficio-text {
          font-size: clamp(0.875rem, 3vw, 1rem);
          color: #1E293B;
          font-weight: 500;
          line-height: 1.4;
        }
        
        /* Sobre nosotros section responsive */
        .sobre-section {
          padding: 60px 20px;
          background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
        }
        
        .sobre-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
          align-items: center;
        }
        
        .sobre-image {
          width: 200px;
          height: 200px;
          background: #FF6B35;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .sobre-content {
          text-align: center;
          color: #FFFFFF;
        }
        
        .sobre-title {
          font-size: clamp(1.5rem, 6vw, 2.25rem);
          color: #FF6B35;
          margin-bottom: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .sobre-text {
          font-size: clamp(0.875rem, 3vw, 1rem);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        
        /* Contacto section responsive */
        .contacto-section {
          padding: 40px 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .contacto-container {
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(255, 107, 53, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .contacto-video {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #222e3a;
        }
        
        .contacto-form {
          padding: 24px;
        }
        
        .contacto-title {
          font-size: clamp(1.25rem, 5vw, 1.5rem);
          color: #000000;
          margin-bottom: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }
        
        .contacto-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          margin-bottom: 12px;
          font-size: clamp(0.875rem, 3vw, 1rem);
        }
        
        .contacto-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          margin-bottom: 12px;
          font-size: clamp(0.875rem, 3vw, 1rem);
          resize: vertical;
          min-height: 80px;
        }
        
        .contacto-button {
          width: 100%;
          background: #FF6B35;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-weight: 600;
          font-size: clamp(0.875rem, 3vw, 1rem);
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Footer responsive */
        .footer {
          background: #000000;
          color: #FFFFFF;
          padding: 32px 20px 18px;
          text-align: center;
          border-top: 2px solid #333333;
        }
        
        .footer-heart {
          color: #FF6B35;
          font-size: 22px;
          vertical-align: middle;
        }
        
        .footer-text {
          font-size: clamp(0.875rem, 3vw, 1rem);
          margin-bottom: 12px;
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          font-size: clamp(0.75rem, 3vw, 0.875rem);
        }
        
        .footer-link {
          color: #FF6B35;
          text-decoration: none;
        }
        
        /* Easter egg responsive */
        .easter-egg-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          background: linear-gradient(90deg, #FF6B35 0%, #E55A2B 100%);
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          box-shadow: 0 4px 18px rgba(255, 107, 53, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: eggPulse 1.2s infinite alternate;
        }
        
        .easter-egg-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .easter-egg-content {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px 24px;
          max-width: 320px;
          width: 100%;
          text-align: center;
          animation: eggPop 0.7s cubic-bezier(.4,2,.6,1);
        }
        
        .easter-egg-message {
          color: #FF6B35;
          font-weight: 900;
          font-size: clamp(1.125rem, 4vw, 1.5rem);
          margin: 18px 0 8px 0;
        }
        
        .easter-egg-close {
          margin-top: 18px;
          background: #FF6B35;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          padding: 10px 24px;
          font-weight: 700;
          font-size: clamp(0.875rem, 3vw, 1rem);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
        }
        
        /* Animaciones */
        @keyframes eggPulse { 
          0% { box-shadow: 0 0 0 rgba(255, 107, 53, 0); } 
          100% { box-shadow: 0 0 24px rgba(255, 107, 53, 0.6); } 
        }
        
        @keyframes fadeInEgg { 
          0% { opacity: 0; } 
          100% { opacity: 1; } 
        }
        
        @keyframes eggPop { 
          0% { transform: scale(0.7); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
        
        /* Media queries específicos para móvil */
        @media (max-width: 768px) {
          .hero-section {
            padding: 16px;
            min-height: 90vh;
          }
          
          .hero-buttons {
            gap: 12px;
          }
          
          .hero-button {
            padding: 14px 24px;
          }
          
          .cursos-section,
          .beneficios-section,
          .sobre-section {
            padding: 40px 16px;
          }
          
          .cursos-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .beneficios-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .sobre-container {
            gap: 24px;
          }
          
          .sobre-image {
            width: 150px;
            height: 150px;
            font-size: 14px;
          }
          
          .contacto-section {
            padding: 20px 16px;
          }
          
          .contacto-container {
            border-radius: 12px;
          }
          
          .contacto-video {
            height: 150px;
          }
          
          .contacto-form {
            padding: 20px;
          }
          
          .footer {
            padding: 24px 16px 16px;
          }
          
          .footer-links {
            gap: 12px;
          }
          
          .easter-egg-button {
            width: 48px;
            height: 48px;
            bottom: 16px;
            right: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section {
            padding: 12px;
            min-height: 85vh;
          }
          
          .hero-title {
            margin-bottom: 16px;
          }
          
          .hero-subtitle {
            margin-bottom: 32px;
          }
          
          .cursos-section,
          .beneficios-section,
          .sobre-section {
            padding: 32px 12px;
          }
          
          .curso-card {
            padding: 16px;
          }
          
          .beneficio-item {
            padding: 16px;
          }
          
          .sobre-image {
            width: 120px;
            height: 120px;
            font-size: 12px;
          }
          
          .contacto-form {
            padding: 16px;
          }
          
          .easter-egg-button {
            width: 44px;
            height: 44px;
            bottom: 12px;
            right: 12px;
          }
        }
      `}</style>
      
      {/* PÁGINA COMPLETA OPTIMIZADA PARA MÓVIL */}
      <div className="mobile-optimized" style={{
        width: "100%",
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 25%, #334155 50%, #64748B 75%, #F8FAFC 100%)",
        minHeight: "100vh"
      }}>
        
        {/* HERO SECTION */}
        <section className="hero-section">
          {/* Background Brand */}
          <div style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            fontSize: "clamp(24px, 6vw, 48px)",
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
            padding: "0 20px",
            zIndex: 1,
            position: "relative"
          }}>
            {/* Main Slogan */}
            <div style={{ marginBottom: "40px" }}>
              <h1 className="hero-title" style={{ color: "#FFFFFF", margin: "0 0 8px 0" }}>
                ¡TRANSFORMA
              </h1>
              <h1 className="hero-title" style={{ color: "#FF6B35", margin: "0 0 8px 0" }}>
                TU FUTURO
              </h1>
              <h1 className="hero-title" style={{ color: "#FFFFFF", margin: "0" }}>
                HOY!
              </h1>
            </div>
            
            {/* Changing Phrases */}
            <div style={{
              marginBottom: "40px",
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <p className="hero-subtitle" style={{
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
            <div className="hero-buttons">
              <button 
                className="hero-button hero-button-primary"
                onClick={() => navigate('/registro')}
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
                className="hero-button hero-button-secondary"
                onClick={() => navigate('/login')}
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

      {/* CURSOS DESTACADOS - Optimizado para móvil */}
      <section className="cursos-section">
        <h2 className="cursos-title" style={{ color: '#FFFFFF' }}>
          Nuestros Cursos
        </h2>
        
        {cursosLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            color: '#FFFFFF',
            fontSize: '18px'
          }}>
            Cargando cursos...
          </div>
        ) : cursosDB.length > 0 ? (
          <div className="cursos-grid">
            {cursosDB.map((curso, idx) => (
              <div 
                key={curso.id || idx} 
                className="curso-card"
                onClick={() => navigate(`/curso/${curso.id}`)}
              >
                <img 
                  src={curso.imagen_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80"} 
                  alt={curso.nombre} 
                  className="curso-image"
                  loading="lazy" 
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                <div className="curso-title">
                  {curso.nombre}
                </div>
                <div className="curso-description">
                  {curso.descripcion || 'Descripción no disponible'}
                </div>
                {curso.instructor && (
                  <div className="curso-instructor">
                    {curso.instructor}
                  </div>
                )}
                <div className="curso-precio">
                  {curso.precio === 'Gratis' ? 'Gratis' : (curso.precio ? `$${curso.precio}` : 'Gratis')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            color: '#FFFFFF',
            fontSize: '18px'
          }}>
            Disfruta de nuestras materias especiales con maestros expertos.
          </div>
        )}
      </section>

      {/* BENEFICIOS - Optimizado para móvil */}
      <section className="beneficios-section">
        <h2 className="beneficios-title">
          ¿Por qué MindSchool?
        </h2>
        <div className="beneficios-grid">
          {beneficios.map((b, i) => (
            <div key={i} className="beneficio-item">
              <div className="beneficio-icon">
                {b.icon}
              </div>
              <span className="beneficio-text">
                {b.texto}
              </span>
            </div>
          ))}
        </div>
      </section>


      {/* SOBRE NOSOTROS - Optimizado para móvil */}
      <section className="sobre-section">
        <div className="sobre-container">
          <div className="sobre-image">
            Foto del equipo
          </div>
          <div className="sobre-content">
            <h2 className="sobre-title">
              Sobre MindSchool
            </h2>
            <p className="sobre-text">
              Somos un equipo multidisciplinario apasionado por la educación, la
              tecnología y la creatividad. En MindSchool, creemos en el poder de
              la comunidad y la innovación para transformar vidas y abrir nuevas
              oportunidades de aprendizaje para todos.
            </p>
            <p className="sobre-text">
              MindSchool nació del sueño de transformar la educación en una
              experiencia divertida, inclusiva y efectiva para todos. Nuestro
              equipo, apasionado por la innovación y el aprendizaje, ha trabajado
              incansablemente para crear una plataforma donde estudiantes y
              profesores puedan crecer juntos, compartir conocimientos y alcanzar
              sus metas.
            </p>
            <p className="sobre-text">
              Creemos que cada persona tiene un potencial único, y nuestra misión
              es ayudar a descubrirlo y potenciarlo a través de la tecnología, la
              creatividad y la comunidad.
            </p>
          </div>
        </div>
      </section>
       
     {/* CONTACTO - Optimizado para móvil */}
     <section id="contacto" className="contacto-section">
       <div className="contacto-container">
         {/* Video del gato que estudia */}
         <video
           src={gatoEstudio}
           autoPlay
           loop
           muted
           playsInline
           className="contacto-video"
         />
         {/* Formulario de contacto */}
         <div className="contacto-form">
           <h2 className="contacto-title">
             Contáctanos
           </h2>
           <form
             onSubmit={handleSubmitContacto}
             style={{ display: "flex", flexDirection: "column", gap: 14 }}
             autoComplete="off"
           >
             <input
               name="nombre"
               type="text"
               placeholder="Nombre"
               value={form.nombre}
               onChange={handleChange}
               required
               className="contacto-input"
             />
             <input
               name="email"
               type="email"
               placeholder="Email"
               value={form.email}
               onChange={handleChange}
               required
               className="contacto-input"
             />
             <input
               name="telefono"
               type="text"
               placeholder="Teléfono"
               value={form.telefono}
               onChange={handleChange}
               className="contacto-input"
             />
             <input
               name="asunto"
               type="text"
               placeholder="Asunto"
               value={form.asunto}
               onChange={handleChange}
               className="contacto-input"
             />
             <textarea
               name="mensaje"
               placeholder="Mensaje"
               value={form.mensaje}
               onChange={handleChange}
               required
               rows={3}
               className="contacto-textarea"
             />
             <button
               type="submit"
               disabled={enviando}
               className="contacto-button"
             >
               {enviando ? "Enviando..." : "Enviar"}
             </button>
             {exito && <div style={{ color: "#16a34a", fontWeight: 700 }}>{exito}</div>}
             {error && <div style={{ color: "#dc2626", fontWeight: 700 }}>{error}</div>}
           </form>
         </div>
       </div>
     </section>
     {/* Easter Egg - Optimizado para móvil */}
     <div className="easter-egg-button" onClick={handleShowEgg} title="¡Haz clic para una sorpresa!">
       <Mascota width={38} height={38} />
     </div>
     
     {showEgg && (
       <div className="easter-egg-modal" onClick={() => setShowEgg(false)}>
         <div className="easter-egg-content" onClick={(e) => e.stopPropagation()}>
           <Mascota width={80} height={80} showVideo={true} />
           <div className="easter-egg-message">
             {mensajeEgg}
           </div>
           <button className="easter-egg-close" onClick={() => setShowEgg(false)}>
             Cerrar
           </button>
         </div>
       </div>
     )}
     </div>
     
     {/* Footer - Optimizado para móvil */}
     <footer className="footer">
       <div className="footer-text" style={{ fontWeight: 600, marginBottom: 8 }}>
         Hecho con <span className="footer-heart">♥</span> para la educación
       </div>
       <div className="footer-text">
         &copy; {new Date().getFullYear()} MindSchool. Todos los derechos reservados.
       </div>
       <div className="footer-links">
         <a href="/aviso-legal" className="footer-link">Aviso legal</a>
         <a href="/privacidad" className="footer-link">Política de privacidad</a>
         <a href="#contacto" className="footer-link">Contacto</a>
         <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
         <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a>
         <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
       </div>
     </footer>
    </div>
  );
};

export default Bienvenida;
