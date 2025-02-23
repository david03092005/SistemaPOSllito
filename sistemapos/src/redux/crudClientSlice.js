import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción asíncrona para eliminar un cliente
export const deleteConnection = createAsyncThunk(
    "client/delete",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/deleteClient.php", {
                method: "POST",
                body: formData,
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

export const updateConnection = createAsyncThunk(
    "client/update",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/updateClient.php", {
                method: "POST",
                body: formData
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

export const readConnection = createAsyncThunk(
    "client/read",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/readClient.php", {
                method: "POST",
                body: formData
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

const clientSlice = createSlice({
    name: "client",
    initialState: {
        loading: false,
        success: false,
        error: null,
        message: "",
        cliente: null,
        clients: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteConnection.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteConnection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al eliminar el cliente.";
            })

            .addCase(updateConnection.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(updateConnection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.cliente = action.payload.client;
            })
            .addCase(updateConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al actualizar el cliente.";
            })

            .addCase(readConnection.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(readConnection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.clients = action.payload;
                state.message = action.payload.message;
            })
            .addCase(readConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al leer los clientes.";
            });
    },
});

export default clientSlice.reducer;
