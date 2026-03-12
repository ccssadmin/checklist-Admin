// redux/Action/executionAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosinstance";

// 🔥 Fetch Execution Question Answers
export const fetchExecutionQuestionAnswers = createAsyncThunk(
  "execution/fetchExecutionQuestionAnswers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/checklist/execution-question-answers",
      );

      return response.data; // your full JSON response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch execution data",
      );
    }
  },
);

// 🔥 Fetch Single Execution Details by executionId
export const fetchExecutionDetailsById = createAsyncThunk(
  "execution/fetchExecutionDetailsById",
  async (executionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/checklist/execution-question-answers?executionId=${executionId}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch execution details",
      );
    }
  },
);

// 🔥 Approve / Reject Execution
export const approveExecution = createAsyncThunk(
  "execution/approveExecution",
  async ({ executionId, remark }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/checklist/approve-execution?executionId=${executionId}&remark=${remark}`,
      );

      return {
        executionId,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update execution",
      );
    }
  },
);

// 🔥 Reject Execution
export const rejectExecution = createAsyncThunk(
  "execution/rejectExecution",
  async ({ executionId, remark }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/checklist/reject-execution?executionId=${executionId}&remark=${remark}`,
      );

      return {
        executionId,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject execution",
      );
    }
  },
);
