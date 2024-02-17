import axios from "axios";
import config from "../config";

const axiosClient = axios.create({
  baseURL: config.API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers["Content-Type"] = "application/json";
  config.headers.Accept = "application/json";

  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});

const getRequest = (url, params) =>
  axiosClient
    .get(url, {
      params,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

const postRequest = (url, data) =>
  axiosClient
    .post(url, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

const putRequest = (url, data) =>
  axiosClient
    .put(url, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

const deleteRequest = (url) =>
  axiosClient
    .delete(url)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

export { getRequest, postRequest, putRequest, deleteRequest };
