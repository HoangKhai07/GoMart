import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../layouts/Dashboard.jsx";
import Profile from "../pages/Profile";
import MyOrder from "../pages/MyOrder";
import Address from "../pages/Address";
import UploadProduct from "../pages/UploadProduct";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import ProductDisplayPage from "../pages/ProductDisplayPage.jsx";
import CartMobile from "../pages/CartMobile.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import Cancel from "../pages/Cancel.jsx";
import OnlinePaymentMethod from "../pages/OnlinePaymentMethod.jsx";
import AdminOrders from "../pages/AdminOrders.jsx";
import ReviewProduct from "../pages/ReviewProduct.jsx";
import AdminChatPage from "../pages/AdminChatPage.jsx";
import FavoritePage from "../pages/FavoritePage.jsx";
import AdminStatistics from "../pages/AdminStatistic.jsx";
import OrderDetail from "../pages/OrderDetail.jsx";
import VoucherManagementPage from "../pages/VoucherManagementPage.jsx";
import Vouchers from "../pages/Vouchers.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [{
            path: "",
            element: <Home />
        },
        {
            path: "search",
            element: <SearchPage />
        },

        {
            path: "login",
            element: <Login />
        },

        {
            path: "register",
            element: <Register />
        },

        {
            path: "forgot-password",
            element: <ForgotPassword />
        },

        {
            path: "verification-otp",
            element: <OtpVerification />
        },

        {
            path: "reset-password",
            element: <ResetPassword />
        },

        {
            path: "dashboard",
            element: <Dashboard/>,
            children: [
                {
                    path: "profile",
                    element: <Profile />
                },

                {
                    path: "myorders",
                    element: <MyOrder/>
                },


                {
                    path: "address",
                    element: <Address/>
                },

                {
                    path: "favorite",
                    element: <FavoritePage/>
                },

                {
                    path: "vouchers",
                    element: <Vouchers/>
                },

                {
                    path: "product",
                    element: <AdminPermission><ProductAdmin/></AdminPermission>
                },

                {
                    path: "upload-product",
                    element: <AdminPermission><UploadProduct/></AdminPermission>
                },

                {
                    path: "category",
                    element:<AdminPermission><CategoryPage/></AdminPermission>
                },

                {
                    path: "sub-category",
                    element: <AdminPermission><SubCategoryPage/></AdminPermission>
                },

                {
                    path: "admin-orders",
                    element: <AdminOrders/>
                },

                {
                    path: "admin-chat",
                    element: <AdminPermission><AdminChatPage/></AdminPermission>
                },

                {
                    path: "admin-statistics",
                    element: <AdminPermission><AdminStatistics/></AdminPermission>
                },

                {
                    path: "voucher-management",
                    element: <AdminPermission><VoucherManagementPage/></AdminPermission>
                },

            ]
        },

        {
            path: "category/:categorySlug/:categoryId/subcategory/:subcategorySlug/:subcategoryId",
            element: <ProductListPage />
        },

        {
            path: "product/:productSlug/:productId",
            element: <ProductDisplayPage/>
        },

        {
            path: "cart",
            element: <CartMobile/>
        },

        {
            path: "checkout",
            element: <CheckoutPage/>
        },

        {
            path: "payment-success",
            element: <PaymentSuccess/>
        },

        {
            path: "cancel",
            element: <Cancel/>
        },

        {
            path: "online-payment",
            element: <OnlinePaymentMethod/>
        },

        {
            path: "review-product/:orderId/:productId",
            element: <ReviewProduct/>
        },

        {
            path: "order-detail/:orderId",
            element: <OrderDetail/>
        }

       

    
        ]
    }
])

export default router