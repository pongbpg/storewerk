import axios from 'axios'

export const getWarehousesByAccountId = (accountId) => {
    return axios.get('/api/warehouses/account', {
        params: {
            accountId
        }
    })
}
export const getWarehousesById = (warehouseId, accountId) => {
    // console.log('api', warehouseId, accountId)
    return axios.get('/api/warehouses', {
        params: {
            warehouseId,
            accountId
        }
    })
}
export const createWarehouse = (warehouse) => {
    return axios.post('/api/warehouses', warehouse, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateWarehouse = (warehouse) => {
    return axios.put('/api/warehouses', warehouse, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteWarehouse = (warehouseId) => {
    return axios.delete(`/warehouses/${warehouseId}`)
}