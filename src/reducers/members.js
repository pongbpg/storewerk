export default (state = [], action) => {
    switch (action.type) {
        case 'SET_MEMBERS':
            return action.members;
        case 'ADD_MEMBERS':
            return state.concat(action.member)
        case 'UPDATE_MEMBERS':
            return state.map(m => m.memberId == action.member.memberId ? { ...m, ...action.member } : m)
        default:
            return state;
    }
};