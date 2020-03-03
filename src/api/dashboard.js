import axios from 'axios'

export const getSaleByMonth = (year, month) => {
    return axios.get('/api/dashboard/sale', {
        params: {
            year,
            month
        }
    })
}
