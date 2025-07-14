import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../../hooks/useFormValidation';

describe('useFormValidation', () => {
  const initialValues = {
    email: '',
    password: '',
    name: ''
  };

  const validationRules = {
    email: ['required', 'email'],
    password: ['required', 'minLength:6'],
    name: ['required', 'minLength:2']
  };

  test('should initialize with initial values', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  test('should validate required fields', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toBe('Este campo es obligatorio');
  });

  test('should validate email format', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.handleChange('email', 'invalid-email');
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toBe('Email inválido');
  });

  test('should validate password minimum length', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.handleChange('password', '123');
      result.current.handleBlur('password');
    });

    expect(result.current.errors.password).toBe('Mínimo 6 caracteres');
  });

  test('should clear errors when validation passes', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    // First, create an error
    act(() => {
      result.current.handleChange('email', 'invalid');
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toBe('Email inválido');

    // Then, fix the error
    act(() => {
      result.current.handleChange('email', 'valid@email.com');
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toBeNull();
  });

  test('should validate form and return true when valid', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('name', 'John Doe');
    });

    const isValid = result.current.validateForm();
    expect(isValid).toBe(true);
  });

  test('should validate form and return false when invalid', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.handleChange('email', 'invalid-email');
      result.current.handleChange('password', '123');
    });

    const isValid = result.current.validateForm();
    expect(isValid).toBe(false);
    expect(result.current.errors.email).toBe('Email inválido');
    expect(result.current.errors.password).toBe('Mínimo 6 caracteres');
  });

  test('should reset form to initial values', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    expect(result.current.values.email).toBe('test@example.com');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  test('should check if form is valid', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationRules)
    );

    // Initially should be invalid (empty required fields)
    expect(result.current.isFormValid()).toBe(false);

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('name', 'John');
    });

    // Should be valid now
    expect(result.current.isFormValid()).toBe(true);
  });

  test('should handle custom validation rules', () => {
    const customRules = {
      age: [(value) => parseInt(value) >= 18 ? null : 'Debe ser mayor de edad']
    };

    const { result } = renderHook(() => 
      useFormValidation({ age: '' }, customRules)
    );

    act(() => {
      result.current.handleChange('age', '16');
      result.current.handleBlur('age');
    });

    expect(result.current.errors.age).toBe('Debe ser mayor de edad');

    act(() => {
      result.current.handleChange('age', '20');
      result.current.handleBlur('age');
    });

    expect(result.current.errors.age).toBeNull();
  });
}); 