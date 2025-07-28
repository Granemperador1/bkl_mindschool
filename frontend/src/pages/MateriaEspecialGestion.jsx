import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosConfig';

const MateriaEspecialGestion = () => {
  const { materiaNombre } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCrearGrupoModal, setShowCrearGrupoModal] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: '',
    descripcion: '',
    max_estudiantes: 25
  });

  useEffect(() => {
    cargarDatosMateriaEspecial();
  }, [materiaNombre]);

  const cargarDatosMateriaEspecial = async () => {
    try {
      setLoading(true);
      // Buscar o crear el curso especial para esta materia
      const cursoEspecial = await buscarOCrearCursoEspecial();
      if (cursoEspecial) {
        // Cargar grupos del curso especial
        const gruposResponse = await axios.get(`/cursos/${cursoEspecial.id}/grupos`);
        setGrupos(gruposResponse.data.data || []);
      }
    } catch (error) {
      console.error('❌ Error cargando datos de materia especial:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarOCrearCursoEspecial = async () => {
    try {
      // Buscar si ya existe un curso para esta materia especial
      const response = await axios.get('/cursos', {
        params: {
          titulo: materiaNombre,
          instructor_id: user.id
        }
      });
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      // Si no existe, crear el curso especial
      const nuevoCurso = await axios.post('/cursos', {
        titulo: materiaNombre,
        descripcion: `Materia especial: ${materiaNombre}`,
        duracion: 120, // 2 horas por defecto
        nivel: 'intermedio',
        precio: 0,
        estado: 'activo',
        instructor_id: user.id
      });
      return nuevoCurso.data.data;
    } catch (error) {
      console.error('❌ Error buscando/creando curso especial:', error);
      return null;
    }
  };

  const handleCrearGrupo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Buscar el curso especial
      const cursoEspecial = await buscarOCrearCursoEspecial();
      if (cursoEspecial) {
        const response = await axios.post(`/cursos/${cursoEspecial.id}/grupos`, nuevoGrupo);
        await cargarDatosMateriaEspecial();
        setNuevoGrupo({ nombre: '', descripcion: '', max_estudiantes: 25 });
        setShowCrearGrupoModal(false);
      }
    } catch (error) {
      console.error('❌ Error al crear grupo:', error);
      alert('Error al crear el grupo. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: '500'
      }}>
        Cargando gestión de {decodeURIComponent(materiaNombre)}...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <button
          onClick={() => navigate('/profesor')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#3498db', 
            fontSize: '18px', 
            cursor: 'pointer', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Volver al Panel
        </button>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#2c3e50',
          margin: '0 0 10px 0',
          textAlign: 'center'
        }}>
          🎓 {decodeURIComponent(materiaNombre)}
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#7f8c8d',
          margin: '0',
          textAlign: 'center'
        }}>
          Materia Especial - Gestión de Grupos
        </p>
      </div>

      {/* Contenido Principal: Solo Grupos */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: '#2c3e50',
          margin: '0 0 30px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          👥 Grupos de Trabajo
        </h2>
        {grupos.length > 0 && (
          <div style={{ textAlign: 'right', marginBottom: '30px' }}>
            <button 
              onClick={() => setShowCrearGrupoModal(true)}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ➕ Crear Grupo
            </button>
          </div>
        )}
        {grupos.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {grupos.map((grupo) => (
              <div key={grupo.id} style={{
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      color: '#2c3e50',
                      margin: '0 0 10px 0'
                    }}>
                      {grupo.nombre}
                    </h3>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#6c757d',
                      margin: '0 0 15px 0'
                    }}>
                      {grupo.descripcion}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                                 <div style={{ 
                             background: '#e8f4fd',
                             padding: '8px 12px',
                             borderRadius: '6px',
                             fontSize: '14px',
                             fontWeight: '600',
                             color: '#3498db'
                           }}>
                             🔑 Código: {grupo.codigo_acceso}
                           </div>
                                                 <div style={{ 
                             background: '#e8f5e8',
                             padding: '8px 12px',
                             borderRadius: '6px',
                             fontSize: '14px',
                             fontWeight: '600',
                             color: '#27ae60'
                           }}>
                             👥 Alumnos: {grupo.miembros?.length || 0}/{grupo.max_estudiantes}
                           </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Gestionar
                    </button>
                    <button style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6c757d' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>👥</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#2c3e50' }}>
              No hay grupos creados
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '30px' }}>
              Crea el primer grupo para comenzar a gestionar esta materia especial.
            </p>
            {/* Mostrar el formulario de creación directamente */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 20px 0',
                color: '#2c3e50',
                textAlign: 'center'
              }}>
                ➕ Crear Nuevo Grupo
              </h2>
              <form onSubmit={handleCrearGrupo}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Nombre del Grupo *
                  </label>
                  <input
                    type="text"
                    value={nuevoGrupo.nombre}
                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Descripción
                  </label>
                  <textarea
                    value={nuevoGrupo.descripcion}
                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, descripcion: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    value={nuevoGrupo.max_estudiantes}
                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, max_estudiantes: parseInt(e.target.value)})}
                    min="1"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Creando...' : 'Crear Grupo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal para crear grupo si hay grupos existentes */}
        {showCrearGrupoModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 20px 0',
                color: '#2c3e50',
                textAlign: 'center'
              }}>
                ➕ Crear Nuevo Grupo
              </h2>
              <form onSubmit={handleCrearGrupo}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Nombre del Grupo *
                  </label>
                  <input
                    type="text"
                    value={nuevoGrupo.nombre}
                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Descripción
                  </label>
                  <textarea
                    value={nuevoGrupo.descripcion}
                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, descripcion: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    value={nuevoGrupo.max_estudiantes}
                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, max_estudiantes: parseInt(e.target.value)})}
                    min="1"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCrearGrupoModal(false)}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Creando...' : 'Crear Grupo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MateriaEspecialGestion; 