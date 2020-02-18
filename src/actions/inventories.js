// import db from '../firebase/firebase';
import { getInventoriesByAccountId, getInventoriesById } from '../api/inventories';
import _ from 'underscore';
export const startGetInventories = (accountId) => {
    return dispatch => {
        return getInventoriesByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setInventories(row.data[0]))
            })
    }
}


export const setInventories = (inventories) => ({
    type: 'SET_INVENTORIES',
    inventories
});