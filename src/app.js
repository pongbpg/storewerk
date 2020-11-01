import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { login, startGetUserByEmail, logout } from './actions/auth';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import { auth } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
import "react-datepicker/dist/react-datepicker.css";
const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

let hasRendered = false;
const renderApp = () => {
  // if (!hasRendered) {
  ReactDOM.render(jsx, document.getElementById('app'));
  // hasRendered = true;
  // }
};

// ReactDOM.render(<LoadingPage />, document.getElementById('app'));

const logOut = () => {
  store.dispatch(logout());
  renderApp();
  history.push('/');
}

auth.onAuthStateChanged((user) => {
  // console.log(user)
  if (user) {
    // console.log(user)
    // console.log('yes')
    store.dispatch(startGetUserByEmail(user))
      .then(doc => {
        store.dispatch(login({ ...user.providerData[0], ...doc }))
        renderApp()
      })
  } else {
    logOut();
  }
});
