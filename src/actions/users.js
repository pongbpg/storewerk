// import db from '../firebase/firebase';
import { getUsersByAccountId, getUsersById, createUser, updateUser } from '../api/users';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');

export const startGetUsers = (accountId) => {
    return dispatch => {
        return getUsersByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setUsers(row.data))
            })
    }
}

export const startAddUser = (user) => {
    // console.log('before api ',user)
    return dispatch => {
        return createUser(user)
            .then(result => {
                if (result.data.inserted) {
                    // console.log('action', user)
                    return getUsersById(user.userId, user.accountId)
                        .then(newData => {
                            dispatch(addUsers(newData.data))
                            return {
                                error: false,
                                msg: 'Your user has been successfully created.'
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

export const setUsers = (users) => ({
    type: 'SET_USERS',
    users
});

export const addUsers = (user) => ({
    type: 'ADD_USERS',
    user
});

