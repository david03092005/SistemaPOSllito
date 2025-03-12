import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción para obtener las facturas con filtros opcionales (GET)
export const fetchFacturas = createAsyncThunk(
    "factura/fetch",
    async ({ fecha, cedula_vendedor }, { rejectWithValue }) => {
        try {
            // Construcción dinámica de la URL con filtros
            const queryParams = new URLSearchParams();
            if (fecha) queryParams.append("fecha", fecha);
            if (cedula_vendedor) queryParams.append("cedula_vendedor", cedula_vendedor);

            const response = await fetch(`http://localhost/back/getFacturas.php?${queryParams.toString()}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const facturaSlice = createSlice({
    name: "factura",
    initialState: {
        loading: false,
        success: false,
        error: null,
        facturas: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFacturas.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(fetchFacturas.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.facturas = action.payload;
            })
            .addCase(fetchFacturas.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al obtener las facturas.";
            });
    },
});

export default facturaSlice.reducer;