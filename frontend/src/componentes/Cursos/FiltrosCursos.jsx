import React from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { FaTimes, FaFilter } from "react-icons/fa";

/**
 * Componente para mostrar filtros avanzados de cursos
 *
 * Características:
 * - Filtros por nivel, precio, duración
 * - Diseño responsive
 * - Modo oscuro/claro
 * - Validación de rangos
 * - Botón para limpiar filtros
 */
const FiltrosCursos = ({ filtros, onChange, onLimpiar, isDarkMode }) => {
  /**
   * Maneja cambios en los campos de filtro
   */
  const manejarCambio = (campo, valor) => {
    onChange({ [campo]: valor });
  };

  /**
   * Verifica si hay filtros activos
   */
  const hayFiltrosActivos = () => {
    return Object.values(filtros).some(
      (valor) => valor !== "" && valor !== null && valor !== undefined,
    );
  };

  /**
   * Limpia todos los filtros
   */
  const limpiarFiltros = () => {
    onLimpiar();
  };

  return (
    <Card
      className={`mb-4 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
    >
      <Card.Header
        className={`d-flex justify-content-between align-items-center ${isDarkMode ? "bg-dark border-secondary" : ""}`}
      >
        <div className="d-flex align-items-center">
          <FaFilter className="me-2" />
          <span className="fw-bold">Filtros Avanzados</span>
        </div>

        {hayFiltrosActivos() && (
          <Button variant="outline-danger" size="sm" onClick={limpiarFiltros}>
            <FaTimes className="me-1" />
            Limpiar
          </Button>
        )}
      </Card.Header>

      <Card.Body>
        <Row>
          {/* Filtro por nivel */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">Nivel</Form.Label>
              <Form.Select
                value={filtros.nivel}
                onChange={(e) => manejarCambio("nivel", e.target.value)}
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              >
                <option value="">Todos los niveles</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Filtro por ordenamiento */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">Ordenar por</Form.Label>
              <Form.Select
                value={filtros.orden}
                onChange={(e) => manejarCambio("orden", e.target.value)}
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              >
                <option value="created_at">Fecha de creación</option>
                <option value="titulo">Título</option>
                <option value="precio">Precio</option>
                <option value="duracion">Duración</option>
                <option value="updated_at">Última actualización</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Filtro por dirección de ordenamiento */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">Dirección</Form.Label>
              <Form.Select
                value={filtros.direccion}
                onChange={(e) => manejarCambio("direccion", e.target.value)}
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Filtro por instructor */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">Instructor ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="ID del instructor"
                value={filtros.instructor_id}
                onChange={(e) => manejarCambio("instructor_id", e.target.value)}
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Filtro por precio mínimo */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">Precio mínimo ($)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={filtros.precio_minimo}
                onChange={(e) => manejarCambio("precio_minimo", e.target.value)}
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              />
            </Form.Group>
          </Col>

          {/* Filtro por precio máximo */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">Precio máximo ($)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                placeholder="999.99"
                value={filtros.precio_maximo}
                onChange={(e) => manejarCambio("precio_maximo", e.target.value)}
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              />
            </Form.Group>
          </Col>

          {/* Filtro por duración mínima */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">
                Duración mínima (min)
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="1"
                value={filtros.duracion_minima}
                onChange={(e) =>
                  manejarCambio("duracion_minima", e.target.value)
                }
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              />
            </Form.Group>
          </Col>

          {/* Filtro por duración máxima */}
          <Col md={6} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold">
                Duración máxima (min)
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="1000"
                value={filtros.duracion_maxima}
                onChange={(e) =>
                  manejarCambio("duracion_maxima", e.target.value)
                }
                className={
                  isDarkMode ? "bg-dark text-light border-secondary" : ""
                }
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Información de filtros activos */}
        {hayFiltrosActivos() && (
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Filtros activos:</strong>
              {filtros.nivel && ` Nivel: ${filtros.nivel}`}
              {filtros.precio_minimo &&
                ` Precio mínimo: $${filtros.precio_minimo}`}
              {filtros.precio_maximo &&
                ` Precio máximo: $${filtros.precio_maximo}`}
              {filtros.duracion_minima &&
                ` Duración mínima: ${filtros.duracion_minima}min`}
              {filtros.duracion_maxima &&
                ` Duración máxima: ${filtros.duracion_maxima}min`}
              {filtros.instructor_id &&
                ` Instructor ID: ${filtros.instructor_id}`}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FiltrosCursos;
