import { useState } from "react";
import "./ProductDetail.css"
import Footer from "../footer/Footer";
import useWidth from "../../Hooks/useWidth";
import CarouselWithoutArrow from "../carousel/CarouselWithoutArrow";
import products from "../../constant/data"
import CustomCarousel2 from "../carousel/CustomCarousel2";
import OneDivissionProducts from "../OneDivissionProducts/OneDivissionProducts";
import images from "../../constant/images";
import ProductList from "../ProductList/ProductList";
import Testimonials from "../testimonial/Testemonial";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {

    const sampleProduct = {
        image: [
            images.phn1,
            images.phn2,
            images.phn3,
            images.phn4,
        ],
        title: "vivo T3 5G (Crystal Flake, 128 GB)  (8 GB RAM)",
        description: "This is a great product with excellent features.",
        price: "1,999",
        offers: ["10% off on first purchase", "Free shipping on orders above ₹500"],
        specifications: ["Color: Black", "Weight: 1.2kg", "Warranty: 1 year"],
        reviews: [
            { user: "John Doe", comment: "Great product! Totally worth it." },
            { user: "Jane Smith", comment: "Quality is amazing, fast delivery." },
        ],
    };

    const product = sampleProduct

    const { width, breakpoints } = useWidth();

    const { image, title, description, price, offers, specifications, reviews } = product;

    // State to track the selected image
    const [selectedImage, setSelectedImage] = useState(image[0]);

    return (

        <div className=' w-[100%] flex md:px-8 sm:px-0  '
        >
            <div className={`${width > breakpoints.xl ? "w-[100%]" : "w-[100%]"}`}>

                <div className="bg-white w-[100%] overflow-hidden my-3 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                        <div className=" w-[100%] ">
                            <div className=" w-[100%] object-cover md:h-96 h-80 flex justify-center items-center md:border-2 sm:border-0 rounded-lg mx-2">
                                <img
                                    src={selectedImage}
                                    alt="Product"
                                    className="w-[100%] h-[100%] object-contain rounded-lg"
                                />
                            </div>
                            <div className="flex gap-2 mt-4 mb-4 justify-center">
                                {image.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="Thumbnail"
                                        className={`w-16 h-16 object-cover border-2 rounded-lg p-2 cursor-pointer transition-all ${selectedImage === img ? "border-red-500 border-3 p-0 " : "border-gray-300"
                                            }`}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                ))}
                            </div>

                            {
                                width > breakpoints.md ?
                                    <div className="flex justify-around  gap-4 mx-2">
                                        <button className="px-6 py-2 h-[4rem] w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65">
                                            <span>Buy Now</span>
                                        </button>
                                        <button className="px-6 py-2 h-[4rem]  w-[50%] bg-addToCartBUtton text-white font-semibold rounded-lg hover:bg-addToCartBUtton/65">
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                    : ""
                            }

                        </div>

                        <div className={`space-y-4 md:h-[70vh] ${width > breakpoints.md ? "h-[90vh] overflow-auto scrollbar-hide" : ""}   px-3 md:px-0`}>
                            <h1 className="text-2xl font-semibold">{title}</h1>
                            <p className="text-lg text-gray-700">{description}</p>
                            <p className="text-xl font-bold text-red-600">₹{price}</p>
                            {offers && (
                                <div className="bg-green-100 p-2 rounded-md">
                                    <h3 className="text-green-600 font-semibold">Offers:</h3>
                                    <ul className="list-disc ml-4 text-gray-600">
                                        {offers.map((offer, index) => (
                                            <li key={index}>{offer}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">Specifications:</h3>
                                <ul className="list-disc ml-4 text-gray-600">
                                    {specifications.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Reviews:</h3>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div key={index} className="border p-2 rounded-md my-2">
                                            <p className="font-semibold">{review.user}</p>
                                            <p className="text-gray-600">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No reviews yet.</p>
                                )}
                            </div>
                            {
                                width > breakpoints.md ? "" :
                                    <div className="flex gap-4">
                                        <button className="px-6 py-2 h-[4rem] w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65">
                                            <span>Buy Now</span>
                                        </button>
                                        <button className="px-6 py-2 h-[4rem]  w-[50%] bg-addToCartBUtton text-white font-semibold rounded-lg hover:bg-addToCartBUtton/65">
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                            }

                            <div className="mt-10">
                                <h3 className="text-xl font-semibold">More Product Information</h3>
                                <p className="text-gray-600">
                                    This product is designed to meet the highest standards of quality and performance.
                                </p>
                            </div>
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
                                <p className="text-gray-600">
                                    Our return policy ensures customer satisfaction. You can return the product within 30 days.
                                </p>
                            </div>

                            <div className="mt-10">
                                <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
                                <p className="text-gray-600">
                                    Our return policy ensures customer satisfaction. You can return the product within 30 days.
                                </p>
                            </div>
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
                                <p className="text-gray-600">
                                    Our return policy ensures customer satisfaction. You can return the product within 30 days.
                                </p>
                            </div>
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
                                <p className="text-gray-600">
                                    Our return policy ensures customer satisfaction. You can return the product within 30 days.
                                </p>
                            </div>
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
                                <p className="text-gray-600">
                                    Our return policy ensures customer satisfaction. You can return the product within 30 days.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="mt-10 px-3 md:px-0">
                    <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
                    <p className="text-gray-600">
                        Our return policy ensures customer satisfaction. You can return the product within 30 days.
                    </p>
                </div>

                <div className="mt-10 px-3 md:px-0">
                    <h3 className="text-xl font-semibold">Similar Products</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="border p-2 rounded-lg">
                                <img
                                    src={images[1]}
                                    alt="Similar Product"
                                    className="w-full h-24 object-contain"
                                />
                                <p className="text-sm text-gray-700 mt-2">Product {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 px-3 md:px-0">
                    <h3 className="text-xl font-semibold">More Product Information</h3>
                    <p className="text-gray-600">
                        This product is designed to meet the highest standards of quality and performance.
                    </p>
                </div>

                <div className="mt-10 px-3 md:px-0">
                    <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
                    <p className="text-gray-600">
                        Our return policy ensures customer satisfaction. You can return the product within 30 days.
                    </p>
                </div>

                <div className="mt-10 mb-3 px-3 md:px-0">
                    <h3 className="text-xl font-semibold">Similar Products</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="border p-2 rounded-lg">
                                <img
                                    src={images[2]}
                                    alt="Similar Product"
                                    className="w-full h-24 object-contain"
                                />
                                <p className="text-sm text-gray-700 mt-2">Product {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <CarouselWithoutArrow data={products.mobileData} title={"Similar Products"} />
                </div>

                <div className='flex flex-col bg-red-300 items-center justify-center'>
                    <div className={`${width < breakpoints.sm ? "w-[100%]" : "w-[100%]"}  flex flex-col justify-center gap-3 items-center`}>
                        <Footer />
                    </div>
                </div>

            </div>

        </div>


    );
};

export default ProductDetail;

