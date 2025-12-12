import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:4000/api", // 백엔드 주소
  timeout: 5000,
});
export default API;
