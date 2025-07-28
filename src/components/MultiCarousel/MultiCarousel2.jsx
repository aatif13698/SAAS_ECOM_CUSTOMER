

import React, { useState, useEffect } from "react";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

// Secret key for encryption (store this securely in .env in production)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
  // URL-safe encoding
  return encodeURIComponent(encrypted);
};

const MultiCarousel2 = ({
  productData,
  items = productData,
  slidesToScroll = 1,
}) => {

  console.log("items", items);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const handleCardClick = (productId) => {
    const encryptedId = encryptId(productId);
    navigate(`/product/${encryptedId}`);
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(2);
      } else if (width < 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(7);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    // Simulate loading state - remove this and set isLoading based on your actual data fetch
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
      clearTimeout(timer);
    };
  }, []);

  const totalItems = items.length;
  const maxIndex = Math.max(totalItems - visibleCount, 0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + slidesToScroll;
      if (newIndex > maxIndex) {
        newIndex = 0;
      }
      return newIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex - slidesToScroll;
      if (newIndex < 0) {
        newIndex = maxIndex;
      }
      return newIndex;
    });
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div
      className="p-2 flex-shrink-0"
      style={{ width: `${100 / visibleCount}%` }}
    >
      <div className="bg-white h-[20rem] flex flex-col rounded overflow-hidden">
        <Skeleton height={224} width="100%" />
        <div className="p-4">
          <Skeleton height={24} width="60%" />
          <Skeleton height={16} width="40%" style={{ marginTop: 8 }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
        }}
      >
        {isLoading
          ? Array(visibleCount)
            .fill()
            .map((_, index) => <SkeletonCard key={index} />)
          : items.map((item) => {
            const title = item?.product?.name?.slice(0, 10);
            // const costInRupee = item?.priceOptions[0]?.price;
            return (
              <div
                key={item._id}
                className="p-2 flex-shrink-0 cursor-pointer"
                style={{ width: `${100 / visibleCount}%` }}
                onClick={() => handleCardClick(item._id)}
              >
                <div className="bg-white h-[20rem] flex flex-col justify-center items-center rounded overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/productBluePrint/${item?.product?.images[0]
                      }`}
                    alt={item?.product?.name}
                    className="w-[14rem] h-[14rem] object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p
                      className="text-sm text-black font-bold"
                      style={{ fontFamily: "'Noto Sans', Arial, sans-serif" }}
                    >
                      ₹ {item?.normalSaleStock[0]?.variant?.priceId?.price[0]?.unitPrice}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {!isLoading && (
        <>
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
        </>
      )}
    </div>
  );
};

export default MultiCarousel2;
