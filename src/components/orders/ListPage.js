import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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
            orders: props.orders,
            selected: {},
            selectAll: 0
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
    onSelectChange = (orderId, e) => {
        const newSelected = Object.assign({}, this.state.selected)
        newSelected[orderId] = e.target.checked
        this.setState({
            selected: newSelected
        });
    }
    onRowSelect = (orderId) => {
        const newSelected = Object.assign({}, this.state.selected)
        newSelected[orderId] = !newSelected[orderId];
        this.setState({
            selected: newSelected
        });
    }

    render() {

        const columns = [
            {
                Header: '',
                accessor: 'orderId',
                Cell: props => {
                    // console.log(props.original.orderId, props.value)
                    return (
                        <input type="checkbox" checked={this.state.selected[props.value] == true}
                            onChange={e => this.onSelectChange(props.value, e)} />
                    )
                },
                className: 'has-text-centered striped',
                maxWidth: 50
            },
            {
                Header: 'วันที่สั่งซื้อ',
                accessor: 'orderDate',
                Cell: props => moment(props.value).format('D/M/YY'),
                className: 'has-text-centered striped',
                maxWidth: 80
            },
            {
                Header: 'เลขที่',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'orderNo',
                maxWidth: 140,
                // Cell: props => moment(props.value).format('D/M/YY H:mm:ss')
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
                        <div>
                            <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                decimalScale={2}
                                value={props.value}
                            />
                        </div>

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
                accessor: 'isStatus',
                maxWidth: 100,
                Cell: props => {
                    const isCancel = props.original.isCancel;
                    const colors = [{ status: 'N', color: 'success', text: 'ปกติ' }, { status: 'Y', color: 'danger', text: 'ยกเลิก' }]
                    const value = colors.find(f => f.status == isCancel);
                    return (
                        <span className={`tag is-${value.color}`}>
                            {props.value}
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
                                {/* {props.original.isStatus == 'SALE' && */}
                                <button className="button is-danger is-small" onClick={(e) => this.onDeleteClick(props.original.orderId, e)}>ลบ</button>

                                <a className="button is-small"
                                    href={`http://rpt.storewerk.me/invoice?o=${btoa(props.original.orderId)}`} target="_blank">
                                    ใบกำกับภาษี
                                </a>
                                {/* <Link className="button is-small" to={`/orders/out/edit/${props.original.orderId}`}>แก้ไข</Link> */}
                            </div>
                        </div >
                    )
                }
            },
        ]

        const countSelected = Object.keys(this.state.selected).map(m => ({ selected: this.state.selected[m] })).filter(f => f.selected == true).length;
        return (
            <div className="box">
                <nav className="level">
                    <div className="level-left">
                        {this.state.auth.role != 'ADMIN' &&
                            <div className="level-item">
                                <Link className="button is-link is-rounded is-hovered" to="/orders/in">สั่งซื้อ</Link>
                            </div>
                        }
                        {this.state.auth.role != 'STOCK' &&
                            <div className="level-item">
                                <Link className="button is-warning is-rounded is-hovered" to="/orders/out">จำหน่าย</Link>
                            </div>
                        }

                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="field">
                                <button className="button" onClick={e => {
                                    let orders = [];
                                    Object.keys(this.state.selected).map(key => {
                                        if (this.state.selected[key]) orders.push(key)
                                    })
                                    const a = btoa('id=' + encodeURIComponent(orders));
                                    const b = atob(a);
                                    console.log(a)
                                    console.log(b)
                                    window.open('/print/request?' + a, 'Data', 'height=600,width=800');
                                }}>Print ({countSelected})</button>
                            </div>
                        </div>
                        <div className="level-item">
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
                    </div>
                </nav>
                <ReactTable className="table -highlight -striped" style={{ cursor: 'pointer' }}
                    data={this.state.orders}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={30}
                    getTrProps={(state, rowInfo, column) => {
                        return {
                            onClick: (e) => {
                                this.onRowSelect(rowInfo.original.orderId)
                            }
                            // this.props.history.push("/order/" + rowInfo.original.orderTypeId.toLowerCase() + "/stock/" + rowInfo.original.orderId)
                        }
                    }}
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
