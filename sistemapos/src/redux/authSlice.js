import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción asincrónica para hacer login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/login.php", {
                method: "POST",
                body: formData,
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

// Slice de autenticación
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        mensaje: "",
        loading: false,
        error: null,
        cedulaAdmin: null, // Nueva propiedad para guardar la cédula del administrador
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.mensaje = "Sesión cerrada";
            state.error = null;
            state.loading = false;
            state.cedulaAdmin = null; // Limpiar la cédula al cerrar sesión
    
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.mensaje = "";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Guardar el usuario
                state.mensaje = action.payload.message;
                
                // Si el usuario es administrador, guarda su cédula
                if (action.payload.usuario.rol === "0") { // 0 es administrador
                    state.cedulaAdmin = action.payload.cedula;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error al iniciar sesión";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;