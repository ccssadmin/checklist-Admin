import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosinstance";

// FETCH ALL SHIFTS
export const fetchShifts = createAsyncThunk(
  "shift/fetchShifts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/master/shifts");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch shifts",
      );
    }
  },
);

// FETCH ALL DEPARTMENTS

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/master/departments");
      return res.data.data; // <-- array of departments
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch departments",
      );
    }
  },
);

// FETCH ALL ROLES
export const fetchRoles = createAsyncThunk(
  "master/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/master/roles");
      return res.data.data; // return only roles array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch roles",
      );
    }
  },
);

// FETCH ALL STATUSES
export const fetchStatuses = createAsyncThunk(
  "master/fetchStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/master/statuses");

      return res.data.data; // ✅ return only array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statuses",
      );
    }
  },
);

// FETCH CHECKLIST TYPES
export const fetchChecklistTypes = createAsyncThunk(
  "master/fetchChecklistTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/master/checklist-types");
      return res.data.data; // return only array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch checklist types",
      );
    }
  },
);

// CREATE CHECKLIST TYPE
// CREATE CHECKLIST TYPE
export const createChecklistType = createAsyncThunk(
  "master/createChecklistType",
  async (data, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const userId = state.auth.user?.userId;
      const organizationId = state.auth.organizationId;

      console.log("✅ Extracted userId:", userId);
      console.log("✅ Extracted organizationId:", organizationId);

      if (!userId || !organizationId) {
        throw new Error("UserId or OrganizationId missing from auth state");
      }

      const finalPayload = {
        ...data,
        checklistTypeId: null,
        organizationId,
        createdBy: userId,
      };

      console.log("🚀 FINAL CHECKLIST TYPE PAYLOAD:", finalPayload);

      const res = await axiosInstance.post(
        "/master/checklist-types",
        finalPayload,
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create checklist type",
      );
    }
  },
);

// FETCH RECURRENCE
export const fetchRecurrence = createAsyncThunk(
  "master/fetchRecurrence",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/master/recurrence");
      return res.data.data; // return only array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recurrence",
      );
    }
  },
);

// FETCH PRIORITIES
export const fetchPriorities = createAsyncThunk(
  "master/fetchPriorities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/master/priorities");
      return res.data.data; // return only array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch priorities",
      );
    }
  },
);
