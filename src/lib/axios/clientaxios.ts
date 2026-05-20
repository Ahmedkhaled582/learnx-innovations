
import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosInstance } from "axios";
const API_URL = "http://192.168.1.4:8080";
export const clientAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

clientAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

export default clientAxios;