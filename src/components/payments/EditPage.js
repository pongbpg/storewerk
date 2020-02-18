import React from 'react';
import { connect } from 'react-redux';
import { startUpdatePayment } from '../../actions/payments';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import _ from 'underscore';
export class EditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            payment: props.payments.find(f => f.paymentId == props.match.params.code) ||
                { paymentId: '', paymentName: '' },
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
            payment: {
                ...this.state.payment,
                [key]: value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.payment)
        this.setState({ loading: 'is-loading' })
        this.props.startUpdatePayment({
            accountId: this.state.auth.account.accountId,
            ..._.pick(this.state.payment, 'paymentId', 'paymentName'),
            updater: this.state.auth.email
        })
            .then(res => {
                this.setState({
                    loading: ''
                })
                if (res.error == false) {
                    history.push('/payments')
                }
            })
    }

    render() {
        const disabled = this.state.payment.paymentId.length < 1 ||
            this.state.payment.paymentName.length < 1
        // console.log('disabled', disabled)
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">รหัสคลัง</label>
                        <div className="control">
                            <input className="input" type="text" name="paymentId"
                                disabled={this.state.loading != ''}
                                value={this.state.payment.paymentId} onChange={this.onInputChange} disabled />

                        </div>
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ชื่อคลัง</label>
                        <div className="control">
                            <input className="input" type="text" name="paymentName"
                                disabled={this.state.loading != ''}
                                value={this.state.payment.paymentName} onChange={this.onInputChange} required />
                        </div>
                    </div>
                    {/* <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ที่อยู่คลัง</label>
                        <div className="control">
                            <input className="input" type="text" name="addr"
                                disabled={this.state.loading != ''}
                                value={this.state.payment.addr} onChange={this.onInputChange} required />
                        </div>
                    </div> */}
                    <div className="field is-grouped" style={{ paddingTop: '30px' }}>
                        <div className="control">
                            <Link className="button" to="/payments">ยกเลิก</Link>
                        </div>
                        <div className="control">
                            <button className={`button is-link ${this.state.loading}`}
                                disabled={disabled}
                                type="submit">
                                บันทึก
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
    startUpdatePayment: (payment) => dispatch(startUpdatePayment(payment))
});
export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
