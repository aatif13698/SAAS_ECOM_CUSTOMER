import axios from "axios";


const getLaptopList1 = async (data) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/listing/get/laptopList/v1/${import.meta.env.VITE_DATABASE_ID}`
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



const getParticularProductData = async (id) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/listing/get/product/v1/${import.meta.env.VITE_DATABASE_ID}/${id}`
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



export default {
    getLaptopList1,
    getParticularProductData
}