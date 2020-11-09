import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import NumberFormat from 'react-number-format';
import { startGetInventories } from '../../actions/inventories';
import { FaSearch } from 'react-icons/fa'
import { FiPercent } from 'react-icons/fi'
import { TiRefresh } from 'react-icons/ti'
import { getMembersByTel } from '../../api/members'
import { getOrderNoLatest } from '../../api/orders';
import { startAddOrder } from '../../actions/orders';
import taxIdValidator from '../../selectors/taxIdValidator';
import _ from 'underscore';
import moment from 'moment';
import Select from 'react-select';

export class OutStockPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            order: {
                orderDate: moment(),
                orderNo: '',
                orderTypeId: 'OUT',
                customerId: '',
                customerName: '',
                customerAddr: '',
                customerTel: '',
                warehouseId: '',
                quantity: 0,
                subTotal: 0,
                shipping: 0,
                total: 0,
                discount: 0,
                vatPercent: 0,
                vatPrice: 0,
                netTotal: 0,
                isStatus: 'SALE'
            },
            loading: '',
            loadingTel: '',
            customers: [],
            disableMember: true,
            errors: { customerId: '', submit: '' },
            products: [],
            warehouses: _.chain(props.inventories)
                .groupBy('warehouseId')
                .map((wh, id) => {
                    return {
                        warehouseId: id,
                        warehouseName: wh[0].warehouseName
                    }
                }).value(),
            orderDetail: [],
            includeVat: false
        }
        this.props.startGetInventories(props.auth.account.accountId, moment().format('YYYY-MM-DD'))
        this.getOrderNoLatest = getOrderNoLatest;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.inventories) != JSON.stringify(this.state.inventories)) {
            this.setState({
                inventories: nextProps.inventories,
                warehouses: _.chain(nextProps.inventories)
                    .groupBy('warehouseId')
                    .map((wh, id) => {
                        return {
                            warehouseId: id,
                            warehouseName: wh[0].warehouseName
                        }
                    }).value()
            });
        }
    }

    onTelBlur = (e) => {
        // const name = e.target.name;
        const customerTel = e.target.value;
        this.setState({
            loadingTel: 'is-loading',
            order: {
                ...this.state.order,
                customerTel
            }
        })
        if (customerTel != '') {
            getMembersByTel(customerTel, this.state.auth.account.accountId, 'OUT')
                .then(row => {
                    const customers = row.data[0];
                    // console.log(customers)
                    if (customers.length == 1) {
                        this.setState({
                            order: {
                                ...this.state.order,
                                customerId: customers[0].memberId,
                                customerName: customers[0].memberName,
                                customerAddr: customers[0].memberAddr
                            }
                        })
                    } else if (customers.length > 1) {
                        this.setState({ customers })
                    }
                    // this.taxInput.focus();
                    this.setState({ disableMember: false, loadingTel: '' })
                })
        } else {
            this.setState({ disableMember: true, loadingTel: '' })
        }
    }
    onSelectProductChange = orderDetail => {
        this.setState({ orderDetail }, this.autoCalculator);
    };
    onSelectWarehouseChange = (warehouse) => {
        this.setState({
            order: {
                ...this.state.order,
                ..._.pick(warehouse, 'warehouseId', 'warehouseName')
            },
            products: this.state.inventories.filter(f => f.warehouseId == warehouse.warehouseId && f.quantity1 > 0),
            orderDetail: []
        }, this.autoCalculator);
    };
    onGetOrderNo = () => {
        this.getOrderNoLatest(this.state.auth.account.accountId, moment(this.state.order.orderDate).format('YYYY-MM-DD'))
            .then(orderNo => {
                this.setState({
                    order: {
                        ...this.state.order,
                        orderNo: orderNo.data[0].orderNo
                    }
                })
            })
    }
    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;//.toUpperCase();
        this.setState({
            order: {
                ...this.state.order,
                [key]: value// key == 'username' ? value.toLowerCase() : value
            }
        })
    }
    onIncludeVatChange = (e) => {
        this.autoCalculator(true)
    }
    autoCalculator = (includeVat = false) => {
        const quantity = _.reduce(_.pluck(this.state.orderDetail, 'quantity'), (x, y) => x + y, 0);
        const subTotal = _.reduce(_.pluck(this.state.orderDetail, 'totalPrice'), (x, y) => x + y, 0);
        let discount = 0, shipping = 0;
        let total = this.state.order.total;


        if (total < subTotal) {
            discount = subTotal - total
        } else if (total > subTotal) {
            shipping = total - subTotal
        }

        let vatPrice = (total * this.state.order.vatPercent || 0) / 100;
        let netTotal = total + vatPrice;
        if (includeVat) {
            netTotal = total;
            total = (total / ((this.state.order.vatPercent + 100) || 0)) * 100;
            vatPrice = (total * (this.state.order.vatPercent || 0)) / 100;
        }

        this.setState({
            order: {
                ...this.state.order,
                quantity,
                subTotal,
                discount,
                shipping,
                vatPrice,
                netTotal,
                total
            }
        })
    }
    onOrderSave = () => {
        const orderId = moment(this.state.order.orderDate).format('YYYYMMDD') + '-' + moment().valueOf() + '-' + this.state.auth.account.accountId;
        const accountId = this.state.auth.account.accountId;
        const creator = this.state.auth.email;
        if (this.state.orderDetail.length > 0) {
            const data = JSON.stringify({
                order: {
                    ...this.state.order,
                    orderId,
                    accountId,
                    creator,
                    orderDate: moment(this.state.order.orderDate).format('YYYY-MM-DD'),
                    supplierId: this.state.auth.account.accountId,
                    supplierName: this.state.auth.account.accountName,
                    supplierTel: this.state.auth.account.accountTel,
                    supplierAddr: this.state.auth.account.accountAddr
                },
                orderDetail: this.state.orderDetail.map(m => {
                    return {
                        ...m,
                        orderId,
                        accountId,
                        creator,
                        quantity: -Math.abs(m.quantity),
                        quantity2: m.quantity1 - m.quantity
                    }
                })
            })
            // console.log(data)
            if (this.state.order.vatPrice > 0 && this.state.order.orderNo == '') {
                alert('กรุณาใส่เลขที่ใบกำกับภาษี');
                this.orderNoInput.focus();
            } else {
                // alert('ok')
                if (confirm('ตรวจสอบ และยืนยันที่จะบันทึกข้อมูล?')) {
                    this.setState({ loading: 'is-loading' })
                    this.props.startAddOrder(data)
                        .then(res => {
                            this.setState({
                                loading: ''
                            })
                            if (res.error == false) {
                                history.push('/orders')
                            } else {
                                this.setState({
                                    error: {
                                        ...this.state.errors,
                                        submit: res.messages
                                    }
                                })
                            }
                        })
                }
            }
        } else {
            alert('กรุณาเลือกสินค้า')
        }
    }
    render() {
        return (
            <div className="container">
                <nav className="level">
                    <div className="level-left">
                        <div className="column">
                            <div className="field">
                                <label className="label">วันที่</label>
                                <div className="control">
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.order.orderDate}
                                        onChange={(orderDate) => this.setState({
                                            order: { ...this.state.order, orderDate }
                                        }
                                            , () => this.props.startGetInventories(this.state.auth.account.accountId, moment(orderDate).format('YYYY-MM-DD')))}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="level-right">
                        {this.state.order.vatPrice > 0 && <div className="column">
                            <div className="field  has-addons">
                                <div className="control">
                                    <input type="text" className="input" name="orderNo"
                                        placeholder="เลขที่ใบกำกับภาษี"
                                        value={this.state.order.orderNo}
                                        ref={(input) => { this.orderNoInput = input; }}
                                        onChange={this.onInputChange} />
                                </div>
                                <div className="control">
                                    <a className="button is-info"
                                        onClick={this.onGetOrderNo}>ล่าสุด</a>
                                </div>
                            </div>
                        </div>}
                    </div>
                </nav>
                <div className="columns">
                    <div className="column is-4">
                        <div className="panel">
                            <p className="panel-heading">ข้อมูลผู้ขาย</p>
                            <div className="panel-block">
                                <div className="control">
                                    <div className="field">
                                        <label className="label">เบอร์โทร</label>
                                        <p className={`control has-icons-left is-expanded ${this.state.loadingTel}`}>
                                            <NumberFormat className="input"
                                                value={this.state.order.customerTel}
                                                allowLeadingZeros={true}
                                                required
                                                disabled={this.state.loading != ''}
                                                onBlur={this.onTelBlur}
                                                onValueChange={(values) => {
                                                    const { formattedValue, value, floatValue } = values;
                                                    this.setState({ order: { ...this.state.order, customerTel: value } })
                                                }} />
                                            <span className="icon is-medium is-left">
                                                <FaSearch />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-block">
                                <div className="control">
                                    <div className="field">
                                        <label className="label">Tax ID</label>
                                        <p className="control is-expanded">
                                            <NumberFormat className="input"
                                                value={this.state.order.customerId}
                                                isNumericString={true}
                                                format="#-####-#####-##-#"
                                                mask="_"
                                                disabled={this.state.disableMember}
                                                ref={(input) => { this.taxInput = input; }}
                                                onValueChange={(values) => {
                                                    const { formattedValue, value, floatValue } = values;
                                                    if (value.length == 13) {
                                                        this.setState({
                                                            errors: {
                                                                ...this.state.errors,
                                                                customerId: taxIdValidator(value) ? '' : 'เลขผู้เสียภาษีไม่ถูกต้อง'
                                                            }
                                                        });
                                                    } else {
                                                        this.setState({
                                                            errors: {
                                                                ...this.state.errors,
                                                                customerId: 'เลขผู้เสียภาษีต้องมี 13 หลัก!'
                                                            }
                                                        });
                                                    }
                                                    this.setState({ order: { ...this.state.order, customerId: value } })
                                                }} />
                                        </p>
                                        <p className="help has-text-danger">{this.state.errors.customerId}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-block">
                                <div className="control">
                                    <div className="field">
                                        <label className="label">ชื่อ</label>
                                        <p className="control is-expanded">
                                            <input className="input" type="text" name="customerName"
                                                disabled={this.state.disableMember}
                                                value={this.state.order.customerName} onChange={this.onInputChange} required />

                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-block">
                                <div className="control">
                                    <div className="field">
                                        <label className="label">ที่อยู่</label>
                                        <div className="control">
                                            <textarea className="textarea" name="customerAddr" style={{ height: '220px' }}
                                                disabled={this.state.disableMember}
                                                value={this.state.order.customerAddr} onChange={this.onInputChange} required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="column is-8">
                        <div className="columns">
                            <div className="column is-4">
                                <div className="panel">
                                    <p className="panel-heading">คลังสินค้า</p>

                                    {/* <a href="#" className="card-header-icon" aria-label="more options"
                                            onClick={() => this.props.startGetInventories(
                                                this.state.auth.account.accountId,
                                                moment(this.state.order.orderDate).format('YYYY-MM-DD'))
                                            }>
                                            <span className="icon">
                                                <TiRefresh aria-hidden="true" />
                                            </span>
                                        </a> */}
                                    <div className="panel-block">
                                        <div className="control has-icons-left">
                                            <Select
                                                onChange={this.onSelectWarehouseChange}
                                                options={this.state.warehouses}
                                                getOptionValue={(option => option.warehouseId)}
                                                getOptionLabel={(option => option.warehouseName)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-8">
                                <div className="panel">
                                    <p className="panel-heading">สินค้า</p>
                                    <div className="panel-block">
                                        <div className="control has-icons-left">
                                            <Select
                                                isMulti
                                                value={this.state.orderDetail}
                                                onChange={this.onSelectProductChange}
                                                options={this.state.products.map(p => {
                                                    // console.log(p)
                                                    return {
                                                        ..._.omit(p, 'productImg', 'warehouseId', 'warehouseName', 'created', 'updated', 'creator', 'updater'),
                                                        quantity: 0,
                                                        unitPrice: 0,
                                                        totalPrice: 0
                                                    }
                                                })}
                                                getOptionValue={(option => option.productId)}
                                                getOptionLabel={(option => option.productName + ' (' + option.productId + ')')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel">
                            <p className="panel-heading">รายการสินค้า</p>
                            <div className="panel-block">
                                <div className="control">
                                    <table className="table is-fullwidth">
                                        <thead>
                                            <tr>
                                                <td>#</td>
                                                <td>สินค้า</td>
                                                <td className="has-text-right">จำนวน</td>
                                                <td className="has-text-right">คงเหลือ</td>
                                                <td className="has-text-right">ราคา</td>
                                                <td className="has-text-right">รวม</td>
                                                {/* <td></td> */}
                                            </tr>
                                        </thead>
                                        {this.state.orderDetail != null && <tbody>
                                            {this.state.orderDetail.map((p, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{p.productName + ` (${p.productId})`}</td>
                                                        <td>
                                                            <NumberFormat className="input has-text-right"
                                                                thousandSeparator={true}
                                                                value={p.quantity}
                                                                onValueChange={(values) => {
                                                                    const { formattedValue, value, floatValue } = values;
                                                                    this.setState({
                                                                        orderDetail: this.state.orderDetail.map(m => {
                                                                            const quantity = floatValue > p.quantity1 ? p.quantity1 : floatValue;
                                                                            if (m.productId == p.productId) {
                                                                                return {
                                                                                    ...p,
                                                                                    quantity,
                                                                                    totalPrice: (quantity * p.productPrice) || 0
                                                                                }
                                                                            } else {
                                                                                return m
                                                                            }
                                                                        })
                                                                    }, this.autoCalculator)
                                                                }} />
                                                        </td>
                                                        <td className="has-text-right">
                                                            <NumberFormat
                                                                displayType="text"
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                value={p.quantity1}
                                                            />
                                                        </td>
                                                        <td className="has-text-right">
                                                            <NumberFormat
                                                                displayType="text"
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                value={p.productPrice}
                                                            />
                                                        </td>
                                                        <td className="has-text-right">
                                                            <NumberFormat
                                                                displayType="text"
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                value={p.totalPrice}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td colSpan={2} className="has-text-right">รวม</td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        displayType="text"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        value={this.state.order.quantity}
                                                    />
                                                </td>
                                                <td className="has-text-right" colSpan={2}></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        displayType="text"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        value={this.state.order.subTotal}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="has-text-right">ค่าขนส่ง</td>
                                                <td className="has-text-right" colSpan={3}></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        displayType="text"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        value={this.state.order.shipping}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="has-text-right">ส่วนลด</td>
                                                <td className="has-text-right" colSpan={3}></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        displayType="text"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        value={this.state.order.discount}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="has-text-right">รวมทั้งหมด</td>
                                                <td className="has-text-right" colSpan={3}></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        className="input has-text-right"
                                                        decimalScale={2}
                                                        value={this.state.order.total}
                                                        onValueChange={(values) => {
                                                            const { formattedValue, value, floatValue } = values;
                                                            if (!this.state.includeVat) {
                                                                this.setState({
                                                                    order: {
                                                                        ...this.state.order,
                                                                        total: floatValue
                                                                    }
                                                                }, this.autoCalculator)
                                                            } else {
                                                                this.setState({
                                                                    order: {
                                                                        ...this.state.order,
                                                                        total: floatValue
                                                                    },
                                                                    includeVat: false
                                                                })
                                                            }
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            {(taxIdValidator(this.state.order.customerId)
                                                || this.state.order.customerId == '0000000000000') && <tr>
                                                    <td colSpan={2} className="has-text-right">ภาษี</td>
                                                    <td className="has-text-right">
                                                        <div className="control has-icons-right">
                                                            <NumberFormat
                                                                className="input has-text-right"
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                value={this.state.order.vatPercent}
                                                                onValueChange={(values) => {
                                                                    const { formattedValue, value, floatValue } = values;
                                                                    this.setState({
                                                                        order: {
                                                                            ...this.state.order,
                                                                            vatPercent: floatValue
                                                                        }
                                                                    }, this.autoCalculator)
                                                                }}
                                                            />
                                                            <span className="icon is-small is-right">
                                                                <FiPercent className="is-small" />
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="has-text-right" colSpan={2}></td>
                                                    <td className="has-text-right">
                                                        <NumberFormat
                                                            thousandSeparator={true}
                                                            displayType="text"
                                                            decimalScale={2}
                                                            value={this.state.order.vatPrice}
                                                        />
                                                    </td>
                                                </tr>}
                                            {(taxIdValidator(this.state.order.customerId)
                                                || this.state.order.customerId == '0000000000000') && <tr>
                                                    <td colSpan={2} className="has-text-right">รวมสุทธิ</td>
                                                    <td className="has-text-left">
                                                        <label className="checkbox">
                                                            <button className="button"
                                                                onClick={this.onIncludeVatChange}>
                                                                ราคารวมภาษี
                                                            </button>
                                                        </label>
                                                    </td>
                                                    <td className="has-text-right" colSpan={2}></td>
                                                    <td className="has-text-right">
                                                        <NumberFormat
                                                            thousandSeparator={true}
                                                            displayType="text"
                                                            decimalScale={2}
                                                            value={this.state.order.netTotal}
                                                        />
                                                    </td>
                                                </tr>}
                                        </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                            <div className="panel-tabs" style={{ padding: '20px' }}>
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button className={`button is-link ${this.state.loading}`}
                                            disabled={
                                                this.state.order.customerTel == '' ||
                                                this.state.order.customerName == '' ||
                                                this.state.order.customerAddr == '' ||
                                                this.state.order.warehouseId == '' ||
                                                this.state.orderDetail == null
                                            }
                                            onClick={this.onOrderSave}
                                        >บันทึก</button>
                                    </div>
                                    <div className="control">
                                        <Link className="button" to="/orders">ยกเลิก</Link>
                                    </div>
                                </div>
                                <p className="help has-text-danger">{this.state.errors.submit}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.customers.length > 0 && <div className="modal is-active">
                        <div className="modal-background"></div>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">รายชื่อ</p>
                                <button className="delete" aria-label="close" onClick={(e) => this.setState({ customers: [] })}></button>
                            </header>
                            <section className="modal-card-body">
                                <div className="message">
                                    <div className="message-body">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>เลขที่</th>
                                                    <th>ชื่อ</th>
                                                    <th>ที่อยู่</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.customers.map((sup, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{sup.memberId}</td>
                                                            <td>{sup.memberName}</td>
                                                            <td>{sup.memberAddr}</td>
                                                            <td>
                                                                <button onClick={
                                                                    () => this.setState({
                                                                        order: {
                                                                            ...this.state.order,
                                                                            customerId: sup.memberId,
                                                                            customerName: sup.memberName,
                                                                            customerAddr: sup.memberAddr
                                                                        },
                                                                        customers: []
                                                                    })
                                                                } className="button">เลือก</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                }
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    inventories: state.inventories
});

const mapDispatchToProps = (dispatch) => ({
    startGetInventories: (accountId, orderDate) => dispatch(startGetInventories(accountId, orderDate)),
    startAddOrder: (order) => dispatch(startAddOrder(order))
});
export default connect(mapStateToProps, mapDispatchToProps)(OutStockPage);
