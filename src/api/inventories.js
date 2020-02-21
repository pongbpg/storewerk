import axios from 'axios'

export const getInventoriesByAccountId = (accountId,orderDate) => {
    return axios.get('/api/inventories/account', {
        params: {
            accountId,
            orderDate
        }
    })
}
export const getInventoriesByWarehouseId = (warehouseId, accountId) => {
    // console.log('api', orderId, accountId)
    return axios.get('/api/inventories/warehouse', {
        params: {
            warehouseId,
            accountId
        }
    })
}
