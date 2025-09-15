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



  function handleEditProfile () {
    navigate("/profile");
  }




  return (
      <div className="container mx-auto px-2 py-6 ">
      <div className={ ` ${width < breakpoints.sm ? "px-2 w-[100%] " : "px-0 w-[100%] "} bg-lightText dark:bg-carBgDark px-3 py-3 rounded-md `}>


        {/* Top Buttons Section */}
        <div className="grid grid-cols-2 gap-3 text-center text-sm sm:text-base">
          <button
           onClick={() => navigate("/order")}
           className="bg-lightButton px-4 py-3  text-white  hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 p-3 rounded-lg flex items-center justify-center gap-2">
            <FaBox /> Orders
          </button>
          <button className="bg-lightButton px-4 py-3  text-white  hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 p-3 rounded-lg flex items-center justify-center gap-2">
            <FaHeart /> Wishlist
          </button>
          <button className="bg-lightButton px-4 py-3  text-white  hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 p-3 rounded-lg flex items-center justify-center gap-2">
            <FaQuestionCircle /> Ask Query
          </button>
          <button className="bg-lightButton px-4 py-3  text-white  hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 p-3 rounded-lg flex items-center justify-center gap-2">
            <FaHeadset /> Help Center
          </button>
        </div>

        {/* Recently Viewed Products */}
        <div className="mt-6">
          <span className="font-bold text-lg">Recently Viewed</span>
          <div className="flex overflow-x-auto gap-3 mt-2 p-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-24 h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-6">
          <span className="font-bold text-lg ">Account Settings</span>
          <div className="grid gap-2 mt-2">
            <SettingItem2 action={handleEditProfile} icon={<FaUser className="text-lightButton" />} text="Edit Profile" />
            <SettingItem2 action={() => navigate("/address")} icon={<FaMapMarkerAlt className="text-lightButton" />} text="My Addresses" />
            <SettingItem2 icon={<FaLanguage className="text-lightButton" />} text="Select Language" />
            <SettingItem2 icon={<FaBell className="text-lightButton" />} text="Notification Settings" />
            <SettingItem2 icon={<FaShieldAlt className="text-lightButton" />} text="Privacy Settings" />
          </div>
        </div>

        {/* My Activity */}
        <div className="mt-6 w-[100%]">
          <span className="font-bold text-lg">My Activity</span>
          <div className="grid grid-cols-2 w-[100%]  gap-3 mt-2">
            <SettingItem icon={<FaStar />} text="Reviews" />
            <SettingItem icon={<FaQuestionCircle />} text="Questions & Answers" />
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center">
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
    className=" dark:bg-carBgDark hover:bg-lightButton/30 hover:text-lightButton transition-all duration-300 p-3 border-b-2 border-l-2 border-lightButton hover:border-red-600 flex items-center justify-between w-[100%]"
  >
    <div className="flex items-center gap-3">
      {icon} {text}
    </div>
    <FaChevronRight className="text-lightButton group-hover:text-lightButton transition-all duration-300" />
  </button>
);


const SettingItem = ({ icon, text  }) => (
  <button 
  className="bg-lightButton px-4 py-3  text-white  hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 p-3 rounded-lg flex items-center justify-center gap-2"
  >
 {icon} {text}
</button>
);

export default Account;
