import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsFacebook } from "react-icons/bs";
import { IoLogoLinkedin } from "react-icons/io5";
import { SiTelegram } from "react-icons/si";

// import footerLogo from "../../assets/website/logo.png";
import images from "../../constant/images";
import useDarkmode from "../../Hooks/useDarkMode";
import { MdPrivacyTip } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { GoCodeOfConduct } from "react-icons/go";
import { Link } from "react-router-dom";
import { BsInfoCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";



const FooterLinks = [
  {
    title: "Privacy Policy",
    icon: <MdPrivacyTip />,
    link: "/privacy",
  },
  {
    title: "Refund Policy",
    icon: <RiRefund2Fill />,
    link: "/refund",
  },
  {
    title: "Terms & Condition",
    icon: <GoCodeOfConduct />,
    link: "/terms",
  },
];


const FooterLinks2 = [
  {
    title: "About us",
    icon: <BsInfoCircleFill />,
    link: "/about-us",
  },
];
const Footer = () => {
  const { config } = useSelector((state) => state.companyConfigSlice);

  const [isDark] = useDarkmode();

  return (
    <div className={`${isDark ? " bg-dark " : "bg-dark text-lightText"}`}>
      <section className="">
        <div className=" grid md:grid-cols-3 py-5">
          {/* company Details */}
          <div className=" py-8 px-4 ">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
              <img src={config?.shortLogo ? config?.shortLogo : images.tree} alt="Logo" className="max-w-[50px]" />
              {config && config?.name}
            </h1>
            <p className="">
              {config && config?.description}
            </p>
            <br />
            <div className="flex items-center gap-3">
              <FaLocationArrow />
              <p>{config && config?.fullAddress}</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <FaMobileAlt />
              <p>+91 {config && config?.phone}</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <MdOutlineMailOutline />
              <p>{config && config?.email}</p>
            </div>
            {/* Social Handle */}
            <div className="flex items-center gap-3 mt-6">
              {
                config?.showFacebook ?
                  <a href={`${config?.facebookLink}`}>
                    <BsFacebook className="text-3xl" />
                  </a>
                  : ""
              }

              {
                config?.showInsta ?
                  <a href={`${config?.instaLink}`}>
                    <FaInstagram className="text-3xl" />
                  </a>
                  : ""
              }

              {
                config?.showLinkedin ?
                  <a href={`${config?.linkedinLink}`}>
                    <IoLogoLinkedin className="text-3xl" />
                  </a>
                  : ""
              }

              {
                config?.showTelegram ?
                  <a target="_blank"  href={`${config?.telegramLink}`}>
                    <SiTelegram className="text-3xl" />
                  </a>
                  : ""
              }
            
            </div>
          </div>
          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10 ">
            <div className="">
              <div className="py-8 px-4 ">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Policy
                </h1>
                <ul className={`flex flex-col gap-3`}>
                  {FooterLinks.map((link, index) => (
                    <Link to={link.link} key={index} className="cursor-pointer flex items-center hover:translate-x-1 duration-300 hover:text-blue-600 space-x-1 text-gray-500">
                      <span>{link.icon}</span>
                      <span>{link.title}</span>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
            <div className="">
              <div className="py-8 px-4 ">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks2.map((link, index) => (
                    <Link to={link.link} key={index} className="cursor-pointer flex items-center hover:translate-x-1 duration-300 hover:text-blue-600 space-x-1 text-gray-500">
                      <span>{link.icon}</span>
                      <span>{link.title}</span>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
            <div className="">
              <div className="py-8 px-4 ">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Location
                </h1>
                {/* <ul className="list-disc list-inside"> */}
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link, index) => (
                    <li key={index} className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary space-x-1 text-gray-500">
                      <span>&#11162;</span>
                      <span>{link.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center py-10 border-t-2 border-gray-300/50">
            @copyright 2025 All rights reserved || Made with ❤️ by Aatif
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
