export default (state = { account: { accountId: '' } }, action) => {
    switch (action.type) {
        case 'LOGIN':
            // console.log('login', state, action.auth, { ...state, ...action.auth })
            return {
                ...state,
                ...action.auth,
            }
        case 'LOGOUT':
            return {};
        case 'AUTH_SELECT_ACCOUNT':
            return {
                ...state,
                account: action.account
            }
        case 'SET_AUTH':
            return {
                uid: action.uid,
                email: action.email,
                role: action.role,
            }
        default:
            return state;
    }
};