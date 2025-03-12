import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../redux/modalSlice"; 
import authReducer from "../redux/authSlice";
import employeeReducer from "../redux/crudEmployeeSlice"
import clientReducer from "../redux/crudClientSlice"
import productReducer from "../redux/crudProductSlice"
import clientConsult from "../redux/clientSlice"
import salesReducer from "../redux/salesSlice"; 
import salesReportReducer from "../redux/salesReportSlice"; 


const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    employee: employeeReducer,
    client: clientReducer,
    product: productReducer,
    clientC: clientConsult,
    sales: salesReducer,
    salesReport: salesReportReducer,
  },
});

export default store;