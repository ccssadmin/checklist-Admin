import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://checklistapi.crestclimbers.com/api",
});

/* ================= REQUEST ================= */

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE ================= */

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "https://checklistapi.crestclimbers.com/api/auth/refresh-token",
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;

        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        toast.error("Session expired. Please login again.");

        localStorage.clear();

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
