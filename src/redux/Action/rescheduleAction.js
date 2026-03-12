// src/redux/Action/rescheduleAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosinstance";

/* ================= FETCH ================= */

export const fetchRescheduleRequests = createAsyncThunk(
  "reschedule/fetchRescheduleRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/checklist/reschedule-requests",
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reschedule requests",
      );
    }
  },
);

/* ================= APPROVE ================= */

export const approveReschedule = createAsyncThunk(
  "reschedule/approveReschedule",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/checklist/approve-reschedule?assignmentId=${assignmentId}`,
      );

      return response.data.data.assignmentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve reschedule",
      );
    }
  },
);

/* ================= REJECT ================= */

export const rejectReschedule = createAsyncThunk(
  "reschedule/rejectReschedule",
  async ({ assignmentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/checklist/reject-reschedule?assignmentId=${assignmentId}`,
      );

      return response.data.data.assignmentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject reschedule",
      );
    }
  },
);
