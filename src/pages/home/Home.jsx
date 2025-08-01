import React, { useEffect, useState } from 'react';
import FollowSuggetion from './FollowSuggetion';
import TopStory from './TopStory';
import useWidth from '../../Hooks/useWidth';
import axios from 'axios';
import Footer from '../../components/footer/Footer';
import Testimonials from '../../components/testimonial/Testemonial';
import OneDivissionProducts from '../../components/OneDivissionProducts/OneDivissionProducts';
import CustomCarousel2 from '../../components/carousel/CustomCarousel2';
import products from "../../constant/data"
import MultiCarousel from '../../components/MultiCarousel/MultiCarousel';
import CarouselWithoutArrow from '../../components/carousel/CarouselWithoutArrow';
import ProductList from '../../components/ProductList/ProductList';
import { useSelector } from 'react-redux';


const Home = () => {
  const { width, breakpoints } = useWidth();
  const [postsArr, setPostArr] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const state = useSelector((state) => state);

  console.log("state",state);
  


  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=10&page=${page}`);

      if (response && response.data.length > 0) {
        setPostArr(prevPosts => [...prevPosts, ...response.data]);
        if (response.data.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error in fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleInfiniteScroll = () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    console.log("scrollTop:", scrollTop);
    console.log("scrollHeight:", scrollHeight);
    console.log("clientHeight:", clientHeight);

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      console.log("yeeeeee");
      setPage(prevPage => prevPage + 1);
    }
  };

  // useEffect(() => {
  //   const scrollContainer = document.querySelector('.scroll-container');
  //   scrollContainer.addEventListener("scroll", handleInfiniteScroll);

  //   return () => scrollContainer.removeEventListener("scroll", handleInfiniteScroll);
  // }, [hasMore, loading]);

  return (
    <div className=' w-[100%] flex md:px-8 sm:px-0  '
    >
      <div className={`${width > breakpoints.xl ? "w-[100%]" : "w-[100%]"}`}>

        <div>
          <CustomCarousel2 />
        </div>

        {/* Best of Electronics */}
        <div>
          <OneDivissionProducts />
        </div>

        {/* Mobiles */}
        <div>
          <CarouselWithoutArrow data={products.mobileData} title={"Offers On Mobile"} />
        </div>

        {/* Product list */}
        <div>
          <ProductList columnsData={products.columnsData} />
        </div>

        {/* Best of watches  */}
        <div className='bg-white w-[100%] overflow-hidden my-3 py-4  '>
          <span className='font-bold text-lg px-4'>Best of Watches</span>
          <MultiCarousel productData={products.watchProductData} />
        </div>

        {/* Best of laptops */}
        <div>
          <CarouselWithoutArrow data={products.laptopData} title={"Offers On Laptops"} />
        </div>

        {/* Product list */}
        <div>
          <ProductList columnsData={products.columnsData} />
        </div>

        <div>
          <Testimonials />
        </div>

        <div className='flex flex-col bg-red-300 items-center justify-center'>
          <div className={`${width < breakpoints.sm ? "w-[100%]" : "w-[100%]"}  flex flex-col justify-center gap-3 items-center`}>
            <Footer />
          </div>
        </div>



      </div>
      {/* <div className={`${width > breakpoints.xl ? "w-[40%]" : "w-[0%] hidden"}`}>
        <FollowSuggetion />
      </div> */}
    </div>
  );
}

export default Home;
