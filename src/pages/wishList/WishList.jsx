
import React, { useEffect, useState, Fragment } from "react";
import { FaShoppingCart } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import "../../App.css";
import images from "../../constant/images";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import useDarkmode from "../../Hooks/useDarkMode";
import Footer from "../../components/footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import { setDefaultWishList } from "../../store/reducer/auth/authCustomerSlice";


const WishList = () => {

    const dispatch = useDispatch();
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

    const navigate = useNavigate();

    const [isDark] = useDarkmode();

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
            const response = await customerService.removeFromWishList(dataObject);
            toast.success(response?.data?.message);
            dispatch(setDefaultWishList(response?.data?.data));
            setRefreshCount((prev) => prev + 1);
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove item from wishlist");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getCarts = async () => {
            try {
                setIsPageLoading(true);
                const response = await customerService.getWishlist(null);
                setCartData(response?.data?.data);
                setCarts(response?.data?.data?.items || []);
                setIsPageLoading(false)
            } catch (error) {
                setCartData(null);
                setCarts([]);
                console.error("Error fetching wishlist:", error);
                setIsPageLoading(false)
            }
        };
        getCarts();
    }, [refreshCount]);


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
        <>
            <div className="w-[100%] min-h-[60vh] bg-gray-100 dark:bg-gray-800 flex flex-col  items-center py-6">
                <div className="w-[100%]  lg:w-3/4 px-2 sm:px-0 lg:px-8">
                    <h2 className="text-2xl font-semibold py-3">Wish List</h2>

                    {carts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <IoMdHeart className="text-6xl text-gray-400 mb-4" />
                            <p className="text-lg text-gray-600 dark:text-gray-300">You have no items in your wishlist. Start adding!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div
                                className={`space-y-4 lg:col-span-3 ${isDark ? 'bg-gray-700' : 'bg-white'
                                    } p-4 rounded-md shadow-md   scrollbar-hide`}
                            >
                                {carts.map((item) => {
                                    const name = item?.productMainStock?.name;
                                    const description = item?.productMainStock?.description
                                    const priceOption = item?.priceOption;
                                    const price = priceOption?.price;
                                    const image = item?.productMainStock?.images[0];
                                    return (
                                        <div
                                            key={item.productStock?._id}
                                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border ${isDark ? 'bg-gray-600 border-gray-500' : 'bg-gray-100 border-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={`${image}`}
                                                alt={`${name} product image`}
                                                className="w-20 h-20 object-cover border-2 rounded-lg transition-all"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromCart(item?.productMainStock?._id)}
                                                disabled={isLoading}
                                                className="px-3 py-2 text-red-500 dark:text-red-300 bg-red-500/20 dark:bg-red-700/50 rounded-md hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Address Selection Modal */}
                    <Transition appear show={showAddressModal} as={Fragment}>
                        <Dialog
                            as="div"
                            className="relative z-50"
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
                                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                            </Transition.Child>
                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
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
                                            className="w-[100%] max-w-sm sm:max-w-md transform overflow-hidden rounded-md bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all p-6"
                                            role="dialog"
                                            aria-labelledby="address-modal-title"
                                        >
                                            <h2
                                                id="address-modal-title"
                                                className="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
                                            >
                                                Select Delivery Address
                                            </h2>
                                            <Select
                                                options={addresses}
                                                value={selectedAddress}
                                                onChange={setSelectedAddress}
                                                placeholder="Select an address..."
                                                styles={addressSelectStyles}
                                                className="mb-4"
                                                aria-label="Select delivery address"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setShowAddressModal(false)}
                                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handlePlaceOrder}
                                                    disabled={isLoading || !selectedAddress}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                                                >
                                                    {isLoading ? 'Processing...' : 'Confirm Order'}
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>

            <div className="w-[100%] flex flex-col items-center justify-center">
                <div className="w-[100%]  ">
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default WishList;