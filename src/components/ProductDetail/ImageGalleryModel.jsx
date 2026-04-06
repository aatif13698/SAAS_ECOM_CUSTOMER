import { Fragment, useState, useEffect } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { RxCross2, RxChevronLeft, RxChevronRight } from 'react-icons/rx';

/**
 * ImageGalleryModal - Modern, accessible image carousel modal
 * Replaces the original single-image modal with full carousel support.
 * 
 * Props:
 * - isModalOpen: boolean
 * - closeModal: () => void
 * - selectedReviewImages: string[] (array of image URLs)
 * - initialIndex?: number (default 0)
 * - noFade?: boolean (skip animations)
 */
const ImageGalleryModal = ({
    isModalOpen,
    closeModal,
    selectedReviewImages = [],
    initialIndex = 0,
    noFade = false,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Reset index when modal opens or images change
    useEffect(() => {
        if (isModalOpen && selectedReviewImages.length > 0) {
            setCurrentIndex(Math.min(initialIndex, selectedReviewImages.length - 1));
        }
    }, [isModalOpen, initialIndex, selectedReviewImages]);

    const goToPrev = () => {
        if (selectedReviewImages.length <= 1) return;
        setCurrentIndex((prev) =>
            prev === 0 ? selectedReviewImages.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        if (selectedReviewImages.length <= 1) return;
        setCurrentIndex((prev) =>
            prev === selectedReviewImages.length - 1 ? 0 : prev + 1
        );
    };

    // Keyboard navigation (← → arrows)
    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrev();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, selectedReviewImages.length]);

    // No images → don't render
    if (!selectedReviewImages.length) return null;

    const currentImage = selectedReviewImages[currentIndex];

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[99999]"
                onClose={closeModal}
            >
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter={noFade ? '' : 'duration-300 ease-out'}
                    enterFrom={noFade ? '' : 'opacity-0'}
                    enterTo={noFade ? '' : 'opacity-100'}
                    leave={noFade ? '' : 'duration-200 ease-in'}
                    leaveFrom={noFade ? '' : 'opacity-100'}
                    leaveTo={noFade ? '' : 'opacity-0'}
                >
                    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal container */}
                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? '' : 'duration-300 ease-out'}
                        enterFrom={noFade ? '' : 'opacity-0 scale-95'}
                        enterTo={noFade ? '' : 'opacity-100 scale-100'}
                        leave={noFade ? '' : 'duration-200 ease-in'}
                        leaveFrom={noFade ? '' : 'opacity-100 scale-100'}
                        leaveTo={noFade ? '' : 'opacity-0 scale-95'}
                    >
                        <Dialog.Panel className="w-full max-w-4xl mx-auto bg-white dark:bg-darkSecondary rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 md:py-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                {/* Image counter */}
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {currentIndex + 1} / {selectedReviewImages.length}
                                </div>

                                {/* Close button - matches original styling */}
                                <button
                                    onClick={closeModal}
                                    className="transition-colors"
                                    aria-label="Close preview"
                                >
                                    <RxCross2
                                        size={28}
                                        className="text-red-600 bg-red-100 dark:bg-red-950 rounded-full p-1 border-2 border-red-200 dark:border-red-900 hover:bg-red-200 dark:hover:bg-red-900"
                                    />
                                </button>
                            </div>

                            {/* Image carousel container */}
                            <div className="relative bg-black flex items-center justify-center p-4 md:p-8 min-h-[60vh] md:min-h-[70vh]">
                                <img
                                    src={currentImage}
                                    alt={`Preview image ${currentIndex + 1} of ${selectedReviewImages.length}`}
                                    className="w-full h-[70vh] object-contain rounded-lg select-none"
                                    draggable={false}
                                    onError={(e) => {
                                        // Optional fallback for broken images
                                        e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                    }}
                                />

                                {/* Navigation arrows - only when multiple images */}
                                {selectedReviewImages.length > 1 && (
                                    <>
                                        {/* Left arrow */}
                                        <button
                                            onClick={goToPrev}
                                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-gray-900 dark:text-white p-3 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 z-20"
                                            aria-label="Previous image"
                                        >
                                            <RxChevronLeft className='md:text-sl text-base ' />
                                        </button>

                                        {/* Right arrow */}
                                        <button
                                            onClick={goToNext}
                                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-gray-900 dark:text-white p-3 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 z-20"
                                            aria-label="Next image"
                                        >
                                            <RxChevronRight className='md:text-sl text-base ' />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Optional footer hint */}
                            {selectedReviewImages.length > 1 && (
                                <div className="px-6 py-3 text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
                                    <span>Use arrow keys or click arrows to navigate</span>
                                </div>
                            )}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ImageGalleryModal;