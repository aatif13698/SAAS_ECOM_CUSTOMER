import React from 'react'
import CarouselWithoutArrow from '../carousel/CarouselWithoutArrow'
import products from "../../constant/data"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function Testt() {
    return (
        <div>
            <CarouselWithoutArrow data={products.laptopData} title={"Offers On Laptops"} />
        </div>
    )
}

export default Testt