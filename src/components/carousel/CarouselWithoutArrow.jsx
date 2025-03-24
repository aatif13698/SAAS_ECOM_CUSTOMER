import React from "react";
import Slider from "react-slick";
import useDarkmode from "../../Hooks/useDarkMode";
import useWidth from "../../Hooks/useWidth";
import product from "../../constant/images"



const CarouselWithoutArrow = ({data, title}) => {

    const { width, breakpoints } = useWidth();


    const [isDark] = useDarkmode();

    var settings = {
        dots: (width > breakpoints) ? true : false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 10000,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    

    return (
        <div className={`py-2 ${title == "Offers On Laptops" ? "bg-cardBg2" : "bg-cardBg1"}   md:rounded-none rounded-lg mb-4`}>
            <div className="">
                <div className=" py-4">
                    <span className='font-bold text-lg px-4'>{title}</span>

                </div>

                {/* Testimonial cards */}
                <div data-aos="zoom-in">
                    <Slider {...settings}>
                        {data.map((data) => (
                            //   <div className="my-6 ">
                            //     <div
                            //       key={data.id}
                            //       className={`flex flex-col gap-4 shadow-sm py-8 px-6 mx-4 rounded-xl ${isDark ? "bg-dark/40" : "bg-light"} relative`}
                            //     >
                            //       <div className="mb-4">
                            //         <img
                            //           src={data.img}
                            //           alt=""
                            //           className="rounded-full w-20 h-20"
                            //         />
                            //       </div>
                            //       <div className="flex flex-col items-center gap-4">
                            //         <div className="space-y-3">
                            //           <p className="text-xs text-gray-500">{data.text}</p>
                            //           <h1 className="text-xl font-bold text-black/80 dark:text-light">
                            //             {data.name}
                            //           </h1>
                            //         </div>
                            //       </div>
                            //       <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                            //         ,,
                            //       </p>
                            //     </div>
                            //   </div>

                            <div
                                key={data.id}
                                className="p-2 flex-shrink-0"
                            >
                                <div className="bg-white h-[20rem] flex flex-col justify-center items-center rounded shadow-md overflow-hidden">
                                    <img
                                        src={data.img}
                                        alt={data.name}
                                        className="w-[14rem] h-[14rem] object-contain"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-2">{data.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default CarouselWithoutArrow;
