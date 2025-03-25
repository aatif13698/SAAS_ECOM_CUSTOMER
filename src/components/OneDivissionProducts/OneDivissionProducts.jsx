import React, { useEffect, useState } from 'react'
import MultiCarousel from '../MultiCarousel/MultiCarousel'

import products from "../../constant/data"
import productService from '../../services/productService'
import MultiCarousel2 from '../MultiCarousel/MultiCarousel2';

function OneDivissionProducts() {

    const [laptoplist1, setLaptopList1 ]  = useState([]);

    console.log("laptoplist1",laptoplist1);
    

    useEffect(() => {
        getLaptopList()
    },[])

    async function getLaptopList(params) {
        try {
            const response = await productService.getLaptopList1();
            console.log("laptop list 1", response);
            setLaptopList1([...response?.data])
        } catch (error) {
            console.log("error while fetching laptop list 1", error);
        }
    }


    return (

        <div className='bg-white w-[100%] overflow-hidden my-3 py-4  '>
            <span className='font-bold text-lg px-4'>Best of Electronics</span>
            <MultiCarousel2 productData={laptoplist1} />
        </div>
    )
}

export default OneDivissionProducts