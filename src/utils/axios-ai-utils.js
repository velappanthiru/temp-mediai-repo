import axios from "axios";
import { getCookies, removeCookies } from "./cookies";


const aiBaseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_AI_URL,
});

// Todo: uncomment this and fix the document bug.
aiBaseAxios.interceptors.request.use(
  function (config) {
    const auth_token = getCookies();
    let token = "";
    if (auth_token) {
      token = JSON.parse(auth_token);
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token?.accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

aiBaseAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeCookies();

      setTimeout(() => {
        window.location.href = "/";
      }, 100); // Slight delay ensures execution

    }
    return Promise.reject(error);
  }
);

export default aiBaseAxios;
