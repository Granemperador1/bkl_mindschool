import api from "../utils/axiosConfig";

/**
 * Servicio para manejar todas las operaciones relacionadas con cursos
 *
 * Responsabilidades:
 * - Realizar peticiones HTTP a la API de cursos
 * - Manejar respuestas y errores
 * - Proporcionar métodos reutilizables para componentes
 * - Gestionar caché local cuando sea necesario
 */
class CursosServicio {
  /**
   * Obtiene listado paginado de cursos con filtros opcionales
   *
   * @param {Object} filtros - Filtros a aplicar
   * @param {string} filtros.nivel - Nivel del curso (principiante, intermedio, avanzado)
   * @param {number} filtros.instructor_id - ID del instructor
   * @param {number} filtros.precio_minimo - Precio mínimo
   * @param {number} filtros.precio_maximo - Precio máximo
   * @param {string} filtros.orden - Campo de ordenamiento
   * @param {string} filtros.direccion - Dirección del ordenamiento (asc/desc)
   * @returns {Promise<Object>} Respuesta con listado de cursos
   */
  async obtenerListado(filtros = {}) {
    try {
      const parametros = new URLSearchParams();

      // Agregar filtros a los parámetros de la URL
      Object.keys(filtros).forEach((clave) => {
        if (
          filtros[clave] !== null &&
          filtros[clave] !== undefined &&
          filtros[clave] !== ""
        ) {
          parametros.append(clave, filtros[clave]);
        }
      });

      const respuesta = await api.get(`/cursos?${parametros.toString()}`);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Cursos obtenidos exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al obtener listado de cursos");
    }
  }

  /**
   * Obtiene un curso específico por su ID
   *
   * @param {number} idCurso - ID del curso
   * @returns {Promise<Object>} Respuesta con datos del curso
   */
  async obtenerPorId(idCurso) {
    try {
      const respuesta = await api.get(`/cursos/${idCurso}`);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Curso obtenido exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al obtener el curso");
    }
  }

  /**
   * Crea un nuevo curso
   *
   * @param {Object} datosCurso - Datos del curso a crear
   * @returns {Promise<Object>} Respuesta con el curso creado
   */
  async crear(datosCurso) {
    try {
      const respuesta = await api.post("/cursos", datosCurso);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Curso creado exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al crear el curso");
    }
  }

  /**
   * Actualiza un curso existente
   *
   * @param {number} idCurso - ID del curso a actualizar
   * @param {Object} datosCurso - Datos a actualizar
   * @returns {Promise<Object>} Respuesta con el curso actualizado
   */
  async actualizar(idCurso, datosCurso) {
    try {
      const respuesta = await api.put(`/cursos/${idCurso}`, datosCurso);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Curso actualizado exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al actualizar el curso");
    }
  }

  /**
   * Elimina un curso
   *
   * @param {number} idCurso - ID del curso a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  async eliminar(idCurso) {
    try {
      await api.delete(`/cursos/${idCurso}`);
      return {
        exito: true,
        datos: null,
        mensaje: "Curso eliminado exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al eliminar el curso");
    }
  }

  /**
   * Busca cursos por término de búsqueda
   *
   * @param {string} termino - Término de búsqueda
   * @param {Object} filtros - Filtros adicionales
   * @returns {Promise<Object>} Respuesta con resultados de búsqueda
   */
  async buscar(termino, filtros = {}) {
    try {
      const parametros = new URLSearchParams({
        termino,
        ...filtros,
      });

      const respuesta = await api.get(
        `/cursos/buscar?${parametros.toString()}`,
      );
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Búsqueda completada exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al realizar la búsqueda");
    }
  }

  /**
   * Obtiene cursos populares
   *
   * @param {number} limite - Número máximo de cursos a obtener
   * @returns {Promise<Object>} Respuesta con cursos populares
   */
  async obtenerPopulares(limite = 10) {
    try {
      const respuesta = await api.get(`/cursos/populares?limite=${limite}`);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Cursos populares obtenidos exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al obtener cursos populares");
    }
  }

  /**
   * Obtiene estadísticas de cursos
   *
   * @returns {Promise<Object>} Respuesta con estadísticas
   */
  async obtenerEstadisticas() {
    try {
      const respuesta = await api.get("/cursos/estadisticas");
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Estadísticas obtenidas exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al obtener estadísticas");
    }
  }

  /**
   * Obtiene cursos por instructor
   *
   * @param {number} idInstructor - ID del instructor
   * @param {Object} filtros - Filtros adicionales
   * @returns {Promise<Object>} Respuesta con cursos del instructor
   */
  async obtenerPorInstructor(idInstructor, filtros = {}) {
    try {
      const parametros = new URLSearchParams({
        instructor_id: idInstructor,
        ...filtros,
      });

      const respuesta = await api.get(`/cursos?${parametros.toString()}`);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Cursos del instructor obtenidos exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al obtener cursos del instructor");
    }
  }

  /**
   * Inscribe a un usuario en un curso
   *
   * @param {number} idCurso - ID del curso
   * @param {Object} datosInscripcion - Datos de la inscripción
   * @returns {Promise<Object>} Respuesta con la inscripción creada
   */
  async inscribirse(idCurso, datosInscripcion = {}) {
    try {
      const respuesta = await api.post(
        `/cursos/${idCurso}/inscribirse`,
        datosInscripcion,
      );
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Inscripción realizada exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al realizar la inscripción");
    }
  }

