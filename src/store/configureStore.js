import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import warehousesReducer from '../reducers/warehouses';
import membersReducer from '../reducers/members';
import accountsReducer from '../reducers/accounts';
import categoriesReducer from '../reducers/categories';
import productsReducer from '../reducers/products';
import ordersReducer from '../reducers/orders';
import inventoriesReducer from '../reducers/inventories';
import usersReducer from '../reducers/users';
import paymentsReducer from '../reducers/payments';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      warehouses: warehousesReducer,
      members: membersReducer,
      accounts: accountsReducer,
      categories: categoriesReducer,
      products: productsReducer,
      orders: ordersReducer,
      inventories: inventoriesReducer,
      users: usersReducer,
      payments: paymentsReducer,
    }),
    composeEnhancers(applyMiddleware(thunk))
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
