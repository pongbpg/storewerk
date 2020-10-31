import db, { auth, googleAuthProvider } from '../firebase/firebase';
import { history } from '../routers/AppRouter';
import moment from 'moment';

export const startLoginWithGoogle = () => {
    return (dispatch) => {
        return auth.signInWithPopup(googleAuthProvider)
            .then((res) => {
                history.push('/home')
            })
    };
};

export const startGetUserByEmail = (user) => {
    return (dispatch) => {
        return db.collection('users').doc(user.email).get()
            .then(doc => {
                // console.log(user)
                let obj = { account: { accountId: '' } };
                if (doc.exists) {
                    obj = Object.assign(obj, { ...doc.data() })
                }
                return obj;
            })
    }
}
export const startSetAccountUser = (email, account) => {
    return (dispatch) => {
        return db.collection('users').doc(email).set({ account }, { merge: true })
            .then(() => {
                return dispatch(authSelectAccount(account))
            })
    }
}

export const login = (auth) => ({
    type: 'LOGIN',
    auth
});
export const authSelectAccount = (account) => ({
    type: 'AUTH_SELECT_ACCOUNT',
    account
});
export const logout = () => ({
    type: 'LOGOUT'
});
export const startLogout = () => {
    return () => {
        return auth.signOut();
    }
};
