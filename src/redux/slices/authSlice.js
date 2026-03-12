import { createSlice } from "@reduxjs/toolkit";
import { loginUser, refreshToken } from "../Action/authAction";
import { jwtDecode } from "jwt-decode";

/* ================= SAFE PARSE ================= */

const safeJSONParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const storedToken = localStorage.getItem("token");
const storedRefreshToken = localStorage.getItem("refreshToken");
const storedUser = safeJSONParse(localStorage.getItem("user"));
const storedOrgId = localStorage.getItem("organizationId");

let user = storedUser;
let organizationId = storedOrgId;

/* ================= TOKEN FALLBACK ================= */

if (storedToken && (!user || !user.userId || !organizationId)) {
  try {
    const decoded = jwtDecode(storedToken);

    user = {
      userId: decoded.UserId,
      id: decoded.UserId,
      name:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        "",
    };

    organizationId =
      decoded.OrganizationId || decoded.OrgId || decoded.organizationId || null;

    localStorage.setItem("user", JSON.stringify(user));
    if (organizationId) {
      localStorage.setItem("organizationId", organizationId);
    }
  } catch (err) {
    console.error("JWT decode failed", err);
  }
}

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    token: storedToken,
    refreshToken: storedRefreshToken,
    organizationId,
    loading: false,
    error: null,
    isAuthenticated: !!storedToken,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.organizationId = null;
      state.isAuthenticated = false;

      localStorage.clear();
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= LOGIN ================= */

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const { token, refreshToken, user } = action.payload;

        let orgId = user?.organizationId;

        if (!orgId && token) {
          const decoded = jwtDecode(token);
          orgId =
            decoded.OrganizationId ||
            decoded.OrgId ||
            decoded.organizationId ||
            null;
        }

        let decodedUserId = null;

        if (token) {
          const decoded = jwtDecode(token);
          decodedUserId =
            decoded.UserId || decoded.userId || decoded.sub || null;
        }

        state.user = {
          ...user,
          userId: decodedUserId,
        };

        state.token = token;
        state.refreshToken = refreshToken;
        state.organizationId = orgId;
        state.isAuthenticated = true;

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(state.user));

        if (orgId) {
          localStorage.setItem("organizationId", orgId);
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      /* ================= REFRESH TOKEN ================= */

      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })

      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })

      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;

        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.organizationId = null;
        state.isAuthenticated = false;

        localStorage.clear();
      });
  },
});

/* ================= EXPORTS ================= */

export const { logout } = authSlice.actions;
export default authSlice.reducer;
