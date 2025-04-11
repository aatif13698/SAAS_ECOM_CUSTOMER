import { createSlice } from "@reduxjs/toolkit";

const storedCustomer = JSON.parse(localStorage.getItem("SAAS_ECOM_customerInfo"));

// console.log("storedCustomer",storedCustomer);



export const authCustomerSlice = createSlice({
  name: "auth",
  initialState: {
    clientUser:  storedCustomer ? storedCustomer : null,
    isAuth: storedCustomer ? true : false,
    defaultAddress: null,
  },
  reducers: {
    setClientUser: (state, action) => {
      state.clientUser = action.payload;
      state.isAuth = true;
    },
    setDefaultAddress: (state, action) => {
      state.defaultAddress = action.payload;
    },
    removeDefaultAddress: (state, action) => {
      state.defaultAddress = null;
    },
    logOut: (state, action) => {
      state.clientUser = null;
      state.isAuth = false;
    },
  },
});

export const { setClientUser, logOut, setDefaultAddress, removeDefaultAddress  } = authCustomerSlice.actions;
export default authCustomerSlice.reducer;
