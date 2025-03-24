// import React, { useEffect, Suspense, Fragment, useRef } from "react";
// import useWidth from "../Hooks/useWidth";
// import useSidebar from "../Hooks/useSidebar";
// import useMenuHidden from "../Hooks/useMenuHidden";
// import { Sidebar } from "../components/SideBar/Sidebar";
// import BottomTab from "../components/BottomTab/BottomTab";
// import Header from "../components/Header/Header";
// import MainContent from "../components/MainContent/MainContent";

// const Layout = () => {

//   const { width, breakpoints } = useWidth();

//   return (
//     <>

//       <div style={{ width: "100%", height:"100%", position:"relative", overflowY: "auto",  overflowX:"hidden" }} className="">

//         {/* sidebar */}
//         {/* <Sidebar /> */}


//         {/* middlebar */}
//         <div className={` flex  flex-col      `}>

//           <div className={`   `}>
//             <Header />
//             {/* main content */}
//             <MainContent />
//           </div>
//           {/* mottom tab */}
//           {
//             width < breakpoints.sm ? <BottomTab /> : ""
//           }

//         </div>
//       </div>
//     </>
//   );
// };

// export default Layout;



import React, { useEffect, useRef, useState } from "react";
import useWidth from "../Hooks/useWidth";
import Header from "../components/Header/Header";
import MainContent from "../components/MainContent/MainContent";
import BottomTab from "../components/BottomTab/BottomTab";

const Layout = () => {
  const { width, breakpoints } = useWidth();
  const containerRef = useRef(null);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    const currentScrollY = containerRef.current.scrollTop;
    if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      setShowBottomTab(true);
    } else {
      // Scrolling down
      setShowBottomTab(false);
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Main content */}
      <div className="flex flex-col">
        <div>
          <Header />
          <MainContent />
        </div>
        {/* Bottom tab visible only on small screens */}
        {width < breakpoints.sm && (
          <BottomTab show={showBottomTab} />
        )}
      </div>
    </div>
  );
};

export default Layout;

