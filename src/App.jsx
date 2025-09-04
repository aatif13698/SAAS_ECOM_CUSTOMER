



import { Routes, Route, Navigate, } from "react-router-dom"
import { lazy, useEffect } from "react";


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
const Cart = lazy(() => import("../src/pages/cart/Cart"))
const Account = lazy(() => import("../src/pages/account/Account"))
const Profile = lazy(() => import("../src/pages/profile/Profile"))
const Address = lazy(() => import("../src/pages/address/Address"));
const Orders = lazy(() => import("../src/pages/orders/Orders"));
const TrackOrder = lazy(() => import("../src/pages/orders/TrackOrder"));
const ProductList = lazy(() => import("../src/pages/ProductList/ProductList"));
const CheckOut = lazy(() => import("../src/pages/checkout/CheckOut"));


// import ProducDe


// import Home from "./pages/home/Home";
import useDarkmode from "./Hooks/useDarkMode";
import PublicRoutes from "./pages/PublicRoute/PublicRoutes";
import customerService from "./services/customerService";


export default function App() {

  const [isDark] = useDarkmode();

  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }, []);


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
            <Route path="order" element={<Orders />} />
            <Route path="track-order/:orderId" element={<TrackOrder />} />
            <Route path="account" element={<Account />} />
            <Route path="profile" element={<Profile />} />
            <Route path="address" element={<Address />} />
            <Route path="checkout/:productMainStockId/:productStockId" element={<CheckOut />} />

          </Route>
        </Route>

        {/* new */}






      </Routes>


    </main>
  )
}