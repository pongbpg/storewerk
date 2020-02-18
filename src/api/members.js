import axios from 'axios'

export const getMembersByAccountId = (accountId) => {
    return axios.get('/api/members/account', {
        params: {
            accountId
        }
    })
}
export const getMembersById = (memberId, accountId) => {
    // console.log('api', memberId, accountId)
    return axios.get('/api/members', {
        params: {
            memberId,
            accountId
        }
    })
}
export const getMembersByTel = (memberTel, accountId, orderTypeId) => {
    // console.log('api', memberId, accountId)
    return axios.get('/api/members/tel', {
        params: {
            memberTel,
            accountId,
            orderTypeId
        }
    })
}
export const createMember = (member) => {
    return axios.post('/api/members', member, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateMember = (member) => {
    return axios.put('/api/members', member, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteMember = (memberId) => {
    return axios.delete(`/members/${memberId}`)
}