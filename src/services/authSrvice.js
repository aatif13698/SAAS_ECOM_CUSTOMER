import axios from "axios";





const signUp = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/signup`, { ...data, clientId: import.meta.env.VITE_DATABASE_ID });
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


const forgetPassword = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/forgetpassword`, { ...data, clientId: import.meta.env.VITE_DATABASE_ID });
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



const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/resetpassword`, { ...data, clientId: import.meta.env.VITE_DATABASE_ID });
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



const login = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/signIn`, { ...data, clientId: import.meta.env.VITE_DATABASE_ID });
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



const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/verifyOtp`, { ...data, clientId: import.meta.env.VITE_DATABASE_ID });
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


export default {
  verifyOtp,
  signUp,
  forgetPassword,
  resetPassword,
  login
}