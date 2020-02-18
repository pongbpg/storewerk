// import db from '../firebase/firebase';
import { getCategoriesByAccountId, getCategoriesById, createCategory, updateCategory } from '../api/categories';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startAddCategory = (category) => {
    return dispatch => {
        return createCategory(category)
            .then(result => {
                if (result.data.inserted) {
                    // console.log('action', category)
                    return getCategoriesById(category.categoryId, category.accountId)
                        .then(newData => {
                            dispatch(addCategories(newData.data))
                            return {
                                error: false,
                                msg: 'Your category has been successfully created.'
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

export const startGetCategories = (accountId) => {
    return dispatch => {
        return getCategoriesByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setCategories(row.data))
            })
    }
}

export const startUpdateCategory = (category) => {
    return dispatch => {
        return updateCategory(category)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updateCategories(category))
                    return {
                        error: false,
                        msg: 'Your category has been successfully updated.'
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

export const setCategories = (categories) => ({
    type: 'SET_CATEGORIES',
    categories
});
export const updateCategories = (category) => ({
    type: 'UPDATE_CATEGORIES',
    category
});
export const addCategories = (category) => ({
    type: 'ADD_CATEGORIES',
    category
});
