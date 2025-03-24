import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { MdHomeFilled } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { MdOutlineExplore } from "react-icons/md";
import { BsCameraReels } from "react-icons/bs";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { GoHeart } from "react-icons/go";
import { TbSquarePlus } from "react-icons/tb";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";








import Icons from './Icons';
import useWidth from '../../Hooks/useWidth';
import useDarkmode from '../../Hooks/useDarkMode';




const menuItems = [

    {
        title: "Home",
        icon: <MdHomeFilled className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "Search",
        icon: <FiSearch className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "Explore",
        icon: <MdOutlineExplore className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "Reels",
        icon: <BsCameraReels className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "Messages",
        icon: <BiMessageRoundedDetail className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "Notifications",
        icon: <GoHeart className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "Create",
        icon: <TbSquarePlus className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "Profile",
        icon: <GoHeart className='w-6 h-6' />,
        link: "/home",
    },
    {
        title: "More",
        icon: <RxHamburgerMenu className='w-6 h-6' />,
        link: "/home",
    },


];



const NavMenu = () => {

    const { width, breakpoints } = useWidth();

    const [isDark, setDarkMode] = useDarkmode()



    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const toggleSubmenu = (i) => {
        if (activeSubmenu === i) {
            setActiveSubmenu(null);
        } else {
            setActiveSubmenu(i);
        }
    };


    return (
        <>
            <ul className="pb-10 w-[100%] h-[100%] pt-2   ">
                {menuItems.map((item, i) => (
                    <li
                        key={i}
                        className={`nav-item flex my-2 ${width < breakpoints.lg || width <= breakpoints.sm ? "" : "px-2"}  w-[100%] rounded-md${isDark ? " hover:bg-mediumDark" : " hover:bg-gray-200"} transition duration-500`}
                    >
                        <NavLink className="menu-link flex items-center gap-3 py-2" to={item.link}>
                            <span className="menu-icon flex-grow-0">
                                <Icons icon={item?.icon} />
                            </span>
                            {
                                width < breakpoints.lg || width <= breakpoints.sm ? "" : <div className="">{item.title}</div>
                            }

                        </NavLink>
                    </li>
                ))}
                <li onClick={() => setDarkMode(!isDark)}
                    className={`nav-item flex my-2 ${width < breakpoints.lg || width <= breakpoints.sm ? "" : "px-2"}  w-[100%] rounded-md hover:bg-slate-200 transition duration-500`}
                >
                    <NavLink className="menu-link flex items-center gap-3 py-2"  >
                        <span className="menu-icon flex-grow-0">

                         {isDark ? <CiLight/> :  <MdDarkMode/> }  
                            
                        </span>
                        {
                            width < breakpoints.lg || width <= breakpoints.sm ? "" : <div className="">{isDark ? "Light" : "Dark"}</div>
                        }

                    </NavLink>
                </li>
            </ul>


        </>
    )
}

export default NavMenu