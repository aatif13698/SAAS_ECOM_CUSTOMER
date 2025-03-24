import React, { useEffect, useState } from "react";
import { FaBox, FaHeart, FaQuestionCircle, FaHeadset, FaUser, FaMapMarkerAlt, FaLanguage, FaBell, FaShieldAlt, FaStar, FaSignOutAlt } from "react-icons/fa";
import useWidth from "../../Hooks/useWidth";
import { logOut } from "../../store/reducer/auth/authCustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useDarkmode from "../../Hooks/useDarkMode";
import profileImg from "../../assets/users/user1.jpg"
import { BsFillPencilFill } from "react-icons/bs";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";

function Profile() {

  const { width, breakpoints } = useWidth();
  const [isDark] = useDarkmode();
  const { clientUser: customerData, isAuth: isLogedIn } = useSelector((state) => state?.authCustomerSlice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: ""
  });
  const [profileDataError, setProfileDataError] = useState({
    firstName: "",
    lastName: ""
  });

  useEffect(() => {
    if (customerData) {
      setProfileData({
        firstName: customerData?.firstName,
        lastName: customerData?.lastName
      })
    }
  }, [customerData])


  const [panFile, setPanFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const handlePanFileChange = (e) => {
    setPanFile(e.target.files[0]);
  };

  const handlePanSubmit = () => {
    if (!termsAccepted) {
      alert("Please accept the terms & conditions.");
      return;
    }
    alert("PAN details submitted successfully!");
  };

  const [iconImgErr, setIconImgErr] = useState("");
  const [imgPreview, setImgPreviwe] = useState(null);
  const [selectedFile, setselectedFile] = useState(null);

  const handleFileChange = (e) => {
    const { name, value } = e.target;
    if (name == "profileImage") {
      if (!selectedFile && value == "") {
        // setFormDataErr((prev) => ({
        //   ...prev,
        //   profileImage: "Img is required",
        // }));
      } else {
        // setFormDataErr((prev) => ({
        //   ...prev,
        //   profileImage: "",
        // }));
      }
    }
    setIconImgErr("");
    let fileSize = 0;
    let errorCount = 0;
    const file = e.target.files[0];
    if (file) {
      fileSize = file.size / 1024;
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        setIconImgErr("Only img file is allowd");
        errorCount++;
      }
      if (fileSize > 1024) {
        setIconImgErr("file size less than 1MB");
        errorCount++;
      }
      if (errorCount === 0) {
        const imageAsBase64 = URL.createObjectURL(file);
        setselectedFile(file);
        setImgPreviwe(imageAsBase64);
      }
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    let dataobject = {
      firstName: profileData.firstName,
      lastName: profileData.lastName
    }
    if (name == "firstName") {
      if (!value) {
        setProfileDataError((prev) => ({
          ...prev,
          firstName: "First Name is required!"
        }))

      } else if (value.length < 3) {
        setProfileDataError((prev) => ({
          ...prev,
          firstName: "At least 3 characters required!"
        }))
      } else {
        setProfileDataError((prev) => ({
          ...prev,
          firstName: ""
        }))

      }
      dataobject.firstName = value
    } else if (name == "lastName") {
      if (!value) {
        setProfileDataError((prev) => ({
          ...prev,
          lastName: "Last Name is required!"
        }))
      } else if (value.length < 3) {
        setProfileDataError((prev) => ({
          ...prev,
          lastName: "At least 3 characters required!"
        }))
      } else {
        setProfileDataError((prev) => ({
          ...prev,
          lastName: ""
        }))
      }
      dataobject.lastName = value
    }
    setProfileData(dataobject)
  }


  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const formAppend = new FormData();
      if (selectedFile) {
        formAppend.append("profileImage", selectedFile)
      }
      formAppend.append("clientId", import.meta.env.VITE_DATABASE_ID);
      formAppend.append("firstName", profileData?.firstName);
      formAppend.append("lastName", profileData?.lastName);
      const response = await customerService.updateProfile(formAppend);
      toast.success(response.data.message)
    } catch (error) {
      console.log("error while editing the profile", error);
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      const response = await customerService.getProfile(customerData?._id);
      const data = response?.data?.data
      setProfileData({
        firstName: data?.firstName,
        lastName: data?.lastName
      })
      setImgPreviwe(`${import.meta.env.VITE_API_URL}/profile/${data?.profileImage}`)
    } catch (error) {
      console.log("error while getting the profile", error);
    }
  }


  return (
    <div className={` w-[100%] mt-4 mb-3 flex justify-center ${width < breakpoints.sm ? "px-2  " : "px-0 "}  `}>
      <div className={` ${width < breakpoints.sm ? "px-2 w-[100%] " : "px-0 w-[60%] "} bg-lightText px-3 py-3 rounded-md `}>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <div className='flex flex-col justify-center items-center flex-wrap relative'>
            <label htmlFor="profileImage" className="cursor-pointer ">
              <img src={imgPreview ? imgPreview : profileImg} className=' w-24 h-24  object-cover border-[3px] border-[#ffffff] shadow-md rounded-md' alt="" />
            </label>

            {/* <label htmlFor="profileImage" className='border flex items-center justify-center w-6 h-6 rounded-[50%] bg-white shadow-lg absolute top-[-0.6rem] left-[5.2rem]'>
              <Link to=""
                title='Change Avatar'
              >
                <BsFillPencilFill className='text-xs text-[#99A1B7] hover:text-lightHoverBgBtn' />

              </Link>
            </label> */}
            <input
              id="profileImage"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                handleFileChange(e);
              }}
            // disabled={isViewed}
            />
            <span style={{ color: "red", fontSize: "0.7em" }}>
              {<p className="text-red-600 text-xs pt-6 ">{iconImgErr}</p>}
            </span>
            <label
              htmlFor="profileImage"
              className="cursor-pointer"
            >
              <p className='dark:text-white text-center'> {!imgPreview ? "Upload Photo" : selectedFile?.name}</p>
            </label>{" "}
          </div>
          <div className="w-[100%] space-y-4 mt-4">
            <div>
              <input name="firstName" type="text" placeholder="First Name" value={profileData?.firstName} onChange={handleChange}
                className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
              />
              <span className="text-red-900">{profileDataError?.firstName}</span>
            </div>
            <div>
              <input name="lastName" type="text" placeholder="Last Name" value={profileData?.lastName} onChange={handleChange}
                className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
              />
              <span className="text-red-900">{profileDataError?.lastName}</span>

            </div>
          </div>

          <div className="mt-4 w-[100%] flex justify-end">

            <button
              onClick={handleSubmit}
              // disabled={isSubmitting}
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
                "Submit"
              )}
            </button>
          </div>
        </div>


        {/* Contact Section */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Contact Details</h2>
          <div className="flex items-center gap-3 mt-2">
            <input type="text" placeholder="Phone Number"
              className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
            />
            <button
              className={`bg-lightButton hover:bg-lightButton/35 text-white px-4 py-2    rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
            >Update</button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input type="email" placeholder="Email Address"
              className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
            />
            <button
              className={`bg-lightButton hover:bg-lightButton/35 text-white px-4 py-2    rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
            >Verify</button>
          </div>
        </div>


        {/* PAN Card Section */}
        <div className="bg-gray-100  space-y-4 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Upload PAN Card</h2>
          <input type="text" placeholder="PAN Card Number"
            className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
          />
          <input type="text" placeholder="Full Name (as per PAN)"
            className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
          />
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-600">Upload PAN Card</label>
            <input type="file" className="mt-1  border p-2 rounded-lg" onChange={handlePanFileChange} />
          </div>
          <div className="flex items-center mt-3">
            <input type="checkbox" id="terms" className="mr-2" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
            <label htmlFor="terms" className="text-sm">I accept the Terms & Conditions</label>
          </div>
          <div className="flex justify-end">
            <button onClick={handlePanSubmit}
              className={`bg-lightButton hover:bg-lightButton/35 text-white  ${width < breakpoints.sm ? "w-[100%] " : "w-[20%]"}  py-2 rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
            >Submit</button>

          </div>

        </div>











      </div>



    </div>
  );
}

const SettingItem2 = ({ icon, text }) => (
  <button className="bg-white p-3 border-b-2 border-l-2 border-lightButton flex items-center gap-3 w-[100%]">
    {icon} {text}
  </button>
);


const SettingItem = ({ icon, text }) => (
  <button className="bg-lightButton text-lightText p-3 rounded-lg flex items-center justify-center gap-2">
    {icon} {text}
  </button>
);

export default Profile;
