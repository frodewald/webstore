const BASE_URL = "http://localhost:8000/api"


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
    deleteOrder: (id) => `${BASE_URL}/orders/delete/user/product/${id}`
}

// product url
export const PRODUCT_API_ENDPOINTS = {
    getAllProduct: `${BASE_URL}/products/`,
    getProductById: (id) => `${BASE_URL}/products/${id}`,
    createProduct: `${BASE_URL}/products/create`,
    updateProduct: (id) => `${BASE_URL}/products/update/${id}`,
    deleteProduct: (id) => `${BASE_URL}/products/delete/${id}`
}

export const CATEGORY_API_ENDPOINTS = {
    getAllCategory: `${BASE_URL}/categories/`
}
// check session
export const SESSION_API_ENDPOINTS = {
    checkSession: `${BASE_URL}/check-session`
}