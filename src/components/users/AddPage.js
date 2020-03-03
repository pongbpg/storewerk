import React from 'react';
import { connect } from 'react-redux';
import { startAddUser } from '../../actions/users';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import _ from 'underscore';
import validator from 'validator';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            user: { userId: '', roleId: 'ADMIN' },
            errors: '',
            loading: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        // this.setState({ loading: 'is-loading' })
        this.props.startAddUser({
            accountId: this.state.auth.account.accountId,
            ...this.state.user,
            creator: this.state.auth.email
        })
            .then(res => {
                this.setState({
                    loading: ''
                })
                if (res.error == false) {
                    history.push('/users')
                } else {
                    this.setState({
                        error: res.messages
                    })
                }
            })
    }

    render() {
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">User Email</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <input className="input" type="email"
                                        disabled={this.state.loading != ''}
                                        value={this.state.user.userId}
                                        onChange={e => this.setState({
                                            user: {
                                                ...this.state.user,
                                                userId: e.target.value
                                            }
                                        })} />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">สิทธิ์</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <p className="select">
                                    <select selected={this.state.user.roleId}
                                        onChange={e => this.setState({
                                            user: {
                                                ...this.state.user,
                                                roleId: e.target.value
                                            }
                                        })}>
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="FINANCE">FINANCE</option>
                                        <option value="SALE">SALE</option>
                                        <option value="STOCK">STOCK</option>
                                    </select>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label">
                        </div>
                        <div className="field-body">
                            <div className="field is-grouped">
                                <div className="control">
                                    <Link className="button" to="/users">ยกเลิก</Link>
                                </div>
                                <div className="control">
                                    <button className={`button is-link ${this.state.loading}`}
                                        disabled={!validator.isEmail(this.state.user.userId)}
                                        type="submit">
                                        เพิ่ม
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    users: state.users
});

const mapDispatchToProps = (dispatch) => ({
    startAddUser: (user) => dispatch(startAddUser(user))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
