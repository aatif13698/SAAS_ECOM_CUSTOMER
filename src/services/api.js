import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add this interceptor (runs on every request)
api.interceptors.request.use((config) => {
    const clientId = import.meta.env.VITE_DATABASE_ID;   // or from Redux/Context
    if (clientId) {
        config.headers['X-Client-ID'] = clientId;        // ← send custom header
    }
    return config;
});



const checkDomain = async (id) => {
    try {
        const response = await api.get(
            `/api/check-domain`
        );
        
        return response;        // Return only the data (cleaner)
        
    } catch (error) {
        console.error("Error fetching product data:", error);

        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message 
                         || error.response.data?.error 
                         || "Server error occurred.";
            return Promise.reject(message);
        } 
        else if (error.request) {
            // Request was made but no response received
            return Promise.reject("Network error. Please check your internet connection.");
        } 
        else {
            // Something else happened while setting up the request
            return Promise.reject("An unexpected error occurred. Please try again.");
        }
    }
};


export default {
    checkDomain
}