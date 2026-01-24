import React, { Fragment, useEffect, useState } from "react";
import { FaBox, FaHeart, FaQuestionCircle, FaHeadset, FaUser, FaMapMarkerAlt, FaLanguage, FaBell, FaShieldAlt, FaStar, FaSignOutAlt, FaChevronRight, FaTrash } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import { logOut } from "../../store/reducer/auth/authCustomerSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useDarkmode from "../../Hooks/useDarkMode";
import { isDraft } from "@reduxjs/toolkit";
import { Dialog, Transition } from "@headlessui/react";
import customerService from "../../services/customerService";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";


function ListQuery({ noFade }) {

    const { width, breakpoints } = useWidth();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isDark] = useDarkmode();

    const [showQuestionModel, setShowQuestionModel] = useState(false);
    const [postQuestionResponseError, setPostQuestionResponseError] = useState(null)
    const [question, setQuestion] = useState("");





    async function handlePostQuestion() {
        try {
            if (question?.length == 0) {
                alert("Please enter question");
                return
            }
            const dataObject = {
                question: question,
                clientId: import.meta.env.VITE_DATABASE_ID
            }
            const reposnse = await customerService.postQuery(dataObject);
            setQuestion("");
            setPostQuestionResponseError(null);
            setShowQuestionModel(false);
            toast.success("Query posted successfully.");
             setRefreshCount((prev) => prev + 1);

        } catch (error) {
            setPostQuestionResponseError(error)
        }

    }


    const [isPageLoading, setIsPageLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0)

    useEffect(() => {
        getReviewsAndRating();
    }, [refreshCount]);

    async function getReviewsAndRating() {
        try {
            setIsPageLoading(true);
            const response = await customerService.getQueries(null);
            setQuestions(response?.data?.queries || []);
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

                await customerService.deleteQuery(reviewId, import.meta.env.VITE_DATABASE_ID); // Assume customerService has a deleteReview method
                // setQuestions(questions.filter((review) => review._id !== reviewId));
                setRefreshCount((prev) => prev + 1);
                toast.success("Question deleted successfully");
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Failed to delete review");
            }
        }
    };


     if (isPageLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }



    return (
        <div className="container  py-6 ">
            <div className="container min-h-[50vh] mx-auto px-4 py-8">
                <div className="flex justify-between items-center">

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
                        My Queries
                    </h2>
                    <button
                        className=" bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        onClick={() => setShowQuestionModel(true)}
                    >
                        Ask Query
                    </button>
                </div>

                <div className="w-[100%]">
                    <div className="space-y-6">
                        {questions.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <p className="text-lg">No Query Found.</p>
                                <p>Star asking query!</p>
                                <button
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    onClick={() => setShowQuestionModel(true)}
                                >
                                    Ask Now
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

                                            {/* Review Content */}
                                            <div className="flex-1  md:mt-0">
                                                <p className="text-gray-700 dark:text-gray-200 text-base">
                                                    <span className="font-bold">Q:</span>  {question}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-200 text-base">
                                                    <span className="font-bold">A:</span>  {answer || "No answer available"}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3  md:mt-0 md:ml-auto">
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


            <Transition appear show={showQuestionModel} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={() => setShowQuestionModel(false)}>
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
                            <Dialog.Panel className={`md:w-[70%] w-[100%] max-w-4xl relative ${isDark ? " bg-gray-800" : " bg-white"}  dark: rounded-md shadow-xl p-6`}>
                                <span className="absolute right-4 top-4">
                                    <button onClick={() => setShowQuestionModel(false)}>
                                        <RxCross2 size={24} className="text-red-600 bg-red-100 rounded-full p-1 border-2" />
                                    </button>
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[100%]">
                                    {/* Left Section: Guidelines */}
                                    <div className="flex flex-col justify-start p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                                        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200">Guidelines for Asking Questions</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                            <li>Be specific, ask questions only about the product.</li>
                                            <li>Ensure you have gone through the product specifications before posting your question.</li>
                                            <li>Reach out to Flipkart customer care for queries related to offers, orders, delivery etc.</li>
                                        </ul>
                                    </div>
                                    {/* Right Section: Form */}
                                    <div className="flex flex-col">
                                        {/* Header Subsection */}
                                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Post your query</h2>
                                        {/* Main Content Subsection */}
                                        <div className="flex flex-col space-y-4">
                                            <textarea
                                                onChange={(e) => setQuestion(e.target.value)}
                                                className="w-[100%] h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                                placeholder="Type your question here..."
                                            // Add state and onChange handler as needed
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handlePostQuestion}
                                                    className="group relative px-4 py-2 border-2 border-lightButton text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                                                // Add onClick handler for submission
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-red-500"> {postQuestionResponseError}</span>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>



        </div>
    );
}



export default ListQuery;
