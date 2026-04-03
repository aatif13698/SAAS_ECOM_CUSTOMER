

import layout from "./layout";

import authCustomerSlice from "./reducer/auth/authCustomerSlice";
import companyConfigSlice from "./reducer/company/companyConfigSlice";




const rootReducer = {

    layout,
    authCustomerSlice,
    companyConfigSlice
}


export default rootReducer