import { createSlice } from "@reduxjs/toolkit";
import { createAssignment, fetchMyAssignments } from "../Action/checklistAction";

const initialState = {
  assignments: [],
  loading: false,
  createLoading: false,
  error: null,
  successMessage: null,
};

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    clearAssignmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchMyAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createAssignment success and error cases
      .addCase(createAssignment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.createLoading = false;

        // Optional: push new assignment to list
        state.assignments.unshift(action.payload);

        state.successMessage = "Assignment created successfully";
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssignmentError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
