import React, { useEffect, useState } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import "../../App.css"
import images from "../../constant/images";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useDarkmode from "../../Hooks/useDarkMode";
import Footer from "../../components/footer/Footer";

const ListRatingAndReview = () => {
    const [isDark] = useDarkmode();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { width, breakpoints } = useWidth();



    const navigate = useNavigate()
    const [carts, setCarts] = useState([]);
    useEffect(() => {
        getReviewsAndRating()
    }, []);

    console.log("carts aaa", carts);

    async function getReviewsAndRating() {
        try {
            setIsPageLoading(true);
            const response = await customerService.getReviewsAndRating(null);
            console.log("reponse list rating", response?.data?.reviews);

            setCarts(response?.data?.reviews);
            setIsPageLoading(false);
        } catch (error) {
            setCartData(null);
            setCarts([])
            console.log("error while fetching the orders", error);
            setIsPageLoading(false);
        }
    }

    const handleTrackOrder = (orderId, itemId) => {
        navigate(`/track-order/${orderId}`, { state: { itemId: itemId } });
    };

    if (isPageLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (

        <>

            <div className="container min-h-[50vh]  mx-auto px-4 py-6">
                <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800 mb-6">My Reviews</h2>
                <div className=" w-[100%]">
                    {/* Orders List */}
                    <div className="space-y-4">
                        {carts.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <p className="text-lg">No reviews or rating found.</p>
                                <p>Start rating products you ordered!</p>
                            </div>
                        ) : (
                            carts?.map((item, index) => {
                                console.log("carts", item);
                                const name = item?.productMainStockId?.name || "Unnamed Product";
                                const description = item?.productMainStockId?.description ;
                                const image =
                                    item?.productMainStockId?.images?.[0] ||
                                    "https://via.placeholder.com/80";
                                return (
                                    <div
                                        key={index + "AES"}
                                        className={`flex w-[100%]  ${isDark ? "dark:bg-carBgDark" : "bg-white"} flex-col md:flex-row items-start md:justify-between md:items-center gap-4 p-4  rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow`}
                                    >
                                        <div className="flex-shrink-0 flex items-center gap-4">
                                            <img
                                                src={`${image}`}
                                                alt={name}
                                                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
                                            />
                                            <div className=" md:w-auto">
                                                <h3 className="text-lg text-wrap md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                                                    {name}
                                                </h3>
                                                <span className="text-gray-600">{description}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col  items-center justify-center">
                <div
                    className={`${width < breakpoints.sm ? "w-[100%]" : "w-[100%]"
                        }  flex flex-col justify-center gap-3 items-center`}
                >
                    <Footer />
                </div>
            </div>


        </>


    );
};

export default ListRatingAndReview;