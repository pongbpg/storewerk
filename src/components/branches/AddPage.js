import React from 'react';
import { connect } from 'react-redux';
import { startAddBranch } from '../../actions/branches';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import _ from 'underscore';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            branch: { branchId: '', branchName: '' },
            branches: props.branches || [],
            errors: '',
            loading: ''
        }
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        }
        this.onInputChange = this.onInputChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }

    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value.toUpperCase();
        if (key == "branchId") {
            this.setState({ error: '' })
        }
        this.setState({
            branch: {
                ...this.state.branch,
                [key]: value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: 'is-loading' })
        let valid = true;
        // console.log(this.state.branches.length)
        // if (this.state.branches.length > 0) {
        if (this.state.branches.find(f => f.branchId == this.state.branch.branchId)) {
            valid = false;
            this.setState({
                loading: '',
                error: 'รหัสนี้มีการใช้แล้ว'
            })
        } else {
            this.props.startAddBranch({
                ...this.state.branch,
                accountId: this.state.auth.account.accountId,
                creator: this.state.auth.email
            })
                .then(res => {
                    this.setState({
                        loading: ''
                    })
                    if (res.error == false) {
                        history.push('/branches')
                    } else {
                        this.setState({
                            error: res.messages
                        })
                    }
                })
        }
    }

    render() {
        const disabled = this.state.branch.branchId.length < 1 ||
            this.state.branch.branchName.length < 1
        // console.log('disabled', disabled)
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">รหัสคลัง</label>
                        <div className="control">
                            <input className="input" type="text" name="branchId"
                                disabled={this.state.loading != ''}
                                value={this.state.branch.branchId} onChange={this.onInputChange} required />

                        </div>
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ชื่อคลัง</label>
                        <div className="control">
                            <input className="input" type="text" name="branchName"
                                disabled={this.state.loading != ''}
                                value={this.state.branch.branchName} onChange={this.onInputChange} required />
                        </div>
                    </div>
                    <div className="field is-grouped" style={{ paddingTop: '30px' }}>
                        <div className="control">
                            <Link className="button" to="/branches">ยกเลิก</Link>
                        </div>
                        <div className="control">
                            <button className={`button is-link ${this.state.loading}`}
                                disabled={disabled}
                                type="submit">
                                เพิ่ม
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    branches: state.branches
});

const mapDispatchToProps = (dispatch) => ({
    startAddBranch: (branch) => dispatch(startAddBranch(branch))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
