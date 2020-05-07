import axios from 'axios'

export const getBranchesByAccountId = (accountId) => {
    return axios.get('/api/branches/account', {
        params: {
            accountId
        }
    })
}
export const getBranchesById = (branchId, accountId) => {
    // console.log('api', branchId, accountId)
    return axios.get('/api/branches', {
        params: {
            branchId,
            accountId
        }
    })
}
export const createBranch = (branch) => {
    return axios.post('/api/branches', branch, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateBranch = (branch) => {
    return axios.put('/api/branches', branch, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteBranch = (branchId) => {
    return axios.delete(`/branches/${branchId}`)
}