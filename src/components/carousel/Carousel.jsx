import React from 'react'
import { CCarousel, CCarouselCaption, CCarouselItem, CImage } from '@coreui/react'
import images from '../../constant/images'

export const CarouselWithCaptionsExample = () => {
  return (
    <CCarousel className='bg-red-100 w-[100%]  ' controls indicators>
      <CCarouselItem className='flex flex-col'>
        <CImage className=" " src={images.loginIlustration} alt="slide 1" />
        <CCarouselCaption className="d-none d-md-block">
          <h5>First slide label</h5>
          <p>Some representative placeholder content for the first slide.</p>
        </CCarouselCaption>
      </CCarouselItem>
      <CCarouselItem className='flex flex-col'>
        <CImage className="   bg-green-600" src={images.loginIlustration} alt="slide 2" />
        <CCarouselCaption className="d-none d-md-block">
          <h5>Second slide label</h5>
          <p>Some representative placeholder content for the first slide.</p>
        </CCarouselCaption>
      </CCarouselItem>
      <CCarouselItem className='flex flex-col'>
        <CImage className="  w-[50%] bg-green-600" src={images.loginIlustration} alt="slide 3" />
        <CCarouselCaption className="d-none d-md-block">
          <h5>Third slide label</h5>
          <p>Some representative placeholder content for the first slide.</p>
        </CCarouselCaption>
      </CCarouselItem>
    </CCarousel>
  )
}
