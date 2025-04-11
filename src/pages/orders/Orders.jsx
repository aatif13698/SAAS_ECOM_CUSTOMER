import React, { useEffect, useState } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import "../../App.css"
import images from "../../constant/images";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";

const Orders = () => {
    const { width, breakpoints } = useWidth();
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Wireless Headphones", price: 59.99, quantity: 1, image: images?.lap1 },
        { id: 2, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
        { id: 3, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
        { id: 4, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
        { id: 5, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
        { id: 6, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
        { id: 7, name: "Smart Watch", price: 79.99, quantity: 1, image: images?.lap1 },
    ]);
    const [cartData, setCartData] = useState(null);
    const [carts, setCarts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [refreshCount, serRefreshCount] = useState(0)





    const updateQuantity = (id, amount) => {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
            )
        );
    };
    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    useEffect(() => {
        getCarts()
    }, [refreshCount])

    async function getCarts(params) {
        try {
            const response = await customerService.getCarts(null);
            setCartData(response?.data?.data);
            setCarts(response?.data?.data?.items)
        } catch (error) {
            setCartData(null);
            setCarts([])
            console.log("error while fetching the carts", error);
        }
    }



    async function handleRemoveFromCart(id) {
        setIsLoading(true);
        try {
            const dataObject = {
                productStockId: id,
                sessionId: null,
            };
            const response = await customerService.removeFromCart(dataObject);
            toast.success(response?.data?.message);
            serRefreshCount((prev) => prev + 1);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("error while removing from cart", error);
        }
    }

    return (
        // <div className="w-full md:px-8 sm:px-0">
        //     <h2 className="text-2xl font-semibold py-3 md:px-0 px-2 ">You Orders</h2>

        //     {carts.length === 0 ? (
        //         <div className="flex flex-col items-center justify-center py-10">
        //             <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
        //             <p className="text-lg text-gray-600">You have no orders.</p>
        //             <a href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md">Continue Shopping</a>
        //         </div>
        //     ) : (
        //         <div className="grid lg:grid-cols-1 gap-6">
        //             <div className={`space-y-4 lg:col-span-2 bg-white p-4 rounded-md shadow-md md:h-[80vh] ${width > breakpoints.md ? "h-[90vh] overflow-auto scrollbar-hide" : ""}   px-3 md:px-0`}>
        //                 {carts.map((item) => {
        //                     const name = item?.productStock?.product?.name;
        //                     const priceOption = item?.priceOption;
        //                     const price = priceOption?.price;
        //                     const image = item?.productStock?.product?.images[0]
        //                     return (
        //                         <div key={item.id} className="flex items-center gap-4 p-2 border-b">
        //                             <div className=" bg-red-300">
        //                                 <img src={`${import.meta.env.VITE_API_URL
        //                                     }/productBluePrint/${image}`} alt={name} className="w-20 h-20 object-cover border-2 rounded-lg  transition-all" />
        //                             </div>
        //                             <div className=" w-[40%]">
        //                                 <h3 className="text-lg font-medium">{name}</h3>
        //                                 <p className="text-gray-600 text-lg">${price.toFixed(2)}</p>
        //                             </div>
        //                             <div className="flex justify-between font-bold w-[60%] ">
        //                                 <span>Total:</span>
        //                                 <span>${(200).toFixed(2)}</span>
        //                             </div>
        //                             <div className="bg-red-200">
        //                                 <span>Delivered on Aug 12, 2025</span>
        //                                 <span>you item has been delivered</span>
        //                             </div>
        //                         </div>
        //                     )
        //                 }
        //                 )}
        //             </div>
        //         </div>
        //     )}
        // </div>
        <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Orders</h2>
      <div className=" w-[100%]">
        {/* Orders List */}
        <div className="space-y-4">
          {carts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg">No orders found.</p>
              <p>Start shopping to see your orders here!</p>
            </div>
          ) : (
            carts.map((item) => {
              const name = item?.productStock?.product?.name || "Unnamed Product";
              const priceOption = item?.priceOption || {};
              const price = priceOption?.price || 0;
              const quantity = item?.quantity || 1;
              const subtotal = price * quantity;
              const image =
                item?.productStock?.product?.images?.[0] ||
                "https://via.placeholder.com/80"; // Fallback image
              const status = item?.status || "DELIVERED"; // Assuming status comes from backend
              const deliveryDate = "Aug 12, 2025"; // Replace with dynamic date if available

              return (
                <div
                  key={item.id}
                  className="flex w-[100%]  flex-col md:flex-row items-start md:items-center gap-4 p-4  rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/productBluePrint/${image}`}
                      alt={name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/80")} // Fallback on error
                    />
                  </div>

                  {/* Product Details */}
                  <div className=" md:w-auto">
                    <h3 className="text-lg text-wrap md:text-xl font-semibold text-gray-900 truncate">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {quantity} | Unit Price: ${price.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : status === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status}
                      </span>
                      {status === "DELIVERED" && (
                        <p className="text-sm text-gray-500">
                          Delivered on {deliveryDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total and Actions */}
                  <div className="flex flex-col items-end gap-2 w-[100%] md:w-auto">
                    <div className="text-lg font-bold text-gray-800">
                      Total: ${subtotal.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                        View Details
                      </button>
                      {status === "DELIVERED" && (
                        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium border border-gray-600 rounded-md hover:bg-gray-50 transition-colors">
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    );
};

export default Orders;