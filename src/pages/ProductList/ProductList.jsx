import React from 'react'
import { useParams } from 'react-router-dom';

function ProductList() {
    const { catId, subCatId } = useParams();
    console.log("catId", catId);
    console.log("subCatId", subCatId);

    return (
        <div>
            This is the product listing page
        </div>
    )
}

export default ProductList
