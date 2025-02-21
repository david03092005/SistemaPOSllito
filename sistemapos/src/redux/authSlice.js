import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { role: "admin" }, // Estado inicial
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload; // Cambia el rol
    },
  },
});

export const { setRole } = authSlice.actions;
export default authSlice.reducer;