// import db from '../firebase/firebase';
import { getPaymentsByAccountId, getPaymentsById, createPayment, updatePayment } from '../api/payments';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startAddPayment = (payment) => {
    // console.log('before api ',payment)
    return dispatch => {
        return createPayment(payment)
            .then(result => {
                if (result.data.inserted) {
                    // console.log('action', payment)
                    return getPaymentsById(payment.paymentId, payment.bankId, payment.accountId)
                        .then(newData => {
                            dispatch(addPayments(newData.data))
                            return {
                                error: false,
                                msg: 'Your payment has been successfully created.'
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

export const startGetPayments = (accountId) => {
    return dispatch => {
        return getPaymentsByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setPayments(row.data))
            })
    }
}

export const startUpdatePayment = (payment) => {
    return dispatch => {
        return updatePayment(payment)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updatePayments(payment))
                    return {
                        error: false,
                        msg: 'Your payment has been successfully updated.'
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

export const setPayments = (payments) => ({
    type: 'SET_PAYMENTS',
    payments
});
export const updatePayments = (payment) => ({
    type: 'UPDATE_PAYMENTS',
    payment
});
export const addPayments = (payment) => ({
    type: 'ADD_PAYMENTS',
    payment
});
