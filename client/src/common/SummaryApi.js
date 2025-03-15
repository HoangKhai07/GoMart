export const baseURL = "http://localhost:8080"

const SummaryApi = {
    register : {
        url :  "/api/user/register",
        method: 'post'
    },

    login: {
        url: "/api/user/login",
        method: 'post'
    },

    forgot_password: {
        url: "/api/user/forgot-password",
        method: 'put'
    },

    forgot_password_otp_verification: {
        url: "/api/user/verify-forgot-password-otp",
        method: 'put'
    },

    reset_password: {
        url: "/api/user/reset-password",
        method: 'put'
    },

    refresh_token: {
        url: "/api/user/refresh-token",
        method: 'post' 
    },
    
    user_details: {
        url: "/api/user/user-details",
        method: 'get'
    },

    logout: {
        url: "/api/user/logout",
        method: 'get'
    },

    upload_avatar: {
        url: "/api/user/upload-avatar",
        method: 'put'
    },

    update_user_details: {
        url: "/api/user/update-user",
        method: 'put'
    },

    add_category: {
        url: '/api/category/add-category',
        method: 'post'
    },

    upload_image: {
        url: "api/file/upload",
        method: 'post'
    },

    get_category: {
        url: "/api/category/get",
        method: 'get'
    },

    update_category: {
        url: "/api/category/update",
        method: 'put'
    },

    delete_category: {
        url: "/api/category/delete",
        method: 'delete'
    },

    create_subcategory: {
        url: "/api/subcategory/create",
        method: 'post'
    },

    get_subcategory: {
        url: "/api/subcategory/get",
        method: 'post'
    },

    update_subcategory: {
        url: "/api/subcategory/update",
        method: 'put'
    },

    delete_subcategory: {
        url: "/api/subcategory/delete",
        method: 'delete'
    },

    create_product: {
        url: "/api/product/create_product",
        method: "post"
    },

    get_product: {
        url: "/api/product/get_product",
        method: "get"
    },

    get_product_by_category: {
        url: "/api/product/get_product_by_category",
        method: "post"
    },

    get_product_by_category_and_subcategory: {
        url: "/api/product/get_product_by_category_and_subcategory",
        method: "post"
    },

    get_product_details: {
        url: "/api/product/get_product_details",
        method: "post"
    },

    // get_related_product: {
    //     url: "/api/product/get_related_product",
    //     method: "post"
    // }


}

export default SummaryApi