import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosinstance";

/* ================= LOGIN API ACTION ================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", loginData);

      const token = response.data?.token || response.data?.data?.token;
      const refreshToken =
        response.data?.refreshToken || response.data?.data?.refreshToken;

      const user = response.data?.user || response.data?.data?.user || null;

      if (!token) {
        throw new Error("Token missing from login response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { token, refreshToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/auth/refresh-token",
        {
          refreshToken: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newToken = response.data.token;
      const newRefreshToken = response.data.refreshToken;

      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      return rejectWithValue("Session expired");
    }
  },
);
