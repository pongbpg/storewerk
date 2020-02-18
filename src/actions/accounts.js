// import db from '../firebase/firebase';
import { getAccountsByEmail, getAccountsById, createAccount, updateAccount } from '../api/accounts';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startNewAccount = (account) => {
    return dispatch => {
        return createAccount({ ...account })
            .then(result => {
                if (result.data.inserted) {
                    return getAccountsById(account.accountId, account.creator)
                        .then(newData => {
                            dispatch(addAccounts(newData.data))
                            return {
                                error: false,
                                msg: 'Your account has been successfully created.'
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

export const startGetAccounts = (auth) => {
    return dispatch => {
        return getAccountsByEmail(auth.email)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setAccounts(row.data))
            })
    }
}

export const startUpdateAccount = (account) => {
    return dispatch => {
        return updateAccount(account)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updateAccounts(account))
                    return {
                        error: false,
                        msg: 'Your account has been successfully updated.'
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
export const startEditAccount = ({ taxid, name, addr, tel, updater }) => {
    return dispatch => {
        return db.collection('accounts').doc(taxid)
            .update({ name, addr, tel, statusRemark: '', isStatus: 'WAITING', updater, updated: moment().unix() })
            .then(() => {
                return {
                    error: false,
                    messages: 'Your account has been successfully updated.'
                }
            })
    }
}
export const startUpdateStatusAccount = ({ taxid, isStatus, statusRemark = '' }) => {
    return dispatch => {
        return db.collection('accounts').doc(taxid)
            .update({ isStatus, statusRemark, updated: moment().unix() })
            .then(doc => {
                return {
                    error: false,
                    messages: 'Your account has been status is ' + isStatus + '.'
                }
            })
    }
}

export const startAddAccountArray = (key, { taxid, value }) => {
    return dispatch => {
        return db.collection('accounts').doc(taxid).get()
            .then(doc => {
                let data = doc.get(key) || [];
                data.push(value);
                dispatch(setArrayAccount(key, { taxid, [key]: data }))
                doc.ref.update({ [key]: data })
                return {
                    error: false,
                    messages: 'Your account has been added ' + key + '.'
                }
            })
    }
}
export const startEditAccountArray = (key, { taxid, value }) => {
    return dispatch => {
        // console.log('edit', value.code, { ...value })
        return db.collection('accounts').doc(taxid).get()
            .then(doc => {
                let data = doc.get(key) || [];
                data = data.map(m => value.code == m.code ? { ...m, ...value } : m)
                dispatch(setArrayAccount(key, { taxid, [key]: data }))
                doc.ref.update({ [key]: data })
                return {
                    error: false,
                    messages: 'Your account has been updated ' + key + '.'
                }
            })
    }
}

export const startRemoveAccountArray = (key, { taxid, value }) => {
    return dispatch => {
        return db.collection('accounts').doc(taxid).get()
            .then(doc => {
                let data = doc.get(key);
                const index = data.findIndex(f => f.code == value.code)
                data.splice(index, 1)
                dispatch(setArrayAccount(key, { taxid, [key]: data }))
                doc.ref.update({ [key]: data })
                return {
                    error: false,
                    messages: 'Your account has been removed ' + key + '.'
                }
            })
    }
}

export const setAccounts = (accounts) => ({
    type: 'SET_ACCOUNTS',
    accounts
});
export const updateAccounts = (account) => ({
    type: 'UPDATE_ACCOUNTS',
    account
});
export const addAccounts = (account) => ({
    type: 'ADD_ACCOUNTS',
    account
});
export const setArrayAccount = (key, account) => ({
    type: 'SET_ARRAY_ACCOUNT',
    key,
    account
});