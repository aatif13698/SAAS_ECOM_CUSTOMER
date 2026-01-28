import React, { useEffect, useState } from 'react'
import CarouselWithoutArrow from '../carousel/CarouselWithoutArrow'
import customerService from '../../services/customerService';
import useDarkmode from '../../Hooks/useDarkMode';

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



function SimilarProduct({ category, subcategory, exclude }) {

    const [isDark] = useDarkmode();

    const [products, setProducts] = useState([]);


    const navigate = useNavigate()


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




    useEffect(() => {

        getSimilarProducts(category, subcategory, exclude);

    }, [category, subcategory, exclude ]);


    async function getSimilarProducts(category, subcategory, exclude) {
        try {
            const res = await customerService.getSimilarProductList(category, subcategory, exclude);
            console.log("esss", res?.data?.products);
            setProducts(res?.data?.products);
        } catch (error) {
            console.log("error", error);
        }
    }



    return (
        <div className={`mt-2 w-[100%] mb-4 ${isDark ? "bg-gray-800" : "bg-white"} shadow-md rounded-xl p-4 md:p-6`}>
            <h2 className="text-xl font-semibold mb-3">Similar Products</h2>
            {products && products.length > 0 ? (
                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                    {products.map((rec, index) => {
                        const image = rec?.images[0];
                        const name = rec?.name;

                        return (
                            <div
                                key={index}
                                onClick={() => handleCardClick(rec?._id)}
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
                    No Similar Products Found.
                </p>
            )}
        </div>
    )
}

export default SimilarProduct