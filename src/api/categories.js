import axios from 'axios'

export const getCategoriesByAccountId = (accountId) => {
    return axios.get('/api/categories/account', {
        params: {
            accountId
        }
    })
}
export const getCategoriesById = (categoryId, accountId) => {
    console.log('api', categoryId, accountId)
    return axios.get('/api/categories', {
        params: {
            categoryId,
            accountId
        }
    })
}
export const createCategory = (category) => {
    return axios.post('/api/categories', category, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateCategory = (category) => {
    return axios.put('/api/categories', category, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteCategories = (categoryId) => {
    return axios.delete(`/categories/${categoryId}`)
}