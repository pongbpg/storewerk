export default (state = [], action) => {
    switch (action.type) {
        case 'SET_USERS':
            return action.users;
        case 'ADD_USERS':
            return state.concat(action.user)
        case 'UPDATE_USERS':
            return state.map(m => m.userId == action.user.userId ? { ...m, ...action.user } : m)
        default:
            return state;
    }
};