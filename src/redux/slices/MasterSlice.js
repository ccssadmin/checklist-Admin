import { createSlice } from "@reduxjs/toolkit";
import {
  fetchShifts,
  fetchDepartments,
  fetchRoles,
  fetchStatuses,
  fetchChecklistTypes,
  createChecklistType,
  fetchRecurrence,
  fetchPriorities,
} from "../Action/masterAction";

const initialState = {
  loading: false,
  error: null,
  priorities: [],
  shifts: [],
  departments: [],
  roles: [],
  statuses: [],
  checklistTypes: [],
  recurrenceList: [],
  createChecklistTypeLoading: false, // ✅ ADD
};

const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    clearDepartments(state) {
      state.departments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===============================
         FETCH SHIFTS
      ================================ */
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload?.data || [];
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         FETCH DEPARTMENTS
      ================================ */
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
   FETCH ROLES
================================ */
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload || [];
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
   FETCH STATUSES
================================ */
      .addCase(fetchStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload || [];
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
   FETCH CHECKLIST TYPES
================================ */
      .addCase(fetchChecklistTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklistTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.checklistTypes = action.payload || [];
      })
      .addCase(fetchChecklistTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
   CREATE CHECKLIST TYPE
================================ */
      .addCase(createChecklistType.pending, (state) => {
        state.createChecklistTypeLoading = true;
        state.error = null;
      })
      .addCase(createChecklistType.fulfilled, (state, action) => {
        state.createChecklistTypeLoading = false;

        // 🔥 Push new type to list (instant UI update)
        if (action.payload?.data) {
          state.checklistTypes.push(action.payload.data);
        }
      })
      .addCase(createChecklistType.rejected, (state, action) => {
        state.createChecklistTypeLoading = false;
        state.error = action.payload;
      })

      /* ===============================
   FETCH RECURRENCE
================================ */
      .addCase(fetchRecurrence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecurrence.fulfilled, (state, action) => {
        state.loading = false;
        state.recurrenceList = action.payload || [];
      })
      .addCase(fetchRecurrence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
   FETCH PRIORITIES
================================ */
      .addCase(fetchPriorities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriorities.fulfilled, (state, action) => {
        state.loading = false;

        // Optional: sort by priorityLevel
        state.priorities = (action.payload || []).sort(
          (a, b) => a.priorityLevel - b.priorityLevel,
        );
      })
      .addCase(fetchPriorities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDepartments } = masterSlice.actions;
export default masterSlice.reducer;
