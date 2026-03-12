import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosinstance.js";

// FETCH ALL TEMPLATES
export const fetchChecklistTemplates = createAsyncThunk(
  "template/fetchChecklistTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/checklist/template");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ======================================
   FETCH TEMPLATE BY ID
====================================== */
export const fetchChecklistTemplateById = createAsyncThunk(
  "template/fetchChecklistTemplateById",
  async (templateId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/checklist/template", {
        params: { templateId },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// SAVE TEMPLATE (CREATE / UPDATE) – keep as-is
export const saveChecklistTemplate = createAsyncThunk(
  "template/saveChecklistTemplate",
  async (data, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const userId = state.auth.user?.userId; // ✅ from user object
      const organizationId = state.auth.organizationId; // ✅ from root auth

      console.log("✅ Extracted userId:", userId);
      console.log("✅ Extracted organizationId:", organizationId);

      if (!userId || !organizationId) {
        throw new Error("UserId or OrganizationId missing from auth state");
      }

      const finalPayload = {
        ...data,
        createdBy: userId,
        organizationId: organizationId,
        approvedBy: null,
      };

      console.log("🚀 FINAL API PAYLOAD:", finalPayload);

      const response = await axiosInstance.post(
        "/checklist/template/save",
        finalPayload,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Save failed",
      );
    }
  },
);
