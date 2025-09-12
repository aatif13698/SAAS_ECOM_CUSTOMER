// import React, { useEffect, useState } from "react";
// import { FaBox, FaHeart, FaQuestionCircle, FaHeadset, FaUser, FaMapMarkerAlt, FaLanguage, FaBell, FaShieldAlt, FaStar, FaSignOutAlt } from "react-icons/fa";
// import useWidth from "../../Hooks/useWidth";
// import { logOut } from "../../store/reducer/auth/authCustomerSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import useDarkmode from "../../Hooks/useDarkMode";
// import profileImg from "../../assets/users/user1.jpg"
// import { BsFillPencilFill } from "react-icons/bs";
// import customerService from "../../services/customerService";
// import toast from "react-hot-toast";

// function Profile() {

//   const { width, breakpoints } = useWidth();
//   const [isDark] = useDarkmode();
//   const { clientUser: customerData, isAuth: isLogedIn } = useSelector((state) => state?.authCustomerSlice);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: ""
//   });
//   const [profileDataError, setProfileDataError] = useState({
//     firstName: "",
//     lastName: ""
//   });

//   useEffect(() => {
//     if (customerData) {
//       setProfileData({
//         firstName: customerData?.firstName,
//         lastName: customerData?.lastName
//       })
//     }
//   }, [customerData])


//   const [panFile, setPanFile] = useState(null);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const handlePanFileChange = (e) => {
//     setPanFile(e.target.files[0]);
//   };

//   const handlePanSubmit = () => {
//     if (!termsAccepted) {
//       alert("Please accept the terms & conditions.");
//       return;
//     }
//     alert("PAN details submitted successfully!");
//   };

//   const [iconImgErr, setIconImgErr] = useState("");
//   const [imgPreview, setImgPreviwe] = useState(null);
//   const [selectedFile, setselectedFile] = useState(null);

//   const handleFileChange = (e) => {
//     const { name, value } = e.target;
//     if (name == "profileImage") {
//       if (!selectedFile && value == "") {
//         // setFormDataErr((prev) => ({
//         //   ...prev,
//         //   profileImage: "Img is required",
//         // }));
//       } else {
//         // setFormDataErr((prev) => ({
//         //   ...prev,
//         //   profileImage: "",
//         // }));
//       }
//     }
//     setIconImgErr("");
//     let fileSize = 0;
//     let errorCount = 0;
//     const file = e.target.files[0];
//     if (file) {
//       fileSize = file.size / 1024;
//       if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         setIconImgErr("Only img file is allowd");
//         errorCount++;
//       }
//       if (fileSize > 1024) {
//         setIconImgErr("file size less than 1MB");
//         errorCount++;
//       }
//       if (errorCount === 0) {
//         const imageAsBase64 = URL.createObjectURL(file);
//         setselectedFile(file);
//         setImgPreviwe(imageAsBase64);
//       }
//     }
//   };

//   function handleChange(e) {
//     const { name, value } = e.target;
//     let dataobject = {
//       firstName: profileData.firstName,
//       lastName: profileData.lastName
//     }
//     if (name == "firstName") {
//       if (!value) {
//         setProfileDataError((prev) => ({
//           ...prev,
//           firstName: "First Name is required!"
//         }))

//       } else if (value.length < 3) {
//         setProfileDataError((prev) => ({
//           ...prev,
//           firstName: "At least 3 characters required!"
//         }))
//       } else {
//         setProfileDataError((prev) => ({
//           ...prev,
//           firstName: ""
//         }))

//       }
//       dataobject.firstName = value
//     } else if (name == "lastName") {
//       if (!value) {
//         setProfileDataError((prev) => ({
//           ...prev,
//           lastName: "Last Name is required!"
//         }))
//       } else if (value.length < 3) {
//         setProfileDataError((prev) => ({
//           ...prev,
//           lastName: "At least 3 characters required!"
//         }))
//       } else {
//         setProfileDataError((prev) => ({
//           ...prev,
//           lastName: ""
//         }))
//       }
//       dataobject.lastName = value
//     }
//     setProfileData(dataobject)
//   }


