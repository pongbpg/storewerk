import axios from 'axios'

export const checkPermission = (accountId, userId, permissionId, actionName) => {
    return axios.post('/api/permissions/check', { a: accountId, u: userId, p: permissionId, an: actionName }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
