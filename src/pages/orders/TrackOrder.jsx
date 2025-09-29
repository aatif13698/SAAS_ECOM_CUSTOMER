import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import useDarkmode from "../../Hooks/useDarkMode";
import Footer from "../../components/footer/Footer";
import useWidth from "../../Hooks/useWidth";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [itemData, setItemData] = useState([])
  const [loading, setLoading] = useState(true);
  const [isDark] = useDarkmode();
  const location = useLocation();
  const { width, breakpoints } = useWidth();



  const itemId = location?.state?.itemId;

  console.log("itemData", itemData);



  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  console.log("orderId", orderId);


  async function fetchOrderDetails() {
    try {
      const response = await customerService.getParticularOrder(orderId);
      console.log("response unique", response?.data?.data[0]);

      setOrder(response?.data?.data[0]);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch order details");
      setLoading(false);
      console.error("Error fetching order:", error);
    }
  }

  useEffect(() => {
    if (order && itemId) {
      const filteredItem = order?.items?.filter((item) => item?._id == itemId);
      console.log("filteredItem", filteredItem);
      setItemData(filteredItem)
    }
  }, [order])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-600 mt-2">Please check the order ID and try again.</p>
      </div>
    );
  }

  const { orderNumber, status, activities, items, totalAmount, paymentMethod, paymentStatus, address, customer } = order;



  // Define timeline statuses
  const timelineStatuses = ["PENDING", "APPROVED", "IN_PRODUCTION", "SHIPPED", "DELIVERED"];
  const isCancelled = itemData[0]?.status === "CANCELLED";
  const currentStatusIndex = isCancelled ? -1 : timelineStatuses.indexOf(itemData[0]?.status);

  return (

    <>

      <div className="container mx-auto px-2 py-6 ">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6"> #{orderNumber}</h2>

        {/* Order Summary Card */}
        <div className={`${isDark ? "bg-carBgDark" : "bg-white"} shadow-md rounded-lg p-6 mb-6 border border-gray-200`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">Order Details</h3>
              <p className="text-sm text-gray-600 dark:text-white/80">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${isCancelled
                    ? "bg-red-100 text-red-800"
                    : itemData[0]?.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {itemData[0]?.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-white/80">
                <span className="font-medium">Payment Method:</span> {paymentMethod}
              </p>
              <p className="text-sm text-gray-600 dark:text-white/80">
                <span className="font-medium">Payment Status:</span> {paymentStatus}
              </p>
              <p className="text-sm text-gray-600 dark:text-white/80">
                <span className="font-medium">Total Amount:</span> ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2 dark:text-white">Shipping Address</h3>
              <p className="text-sm text-gray-600 dark:text-white/80">
                {address?.address || customer?.name}
                <br />
                {address?.nearbyLandmark}, {address?.city}, {address?.state} {address?.ZipCode}
                <br />
                {address?.country}
                <br />
                Phone: {address?.phone || customer?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className={`${isDark ? "bg-carBgDark" : "bg-white"} shadow-md rounded-lg p-6 mb-6 border border-gray-200`}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">Order Timeline</h3>
          <div className="relative pl-6 md:pl-8">
            <div className="absolute left-[1.50rem] md:left-[1.80rem] top-0 bottom-0 w-0.5 bg-gray-300"></div>
            {timelineStatuses.map((timelineStatus, index) => {
              const activity = itemData[0]?.activities.find((act) => act.status === timelineStatus);
              console.log("activity", activity);

              const isActive = !isCancelled && index <= currentStatusIndex;
              const isCompleted = isActive && activity;
              const isPending = !isCancelled && index > currentStatusIndex;

              return (
                <div key={timelineStatus} className="mb-6 relative">
                  <div
                    className={`absolute left-[-10px] md:left-[-12px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCancelled
                      ? "bg-red-100 border-red-500"
                      : isCompleted
                        ? "bg-green-100 border-green-500"
                        : isActive
                          ? "bg-yellow-100 border-yellow-500"
                          : "bg-gray-100  border-gray-300"
                      }`}
                  >
                    {isCancelled ? (
                      <FaTimesCircle className="text-red-500 text-xs" />
                    ) : isCompleted ? (
                      <FaCheckCircle className="text-green-500 text-xs" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    )}
                  </div>
                  <div className="ml-6">
                    <h4
                      className={`text-sm font-medium ${isCancelled ? "text-red-600" : isCompleted ? "text-green-600" : isActive ? "text-yellow-600" : "text-gray-400"
                        }`}
                    >
                      {timelineStatus}
                    </h4>
                    {activity && (
                      <p className="text-xs text-gray-500 dark:text-white/80">
                        {new Date(activity.timestamp).toLocaleString()}
                        {activity.notes && (
                          <span className="flex items-center gap-1 mt-1">
                            <FaInfoCircle className="text-blue-500" />
                            {activity.notes}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {isCancelled && (
              <div className="mb-6 relative">
                <div className="absolute left-[-10px] md:left-[-12px] w-5 h-5 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                  <FaTimesCircle className="text-red-500 text-xs" />
                </div>
                <div className="ml-6">
                  <h4 className="text-sm font-medium text-red-600">CANCELLED</h4>
                  <p className="text-xs text-gray-500">
                    {itemData[0]?.activities.find((act) => act.status === "CANCELLED")?.timestamp.toLocaleString()}
                    {itemData[0]?.activities.find((act) => act.status === "CANCELLED")?.notes && (
                      <span className="flex items-center gap-1 mt-1">
                        <FaInfoCircle className="text-blue-500" />
                        {itemData[0]?.activities.find((act) => act.status === "CANCELLED")?.notes}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className={`${isDark ? "bg-carBgDark " : "bg-white"} shadow-md rounded-lg p-6 border border-gray-200`}>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Order Item</h3>
          <div className="space-y-4">
            {itemData && itemData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start gap-4 border-b border-gray-200 pb-4 last:border-b-0"
              >
                <img
                  src={`${item.productMainStock?.images?.[0] || "placeholder.jpg"}`}
                  alt={item.productMainStock?.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border border-gray-300"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">{item.productMainStock?.name || "Unnamed Product"}</h4>
                  <p className="text-xs text-gray-600 dark:text-white/80">
                    Quantity: {item.quantity} | Unit Price: ${item.priceOption.unitPrice.toFixed(2)}
                  </p>
                  {
                    item.priceOption.hasDiscount ?
                      <p className="text-xs text-gray-600 dark:text-white/80">
                        Discount %: {item.priceOption.discountPercent} 
                      </p> : ""
                  }

                  {item.customizationDetails.size > 0 && (
                    <p className="text-xs text-gray-600 dark:text-white/80">
                      Customizations: {Array.from(item.customizationDetails.entries()).map(([key, value]) => `${key}: ${value}`).join(", ")}
                    </p>
                  )}
                  {item.customizationFiles.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Files: {item.customizationFiles.map((file) => file.originalName).join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-800 dark:text-white/80">Subtotal: ${item.subtotal.toFixed(2)}</div>
              </div>
            ))}
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

export default TrackOrder;