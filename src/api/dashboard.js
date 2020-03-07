import axios from 'axios'

export const getSaleByMonth = (year, month, accountId) => {
    return axios.get('/api/dashboard/sale', {
        params: {
            year,
            month,
            accountId
        }
    })
}
export const getProductByMonth = (year, month, accountId) => {
    return axios.get('/api/dashboard/product', {
        params: {
            year,
            month,
            accountId
        }
    })
}
