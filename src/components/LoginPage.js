import React from 'react';
import { connect } from 'react-redux';
import { history } from '../routers/AppRouter';
import { startLoginWithGoogle, startLogout } from '../actions/auth';
import { FaGoogle } from 'react-icons/fa';
export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth
        }
        this.redirectLogin(props.auth)
    }
    redirectLogin = (auth) => {
        if (auth.uid) {
            if (auth.role) {
                history.push('/home')
            } else {
                history.push('/accounts')
            }
        } else {
            history.push('/login')
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
            this.redirectLogin(nextProps.auth)
        }
    }
    render() {
        return (
            <div className="hero is-warning is-fullheight fontPattaya">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="column is-6 is-offset-3">
                            <h3 className="title has-text-dark">Welcome to Store Kub.</h3>
                            {!this.state.auth.uid &&
                                <div className="field">
                                    <a className={`button is-large is-dark`}
                                        onClick={this.props.startLoginWithGoogle}
                                    >Sign in with &nbsp;
                                     <FaGoogle className="has-text-info" />
                                        {/* <span className="has-text-info">G</span> */}
                                        <span className="has-text-danger">o</span>
                                        <span className="has-text-warning">o</span>
                                        <span className="has-text-info">g</span>
                                        <span className="has-text-success">l</span>
                                        <span className="has-text-danger">e</span>
                                    </a>
                                </div>
                            }
                        </div>
                        {this.state.auth.uid &&
                            <div className="column is-6 is-offset-3">
                                <div className="field">
                                    <a className={`button is-large`}
                                        onClick={this.props.startLogout}
                                    >Logout
                                </a>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    auth: state.auth
})

const mapDispatchToProps = (dispatch) => ({
    startLoginWithGoogle: () => dispatch(startLoginWithGoogle()),
    startLogout: () => dispatch(startLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);