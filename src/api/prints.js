import axios from 'axios'

export const printRequest = (accountId, orderId) => {
    return axios.post('/api/prints/request', { a: accountId, o: orderId }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
