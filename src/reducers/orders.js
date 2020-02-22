export default (state = [], action) => {
    switch (action.type) {
        case 'SET_ORDERS':
            return action.orders;
        case 'ADD_ORDERS':
            return state.concat(action.order)
        case 'DELETE_ORDERS':
            return state.filter(f => f.orderId !== action.orderId)
        default:
            return state;
    }
};