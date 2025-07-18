import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

const ProfesorPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/profesor/pagos");
        setPagos(res.data.pagos || []);
      } catch (e) {
        setError("Error al cargar los pagos");
      } finally {
        setLoading(false);
      }
    };
    fetchPagos();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2>Pagos recibidos</h2>
      {loading && <p>Cargando pagos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && pagos.length === 0 && <p>No hay pagos registrados.</p>}
      {!loading && pagos.length > 0 && (
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Alumno
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Curso
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Monto
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Método
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Fecha
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Referencia
              </th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td style={{ padding: 8 }}>
                  {pago.usuario?.name || "Desconocido"}
                </td>
                <td style={{ padding: 8 }}>{pago.curso?.titulo || "Curso"}</td>
                <td style={{ padding: 8 }}>${pago.monto}</td>
                <td style={{ padding: 8 }}>{pago.metodo_pago}</td>
                <td style={{ padding: 8 }}>
                  {pago.fecha_pago
                    ? new Date(pago.fecha_pago).toLocaleString()
                    : ""}
                </td>
                <td style={{ padding: 8 }}>{pago.referencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProfesorPagos;