//   async function handleSubmit(e) {
//     e.preventDefault()
//     try {
//       const formAppend = new FormData();
//       if (selectedFile) {
//         formAppend.append("profileImage", selectedFile)
//       }
//       formAppend.append("clientId", import.meta.env.VITE_DATABASE_ID);
//       formAppend.append("firstName", profileData?.firstName);
//       formAppend.append("lastName", profileData?.lastName);
//       const response = await customerService.updateProfile(formAppend);
//       toast.success(response.data.message)
//     } catch (error) {
//       console.log("error while editing the profile", error);
//     }
//   }

//   useEffect(() => {
//     getProfile()
//   }, [])

//   async function getProfile() {
//     try {
//       const response = await customerService.getProfile(customerData?._id);
//       const data = response?.data?.data
//       setProfileData({
//         firstName: data?.firstName,
//         lastName: data?.lastName
//       })
//       setImgPreviwe(`${import.meta.env.VITE_API_URL}/profile/${data?.profileImage}`)
//     } catch (error) {
//       console.log("error while getting the profile", error);
//     }
//   }


//   return (
//     <div className={` w-[100%] mt-4 mb-3 flex justify-center ${width < breakpoints.sm ? "px-2  " : "px-0 "}  `}>
//       <div className={` ${width < breakpoints.sm ? "px-2 w-[100%] " : "px-0 w-[60%] "} bg-lightText px-3 py-3 rounded-md `}>

//         {/* Profile Section */}
//         <div className="flex flex-col items-center mb-6">
//           <div className='flex flex-col justify-center items-center flex-wrap relative'>
//             <label htmlFor="profileImage" className="cursor-pointer ">
//               <img src={imgPreview ? imgPreview : profileImg} className=' w-24 h-24  object-cover border-[3px] border-[#ffffff] shadow-md rounded-md' alt="" />
//             </label>

//             {/* <label htmlFor="profileImage" className='border flex items-center justify-center w-6 h-6 rounded-[50%] bg-white shadow-lg absolute top-[-0.6rem] left-[5.2rem]'>
//               <Link to=""
//                 title='Change Avatar'
//               >
//                 <BsFillPencilFill className='text-xs text-[#99A1B7] hover:text-lightHoverBgBtn' />

