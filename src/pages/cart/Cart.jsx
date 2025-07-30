// import React, { useEffect, useState } from "react";
// import { FaTrash, FaShoppingCart } from "react-icons/fa";
// import useWidth from "../../Hooks/useWidth";
// import "../../App.css"
// import images from "../../constant/images";
// import customerService from "../../services/customerService";
// import toast from "react-hot-toast";

// const Cart = () => {
//   const { width, breakpoints } = useWidth();
//   const [cartItems, setCartItems] = useState([
//     { id: 1, name: "Wireless Headphones", price: 59.99, quantity: 1, image: images?.lap1 },
//     { id: 2, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
//     { id: 3, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
//     { id: 4, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
//     { id: 5, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
//     { id: 6, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
//     { id: 7, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
//   ]);
//   const [cartData, setCartData] = useState(null);
//   const [carts, setCarts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [refreshCount, serRefreshCount] = useState(0)
 

  


//   const updateQuantity = (id, amount) => {
//     setCartItems((prevCart) =>
//       prevCart.map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
//       )
//     );
//   };
//   const removeItem = (id) => {
//     setCartItems(cartItems.filter((item) => item.id !== id));
//   };
//   const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   useEffect(() => {
//     getCarts()
//   }, [refreshCount])

//   async function getCarts(params) {
//     try {
//       const response = await customerService.getCarts(null);
//       setCartData(response?.data?.data);
//       setCarts(response?.data?.data?.items)
//     } catch (error) {
//       setCartData(null);
//       setCarts([])
//       console.log("error while fetching the carts", error);
//     }
//   }



//   async function handleRemoveFromCart(id) {
//     setIsLoading(true);
//     try {
//       const dataObject = {
//         productStockId: id,
//         sessionId: null,
//       };
//       const response = await customerService.removeFromCart(dataObject);
//       toast.success(response?.data?.message);
//       serRefreshCount((prev) => prev+1);
//       setIsLoading(false);
//     } catch (error) {
//       setIsLoading(false);
//       console.log("error while removing from cart", error);
//     }
//   }

//   return (
//     <div className="w-full md:px-8 sm:px-0">
//       <h2 className="text-2xl font-semibold py-3 md:px-0 px-2 ">Shopping Cart</h2>

//       {carts.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-10">
//           <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
//           <p className="text-lg text-gray-600">Your cart is empty.</p>
//           <a href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md">Continue Shopping</a>
//         </div>
//       ) : (
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Cart Items */}
//           <div className={`space-y-4 lg:col-span-2 bg-white p-4 rounded-md shadow-md md:h-[80vh] ${width > breakpoints.md ? "h-[90vh] overflow-auto scrollbar-hide" : ""}   px-3 md:px-0`}>
//             {carts.map((item) => {
//               const name = item?.productStock?.product?.name;
//               const priceOption = item?.priceOption;
//               const price = priceOption?.price;
//               const image = item?.productStock?.product?.images[0]
//               return (
//                 <div key={item.id} className="flex items-center gap-4 p-2 border-b">
//                   <img src={`${import.meta.env.VITE_API_URL
//                     }/productBluePrint/${image}`} alt={name} className="w-20 h-20 object-cover border-2 rounded-lg  transition-all" />
//                   <div className="flex-1">
//                     <h3 className="text-lg font-medium">{name}</h3>
//                     <p className="text-gray-600 text-lg">${price.toFixed(2)}</p>
//                     {/* <div className="flex items-center mt-2">
//                       <button onClick={() => updateQuantity(item.id, -1)} className="px-2 bg-gray-200 rounded">-</button>
//                       <span className="mx-2">{item.quantity}</span>
//                       <button onClick={() => updateQuantity(item.id, 1)} className="px-2 bg-gray-200 rounded">+</button>
//                     </div> */}
//                   </div>
//                   <button onClick={() => handleRemoveFromCart(item?.productStock?._id)} className="text-red-500 bg-red-500/35 px-3 py-2 rounded-md hover:bg-red-900 hover:text-light">Remove</button>
//                 </div>
//               )

//             }

//             )}
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white p-4 rounded-md shadow-md lg:sticky lg:top-4 mb-5">
//             <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
//             <div className="flex justify-between text-gray-700">
//               <span>Subtotal:</span>
//               <span>${cartData?.totalAmount.toFixed(2)}</span>
//             </div>
//             {/* <div className="flex justify-between text-gray-700 my-2">
//               <span>Tax (5%):</span>
//               <span>${(totalPrice * 0.05).toFixed(2)}</span>
//             </div> */}
//             <hr className="my-2" />
//             <div className="flex justify-between font-bold">
//               <span>Total:</span>
//               <span>${(cartData?.totalAmount).toFixed(2)}</span>
//             </div>
//             <button
//               className="px-6 py-2 my-4  float-end w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65"
//             >Place Order</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

