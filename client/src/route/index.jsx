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
// import Product from "../pages/Product";
import UploadProduct from "../pages/UploadProduct";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";


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
            element: <Dashboard />,
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
                }

            ]
        },

        {
            path: "category/:categorySlug/:categoryId/subcategory/:subcategorySlug/:subcategoryId",
            element: <ProductListPage />
        }
        ]
    }
])

export default router