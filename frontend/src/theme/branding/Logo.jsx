import React from "react";

const Logo = ({ fontSize = 38, color = "#3B82F6" }) => (
  <span
    style={{
      fontFamily: "Poppins, Inter, Segoe UI, Arial, sans-serif",
      fontWeight: 900,
      fontSize,
      color,
      letterSpacing: "2px",
      textShadow: "0 2px 8px rgba(59,130,246,0.15)",
      background: "linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block",
      transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), filter 0.4s",
      cursor: "pointer",
    }}
    className="mindschool-logo"
  >
    MindSchool
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;900&display=swap');
      .mindschool-logo:hover {
        transform: scale(1.08) rotate(-2deg);
        filter: drop-shadow(0 4px 16px #60A5FA88);
        animation: logoPulse 0.7s cubic-bezier(0.4,0,0.2,1);
      }
      @keyframes logoPulse {
        0% { transform: scale(1) rotate(0deg); }
        40% { transform: scale(1.13) rotate(-3deg); }
        70% { transform: scale(0.98) rotate(1deg); }
        100% { transform: scale(1.08) rotate(-2deg); }
      }
    `}</style>
  </span>
);

export default Logo;
