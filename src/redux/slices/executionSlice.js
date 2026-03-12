import {
  fetchExecutionQuestionAnswers,
  fetchExecutionDetailsById,
  approveExecution,
  rejectExecution,
} from "../Action/executionAction";
import { createSlice } from "@reduxjs/toolkit";

const executionSlice = createSlice({
  name: "execution",
  initialState: {
    loading: false,
    approveLoading: false,
    executionData: [],
    executionDetails: null,
    error: null,
  },
  reducers: {
    clearExecutionState: (state) => {
      state.loading = false;
      state.error = null;
      state.executionDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔥 Fetch list
      .addCase(fetchExecutionQuestionAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExecutionQuestionAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.executionData = action.payload.data;
      })
      .addCase(fetchExecutionQuestionAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 Fetch single execution
      .addCase(fetchExecutionDetailsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExecutionDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.executionDetails = action.payload.data?.[0] || null;
      })
      .addCase(fetchExecutionDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 Approve
      .addCase(approveExecution.pending, (state) => {
        state.approveLoading = true;
      })
      .addCase(approveExecution.fulfilled, (state, action) => {
        state.approveLoading = false;

        const index = state.executionData.findIndex(
          (item) => item.executionId === action.payload.executionId,
        );

        if (index !== -1) {
          state.executionData[index].approvalStatus = "APPROVED";
        }

        state.executionDetails = null;
      })
      .addCase(approveExecution.rejected, (state, action) => {
        state.approveLoading = false;
        state.error = action.payload;
      })

      // 🔥 Reject
      .addCase(rejectExecution.pending, (state) => {
        state.approveLoading = true;
      })
      .addCase(rejectExecution.fulfilled, (state, action) => {
        state.approveLoading = false;

        const index = state.executionData.findIndex(
          (item) => item.executionId === action.payload.executionId,
        );

        if (index !== -1) {
          state.executionData[index].approvalStatus = "REJECTED";
        }

        state.executionDetails = null;
      })
      .addCase(rejectExecution.rejected, (state, action) => {
        state.approveLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearExecutionState } = executionSlice.actions;
export default executionSlice.reducer;
