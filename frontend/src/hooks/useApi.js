import { useState, useEffect } from "react";
import api from "../utils/axiosConfig";

export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    method = "GET",
    body = null,
    dependencies = [],
    immediate = true,
  } = options;

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (method.toUpperCase()) {
        case "GET":
          response = await api.get(endpoint);
          break;
        case "POST":
          response = await api.post(endpoint, body);
          break;
        case "PUT":
          response = await api.put(endpoint, body);
          break;
        case "DELETE":
          response = await api.delete(endpoint);
          break;
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && endpoint) {
      execute();
    }
  }, [endpoint, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

export default useApi;
