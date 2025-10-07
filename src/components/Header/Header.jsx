


import React, { useEffect, useRef, Fragment, useState } from 'react';
import { FaCaretDown, FaInstagram } from 'react-icons/fa';
import logo from "../../assets/logo/Instagram_logo.svg.png"
import logoWhite from "../../assets/logo/instgram_logo_white.png"
import images from '../../constant/images';

import useWidth from '../../Hooks/useWidth';
import { GoHeart } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import useDarkmode from '../../Hooks/useDarkMode';
import SecondHeader from './SecondHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { logOut, removeDefaultAddress } from '../../store/reducer/auth/authCustomerSlice';
import { Dialog, Transition } from "@headlessui/react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { IoPerson } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaBox } from "react-icons/fa6";







const Header = ({ noFade }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const location = useLocation();

    const [showSecondHeader, setShowSecondHeader] = useState(true);

    useEffect(() => {

        if (location?.pathname === "/checkout/cart" || location?.pathname === "/cart") {

            setShowSecondHeader(false);

        } else {

            setShowSecondHeader(true);

        }

    }, [location])




    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [isDark, setDarkMode] = useDarkmode();

    const { width, breakpoints } = useWidth();

    const { clientUser: customerData, isAuth: isLogedIn } = useSelector((state) => state?.authCustomerSlice);

    // console.log("customerData", customerData);


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }

        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
            setIsProfileDropdownOpen(false);
        }
    };



    function handleLogout() {
        localStorage.removeItem("SAAS_ECOM_customer_token")
        localStorage.removeItem("SAAS_ECOM_customerInfo")
        localStorage.removeItem("SAAS_ECOM_expiryTime")
        dispatch(logOut());
        dispatch(removeDefaultAddress());
        navigate("/login");
    }


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    function handleCart() {
        if (!isLogedIn) {
            setShowLoadingModal(true)
        } else {
            navigate(`/cart`)
        }
    }

     function handleWishList() {
        if (!isLogedIn) {
            setShowLoadingModal(true)
        } else {
            navigate(`/wishlist`)
        }
    }


    return (
        <div className={`w-full sticky top-[-1px] z-[999] border-b-[0.5px]  ${isDark ? "bg-custom-gradient-2-dark border-blue-gray-800" : "bg-custom-gradient-2 border-slate-400"}`}>
            <div className='flex w-[100%] border-b-[1px] border-gray-500/50 flex-row items-center justify-between'>
                <div className='w-[20%] '>
                    <div className="relative w-[100%]  text-left" ref={dropdownRef}>
                        <div className='flex flex-row justify-center items-center'>
                            <button
                                type="button"
                                className="inline-flex w-[100%] justify-center items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900  "
                                id="menu-button"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                                onClick={toggleDropdown}
                            >
                                {
                                    <img className='md:w-35 md:h-10 ' src={isDark ? images.logo : images.logo} alt="" />
                                }
                                {/* <svg
                                    className="-mr-1 h-5 w-[30px] text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg> */}
                            </button>
                        </div>
                        {/* <div
                            className={`absolute  z-10 mt-2 w-[120%] origin-top-right rounded-md ${isDark ? "bg-dark text-light" : "bg-light"} shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition ease-in-out duration-200 ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                        >
                            <div className="py-1" role="none">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm "
                                    role="menuitem"
                                    id="menu-item-0"
                                >
                                    Following
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm "
                                    role="menuitem"
                                    id="menu-item-1"
                                >
                                    Favorites
                                </a>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className='w-[80%] h-[100%]  relative py-2'>
                    <div className='w-[100%] h-[100%]  flex justify-around  '>
                        {/* search */}
                        <div className='  md:w-[40%] w-[80%] h-[100%] overflow-hidden'>
                            <div
                                className={`inline-flex relative  rounded-lg ${isDark ? "bg-inputDark text-light" : "bg-inputLight text-dark"} h-[100%] w-[100%]  gap-x-10 px-10 py-2 text-sm font-semibold  shadow-sm `}
                                id="menu-button"
                                aria-haspopup="true"
                            >
                                <span>
                                    Search
                                </span>

                                <span className='absolute left-2 top-2 bottom-2'>
                                    <FiSearch className='w-5 h-5' />
                                </span>
                            </div>
                        </div>

                        {
                            width <= breakpoints.sm ?
                                <div className="flex items-center mx-3">
                                    <button
                                        onClick={() => setDarkMode(!isDark)}
                                        className={`nav-item flex   cursor-pointer   rounded-md  transition duration-500`}
                                    >
                                        <div className={`menu-link flex items-center `}>
                                            <span className="menu-icon flex-grow-0">
                                                {isDark ? <CiLight className={` text-lg ${isDark ? "text-white" : "text-white"} w-5 h-5`} /> : <MdDarkMode className={` text-lg ${isDark ? "text-white" : "text-white"} w-5 h-5`} />}
                                            </span>
                                        </div>
                                    </button>
                                </div> : ""
                        }



                        {
                            width <= breakpoints.sm ? "" :
                                <div className='  md:w-[60%]   w-[40%] h-[100%]  ' ref={profileDropdownRef}>
                                    <div className='flex gap-2  items-center mr-10 justify-end'>

                                        {
                                            isLogedIn ? "" :
                                                <button onClick={() => navigate("/login")} className="flex items-center gap-2 hover:bg-lightButton/80 text-white font-semibold py-1 px-2 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                                                                  1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                                                                 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                    </svg>
                                                    <span>Login</span>
                                                </button>
                                        }

                                        {/* profile dropdown */}
                                        <div
                                            className={`absolute top-8 z-10 mt-2 w-auto origin-top-right rounded-md ${isDark ? "bg-dark text-light" : "bg-white text-gray-800"
                                                } shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition ease-in-out duration-200 ${isProfileDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                                }`}
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="menu-button"
                                        >
                                            <div className="py-1" role="none">
                                                {/* Navigate to Account Page without Reload */}
                                                <button
                                                    className="flex items-center gap-3 px-4 py-2 text-sm w-[100%] text-left hover:bg-gray-100  dark:hover:bg-gray-700 transition-all rounded-md"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        navigate("/profile");
                                                        setIsProfileDropdownOpen(false);
                                                    }} // Navigate without reload
                                                >
                                                    <FaUser className="text-gray-500" /> My Profile
                                                </button>
                                                <button
                                                    className="flex items-center gap-3 px-4 py-2 text-sm w-[100%] text-left hover:bg-gray-100  dark:hover:bg-gray-700 transition-all rounded-md"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        navigate("/account");
                                                        setIsProfileDropdownOpen(false);
                                                    }} // Navigate without reload
                                                >
                                                    <FaUserCircle className="text-gray-500" /> Account
                                                </button>
                                                <button
                                                    className="flex items-center gap-3 px-4 py-2 text-sm w-[100%] text-left hover:bg-gray-100  dark:hover:bg-gray-700 transition-all rounded-md"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        handleWishList()
                                                        setIsProfileDropdownOpen(false)
                                                    }} // Navigate without reload
                                                >
                                                    <FaHeart className="text-gray-500" /> Wishlist
                                                </button>
                                                <button
                                                    className="flex items-center gap-3 px-4 py-2 text-sm w-[100%] text-left hover:bg-gray-100  dark:hover:bg-gray-700 transition-all rounded-md"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        navigate("/order");
                                                        setIsProfileDropdownOpen(false);
                                                    }} // Navigate without reload
                                                >
                                                    <FaBox className="text-gray-500" /> Order
                                                </button>

                                                {/* Logout Button */}
                                                <button
                                                    className="flex items-center gap-3 px-4 py-2 text-sm w-[100%] text-left hover:bg-red-100 dark:hover:bg-red-700 transition-all rounded-md"
                                                    role="menuitem"
                                                    onClick={handleLogout}
                                                >
                                                    <FaSignOutAlt className="text-red-500" /> Logout
                                                </button>
                                            </div>
                                        </div>
                                        <button onClick={handleCart} className="flex items-center gap-2  text-white font-semibold py-1 px-2 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 2.6a1 1 0 00.9 1.4h12.8m-14.4 
                                                       0a1 1 0 110 2 1 1 0 010-2zm10 0a1 1 0 110 2 1 1 0 010-2z" />
                                            </svg>
                                            <span className='text-base'>Cart</span>
                                        </button>

                                        <button onClick={() => {
                                            navigate("/checkout/cart")
                                        }} className="flex items-center gap-2  text-white font-semibold py-1 px-2 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 2.6a1 1 0 00.9 1.4h12.8m-14.4 
                                                       0a1 1 0 110 2 1 1 0 010-2zm10 0a1 1 0 110 2 1 1 0 010-2z" />
                                            </svg>
                                            <span className='text-base'>Cart checkout</span>
                                        </button>


                                        <div className="flex items-center mx-3">
                                            <button
                                                onClick={() => setDarkMode(!isDark)}
                                                className={`nav-item flex   cursor-pointer   rounded-md  transition duration-500`}
                                            >
                                                <div className={`menu-link flex items-center `}>
                                                    <span className="menu-icon flex-grow-0">
                                                        {isDark ? <CiLight className={` text-lg ${isDark ? "text-white" : "text-white"} w-5 h-5`} /> : <MdDarkMode className={` text-lg ${isDark ? "text-white" : "text-white"} w-5 h-5`} />}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>

                                        {
                                            isLogedIn ?
                                                <button onClick={toggleProfileDropdown} className='bg-white w-8 h-8 flex justify-center items-center rounded-full'>
                                                    {customerData?.profileImage ? <img src={`${customerData?.profileImage}`} className='rounded-full' alt="" />
                                                        : <IoPerson className='w-6 h-6 bg-transparent' />
                                                    }
                                                </button> : ""
                                        }



                                    </div>

                                </div>}


                    </div>
                </div>
            </div>


            {
                showSecondHeader ?
                    <div>
                        <SecondHeader />
                    </div>
                    : ""
            }




            {/* login alert  */}

            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? "" : "duration-300 ease-out"}
                        enterFrom={noFade ? "" : "opacity-0"}
                        enterTo={noFade ? "" : "opacity-100"}
                        leave={noFade ? "" : "duration-200 ease-in"}
                        leaveFrom={noFade ? "" : "opacity-100"}
                        leaveTo={noFade ? "" : "opacity-0"}
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto flex justify-center items-center">
                        <Transition.Child
                            as={Fragment}
                            enter={noFade ? "" : "duration-300 ease-out"}
                            enterFrom={noFade ? "" : "opacity-0 scale-95"}
                            enterTo={noFade ? "" : "opacity-100 scale-100"}
                            leave={noFade ? "" : "duration-200 ease-in"}
                            leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                            leaveTo={noFade ? "" : "opacity-0 scale-95"}
                        >
                            <Dialog.Panel className="w-full max-w-[20rem] bg-white dark:bg-darkSecondary rounded-md shadow-xl p-6 text-center">
                                {/* Cart Image */}
                                <div className="flex justify-center">
                                    <img src={images?.emptycart} alt="Cart" className="w-24 h-24 object-cover" />
                                </div>

                                {/* Message */}
                                <h2 className="text-lg font-semibold mt-4">You are not logged in</h2>
                                <p className="text-gray-600 text-sm mt-1">Please login to proceed</p>

                                {/* Buttons */}
                                <div className="mt-4 flex justify-center gap-4">
                                    <button onClick={() => {
                                        setShowLoadingModal(false)
                                        navigate("/login")
                                    }} className=" py-2  w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65">
                                        <span>Log In</span>
                                    </button>
                                    <button onClick={() => {
                                        setShowLoadingModal(false)
                                        navigate("/signup")
                                    }} className="px-6 py-2   w-[50%] bg-addToCartBUtton text-white font-semibold rounded-lg hover:bg-addToCartBUtton/65">
                                        <span>Sign Up</span>
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>



        </div>
    );
};

export default Header;
