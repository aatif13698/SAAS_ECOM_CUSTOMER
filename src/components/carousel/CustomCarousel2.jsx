import React, { useState, useEffect } from 'react';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import images from '../../constant/images';
import customerService from '../../services/customerService';
import { Link } from 'react-router-dom';



import CryptoJS from "crypto-js";

import { useNavigate } from "react-router-dom";
import productService from "../../services/productService";

// Secret key for encryption (store this securely in .env in production)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    // URL-safe encoding
    return encodeURIComponent(encrypted);
};


const CustomCarousel2 = ({
    slidesToScroll = 1, // number of cards to move per click
}) => {

    const navigate  = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(7);

    const [banners, setBanners] = useState([]);

    console.log("banners", banners);


    // Update visibleCount based on window width
    useEffect(() => {
        const updateVisibleCount = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setVisibleCount(1); // small screens (mobile)
            } else if (width < 1024) {
                setVisibleCount(1); // medium screens (tablet)
            } else {
                setVisibleCount(1); // large screens (desktop)
            }
        };

        // Run on mount
        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);

        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    const totalItems = banners.length;
    // Calculate maximum starting index so that we always fill the view
    const maxIndex = Math.max(totalItems - visibleCount, 0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex + slidesToScroll;
            if (newIndex > maxIndex) {
                newIndex = 0; // Wrap around to the beginning
            }
            return newIndex;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex - slidesToScroll;
            if (newIndex < 0) {
                newIndex = maxIndex; // Wrap around to the end
            }
            return newIndex;
        });
    };




    useEffect(() => {

        fetchBanner()

    }, []);




    const sortByOrderAscending = (cards) => {
        return [...cards].sort((a, b) => a.order - b.order);
    };


    const fetchBanner = async () => {
        try {
            const response = await customerService.getBanners();
            setBanners(sortByOrderAscending(response?.data?.data))
        } catch (error) {
            console.log("Error in fetching posts", error);
        }
    };


    const handleCardClick = async (productId) => {

        try {

            const response = await productService.getProductStock(productId);
            console.log("response dfdsf", response?.data?._id);
            const encryptedId = encryptId(response?.data?._id);
            navigate(`/product/${encryptedId}`);

        } catch (error) {
            console.log("error getting stock of product", error);

        }

    };


    return (
        <div className="relative  overflow-hidden ">
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                    // Calculate translateX based on current index and the visible count
                    transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
                }}


            >


                {banners && banners.map((banner) => (
                    <div
                        key={banner._id}
                        className="p-2 flex-shrink-0"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                        <div
                            className="p-2 flex-shrink-0"
                            style={{ width: `${100 / visibleCount}%` }}
                        >

                            <div className=" h-[20rem] flex md:flex-row flex-col  bg-cover bg-no-repeat bg-center justify-around items-center rounded overflow-hidden"
                                style={{ backgroundImage: `url(${banner.image})`, objectFit: "contain" }}
                            >

                                <button
                                    onClick={() => handleCardClick(banner.product._id)}
                                    className='bg-primary text-teal-50 p-2 rounded-lg'
                                >
                                    View Product
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
                {/* {items.map((item) => (
                    <div
                        key={item.id}
                        className="p-2 flex-shrink-0"
                        style={{ width: `${100 / visibleCount}%` }}
                    >


                        <div className=" h-[20rem] flex md:flex-row flex-col  bg-cover bg-no-repeat bg-center justify-around items-center rounded overflow-hidden"
                            style={{ backgroundImage: `url(${item.image})`, objectFit: "contain" }}
                        >

                            <button className='bg-primary text-teal-50 p-2 rounded-lg' >View Product</button>
                           
                        </div>
                    </div>
                ))} */}
            </div>
            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full shadow"
            >
                <GoArrowLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full shadow"
            >
                <GoArrowRight size={24} />
            </button>
        </div>
    );
};

export default CustomCarousel2;
