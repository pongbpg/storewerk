import axios from 'axios'

export const getOrdersByAccountId = (accountId, userId) => {
    return axios.get('/api/orders/account', {
        params: {
            accountId,
            userId
        }
    })
}
export const getOrdersById = (orderId, accountId) => {
    // console.log('api', orderId, accountId)
    return axios.get('/api/orders', {
        params: {
            orderId,
            accountId
        }
    })
}
export const getOrderDetailById = (orderId, accountId) => {
    // console.log('api', orderId, accountId)
    return axios.get('/api/orders/detail', {
        params: {
            orderId,
            accountId
        }
    })
}
export const getOrderNoLatest = (accountId, orderDate) => {
    // console.log('api', orderId, accountId)
    return axios.get('/api/orders/latest/no', {
        params: {
            accountId,
            orderDate
        }
    })
}
export const createOrder = (order) => {
    return axios.post('/api/orders', order, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateOrder = (order) => {
    return axios.put('/api/orders', order, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteOrder = (orderId) => {
    return axios.delete(`/api/orders/${orderId}`)
}