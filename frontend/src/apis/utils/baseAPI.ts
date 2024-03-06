import axios from "axios";
import { BASE_URL } from "../../constants/path";

const baseAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  responseType: "json",
  headers: { "Content-Type": "applictaion/json" },
  withCredentials: true,
});

export default baseAPI;
