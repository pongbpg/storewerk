export default (state = [], action) => {
    switch (action.type) {
        case 'SET_INVENTORIES':
            return action.inventories;
        default:
            return state;
    }
};