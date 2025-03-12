import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción para obtener el reporte de ventas del día (GET)
export const fetchSalesReport = createAsyncThunk(
    "salesReport/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/getSalesOfDay.php", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud del reporte de ventas.");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const salesReportSlice = createSlice({
    name: "salesReport",
    initialState: {
        loading: false,
        success: false,
        error: null,
        report: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesReport.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(fetchSalesReport.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.report = action.payload;
            })
            .addCase(fetchSalesReport.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al obtener el reporte de ventas.";
            });
    },
});

export default salesReportSlice.reducer;