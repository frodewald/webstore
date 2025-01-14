export const BACKEND_URL = process.env.VUE_APP_BACKEND_URL
const BASE_URL = `${BACKEND_URL}/api`

// user url
export const USER_API_ENDPOINTS = {
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
    register: `${BASE_URL}/register`,
    getUser: `${BASE_URL}/user/profile`,
    getAllUsers: `${BASE_URL}/users`,
    updateUser: `${BASE_URL}/user/update/profile`
}


// order url
export const ORDER_API_ENDPOINTS = {
    getOrder: `${BASE_URL}/orders/user`,
    updateOrder: `${BASE_URL}/orders/update/user`,
    deleteOrder: (id) => `${BASE_URL}/orders/delete/user/product/${id}`,
    deletAllOrder: `${BASE_URL}/orders/delete/user/all/product`
}

// product url
export const PRODUCT_API_ENDPOINTS = {
    getAllProduct: `${BASE_URL}/products/`,
    getProductById: (id) => `${BASE_URL}/products/${id}`,
    getProductsByCategoryId: (id) => `${BASE_URL}/products/category/${id}`,
    getProductsBySearch: (query) => `${BASE_URL}/products/get/search?search=${query}`,
    createProduct: `${BASE_URL}/products/create`,
    updateProduct: (id) => `${BASE_URL}/products/update/${id}`,
    deleteProduct: (id) => `${BASE_URL}/products/delete/${id}`,
    getFeaturedProducts: `${BASE_URL}/products/get/featured`
}

export const CATEGORY_API_ENDPOINTS = {
    getAllCategory: `${BASE_URL}/categories/`
}

export const CHECKOUT_API_ENDPOINTS = {
    getCheckout: `${BASE_URL}/checkouts/`,
    createCheckout: `${BASE_URL}/checkouts/create`
}

export const SESSION_API_ENDPOINTS = {
    checkSession: `${BASE_URL}/check-session`
}
