import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaStar } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import "../../App.css";
import images from "../../constant/images";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useDarkmode from "../../Hooks/useDarkMode";
import Footer from "../../components/footer/Footer";
import CryptoJS from 'crypto-js';


const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
};


const ListRatingAndReview = () => {
    const [isDark] = useDarkmode();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { width, breakpoints } = useWidth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0)

    useEffect(() => {
        getReviewsAndRating();
    }, [refreshCount]);

    async function getReviewsAndRating() {
        try {
            setIsPageLoading(true);
            const response = await customerService.getReviewsAndRating(null);
            setReviews(response?.data?.reviews || []);
            setIsPageLoading(false);
        } catch (error) {
            setReviews([]);
            console.error("Error while fetching reviews:", error);
            toast.error("Failed to load reviews");
            setIsPageLoading(false);
        }
    }

    const handleEditReview = (reviewId, productStock, productMainStockId) => {
        const encryptedId = encryptId(reviewId);
        const encryptedIdMainStockId = encryptId(productMainStockId);
        const encryptedProductStockId = encryptId(productStock);
        // Navigate to edit review page, passing reviewId
        navigate(`/edit-review/${encryptedIdMainStockId}/${encryptedProductStockId}/${encryptedId}`);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {

                await customerService.deleteRating(reviewId, import.meta.env.VITE_DATABASE_ID); // Assume customerService has a deleteReview method
                // setReviews(reviews.filter((review) => review._id !== reviewId));
                setRefreshCount((prev) => prev + 1);
                toast.success("Review deleted successfully");
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Failed to delete review");
            }
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <FaStar
                        key={index}
                        className={`${index + 1 <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                            } text-sm`}
                    />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
            </div>
        );
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
            <div className="container min-h-[50vh] mx-auto px-4 py-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
                    My Reviews
                </h2>
                <div className="w-[100%]">
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <p className="text-lg">No reviews or ratings found.</p>
                                <p>Start rating products you ordered!</p>
                                <button
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    onClick={() => navigate("/products")}
                                >
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            reviews.map((item, index) => {

                                console.log("item", item);

                                const name = item?.productMainStockId?.name || "Unnamed Product";
                                const description = item?.productMainStockId?.description || "";
                                const reviewText = item?.description || "No review provided";
                                const rating = item?.rating || 0;
                                const image =
                                    item?.productMainStockId?.images?.[0] ||
                                    "https://via.placeholder.com/80";

                                return (
                                    <div
                                        key={item._id || index}
                                        className={`w-[100%] bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-shadow duration-200`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    className="w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                                />
                                            </div>

                                            {/* Review Content */}
                                            <div className="flex-1 mt-4 md:mt-0">
                                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                                                    {name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                    {description || "No description available"}
                                                </p>
                                                <div className="mb-2">{renderStars(rating)}</div>
                                                <p className="text-gray-700 dark:text-gray-200 text-base">
                                                    {reviewText}
                                                </p>
                                                {item.images?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {item?.images && item?.images?.length > 0 ? item?.images.map((img, imgIndex) => (
                                                            <img
                                                                key={imgIndex}
                                                                src={img}
                                                                alt={`Review ${imgIndex + 1}`}
                                                                className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                                            />
                                                        )) :

                                                            <div>No Image uploaded</div>
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 mt-4 md:mt-0 md:ml-auto">
                                                <button
                                                    onClick={() => handleEditReview(item._id, item?.productStock?._id, item?.productMainStockId?._id)}
                                                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                                    title="Edit Review"
                                                >
                                                    <FaEdit />
                                                    <span className="hidden md:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(item._id)}
                                                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                                                    title="Delete Review"
                                                >
                                                    <FaTrash />
                                                    <span className="hidden md:inline">Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="w-[100%]">
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default ListRatingAndReview;