import React from 'react';
import { connect } from 'react-redux';
import { startAddPayment } from '../../actions/payments';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import _ from 'underscore';
import { bankData } from '../../../data/banks';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            payment: { bankId: '', bankBranch: '', paymentId: '', paymentName: '', payStatus: 'OPEN' },
            payments: props.payments || [],
            errors: '',
            loading: '',
            banks: bankData,
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
        if (key == "paymentId") {
            this.setState({ error: '' })
        }
        this.setState({
            payment: {
                ...this.state.payment,
                [key]: value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: 'is-loading' })
        let valid = true;
        // console.log(this.state.payments.length)
        // if (this.state.payments.length > 0) {
        if (this.state.payments.find(f => f.bankId == this.state.payment.bankId && f.paymentId == this.state.payment.paymentId)) {
            valid = false;
            this.setState({
                loading: '',
                error: 'ธนาคารและเลขบัญชีนี้มีการใช้แล้ว'
            })
        } else {
            // console.log(this.state.payment)
            this.props.startAddPayment({
                ...this.state.payment,
                accountId: this.state.auth.account.accountId,
                creator: this.state.auth.email
            })
                .then(res => {
                    this.setState({
                        loading: ''
                    })
                    if (res.error == false) {
                        history.push('/payments')
                    } else {
                        this.setState({
                            error: res.messages
                        })
                    }
                })
        }
    }

    render() {
        // console.log(this.state.banks)
        const disabled = this.state.payment.paymentId.length < 1 ||
            this.state.payment.paymentName.length < 1
        // console.log('disabled', disabled)
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">ธนาคาร</label>
                        <div className="control">
                            <div className="select">
                                <select name="bankId" onChange={this.onInputChange} required value={this.state.payment.bankId}>
                                    {this.state.banks.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
                                </select>
                            </div>
                        </div>
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">สาขา</label>
                        <div className="control">
                            <input className="input" type="text" name="bankBranch"
                                disabled={this.state.loading != ''}
                                value={this.state.payment.bankBranch} onChange={this.onInputChange} />

                        </div>
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">เลขที่บัญชี*</label>
                        <div className="control">
                            <input className="input" type="text" name="paymentId"
                                disabled={this.state.loading != ''}
                                value={this.state.payment.paymentId} onChange={this.onInputChange} required />

                        </div>
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ชื่อบัญชี*</label>
                        <div className="control">
                            <input className="input" type="text" name="paymentName"
                                disabled={this.state.loading != ''}
                                value={this.state.payment.paymentName} onChange={this.onInputChange} required />
                        </div>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">สถานะ</label>
                        <div className="control">
                            <div className="select">
                                <select className="input" name="payStatus" onChange={this.onInputChange}
                                    value={this.state.payment.payStatus}>
                                    <option value="OPEN">เปิดใช้งาน</option>
                                    <option value="CLOSE">ปิดใช้งาน</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field is-grouped" style={{ paddingTop: '30px' }}>
                        <div className="control">
                            <Link className="button" to="/payments">ยกเลิก</Link>
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
    payments: state.payments
});

const mapDispatchToProps = (dispatch) => ({
    startAddPayment: (payment) => dispatch(startAddPayment(payment))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
