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
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [isLoading2, setIsLoading2] = useState(false); // State to track loading
  const [error, setError] = useState(null);

  const [attributesArray, setAttributesArray] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [filteredProduct, setFilteredProduct] = useState([]);

  console.log("filteredProduct", filteredProduct);


  const { clientUser: customerData, isAuth: isLogedIn, defaultAddress, } = useSelector((state) => state?.authCustomerSlice);

  useEffect(() => {
    console.log("attributesArray", attributesArray);

    const filteredProduct = productsData?.filter((item) => {
      // Get product attributes (e.g., { RAM: "12 GB", ROM: "256 GB", SIZE: "13.6 INCH" })
      const productAttributes = item?.priceOptions?.attributes;

      // If product has no attributes, exclude it
      if (!productAttributes) {
        return false;
      }

      // Create a map of active attributes from attributesArray
      const activeAttributes = attributesArray.reduce((acc, attr) => {
        const key = Object.keys(attr)[0]; // e.g., "RAM", "ROM", "SIZE"
        const activeValue = attr[key].find((val) => val.value === true)?.name;
        if (activeValue) {
          acc[key] = activeValue; // e.g., { RAM: "12 GB", ROM: "256 GB" }
        }
        return acc;
      }, {});

      // Check if all active attributes match the product's attributes
      return Object.entries(activeAttributes).every(([key, value]) => {
        return productAttributes[key]?.toUpperCase() === value?.toUpperCase();
      });
    });

    console.log("filteredProduct", filteredProduct);

    if (filteredProduct && filteredProduct?.length > 0) {
      setProductData(filteredProduct[0]);
      setFilteredProduct(filteredProduct)
    } else {
      setFilteredProduct([])
    }

    // Optionally, set filteredProduct to state if needed
    // setFilteredProducts(filteredProduct);
  }, [attributesArray, productsData]);

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

        const mainStocks = response?.data?.normalSaleStock;

        const productAttribute = mainStocks && mainStocks?.length > 0 ? mainStocks?.map((item) => {
          const priceOptions = item?.priceOptions;
          return priceOptions
        }) : [];

        const attr = productAttribute[0].attributes;
        let keys = Object.keys(attr).map((item) => ({ [item]: [] }));

        for (let index = 0; index < productAttribute.length; index++) {
          const element = productAttribute[index].attributes;
          const values = Object.entries(element);
          values.map((items) => {
            const key = items[0];
            const value = items[1];
            const newKeyValue = keys.map((values) => {
              const a = Object.keys(values);
              if (a[0] == key) {
                const b = values[key];
                if (b.includes(value)) {
                  return {
                    [key]: [...b]
                  }
                } else {
                  return {
                    [key]: [...b, value]
                  }
                }
              } else {
                return values
              }
            });
            keys = newKeyValue;
          });
        }


        function convertToNamedArray(inputArray) {
          return inputArray.map(item => ({
            name: item,
            value: false
          }));
        };


        const newArr = keys.map((item) => {
          const a = Object.keys(item);
          const b = Object.values(item);
          const name = a[0];
          const value = convertToNamedArray(b[0]);
          return {
            [name]: value
          }
        });

        setFilteredProduct([{ ...response?.data?.normalSaleStock }])

        setProductsData(response?.data?.normalSaleStock);
        setProductData(response?.data?.normalSaleStock[0]);


        const firstOption = Object.entries(response?.data?.normalSaleStock[0]?.priceOptions?.attributes).map(([key, value]) => ({
          name: key,
          value: value,
        }));

        // for (let index = 0; index < firstOption.length; index++) {
        //   const element = firstOption[index];
        //   const keyName = element?.name;

        //   const newValue = newArr.map((item) => {
        //     const key = Object.keys(item);
        //     const value = Object.values(item);
        //     if (key == keyName) {
        //       const newBb = value[0].map((items) => {
        //         if (items?.name == element.value) {
        //           return {
        //             ...items, value: true
        //           }
        //         } else {
        //           return items
        //         }
        //       });

        //       return {
        //         [key]: newBb
        //       }

        //     } else {

        //       return item
        //     }

        //   });

        //   console.log("newValue",newValue);


        // }

        const updatedArr = firstOption.reduce((acc, element) => {
          const keyName = element.name;
          const targetValue = element.value;

          return acc.map((item) => {
            const key = Object.keys(item)[0]; // Get the first key of the item object
            if (key === keyName) {
              const updatedValues = item[key].map((subItem) => {
                if (subItem?.name === targetValue) {
                  return { ...subItem, value: true };
                }
                return subItem;
              });
              return { [key]: updatedValues };
            }
            return item;
          });
        }, newArr);

        setAttributesArray(updatedArr);

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

  console.log("productSpecificData", productSpecificData);

  useEffect(() => {
    if (productData) {
      setProductSpecificData(productData);
      setSelectedImage(
        `${import.meta.env.VITE_API_URL}/productBluePrint/${productData?.images[0]
        }`
      );
      // const priceOPtions = productData?.priceOptions;
      // console.log("priceOPtions", priceOPtions);

      // if (priceOPtions.length > 0) {
      //   setSelectedPriceOption(priceOPtions[0]);
      // }
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
                {productSpecificData?.images?.map((img, index) => (
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
              <h1 className="text-2xl dark:text-black font-semibold">
                {productSpecificData?.name}
              </h1>

              <p className="text-base dark:text-black ">

                <span className="font-bold"> Description :</span> <span className="text-gray-600">{productSpecificData?.description}</span>

              </p>

              {

                filteredProduct?.length == 0
                  ?
                  <p className="text-red-400 font-bold">
                    Selected configure product is not available !
                  </p>
                  :
                  <p>
                    <span className="font-bold">Price :</span> ₹{productSpecificData?.priceOptions?.price}
                  </p>
              }


              {
                attributesArray && attributesArray?.length > 0 ? attributesArray.map((item) => {
                  const keyName = Object.keys(item)[0]; // Get the attribute name (e.g., "color", "size")
                  const keyValue = Object.values(item)[0]; // Get the array of values

                  return (
                    <div key={keyName}>
                      <span className="font-bold mb-2">{keyName} :</span>
                      {/* <p className="mb-2">{keyName} :</p> */}
                      {keyValue.map((val) => (
                        <button
                          key={val.name}
                          onClick={() => {
                            // Update attributesArray when a button is clicked
                            setAttributesArray((prevArray) =>
                              prevArray.map((attrItem) => {
                                const attrKey = Object.keys(attrItem)[0];
                                if (attrKey === keyName) {
                                  // Update the values for the matching attribute
                                  return {
                                    [attrKey]: attrItem[attrKey].map((subItem) => ({
                                      ...subItem,
                                      value: subItem.name === val.name ? true : false,
                                    })),
                                  };
                                }
                                return attrItem; // Return unchanged for other attributes
                              })
                            );
                          }}
                          className={`${val?.value ? "border-blue-900 bg-blue-100" : "border-gray-300 bg-gray-100"
                            } mx-2 px-2 py-1 text-sm rounded-md border-2 transition-colors text-gray-700 hover:bg-gray-200`}
                        >
                          {val?.name}
                        </button>
                      ))}
                    </div>
                  );
                }) : (
                  <div>Product not available</div>
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


              {/* {width > breakpoints.md ? (
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
              )} */}

              <div className="mt-10">
                <h3 className="text-xl dark:text-black font-semibold">
                  More Product Information
                </h3>
                <p className="text-gray-600">
                  This product is designed to meet the highest standards of
                  quality and performance.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl dark:text-black font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>

              <div className="mt-10">
                <h3 className="text-xl dark:text-black font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl dark:text-black font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl dark:text-black font-semibold">
                  Return & Refund Policy
                </h3>
                <p className="text-gray-600">
                  Our return policy ensures customer satisfaction. You can
                  return the product within 30 days.
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-xl dark:text-black font-semibold">
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
          <h3 className="text-xl dark:text-white font-semibold">Return & Refund Policy</h3>
          <p className="text-gray-600">
            Our return policy ensures customer satisfaction. You can return the
            product within 30 days.
          </p>
        </div>

        <div className="mt-10 px-3 md:px-0">
          <h3 className="text-xl dark:text-white font-semibold">Similar Products</h3>
        </div>

        <div className="mt-10 px-3 md:px-0">
          <h3 className="text-xl  dark:text-white font-semibold">More Product Information</h3>
          <p className="text-gray-600">
            This product is designed to meet the highest standards of quality
            and performance.
          </p>
        </div>

        <div className="mt-10 px-3 md:px-0">
          <h3 className="text-xl dark:text-white font-semibold">Return & Refund Policy</h3>
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



      {/* <Transition appear show={showLoadingModal} as={Fragment}>
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
      </Transition> */}
    </div>
  );
};

export default ProductDetail;

