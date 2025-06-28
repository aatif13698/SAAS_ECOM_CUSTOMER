import React, { useEffect, useState } from 'react';
import customerService from '../../services/customerService';
import useDarkmode from '../../Hooks/useDarkMode';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaCaretRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Category() {
  const [isDark] = useDarkmode();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  async function getCategoryAndSubcategory() {
    try {
      const response = await customerService.getCategortAndSubcategory();
      setMenu(response?.data || []);

      // Set first category with submenu as active by default
      const firstCategoryWithSub = response?.data?.find(cat => cat.submenu?.length > 0);
      setActiveCategory(firstCategoryWithSub?.id || null);
    } catch (error) {
      console.log("Error while getting the category and subcategory", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategoryAndSubcategory();
  }, []);

  return (
    <div className={`flex h-screen ${isDark ? 'bg-dark/50 text-white' : 'bg-light text-dark'}`}>
      {/* Left Sidebar - Categories */}
      <div className="w-[30%] border-r border-gray-300 p-2 overflow-y-auto">
        <ul className="space-y-2">
          {loading ? (
            Array(5).fill(0).map((_, index) => (
              <li key={index} className="flex flex-col  items-center gap-2 p-3">
                <Skeleton width={40} height={40} />
                <Skeleton width={100} height={20} />
              </li>
            ))
          ) : (
            menu?.length > 0 ? menu.map((item) => (
              <li
                key={item.id}
                className={`flex flex-col justify-center items-center gap-2 p-3 cursor-pointer rounded-md ${activeCategory === item.id ? 'bg-custom-gradient-2 text-white' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveCategory(item.id)}
              >
                <img className='w-10 h-10 object-cover' src={`${import.meta.env.VITE_API_URL}/icon/${item?.icon}`} alt="" />
                <span className='text-center'>{item.name}</span>
                {/* {item.submenu && <FaCaretRight className="ml-auto" />} */}
              </li>

            )) : <p className="text-center text-gray-500">No categories available</p>
          )}
        </ul>
      </div>

      {/* Right Content - Subcategories */}
      <div className="w-[70%] p-4 overflow-y-auto">
        {menu?.find(item => item.id === activeCategory)?.submenu?.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3">
            {menu.find(item => item.id === activeCategory).submenu.map(subItem => (
              <li key={subItem.id} className="p-3 border rounded-md hover:bg-gray-100">
                {/* <a href={`/list/product${subItem.link}`} className="block text-center">{subItem.name}</a> */}
                <Link
                  to={`/list/product${subItem.link}`}
                  className="block rounded-md p-2"
                >
                  {subItem.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No subcategories available</p>
        )}
      </div>
    </div>
  );
}

export default Category;