// new code

import React, { useEffect, useState, Fragment } from "react";
import { FaShoppingCart } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import "../../App.css";
import images from "../../constant/images";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-select";
import { useSelector } from "react-redux";
import useDarkmode from "../../Hooks/useDarkMode";

const Cart = () => {
  const { width, breakpoints } = useWidth();
  const [cartData, setCartData] = useState(null);
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const clientId = import.meta.env.VITE_DATABASE_ID; // Replace with actual client ID from context/auth
  const { clientUser: customerData, isAuth: isLogedIn, defaultAddress, } = useSelector((state) => state?.authCustomerSlice);
  
    const [isDark] = useDarkmode();
  

  const fetchAddresses = async (id) => {
    try {
      const response = await customerService.getAddresses(id);
      console.log("response address",response);
      
      const addressOptions = response?.data?.addresses?.map((address) => ({
        value: address._id,
        label: `${address.roadName}, ${address.city}, ${address.state}, ${address.ZipCode}`,
      }));
      setAddresses(addressOptions);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setIsLoading(true);
    try {
      const response = await customerService.placeOrderFromCart({
        clientId,
        addressId: selectedAddress.value,
      });
      toast.success(response?.data?.message);
      setCartData(null);
      setCarts([]);
      setRefreshCount((prev) => prev + 1);
      setShowAddressModal(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (productStockId) => {
    setIsLoading(true);
    try {
      const dataObject = {
        productStockId,
        sessionId: null,
      };
      const response = await customerService.removeFromCart(dataObject);
      toast.success(response?.data?.message);
      setRefreshCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getCarts = async () => {
      try {
        setIsPageLoading(true);
        const response = await customerService.getCarts(null);
        setCartData(response?.data?.data);
        setCarts(response?.data?.data?.items || []);
        setIsPageLoading(false)
      } catch (error) {
        setCartData(null);
        setCarts([]);
        console.error("Error fetching carts:", error);
        setIsPageLoading(false)
        // toast.error("Failed to load cart");
      }
    };
    getCarts();
  }, [refreshCount]);

  useEffect(() => {
    fetchAddresses(customerData?._id);
  }, [customerData?._id]);

  const addressSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      borderColor: "#d1d5db",
      padding: "0.25rem",
      borderRadius: "0.375rem",
      minHeight: "2.5rem",
      "&:hover": { borderColor: "#9ca3af" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#2563eb" : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#1e293b",
      "&:hover": { backgroundColor: "#f1f5f9" },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1e293b",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };


  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full md:px-8 sm:px-0">
      <h2 className="text-2xl font-semibold py-3 md:px-0 px-2">Shopping Cart</h2>

      {carts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">Your cart is empty.</p>
          <a
            href="/"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div
            className={`space-y-4 lg:col-span-2 ${isDark ? "bg-carBgDark" : "bg-white"} p-4 rounded-md shadow-md md:h-[80vh] ${
              width > breakpoints.md ? "h-[90vh] overflow-auto scrollbar-hide" : ""
            } px-3 md:px-0`}
          >
            {carts.map((item) => {
              const name = item?.productStock?.product?.name;
              const priceOption = item?.priceOption;
              const price = priceOption?.price;
              const image = item?.productStock?.product?.images[0];
              return (
                <div
                  key={item.productStock?._id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border ${
                    isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/productBluePrint/${image}`}
                    alt={name}
                    className="w-20 h-20 object-cover border-2 rounded-lg transition-all"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{name}</h3>
                    <p className="text-gray-600 dark:text-white/90 text-lg">${price?.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item?.productStock?._id)}
                    disabled={isLoading}
                    className="text-red-500 dark:text-red-100 bg-red-500/35 dark:bg-red-900 px-3 py-2 rounded-md hover:bg-red-900 hover:text-white disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className={`${isDark ? "bg-carBgDark" : "bg-white"} p-4 rounded-md shadow-md lg:sticky lg:top-4 mb-5`}>
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between text-gray-700 dark:text-white/90">
              <span>Subtotal:</span>
              <span>${cartData?.totalAmount?.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${cartData?.totalAmount?.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              disabled={isLoading}
              className="px-6 py-2 my-4 float-end w-[50%] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      <Transition appear show={showAddressModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999]"
          onClose={() => setShowAddressModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full justify-center text-center p-6 items-center">
              <Transition.Child
                as={Fragment}
                enter="duration-300 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all p-6"
                >
                  <h2 className="text-lg font-semibold mb-4">Select Delivery Address</h2>
                  <Select
                    options={addresses}
                    value={selectedAddress}
                    onChange={setSelectedAddress}
                    placeholder="Select an address..."
                    styles={addressSelectStyles}
                    className="mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isLoading || !selectedAddress}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Confirm Order"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Cart;