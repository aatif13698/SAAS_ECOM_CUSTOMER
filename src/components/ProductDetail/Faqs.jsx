import { useState, useEffect, useCallback } from 'react';
import { MdQuestionMark, MdOutlineVerifiedUser } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import productService from '../../services/productService';



const Faqs = ({
    productStockId,
    productMainStockId,
    customerData,
    filteredProduct,
    isDark,
    setShowQuestionModel, // function to open "Post Question" modal
}) => {
    const [qas, setQas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalQAs, setTotalQAs] = useState(0);
    const [limit] = useState(10); // fixed at 10 (can be made dynamic later)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Updated service call with pagination
    const fetchQa = useCallback(async (page = 1) => {
        if (!productStockId || !productMainStockId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await productService.getFaqs(
                productStockId,
                productMainStockId,
                page,
                limit
            );

            setQas(response?.qa || []);
            setTotalQAs(response?.total || 0);
            setCurrentPage(response?.page || page);
        } catch (err) {
            console.error('Error fetching QA:', err);
            setError(err?.message || 'Failed to load questions');
            setQas([]);
        } finally {
            setLoading(false);
        }
    }, [productStockId, productMainStockId, limit]);

    // Fetch when product changes or page changes
    useEffect(() => {
        fetchQa(currentPage);
    }, [fetchQa, currentPage]);

    // Reset to page 1 when product changes
    useEffect(() => {
        setCurrentPage(1);
        setQas([]);
    }, [productStockId, productMainStockId]);

    const totalPages = Math.ceil(totalQAs / limit) || 1;

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 mx-auto my-4 bg-white dark:bg-darkSecondary">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-2">
                    <h2
                        className={`${isDark ? 'text-white' : 'text-gray-800'
                            } md:text-xl text-base font-semibold`}
                    >
                        FAQs
                    </h2>
                    {totalQAs > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-sm">
                                ({totalQAs} QA{totalQAs !== 1 ? 's' : ''})
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
                {loading ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Loading questions...
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                ) : qas.length > 0 ? (
                    <div className="space-y-6 h-[40vh] overflow-y-scroll">
                        {qas.map((item, index) => (
                            <div
                                key={item?._id || index} // Use real _id if available
                                className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                            >
                                <div className="flex items-start gap-2 mb-3">
                                    <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                                        Q: {item.question}
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 pl-1">
                                    A: {item.answer}
                                </p>

                                {item?.isPredefined ? (
                                    <div className="flex items-center gap-1 text-xs">
                                        <MdOutlineVerifiedUser className="text-emerald-500" />
                                        <span className="font-semibold text-gray-400">Vendor Verified</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-xs">
                                        <FaRegUser className="text-blue-500" />
                                        <span className="font-semibold text-gray-400">Verified Customer</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No faq found.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalQAs > limit && (
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-sm">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        ← Previous
                    </button>

                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                        Page <span className="font-medium text-gray-700 dark:text-gray-300">{currentPage}</span> of{' '}
                        <span className="font-medium text-gray-700 dark:text-gray-300">{totalPages}</span>
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default Faqs;