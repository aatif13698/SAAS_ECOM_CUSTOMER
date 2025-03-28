import React, { useEffect, useState } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import "../../App.css"
import images from "../../constant/images";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";

const Cart = () => {
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
      serRefreshCount((prev) => prev+1);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error while removing from cart", error);
    }
  }

  return (
    <div className="w-full md:px-8 sm:px-0">
      <h2 className="text-2xl font-semibold py-3 md:px-0 px-2 ">Shopping Cart</h2>

      {carts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">Your cart is empty.</p>
          <a href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md">Continue Shopping</a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className={`space-y-4 lg:col-span-2 bg-white p-4 rounded-md shadow-md md:h-[80vh] ${width > breakpoints.md ? "h-[90vh] overflow-auto scrollbar-hide" : ""}   px-3 md:px-0`}>
            {carts.map((item) => {
              const name = item?.productStock?.product?.name;
              const priceOption = item?.priceOption;
              const price = priceOption?.price;
              const image = item?.productStock?.product?.images[0]
              return (
                <div key={item.id} className="flex items-center gap-4 p-2 border-b">
                  <img src={`${import.meta.env.VITE_API_URL
                    }/productBluePrint/${image}`} alt={name} className="w-20 h-20 object-cover border-2 rounded-lg  transition-all" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{name}</h3>
                    <p className="text-gray-600 text-lg">${price.toFixed(2)}</p>
                    {/* <div className="flex items-center mt-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2 bg-gray-200 rounded">-</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2 bg-gray-200 rounded">+</button>
                    </div> */}
                  </div>
                  <button onClick={() => handleRemoveFromCart(item?.productStock?._id)} className="text-red-500 bg-red-500/35 px-3 py-2 rounded-md hover:bg-red-900 hover:text-light">Remove</button>
                </div>
              )

            }

            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-md shadow-md lg:sticky lg:top-4 mb-5">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${cartData?.totalAmount.toFixed(2)}</span>
            </div>
            {/* <div className="flex justify-between text-gray-700 my-2">
              <span>Tax (5%):</span>
              <span>${(totalPrice * 0.05).toFixed(2)}</span>
            </div> */}
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${(cartData?.totalAmount).toFixed(2)}</span>
            </div>
            <button
              className="px-6 py-2 my-4  float-end w-[50%] bg-buyNowBUtton text-white font-semibold rounded-lg hover:bg-buyNowBUtton/65"
            >Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;