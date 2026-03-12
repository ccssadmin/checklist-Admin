import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, fetchUserById, createUser } from "../Action/userAction";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    userLoading: false,
    createLoading: false, // ✅ add
    error: null,
    successMessage: null, // ✅ add
  },

  reducers: {
    clearUsersState: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.error = null;
      state.loading = false;
      state.userLoading = false;
    },
    clearUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ========================
      // GET ALL USERS
      // ========================
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // GET USER BY ID
      // ========================
      .addCase(fetchUserById.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload;
      })

      // ========================
      // CREATE USER
      // ========================
      .addCase(createUser.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;
        state.users.unshift(action.payload); // add to list
        state.successMessage = "User created successfully";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsersState, clearUserMessages } = usersSlice.actions;
export default usersSlice.reducer;
