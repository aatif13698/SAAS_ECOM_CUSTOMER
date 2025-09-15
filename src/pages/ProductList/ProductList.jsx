import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useWidth from "../../Hooks/useWidth";
import CryptoJS from "crypto-js";
import useDarkmode from "../../Hooks/useDarkMode";
import Footer from "../../components/footer/Footer";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

const ProductList = () => {
  const { catId: categoryId, subCatId: subcategoryId } = useParams();
  const navigate = useNavigate();
  const { width, breakpoints } = useWidth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark] = useDarkmode();


  console.log("categoryId", categoryId);
  console.log("subcategoryId", subcategoryId);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (subcategoryId) {
          response = await customerService.getProductsBySubcategory(subcategoryId);
        } else {
          response = await customerService.getProductsByCategory(categoryId);
        }
        setProducts(response?.data?.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        toast.error("Failed to load products");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [categoryId, subcategoryId]);

  const handleViewProduct = (productId) => {
    const encryptedId = encryptId(productId);
    if (encryptedId) {
      navigate(`/product/${encryptedId}`);
    } else {
      toast.error("Failed to navigate to product details");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 dark:text-white">
          Loading Products...
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className={` ${isDark ? "bg-carBgDark" : "bg-white"} rounded-lg shadow-md p-4`}>
              <Skeleton height={200} />
              <Skeleton height={20} width="80%" className="mt-4" />
              <Skeleton height={16} width="60%" className="mt-2" />
              <Skeleton height={40} width="100%" className="mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Error</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (

    <>

      <div className="container min-h-[60vh] mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          {subcategoryId ? `Products in Subcategory` : `Products in Category`}
        </h2>
        {products.length === 0 ? (
          <div className="text-center min-h-[30vh] py-10 text-gray-500 dark:text-white">
            <p className="text-lg">No products found.</p>
            <p>Browse other categories to find what you're looking for!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                onClick={() => handleViewProduct(product._id)}

                key={product._id}
                className={`${isDark ? "bg-carBgDark" : "bg-white"} cursor-pointer rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200`}
              >
                <img
                  src={`${product.product?.images?.[0] || "placeholder.jpg"
                    }`}
                  alt={product.product?.name}
                  className="w-[100%] h-48 object-contain rounded-md border border-gray-300 mb-4"
                // onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                  {product.product?.name || "Unnamed Product"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-white/80">
                  Price: ₹{product.normalSaleStock[0]?.variant?.priceId?.price[0]?.unitPrice || "N/A"}
                </p>
                <button
                  onClick={() => handleViewProduct(product._id)}
                  // className="mt-4 w-[100%] px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                    className="bg-lightButton w-[100%] px-4 py-2 mt-4  text-white  hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 p-3 rounded-lg "

                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col  items-center justify-center">
        <div
          className={`${width < breakpoints.sm ? "w-[100%]" : "w-[100%]"
            }  flex flex-col justify-center gap-3 items-center`}
        >
          <Footer />
        </div>
      </div>
    </>

  );
};

export default ProductList;