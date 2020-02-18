import React from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { startNewAccount } from '../../actions/accounts';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import taxIdValidator from '../../selectors/taxIdValidator';
import _ from 'underscore';
import ImageUploader from 'react-images-upload';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            account: { accountName: '', accountTel: '', accountFax: '', accountId: '', accountAddr: '', accountLogo: [] },
            errors: { accountId: '', msg: '' },
            loading: ''
        }
        this.onDrop = this.onDrop.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        // this.taxIdValidator = this.taxIdValidator.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }
    onDrop(picture) {
        this.setState({
            account: {
                ...this.state.accoumt,
                accountLogo: this.state.account.accountLogo.concat(picture)
            }
        });
    }
    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;//.toUpperCase();
        this.setState({
            account: {
                ...this.state.account,
                [key]: value// key == 'username' ? value.toLowerCase() : value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: 'is-loading' })
        this.props.startNewAccount({ ...this.state.account, creator: this.state.auth.email })
            .then(res => {
                // console.log(res)
                this.setState({
                    loading: '', errors: {
                        ...this.state.errors,
                        msg: res.msg
                    }
                })
                if (res.error == false) {
                    history.push('/accounts')
                }

            })
    }


    render() {
        const disabled = !taxIdValidator(this.state.account.accountId) ||
            this.state.account.accountName.length < 1 ||
            this.state.account.accountTel.length == 0 ||
            this.state.account.accountAddr.length < 12
        // console.log('disabled', disabled)
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
                                        required
                                        disabled={this.state.loading != ''}
                                        onValueChange={(values) => {
                                            const { formattedValue, value, floatValue } = values;
                                            if (value.length == 13) {
                                                this.setState({
                                                    errors: {
                                                        ...this.state.errors,
                                                        accountId: taxIdValidator(value) ? '' : 'เลขผู้เสียภาษีไม่ถูกต้อง'
                                                    }
                                                });
                                            } else {
                                                this.setState({
                                                    errors: {
                                                        ...this.state.errors,
                                                        accountId: 'เลขผู้เสียภาษีต้องมี 13 หลัก!'
                                                    }
                                                });
                                            }
                                            this.setState({ account: { ...this.state.account, accountId: value } })
                                        }} />
                                </p>
                                <p className="help has-text-danger">{this.state.errors.accountId}</p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">โทรศัพท์</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <NumberFormat className="input"
                                        value={this.state.account.accountTel}
                                        isNumericString={true}
                                        format="###-###-####"
                                        mask="_"
                                        required
                                        disabled={this.state.loading != ''}
                                        onValueChange={(values) => {
                                            const { formattedValue, value, floatValue } = values;
                                            this.setState({ account: { ...this.state.account, accountTel: value } })
                                        }} />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">แฟกซ์</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <NumberFormat className="input"
                                        value={this.state.account.accountFax}
                                        isNumericString={true}
                                        format="###-###-####"
                                        mask="_"
                                        disabled={this.state.loading != ''}
                                        onValueChange={(values) => {
                                            const { formattedValue, value, floatValue } = values;
                                            this.setState({ account: { ...this.state.account, accountFax: value } })
                                        }} />
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
                                <p className="help has-text-danger">{this.state.errors.msg}</p>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">โลโก้</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <div className="control">
                                    <ImageUploader
                                        withIcon={true}
                                        buttonText='Choose images'
                                        onChange={this.onDrop}
                                        imgExtension={['.jpg', '.png']}
                                        maxFileSize={5242880}
                                    />
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
                                    <Link className="button" to="/accounts">ยกเลิก</Link>
                                </div>
                                <div className="control">
                                    <button className={`button is-link ${this.state.loading}`}
                                        disabled={disabled}
                                        type="submit">
                                        ลงทะเบียน
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
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    startNewAccount: (account) => dispatch(startNewAccount(account))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
