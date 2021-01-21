import axios from 'axios'

export const printRequest = (accountId, orderId) => {
    return axios.post('/api/prints/request', { a: accountId, o: orderId }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
export const printProductUsed = (accountId, warehouseId, startDate, endDate) => {
    return axios.post('/api/prints/product/used', { a: accountId, w: warehouseId, sd: startDate, ed: endDate }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
export const printProductInit = (accountId, warehouseId, date) => {
    return axios.post('/api/prints/product/init', { a: accountId, w: warehouseId, d: date }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
