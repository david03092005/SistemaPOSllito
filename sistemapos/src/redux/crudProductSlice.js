import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createConnection = createAsyncThunk(
    "product/create",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/registerProduct.php", {
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

// Acción asíncrona para eliminar un producto
export const deleteConnection = createAsyncThunk(
    "product/delete",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/deleteProduct.php", {
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
    "product/update",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/updateProduct.php", {
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
    "product/read",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/readProduct.php", {
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

const productSlice = createSlice({
    name: "product",
    initialState: {
        loading: false,
        success: false,
        error: null,
        message: "",
        producto: null,
        products: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createConnection.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(createConnection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(createConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al crear el producto.";
            })

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
                state.error = action.payload || "Error al eliminar el producto.";
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
                state.producto = action.payload.product;
            })
            .addCase(updateConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al actualizar el producto.";
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
                state.products = action.payload;
                state.message = action.payload.message;
            })
            .addCase(readConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al leer los productos.";
            });
    },
});

export default productSlice.reducer;
