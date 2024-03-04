import axios from "axios";

const baseAPI = axios.create({
  baseURL: import.meta.env.REACT_APP_BASE_URL,
  timeout: 1000,
  responseType: "json",
  headers: { "Content-Type": "applictaion/json" },
  withCredentials: true,
});

export default baseAPI;
