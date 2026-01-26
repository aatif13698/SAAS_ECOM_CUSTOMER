


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





const CardType2 = ({
    title, products
}) => {


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


    function truncateText(text, limit = 16) {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    }




    return (
        <div className="bg-blue-100 py-6 px-4 mb-4 rounded-lg">
            <p className="text-center text-xl font-semibold mb-6 text-blue-800">{title}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.map((column, idx) => (
                    <div onClick={() => handleCardClick(column?.id?._id)} key={idx} className="bg-white p-3 cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col items-center">
                            <img
                                src={column?.id?.images[0]}
                                alt={truncateText(column?.id?.name)}
                                className="w-28 h-28 object-contain mb-3"
                            />
                            <p className="text-lg font-bold">{truncateText(column?.id?.name)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default CardType2