// src/redux/reschedule/rescheduleSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRescheduleRequests,
  approveReschedule,
  rejectReschedule,
} from "../Action/rescheduleAction";

const initialState = {
  requests: [],
  loading: false,
  error: null,
};

const rescheduleSlice = createSlice({
  name: "reschedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchRescheduleRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRescheduleRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRescheduleRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* APPROVE */
      .addCase(approveReschedule.fulfilled, (state, action) => {
        const id = action.payload;

        const request = state.requests.find((r) => r.assignmentId === id);

        if (request) {
          request.status = "APPROVED";
        }
      })

      /* REJECT */
      .addCase(rejectReschedule.fulfilled, (state, action) => {
        const id = action.payload;

        const request = state.requests.find((r) => r.assignmentId === id);

        if (request) {
          request.status = "REJECTED";
        }
      });
  },
});

export default rescheduleSlice.reducer;
