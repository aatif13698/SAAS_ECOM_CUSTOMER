



import { Routes, Route, Navigate, } from "react-router-dom"
import { lazy, useEffect, useState } from "react";
import { MdWarning, MdArrowBack, MdOpenInNew } from 'react-icons/md';
import { SiGoogle } from 'react-icons/si';
import AuthLayout from "./layout/AuthLayout";
import images from "./constant/images";


const Layout = lazy(() => import("./layout/Layout"));
const Login = lazy(() => import("../src/pages/login/Login"));
const SignUp = lazy(() => import("../src/pages/signup/SignUp"));
const ForgetPassword = lazy(() => import("../src/pages/ForgetPassword/ForgetPassword"));
const ResetPassword = lazy(() => import("../src/pages/ResetPassword/ResetPassword"))
const VerifyOtp = lazy(() => import("../src/pages/verifyOtp/VerifyOtp"))
const Home = lazy(() => import("../src/pages/home/Home"));
const ProductDetail = lazy(() => import("../src/components/ProductDetail/ProductDetail"));
const Testt = lazy(() => import("../src/components/Testt/Testt"));
const Category = lazy(() => import("../src/pages/category/Category"))
const Cart = lazy(() => import("../src/pages/cart/Cart"));
const WishList = lazy(() => import("../src/pages/wishList/WishList"));
const RatingAndReview = lazy(() => import("../src/pages/ratingAndReview/RatingAndReview"));
const ListRatingAndReview = lazy(() => import("../src/pages/ratingAndReview/ListRatingAndReview"));
const ListQuestionAnswer = lazy(() => import("../src/pages/questionAnswer/ListQuestionAnswer"));
const ListQuery = lazy(() => import("../src/pages/query/Query"))
const Account = lazy(() => import("../src/pages/account/Account"))
const Profile = lazy(() => import("../src/pages/profile/Profile"))
const Address = lazy(() => import("../src/pages/address/Address"));
const Orders = lazy(() => import("../src/pages/orders/Orders"));
const TrackOrder = lazy(() => import("../src/pages/orders/TrackOrder"));
const ProductList = lazy(() => import("../src/pages/ProductList/ProductList"));
const CheckOut = lazy(() => import("../src/pages/checkout/CheckOut"));
const CheckoutFromCart = lazy(() => import("../src/pages/checkout/CheckoutFromCart"));


const Privacy = lazy(() => import("../src/pages/Policy/Privacy"));
const Refund = lazy(() => import("../src/pages/Policy/Refund"));
const Terms = lazy(() => import("../src/pages/Policy/Terms"));

const NotFound = lazy(() => import("./pages/404NotFound/NotFound"));


// import ProducDe


// import Home from "./pages/home/Home";
import useDarkmode from "./Hooks/useDarkMode";
import PublicRoutes from "./pages/PublicRoute/PublicRoutes";
import customerService from "./services/customerService";
import AboutUs from "./pages/aboutUs/AboutUs";
import authSrvice from "./services/authSrvice";
import api from "./services/api";
import { Spinner } from "@material-tailwind/react";
import Loader1 from "./components/loader/Loader1";


export default function App() {

  const currentDomain = typeof window !== 'undefined' 
    ? window.location.hostname 
    : 'your-current-domain.com';

  const [isDark] = useDarkmode();

  const [isLoading, setIsLoading] = useState(true);

  const [isAuthorizeDomain, setIsAuthorizeDomain] = useState(true);

  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }

    checkDomain()
  }, []);

  async function checkDomain(params) {

    try {

      setIsLoading(true)

      const res = await api.checkDomain();

      console.log("res", res);

      // if (res?.data?.status == "ok") {

      //   const loadingScreen = document.getElementById('loading-screen');
      //   if (loadingScreen) {
      //     loadingScreen.style.display = 'none';
      //   }

      // } 
      setIsLoading(false)
    } catch (error) {
      setIsAuthorizeDomain(false)
      setIsLoading(false)
    }

  }


  if (isLoading) {

    return <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className=" mt-1 font-medium  text-sm flex  justify-center items-center flex-col py-5">
        {" "}
        {/* <img src={StageDrivingLogo} alt="" className="w-20 py-5" /> */}
        {/* <Spinner className="h-8 w-8"/> */}
        <Loader1 />
        <span>Checking Auth..</span>
      </span>
    </div>

  }

  if (!isAuthorizeDomain) {

    return <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center border border-amber-500/20">
          <MdWarning className="w-12 h-12 text-amber-500" />
        </div>

        {/* Title & Message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Domain Not Authorized
          </h1>
          <p className="text-zinc-400 text-[17px] leading-relaxed">
            This domain (<span className="font-mono bg-zinc-900 px-2 py-1 rounded text-amber-400 text-sm">
              {currentDomain}
            </span>) is not authorized for this Client ID.
          </p>
        </div>

        {/* Helpful Explanation Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 text-left">
          <p className="text-zinc-400 mb-5 text-[15px]">
            This error typically occurs when the current domain is not added to the allowed origins in your OAuth provider settings.
          </p>

          {/* <div className="space-y-5 text-sm">
            <div className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-500 flex-shrink-0">
                1
              </div>
              <div className="text-zinc-300">
                Go to your OAuth console (Google Cloud, Firebase, Auth0, etc.)
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-500 flex-shrink-0">
                2
              </div>
              <div className="text-zinc-300">
                Add <span className="font-mono text-emerald-400">https://{currentDomain}</span> to{" "}
                <strong>Authorized JavaScript origins</strong>
              </div>
            </div>
          </div> */}
        </div>
        {/* Footer */}
        <p className="text-xs text-zinc-500 pt-8">
          Need help? Contact your administrator or support team.
        </p>
      </div>
    </div>

  }


  return (
    <main className={`${isDark ? "bg-dark text-white" : "bg-light"}`} style={{ width: "100vw", height: "100vh", }}>

      <Routes>

        <Route path="/" element={<AuthLayout />}>

          <Route index element={<Navigate to="/home" />} />

          {/* <Route path="/" element={<Login />} /> */}

          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verifyOtp" element={<VerifyOtp />} />
          </Route>

          <Route path="/" element={<Layout />}>

            <Route path="home" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/list/product/:catId/:subCatId" element={<ProductList />} />
            <Route path="aaa" element={<Testt />} />
            <Route path="categories" element={<Category />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<WishList />} />
            <Route path="rating/:productMainStockId/:productStockId/:productId" element={<RatingAndReview />} />
            <Route path="list/rating" element={<ListRatingAndReview />} />
            <Route path="list/questionasnwer" element={<ListQuestionAnswer />} />
            <Route path="list/query" element={<ListQuery />} />
            <Route path="edit-review/:productMainStockId/:productStockId/:reviewId" element={<RatingAndReview />} />
            <Route path="order" element={<Orders />} />
            <Route path="track-order/:orderId" element={<TrackOrder />} />
            <Route path="account" element={<Account />} />
            <Route path="profile" element={<Profile />} />
            <Route path="address" element={<Address />} />
            <Route path="checkout/:productMainStockId/:productStockId" element={<CheckOut />} />
            <Route path="checkout/cart" element={<CheckoutFromCart />} />


            <Route path="privacy" element={<Privacy />} />
            <Route path="refund" element={<Refund />} />
            <Route path="terms" element={<Terms />} />
            <Route path="about-us" element={<AboutUs />} />


            <Route path="*" element={<NotFound />} />

          </Route>
        </Route>

        {/* new */}






      </Routes>


    </main>
  )
}