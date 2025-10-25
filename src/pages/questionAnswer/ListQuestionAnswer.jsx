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


const ListQuestionAnswer = () => {
    const [isDark] = useDarkmode();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { width, breakpoints } = useWidth();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0)

    useEffect(() => {
        getReviewsAndRating();
    }, [refreshCount]);

    async function getReviewsAndRating() {
        try {
            setIsPageLoading(true);
            const response = await customerService.getQuestionAnswer(null);
            setQuestions(response?.data?.questions || []);
            setIsPageLoading(false);
        } catch (error) {
            setQuestions([]);
            console.error("Error while fetching questions:", error);
            toast.error("Failed to load questions");
            setIsPageLoading(false);
        }
    }

  
    const handleDeleteQuestion = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {

                await customerService.deleteQuestion(reviewId, import.meta.env.VITE_DATABASE_ID); // Assume customerService has a deleteReview method
                // setQuestions(questions.filter((review) => review._id !== reviewId));
                setRefreshCount((prev) => prev + 1);
                toast.success("Question deleted successfully");
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
                    My Questions
                </h2>
                <div className="w-[100%]">
                    <div className="space-y-6">
                        {questions.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <p className="text-lg">No Questions Found.</p>
                                <p>Star asking question!</p>
                                <button
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    onClick={() => navigate("/products")}
                                >
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            questions.map((item, index) => {

                                console.log("item", item);

                                const name = item?.productMainStockId?.name || "Unnamed Product";
                                const description = item?.productMainStockId?.description || "";
                                const question = item?.question || "No review provided";
                                const answer = item?.answer || "No answer provided";
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
                                                <p className="text-gray-700 dark:text-gray-200 text-base">
                                                   <span className="font-bold">Q:</span>  {question}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-200 text-base">
                                                     <span className="font-bold">A:</span>  {answer || "No answer available"}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 mt-4 md:mt-0 md:ml-auto">
                                                <button
                                                    onClick={() => handleDeleteQuestion(item._id)}
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

export default ListQuestionAnswer;