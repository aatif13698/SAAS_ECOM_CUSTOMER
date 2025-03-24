import React from 'react';

// Sample data for each column


const ProductList = ({columnsData}) => {
  
  return (
    <div className=" mx-auto bg-cardBg3 py-4 px-2 mb-4 ">
      {/* Outer grid: 1 col on small, 2 on medium, 4 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columnsData.map((column, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">{column.heading}</h2>
            {/* Inner grid: always 2 columns for product cards */}
            <div className="grid grid-cols-2 gap-4">
              {column.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded border-[1px] flex flex-col items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-contain mb-2"
                  />
                  <h3 className="text-md font-medium">{product.name}</h3>
                  <p className="text-sm font-bold text-green-600">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
