import { useEffect, useState } from "react";
import "./ProductDetail.css";
import Footer from "../footer/Footer";
import useWidth from "../../Hooks/useWidth";
import CarouselWithoutArrow from "../carousel/CarouselWithoutArrow";
import products from "../../constant/data";
import Skeleton from "react-loading-skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CryptoJS from "crypto-js";
import productService from "../../services/productService";
import { useParams } from "react-router-dom";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";

// Secret key for decryption (same as used for encryption)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const decryptId = (encryptedId) => {
  try {
    const decoded = decodeURIComponent(encryptedId);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

const ProductDetail = () => {
  const { productId: encryptedId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const decryptedId = decryptId(encryptedId);
      if (!decryptedId) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }
      try {
        const response = await productService.getParticularProductData(
          decryptedId
        );
        const data = response?.data;
        setProductData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product details");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [encryptedId]);

  const { width, breakpoints } = useWidth();

  const [productSpecificData, setProductSpecificData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);

  console.log("selectedPriceOption", selectedPriceOption);

  useEffect(() => {
    if (productData) {
      setProductSpecificData(productData?.product);
      setSelectedImage(
        `${import.meta.env.VITE_API_URL}/productBluePrint/${
          productData?.product?.images[0]
        }`
      );
      const priceOPtions = productData?.priceOptions;
      console.log("priceOPtions", priceOPtions);

      if (priceOPtions.length > 0) {
        setSelectedPriceOption(priceOPtions[0]);
      }
    }
  }, [productData]);

  async function handleAddToCart() {
    setIsLoading(true);
    try {
      const dataObject = {
        productStockId: productData?._id,
        quantity: 1,
        priceOption: selectedPriceOption,
        sessionId: null,
      };
      const response = await customerService.addToCart(dataObject);
      toast.success(response?.data?.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error while adding to cart", error);
    }
  }

  if (loading) {
    return (
      <div className="w-full flex md:px-8 sm:px-0">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-3 py-4">
            <div>
              <Skeleton height={384} />
              <div className="flex gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} width={64} height={64} />
                ))}
              </div>
            </div>
            <div className="space-y-4 px-3 md:px-0">
              <Skeleton height={32} width="80%" />
              <Skeleton height={20} width="60%" />
              <Skeleton height={24} width="40%" />
              <Skeleton height={100} />
              <Skeleton height={150} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-[100%] flex md:px-8 sm:px-0  ">
      <div className={`${width > breakpoints.xl ? "w-[100%]" : "w-[100%]"}`}>
        <div className="bg-white w-[100%] overflow-hidden my-3 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            <div className=" w-[100%] ">
              <div className=" w-[100%] object-cover md:h-96 h-80 flex justify-center items-center md:border-2 sm:border-0 rounded-lg ">
                <img
                  src={selectedImage}
                  alt="Product"
                  className="w-[100%] md:py-4 py-2 h-[100%] object-contain rounded-lg"
                />
              </div>
              <div className="flex gap-2 mt-4 mb-4 justify-center">
                {productSpecificData?.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/productBluePrint/${img}`}
                    alt="Thumbnail"
                    className={`w-16 h-16 object-cover border-2 rounded-lg p-2 cursor-pointer transition-all ${
                      selectedImage ===
                      `${import.meta.env.VITE_API_URL}/productBluePrint/${img}`
                        ? "border-red-500 border-3 p-0 "
                        : "border-gray-300"
                    }`}
                    onClick={() =>
                      setSelectedImage(
                        `${
                          import.meta.env.VITE_API_URL
                        }/productBluePrint/${img}`
                      )
                    }
                  />
                ))}
              </div>

              {width > breakpoints.md ? (
                <div className="flex justify-around  gap-4 mx-2">
                  <button className="px-6 py-2 h-[4rem] w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65">
                    <span>Buy Now</span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className={`px-6 py-2 h-[4rem] w-[50%] bg-addToCartBUtton text-white font-semibold rounded-lg ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-addToCartBUtton/65"
                    }`}
                    disabled={isLoading} // Disable button when loading
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                          />
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>

            <div
              className={`space-y-4 md:h-[70vh] ${
                width > breakpoints.md
                  ? "h-[90vh] overflow-auto scrollbar-hide"
                  : ""
              }   px-3 md:px-0`}
            >
              <h1 className="text-2xl font-semibold">
                {productSpecificData?.name}
              </h1>
              {/* <p className="text-lg text-gray-700">{description}</p> */}
              {/* <p className="text-xl font-bold text-red-600">₹{price}</p> */}
              {/* price options */}
              {productData?.priceOptions && (
                <div className=" p-2 rounded-md">
                  <h3 className="text-green-600 font-semibold">
                    Price option:
                  </h3>
                  <ul className="list-disc ml-4 text-gray-600">
                    {productData?.priceOptions.map((data, index) => (
                      <li className="my-2" key={index}>
                        {" "}
                        <span className="bg-blue-100 w-auto py-1 px-2 rounded-sm">
                          ₹{data?.price} for {data?.quantity}/{data?.unit}
                        </span>{" "}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* {offers && (
                <div className="bg-green-100 p-2 rounded-md">
                  <h3 className="text-green-600 font-semibold">Offers:</h3>
                  <ul className="list-disc ml-4 text-gray-600">
                    {offers.map((offer, index) => (
                      <li key={index}>{offer}</li>
                    ))}
                  </ul>
                </div>
              )} */}
              {/* <div>
                <h3 className="text-lg font-semibold">Specifications:</h3>
                <ul className="list-disc ml-4 text-gray-600">
                  {specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div> */}
              {/* <div>
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
              </div> */}
              {width > breakpoints.md ? (
                ""
              ) : (
                <div className="flex gap-4">
                  <button className="px-6 py-2 h-[4rem] w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65">
                    <span>Buy Now</span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-2 h-[4rem]  w-[50%] bg-addToCartBUtton text-white font-semibold rounded-lg hover:bg-addToCartBUtton/65"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                          />
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-10">
                <h3 className="text-xl font-semibold">
                  More Product Information
                </h3>
                <p className="text-gray-600">
                  This product is designed to meet the highest standards of
                  quality and performance.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 px-3 md:px-0">
          <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
          <p className="text-gray-600">
            Our return policy ensures customer satisfaction. You can return the
            product within 30 days.
          </p>
        </div>

        <div className="mt-10 px-3 md:px-0">
          <h3 className="text-xl font-semibold">Similar Products</h3>
          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border p-2 rounded-lg">
                <img
                  src={images[1]}
                  alt="Similar Product"
                  className="w-full h-24 object-contain"
                />
                <p className="text-sm text-gray-700 mt-2">
                  Product {index + 1}
                </p>
              </div>
            ))}
          </div> */}
        </div>

        <div className="mt-10 px-3 md:px-0">
          <h3 className="text-xl font-semibold">More Product Information</h3>
          <p className="text-gray-600">
            This product is designed to meet the highest standards of quality
            and performance.
          </p>
        </div>

        <div className="mt-10 px-3 md:px-0">
          <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
          <p className="text-gray-600">
            Our return policy ensures customer satisfaction. You can return the
            product within 30 days.
          </p>
        </div>

        {/* <div className="mt-10 mb-3 px-3 md:px-0">
          <h3 className="text-xl font-semibold">Similar Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border p-2 rounded-lg">
                <img
                  src={images[2]}
                  alt="Similar Product"
                  className="w-full h-24 object-contain"
                />
                <p className="text-sm text-gray-700 mt-2">
                  Product {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        <div>
          <CarouselWithoutArrow
            data={products.mobileData}
            title={"Similar Products"}
          />
        </div>

        <div className="flex flex-col bg-red-300 items-center justify-center">
          <div
            className={`${
              width < breakpoints.sm ? "w-[100%]" : "w-[100%]"
            }  flex flex-col justify-center gap-3 items-center`}
          >
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
