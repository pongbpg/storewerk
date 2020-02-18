import axios from 'axios'

export const getProductsByAccountId = (accountId) => {
    return axios.get('/api/products/account', {
        params: {
            accountId
        }
    })
}
export const getProductsById = (productId, accountId) => {
    console.log('api', productId, accountId)
    return axios.get('/api/products', {
        params: {
            productId,
            accountId
        }
    })
}
export const createProduct = (product) => {
    return axios.post('/api/products', product, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateProduct = (product) => {
    return axios.put('/api/products', product, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteProduct = (productId) => {
    return axios.delete(`/products/${productId}`)
}