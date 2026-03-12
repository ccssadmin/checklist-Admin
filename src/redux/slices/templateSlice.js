import { createSlice } from "@reduxjs/toolkit";
import {
  saveChecklistTemplate,
  fetchChecklistTemplates,
  fetchChecklistTemplateById,
} from "../Action/templateActions";

const initialState = {
  loading: false,
  error: null,

  // list API
  templates: [],

  // single template API
  templateById: null,

  // save API
  success: false,
  message: "",
  template: null,
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    resetTemplateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
      state.template = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         FETCH TEMPLATES
      ================================ */
      .addCase(fetchChecklistTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklistTemplates.fulfilled, (state, action) => {
        state.loading = false;

        const rawTemplates = action.payload?.data || [];

        state.templates = rawTemplates.map((t) => ({
          ...t,
          templateId: t.template_id,
          templateName: t.template_name,
        }));
      })

      .addCase(fetchChecklistTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch templates";
      })

      /* ===============================
         SAVE TEMPLATE
      ================================ */
      .addCase(saveChecklistTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveChecklistTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.template = action.payload.data?.[0] || null;
      })
      .addCase(saveChecklistTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save template";
        state.success = false;
      })

      /* ===============================
   FETCH TEMPLATE BY ID
================================ */
      .addCase(fetchChecklistTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.templateById = null;
      })
      .addCase(fetchChecklistTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.templateById = action.payload.data?.[0] || null;
      })
      .addCase(fetchChecklistTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch template";
        state.templateById = null;
      });
  },
});

export const { resetTemplateState } = templateSlice.actions;
export default templateSlice.reducer;
