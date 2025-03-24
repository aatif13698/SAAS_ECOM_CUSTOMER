import React from 'react'
import MultiCarousel from '../MultiCarousel/MultiCarousel'

import products from "../../constant/data"

function OneDivissionProducts() {
    return (

        <div className='bg-white w-[100%] overflow-hidden my-3 py-4  '>
            <span className='font-bold text-lg px-4'>Best of Electronics</span>
            <MultiCarousel productData={products.electronicProductData} />
        </div>
    )
}

export default OneDivissionProducts