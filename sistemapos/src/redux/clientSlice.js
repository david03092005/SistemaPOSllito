import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción asincrónica para consultar un cliente por cédula
export const fetchClient = createAsyncThunk(
    "client/fetchClient",
    async (codigo, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/infoClient.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "getClient", codigo }),
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }

            const data = await response.json();
            return data; // Retorna la respuesta del servidor
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice de clientes
const clientSlice = createSlice({
    name: "client",
    initialState: {
        client: null,
        mensaje: "",
        loading: false,
        error: null,
    },
    reducers: {
        clearClient: (state) => {
            state.client = null;
            state.mensaje = "Datos de cliente limpiados";
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClient.pending, (state) => {
                state.loading = true;
                state.mensaje = "";
                state.error = null;
            })
            .addCase(fetchClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload.client; // Guardar la info del cliente
                state.mensaje = action.payload.message;
            })
            .addCase(fetchClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error al obtener cliente";
            });
    },
});

export const { clearClient } = clientSlice.actions;
export default clientSlice.reducer;