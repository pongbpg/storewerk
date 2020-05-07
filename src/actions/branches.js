// import db from '../firebase/firebase';
import { getBranchesByAccountId, getBranchesById, createBranch, updateBranch } from '../api/branches';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startAddBranch = (branch) => {
    // console.log('before api ',branch)
    return dispatch => {
        return createBranch(branch)
            .then(result => {
                if (result.data.inserted) {
                    // console.log('action', branch)
                    return getBranchesById(branch.branchId, branch.accountId)
                        .then(newData => {
                            dispatch(addBranches(newData.data))
                            return {
                                error: false,
                                msg: 'Your branch has been successfully created.'
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

export const startGetBranches = (accountId) => {
    return dispatch => {
        return getBranchesByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setBranches(row.data))
            })
    }
}

export const startUpdateBranch = (branch) => {
    return dispatch => {
        return updateBranch(branch)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updateBranches(branch))
                    return {
                        error: false,
                        msg: 'Your branch has been successfully updated.'
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

export const setBranches = (branches) => ({
    type: 'SET_BRANCHES',
    branches
});
export const updateBranches = (branch) => ({
    type: 'UPDATE_BRANCHES',
    branch
});
export const addBranches = (branch) => ({
    type: 'ADD_BRANCHES',
    branch
});
