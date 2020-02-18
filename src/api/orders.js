import axios from 'axios'

export const getOrdersByAccountId = (accountId) => {
    return axios.get('/api/orders/account', {
        params: {
            accountId
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
export const getOrderNoLatest = (accountId, year) => {
    // console.log('api', orderId, accountId)
    return axios.get('/api/orders/latest/no', {
        params: {
            accountId,
            year
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
    return axios.delete(`/orders/${orderId}`)
}