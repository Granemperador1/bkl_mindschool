import { useState, useCallback } from 'react';

/**
 * Hook personalizado para validaciones en tiempo real
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @returns {Object} - Estado y funciones de validación
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reglas de validación predefinidas
  const defaultRules = {
    required: (value) => (!value || value.trim() === '') ? 'Este campo es obligatorio' : null,
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value) ? 'Email inválido' : null;
    },
    minLength: (min) => (value) => 
      value.length < min ? `Mínimo ${min} caracteres` : null,
    maxLength: (max) => (value) => 
      value.length > max ? `Máximo ${max} caracteres` : null,
    password: (value) => {
      return value.length < 8 
        ? 'La contraseña debe tener al menos 8 caracteres' 
        : null;
    },
    confirmPassword: (password) => (value) => 
      value !== password ? 'Las contraseñas no coinciden' : null,
    url: (value) => {
      try {
        new URL(value);
        return null;
      } catch {
        return 'URL inválida';
      }
    },
    numeric: (value) => isNaN(value) ? 'Debe ser un número' : null,
    positive: (value) => parseFloat(value) <= 0 ? 'Debe ser un número positivo' : null,
    date: (value) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? 'Fecha inválida' : null;
    },
    futureDate: (value) => {
      const date = new Date(value);
      const now = new Date();
      return date <= now ? 'La fecha debe ser futura' : null;
    }
  };

  // Validar un campo específico
  const validateField = useCallback((name, value) => {
    const fieldRules = validationRules[name] || [];
    let fieldError = null;

    for (const rule of fieldRules) {
      if (typeof rule === 'string' && defaultRules[rule]) {
        fieldError = defaultRules[rule](value);
      } else if (typeof rule === 'function') {
        fieldError = rule(value);
      } else if (typeof rule === 'object' && rule.type) {
        const validator = defaultRules[rule.type];
        if (validator) {
          fieldError = validator(rule.value || value)(value);
        }
      }

      if (fieldError) break;
    }

    return fieldError;
  }, [validationRules]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldError = validateField(fieldName, values[fieldName]);
      if (fieldError) {
        newErrors[fieldName] = fieldError;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  // Manejar cambios en campos
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar en tiempo real si el campo ha sido tocado
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [touched, validateField]);

  // Manejar blur (pérdida de foco)
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  }, [values, validateField]);

  // Resetear formulario
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Verificar si el formulario es válido
  const isFormValid = useCallback(() => {
    return Object.keys(errors).length === 0 && 
           Object.keys(validationRules).every(field => 
             values[field] && values[field].toString().trim() !== ''
           );
  }, [errors, validationRules, values]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    isFormValid,
    setValues,
    setErrors
  };
};

export default useFormValidation; 