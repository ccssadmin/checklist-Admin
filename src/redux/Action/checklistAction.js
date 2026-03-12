import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosinstance from "../../api/axiosinstance";

export const fetchMyAssignments = createAsyncThunk(
  "assignments/fetchMyAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(
        "/checklist/my-assignments-full",
      );

      return response.data.data; // ✅ return full data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments",
      );
    }
  },
);

// Create Assignment
export const createAssignment = createAsyncThunk(
  "assignments/createAssignment",
  async (data, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const userId = state.auth.user?.userId; // ✅ same as template
      const organizationId = state.auth.organizationId; // ✅ same as template

      if (!userId || !organizationId) {
        throw new Error("UserId or OrganizationId missing from auth state");
      }

      const finalPayload = {
        ...data,
        createdBy: userId,
        organizationId: organizationId,
      };

      console.log("🚀 ASSIGNMENT FINAL PAYLOAD:", finalPayload);

      const response = await axiosinstance.post(
        "/checklist/template/assign",
        finalPayload,
      );

      return JSON.parse(response.data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to create assignment",
      );
    }
  },
);