  /**
   * Obtiene lecciones de un curso
   *
   * @param {number} idCurso - ID del curso
   * @returns {Promise<Object>} Respuesta con lecciones del curso
   */
  async obtenerLecciones(idCurso) {
    try {
      const respuesta = await api.get(`/cursos/${idCurso}/lecciones`);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Lecciones obtenidas exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al obtener lecciones del curso");
    }
  }

  /**
   * Obtiene tareas de un curso
   *
   * @param {number} idCurso - ID del curso
   * @returns {Promise<Object>} Respuesta con tareas del curso
   */
  async obtenerTareas(idCurso) {
    try {
      const respuesta = await api.get(`/cursos/${idCurso}/tareas`);
      return {
        exito: true,
        datos: respuesta.data,
        mensaje: "Tareas obtenidas exitosamente",
      };
    } catch (error) {
      return this.manejarError(error, "Error al obtener tareas del curso");
    }
  }

  /**
   * Maneja errores de las peticiones HTTP
   *
   * @param {Error} error - Error capturado
   * @param {string} mensajePredeterminado - Mensaje predeterminado
   * @returns {Object} Respuesta de error estandarizada
   */
  manejarError(error, mensajePredeterminado) {
    console.error("Error en CursosServicio:", error);

    let mensaje = mensajePredeterminado;
    let codigo = 500;

    if (error.response) {
      // Error de respuesta del servidor
      codigo = error.response.status;

      if (error.response.data && error.response.data.message) {
        mensaje = error.response.data.message;
      } else if (error.response.data && error.response.data.error) {
        mensaje = error.response.data.error;
      }

      // Mensajes específicos según el código de estado
      switch (codigo) {
        case 400:
          mensaje = "Datos de petición incorrectos";
          break;
        case 401:
          mensaje = "No autorizado. Inicia sesión nuevamente";
          break;
        case 403:
          mensaje = "No tienes permisos para realizar esta acción";
          break;
        case 404:
          mensaje = "El recurso solicitado no existe";
          break;
        case 422:
          mensaje = "Los datos proporcionados no son válidos";
          break;
        case 500:
          mensaje = "Error interno del servidor";
          break;
        default:
          mensaje = mensajePredeterminado;
      }
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      mensaje = "Error de conexión. Verifica tu conexión a internet";
      codigo = 0;
    } else {
      // Error en la configuración de la petición
      mensaje = "Error en la configuración de la petición";
      codigo = 0;
    }

    return {
      exito: false,
      datos: null,
      mensaje,
      codigo,
      errores: error.response?.data?.errors || null,
    };
  }

  /**
   * Valida datos de un curso antes de enviarlos
   *
   * @param {Object} datos - Datos a validar
   * @returns {Object} Resultado de la validación
   */
  validarDatosCurso(datos) {
    const errores = {};

    // Validar título
    if (!datos.titulo || datos.titulo.trim().length < 3) {
      errores.titulo = "El título debe tener al menos 3 caracteres";
    }

    // Validar descripción
    if (!datos.descripcion || datos.descripcion.trim().length < 10) {
      errores.descripcion = "La descripción debe tener al menos 10 caracteres";
    }

    // Validar duración
    if (!datos.duracion || datos.duracion < 1) {
      errores.duracion = "La duración debe ser al menos 1 minuto";
    }

    // Validar nivel
    const nivelesValidos = ["principiante", "intermedio", "avanzado"];
    if (!datos.nivel || !nivelesValidos.includes(datos.nivel)) {
      errores.nivel = "El nivel debe ser: principiante, intermedio o avanzado";
    }

    // Validar precio
    if (datos.precio < 0) {
      errores.precio = "El precio no puede ser negativo";
    }

    // Validar estado
    const estadosValidos = ["activo", "inactivo", "borrador"];
    if (!datos.estado || !estadosValidos.includes(datos.estado)) {
      errores.estado = "El estado debe ser: activo, inactivo o borrador";
    }

    return {
      esValido: Object.keys(errores).length === 0,
      errores,
    };
  }

  /**
   * Sanitiza datos de entrada
   *
   * @param {Object} datos - Datos a sanitizar
   * @returns {Object} Datos sanitizados
   */
  sanitizarDatos(datos) {
    return {
      titulo: datos.titulo?.trim() || "",
      descripcion: datos.descripcion?.trim() || "",
      duracion: parseInt(datos.duracion) || 0,
      nivel: datos.nivel?.toLowerCase() || "principiante",
      precio: parseFloat(datos.precio) || 0,
      estado: datos.estado?.toLowerCase() || "borrador",
      instructor_id: parseInt(datos.instructor_id) || null,
      categoria_id: datos.categoria_id ? parseInt(datos.categoria_id) : null,
      imagen_url: datos.imagen_url?.trim() || "",
      video_introduccion: datos.video_introduccion?.trim() || "",
      requisitos_previos: datos.requisitos_previos?.trim() || "",
      objetivos_aprendizaje: datos.objetivos_aprendizaje?.trim() || "",
      materiales_incluidos: datos.materiales_incluidos?.trim() || "",
    };
  }
}

// Exportar instancia única del servicio
export default new CursosServicio();
