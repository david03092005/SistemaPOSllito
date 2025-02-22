import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../redux/modalSlice"; 
import authReducer from "../redux/authSlice";
import employeeReducer from "../redux/crudEmployeeSlice"

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    employee: employeeReducer
  },
});

export default store;