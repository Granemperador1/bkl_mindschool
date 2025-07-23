import React, { useState, useRef, useEffect } from 'react';

const RESPUESTAS = [
  { pregunta: /hola|buenas/i, respuesta: '¡Hola! ¿En qué puedo ayudarte hoy?' },
  { pregunta: /registrar|registro/i, respuesta: 'Para registrarte, haz clic en el botón “Regístrate Gratis” en la página principal.' },
  { pregunta: /pago|comprar|precio/i, respuesta: 'Puedes pagar un curso desde la página del curso. Si tienes dudas sobre el proceso, dime el nombre del curso.' },
  { pregunta: /certificado/i, respuesta: 'Al completar un curso, puedes descargar tu certificado desde tu perfil.' },
  { pregunta: /contacto|soporte|ayuda/i, respuesta: 'Puedes contactarnos desde el formulario de la página de bienvenida o por WhatsApp.' },
  { pregunta: /gracias|thank/i, respuesta: '¡De nada! 😊 Si tienes otra pregunta, aquí estaré.' },
];

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! Soy el asistente de MindSchool. ¿En qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    // Buscar respuesta
    const found = RESPUESTAS.find(r => r.pregunta.test(input));
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: found ? found.respuesta : 'No entendí tu pregunta, pero puedes escribir “ayuda” para ver opciones.' }
      ]);
    }, 700);
    setInput('');
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 10000,
          background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 60,
          height: 60,
          boxShadow: '0 4px 18px #2563eb44',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
        }}
        title="Chat de ayuda"
      >
        🐱
      </button>
      {/* Widget de chat */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 104,
          right: 32,
          width: 340,
          maxWidth: '98vw',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 8px 32px #2563eb55',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ background: '#2563EB', color: '#fff', padding: '14px 18px', fontWeight: 700, fontSize: 18 }}><span style={{fontSize:22, marginRight:8}}>🐱</span>Chatbot MindSchool</div>
          <div ref={chatRef} style={{ flex: 1, padding: 16, maxHeight: 260, overflowY: 'auto', background: '#f3f4f6' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                marginBottom: 10,
                textAlign: msg.from === 'user' ? 'right' : 'left',
              }}>
                <span style={{
                  display: 'inline-block',
                  background: msg.from === 'user' ? '#2563EB' : '#fff',
                  color: msg.from === 'user' ? '#fff' : '#222',
                  borderRadius: 12,
                  padding: '8px 14px',
                  fontSize: 15,
                  maxWidth: '80%',
                  boxShadow: msg.from === 'user' ? '0 2px 8px #2563eb33' : '0 2px 8px #0001',
                }}>{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, border: 'none', outline: 'none', padding: 12, fontSize: 15, borderRadius: 0 }}
              autoFocus
            />
            <button type="submit" style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '0 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Enviar</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget; 