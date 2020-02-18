// import db from '../firebase/firebase';
import { getWarehousesByAccountId, getWarehousesById, createWarehouse, updateWarehouse } from '../api/warehouses';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startAddWarehouse = (warehouse) => {
    // console.log('before api ',warehouse)
    return dispatch => {
        return createWarehouse(warehouse)
            .then(result => {
                if (result.data.inserted) {
                    // console.log('action', warehouse)
                    return getWarehousesById(warehouse.warehouseId, warehouse.accountId)
                        .then(newData => {
                            dispatch(addWarehouses(newData.data))
                            return {
                                error: false,
                                msg: 'Your warehouse has been successfully created.'
                            }
                        })
                } else {
                    return {
                        error: true,
                        msg: result.data.msg
                    }
                }
            })
    }
}

export const startGetWarehouses = (accountId) => {
    return dispatch => {
        return getWarehousesByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setWarehouses(row.data))
            })
    }
}

export const startUpdateWarehouse = (warehouse) => {
    return dispatch => {
        return updateWarehouse(warehouse)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updateWarehouses(warehouse))
                    return {
                        error: false,
                        msg: 'Your warehouse has been successfully updated.'
                    }
                } else {
                    return {
                        error: true,
                        msg: result.data.msg
                    }
                }
            })

    }
}

export const setWarehouses = (warehouses) => ({
    type: 'SET_WAREHOUSES',
    warehouses
});
export const updateWarehouses = (warehouse) => ({
    type: 'UPDATE_WAREHOUSES',
    warehouse
});
export const addWarehouses = (warehouse) => ({
    type: 'ADD_WAREHOUSES',
    warehouse
});
