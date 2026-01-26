


import CryptoJS from "crypto-js";

import { useNavigate } from "react-router-dom";
import productService from "../../services/productService";

// Secret key for encryption (store this securely in .env in production)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    // URL-safe encoding
    return encodeURIComponent(encrypted);
};


const CardType1 = ({ title, products }) => {

    const navigate = useNavigate()


    const handleCardClick = async (productId) => {

        try {

            const response = await productService.getProductStock(productId);
            console.log("response dfdsf", response?.data?._id);
            const encryptedId = encryptId(response?.data?._id);
            navigate(`/product/${encryptedId}`);

        } catch (error) {
            console.log("error getting stock of product", error);

        }

    };


    function truncateText(text, limit = 12) {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    }




    return (
        <div className="bg-red-50 py-4 px-2 mb-4">
            <p className="text-left text-lg font-bold mb-4">{title}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {products.map((column, idx) => {
                    console.log("column", column);
                    return (
                        <div onClick={() => handleCardClick(column?.id?._id)} key={idx} className="bg-white p-4 cursor-pointer rounded shadow-md">
                            <div className="bg-white p-3 rounded border-[1px] flex flex-col items-center">
                                <img
                                    src={column?.id?.images[0]}
                                    alt={truncateText(column?.id?.name)}
                                    className="w-24 h-24 object-contain mb-2"
                                />
                                <p className="text-md font-medium">{truncateText(column?.id?.name)}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};


export default CardType1