export default (state = [], action) => {
    switch (action.type) {
        case 'SET_ORDERS':
            return action.orders;
        case 'ADD_ORDERS':
            return state.concat(action.order)
        default:
            return state;
    }
};