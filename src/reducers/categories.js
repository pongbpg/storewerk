export default (state = [], action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return action.categories;
        case 'ADD_CATEGORIES':
            return state.concat(action.category)
        case 'UPDATE_CATEGORIES':
            return state.map(m => m.categoryId == action.category.categoryId ? { ...m, ...action.category } : m)
        default:
            return state;
    }
};