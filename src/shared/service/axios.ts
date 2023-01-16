import axios from "axios"

export const privateAxios = axios.create({
    baseURL: "http://localhost:8080",
});

privateAxios.interceptors.request.use(
  (req: any) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);