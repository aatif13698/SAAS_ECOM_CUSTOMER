import React, { memo, useState } from 'react';
import images from '../../constant/images';
import logoWhite from "../../assets/logo/instgram_logo_white.png"


import useWidth from '../../Hooks/useWidth';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useDarkmode from '../../Hooks/useDarkMode';
import authSrvice from '../../services/authSrvice';
import { setClientUser, setDefaultAddress, setDefaultWishList } from '../../store/reducer/auth/authCustomerSlice';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';



const SignUpLink = memo(() => {
    return (
        <div className='w-[100%]'>
            <div className='sm:border-2 border-gray-300 rounded-sm p-6 max-w-md mx-auto'>
                <div className='rounded-lg flex flex-col'>
                    <h2 className='text-base'>Forget password? <Link to={"/forgetpassword"} className='text-blue-500 font-bold'>Reset it</Link></h2>
                    <h2 className='text-base'>Don't have an account? <Link to={"/signup"} className='text-blue-500 font-bold'>Sign up</Link></h2>
                    <h2 className='text-base'>Back to home<Link to={"/home"} className='text-blue-500 font-bold'>Go To Product Page</Link></h2>
                </div>
            </div>
        </div>
    );
});

const Login = () => {

    const navigate = useNavigate();
    const dispatch  = useDispatch()

    const { width, breakpoints } = useWidth();
    const [isDark] = useDarkmode();

    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const [formDataError, setFormDataError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log("formDataError", formDataError);


    const handleValidation = (name, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors = {};

        switch (name) {
            case 'identifier':
                if (!value) {
                    errors.identifier = 'Email or Phone is required.';
                } else {
                    errors.identifier = '';
                }
                break;
            case 'password':
                if (!value) {
                    errors.password = 'Password is required.';
                } else {
                    errors.password = '';

                }
                break;
            default:
                break;
        }
        return errors;
    };


    function handleChange(e) {
        const { name, value } = e.target;

        // Validate input field
        const error = handleValidation(name, value);
        setFormDataError((prev) => ({ ...prev, ...error }));

        // Update form data
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const validateFormData = () => {
        const errors = {};
        let hasError = false;

        Object.keys(formData).forEach((key) => {
            const error = handleValidation(key, formData[key]);
            if (Object.keys(error).length > 0) {
                Object.assign(errors, error);
            }
        });

        const isValid = Object.values(errors).every(value => value === '');
        if (!isValid) {
            hasError = true;
        }

        setFormDataError(errors);
        return hasError;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        if (validateFormData()) {
            setIsSubmitting(false);
            return;
        }

        const dataObject = {
            identifier: formData?.identifier, password: formData?.password
        }

        try {
            const response = await authSrvice.login(dataObject);

            localStorage.setItem("SAAS_ECOM_customer_token", response.data.token);
            localStorage.setItem(
                "SAAS_ECOM_customerInfo",
                JSON.stringify(response.data.customerInfo)
            );
            localStorage.setItem("SAAS_ECOM_expiryTime", response.data.expiryTime);
            dispatch(setClientUser(response.data?.customerInfo));
            dispatch(setDefaultAddress(response?.data?.addresses));
            dispatch(setDefaultWishList(response?.data?.wishList));
            navigate("/home");

            // Notify success, redirect, or clear form after successful signup
        } catch (error) {
            console.error('Login error:', error);

            toast.error(error || 'An error occurred during login');

            // Show user-friendly error messages
        } finally {
            setIsSubmitting(false);
        }
    }



    return (
        <div className=' min-h-screen w-full flex justify-center '>
            <Toaster />
            <div className='w-ful h-fulll sm:w-[100%] md:w-[60%] '>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 '>
                    {/* image div */}
                    {
                        width < breakpoints?.md ? "" :
                            <div className=' h-full flex items-center justify-center relative'>
                                <div className='relative'>
                                    <img
                                        src={images?.loginIlustration}
                                        alt="loginImg2"
                                        className='relative z-10 w-[80%] sm:w-[60%] md:w-[90%] lg:w-[90%]'
                                    />
                                </div>
                            </div>

                    }

                    {/* form div */}
                    <div className='  h-full w-[100%] flex flex-col justify-center items-center  '>

                        <div className='w-[100%] mb-3'>

                            <div className='sm:border-2  border-gray-300 rounded-sm p-6  max-w-md mx-auto'>
                                <div className='flex justify-center py-6'>
                                    <img src={isDark ? images?.logo : images?.logo} alt="Instagram Logo" className='w-36' />                                </div>

                                <div className='w-[90%]   rounded-lg flex justify-center items-center mx-auto'>
                                    <div className='w-[100%] space-y-4'>
                                        <div>
                                            <input
                                                name='identifier'
                                                type="text"
                                                placeholder='Enter Email or Phone No'
                                                onChange={handleChange}

                                                className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                            />
                                            <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.identifier}</span>
                                        </div>

                                        <div>
                                            <input
                                                name='password'
                                                type="password"
                                                placeholder='Password'
                                                className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                onChange={handleChange}
                                            />
                                            <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.password}</span>
                                        </div>

                                        <button onClick={handleSubmit} className='dark:bg-darkButton bg-lightButton dark:text-darkText  text-white w-[100%] py-2 rounded dark:hover:bg-lightButton/50 hover:bg-darkButton/50 hover:text-darkText transition duration-200'>
                                            Log in
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SignUpLink />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
