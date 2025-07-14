import React, { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Componente de carga
const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
  >
    <CircularProgress />
  </Box>
);

// Lazy loading de páginas principales
export const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
export const AdminUsers = lazy(() => import('../pages/AdminUsers'));
export const AdminCourses = lazy(() => import('../pages/AdminCourses'));
export const ProfesorPanel = lazy(() => import('../pages/ProfesorPanel'));
export const EstudianteDashboard = lazy(() => import('../pages/EstudianteDashboard'));
export const CalificacionesPanel = lazy(() => import('../pages/CalificacionesPanel'));
export const ExamenesPanel = lazy(() => import('../pages/ExamenesPanel'));
export const AsistenciasPanel = lazy(() => import('../pages/AsistenciasPanel'));
export const RecursosPanel = lazy(() => import('../pages/RecursosPanel'));
export const MensajesPanel = lazy(() => import('../pages/MensajesPanel'));
export const ProfesorPagos = lazy(() => import('../pages/ProfesorPagos'));

// Componente wrapper para lazy loading
export const LazyComponent = ({ component: Component, ...props }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component {...props} />
  </Suspense>
);

// Hook personalizado para lazy loading
export const useLazyComponent = (importFn) => {
  const Component = lazy(importFn);
  
  return (props) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
}; 