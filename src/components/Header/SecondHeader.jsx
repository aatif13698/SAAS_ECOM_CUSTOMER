import React, { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import useWidth from '../../Hooks/useWidth';
import useDarkmode from '../../Hooks/useDarkMode';
import customerService from '../../services/customerService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';


function SecondHeader() {
  const { width, breakpoints } = useWidth();
  const [isDark] = useDarkmode();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getCategoryAndSubcategory() {
    try {
      const response = await customerService.getCategortAndSubcategory();
      setMenu(response?.data);
    } catch (error) {
      console.log("error while getting the categoryandsubcategory", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategoryAndSubcategory();
  }, []);

  if (width <= breakpoints.sm) return null;

  return (
    <div className={`flex justify-center ${isDark ? " bg-dark/50 text-white " : "bg-light text-dark"} py-2`}>
      <ul className="flex  items-center gap-4 ">
        {loading ? (
          // Skeleton Loader
          Array(5).fill(0).map((_, index) => (
            <li key={index} className="relative group flex items-center">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={100} height={20} className="ml-2" />
            </li>
          ))
        ) : (
          menu && menu.length > 0 ? menu.map((item) => (
            <li key={item.id} className="relative group">
              {item.link ? (
                <div className='flex  items-center'>
                  <img className='w-10 h-10 object-cover' src={`${import.meta.env.VITE_API_URL}/icon/${item?.icon}`} alt="" />
                  {/* <a
                    href={`/list/product/${null}${item.link} `}
                    className="px-4 hover:text-blue-600 duration-200"
                  >
                   
                  </a> */}

                  <Link
                    to={`/list/product/${null}${item.link}`}
                    className="px-4 hover:text-blue-600 duration-200"
                  >
                    {item.name}
                  </Link>
                </div>
              ) : (
                <div className='flex items-center'>
                  <img className='w-10 h-10 object-cover' src={`${import.meta.env.VITE_API_URL}/icon/${item?.icon}`} alt="" />
                  <span className="flex items-center px-4 hover:text-blue-600 duration-200 cursor-pointer">
                    {item.name}
                    {item.submenu && (
                      <FaCaretDown className="ml-1 transition-all duration-200 group-hover:rotate-180" />
                    )}
                  </span>
                </div>
              )}
              {item.submenu && (
                <div className={`absolute left-0 top-[14px] mt-2 z-[999999] hidden group-hover:block w-48 rounded-md ${isDark ? "dark:bg-cardBgDark2 dark:text-white" : "bg-white text-black"}   p-2   shadow-md`}>
                  <ul>
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id} className="my-1 hover:bg-primary/20">
                        {/* <a
                          href={`/list/product${subItem.link}`}
                          className="block rounded-md p-2"
                        >
                          {subItem.name}
                        </a> */}
                        <Link
                          to={`/list/product${subItem.link}`}
                          className="block rounded-md p-2"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )) : ""
        )}
      </ul>
    </div>
  );
}

export default SecondHeader;



// import React, { useEffect, useState } from 'react';
// import { FaCaretDown } from 'react-icons/fa';
// import useWidth from '../../Hooks/useWidth';
// import useDarkmode from '../../Hooks/useDarkMode';
// import customerService from '../../services/customerService';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import { Link } from 'react-router-dom';

// function SecondHeader() {
//   const { width, breakpoints } = useWidth();
//   const [isDark] = useDarkmode();
//   const [menu, setMenu] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function getCategoryAndSubcategory() {
//     try {
//       const response = await customerService.getCategortAndSubcategory();
//       setMenu(response?.data);
//     } catch (error) {
//       console.error("Error fetching category and subcategory:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     getCategoryAndSubcategory();
//   }, []);

//   if (width <= breakpoints.sm) return null;

//   return (
//     <div className={`flex justify-center ${isDark ? "bg-dark/50 text-white" : "bg-light text-dark"} py-2`}>
//       <ul className="flex overflow-x-auto scrollbar-hide items-center gap-4">
//         {loading ? (
//           Array(5).fill(0).map((_, index) => (
//             <li key={index} className="flex items-center">
//               <Skeleton circle width={40} height={40} />
//               <Skeleton width={100} height={20} className="ml-2" />
//             </li>
//           ))
//         ) : menu && menu.length > 0 ? (
//           menu.map((item) => (
//             <li key={item.id} className="relative group">
//               <div className="flex items-center">
//                 <img
//                   className="w-10 h-10 object-cover"
//                   src={`${import.meta.env.VITE_API_URL}/icon/${item?.icon}`}
//                   alt={`${item.name} icon`}
//                 />
//                 {item.link ? (
//                   <Link
//                     to={`/list/product/${item.link}`}
//                     className="px-4 py-2 hover:text-blue-600 transition-colors duration-200"
//                   >
//                     {item.name}
//                   </Link>
//                 ) : (
//                   <span className="flex items-center px-4 py-2 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
//                     {item.name}
//                     {item.submenu && (
//                       <FaCaretDown className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
//                     )}
//                   </span>
//                 )}
//               </div>
//               {item.submenu && (
//                 <div className={`absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg z-50 ${
//                   isDark ? "bg-cardBgDark2 text-white" : "bg-white text-black"
//                 } hidden group-hover:block transition-opacity duration-200`}>
//                   <ul className="py-2">
//                     {item.submenu.map((subItem) => (
//                       <li
//                         key={subItem.id}
//                         className="my-1 hover:bg-primary/20 rounded-md transition-colors duration-200"
//                       >
//                         <Link
//                           to={`/list/product${subItem.link}`}
//                           className="block px-4 py-2 text-sm"
//                         >
//                           {subItem.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </li>
//           ))
//         ) : (
//           <li className="text-gray-500">No categories available</li>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default SecondHeader;
