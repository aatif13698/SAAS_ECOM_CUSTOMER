import React, { useState, Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { BsCart4 } from "react-icons/bs";
import { RiAccountCircleLine } from "react-icons/ri";
import Icons from "../SideBar/Icons";
import useDarkmode from "../../Hooks/useDarkMode";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import images from "../../constant/images";

const menuItems = [
    { id: 1, title: "Home", icon: <MdHomeFilled className="w-6 h-6" />, link: "home" },
    { id: 2, title: "Categories", icon: <BiCategoryAlt className="w-6 h-6" />, link: "categories" },
    { id: 3, title: "Cart", icon: <BsCart4 className="w-6 h-6" />, link: "cart" },
    { id: 4, title: "Account", icon: <RiAccountCircleLine className="w-6 h-6" />, link: "account" },
];

const BottomTab = ({ show, noFade }) => {
    const location = useLocation(); // Get current route

    console.log("location",location);
    

    const [isDark] = useDarkmode();
    const navigate = useNavigate();
    const { isAuth: isLogedIn } = useSelector((state) => state?.authCustomerSlice);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [activeLink, setActiveLink] = useState(1);

    const handleCloseLoadingModal = () => setShowLoadingModal(false);

    function handleNavigateToMenu(item) {
        if (item.link === "cart" || item.link === "account") {
            if (!isLogedIn) {
                setShowLoadingModal(true);
                return;
            }
        }
        setActiveLink(item.id);
        navigate(`/${item.link}`);
    }


    useEffect(() => {

        if(location.pathname == "/cart"){
            setActiveLink(3)
        }else if(location.pathname == "/categories"){
            setActiveLink(2)

        }else if(location.pathname == "/account") {
            setActiveLink(4)

        }else{
            setActiveLink(1)

        }

    },[location])

    return (
        <div className={`w-full h-16 fixed bottom-0 left-0 border-t-2 transition-transform duration-300 z-50 ${isDark ? "bg-dark border-blue-gray-800" : "bg-white border-slate-400"} ${show ? "translate-y-0" : "translate-y-full"}`}>
            <ul className="flex justify-around items-center">
                {menuItems.map((item) => (
                    <li key={item.id} className="nav-item px-4 flex justify-center rounded-md hover:bg-slate-200 transition duration-500">
                        <button onClick={() => handleNavigateToMenu(item)} className="flex items-center justify-center gap-3">
                            <span className="menu-icon flex flex-col justify-center items-center gap-1">
                                <Icons icon={item.icon} />
                                <span className={`${activeLink === item.id ? "text-blue-600 font-semibold" : "text-gray-500"} mb-2 text-sm`}>{item.title}</span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Login Prompt Modal */}
            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
                    <Transition.Child as={Fragment} enter="duration-300 ease-out" enterFrom="opacity-0" enterTo="opacity-100" leave="duration-200 ease-in" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto flex justify-center items-center">
                        <Transition.Child as={Fragment} enter="duration-300 ease-out" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="duration-200 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-[20rem] bg-white dark:bg-darkSecondary rounded-md shadow-xl p-6 text-center">
                                <div className="flex justify-center">
                                    <img src={images?.emptycart} alt="Cart" className="w-24 h-24 object-cover" />
                                </div>
                                <h2 className="text-lg font-semibold mt-4">You are not logged in</h2>
                                <p className="text-gray-600 text-sm mt-1">Please login to proceed</p>
                                <div className="mt-4 flex justify-center gap-4">
                                    <button onClick={() => { setShowLoadingModal(false); navigate("/login"); }} className="py-2 w-[50%] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500">Log In</button>
                                    <button onClick={() => { setShowLoadingModal(false); navigate("/signup"); }} className="py-2 w-[50%] bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400">Sign Up</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default BottomTab;
