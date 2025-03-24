import React, { useState, useEffect } from 'react';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import images from '../../constant/images';

// Sample product data


const MultiCarousel = ({
    productData,
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
        setVisibleCount(2); // small screens (mobile)
      } else if (width < 1024) {
        setVisibleCount(4); // medium screens (tablet)
      } else {
        setVisibleCount(7); // large screens (desktop)
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
            <div className="bg-white h-[20rem] flex flex-col justify-center items-center rounded overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-[14rem] h-[14rem] object-contain"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
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

export default MultiCarousel;