//               </Link>
//             </label> */}
//             <input
//               id="profileImage"
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={(e) => {
//                 handleFileChange(e);
//               }}
//             // disabled={isViewed}
//             />
//             <span style={{ color: "red", fontSize: "0.7em" }}>
//               {<p className="text-red-600 text-xs pt-6 ">{iconImgErr}</p>}
//             </span>
//             <label
//               htmlFor="profileImage"
//               className="cursor-pointer"
//             >
//               <p className='dark:text-white text-center'> {!imgPreview ? "Upload Photo" : selectedFile?.name}</p>
//             </label>{" "}
//           </div>
//           <div className="w-[100%] space-y-4 mt-4">
//             <div>
//               <input name="firstName" type="text" placeholder="First Name" value={profileData?.firstName} onChange={handleChange}
//                 className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
//               />
//               <span className="text-red-900">{profileDataError?.firstName}</span>
//             </div>
//             <div>
//               <input name="lastName" type="text" placeholder="Last Name" value={profileData?.lastName} onChange={handleChange}
//                 className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
//               />
//               <span className="text-red-900">{profileDataError?.lastName}</span>

//             </div>
//           </div>

//           <div className="mt-4 w-[100%] flex justify-end">

//             <button
//               onClick={handleSubmit}
//               // disabled={isSubmitting}
//               className={`bg-lightButton hover:bg-lightButton/35 text-white  ${width < breakpoints.sm ? "w-[100%] " : "w-[20%]"}  py-2 rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
//             >
//               {isSubmitting ? (
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8H4z"
//                   ></path>
//                 </svg>
//               ) : (
//                 "Submit"
//               )}
//             </button>
//           </div>
//         </div>


//         {/* Contact Section */}
//         <div className="bg-gray-100 p-4 rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-2">Contact Details</h2>
//           <div className="flex items-center gap-3 mt-2">
//             <input type="text" placeholder="Phone Number"
//               className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
//             />
//             <button
//               className={`bg-lightButton hover:bg-lightButton/35 text-white px-4 py-2    rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
//             >Update</button>
//           </div>
//           <div className="flex items-center gap-3 mt-2">
//             <input type="email" placeholder="Email Address"
//               className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
//             />
//             <button
//               className={`bg-lightButton hover:bg-lightButton/35 text-white px-4 py-2    rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
//             >Verify</button>
//           </div>
//         </div>


//         {/* PAN Card Section */}
//         <div className="bg-gray-100  space-y-4 p-4 rounded-lg">
//           <h2 className="text-lg font-semibold mb-2">Upload PAN Card</h2>
//           <input type="text" placeholder="PAN Card Number"
//             className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
//           />
//           <input type="text" placeholder="Full Name (as per PAN)"
//             className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
//           />
//           <div className="mt-2">
//             <label className="block text-sm font-medium text-gray-600">Upload PAN Card</label>
//             <input type="file" className="mt-1  border p-2 rounded-lg" onChange={handlePanFileChange} />
//           </div>
//           <div className="flex items-center mt-3">
//             <input type="checkbox" id="terms" className="mr-2" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
//             <label htmlFor="terms" className="text-sm">I accept the Terms & Conditions</label>
//           </div>
//           <div className="flex justify-end">
//             <button onClick={handlePanSubmit}
//               className={`bg-lightButton hover:bg-lightButton/35 text-white  ${width < breakpoints.sm ? "w-[100%] " : "w-[20%]"}  py-2 rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
//             >Submit</button>

//           </div>

//         </div>











//       </div>



//     </div>
//   );
// }

// const SettingItem2 = ({ icon, text }) => (
//   <button className="bg-white p-3 border-b-2 border-l-2 border-lightButton flex items-center gap-3 w-[100%]">
//     {icon} {text}
//   </button>
// );


// const SettingItem = ({ icon, text }) => (
//   <button className="bg-lightButton text-lightText p-3 rounded-lg flex items-center justify-center gap-2">
//     {icon} {text}
//   </button>
// );

// export default Profile;






// new code
import React, { useEffect, useState } from "react";
import { FaBox, FaHeart, FaQuestionCircle, FaHeadset, FaUser, FaMapMarkerAlt, FaLanguage, FaBell, FaShieldAlt, FaStar, FaSignOutAlt } from "react-icons/fa";
import { BsFillPencilFill } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import useWidth from "../../Hooks/useWidth";
import { logOut, setClientUser } from "../../store/reducer/auth/authCustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useDarkmode from "../../Hooks/useDarkMode";
import profileImg from "../../assets/users/user1.jpg";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import Footer from "../../components/footer/Footer";
import { FiEdit } from "react-icons/fi";


function Profile() {
  const dispatch = useDispatch()
  const { width, breakpoints } = useWidth();
  const [isDark] = useDarkmode();
  const { clientUser: customerData, isAuth: isLogedIn } = useSelector((state) => state?.authCustomerSlice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBusinessSubmitting, setIsBusinessSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: ""
  });
  const [profileDataError, setProfileDataError] = useState({
    firstName: "",
    lastName: ""
  });

  console.log("customerData", customerData);
  

  // Business Account State
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [businessData, setBusinessData] = useState({
    businessName: "",
    tanNumber: "",
    licenseNumber: "",
    gstin: "",
    businessAddress: ""
  });
  const [businessDataError, setBusinessDataError] = useState({
    businessName: "",
    tanNumber: "",
    licenseNumber: "",
    gstin: "",
    businessAddress: ""
  });

  useEffect(() => {
    if (customerData) {
      setProfileData({
        firstName: customerData?.firstName,
        lastName: customerData?.lastName
      });
      setIsBusinessAccount(customerData?.isBusinessAccount || false);
      setBusinessData({
        businessName: customerData?.businessName || "",
        tanNumber: customerData?.tanNumber || "",
        licenseNumber: customerData?.licenseNumber || "",
        gstin: customerData?.gstin || "",
        businessAddress: customerData?.businessAddress || ""
      });
    }
  }, [customerData]);

  const [panFile, setPanFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [iconImgErr, setIconImgErr] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handlePanFileChange = (e) => {
    setPanFile(e.target.files[0]);
  };

  const handlePanSubmit = () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms & conditions.");
      return;
    }
    toast.success("PAN details submitted successfully!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIconImgErr("");
    let errorCount = 0;
    if (file) {
      const fileSize = file.size / 1024; // Size in KB
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        setIconImgErr("Only image files are allowed");
        errorCount++;
      }
      if (fileSize > 1024) {
        setIconImgErr("File size must be less than 1MB");
        errorCount++;
      }
      if (errorCount === 0) {
        const imageAsBase64 = URL.createObjectURL(file);
        setSelectedFile(file);
        setImgPreview(imageAsBase64);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let dataObject = { ...profileData };
    if (name === "firstName") {
      if (!value) {
        setProfileDataError((prev) => ({
          ...prev,
          firstName: "First Name is required!"
        }));
      } else if (value.length < 3) {
        setProfileDataError((prev) => ({
          ...prev,
          firstName: "At least 3 characters required!"
        }));
      } else {
        setProfileDataError((prev) => ({
          ...prev,
          firstName: ""
        }));
      }
      dataObject.firstName = value;
    } else if (name === "lastName") {
      if (!value) {
        setProfileDataError((prev) => ({
          ...prev,
          lastName: "Last Name is required!"
        }));
      } else if (value.length < 3) {
        setProfileDataError((prev) => ({
          ...prev,
          lastName: "At least 3 characters required!"
        }));
      } else {
        setProfileDataError((prev) => ({
          ...prev,
          lastName: ""
        }));
      }
      dataObject.lastName = value;
    }
    setProfileData(dataObject);
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    let dataObject = { ...businessData };
    let errorObject = { ...businessDataError };

    if (name === "businessName") {
      if (!value) {
        errorObject.businessName = "Business Name is required!";
      } else if (value.length < 3) {
        errorObject.businessName = "At least 3 characters required!";
      } else {
        errorObject.businessName = "";
      }
      dataObject.businessName = value;
    } else if (name === "tanNumber") {
      if (!value) {
        errorObject.tanNumber = "TAN Number is required!";
      } else if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value)) {
        errorObject.tanNumber = "Invalid TAN Number format!";
      } else {
        errorObject.tanNumber = "";
      }
      dataObject.tanNumber = value;
    } else if (name === "licenseNumber") {
      if (!value) {
        errorObject.licenseNumber = "License Number is required!";
      } else {
        errorObject.licenseNumber = "";
      }
      dataObject.licenseNumber = value;
    } else if (name === "gstin") {
      if (!value) {
        errorObject.gstin = "GSTIN is required!";
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
        errorObject.gstin = "Invalid GSTIN format!";
      } else {
        errorObject.gstin = "";
      }
      dataObject.gstin = value;
    } else if (name === "businessAddress") {
      if (!value) {
        errorObject.businessAddress = "Business Address is required!";
      } else {
        errorObject.businessAddress = "";
      }
      dataObject.businessAddress = value;
    }

    setBusinessData(dataObject);
    setBusinessDataError(errorObject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formAppend = new FormData();
      if (selectedFile) {
        formAppend.append("profileImage", selectedFile);
      }
      formAppend.append("clientId", import.meta.env.VITE_DATABASE_ID);
      formAppend.append("firstName", profileData?.firstName);
      formAppend.append("lastName", profileData?.lastName);
      const response = await customerService.updateProfile(formAppend);

      console.log("resposne profile", response.data?.data?.profileImage);
      

      dispatch(setClientUser({
        ...customerData,
        profileImage : response.data?.data?.profileImage,
        firstName : response?.data?.data?.firstName,
        lastName : response?.data?.data?.lastName
      }));
      

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error while editing the profile", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    // Validate all business fields
    let errorObject = { ...businessDataError };
    let isValid = true;

    if (!businessData.businessName) {
      errorObject.businessName = "Business Name is required!";
      isValid = false;
    } else if (businessData.businessName.length < 3) {
      errorObject.businessName = "At least 3 characters required!";
      isValid = false;
    } else {
      errorObject.businessName = "";
    }

    if (!businessData.tanNumber) {
      errorObject.tanNumber = "TAN Number is required!";
      isValid = false;
    } else if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(businessData.tanNumber)) {
      errorObject.tanNumber = "Invalid TAN Number format!";
      isValid = false;
    } else {
      errorObject.tanNumber = "";
    }

    if (!businessData.licenseNumber) {
      errorObject.licenseNumber = "License Number is required!";
      isValid = false;
    } else {
      errorObject.licenseNumber = "";
    }

    if (!businessData.gstin) {
      errorObject.gstin = "GSTIN is required!";
      isValid = false;
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(businessData.gstin)) {
      errorObject.gstin = "Invalid GSTIN format!";
      isValid = false;
    } else {
      errorObject.gstin = "";
    }

    if (!businessData.businessAddress) {
      errorObject.businessAddress = "Business Address is required!";
      isValid = false;
    } else {
      errorObject.businessAddress = "";
    }

    setBusinessDataError(errorObject);

    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    // Proceed with API call if all validations pass
    setIsBusinessSubmitting(true);
    try {
      const dataObject = {
        clientId: import.meta.env.VITE_DATABASE_ID,
        businessName: businessData.businessName,
        tanNumber: businessData.tanNumber,
        licenseNumber: businessData.licenseNumber,
        gstin: businessData.gstin,
        businessAddress: businessData.businessAddress
      };
      const response = await customerService.updateBusinessData(dataObject);
      console.log("response", response);
      toast.success(response.data.message || "Business data updated successfully!");
    } catch (error) {
      console.error("Error while updating business data", error);
      toast.error("Failed to update business data");
    } finally {
      setIsBusinessSubmitting(false);
    }
  };

  const getProfile = async () => {
    try {
      const response = await customerService.getProfile(customerData?._id);
      const data = response?.data?.data;
      setProfileData({
        firstName: data?.firstName,
        lastName: data?.lastName
      });
      setImgPreview(`${data?.profileImage}`);
    } catch (error) {
      console.error("Error while getting the profile", error);
    }
  };

  const getBusinessData = async () => {
    try {
      const response = await customerService.getBusinessData(customerData?._id);
      const data = response?.data?.data;
      setIsBusinessAccount(data?.isBusinessAccount || false);
      setBusinessData({
        businessName: data?.businessName || "",
        tanNumber: data?.tanNumber || "",
        licenseNumber: data?.licenseNumber || "",
        gstin: data?.gstin || "",
        businessAddress: data?.businessAddress || ""
      });
    } catch (error) {
      console.error("Error while getting business data", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getProfile(), getBusinessData()]);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SkeletonTheme
        baseColor={isDark ? "#2d3748" : "#e2e8f0"}
        highlightColor={isDark ? "#4a5568" : "#edf2f7"}
      >
        <div className={`w-[100%] mt-4 mb-3 flex justify-center ${width < breakpoints.sm ? "px-2" : "px-0"}`}>
          <div className={` ${width < breakpoints.sm ? "px-2 w-[100%]" : "px-0 w-[60%]"} px-3 py-3 rounded-md`}>
            {/* Profile Section Skeleton */}
            <div className={`  p-4 rounded-lg mb-6 ${isDark ? "bg-carBgDark" : "bg-gray-100"}`}>
              <div className="flex flex-col items-center mb-6">
                <Skeleton circle={true} height={96} width={96} />
                <Skeleton width={120} height={20} className="mt-2" />
                <div className="w-[100%] space-y-4 mt-4">
                  <div>
                    <Skeleton width={100} height={16} className="mb-1" />
                    <Skeleton height={40} />
                  </div>
                  <div>
                    <Skeleton width={100} height={16} className="mb-1" />
                    <Skeleton height={40} />
                  </div>
                </div>
                <div className="mt-4 w-[100%] flex justify-end">
                  <Skeleton width={width < breakpoints.sm ? "100%" : 100} height={40} />
                </div>
              </div>
            </div>

            {/* Contact Section Skeleton */}
            <div className={` ${isDark ? "bg-carBgDark" : "bg-gray-100"} p-4 rounded-lg mb-6`}>
              <Skeleton width={150} height={20} className="mb-2" />
              <div className="flex items-center gap-3 mt-2">
                <div className="w-[100%]">
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton height={40} />
                </div>
                <Skeleton width={80} height={40} className="mt-6" />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-[100%]">
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton height={40} />
                </div>
                <Skeleton width={80} height={40} className="mt-6" />
              </div>
            </div>

            {/* PAN Card Section Skeleton */}
            <div className={`${isDark ? "bg-carBgDark" : "bg-gray-100"} space-y-4 p-4 rounded-lg mb-6`}>
              <Skeleton width={150} height={20} className="mb-2" />
              <div>
                <Skeleton width={100} height={16} className="mb-1" />
                <Skeleton height={40} />
              </div>
              <div>
                <Skeleton width={100} height={16} className="mb-1" />
                <Skeleton height={40} />
              </div>
              <div className="mt-2">
                <Skeleton width={100} height={16} className="mb-1" />
                <Skeleton height={40} />
              </div>
              <div className="flex items-center mt-3">
                <Skeleton width={20} height={20} className="mr-2" />
                <Skeleton width={150} height={16} />
              </div>
              <div className="flex justify-end">
                <Skeleton width={width < breakpoints.sm ? "100%" : 100} height={40} />
              </div>
            </div>

            {/* Business Account Section Skeleton */}
            <div className={`${isDark ? "bg-carBgDark" : "bg-gray-100"} space-y-4 p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <Skeleton width={150} height={20} />
                <div className="flex items-center">
                  <Skeleton width={100} height={16} className="mr-2" />
                  <Skeleton width={40} height={20} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton height={40} />
                </div>
                <div>
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton height={40} />
                </div>
                <div>
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton height={40} />
                </div>
                <div>
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton height={40} />
                </div>
                <div>
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton height={80} />
                </div>
                <div className="flex justify-end">
                  <Skeleton width={width < breakpoints.sm ? "100%" : 100} height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <>

     <div className="container mx-auto px-2 py-6 ">
      <div className={` ${width < breakpoints.sm ? "px-2 w-[100%]" : "px-0 w-[100%]"} ${isDark ? "bg-carBgDark" : "bg-white"} px-3 py-3 rounded-md`}>
        {/* Profile Section */}
        <div className={`${isDark ? "bg-cardBgDark2" : "bg-gray-100"} p-4 rounded-lg mb-6`}>
          <div className="flex flex-col items-center mb-6">
            <div className="flex flex-col justify-center items-center flex-wrap relative">
              <label htmlFor="profileImage" className="cursor-pointer relative flex flex-col items-center">
                <img
                  src={imgPreview ? imgPreview : profileImg}
                  className="w-24 h-24 object-cover border-[3px] border-[#ffffff] shadow-md rounded-md"
                  alt="Profile"
                />
                <p className="dark:text-white text-center mt-2 text-sm font-medium text-gray-600">
                  {!imgPreview ? "Upload Photo" : selectedFile?.name}
                </p>

                <span className="absolute right-[-14px] top-[-4px]"><FiEdit className="text-[#13ceb7]" /></span>
              </label>
              <input
                id="profileImage"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <span style={{ color: "red", fontSize: "0.7em" }}>
                {iconImgErr && <p className="text-red-600 text-xs pt-2">{iconImgErr}</p>}
              </span>
            </div>
            <div className="w-[100%] space-y-4 mt-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={profileData?.firstName}
                  onChange={handleChange}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                />
                <span className="text-red-900">{profileDataError?.firstName}</span>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={profileData?.lastName}
                  onChange={handleChange}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                />
                <span className="text-red-900">{profileDataError?.lastName}</span>
              </div>
            </div>
            <div className="mt-4 w-[100%] flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-lightButton hover:bg-lightButton/35 text-white ${width < breakpoints.sm ? "w-[100%]" : "w-[20%]"} py-2 rounded transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
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
        </div>

        {/* Contact Section */}
        <div className={`${isDark ? "bg-cardBgDark2" : "bg-gray-100"} p-4 rounded-lg mb-6`}>
          <h2 className="text-lg font-semibold mb-2">Contact Details</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-[100%]">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="text"
                placeholder="Phone Number"
                className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
              />
            </div>
            <button
              className={`bg-lightButton hover:bg-lightButton/35 text-white px-4 py-2 rounded transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-6`}
            >
              Update
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-[100%]">
              <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                placeholder="Email Address"
                className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
              />
            </div>
            <button
              className={`bg-lightButton hover:bg-lightButton/35 text-white px-4 py-2 rounded transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-6`}
            >
              Verify
            </button>
          </div>
        </div>

        {/* PAN Card Section */}
        <div className={`${isDark ? "bg-cardBgDark2" : "bg-gray-100"} flex flex-col gap-2 p-4 rounded-lg mb-6`}>
          <h2 className="text-lg font-semibold mb-2">Upload PAN Card</h2>
          <div>
            <label htmlFor="panNumber" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              PAN Card Number
            </label>
            <input
              id="panNumber"
              type="text"
              placeholder="PAN Card Number"
              className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
            />
          </div>
          <div>
            <label htmlFor="panFullName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Full Name (as per PAN)
            </label>
            <input
              id="panFullName"
              type="text"
              placeholder="Full Name (as per PAN)"
              className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
            />
          </div>
          <div className="mt-2">
            <label htmlFor="panFile" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Upload PAN Card
            </label>
            <input
              id="panFile"
              type="file"
              className="mt-1 border p-2 rounded-lg w-[100%]"
              onChange={handlePanFileChange}
            />
          </div>
          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <label htmlFor="terms" className="text-sm">I accept the Terms & Conditions</label>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handlePanSubmit}
              className={`bg-lightButton hover:bg-lightButton/35 text-white ${width < breakpoints.sm ? "w-[100%]" : "w-[20%]"} py-2 rounded transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Business Account Section */}
        <div className={`${isDark ? "bg-cardBgDark2" : "bg-gray-100"} p-4 rounded-lg mb-6`}>
          <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-2 mb-2">
            <h2 className="md:text-lg text-bas  font-semibold">Business Account</h2>
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 md:text-sm text-xs">Enable Business Account</span>
              <input
                type="checkbox"
                checked={isBusinessAccount}
                onChange={() => setIsBusinessAccount(!isBusinessAccount)}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 bg-gray-300 rounded-full shadow-inner ${isBusinessAccount ? "bg-lightButton" : ""}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isBusinessAccount ? "translate-x-5" : "translate-x-0"}`}
                ></div>
              </div>
            </label>
          </div>
          {isBusinessAccount && (
            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-600 mb-1">
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Business Name"
                  value={businessData.businessName}
                  onChange={handleBusinessChange}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                />
                <span className="text-red-900">{businessDataError.businessName}</span>
              </div>
              <div>
                <label htmlFor="tanNumber" className="block text-sm font-medium text-gray-600 mb-1">
                  TAN Number
                </label>
                <input
                  id="tanNumber"
                  name="tanNumber"
                  type="text"
                  placeholder="TAN Number"
                  value={businessData.tanNumber}
                  onChange={handleBusinessChange}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                />
                <span className="text-red-900">{businessDataError.tanNumber}</span>
              </div>
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-600 mb-1">
                  Business License Number
                </label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  placeholder="Business License Number"
                  value={businessData.licenseNumber}
                  onChange={handleBusinessChange}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                />
                <span className="text-red-900">{businessDataError.licenseNumber}</span>
              </div>
              <div>
                <label htmlFor="gstin" className="block text-sm font-medium text-gray-600 mb-1">
                  GSTIN
                </label>
                <input
                  id="gstin"
                  name="gstin"
                  type="text"
                  placeholder="GSTIN"
                  value={businessData.gstin}
                  onChange={handleBusinessChange}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                />
                <span className="text-red-900">{businessDataError.gstin}</span>
              </div>
              <div>
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-600 mb-1">
                  Business Address
                </label>
                <textarea
                  id="businessAddress"
                  name="businessAddress"
                  placeholder="Business Address"
                  value={businessData.businessAddress}
                  onChange={handleBusinessChange}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                  rows="4"
                />
                <span className="text-red-900">{businessDataError.businessAddress}</span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleBusinessSubmit}
                  disabled={isBusinessSubmitting}
                  className={`bg-lightButton hover:bg-lightButton/35 text-white ${width < breakpoints.sm ? "w-[100%]" : "w-[20%]"} py-2 rounded transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {isBusinessSubmitting ? (
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
          )}
        </div>
      </div>
    </div>

     <div className="w-[100%] flex flex-col items-center justify-center">
        <div className="w-[100%]  ">
          <Footer />
        </div>
      </div>
    </>
   
  );
}

export default Profile;