import React from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { startGetAccount, startUpdateAccount, startUpdateStatusAccount } from '../../actions/accounts';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import { FaFileImage } from 'react-icons/fa'
import { history } from '../../routers/AppRouter';
export class EditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            account: props.accounts.find(f => f.accountId == props.match.params.id) || { accountId: '', accountName: '', accountTel: '', accountAddr: '', statusRemark: '', accountLogo: null },
            imageFile: null,
            imagePreviewUrl: null,
            loading: '',
            isModal: false
        }
        if (props.accounts.length == 0) {
            history.push('/accounts')
        }
        // this.props.startGetAccount(props.match.params.id, props.auth.email);
        this.onInputChange = this.onInputChange.bind(this);
        // this.taxIdValidator = this.taxIdValidator.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }
    fileChangedHandler = event => {
        const file = event.target.files;
        this.setState({
            imageFile: file.length > 0 ? event.target.files[0] : null
        })

        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imagePreviewUrl: file.length > 0 ? reader.result : null
            });
        }
        if (file.length > 0) {
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;//.toUpperCase();
        this.setState({
            account: {
                ...this.state.account,
                [key]: value// key == 'username' ? value.toLowerCase() : value
            }
        }
            // , () => this.usernameValidator(this.state.account.username)
        )
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: 'is-loading' })
        this.props.startUpdateAccount({
            ..._.pick(this.state.account, 'accountId', 'accountName', 'accountTel', 'accountFax', 'accountAddr'),
            accountLogo: this.state.imagePreviewUrl,
            updater: this.state.auth.email,
            isStatus: 'WAITING'
        })
            .then(res => {
                this.setState({ loading: '' })
                if (res.error == false) {
                    history.push('/accounts')
                }
            })
            .catch(err => {
                this.setState({
                    loading: '', errors: {
                        ...this.state.errors,
                        msg: res.msg
                    }
                })
            })
    }

    onApproveClick = (isStatus, e) => {
        e.preventDefault();

        if (isStatus == 'REJECT') {
            this.setState({ isModal: true })
        } else {
            this.setState({ loading: 'is-loading' })
            this.props.startUpdateAccount({
                isStatus,
                accountId: this.state.account.accountId,
                updater: this.state.auth.email
            }).then(res => {
                this.setState({ loading: '' })
                if (res.error == false) {
                    history.push('/accounts')
                }
            })
        }
    }

    onModalSave = (e) => {
        this.setState({ isModal: false })
        this.setState({ loading: 'is-loading' })
        this.props.startUpdateAccount({
            isStatus: 'REJECT',
            statusRemark: this.state.account.statusRemark,
            accountId: this.state.account.accountId,
            updater: this.state.auth.email
        }).then(res => {
            this.setState({ loading: '' })
            if (res.error == false) {
                history.push('/accounts')
            }
        })
    }

    render() {
        const disabled = this.state.account.accountName.length < 1 ||
            this.state.account.accountTel.length > 10 ||
            this.state.account.accountAddr.length < 12;
        const showApprove = (this.state.auth.role == 'admin' && this.state.account.isStatus == 'WAITING');
        const colors = [{ status: 'WAITING', color: 'warning' }, { status: 'ACTIVE', color: 'success' }, { status: 'REJECT', color: 'danger' }]
        const status = colors.find(f => f.status == this.state.account.isStatus);
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    {status &&
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">สถานะ</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <label className="label  has-text-danger">
                                            <span className={`tag is-${status.color}`}>
                                                {status.status}
                                            </span>
                                            &nbsp;{this.state.account.statusRemark}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">ชื่อ-นามสกุล / บริษัท</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <input className="input" type="text" name="accountName"
                                        disabled={this.state.loading != ''}
                                        value={this.state.account.accountName} onChange={this.onInputChange} required />

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
                                        value={this.state.account.accountId}
                                        isNumericString={true}
                                        format="#-####-#####-##-#"
                                        mask="_"
                                        disabled
                                    />
                                </p>
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
                                    <input className="input" type="text" name="accountTel"
                                        disabled={this.state.loading != ''}
                                        value={this.state.account.accountTel} onChange={this.onInputChange} required />
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
                                    <textarea className="textarea" name="accountAddr"
                                        disabled={this.state.loading != ''}
                                        value={this.state.account.accountAddr} onChange={this.onInputChange} required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">โลโก้</label>
                        </div>
                        <div className="field-body">
                            <div className="field  is-grouped">
                                <div className="control">
                                    <figure className="image is-128x128">
                                        <img src={this.state.imageFile ? this.state.imagePreviewUrl : this.state.account.accountLogo} />
                                    </figure>
                                </div>
                                <div className="control">
                                    <div className="file has-name is-right">
                                        <label className="file-label">
                                            <input type="file" className="file-input" onChange={this.fileChangedHandler} />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <FaFileImage />
                                                </span>
                                                <span className="file-label">เลือกรูปภาพ</span>
                                            </span>
                                            {
                                                this.state.imageFile &&
                                                <span className="file-name">{this.state.imageFile.name}</span>
                                            }
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">
                        <div className="field-label">
                        </div>
                        <div className="field-body">
                            <div className="field is-grouped is-6">
                                <div className="control">
                                    <Link className="button" to="/accounts">ยกเลิก</Link>
                                </div>
                                <div className="control">
                                    <button className={`button is-link ${this.state.loading}`}
                                        disabled={disabled}
                                        type="submit">
                                        บันทึก
                                    </button>
                                </div>
                                {showApprove &&
                                    <div className="control">
                                        <button className={`button is-success ${this.state.loading}`}
                                            onClick={(e) => this.onApproveClick('ACTIVE', e)}>
                                            อนุมัติ
                                        </button>
                                    </div>
                                }
                                {showApprove &&
                                    <div className="control">
                                        <button className={`button is-danger ${this.state.loading}`}
                                            onClick={(e) => this.onApproveClick('REJECT', e)}>
                                            ไม่อนุมัติ
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </form>
                <div className={`modal  is-danger ${this.state.isModal && 'is-active'}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">หมายเหตุ</p>
                            <button className="delete" aria-label="close" onClick={(e) => this.setState({ isModal: false })}></button>
                        </header>
                        <section className="modal-card-body">
                            <input type="text" className="input" value={this.state.account.statusRemark} name="statusRemark"
                                onChange={this.onInputChange} />
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button" onClick={(e) => this.setState({ isModal: false })}>ยกเลิก</button>
                            <button className="button is-danger" onClick={this.onModalSave}>บันทึก</button>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    accounts: state.accounts
});

const mapDispatchToProps = (dispatch) => ({
    startGetAccount: (accountId, userId) => dispatch(startGetAccount(accountId, userId)),
    startUpdateAccount: (account) => dispatch(startUpdateAccount(account)),
    startUpdateStatusAccount: (account) => dispatch(startUpdateStatusAccount(account))

});
export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
