import axios from "axios"

export const privateAxios = axios.create({
  baseURL: "https://yasin-youtube-clone.vercel.app/",
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