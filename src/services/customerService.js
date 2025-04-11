import axios from "axios";






const getCategortAndSubcategory = async (data) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/customer/getCategoryAndSubcategory/${import.meta.env.VITE_DATABASE_ID}`
        );
        return response.data;
    } catch (error) {
        console.log("error",error);
        
        if (error.response) {
            return Promise.reject(error.response.data?.message || "Server error.");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}



const updateProfile = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {

        const response =  await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/editProfile`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}




const getProfile = async (id) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {

        const response =  await axios.get(`${import.meta.env.VITE_API_URL}/api/customer/auth/getProfile/${import.meta.env.VITE_DATABASE_ID}/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}




const addAddress = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {

        const response =  await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/addNewAddress`, {...data, clientId: import.meta.env.VITE_DATABASE_ID }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}




const updateAddress = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {
        const response =  await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/updateAddress`, {...data, clientId: import.meta.env.VITE_DATABASE_ID }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}



const deleteAddress = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {
        const response =  await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/deleteAddress`, {...data, clientId: import.meta.env.VITE_DATABASE_ID }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}




const getAddresses = async (id) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {

        const response =  await axios.get(`${import.meta.env.VITE_API_URL}/api/customer/getAddresses/${import.meta.env.VITE_DATABASE_ID}/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}



const addToCart = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {
        const response =  await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/cart/add`, {...data, clientId: import.meta.env.VITE_DATABASE_ID }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}


const newaddToCart = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {
        const response =  await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/cart/add/new`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}

const newPlaceOrder = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {
        const response =  await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/order/place-order`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
          }
    }
}

const getCarts = async (sessionId) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/customer/cart?sessionId=${sessionId}&clientId=${import.meta.env.VITE_DATABASE_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};



const removeFromCart = async (data) => {
    const authToken = localStorage.getItem("SAAS_ECOM_customer_token");
    
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/customer/cart/remove`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                data: { ...data, clientId: import.meta.env.VITE_DATABASE_ID } // Move data inside `data` field
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};


export default { 
    getCategortAndSubcategory,
    updateProfile,
    getProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    addToCart,
    newaddToCart,
    newPlaceOrder,
    getCarts,
    removeFromCart
}