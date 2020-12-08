import axios from 'axios'

export const getAccountsByEmail = (email) => {
    return axios.get('/api/accounts/user', {
        params: {
            email
        }
    })
}
export const getAccountsById = (id, email) => {
    return axios.get('/api/accounts/', {
        params: {
            id,
            email
        }
    })
}
export const getYearsByAccId = (id) => {
    return axios.get('/api/accounts/years', {
        params: {
            id
        }
    })
}
export const getMonthsByAccId = (id, year) => {
    return axios.get('/api/accounts/months', {
        params: {
            id,
            year
        }
    })
}
export const createAccount = (account) => {
    return axios.post('/api/accounts', account, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateAccount = (account) => {
    return axios.put('/api/accounts', account, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteAccounts = (accountId) => {
    return axios.delete(`/accounts/${accountId}`)
}