export default (state = [], action) => {
    switch (action.type) {
        case 'SET_ACCOUNTS':
            return action.accounts;
        case 'ADD_ACCOUNTS':
            return state.concat(action.account)
        case 'UPDATE_ACCOUNTS':
            return state.map(m => m.accountId == action.account.accountId ? { ...m, ...action.account } : m)
        case 'SET_ARRAY_ACCOUNT':
            return state.map(m => {
                if (m.taxid == action.account.taxid) {
                    return {
                        ...m,
                        [action.key]: action.account[action.key]
                    }
                } else {
                    return m
                }
            })
        default:
            return state;
    }
};