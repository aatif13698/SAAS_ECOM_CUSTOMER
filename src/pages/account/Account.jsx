import React from "react";
import { FaBox, FaHeart, FaQuestionCircle, FaHeadset, FaUser, FaMapMarkerAlt, FaLanguage, FaBell, FaShieldAlt, FaStar, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import { logOut } from "../../store/reducer/auth/authCustomerSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Account() {

  const { width, breakpoints } = useWidth();
  const dispatch = useDispatch();
  const navigate = useNavigate()





  function handleLogout() {
    localStorage.removeItem("SAAS_ECOM_customer_token")
    localStorage.removeItem("SAAS_ECOM_customerInfo")
    localStorage.removeItem("SAAS_ECOM_expiryTime")
    dispatch(logOut());
    navigate("/login");
  }



  function handleEditProfile() {
    navigate("/profile");
  }




  return (
    <div className="container  py-6 ">
      <div className={` ${width < breakpoints.sm ? " w-[100%] " : " w-[100%] "}   rounded-md `}>


        {/* Top Buttons Section */}
        <div className="grid grid-cols-2 gap-3 bg-white dark:bg-gray-800 shadow-lg px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg text-center text-sm sm:text-base">
          <button
            onClick={() => navigate("/order")}
            className="group relative px-4 py-3 border-2 border-lightButton text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md disabled:opacity-50"
          >
            <FaBox className="group-hover:scale-110 transition-transform duration-300" /> Orders
          </button>
          <button
            className="group relative px-4 py-3 border-2 border-lightButton text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md disabled:opacity-50"
          >
            <FaHeart className="group-hover:scale-110 transition-transform duration-300" /> Wishlist
          </button>
          <button
            className="group relative px-4 py-3 border-2 border-lightButton text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md disabled:opacity-50"
          >
            <FaQuestionCircle className="group-hover:scale-110 transition-transform duration-300" /> Ask Query
          </button>
          <button
            className="group relative px-4 py-3 border-2 border-lightButton text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md disabled:opacity-50"
          >
            <FaHeadset className="group-hover:scale-110 transition-transform duration-300" /> Help Center
          </button>
        </div>

        {/* Recently Viewed Products */}
        <div className="mt-2 w-[100%] bg-white dark:bg-gray-800 shadow-lg px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg">
          <span className="font-bold text-lg">Recently Viewed</span>
          <div className="flex overflow-x-auto gap-3 mt-2 p-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-24 h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Account Settings */}

        <div className="mt-2 w-[100%] bg-white dark:bg-gray-800 shadow-lg px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg">
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Account Settings</span>
          <div className="grid gap-2 mt-3">
            <SettingItem2 action={handleEditProfile} icon={<FaUser className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />} text="Edit Profile" />
            <SettingItem2 action={() => navigate("/address")} icon={<FaMapMarkerAlt className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />} text="My Addresses" />
            <SettingItem2 icon={<FaLanguage className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />} text="Select Language" />
            <SettingItem2 icon={<FaBell className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />} text="Notification Settings" />
            <SettingItem2 icon={<FaShieldAlt className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />} text="Privacy Settings" />
          </div>
        </div>

        {/* My Activity */}
        <div className="mt-2 w-[100%] bg-white dark:bg-gray-800 shadow-lg px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg">
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">My Activity</span>
          <div className="grid grid-cols-2 gap-3 mt-3 w-[100%]">
            <SettingItem action={() => navigate("/list/rating")} icon={<FaStar className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />} text="Reviews" />
            <SettingItem icon={<FaQuestionCircle className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />} text="Questions & Answers" />
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-2 text-center">
          <button onClick={handleLogout} className={`bg-red-500 hover:bg-red-500/45 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${width < breakpoints.sm ? "w-[100%] " : "w-[20%]"}`}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

      </div>



    </div>
  );
}
const SettingItem2 = ({ icon, text, action }) => (
  <button
    onClick={action}
    className="group relative flex items-center justify-between w-[100%] px-4 py-3 bg-white dark:bg-gray-800 border-l-2 border-b-2 border-lightButton hover:border-lightButton/60 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md rounded-md"
  >
    <div className="flex items-center gap-3 text-lightButton group-hover:text-lightButton/60 transition-colors duration-300">
      {icon} <span>{text}</span>
    </div>
    <FaChevronRight className="text-lightButton group-hover:text-lightButton/60 transition-colors duration-300" />
  </button>
);



const SettingItem = ({ icon, text, action }) => (
  <button
   onClick={action}
    className="group relative px-4 py-3 border-2 border-lightButton text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md disabled:opacity-50"
  >
    {icon} {text}
  </button>
);

export default Account;
