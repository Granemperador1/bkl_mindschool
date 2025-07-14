import React, { useState } from "react";

const GestionAlumnosCurso = ({
  alumnos = [],
  onInvitar,
  onGenerarCodigo,
  onAgregarManual,
  codigoInvitacion,
}) => {
  const [emailInvitar, setEmailInvitar] = useState("");
  const [emailManual, setEmailManual] = useState("");

  return (
    <div className="gestion-alumnos-curso">
      <h2>Alumnos inscritos</h2>
      <ul>
        {alumnos.length === 0 && <li>No hay alumnos inscritos.</li>}
        {alumnos.map((alumno) => (
          <li key={alumno.id}>
            {alumno.name} ({alumno.email}) - <b>{alumno.tipo_acceso}</b>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Invitar alumno por correo</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onInvitar(emailInvitar);
          setEmailInvitar("");
        }}
      >
        <input
          type="email"
          placeholder="Correo del alumno"
          value={emailInvitar}
          onChange={(e) => setEmailInvitar(e.target.value)}
          required
        />
        <button type="submit">Invitar</button>
      </form>

      <hr />

      <h3>Generar código de invitación</h3>
      <button onClick={onGenerarCodigo}>Generar código</button>
      {codigoInvitacion && (
        <div>
          <span>
            <b>Código:</b> {codigoInvitacion}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(codigoInvitacion)}
          >
            Copiar
          </button>
        </div>
      )}

      <hr />

      <h3>Agregar alumno manualmente</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAgregarManual(emailManual);
          setEmailManual("");
        }}
      >
        <input
          type="email"
          placeholder="Correo del alumno"
          value={emailManual}
          onChange={(e) => setEmailManual(e.target.value)}
          required
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default GestionAlumnosCurso;
