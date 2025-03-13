import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Acción asíncrona para crear un empleado
export const createEmployee = createAsyncThunk(
    "employee/create",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/registerEmployee.php", {
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

// Acción asíncrona para eliminar un empleado
export const deleteConnection = createAsyncThunk(
    "employee/delete", // Tipo de acción para Redux
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/deleteEmployee.php", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }

            const data = await response.json(); // Convertir la respuesta a JSON
            return data; // Retornar la respuesta del servidor
        } catch (error) {
            return rejectWithValue(error.message); // Manejar errores
        }
    }
);

export const updateConnection = createAsyncThunk(
    "employee/update", // Tipo de acción para Redux
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/updateEmployee.php", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            const data = await response.json(); // Convertir la respuesta a JSON
            return data; // Retornar la respuesta del servidor
        } catch (error) {
            return rejectWithValue(error.message); // Manejar errores
        }
    }
);

export const readConnection = createAsyncThunk(
    "employee/read", // Tipo de acción para Redux
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/readEmployee.php", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            // console.log(response.data)
            const data = await response.json(); // Convertir la respuesta a JSON
            return data; // Retornar la respuesta del servidor
        } catch (error) {
            return rejectWithValue(error.message); // Manejar errores
        }
    }
);

const employeeSlice = createSlice({
    name: "employee",
    initialState: {
        loading: false,
        success: false,
        error: null,
        message: "",
        usuario: "",
        employees: [],
        nombre_usuario: "",
        contrasena: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.nombre_usuario = action.payload.usuario;
                state.contrasena = action.payload.contrasena;
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al crear el empleado.";
            })
       
            // Manejo de eliminar empleado
            .addCase(deleteConnection.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = "";
            })
            .addCase(deleteConnection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al eliminar el usuario.";
            })

            // Manejo de actualizar empleado
            .addCase(updateConnection.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = "";
            })
            .addCase(updateConnection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.usuario = action.payload.user;
            })
            .addCase(updateConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al actualizar el usuario.";
            })

            // Manejo de leer empleados
            .addCase(readConnection.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = "";
            })
            .addCase(readConnection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.employees = action.payload;
                state.message = action.payload.message;
            })
            .addCase(readConnection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Error al leer los empleados.";
            })
    },
});

export default employeeSlice.reducer;

