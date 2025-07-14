import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

// Componente que lanza un error para testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal component</div>;
};

// Mock de console.error para evitar ruido en tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('¡Ups! Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText(/Lo sentimos, ha ocurrido un error inesperado/)).toBeInTheDocument();
  });

  test('shows reload button', () => {
    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('🔄 Recargar página');
    expect(reloadButton).toBeInTheDocument();

    fireEvent.click(reloadButton);
    expect(reloadMock).toHaveBeenCalled();
  });

  test('shows go home button', () => {
    const navigateMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('🏠 Ir al inicio');
    expect(homeButton).toBeInTheDocument();

    fireEvent.click(homeButton);
    expect(window.location.href).toBe('/');
  });

  test('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const detailsButton = screen.getByText('Mostrar detalles del error');
    expect(detailsButton).toBeInTheDocument();

    fireEvent.click(detailsButton);
    expect(screen.getByText('Ocultar detalles')).toBeInTheDocument();

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  test('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Mostrar detalles del error')).not.toBeInTheDocument();

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  test('shows contact information', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Si el problema persiste, contacta a nuestro soporte técnico/)).toBeInTheDocument();
    expect(screen.getByText('soporte@mindschool.com')).toBeInTheDocument();
  });

  test('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  test('can toggle error details visibility', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const detailsButton = screen.getByText('Mostrar detalles del error');
    
    // Initially details should be hidden
    expect(screen.queryByText('Error:')).not.toBeInTheDocument();
    
    // Click to show details
    fireEvent.click(detailsButton);
    expect(screen.getByText('Error:')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    
    // Click to hide details
    fireEvent.click(screen.getByText('Ocultar detalles'));
    expect(screen.queryByText('Error:')).not.toBeInTheDocument();

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });
}); 