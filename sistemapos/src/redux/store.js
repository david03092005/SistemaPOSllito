import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../redux/modalSlice"; 
import authReducer from "../redux/authSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
  },
});

export default store;