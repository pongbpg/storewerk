import axios from 'axios'

export const getInventoriesByAccountId = (accountId) => {
    return axios.get('/api/inventories/account', {
        params: {
            accountId
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
