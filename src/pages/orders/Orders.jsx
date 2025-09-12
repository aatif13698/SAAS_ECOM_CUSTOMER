import React, { useEffect, useState } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import "../../App.css"
import images from "../../constant/images";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useDarkmode from "../../Hooks/useDarkMode";
import Footer from "../../components/footer/Footer";

const Orders = () => {
  const [isDark] = useDarkmode();
  const [isPageLoading, setIsPageLoading] = useState(true);
    const { width, breakpoints } = useWidth();
  


  const navigate = useNavigate()
  const [carts, setCarts] = useState([]);
  useEffect(() => {
    getOrders()
  }, []);

  console.log("carts aaa", carts);

  async function getOrders() {
    try {
      setIsPageLoading(true);
      const response = await customerService.getOrders(null);
      setCarts(response?.data?.data);
      setIsPageLoading(false);
    } catch (error) {
      setCartData(null);
      setCarts([])
      console.log("error while fetching the orders", error);
      setIsPageLoading(false);
    }
  }

  const handleTrackOrder = (orderId, itemId) => {
    navigate(`/track-order/${orderId}`, { state: { itemId: itemId } });
  };

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (

    <>

      <div className="container min-h-[50vh]  mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800 mb-6">Your Orders</h2>
        <div className=" w-[100%]">
          {/* Orders List */}
          <div className="space-y-4">
            {carts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No orders found.</p>
                <p>Start shopping to see your orders here!</p>
              </div>
            ) : (
              carts?.map((item, index) => {
                console.log("carts", item);

                const name = item?.productStock?.product?.name || "Unnamed Product";
                const priceOption = item?.priceOption || {};
                const price = priceOption?.price || 0;
                const quantity = item?.quantity || 1;
                const subtotal = price * quantity;
                const image =
                  item?.productStock?.product?.images?.[0] ||
                  "https://via.placeholder.com/80";
                const status = item?.status || "DELIVERED";
                const deliveryDate = "Aug 12, 2025";

                return (
                  <div
                    key={index + "AES"}
                    className={`flex w-[100%]  ${isDark ? "dark:bg-carBgDark" : "bg-white"} flex-col md:flex-row items-start md:justify-between md:items-center gap-4 p-4  rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <img
                        src={`${image}`}
                        alt={name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
                      // onError={(e) => (e.target.src = "https://via.placeholder.com/80")} // Fallback on error
                      />
                      <div className=" md:w-auto">
                        <h3 className="text-lg text-wrap md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                          {name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-white/80">
                          Quantity: {quantity} | Unit Price: ${price.toFixed(2)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${status === "DELIVERED"
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
                    </div>

                    <div className="flex flex-col items-end gap-2 w-[100%] md:w-auto">
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        Total: ${subtotal.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTrackOrder(item.id, item?._id)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                          Track Order
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col  items-center justify-center">
        <div
          className={`${width < breakpoints.sm ? "w-[100%]" : "w-[100%]"
            }  flex flex-col justify-center gap-3 items-center`}
        >
          <Footer />
        </div>
      </div>


    </>


  );
};

export default Orders;