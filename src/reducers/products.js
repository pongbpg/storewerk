export default (state = [], action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return action.products;
        case 'ADD_PRODUCTS':
            return state.concat(action.product)
        case 'UPDATE_PRODUCTS':
            return state.map(m => m.productId == action.product.productId ? { ...m, ...action.product } : m)
        default:
            return state;
    }
};