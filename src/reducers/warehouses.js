export default (state = [], action) => {
    switch (action.type) {
        case 'SET_WAREHOUSES':
            return action.warehouses;
        case 'ADD_WAREHOUSES':
            return state.concat(action.warehouse)
        case 'UPDATE_WAREHOUSES':
            return state.map(m => m.warehouseId == action.warehouse.warehouseId ? { ...m, ...action.warehouse } : m)
        default:
            return state;
    }
};