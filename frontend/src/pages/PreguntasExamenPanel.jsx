import React, { useState } from "react";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../theme/branding/branding";

const mockPreguntas = [
  {
    id: 1,
    examen_id: 1,
    pregunta: "¿Cuál es el resultado de 2 + 2?",
    tipo: "opcion_multiple",
    opciones: ["2", "3", "4", "5"],
    respuesta_correcta: "4",
    puntos: 1,
  },
  {
    id: 2,
    examen_id: 1,
    pregunta: "¿La tierra es plana?",
    tipo: "verdadero_falso",
    opciones: ["Verdadero", "Falso"],
    respuesta_correcta: "Falso",
    puntos: 1,
  },
];

const tiposPregunta = [
  { value: "opcion_multiple", label: "Opción Múltiple" },
  { value: "verdadero_falso", label: "Verdadero/Falso" },
  { value: "texto_libre", label: "Texto Libre" },
  { value: "emparejamiento", label: "Emparejamiento" },
  { value: "completar_espacios", label: "Completar Espacios" },
];

const PreguntasExamenPanel = () => {
  const [preguntas, setPreguntas] = useState(mockPreguntas);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    pregunta: "",
    tipo: "opcion_multiple",
    opciones: "",
    respuesta_correcta: "",
    puntos: 1,
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setError("");
    if (!form.pregunta || !form.tipo) {
      setError("La pregunta y el tipo son obligatorios");
      return;
    }
    let opcionesArr = [];
    if (
      form.tipo === "opcion_multiple" ||
      form.tipo === "verdadero_falso" ||
      form.tipo === "emparejamiento"
    ) {
      opcionesArr = form.opciones
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
      if (opcionesArr.length < 2) {
        setError("Debe haber al menos dos opciones");
        return;
      }
    }
    setPreguntas([
      ...preguntas,
      {
        id: Date.now(),
        examen_id: 1,
        pregunta: form.pregunta,
        tipo: form.tipo,
        opciones: opcionesArr,
        respuesta_correcta: form.respuesta_correcta,
        puntos: form.puntos,
      },
    ]);
    setShowForm(false);
    setForm({
      pregunta: "",
      tipo: "opcion_multiple",
      opciones: "",
      respuesta_correcta: "",
      puntos: 1,
    });
  };

  const handleDelete = (id) => {
    setPreguntas(preguntas.filter((p) => p.id !== id));
  };

  return (
    <div
      style={{
        padding: SPACING[8],
        background: COLORS.background,
        minHeight: "100vh",
        fontFamily: FONTS.main,
      }}
    >
      <h1
        style={{
          color: COLORS.primary,
          fontSize: FONT_SIZES["3xl"],
          fontWeight: FONT_WEIGHTS.bold,
          marginBottom: SPACING[6],
        }}
      >
        Preguntas del Examen
      </h1>
      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: SPACING[3],
          background: COLORS.primary,
          color: COLORS.surface,
          border: "none",
          borderRadius: BORDER_RADIUS.md,
          fontWeight: "600",
          marginBottom: SPACING[6],
          cursor: "pointer",
        }}
      >
        + Nueva Pregunta
      </button>
      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            background: COLORS.surface,
            padding: SPACING[6],
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.md,
            marginBottom: SPACING[8],
            maxWidth: 500,
          }}
        >
          <h2
            style={{
              color: COLORS.text,
              fontSize: FONT_SIZES.xl,
              fontWeight: FONT_WEIGHTS.medium,
              marginBottom: SPACING[4],
            }}
          >
            Crear Pregunta
          </h2>
          <input
            name="pregunta"
            placeholder="Pregunta"
            value={form.pregunta}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {tiposPregunta.map((tp) => (
              <option key={tp.value} value={tp.value}>
                {tp.label}
              </option>
            ))}
          </select>
          {(form.tipo === "opcion_multiple" ||
            form.tipo === "verdadero_falso" ||
            form.tipo === "emparejamiento") && (
            <input
              name="opciones"
              placeholder="Opciones separadas por coma"
              value={form.opciones}
              onChange={handleInputChange}
              style={{
                width: "100%",
                marginBottom: SPACING[3],
                padding: SPACING[3],
                borderRadius: BORDER_RADIUS.md,
                border: `1px solid ${COLORS.border}`,
              }}
            />
          )}
          <input
            name="respuesta_correcta"
            placeholder="Respuesta correcta"
            value={form.respuesta_correcta}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          />
          <input
            type="number"
            name="puntos"
            placeholder="Puntos"
            value={form.puntos}
            onChange={handleInputChange}
            style={{
              width: "100%",
              marginBottom: SPACING[3],
              padding: SPACING[3],
              borderRadius: BORDER_RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
            min={1}
          />
          {error && (
            <div style={{ color: COLORS.error, marginBottom: SPACING[3] }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              padding: SPACING[3],
              background: COLORS.success,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{
              marginLeft: SPACING[4],
              padding: SPACING[3],
              background: COLORS.error,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </form>
      )}
      <table
        style={{
          width: "100%",
          background: COLORS.surface,
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.md,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: COLORS.surfaceLight }}>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Pregunta
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>Tipo</th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Opciones
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Respuesta Correcta
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Puntos
            </th>
            <th style={{ padding: SPACING[4], color: COLORS.primary }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {preguntas.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: SPACING[4] }}>{p.pregunta}</td>
              <td style={{ padding: SPACING[4] }}>
                {tiposPregunta.find((tp) => tp.value === p.tipo)?.label ||
                  p.tipo}
              </td>
              <td style={{ padding: SPACING[4] }}>
                {Array.isArray(p.opciones) ? p.opciones.join(", ") : ""}
              </td>
              <td style={{ padding: SPACING[4] }}>{p.respuesta_correcta}</td>
              <td style={{ padding: SPACING[4] }}>{p.puntos}</td>
              <td style={{ padding: SPACING[4] }}>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    background: COLORS.error,
                    color: COLORS.surface,
                    border: "none",
                    borderRadius: BORDER_RADIUS.sm,
                    padding: SPACING[2],
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreguntasExamenPanel;
