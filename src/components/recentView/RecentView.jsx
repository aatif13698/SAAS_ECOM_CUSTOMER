import React, { useEffect, useState } from "react";
import { FaBox, FaHeart, FaQuestionCircle, FaHeadset, FaUser, FaMapMarkerAlt, FaLanguage, FaBell, FaShieldAlt, FaStar, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import { logOut } from "../../store/reducer/auth/authCustomerSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useDarkmode from "../../Hooks/useDarkMode";
import { isDraft } from "@reduxjs/toolkit";
import customerService from "../../services/customerService";
import data from "../../constant/data";
import Loader1 from "../../components/loader/Loader1";


import CryptoJS from "crypto-js";
import productService from "../../services/productService";

// Secret key for encryption (store this securely in .env in production)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    // URL-safe encoding
    return encodeURIComponent(encrypted);
};


function RecentView() {
    const { width, breakpoints } = useWidth();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isDark] = useDarkmode();
    const [recentView, setRecentView] = useState([]);
    const [recentLoading, setRecentLoading] = useState(false);
    console.log("recentView", recentView);


    useEffect(() => {
        getRecentViewed()
    }, []);


    const getRecentViewed = async () => {
        try {
            setRecentLoading(true);
            const response = await customerService.getRecentViewed();
            if (response?.data?.data?.length > 0) {
                setRecentView(response?.data?.data)
            };
            setRecentLoading(false);
        } catch (error) {
            setRecentLoading(false);
            console.error("Error fetching carts:", error);
        }
    };


    const handleCardClick = async (productId) => {
        try {
            const encryptedId = encryptId(productId);
            navigate(`/product/${encryptedId}`);
        } catch (error) {
            console.log("error getting stock of product", error);
        }
    };
    
    return (
        <div className={`mt-2 w-[100%] ${isDark ? "bg-gray-800" : "bg-white"} shadow-md rounded-xl p-4 md:p-6`}>
            <h2 className="text-xl font-semibold mb-3">Recently Viewed</h2>

            {
                recentLoading ?
                    <div className='flex w-[100%] h-[10rem] flex-col justify-center items-center'>
                        <Loader1 />
                    </div>
                    :
                    <>

                        {recentView && recentView.length > 0 ? (
                            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                                {recentView.map((rec, index) => {
                                    const image = rec?.productMainStock?.images[0];
                                    const name = rec?.productMainStock?.name;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleCardClick(rec?.productStock?._id)}
                                            className={`flex-shrink-0 cursor-pointer w-32 sm:w-40 md:w-48 h-auto ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}
                                        >
                                            <div className="aspect-square relative">
                                                <img
                                                    src={image}
                                                    alt={name || "Product image"}
                                                    className="w-[100%] h-[100%] object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <p className="p-2 text-sm font-medium truncate text-center">
                                                {name}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 italic">
                                No recently viewed items yet.
                            </p>
                        )}

                    </>
            }

        </div>

    )
}

export default RecentView