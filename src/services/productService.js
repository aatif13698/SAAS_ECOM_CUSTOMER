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



const getProductAttribute = async (productId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/vendor/attribute/all/attributes/product/${import.meta.env.VITE_DATABASE_ID}/${productId}`
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

const getProductRating = async (productStockId, productMainStockId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/listing/get/product/v1/${import.meta.env.VITE_DATABASE_ID}/${productStockId}/${productMainStockId}`
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            return Promise.reject(error.response.data?.message || "Server error.");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}

// const getProductQA = async (productStockId, productMainStockId) => {
//     try {
//         const response = await axios.get(
//             `${import.meta.env.VITE_API_URL}/api/listing/get/question/product/${import.meta.env.VITE_DATABASE_ID}/${productStockId}/${productMainStockId}`
//         );
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             return Promise.reject(error.response.data?.message || "Server error.");
//         } else if (error.request) {
//             return Promise.reject("Network error. Please try again.");
//         } else {
//             return Promise.reject("An error occurred. Please try again later.");
//         }
//     }
// }

const getProductQA = async (productStockId, productMainStockId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/listing/get/question/product/${import.meta.env.VITE_DATABASE_ID}/${productStockId}/${productMainStockId}`,
      {
        params: {
          page,
          limit,
          // sort: '-createdAt' // uncomment if you want to control sort from frontend
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return Promise.reject(error.response.data?.message || 'Server error.');
    } else if (error.request) {
      return Promise.reject('Network error. Please try again.');
    } else {
      return Promise.reject('An error occurred. Please try again later.');
    }
  }
};

const getFaqs = async (productStockId, productMainStockId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/listing/get/faq/product/${import.meta.env.VITE_DATABASE_ID}/${productStockId}/${productMainStockId}`,
      {
        params: {
          page,
          limit,
          // sort: '-createdAt' // uncomment if you want to control sort from frontend
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return Promise.reject(error.response.data?.message || 'Server error.');
    } else if (error.request) {
      return Promise.reject('Network error. Please try again.');
    } else {
      return Promise.reject('An error occurred. Please try again later.');
    }
  }
};





const getProductStock = async (productId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/vendor/stock/stock/by/product/${import.meta.env.VITE_DATABASE_ID}/${productId}`
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
    getProductRating,
    getProductQA,
    getFaqs,
    getParticularProductData,
    getProductAttribute,
    getProductStock
}