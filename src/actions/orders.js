// import db from '../firebase/firebase';
import { getOrdersByAccountId, getOrdersById, createOrder, updateOrder, deleteOrder } from '../api/orders';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startAddOrder = (order) => {
    // console.log('before api ',order)
    return dispatch => {
        return createOrder(order)
            .then(result => {
                // return result
                if (result.data.inserted) {
                    const data = JSON.parse(order)
                    return getOrdersById(data.order.orderId, data.order.accountId)
                        .then(newData => {
                            dispatch(addOrders(newData.data))
                            return {
                                error: false,
                                msg: 'Your order has been successfully created.'
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

export const startGetOrders = (accountId, userId) => {
    return dispatch => {
        return getOrdersByAccountId(accountId, userId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setOrders(row.data))
            })
    }
}


export const startUpdateOrder = (order) => {
    return dispatch => {
        return updateOrder(order)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updateOrders(order))
                    return {
                        error: false,
                        msg: 'Your order has been successfully updated.'
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

export const startDeleteOrder = (orderId) => {
    return dispatch => {
        return deleteOrder(orderId)
            .then(result => {
                if (result.data.deleted) {
                    dispatch(deleteOrders(orderId))
                    return {
                        error: false,
                        msg: 'Your order has been successfully deleted.'
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

export const setOrders = (orders) => ({
    type: 'SET_ORDERS',
    orders
});
export const updateOrders = (order) => ({
    type: 'UPDATE_ORDERS',
    order
});
export const deleteOrders = (orderId) => ({
    type: 'DELETE_ORDERS',
    orderId
});
export const addOrders = (order) => ({
    type: 'ADD_ORDERS',
    order
});
