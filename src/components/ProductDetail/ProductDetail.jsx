import { useEffect, useState, Fragment } from "react";
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
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";


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

const ProductDetail = ({ noFade }) => {

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [actionType, setActionType] = useState("")
  const handleCloseLoadingModal = () => {
    setShowLoadingModal(false);
  };

  const { productId: encryptedId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [isLoading2, setIsLoading2] = useState(false); // State to track loading
  const [error, setError] = useState(null);

  const { clientUser: customerData, isAuth: isLogedIn, defaultAddress, } = useSelector((state) => state?.authCustomerSlice);
  console.log("defaultAddress", defaultAddress);

  // console.log("customizationValues", customizationValues);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };


  // handle customiseable option
  const [customizationValues, setCustomizationValues] = useState({});

  // Handle input changes dynamically
  const handleInputChange = (fieldName, value) => {
    setCustomizationValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };


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
        `${import.meta.env.VITE_API_URL}/productBluePrint/${productData?.product?.images[0]
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
    const isCustomizable = productData?.product?.isCustomizable;

    if (isCustomizable == true) {
      setActionType("cart")
      setShowLoadingModal(true)
    } else {
      finalAddToCart()
    }
  }


  async function handlePlaceOrder() {
    const isCustomizable = productData?.product?.isCustomizable;

    if (isCustomizable == true) {
      setActionType("order")
      setShowLoadingModal(true)
    } else {
      finalPlaceOrder()
    }
  }

  // new
  async function finalAddToCart() {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(customizationValues).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      formData.append("productStockId", productData?._id);
      formData.append("quantity", quantity);
      formData.append("priceOption", JSON.stringify(selectedPriceOption));
      formData.append("sessionId", null);
      formData.append("clientId", import.meta.env.VITE_DATABASE_ID)
      const response = await customerService.newaddToCart(formData);
      setShowLoadingModal(false);
      toast.success(response?.data?.message);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      console.log("error while adding to cart", error);
    }
  }


  // final place order
  async function finalPlaceOrder() {
    setIsLoading2(true);
    try {
      const formData = new FormData();
      Object.entries(customizationValues).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      formData.append("productStockId", productData?._id);
      formData.append("quantity", quantity);
      formData.append("priceOption", JSON.stringify(selectedPriceOption));
      formData.append("sessionId", null);
      formData.append("addressId", defaultAddress?._id);
      formData.append("clientId", import.meta.env.VITE_DATABASE_ID);

      const response = await customerService.newPlaceOrder(formData);
      setShowLoadingModal(false);
      toast.success(response?.data?.message);
      setIsLoading2(false);

    } catch (error) {
      setIsLoading2(false);
      console.log("error while placing order", error);
    }
  }

  if (loading) {
    return (
      <div className="w-[100%] flex md:px-8 sm:px-0">
        <div className="w-[100%]">
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


  const renderFieldPreview = (field) => {
    const baseStyles = "w-[100%] p-2 border border-gray-300 rounded-md";
    const fieldName = field.labelName;
    switch (field.selectedField) {
      case 'text':
      case 'number':
      case 'email':
      case 'hyperlink':
        return (
          <input
            type={field?.selectedField}
            placeholder={field?.labelName}
            className={baseStyles}
            value={customizationValues[fieldName] || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field?.labelName}
            value={customizationValues[fieldName] || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className={`${baseStyles} min-h-[100px]`}
          />
        );
      case 'select':
      case 'multiselect':
        return (
          <select
            className={baseStyles}
            value={customizationValues[fieldName] || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
          >
            <option value="">{field?.labelName || 'Select an option'}</option>
            {field?.selectOptions?.map((opt, idx) => (
              <option key={idx} value={opt.valueName}>{opt.valueName}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={customizationValues[fieldName] || false}
            onChange={(e) => handleInputChange(fieldName, e.target.checked)}
            className="h-5 w-5 text-blue-600"
          />
        );
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleInputChange(fieldName, e.target.files[0])} // Store file object
            // accept={field?.validation?.fileTypes?.join(',')}
            className={baseStyles}
          />
        );
      default:
        return <div
        // className={baseStyles}
        >{field?.selectedField} (Preview not available)</div>;
    }
  };

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
                    src={`${import.meta.env.VITE_API_URL
                      }/productBluePrint/${img}`}
                    alt="Thumbnail"
                    className={`w-16 h-16 object-cover border-2 rounded-lg p-2 cursor-pointer transition-all ${selectedImage ===
                      `${import.meta.env.VITE_API_URL}/productBluePrint/${img}`
                      ? "border-red-500 border-3 p-0 "
                      : "border-gray-300"
                      }`}
                    onClick={() =>
                      setSelectedImage(
                        `${import.meta.env.VITE_API_URL
                        }/productBluePrint/${img}`
                      )
                    }
                  />
                ))}
              </div>

              {width > breakpoints.md ? (
                <div className="flex justify-around  gap-4 mx-2">
                  <button
                    onClick={() => {
                      console.log("yes1");
                      if (!customerData) {
                        alert("Login first")
                      } else {
                        if (!defaultAddress) {
                          alert("please set the default address.")
                        } else {
                          handlePlaceOrder()
                        }
                      }
                    }}
                    className="px-6 py-2 h-[4rem] w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65"
                  >
                    {isLoading2 ? (
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
                        Processing...
                      </span>
                    ) : (
                      <span>Buy Now</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      console.log("yes1");

                      if (!customerData) {
                        alert("Login first")
                      } else {
                        if (!defaultAddress) {
                          alert("please set the default address.")
                        } else {
                          handleAddToCart()
                        }
                      }

                    }}
                    // onClick={handleAddToCart}
                    className={`px-6 py-2 h-[4rem] w-[50%] bg-addToCartBUtton text-white font-semibold rounded-lg ${isLoading
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
              className={`space-y-4 md:h-[70vh] ${width > breakpoints.md
                ? "h-[90vh] overflow-auto scrollbar-hide"
                : ""
                }   px-3 md:px-0`}
            >
              <h1 className="text-2xl font-semibold">
                {productSpecificData?.name}
              </h1>
              {/* price options */}
              {/* {productData?.priceOptions && (
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
              )} */}
              {productData?.priceOptions && (
                    <div className="p-2 rounded-md">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Price Option:</h3>
                      <div className="flex flex-wrap gap-2">
                        {productData?.priceOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedPriceOption(option)}
                            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                              selectedPriceOption === option
                                ? "bg-blue-100 border-blue-500 text-blue-700"
                                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            ₹{option.price} for {option.quantity}/{option.unit}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-700">Quantity:</h3>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 disabled:text-gray-300 hover:bg-gray-100"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 py-2 text-gray-800">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>


              {width > breakpoints.md ? (
                ""
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      console.log("yes1");

                      if (!customerData) {
                        alert("Login first")
                      } else {
                        if (!defaultAddress) {
                          alert("please set the default address.")
                        } else {
                          handlePlaceOrder()
                        }
                      }

                    }}
                    className="px-6 py-2 h-[4rem] w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65">
                    {isLoading2 ? (
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
                        Processing...
                      </span>
                    ) : (
                      <span>Buy Now</span>
                    )}

                  </button>
                  <button
                    onClick={() => {
                      console.log("yes1");

                      if (!customerData) {
                        alert("Login first")
                      } else {
                        if (!defaultAddress) {
                          alert("please set the default address.")
                        } else {
                          handleAddToCart()
                        }
                      }

                    }}
                    // onClick={handleAddToCart}
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
        <div>
          <CarouselWithoutArrow
            data={products.mobileData}
            title={"Similar Products"}
          />
        </div>

        <div className="flex flex-col bg-red-300 items-center justify-center">
          <div
            className={`${width < breakpoints.sm ? "w-[100%]" : "w-[100%]"
              }  flex flex-col justify-center gap-3 items-center`}
          >
            <Footer />
          </div>
        </div>
      </div>



      <Transition appear show={showLoadingModal} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
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
              <Dialog.Panel className="md:w-[70%] w-[100%]  bg-white dark:bg-darkSecondary rounded-md shadow-xl p-6 ">

                {/* Message */}
                <h2 className="text-lg font-semibold mt-2 text-center">This product is customiseable</h2>
                <p className="text-gray-600 text-sm mt-1 text-center mb-4">Please fill the form</p>
                <div className="grid md:grid-cols-2 md:grid-col-1 gap-4 w-[100%] ">
                  {productData?.product?.customizableOptions && productData?.product?.customizableOptions?.length > 0 ?

                    productData?.product?.customizableOptions.map((field, index) => (
                      <div
                        key={index}
                        className={`flex flex-col`}
                      >
                        <label className="mb-1 text-gray-700 font-medium">
                          {field?.labelName}
                        </label>
                        {renderFieldPreview(field)}
                      </div>
                    )) : ""
                  }
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (actionType == "order") {
                        finalPlaceOrder()
                      } else if (actionType == "cart") {
                        finalAddToCart()
                      }
                    }}
                    className="bg-lightButton hover:bg-lightButton/30 px-2 py-1 rounded-md">
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductDetail;


// new code

// import { useEffect, useState, Fragment } from "react";
// import "./ProductDetail.css";
// import Footer from "../footer/Footer";
// import useWidth from "../../Hooks/useWidth";
// import CarouselWithoutArrow from "../carousel/CarouselWithoutArrow";
// import products from "../../constant/data";
// import Skeleton from "react-loading-skeleton";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import CryptoJS from "crypto-js";
// import productService from "../../services/productService";
// import { useParams, useNavigate } from "react-router-dom";
// import customerService from "../../services/customerService";
// import toast from "react-hot-toast";
// import { Dialog, Transition } from "@headlessui/react";
// import { useSelector } from "react-redux";
// import { FaPlus, FaMinus } from "react-icons/fa";

// // Secret key for decryption (same as used for encryption)
// const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

// const decryptId = (encryptedId) => {
//   try {
//     const decoded = decodeURIComponent(encryptedId);
//     const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
//     return bytes.toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error("Decryption failed:", error);
//     return null;
//   }
// };

// const ProductDetail = ({ noFade }) => {
//   const [showLoadingModal, setShowLoadingModal] = useState(false);
//   const [actionType, setActionType] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const handleCloseLoadingModal = () => {
//     setShowLoadingModal(false);
//   };

//   const { productId: encryptedId } = useParams();
//   const [productData, setProductData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoading2, setIsLoading2] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const { clientUser: customerData, isAuth: isLogedIn, defaultAddress } = useSelector((state) => state?.authCustomerSlice);

//   const [customizationValues, setCustomizationValues] = useState({});

//   const handleInputChange = (fieldName, value) => {
//     setCustomizationValues((prev) => ({
//       ...prev,
//       [fieldName]: value,
//     }));
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const decryptedId = decryptId(encryptedId);
//       if (!decryptedId) {
//         setError("Invalid product ID");
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await productService.getParticularProductData(decryptedId);
//         const data = response?.data;
//         setProductData(data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load product details");
//         setLoading(false);
//         toast.error("Failed to load product details");
//       }
//     };
//     fetchProduct();
//   }, [encryptedId]);

//   const { width, breakpoints } = useWidth();

//   const [productSpecificData, setProductSpecificData] = useState(null);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedPriceOption, setSelectedPriceOption] = useState(null);

//   useEffect(() => {
//     if (productData) {
//       setProductSpecificData(productData?.product);
//       setSelectedImage(
//         `${import.meta.env.VITE_API_URL}/productBluePrint/${productData?.product?.images[0]}`
//       );
//       const priceOptions = productData?.priceOptions;
//       if (priceOptions?.length > 0) {
//         setSelectedPriceOption(priceOptions[0]);
//       }
//     }
//   }, [productData]);

// const handleQuantityChange = (delta) => {
//   setQuantity((prev) => Math.max(1, prev + delta));
// };

//   async function handleAddToCart() {
//     if (!customerData) {
//       toast.error("Please login first");
//       return;
//     }
//     if (!defaultAddress) {
//       toast.error("Please set a default address");
//       return;
//     }
//     const isCustomizable = productData?.product?.isCustomizable;
//     if (isCustomizable) {
//       setActionType("cart");
//       setShowLoadingModal(true);
//     } else {
//       finalAddToCart();
//     }
//   }

//   async function handlePlaceOrder() {
//     if (!customerData) {
//       toast.error("Please login first");
//       return;
//     }
//     if (!defaultAddress) {
//       toast.error("Please set a default address");
//       return;
//     }
//     const isCustomizable = productData?.product?.isCustomizable;
//     if (isCustomizable) {
//       setActionType("order");
//       setShowLoadingModal(true);
//     } else {
//       finalPlaceOrder();
//     }
//   }

//   async function finalAddToCart() {
//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       Object.entries(customizationValues).forEach(([key, value]) => {
//         if (value instanceof File) {
//           formData.append(key, value);
//         } else {
//           formData.append(key, value);
//         }
//       });

//       formData.append("productStockId", productData?._id);
//       formData.append("quantity", quantity);
//       formData.append("priceOption", JSON.stringify(selectedPriceOption));
//       formData.append("sessionId", null);
//       formData.append("clientId", import.meta.env.VITE_DATABASE_ID);
//       const response = await customerService.newAddToCart(formData);
//       setShowLoadingModal(false);
//       toast.success(response?.data?.message);
//       setIsLoading(false);
//     } catch (error) {
//       setIsLoading(false);
//       toast.error("Error adding to cart");
//       console.log("error while adding to cart", error);
//     }
//   }

//   async function finalPlaceOrder() {
//     setIsLoading2(true);
//     try {
//       const formData = new FormData();
//       Object.entries(customizationValues).forEach(([key, value]) => {
//         if (value instanceof File) {
//           formData.append(key, value);
//         } else {
//           formData.append(key, value);
//         }
//       });

//       formData.append("productStockId", productData?._id);
//       formData.append("quantity", quantity);
//       formData.append("priceOption", JSON.stringify(selectedPriceOption));
//       formData.append("sessionId", null);
//       formData.append("addressId", defaultAddress?._id);
//       formData.append("clientId", import.meta.env.VITE_DATABASE_ID);

//       const response = await customerService.newPlaceOrder(formData);
//       setShowLoadingModal(false);
//       toast.success(response?.data?.message);
//       setIsLoading2(false);
//       const orderId = response?.data?.data?._id;
//       if (orderId) {
//         navigate(`/track-order/${orderId}`);
//       }
//     } catch (error) {
//       setIsLoading2(false);
//       toast.error("Error placing order");
//       console.log("error while placing order", error);
//     }
//   }

//   const renderFieldPreview = (field) => {
//     const baseStyles = "w-[100%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
//     const fieldName = field.labelName;
//     switch (field.selectedField) {
//       case "text":
//       case "number":
//       case "email":
//       case "hyperlink":
//         return (
//           <input
//             type={field?.selectedField}
//             placeholder={field?.labelName}
//             className={baseStyles}
//             value={customizationValues[fieldName] || ""}
//             onChange={(e) => handleInputChange(fieldName, e.target.value)}
//           />
//         );
//       case "textarea":
//         return (
//           <textarea
//             placeholder={field?.labelName}
//             value={customizationValues[fieldName] || ""}
//             onChange={(e) => handleInputChange(fieldName, e.target.value)}
//             className={`${baseStyles} min-h-[100px]`}
//           />
//         );
//       case "select":
//       case "multiselect":
//         return (
//           <select
//             className={baseStyles}
//             value={customizationValues[fieldName] || ""}
//             onChange={(e) => handleInputChange(fieldName, e.target.value)}
//           >
//             <option value="">{field?.labelName || "Select an option"}</option>
//             {field?.selectOptions?.map((opt, idx) => (
//               <option key={idx} value={opt.valueName}>
//                 {opt.valueName}
//               </option>
//             ))}
//           </select>
//         );
//       case "checkbox":
//         return (
//           <input
//             type="checkbox"
//             checked={customizationValues[fieldName] || false}
//             onChange={(e) => handleInputChange(fieldName, e.target.checked)}
//             className="h-5 w-5 text-blue-600"
//           />
//         );
//       case "file":
//         return (
//           <input
//             type="file"
//             onChange={(e) => handleInputChange(fieldName, e.target.files[0])}
//             className={baseStyles}
//           />
//         );
//       default:
//         return <div className={baseStyles}>{field?.selectedField} (Preview not available)</div>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-[100%] flex md:px-8 sm:px-0">
//         <div className="w-[100%]">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-3 py-4">
//             <div>
//               <Skeleton height={384} />
//               <div className="flex gap-2 mt-4">
//                 {[...Array(4)].map((_, i) => (
//                   <Skeleton key={i} width={64} height={64} />
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-4 px-3 md:px-0">
//               <Skeleton height={32} width="80%" />
//               <Skeleton height={20} width="60%" />
//               <Skeleton height={24} width="40%" />
//               <Skeleton height={100} />
//               <Skeleton height={150} />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-[100%] flex md:px-8 sm:px-0">
//       <div className={`${width > breakpoints.xl ? "w-[100%]" : "w-[100%]"}`}>
//         <div className="bg-white w-[100%] overflow-hidden my-3 py-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="w-[100%]">
//               <div className="w-[100%] object-cover md:h-96 h-80 flex justify-center items-center md:border-2 sm:border-0 rounded-lg overflow-hidden">
//                 <img
//                   src={selectedImage}
//                   alt="Product"
//                   className="w-[100%] md:py-4 py-2 h-full object-contain rounded-lg transition-opacity duration-300 ease-in-out"
//                 />
//               </div>
//               <div className="flex gap-2 mt-4 mb-4 justify-center flex-wrap">
//                 {productSpecificData?.images.map((img, index) => (
//                   <img
//                     key={index}
//                     src={`${import.meta.env.VITE_API_URL}/productBluePrint/${img}`}
//                     alt="Thumbnail"
//                     className={`w-16 h-16 object-cover border-2 rounded-lg p-2 cursor-pointer transition-all ${
//                       selectedImage === `${import.meta.env.VITE_API_URL}/productBluePrint/${img}`
//                         ? "border-blue-500 border-3 p-0"
//                         : "border-gray-300"
//                     }`}
//                     onClick={() =>
//                       setSelectedImage(`${import.meta.env.VITE_API_URL}/productBluePrint/${img}`)
//                     }
//                   />
//                 ))}
//               </div>

//               {width > breakpoints.md ? (
//                 <div className="flex flex-col gap-4 mx-2">
                  // {productData?.priceOptions && (
                  //   <div className="p-2 rounded-md">
                  //     <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Price Option:</h3>
                  //     <div className="flex flex-wrap gap-2">
                  //       {productData?.priceOptions.map((option, index) => (
                  //         <button
                  //           key={index}
                  //           onClick={() => setSelectedPriceOption(option)}
                  //           className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                  //             selectedPriceOption === option
                  //               ? "bg-blue-100 border-blue-500 text-blue-700"
                  //               : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  //           }`}
                  //         >
                  //           ₹{option.price} for {option.quantity}/{option.unit}
                  //         </button>
                  //       ))}
                  //     </div>
                  //   </div>
                  // )}
//                   <div className="flex items-center gap-4">
//                     <h3 className="text-lg font-semibold text-gray-700">Quantity:</h3>
//                     <div className="flex items-center border rounded-md">
//                       <button
//                         onClick={() => handleQuantityChange(-1)}
//                         disabled={quantity <= 1}
//                         className="px-3 py-2 text-gray-600 disabled:text-gray-300 hover:bg-gray-100"
//                       >
//                         <FaMinus />
//                       </button>
//                       <span className="px-4 py-2 text-gray-800">{quantity}</span>
//                       <button
//                         onClick={() => handleQuantityChange(1)}
//                         className="px-3 py-2 text-gray-600 hover:bg-gray-100"
//                       >
//                         <FaPlus />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="flex justify-around gap-4">
//                     <button
//                       onClick={handlePlaceOrder}
//                       className={`px-6 py-2 h-[4rem] w-[50%] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${
//                         isLoading2 ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                       disabled={isLoading2}
//                     >
//                       {isLoading2 ? (
//                         <span className="flex items-center justify-center">
//                           <svg
//                             className="animate-spin h-5 w-5 mr-2 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             />
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
//                             />
//                           </svg>
//                           Processing...
//                         </span>
//                       ) : (
//                         <span>Buy Now</span>
//                       )}
//                     </button>
//                     <button
//                       onClick={handleAddToCart}
//                       className={`px-6 py-2 h-[4rem] w-[50%] bg-green-600 text-white font-semibold rounded-lg ${
//                         isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
//                       }`}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <span className="flex items-center justify-center">
//                           <svg
//                             className="animate-spin h-5 w-5 mr-2 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             />
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
//                             />
//                           </svg>
//                           Adding...
//                         </span>
//                       ) : (
//                         <span>Add to Cart</span>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-4 px-3">
//                   {productData?.priceOptions && (
//                     <div className="p-2 rounded-md">
//                       <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Price Option:</h3>
//                       <div className="flex flex-wrap gap-2">
//                         {productData?.priceOptions.map((option, index) => (
//                           <button
//                             key={index}
//                             onClick={() => setSelectedPriceOption(option)}
//                             className={`px-4 py-2 text-sm rounded-md border transition-colors ${
//                               selectedPriceOption === option
//                                 ? "bg-blue-100 border-blue-500 text-blue-700"
//                                 : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
//                             }`}
//                           >
//                             ₹{option.price} for {option.quantity}/{option.unit}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
// <div className="flex items-center gap-4">
//   <h3 className="text-lg font-semibold text-gray-700">Quantity:</h3>
//   <div className="flex items-center border rounded-md">
//     <button
//       onClick={() => handleQuantityChange(-1)}
//       disabled={quantity <= 1}
//       className="px-3 py-2 text-gray-600 disabled:text-gray-300 hover:bg-gray-100"
//     >
//       <FaMinus />
//     </button>
//     <span className="px-4 py-2 text-gray-800">{quantity}</span>
//     <button
//       onClick={() => handleQuantityChange(1)}
//       className="px-3 py-2 text-gray-600 hover:bg-gray-100"
//     >
//       <FaPlus />
//     </button>
//   </div>
// </div>
//                   <div className="flex gap-4">
//                     <button
//                       onClick={handlePlaceOrder}
//                       className={`px-6 py-2 h-[4rem] w-[50%] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${
//                         isLoading2 ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                       disabled={isLoading2}
//                     >
//                       {isLoading2 ? (
//                         <span className="flex items-center justify-center">
//                           <svg
//                             className="animate-spin h-5 w-5 mr-2 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             />
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
//                             />
//                           </svg>
//                           Processing...
//                         </span>
//                       ) : (
//                         <span>Buy Now</span>
//                       )}
//                     </button>
//                     <button
//                       onClick={handleAddToCart}
//                       className={`px-6 py-2 h-[4rem] w-[50%] bg-green-600 text-white font-semibold rounded-lg ${
//                         isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
//                       }`}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <span className="flex items-center justify-center">
//                           <svg
//                             className="animate-spin h-5 w-5 mr-2 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             />
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
//                             />
//                           </svg>
//                           Adding...
//                         </span>
//                       ) : (
//                         <span>Add to Cart</span>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div
//               className={`space-y-4 md:h-[70vh] ${
//                 width > breakpoints.md ? "h-[90vh] overflow-auto scrollbar-hide" : ""
//               } px-3 md:px-0`}
//             >
//               <h1 className="text-2xl font-semibold">{productSpecificData?.name}</h1>
//               <div className="mt-10">
//                 <h3 className="text-xl font-semibold">More Product Information</h3>
//                 <p className="text-gray-600">
//                   This product is designed to meet the highest standards of quality and performance.
//                 </p>
//               </div>
//               <div className="mt-10">
//                 <h3 className="text-xl font-semibold">Return & Refund Policy</h3>
//                 <p className="text-gray-600">
//                   Our return policy ensures customer satisfaction. You can return the product within 30 days.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-10 px-3 md:px-0">
//           <h3 className="text-xl font-semibold">Similar Products</h3>
//           <CarouselWithoutArrow data={products.mobileData} title={"Similar Products"} />
//         </div>

//         <div className="flex flex-col bg-red-300 items-center justify-center">
//           <div
//             className={`${width < breakpoints.sm ? "w-[100%]" : "w-[100%]"} flex flex-col justify-center gap-3 items-center`}
//           >
//             <Footer />
//           </div>
//         </div>
//       </div>

//       <Transition appear show={showLoadingModal} as={Fragment}>
//         <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
//           <Transition.Child
//             as={Fragment}
//             enter={noFade ? "" : "duration-300 ease-out"}
//             enterFrom={noFade ? "" : "opacity-0"}
//             enterTo={noFade ? "" : "opacity-100"}
//             leave={noFade ? "" : "duration-200 ease-in"}
//             leaveFrom={noFade ? "" : "opacity-100"}
//             leaveTo={noFade ? "" : "opacity-0"}
//           >
//             <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto flex justify-center items-center">
//             <Transition.Child
//               as={Fragment}
//               enter={noFade ? "" : "duration-300 ease-out"}
//               enterFrom={noFade ? "" : "opacity-0 scale-95"}
//               enterTo={noFade ? "" : "opacity-100 scale-100"}
//               leave={noFade ? "" : "duration-200 ease-in"}
//               leaveFrom={noFade ? "" : "opacity-100 scale-100"}
//               leaveTo={noFade ? "" : "opacity-0 scale-95"}
//             >
//               <Dialog.Panel className="md:w-[70%] w-[100%] bg-white dark:bg-darkSecondary rounded-md shadow-xl p-6">
//                 <h2 className="text-lg font-semibold mt-2 text-center">This product is customizable</h2>
//                 <p className="text-gray-600 text-sm mt-1 text-center mb-4">Please fill the form</p>
//                 <div className="grid md:grid-cols-2 gap-4 w-[100%]">
//                   {productData?.product?.customizableOptions?.length > 0 ? (
//                     productData?.product?.customizableOptions.map((field, index) => (
//                       <div key={index} className="flex flex-col">
//                         <label className="mb-1 text-gray-700 font-medium">{field?.labelName}</label>
//                         {renderFieldPreview(field)}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-600 text-center">No customizable options available.</p>
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <button
//                     onClick={() => {
//                       if (actionType === "order") {
//                         finalPlaceOrder();
//                       } else if (actionType === "cart") {
//                         finalAddToCart();
//                       }
//                     }}
//                     className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// };

// export default ProductDetail; 



