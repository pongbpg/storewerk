import React from 'react';
import { connect } from 'react-redux';
import { startUpdateMember } from '../../actions/members';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import _ from 'underscore';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            member: props.members.find(f => f.memberId == props.match.params.code)
                || { memberId: '', memberName: '', memberAddr: '', memberTel: '' },
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
        this.setState({
            member: {
                ...this.state.member,
                [key]: value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.member)
        this.setState({ loading: 'is-loading' })
        this.props.startUpdateMember({
            accountId: this.state.auth.account.accountId,
            ..._.pick(this.state.member, 'memberId', 'memberName', 'memberAddr', 'memberTel'),
            updater: this.state.auth.email
        })
            .then(res => {
                this.setState({
                    loading: ''
                })
                if (res.error == false) {
                    history.push('/members')
                }
            })
    }

    render() {
        // console.log(this.state.member)
        const disabled = this.state.member.memberName.length < 1 ||
            this.state.member.memberTel.length < 8 ||
            this.state.member.memberAddr.length < 12;
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">ชื่อ-นามสกุล / บริษัท</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <input className="input" type="text" name="memberName"
                                        disabled={this.state.loading != ''}
                                        value={this.state.member.memberName} onChange={this.onInputChange} required />

                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">เลขที่ผู้เสียภาษี</label>
                        </div>
                        <div className="field-body">
                            <div className="field is-expanded">
                                <p className="control is-expanded">
                                    <NumberFormat className="input"
                                        value={this.state.member.memberId}
                                        isNumericString={true}
                                        format="#-####-#####-##-#"
                                        mask="_"
                                        required
                                        disabled />
                                </p>
                                <p className="help has-text-danger">{this.state.error}</p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">เบอร์ติดต่อ</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <input className="input" type="text" name="memberTel"
                                        disabled={this.state.loading != ''}
                                        value={this.state.member.memberTel} onChange={this.onInputChange} required />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">ที่อยู่</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <div className="control">
                                    <textarea className="textarea" name="memberAddr"
                                        disabled={this.state.loading != ''}
                                        value={this.state.member.memberAddr} onChange={this.onInputChange} required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">
                        <div className="field-label">
                        </div>
                        <div className="field-body">
                            <div className="field is-grouped">
                                <div className="control">
                                    <Link className="button" to="/members">ยกเลิก</Link>
                                </div>
                                <div className="control">
                                    <button className={`button is-link ${this.state.loading}`}
                                        disabled={disabled}
                                        type="submit">
                                        บันทึก
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
    members: state.members
});

const mapDispatchToProps = (dispatch) => ({
    startUpdateMember: (member) => dispatch(startUpdateMember(member))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
