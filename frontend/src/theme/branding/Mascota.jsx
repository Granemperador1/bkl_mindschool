import React, { useState } from "react";
import imagenMascota from "../../assets/videos/imagen_mascota.jpeg";
import videoBienvenida from "../../assets/videos/bienvenida.mp4";

const Mascota = ({
  width = 150,
  height = 150,
  showVideo = false,
  onVideoEnd = null,
  className = "",
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    if (onVideoEnd) onVideoEnd();
  };

  if (showVideo && isVideoPlaying) {
    return (
      <video
        width={width}
        height={height}
        autoPlay
        onEnded={handleVideoEnd}
        style={{ objectFit: "contain" }}
        className={className}
      >
        <source src={videoBienvenida} type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>
    );
  }

  return (
    <img
      src={imagenMascota}
      alt="Mascota MindSchool"
      width={width}
      height={height}
      style={{ objectFit: "contain", cursor: "pointer" }}
      onClick={() => setIsVideoPlaying(true)}
      className={className}
      loading="lazy"
    />
  );
};

export default Mascota;
