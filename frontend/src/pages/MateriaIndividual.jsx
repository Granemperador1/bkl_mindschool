import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosConfig';

const MateriaIndividual = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [materia, setMateria] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [activeTab, setActiveTab] = useState('calendario');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCrearGrupoModal, setShowCrearGrupoModal] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: '',
    descripcion: '',
    capacidad_maxima: 20
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🎯 MateriaIndividual cargada con ID:', id);
    console.log('👤 Usuario:', user);
    fetchMateriaData();
  }, [id]);

  const fetchMateriaData = async () => {
    try {
      // Obtener datos de la materia
      const materiaResponse = await axios.get(`/cursos/${id}`);
      setMateria(materiaResponse.data.data);

      // Obtener grupos
      const gruposResponse = await axios.get(`/cursos/${id}/grupos`);
      setGrupos(gruposResponse.data.data || []);

      // Obtener alumnos
      const alumnosResponse = await axios.get(`/cursos/${id}/alumnos`);
      setAlumnos(alumnosResponse.data.data || []);

      // Obtener tareas
      const tareasResponse = await axios.get(`/cursos/${id}/tareas`);
      setTareas(tareasResponse.data.data || []);

    } catch (error) {
      console.error('❌ No se pudo cargar la materia de la base de datos:', error.message);
    }
  };

  const handleCrearGrupo = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`/cursos/${id}/grupos`, nuevoGrupo);
      console.log('✅ Grupo creado:', response.data);
      
      // Recargar los grupos
      await fetchMateriaData();
      
      // Limpiar formulario y cerrar modal
      setNuevoGrupo({ nombre: '', descripcion: '', capacidad_maxima: 20 });
      setShowCrearGrupoModal(false);
      
    } catch (error) {
      console.error('❌ Error al crear grupo:', error);
      alert('Error al crear el grupo. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoCall = (platform) => {
    const links = {
      'google-meet': 'https://meet.google.com/',
      'zoom': 'https://zoom.us/',
      'teams': 'https://teams.microsoft.com/'
    };
    window.open(links[platform], '_blank');
    setShowVideoModal(false);
  };

  if (!materia) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: '500'
      }}>
        Cargando materia...
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
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '30px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            marginRight: '20px'
          }}
        >
          ← Volver
        </button>
        
        <img 
          src={materia.imagen_url || 'https://via.placeholder.com/80x80'} 
          alt={materia.titulo}
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '10px',
            marginRight: '20px'
          }}
        />
        
        <div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#2c3e50',
            margin: '0 0 5px 0'
          }}>
            {materia.titulo}
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#7f8c8d',
            margin: '0'
          }}>
            {materia.descripcion || 'Descripción no disponible'}
          </p>
        </div>
        
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={() => setShowVideoModal(true)}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📹 Video Llamada
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #ecf0f1',
          marginBottom: '20px'
        }}>
          {['calendario', 'grupos', 'alumnos', 'tareas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '15px 25px',
                fontSize: '18px',
                fontWeight: '600',
                color: activeTab === tab ? '#3498db' : '#7f8c8d',
                borderBottom: activeTab === tab ? '3px solid #3498db' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          {activeTab === 'calendario' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>
                📅 Calendario de Clases
              </h3>
              <p style={{ fontSize: '16px', color: '#7f8c8d' }}>
                Aquí se mostrará el calendario de clases y eventos de la materia.
              </p>
            </div>
          )}

          {activeTab === 'grupos' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>
                  Grupos de la Materia
                </h3>
                <button 
                  onClick={() => setShowCrearGrupoModal(true)}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  ➕ Crear Grupo
                </button>
              </div>

              {grupos.length > 0 ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {grupos.map((grupo) => (
                    <div key={grupo.id} style={{
                      background: '#f8f9fa',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef'
                    }}>
                      <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                        {grupo.nombre}
                      </h4>
                      <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '15px' }}>
                        {grupo.descripcion}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#6c757d' }}>
                        <span>👥 {grupo.miembros?.length || 0} miembros</span>
                        <span>📊 Capacidad: {grupo.capacidad_maxima || 'Sin límite'}</span>
                        <span>🔑 Código: {grupo.codigo || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
                    No hay grupos disponibles
                  </h4>
                  <p style={{ fontSize: '16px', marginBottom: '30px' }}>
                    Aún no se han creado grupos para esta materia.
                  </p>
                  <button 
                    onClick={() => setShowCrearGrupoModal(true)}
                    style={{
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 auto'
                    }}
                  >
                    ➕ Crear Grupo
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alumnos' && (
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>
                Alumnos Inscritos ({alumnos.length})
              </h3>
              
              {alumnos.length > 0 ? (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {alumnos.map((alumno) => (
                    <div key={alumno.id} style={{
                      background: '#f8f9fa',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '5px' }}>
                          {alumno.name}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6c757d', margin: '0' }}>
                          {alumno.email}
                        </p>
                      </div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: '#e74c3c'
                      }}>
                        🔥 Racha: {alumno.racha_entregas || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>👨‍🎓</div>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
                    No hay alumnos inscritos
                  </h4>
                  <p style={{ fontSize: '16px' }}>
                    Aún no se han inscrito alumnos en esta materia.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tareas' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>
                  Tareas de la Materia
                </h3>
                <button 
                  style={{
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📝 Crear Tarea
                </button>
              </div>

              {tareas.length > 0 ? (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {tareas.map((tarea) => (
                    <div key={tarea.id} style={{
                      background: '#f8f9fa',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef'
                    }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                        {tarea.titulo}
                      </h4>
                      <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '15px' }}>
                        {tarea.descripcion}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#6c757d' }}>
                        <span>📅 Fecha límite: {tarea.fecha_limite || 'Sin fecha límite'}</span>
                        <span>📊 Tipo: {tarea.tipo || 'General'}</span>
                        <span>📎 Archivos: {tarea.archivos?.length || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
                    No hay tareas disponibles
                  </h4>
                  <p style={{ fontSize: '16px', marginBottom: '30px' }}>
                    Aún no se han creado tareas para esta materia.
                  </p>
                  <button 
                    style={{
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 auto'
                    }}
                  >
                    📝 Crear Tarea
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Video Llamada */}
      {showVideoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>
              🎥 Iniciar Video Llamada
            </h3>
            <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '30px' }}>
              Selecciona la plataforma para iniciar la video llamada:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                onClick={() => handleVideoCall('google-meet')}
                style={{
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                🎥 Google Meet
              </button>
              <button
                onClick={() => handleVideoCall('zoom')}
                style={{
                  background: '#2d8cff',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                🎥 Zoom
              </button>
              <button
                onClick={() => handleVideoCall('teams')}
                style={{
                  background: '#6264a7',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                🎥 Microsoft Teams
              </button>
            </div>
            <button
              onClick={() => setShowVideoModal(false)}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                marginTop: '20px'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Crear Grupo */}
      {showCrearGrupoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>
              ➕ Crear Nuevo Grupo
            </h3>
            
            <form onSubmit={handleCrearGrupo}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  marginBottom: '8px'
                }}>
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  value={nuevoGrupo.nombre}
                  onChange={(e) => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ej: Grupo A - Matemáticas"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  marginBottom: '8px'
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
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Describe el propósito del grupo..."
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  marginBottom: '8px'
                }}>
                  Capacidad Máxima
                </label>
                <input
                  type="number"
                  value={nuevoGrupo.capacidad_maxima}
                  onChange={(e) => setNuevoGrupo({...nuevoGrupo, capacidad_maxima: parseInt(e.target.value)})}
                  min="1"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
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
                    background: loading ? '#95a5a6' : '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
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
  );
};

export default MateriaIndividual; 