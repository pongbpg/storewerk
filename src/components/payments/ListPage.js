import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import Selectors from '../../selectors/payments';
import { startGetPayments } from '../../actions/payments'
import { FaSearch } from 'react-icons/fa';
import { bankData } from '../../../data/banks';
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            payments: props.payments || [],
            isModal: false,
            payment: {},
            loading: '',
            banks: bankData
        }
        this.props.startGetPayments(props.auth.account.accountId)
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.payments) != JSON.stringify(this.state.payments)) {
            this.setState({ payments: nextProps.payments });
        }
    }
    onRemoveClick = (code, e) => {
        this.setState({ isModal: true, payment: this.state.payments.find(f => f.bankId == bankId && f.paymentId == paymentId) })
    }
    // onConfirmRemove = (e) => {
    //     this.setState({ loading: 'is-loading' })
    //     this.props.startRemoveAccountArray('payments', { accountId: this.state.auth.account.accountId, value: this.state.payment })
    //         .then(res => {
    //             this.setState({ loading: '', isModal: false })
    //         })
    // }
    render() {
        const columns = [
            {
                Header: '#',
                Cell: props => props.index + 1,
                className: 'has-text-centered striped',
                maxWidth: 60
            },
            {
                Header: 'ธนาคาร',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'bankId',
                Cell: (props) => {
                    return this.state.banks.find(f => f.id == props.value).name
                }
            },
            {
                Header: 'สาขา',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'bankBranch'
            },
            {
                Header: 'เลขที่',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'paymentId'
            },
            {
                Header: 'ชื่อบัญชี',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'paymentName'
            },
            {
                Header: 'สถานะ',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'payStatus'
            },
            {
                Header: 'จัดการ',
                headerClassName: 'has-text-centered',
                Cell: props => {
                    return (
                        <div className="field is-grouped is-grouped-centered">
                            <div className="control">
                                <Link className="button is-small" to={`/payments/edit/${props.original.bankId}/${props.original.paymentId}`}>แก้ไข</Link>
                            </div>
                            {/* <div className="control">
                                <button className="button is-small is-danger" onClick={(e) => this.onRemoveClick(props.original.paymentId, e)}>ลบ</button>
                            </div> */}
                        </div>
                    )
                }
            },
        ]
        return (
            <div className="box">
                <nav className="level">
                    <div className="level-left">
                        <Link className="button is-link is-rounded is-hovered" to="/payments/add">เพิ่ม</Link>
                    </div>
                    <div className="level-right">
                        <div className="field">
                            <p className="control is-expanded has-icons-left">
                                <input className="input" type="text" placeholder="ค้นหา"
                                    value={this.state.search}
                                    onChange={(e) => this.setState({ search: e.target.value })} />
                                <span className="icon is-small is-left">
                                    <FaSearch />
                                </span>
                            </p>
                        </div>
                    </div>
                </nav>
                <ReactTable className="table -highlight"
                    data={Selectors(this.state.payments, this.state.search)}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={10}
                // defaultSorted={[
                //     {
                //         id: "category.code",
                //     },
                //     {
                //         id: "code",
                //     }
                // ]}
                />
                <div className={`modal  is-danger ${this.state.isModal && 'is-active'}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title has-text-danger">ลบคลังสินค้า</p>
                            <button className="delete" aria-label="close" onClick={(e) => this.setState({ isModal: false })}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="message is-danger">
                                <div className="message-body">
                                    ต้องการลบ <strong>{this.state.payment.paymentId}</strong> ({this.state.payment.paymentName})
                                </div>
                            </div>
                            {/* <p className="has-background-danger"></p> */}
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button" onClick={(e) => this.setState({ isModal: false })}>ยกเลิก</button>
                            <button className={`button is-danger ${this.state.loading}`} onClick={this.onConfirmRemove}>ลบ</button>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    payments: state.payments
});

const mapDispatchToProps = (dispatch) => ({
    startGetPayments: (accountId) => dispatch(startGetPayments(accountId))
    // startRemoveAccountArray: (key, account) => dispatch(startRemoveAccountArray(key, account))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
