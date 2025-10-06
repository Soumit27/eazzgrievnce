import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      // Ensure headers exist as AxiosHeaders
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      // Set the Authorization header safely
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getRequest = async <T>(url: string, config?: InternalAxiosRequestConfig) => {
  const res = await axiosInstance.get<T>(url, config);
  return res.data;
};

export const postRequest = async <T>(url: string, payload?: any, config?: InternalAxiosRequestConfig) => {
  const res = await axiosInstance.post<T>(url, payload, config);
  return res.data;
};

export const putRequest = async <T>(url: string, payload?: any, config?: InternalAxiosRequestConfig) => {
  const res = await axiosInstance.put<T>(url, payload, config);
  return res.data;
};

export const deleteRequest = async <T>(url: string, config?: InternalAxiosRequestConfig) => {
  const res = await axiosInstance.delete<T>(url, config);
  return res.data;
};




