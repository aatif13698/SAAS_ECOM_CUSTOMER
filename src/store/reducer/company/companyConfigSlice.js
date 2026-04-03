import { createSlice } from "@reduxjs/toolkit";

const storedCustomer = JSON.parse(localStorage.getItem("SAAS_ECOM_customerInfo"));

// console.log("storedCustomer",storedCustomer);



export const companyConfigSlice = createSlice({
    name: "companyConfig",
    initialState: {
        config: null,
    },
    reducers: {
        setCompanyConfig: (state, action) => {
            state.config = action.payload;
        },

        removeCompanyConfig: (state, action) => {
            state.config = null;
        },


    },
});

export const { setCompanyConfig, removeCompanyConfig } = companyConfigSlice.actions;
export default companyConfigSlice.reducer;
