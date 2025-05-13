export const baseURL = import.meta.env.VITE_API_URL

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

    update_product: {
        url: "/api/product/update_product",
        method: "put"
    },

    delete_product: {
        url: "/api/product/delete_product",
        method: "delete"
    },

    search_product: {
        url: "/api/product/search_product",
        method: "post"
    },

    add_to_cart: {
        url: "/api/cart/create",
        method: "post" 
    },

    get_cart: {
        url: "/api/cart/get",
        method: "get"
    },

    update_qty_cart: {
        url: "/api/cart/update_qty",
        method: "put"
    },

    delete_cart: {
        url: "/api/cart/delete",
        method: "delete"
    },
    
    add_address: {
        url: "/api/address/create",
        method: "post"
    },
    
    get_address: {
        url: "/api/address/get",
        method: "get"

    },

    update_address: {
        url: "/api/address/update",
        method: "put"
    },

    delete_address: {
        url:"/api/address/delete",
        method: "delete"
    },

    cash_on_delivery_payment: {
        url: "/api/order/cash-on-delivery",
        method: "post"
    },

    checkout_with_stripe:{
        url: "api/order/checkout",
        method: "post"
    },

    get_order: {
        url: "/api/order/order-list",
        method: "get"
    },

    get_order_detail: {
        url: "/api/order/detail",
        method: "get"
    },

    delete_order: {
        url: '/api/order/delete',
        method: "delete"
    },

    create_review: {
        url: "/api/review/create",
        method: "post"
    },

    get_review: {
        url: "/api/review/get-review",
        method: "get"
    },

    send_message: {
        url: "/api/chat/send",
        method: "post"
    },
    
    get_chats: {
        url: "/api/chat/chats",
        method: "get"
    },
    
    get_messages: {
        url: "/api/chat/messages",
        method: "get"
    },
    
    mark_messages_read: {
        url: "/api/chat/read",
        method: "put"
    },
    
    get_admin_chat: {
        url: "/api/chat/admin-chat",
        method: "get"
    },
    
    get_all_admin_chats: {
        url: "/api/chat/admin/all-chats",
        method: "get"
    },

    add_to_favorite: {
        url: "/api/favorite/add",
        method: "post"
    },

    get_favorite: {
        url: "/api/favorite/get",
        method: "get"
    },

    remove_favorite: {
        url: "/api/favorite/remove",
        method: "delete"
    },

    get_statistics: {
        url: '/api/statistic/admin/statistics',
        method: 'get'
    },

    create_voucher: {
        url: '/api/voucher/create',
        method: 'post'
    },

    get_vouchers: {
        url: '/api/voucher/get',
        method: 'get'
    },
    
    apply_voucher: {
        url: "/api/voucher/apply",
        method: 'post'
    },

    delete_voucher: {
        url: '/api/voucher/delete',
        method: 'delete'
    },

    update_voucher: {
        url: '/api/voucher/update',
        method: 'put'
    }

}

export default SummaryApi