import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosinstance";

// ==========================
// GET ALL USERS
// ==========================
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/checklistuser/get");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

// ==========================
// GET USER BY ID
// ==========================
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/checklistuser/get?userId=${userId}`,
      );

      // API returns array even for single user
      return response.data.data[0];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

// ==========================
// CREATE USER
// ==========================
// ==========================
// CREATE USER
// ==========================
export const createUser = createAsyncThunk(
  "users/createUser",
  async (data, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const userId = state.auth.user?.userId; // from login
      const organizationId = state.auth.organizationId; // from login

      console.log("✅ Extracted userId:", userId);
      console.log("✅ Extracted organizationId:", organizationId);

      if (!organizationId) {
        throw new Error("OrganizationId missing from auth state");
      }

      const finalPayload = {
        ...data,
        organizationId: organizationId, // ✅ dynamic
      };

      console.log("🚀 CREATE USER PAYLOAD:", finalPayload);

      const response = await axiosInstance.post(
        "/checklistuser/create",
        finalPayload,
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create user",
      );
    }
  },
);
