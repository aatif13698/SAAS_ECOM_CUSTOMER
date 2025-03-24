import React, { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import SimpleBar from 'simplebar-react';
import NavMenu from './NavMenu';
import useWidth from '../../Hooks/useWidth';
import useDarkmode from '../../Hooks/useDarkMode';

export const Sidebar = () => {
  const { width, breakpoints } = useWidth();
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [isDark] = useDarkmode();

  console.log("width window", width);
  

  // Add smooth transition to the sidebar width
  const sidebarWidth = width < breakpoints.lg ? "w-[60px]" : "w-[238px]";

  // Handle scroll to show/hide the shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current?.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  return (
    <>
      {width >= breakpoints.sm && (
        <div
          className={`${sidebarWidth} ${isDark ? "bg-dark" : "bg-light"} h-full border-r-[0.5px] ${isDark ? "border-blue-gray-800" : "border-slate-400"}  transition-all duration-300 ease-in-out`}
        >
          {/* Logo */}
          <Logo />


          {/* Navigation items */}
          <SimpleBar
            className="px-4 w-[100%] h-[100%]  "
          >
            <NavMenu />
          </SimpleBar>
        </div>
      )}
    </>
  );
};
