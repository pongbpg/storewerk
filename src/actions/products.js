// import db from '../firebase/firebase';
import { getProductsByAccountId, getProductsById, createProduct, updateProduct } from '../api/products';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startAddProduct = (product) => {
    console.log('before api ',product)
    return dispatch => {
        return createProduct(product)
            .then(result => {
                if (result.data.inserted) {
                    // console.log('action', product)
                    return getProductsById(product.productId, product.accountId)
                        .then(newData => {
                            dispatch(addProducts(newData.data))
                            return {
                                error: false,
                                msg: 'Your product has been successfully created.'
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

export const startGetProducts = (accountId) => {
    return dispatch => {
        return getProductsByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setProducts(row.data))
            })
    }
}

export const startUpdateProduct = (product) => {
    return dispatch => {
        return updateProduct(product)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updateProducts(product))
                    return {
                        error: false,
                        msg: 'Your product has been successfully updated.'
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

export const setProducts = (products) => ({
    type: 'SET_PRODUCTS',
    products
});
export const updateProducts = (product) => ({
    type: 'UPDATE_PRODUCTS',
    product
});
export const addProducts = (product) => ({
    type: 'ADD_PRODUCTS',
    product
});
