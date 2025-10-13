import React, { useEffect, Fragment, useState } from 'react'
import customerService from '../../services/customerService';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CryptoJS from 'crypto-js';
import useWidth from '../../Hooks/useWidth';
import useDarkmode from '../../Hooks/useDarkMode';
import Footer from '../../components/footer/Footer';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { Country, State, City } from "country-state-city";
import { FaMinus, FaPlus } from 'react-icons/fa';



function CheckoutFromCart() {
    const clientId = import.meta.env.VITE_DATABASE_ID; // Replace with actual client ID from context/auth
    const navigate = useNavigate()

    const [isDark] = useDarkmode();
    const { width, breakpoints } = useWidth();


    const [isPageLoading, setIsPageLoading] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0);
    const [cartData, setCartData] = useState(null);
    const [carts, setCarts] = useState([]);


    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);


    const { clientUser: customerData } = useSelector((state) => state?.authCustomerSlice);



    console.log("cartData", cartData);
    console.log("carts", carts);






    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        alternamtivePhone: "",
        country: "",
        state: "",
        city: "",
        ZipCode: "",
        houseNumber: "",
        roadName: "",
        nearbyLandmark: "",
        address: ""
    });


    const [formDataErr, setFormDataErr] = useState({
        fullName: "", phone: "", alternamtivePhone: "", country: "", state: "", city: "", ZipCode: "", houseNumber: "", roadName: "", nearbyLandmark: "", address: ""
    });

    const [addressId, setAddressId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        fullName, phone, alternamtivePhone, ZipCode, houseNumber, roadName, nearbyLandmark, address
    } = formData;

    const validateField = (name, value) => {
        const rules = {
            fullName: [[!value, "Full Name is Required"]],
            phone: [
                [!value, "Phone No. is Required"],
                [!/^\d{10}$/.test(value), "Phone number should be 10-digit"],
            ],
            alternamtivePhone: [
                [!value, "Alternative Phone No. is Required"],
                [!/^\d{10}$/.test(value), "Alternative Phone number should be 10-digit"],
            ],
            ZipCode: [[!value, "Zip Code is Required"]],
            address: [[!value, "Address is Required"]],
            houseNumber: [[!value, "House Number is Required"]],
            roadName: [[!value, "Road Name is Required"]],
            nearbyLandmark: [[!value, "Nearby Landmark is Required"]],
            country: [[!value, "Country is Required"]],
            state: [[!value, "State is Required"]],
            city: [[!value, "City is Required"]],
        };

        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormDataErr((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const validation = () => {
        const errors = {
            fullName: validateField("fullName", fullName),
            phone: validateField("phone", phone),
            alternamtivePhone: validateField("alternamtivePhone", alternamtivePhone),
            ZipCode: validateField("ZipCode", ZipCode),
            address: validateField("address", address),
            houseNumber: validateField("houseNumber", houseNumber),
            roadName: validateField("roadName", roadName),
            nearbyLandmark: validateField("nearbyLandmark", nearbyLandmark),
            country: validateField("country", countryData?.countryName),
            state: validateField("state", countryData?.stateName),
            city: validateField("city", countryData?.cityName),
        };
        setFormDataErr(errors);
        return Object.values(errors).some((error) => error);
    };

    function clearData() {
        setCountryData({
            countryList: "",
            countryName: "",
            countryISOCode: "",
            CountryISDCode: "",
            stateList: "",
            stateName: "",
            stateISOCode: "",
            cityList: "",
            cityName: "",
        })

        setFormData({
            fullName: "",
            phone: "",
            alternamtivePhone: "",
            country: "",
            state: "",
            city: "",
            ZipCode: "",
            houseNumber: "",
            roadName: "",
            nearbyLandmark: "",
            address: ""
        })
    }


    const handleSave = async () => {
        const isError = validation();
        if (!isError) {
            setIsSubmitting(true)
            const data = {
                ...formData, country: countryData?.countryName,
                state: countryData?.stateName,
                city: countryData?.cityName
            }
            if (addressId) {
                try {
                    const response = await customerService.updateAddress({ ...data, addressId: addressId })
                    setIsSubmitting(false)
                    toast.success(response.data.message)
                    setAddressId(null);
                    clearData();
                    setShowAddressModal(false);
                } catch (error) {
                    setIsSubmitting(false);
                    toast.error(error)
                    console.log("Error while updating address", error);
                }
            } else {
                try {
                    const response = await customerService.addAddress({ ...data })
                    setIsSubmitting(false)
                    toast.success(response.data.message)
                    setAddressId(null);
                    clearData();
                    setRefreshCount((prev) => prev + 1);
                    setShowAddressModal(false);
                } catch (error) {
                    setIsSubmitting(false)
                    toast.error(error)
                    console.log("Error while adding address", error);
                }
            }
        }


    };


    const handleKeyPress = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^6-9\d]/g, "");
        if (cleanedValue.trim() !== "") {
            e.target.value = cleanedValue;
        } else {
            e.target.value = "";
        }
    };



    const [countryData, setCountryData] = useState({
        countryList: "",
        countryName: "",
        countryISOCode: "",
        CountryISDCode: "",
        stateList: "",
        stateName: "",
        stateISOCode: "",
        cityList: "",
        cityName: "",
    });
    const {
        countryList,
        countryName,
        countryISOCode,
        CountryISDCode,
        stateList,
        stateName,
        stateISOCode,
        cityList,
        cityName,
    } = countryData;




    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            countryList: Country.getAllCountries(),
            stateList: State.getStatesOfCountry(countryISOCode),
            cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
        }));
    }, [countryISOCode, stateISOCode]);

    // ----- Handling the country name
    const handleCountry = (e) => {
        const { name, value } = e.target;
        const selectedCountry = countryList.find(
            (country) => country?.name === value
        );
        if (name == "country") {
            if (value == "") {
                // setFormDataErr((prev) => ({
                //     ...prev,
                //     country: "Country is required",
                // }));

            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    country: "",
                }));
            }
        }
        if (selectedCountry) {
            setCountryData((prev) => ({
                ...prev,
                countryName: selectedCountry?.name,
                countryISOCode: selectedCountry?.isoCode,
                CountryISDCode: selectedCountry?.contactNumbercode,
            }));
            setFormData((prev) => ({
                ...prev,
                country: selectedCountry?.name
            }))
        } else {

            setCountryData((prev) => ({
                ...prev,
                countryName: "",
                countryISOCode: "",
                CountryISDCode: "",
            }));

        }
    };

    // ----- Handling the state name as per the country name
    const handleState = (e) => {
        const { name, value } = e.target;
        const selectedState = stateList.find((state) => state?.name === value);
        if (name === "state") {
            if (value === "") {
                // setFormDataErr((prev) => ({
                //     ...prev,
                //     state: "State is required",
                // }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    state: "",
                }));
            }
        }

        if (selectedState) {
            setCountryData((prev) => ({
                ...prev,
                stateName: selectedState?.name,
                stateISOCode: selectedState?.isoCode,
            }));
            setFormData((prev) => ({
                ...prev,
                state: selectedState?.name
            }))
        } else {
            setCountryData((prev) => ({
                ...prev,
                stateName: "",
                stateISOCode: "",
            }));

        }
    };

    // ----- Handling the city name as per the state name
    const handleCity = (e) => {
        const { name, value } = e.target;
        if (name === "city") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    city: "City is required",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    city: "",
                }));
            }
        }
        setCountryData((prev) => ({
            ...prev,
            cityName: value,
        }));

        setFormData((prev) => ({
            ...prev,
            city: value
        }))
    };






    const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false); // State to track loading

    const [stockIds, setStockIds] = useState({});
    const [paymentOptions, setPaymentOptions] = useState({});
    const [priceOption, setPriceOption] = useState({})
    const [customizableOption, setCustomizableOption] = useState([]);
    const [quantityNum, setQuantityNum] = useState(1);


    async function getAddresses() {
        try {
            setIsLoading(true);
            const response = await customerService.getAddresses(customerData?._id);
            setAddresses(response?.data?.addresses || []);
            if (response?.data?.addresses?.length > 0) {
                setSelectedAddress(response.data.addresses[0]);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setIsLoading(false);
        }
    }


    const handleDeliverHere = () => {
        if (!selectedAddress) {
            alert('Please select a delivery address.');
            return;
        }
    };

    const handlePaymentSelection = (option) => {
        setSelectedPaymentOption(option);
    };


    const [payableData, setPayableData] = useState({
        amountBeforeDiscount: 0,
        discountAmount: 0,
        totalAmount: 0
    });

    console.log("payableData", payableData);





    function convertPricingTiers(pricingArray) {
        return pricingArray.map((item, index, arr) => ({
            minQuantity: item.quantity,
            maxQuantity: index < arr.length - 1 ? arr[index + 1].quantity - 1 : null,
            unitPrice: item.unitPrice,
            hasDiscount: item?.hasDiscount,
            discountPercent: item?.discountPercent
        }));
    };


    useEffect(() => {
        const getCarts = async () => {
            try {
                setIsPageLoading(true);
                const response = await customerService.getCarts(null);
                setCartData(response?.data?.data);

                const newCartsArray = response?.data?.data?.items?.map((cart) => {
                    const priceArray = convertPricingTiers(cart?.productMainStock?.variant?.priceId?.price);
                    const priceObject = priceArray.find(item =>
                        cart?.quantity >= item.minQuantity &&
                        (item.maxQuantity === null || cart?.quantity <= item.maxQuantity)
                    ) || null;
                    let finalPrice = 0;
                    if (priceObject) {
                        const discountedUnitPrice = priceObject?.unitPrice - priceObject?.unitPrice * (priceObject?.discountPercent / 100);
                        finalPrice = (cart?.quantity * discountedUnitPrice).toFixed(2)
                    }

                    return {
                        ...cart,
                        priceObject: priceObject ? priceObject : null,
                        finalPrice: priceObject ? finalPrice : null,
                        price: cart?.quantity * priceObject?.unitPrice
                    }
                });



                setCarts(newCartsArray || []);
                setIsPageLoading(false)
            } catch (error) {
                setCartData(null);
                setCarts([]);
                console.error("Error fetching carts:", error);
                setIsPageLoading(false)
            }
        };
        getCarts();
        getAddresses();

    }, [refreshCount]);


    useEffect(() => {

        // Calculate payable data in a single step
        const payableData = carts.reduce(
            (acc, cart) => {
                const priceObject = cart.priceObject;
                const itemPrice = (priceObject && priceObject?.hasDiscount)
                    ? Number(cart.finalPrice)
                    : Number(cart?.priceOption?.price) || 0;
                const discount = (priceObject && priceObject?.hasDiscount)
                    ? Number(priceObject.unitPrice) * (Number(priceObject.discountPercent) / 100)
                    : 0;


                const price = (priceObject && priceObject?.hasDiscount)
                    ? Number(cart.price)
                    : Number(cart?.priceOption?.price);
                return {
                    amountBeforeDiscount: Number((acc.amountBeforeDiscount + price).toFixed(2)),
                    discountAmount: Number((acc.discountAmount + discount).toFixed(2)),
                    totalAmount: Number((acc.totalAmount + itemPrice).toFixed(2)),
                };
            },
            { amountBeforeDiscount: 0, discountAmount: 0, totalAmount: 0 }
        );

        setPayableData(payableData)

    }, [carts])






    const handleQuantityChange = (delta, id) => {

        const newCartsArray = carts?.map((cart) => {

            if (cart?._id === id) {
                const priceArray = convertPricingTiers(cart?.productMainStock?.variant?.priceId?.price);
                const priceObject = priceArray.find(item =>
                    Math.max(1, cart?.priceOption.quantity + delta) >= item.minQuantity &&
                    (item.maxQuantity === null || Math.max(1, cart?.priceOption.quantity + delta) <= item.maxQuantity)
                ) || null;
                let finalPrice = 0;
                if (priceObject) {
                    const discountedUnitPrice = priceObject?.unitPrice - priceObject?.unitPrice * (priceObject?.discountPercent / 100);
                    finalPrice = (Math.max(1, cart?.priceOption.quantity + delta) * discountedUnitPrice).toFixed(2)
                }
                return {
                    ...cart,
                    priceOption: { ...cart?.priceOption, quantity: Math.max(1, cart?.priceOption.quantity + delta), price: Math.max(1, cart?.priceOption.quantity + delta) * priceObject?.unitPrice },
                    priceObject: priceObject ? priceObject : null,
                    finalPrice: priceObject ? finalPrice : null,
                    price: (Math.max(1, cart?.priceOption.quantity + delta) * priceObject?.unitPrice).toFixed(2),
                }
            } else {
                return cart
            }
        });
        setCarts(newCartsArray)
    };

    // place order 
    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        console.log("selectedAddress", selectedAddress);
        
        setIsLoading(true);
        try {

            const itemsArray = carts?.map((item) => {
                return {
                    quantity: item?.priceOption?.quantity,
                    productMainStockId: item?.productMainStock?._id,
                    productStockId: item?.productStock?._id
                }
            });

            const response = await customerService.placeOrderFromCart({
                clientId,
                addressId: selectedAddress?._id,
                itemsArray: JSON.stringify(itemsArray)
            });
            toast.success(response?.data?.message);
            navigate("/order");
            // setCartData(null);
            // setCarts([]);
            // setRefreshCount((prev) => prev + 1);
            // setShowAddressModal(false);
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error(error?.response?.data?.message || "Failed to place order");
        } finally {
            setIsLoading(false);
        }
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
            <div className="w-[100%] min-h-[50vh] flex justify-center px-2 sm:px-6 lg:px-8 py-6">
                <div className={`w-[100%] flex md:flex-row flex-col-reverse gap-2 lg:gap-4 xl:w-[70%] lg:w-[90%] md:w-[100%] `}>
                    <div className={`w-[100%] md:w-[70%] h-fit relative ${isDark ? 'dark:bg-gray-800' : 'bg-white'
                        }  rounded-lg  p-4 sm:p-6`}>
                        <div className=''>
                            <div>
                                <div
                                    className={`relative mb-6 p-4  rounded-lg border border-gray-200 dark:border-gray-600 ${isDark ? 'dark:bg-gray-800' : 'bg-white'
                                        }`}
                                >
                                    <div className='flex mb-3 items-center gap-2'>
                                        <div className=" top-2 left-2 flex items-center justify-center w-6 h-6 p-2 bg-green-100 border-2 border-green-500 rounded-full">
                                            <span className="text-sm font-medium text-green-700">1</span>
                                        </div>
                                        <h3 className="text-lg font-semibold  text-gray-900 dark:text-white ">DELIVERY ADDRESS</h3>
                                    </div>

                                    {selectedAddress ? (
                                        <div className="text-gray-700 dark:text-gray-300">
                                            <p className="font-medium">{selectedAddress.fullName}</p>
                                            <p>
                                                {selectedAddress.roadName}, {selectedAddress.city}, {selectedAddress.state} -{' '}
                                                {selectedAddress.ZipCode}
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                                <button
                                                    onClick={() => setShowAddressModal(true)}
                                                    className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                                                >
                                                    Change Address
                                                </button>
                                                <button
                                                    onClick={handleDeliverHere}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Processing...' : 'Deliver Here'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-600 dark:text-gray-400">
                                            <p>No address selected.</p>
                                            <button
                                                onClick={() => setShowAddressModal(true)}
                                                className="mt-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                                            >
                                                Select or Add Address
                                            </button>
                                        </div>
                                    )}

                                </div>
                                {true && (

                                    <>
                                        <div className=''>
                                            <div className='flex items-center gap-2 px-4 bg-green-600 mb-2'>
                                                <div className=" top-2 left-2 flex items-center justify-center w-6 h-6 p-2 bg-green-100 border-2 border-green-500 rounded-full">
                                                    <span className="text-sm font-medium text-green-700">2</span>
                                                </div>
                                                <h3 className="mt-2 mb-2 text-lg font-semibold text-white  dark:text-white">ORDER SUMMARY</h3>
                                            </div>

                                            {
                                                carts && carts?.length > 0 ? carts?.map((cart, index) => {
                                                    const productDetail = cart?.productMainStock;
                                                    const priceOption = cart?.priceOption;
                                                    const priceObject = cart?.priceObject;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`relative mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-600 ${isDark ? 'dark:bg-gray-800' : 'bg-white'
                                                                }`}
                                                        >
                                                            <div className="">
                                                                <div
                                                                    className="flex justify-between flex-col  gap-4 py-2  dark:border-gray-600 lg:flex-row"
                                                                >
                                                                    <div className="flex md:items-center gap-4">
                                                                        <img
                                                                            src={`${productDetail.images[0]}`}
                                                                            alt={productDetail.name}
                                                                            className="object-cover w-20 h-20 rounded-md"
                                                                        />
                                                                        <div>
                                                                            <h3 className="text-base dark:text-gray-100 font-semibold">
                                                                                {productDetail.name}
                                                                            </h3>
                                                                            <p className="text-base dark:text-black ">
                                                                                <span className="font-bold"></span> <span className="text-gray-600 dark:text-gray-400">{productDetail?.description}</span>
                                                                            </p>
                                                                            <div className="flex  flex-col gap-2">
                                                                                {priceObject?.hasDiscount ? (
                                                                                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                                                                        <span className="inline w-fit bg-green-600 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-lg transition-colors hover:bg-green-700">
                                                                                            {`-${priceObject?.discountPercent}%`}
                                                                                        </span>
                                                                                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">₹{cart?.finalPrice}</p>
                                                                                        <span className="text-sm font-serif text-gray-500 dark:text-gray-200">
                                                                                            MRP: <del>₹{cart?.price}</del>
                                                                                        </span>
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">₹{priceOption?.price}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center  gap-3">
                                                                        <div className="flex items-center px-1 border rounded-full">
                                                                            <button
                                                                                onClick={() => handleQuantityChange(-1, cart?._id)}
                                                                                disabled={priceOption?.quantity <= 1}
                                                                                className="px-2 py-2 rounded-full text-gray-600 dark:text-gray-100 disabled:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                            >
                                                                                <FaMinus />
                                                                            </button>
                                                                            <span className="px-2 py-2 dark:text-gray-100 text-gray-800">{priceOption?.quantity}</span>
                                                                            <button
                                                                                onClick={() => handleQuantityChange(1, cart?._id)}
                                                                                className="px-2 py-2 rounded-full text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                            >
                                                                                <FaPlus />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                customizableOption?.length > 0 ?
                                                                    <div
                                                                        className={`relative mb-6 p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 ${isDark ? 'dark:bg-gray-800' : 'bg-white'
                                                                            }`}
                                                                    >
                                                                        <div className='flex mb-3 items-center gap-2'>

                                                                            <h3 className="text-lg font-semibold  text-gray-900 dark:text-white ">Customization Form</h3>
                                                                        </div>
                                                                        <div className='flex mb-3 items-center gap-2'>
                                                                            <div className=" w-[100%] relative rounded-md  ">
                                                                                <h2 className="text-sm md:text-lg dark:text-gray-100 font-semibold mt-2 text-center my-3">This product is customiseable</h2>
                                                                                <div className="grid md:grid-cols-2 md:grid-col-1 gap-4 w-[100%] ">
                                                                                    {customizableOption && customizableOption?.length > 0 ?

                                                                                        customizableOption.map((field, index) => (
                                                                                            <div
                                                                                                key={index}
                                                                                                className={`flex flex-col ${field?.selectedField === "file" ? "md:col-span-2" : ""} `}
                                                                                            >
                                                                                                <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
                                                                                                    {field?.labelName}
                                                                                                </label>
                                                                                                {renderFieldPreview(field)}
                                                                                            </div>
                                                                                        )) : ""
                                                                                    }
                                                                                </div>
                                                                                <div className="flex justify-end mt-4">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            finalPlaceOrder()
                                                                                        }}
                                                                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
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
                                                                                                Placing order...
                                                                                            </span>
                                                                                        ) : (
                                                                                            <div className="flex justify-center items-center gap-2 ">
                                                                                                <span>Submit</span>
                                                                                            </div>

                                                                                        )}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : ""
                                                            }
                                                        </div>
                                                    )
                                                }) : null
                                            }
                                        </div>
                                    </>
                                )}
                                <div
                                    className={`relative mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-600 ${isDark ? 'dark:bg-gray-800' : 'bg-white'
                                        }`}
                                >
                                    <div className='flex mb-3 items-center gap-2'>
                                        <div className=" top-2 left-2 flex items-center justify-center w-6 h-6 p-2 bg-green-100 border-2 border-green-500 rounded-full">
                                            <span className="text-sm font-medium text-green-700">3</span>
                                        </div>
                                        <h3 className="text-lg font-semibold  text-gray-900 dark:text-white ">Payment Options</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(paymentOptions).map(([key, value]) => {
                                            if (key === 'paymentSteps' && paymentOptions.multiStep) {
                                                return (
                                                    <div key={key} className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="paymentOption"
                                                                value="multiStep"
                                                                checked={selectedPaymentOption === 'multiStep'}
                                                                onChange={() => handlePaymentSelection('multiStep')}
                                                                className="form-radio text-blue-600 focus:ring-blue-500"
                                                                aria-label="Multi-step payment"
                                                            />
                                                            <span className="text-gray-900 dark:text-white font-medium">Multi-step Payment</span>
                                                        </label>
                                                        <ul className="ml-6 mt-2 space-y-2 text-gray-600 dark:text-gray-300">
                                                            {value.map((step) => (
                                                                <li key={step._id}>
                                                                    {step.name}: {step.percentage}% of total amount
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                );
                                            }
                                            if (typeof value === 'boolean' && key !== 'multiStep') {
                                                const labelMap = {
                                                    cod: 'Cash on Delivery',
                                                    fullPayment: 'Full Payment',
                                                    wallet: 'Wallet',
                                                    bnpl: 'Buy Now, Pay Later',
                                                    upi: 'UPI',
                                                };
                                                return (
                                                    <>
                                                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="paymentOption"
                                                                value={key}
                                                                checked={selectedPaymentOption === key}
                                                                disabled={!value}
                                                                onChange={() => handlePaymentSelection(key)}
                                                                className="form-radio text-blue-600 focus:ring-blue-500"
                                                                aria-label={labelMap[key]}
                                                            />
                                                            <span className="text-gray-900 dark:text-white">{labelMap[key]}</span>
                                                        </label>
                                                        {
                                                            value ? "" : <span className='text-[0.80rem] text-red-600'>{`${labelMap[key]} is not available`}</span>
                                                        }
                                                    </>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <button
                                        onClick={() => handlePlaceOrder()}
                                        disabled={isLoading}
                                        className="mt-4 w-[100%] sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Processing...' : 'Continue to Payment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white sticky md:top-16 top-12 h-fit w-[100%] md:w-[30%] px-2 py-3 rounded-md'>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            Price Details
                        </h3>
                        <div className='h-[2px] border-dashed border-[1px]'></div>
                        <div className=" text-gray-700 dark:text-gray-300 mt-3">
                            {payableData &&
                                <div className="flex flex-col gap-2 ">
                                    <div className='flex justify-between'>
                                        <span className="text-sm  ">
                                            {`Price (${carts?.length} item):`}
                                        </span>
                                        <span>
                                            ₹{payableData?.amountBeforeDiscount}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className="text-sm   ">
                                            Discount :
                                        </span>
                                        <span>
                                            {`-${payableData?.discountAmount}`}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className="text-sm  ">
                                            Subtotal:
                                        </span>
                                        <span>
                                            ₹{payableData?.totalAmount}
                                        </span>
                                    </div>
                                    <div className='h-[2px] border-dashed border-[1px]'></div>
                                    <div className='flex justify-between'>
                                        <span className="font-bold text-gray-900 dark:text-white ">
                                            Total payable:
                                        </span>
                                        <span className='font-bold text-black dark:text-white'>
                                            ₹{payableData?.totalAmount}
                                        </span>
                                    </div>
                                    <hr />
                                    <div className='flex justify-between'>
                                        <span className="font-bold text-green-800 dark:text-white ">
                                            Your total saving on this order:
                                        </span>
                                        <span className='font-bold text-green-800 dark:text-white'>
                                            ₹{payableData?.discountAmount}
                                        </span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>




                <Transition appear show={showAddressModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => {
                            setShowAddressModal(false);
                            setShowAddAddressForm(false);
                        }}
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
                            <div className="flex min-h-full mt-10 items-center justify-center p-4 sm:p-6">
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
                                        className={`w-[100%]  sm:max-w-[50%] relative transform overflow-hidden rounded-md ${isDark ? 'dark:bg-gray-800' : 'bg-white'
                                            } dark:bg-gray-800 text-left align-middle shadow-xl transition-all p-6`}
                                        role="dialog"
                                        aria-labelledby="address-modal-title"
                                    >
                                        <span className='absolute right-2 top-2'>
                                            <button
                                                onClick={() => setShowAddressModal(false)}
                                            >
                                                <RxCross2 size={24} className='text-red-600 bg-red-100 rounded-full p-1 border-2' />
                                            </button>
                                        </span>

                                        <h2
                                            id="address-modal-title"
                                            className="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
                                        >
                                            {showAddAddressForm ? 'Add New Address' : 'Select Delivery Address'}
                                        </h2>
                                        {showAddAddressForm ? (
                                            <>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="">
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            value={formData.fullName}
                                                            onChange={handleChange}
                                                            placeholder="Full Name"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        />
                                                        <span className="text-red-800">{formDataErr?.fullName}</span>
                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="phone"
                                                            onInput={handleKeyPress}
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            placeholder="Phone Number"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        />
                                                        <span className="text-red-800">{formDataErr?.phone}</span>

                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="alternamtivePhone"
                                                            onInput={handleKeyPress}
                                                            value={formData.alternamtivePhone}
                                                            onChange={handleChange}
                                                            placeholder="Alternative Phone Number"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        />
                                                        <span className="text-red-800">{formDataErr?.alternamtivePhone}</span>

                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="ZipCode"
                                                            value={formData.ZipCode}
                                                            onChange={handleChange}
                                                            placeholder="Pincode"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        />
                                                        <span className="text-red-800">{formDataErr?.ZipCode}</span>

                                                    </div>


                                                    <div className="">
                                                        <select
                                                            name="country"
                                                            value={countryName}
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                            onChange={(e) => handleCountry(e)}
                                                        >
                                                            <option value="">--select country--</option>
                                                            {countryList && countryList.length > 0 &&
                                                                countryList?.map((country) => (
                                                                    <option className="w-[100%]" key={country?.isoCode}>
                                                                        {country && country?.name}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <span className="text-red-800">{formDataErr?.country}</span>
                                                    </div>

                                                    <div>
                                                        <select
                                                            name="state"
                                                            value={stateName}
                                                            // disabled={isViewed}
                                                            onChange={(e) => handleState(e)}
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        >
                                                            <option value="">---select state---</option>
                                                            {stateList &&
                                                                stateList?.map((state) => (
                                                                    <option key={state?.isoCode}>
                                                                        {state && state?.name}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <span className="text-red-800">{formDataErr?.state}</span>


                                                    </div>

                                                    <div>
                                                        <select
                                                            name="city"
                                                            value={cityName}
                                                            // disabled={isViewed}
                                                            onChange={(e) => handleCity(e)}
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        >
                                                            <option value="">---Select city---</option>
                                                            {cityList &&
                                                                cityList?.map((city) => (
                                                                    <option key={city?.name}>
                                                                        {city && city?.name}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <span className="text-red-800">{formDataErr?.city}</span>

                                                    </div>


                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="houseNumber"
                                                            value={formData.houseNumber}
                                                            onChange={handleChange}
                                                            placeholder="House Number"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}

                                                        />

                                                        <span className="text-red-800">{formDataErr?.houseNumber}</span>

                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="roadName"
                                                            value={formData.roadName}
                                                            onChange={handleChange}
                                                            placeholder="Road Name"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}

                                                        />

                                                        <span className="text-red-800">{formDataErr?.roadName}</span>

                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="nearbyLandmark"
                                                            value={formData.nearbyLandmark}
                                                            onChange={handleChange}
                                                            placeholder="Nearby Landmark"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        />
                                                        <span className="text-red-800">{formDataErr?.nearbyLandmark}</span>

                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleChange}
                                                            placeholder="Address"
                                                            className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                        />
                                                        <span className="text-red-800">{formDataErr?.address}</span>

                                                    </div>


                                                </div>

                                                <div className="mt-4 w-[100%] flex gap-2 justify-end">

                                                    {/* {
                                                            addressId ?
                                                                <button
                                                                    onClick={() => {
                                                                        setShowForm(false)
                                                                        clearData();
                                                                        setAddressId(null)
                                                                    }}
                                                                    // disabled={isSubmitting}
                                                                    className={`bg-red-400 hover:bg-red-400/35 text-white  ${width < breakpoints.sm ? "w-[100%] " : "w-[20%]"}  py-2 rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                : ""
                                                        } */}

                                                    <button
                                                        onClick={() => setShowAddAddressForm(false)}
                                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        onClick={handleSave}
                                                        disabled={isSubmitting}
                                                        className={`bg-lightButton hover:bg-lightButton/35 text-white  ${width < breakpoints.sm ? "w-[100%] " : "w-[20%]"}  py-2 rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
                                                    >
                                                        {isSubmitting ? (
                                                            <svg
                                                                className="animate-spin h-5 w-5 text-white"
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
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            "Save Address"
                                                        )}
                                                    </button>
                                                </div>

                                            </>



                                        ) : (
                                            <>
                                                <select
                                                    value={selectedAddress?._id || ''}
                                                    onChange={(e) => {
                                                        const selected = addresses.find((addr) => addr._id === e.target.value);
                                                        setSelectedAddress(selected || null);
                                                    }}
                                                    className={`w-[100%] ${isDark ? "bg-gray-600 text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                                                    aria-label="Select delivery address"
                                                >
                                                    <option value="" disabled>
                                                        Select an address...
                                                    </option>
                                                    {addresses.map((addr) => (
                                                        <option key={addr._id} value={addr._id}>
                                                            {addr.fullName}, {addr.roadName}, {addr.city}, {addr.state} - {addr.ZipCode}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => setShowAddAddressForm(true)}
                                                    className="mt-4 w-[100%] px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                                                >
                                                    Add New Address
                                                </button>
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button
                                                        onClick={() => setShowAddressModal(false)}
                                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => setShowAddressModal(false)}
                                                        disabled={isLoading || !selectedAddress}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                                                    >
                                                        Confirm Address
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>


            </div>

            <div className="w-[100%] flex flex-col items-center justify-center">
                <div className="w-[100%]  ">
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default CheckoutFromCart