import axios from 'axios'

export const getUsersByAccountId = (accountId) => {
    return axios.get('/api/users/account', {
        params: {
            accountId
        }
    })
}
export const getUsersById = (userId, accountId) => {
    // console.log('api', userId, accountId)
    return axios.get('/api/users', {
        params: {
            userId,
            accountId
        }
    })
}

export const createUser = (user) => {
    return axios.post('/api/users', user, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateUser = (user) => {
    return axios.put('/api/users', user, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteUser = (userId) => {
    return axios.delete(`/users/${userId}`)
}