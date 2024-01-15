import axios, { AxiosError, AxiosRequestHeaders } from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_APP_API_URL,
});

http.interceptors.request.use(
  async (config) => {
    const header = {
      Accept: "application/json",
    } as AxiosRequestHeaders;

    config.headers = header;
    return config;
  }
);

http.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const err = error as AxiosError;
    return await Promise.reject(error.response.data.message);
  }
);

export default http;
