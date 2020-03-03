import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { startGetOrders, startDeleteOrder } from '../../actions/orders'
import ReactTable from 'react-table-v6'
import { FaSearch } from 'react-icons/fa';
import NumberFormat from 'react-number-format'
import 'react-table-v6/react-table.css'
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            orders: props.orders
        }
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        } else {
            this.props.startGetOrders(props.auth.account.accountId, props.auth.email);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.orders != this.state.orders) {
            this.setState({ orders: nextProps.orders });
        }
    }
    onDeleteClick = (orderId) => {
        // console.log(orderId)
        this.props.startDeleteOrder(orderId)

    }
    render() {
        const columns = [
            {
                Header: '#',
                Cell: props => props.index + 1,
                className: 'has-text-centered striped',
                maxWidth: 50
            },
            {
                Header: 'วันที่',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'orderDate',
                maxWidth: 120,
                Cell: props => moment(props.value).format('D/M/YY')
            },
            {
                Header: 'ประเภท',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'orderTypeId',
                maxWidth: 80
            },
            {
                Header: 'ชื่อ',
                headerClassName: 'has-text-left',
                maxWidth: 400,
                Cell: (props, value) => {
                    if (props.original.orderTypeId == 'IN')
                        return props.original.supplierName
                    else
                        return props.original.customerName
                }
            },
            {
                Header: 'จำนวนสินค้า',
                headerClassName: 'has-text-right',
                className: 'has-text-right',
                accessor: 'quantity',
                maxWidth: 100,
                Cell: props => {
                    return (
                        <NumberFormat
                            displayType="text"
                            thousandSeparator={true}
                            decimalScale={2}
                            value={props.value}
                        />
                    )
                }
            },
            {
                Header: 'จำนวนเงิน',
                headerClassName: 'has-text-right',
                className: 'has-text-right',
                accessor: 'netTotal',
                maxWidth: 100,
                Cell: props => {
                    return (
                        <NumberFormat
                            displayType="text"
                            thousandSeparator={true}
                            decimalScale={2}
                            value={props.value}
                        />
                    )
                }
            },
            {
                Header: 'สถานะ',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'isCancel',
                maxWidth: 100,
                Cell: props => {
                    const colors = [{ status: 'N', color: 'success', text: 'ปกติ' }, { status: 'Y', color: 'danger', text: 'ยกเลิก' }]
                    const value = colors.find(f => f.status == props.value);
                    return (
                        <span className={`tag is-${value.color}`}>
                            {value.text}
                        </span>
                    )
                }
            },
            {
                Header: 'จัดการ',
                headerClassName: 'has-text-centered',
                maxWidth: 100,
                Cell: props => {
                    // console.log(props.original.id, '=', this.state.auth.account, props.original.id == this.state.auth.account)
                    return (
                        <div className="field is-grouped-centered">
                            <div className="control">
                                {props.original.isStatus == 'SALE' &&
                                    <button className="button is-danger is-small" onClick={(e) => this.onDeleteClick(props.original.orderId, e)}>ลบ</button>
                                }
                                <a className="button is-small"
                                    href={`http://rpt.storewerk.me/invoice?orderId=${props.original.orderId}`} target="_blank">
                                    ใบกำกับภาษี
                                </a>
                                {/* <Link className="button is-small" to={`/orders/out/stock/edit/${props.original.orderId}`}>แก้ไข</Link> */}
                            </div>
                        </div >
                    )
                }
            },
        ]
        return (
            <div className="box">
                <nav className="level">
                    <div className="level-left">
                        <Link className="button is-link is-rounded is-hovered" to="/orders/in/stock">นำเข้า</Link>
                        <Link className="button is-warning is-rounded is-hovered" to="/orders/out/stock">จ่ายออก</Link>
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
                    data={this.state.orders}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={10}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    orders: state.orders
});

const mapDispatchToProps = (dispatch) => ({
    startGetOrders: (accountId, userId) => dispatch(startGetOrders(accountId, userId)),
    startDeleteOrder: (orderId) => dispatch(startDeleteOrder(orderId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
