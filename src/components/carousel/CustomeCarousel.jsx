import React, { useState } from 'react';
import images from '../../constant/images';
import { GoArrowRight } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";



// Sample carousel data with background images
const carouselData = [
  {
    id: 1,
    title: 'Delicious Pizza',
    description:
      'Experience the taste of freshly baked pizza with extra cheese and toppings.',
    bgImage: images.loginIlustration,
  },
  {
    id: 2,
    title: 'Tasty Burger',
    description:
      'Savor our juicy burger with a side of crispy fries for the perfect meal.',
    bgImage: images.loginIlustration,
  },
  {
    id: 3,
    title: 'Fresh Salad',
    description:
      'Enjoy a healthy and refreshing salad made with organic ingredients.',
    bgImage: images.loginIlustration,
  },
];

const CustomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselData.length - 1 : prev - 1
    );
  };

  // Navigate to the next slide
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === carouselData.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative   overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselData.map((item) => (
          <div
            key={item.id}
            className="w-full flex-shrink-0  md:h-[32rem] h-[24rem]  flex flex-col items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: `url(${item.bgImage})` }}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative text-center text-white">
              <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
              <p className="mb-4">{item.description}</p>
              <div className="flex gap-4 justify-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                  Place Order
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                  Explore More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4  transform -translate-y-1/2 bg-lightText hover:bg-gray-300 text-dark p-2 rounded-full"
      >
        {/* &#8592; */}
        <GoArrowLeft size={30}/>
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-lightText hover:bg-gray-300 text-dark p-2 rounded-full"
      >
        {/* &#8594; */}
        <GoArrowRight size={30}/>
      </button>
    </div>
  );
};

export default CustomCarousel;
