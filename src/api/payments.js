import axios from 'axios'

export const getPaymentsByAccountId = (accountId) => {
    return axios.get('/api/payments/account', {
        params: {
            accountId
        }
    })
}
export const getPaymentsById = (paymentId, accountId) => {
    // console.log('api', paymentId, accountId)
    return axios.get('/api/payments', {
        params: {
            paymentId,
            accountId
        }
    })
}
export const createPayment = (payment) => {
    return axios.post('/api/payments', payment, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updatePayment = (payment) => {
    return axios.put('/api/payments', payment, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deletePayment = (paymentId) => {
    return axios.delete(`/payments/${paymentId}`)
}