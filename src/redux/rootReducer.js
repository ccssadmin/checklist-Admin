import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import templateReducer from "./slices/templateSlice";
import userReducer from "./slices/userSlice";
import masterReducer from "./slices/MasterSlice";
import assignmentReducer from "./slices/checklistSlice";
import executionReducer from "./slices/executionSlice";
import rescheduleReducer from "./slices/rescheduleSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  template: templateReducer,
  user: userReducer,
  master: masterReducer,
  assignments: assignmentReducer,
  execution: executionReducer,
  reschedule: rescheduleReducer,
});

export default rootReducer;
