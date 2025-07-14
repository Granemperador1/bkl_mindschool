import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

/**
 * Componente de paginación reutilizable
 *
 * Características:
 * - Navegación entre páginas
 * - Botones de primera/última página
 * - Indicador de página actual
 * - Diseño responsive
 * - Modo oscuro/claro
 * - Accesibilidad
 */
const Paginacion = ({
  paginaActual,
  totalPaginas,
  onCambioPagina,
  isDarkMode = false,
  mostrarPrimeraUltima = true,
  maximoElementos = 5,
}) => {
  /**
   * Genera los números de página a mostrar
   */
  const generarElementosPaginacion = () => {
    const elementos = [];
    const mitad = Math.floor(maximoElementos / 2);

    let inicio = Math.max(1, paginaActual - mitad);
    let fin = Math.min(totalPaginas, inicio + maximoElementos - 1);

    // Ajustar si estamos cerca del final
    if (fin - inicio < maximoElementos - 1) {
      inicio = Math.max(1, fin - maximoElementos + 1);
    }

    // Agregar primera página si no está incluida
    if (inicio > 1 && mostrarPrimeraUltima) {
      elementos.push(
        <BootstrapPagination.Item
          key="first"
          onClick={() => onCambioPagina(1)}
          className={isDarkMode ? "text-light" : ""}
        >
          <FaAngleDoubleLeft />
        </BootstrapPagination.Item>,
      );
    }

    // Agregar botón anterior
    elementos.push(
      <BootstrapPagination.Prev
        key="prev"
        onClick={() => onCambioPagina(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className={isDarkMode ? "text-light" : ""}
      >
        <FaChevronLeft />
      </BootstrapPagination.Prev>,
    );

    // Agregar números de página
    for (let i = inicio; i <= fin; i++) {
      elementos.push(
        <BootstrapPagination.Item
          key={i}
          active={i === paginaActual}
          onClick={() => onCambioPagina(i)}
          className={isDarkMode ? "text-light" : ""}
        >
          {i}
        </BootstrapPagination.Item>,
      );
    }

    // Agregar botón siguiente
    elementos.push(
      <BootstrapPagination.Next
        key="next"
        onClick={() => onCambioPagina(Math.min(totalPaginas, paginaActual + 1))}
        disabled={paginaActual === totalPaginas}
        className={isDarkMode ? "text-light" : ""}
      >
        <FaChevronRight />
      </BootstrapPagination.Next>,
    );

    // Agregar última página si no está incluida
    if (fin < totalPaginas && mostrarPrimeraUltima) {
      elementos.push(
        <BootstrapPagination.Item
          key="last"
          onClick={() => onCambioPagina(totalPaginas)}
          className={isDarkMode ? "text-light" : ""}
        >
          <FaAngleDoubleRight />
        </BootstrapPagination.Item>,
      );
    }

    return elementos;
  };

  /**
   * Obtiene información de la paginación
   */
  const obtenerInformacionPaginacion = () => {
    return {
      paginaActual,
      totalPaginas,
      hayAnterior: paginaActual > 1,
      haySiguiente: paginaActual < totalPaginas,
    };
  };

  // No mostrar paginación si solo hay una página
  if (totalPaginas <= 1) {
    return null;
  }

  const info = obtenerInformacionPaginacion();

  return (
    <div className={`paginacion-container ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Información de paginación */}
      <div
        className={`text-center mb-2 ${isDarkMode ? "text-light" : "text-muted"}`}
      >
        <small>
          Página {paginaActual} de {totalPaginas}
        </small>
      </div>

      {/* Controles de paginación */}
      <BootstrapPagination
        className={`justify-content-center ${isDarkMode ? "pagination-dark" : ""}`}
        size="lg"
      >
        {generarElementosPaginacion()}
      </BootstrapPagination>

      {/* Navegación rápida para pantallas grandes */}
      <div className="d-none d-md-flex justify-content-center mt-3">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-outline-secondary btn-sm ${isDarkMode ? "text-light border-secondary" : ""}`}
            onClick={() => onCambioPagina(1)}
            disabled={!info.hayAnterior}
            title="Ir a la primera página"
          >
            Primera
          </button>

          <button
            type="button"
            className={`btn btn-outline-secondary btn-sm ${isDarkMode ? "text-light border-secondary" : ""}`}
            onClick={() => onCambioPagina(Math.max(1, paginaActual - 10))}
            disabled={!info.hayAnterior}
            title="Retroceder 10 páginas"
          >
            -10
          </button>

          <button
            type="button"
            className={`btn btn-outline-secondary btn-sm ${isDarkMode ? "text-light border-secondary" : ""}`}
            onClick={() =>
              onCambioPagina(Math.min(totalPaginas, paginaActual + 10))
            }
            disabled={!info.haySiguiente}
            title="Avanzar 10 páginas"
          >
            +10
          </button>

          <button
            type="button"
            className={`btn btn-outline-secondary btn-sm ${isDarkMode ? "text-light border-secondary" : ""}`}
            onClick={() => onCambioPagina(totalPaginas)}
            disabled={!info.haySiguiente}
            title="Ir a la última página"
          >
            Última
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paginacion;
