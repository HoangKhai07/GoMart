import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminPermission from "../layouts/AdminPermission.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import Address from "../pages/Address";
import AdminChatPage from "../pages/AdminChatPage.jsx";
import AdminOrders from "../pages/AdminOrders.jsx";
import AdminStatistics from "../pages/AdminStatistic.jsx";
import Cancel from "../pages/Cancel.jsx";
import CartMobile from "../pages/CartMobile.jsx";
import CategoryPage from "../pages/CategoryPage";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import FavoritePage from "../pages/FavoritePage.jsx";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyOrder from "../pages/MyOrder";
import OnlinePaymentMethod from "../pages/OnlinePaymentMethod.jsx";
import OrderDetail from "../pages/OrderDetail.jsx";
import OtpVerification from "../pages/OtpVerification";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import ProductAdmin from "../pages/ProductAdmin";
import ProductDisplayPage from "../pages/ProductDisplayPage.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import ReviewProduct from "../pages/ReviewProduct.jsx";
import SearchPage from "../pages/SearchPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import UserManagementPage from "../pages/UserManagementPage.jsx";
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
                    path: "user-management",
                    element: <AdminPermission><UserManagementPage/></AdminPermission>
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