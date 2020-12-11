export default (state = [], action) => {
    switch (action.type) {
        case 'SET_PAYMENTS':
            return action.payments;
        case 'ADD_PAYMENTS':
            return state.concat(action.payment)
        case 'UPDATE_PAYMENTS':
            return state.map(m => (m.bankId == action.payment.bankId && m.paymentId == action.payment.paymentId) ? { ...m, ...action.payment } : m)
        default:
            return state;
    }
};