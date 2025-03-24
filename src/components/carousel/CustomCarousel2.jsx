import React, { useState, useEffect } from 'react';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import images from '../../constant/images';

// Sample product data
const productData = [
    {
        id: 1,
        title: 'Product 1',
        image: images.one,
        description: 'Description for product 1.',
    },
    {
        id: 2,
        title: 'Product 2',
        image: images.two,
        description: 'Description for product 2.',
    },
    {
        id: 3,
        title: 'Product 3',
        image: images.three,
        description: 'Description for product 3.',
    },
    {
        id: 4,
        title: 'Product 4',
        image: images.four,
        description: 'Description for product 4.',
    },
    {
        id: 5,
        title: 'Product 5',
        image: images.five,
        description: 'Description for product 5.',
    },
    {
        id: 6,
        title: 'Product 6',
        image: images.six,
        description: 'Description for product 6.',
    },
    {
        id: 7,
        title: 'Product 7',
        image: images.seven,
        description: 'Description for product 7.',
    },
    {
        id: 8,
        title: 'Product 8',
        image: images.eight,
        description: 'Description for product 5.',
    },
    {
        id: 9,
        title: 'Product 9',
        image: images.nine,
        description: 'Description for product 6.',
    },
    {
        id: 10,
        title: 'Product 10',
        image: images.ten,
        description: 'Description for product 7.',
    },
    {
        id: 11,
        title: 'Product 11',
        image: images.eleven,
        description: 'Description for product 5.',
    },
    {
        id: 12,
        title: 'Product 12',
        image: images.one,
        description: 'Description for product 6.',
    },
    {
        id: 13,
        title: 'Product 13',
        image: images.two,
        description: 'Description for product 7.',
    }
    // Add more products as needed
];

const CustomCarousel2 = ({
    items = productData,
    slidesToScroll = 1, // number of cards to move per click
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(7);

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

    const totalItems = items.length;
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

    return (
        <div className="relative  overflow-hidden ">
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                    // Calculate translateX based on current index and the visible count
                    transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
                }}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="p-2 flex-shrink-0"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                        <div className=" h-[20rem] flex md:flex-row flex-col  bg-cover bg-no-repeat bg-center justify-around items-center rounded overflow-hidden"
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-[16rem] md:block hidden h-[18rem] object-contain"
                            />
                            <div className="relative text-center text-white">
                                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                                <p className="mb-4">{item.description}</p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                    style={{fontSize : "clamp(.70rem, .60vw + .30rem, 3rem"}}
                                     className="bg-cardBg2 hover:bg-cardBg2/80 text-black font-semibold py-2 px-4 rounded">
                                        Place Order
                                    </button>
                                    <button 
                                    style={{fontSize : "clamp(.70rem, .60vw + .30rem, 3rem"}}
                                    className="bg-cardBg1 hover:bg-cardBg1/80 text-black font-semibold py-2 px-4 rounded">
                                        Explore More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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
