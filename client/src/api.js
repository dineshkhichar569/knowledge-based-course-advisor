import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export const getCatalog = () => API.get("/catalog").then(r => r.data);
export const decide = (backs) => API.post("/decide", { backs }).then(r => r.data);
export const why = (course, backs) => API.post("/why", { course, backs }).then(r => r.data);
