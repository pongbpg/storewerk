import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import NumberFormat from 'react-number-format';
import { startGetProducts } from '../../actions/products';
import { startGetWarehouses } from '../../actions/warehouses';
import { FaSearch } from 'react-icons/fa'
import { FiPercent } from 'react-icons/fi'
import { getMembersByTel } from '../../api/members'
import { startAddOrder } from '../../actions/orders';
import taxIdValidator from '../../selectors/taxIdValidator';
import _ from 'underscore';
import moment from 'moment';
import Select from 'react-select';
// import WebSocket from 'ws'
// const client = new WebSocket('wss://localhost:3001');
export class InStockPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            order: {
                orderDate: moment(),
                orderNo: '',
                orderTypeId: 'IN',
                supplierId: '',
                supplierName: '',
                supplierAddr: '',
                supplierTel: '',
                warehouseId: '',
                quantity: 0,
                subTotal: 0,
                shipping: 0,
                total: 0,
                discount: 0,
                vatPercent: 0,
                vatPrice: 0,
                netTotal: 0,
                isStatus: 'REQUESTED'
            },
            // objects: [{ type: 'IN', value: 'BUY', text: 'ซื้อ' }, { type: 'IN', value: 'CLAIM', text: 'เคลม' }],
            loading: '',
            loadingTel: '',
            suppliers: [],
            disableMember: true,
            errors: { supplierId: '' },
            products: props.products,
            warehouses: props.warehouses,
            orderDetail: []
        }
        this.props.startGetProducts(props.auth.account.accountId)
        this.props.startGetWarehouses(props.auth.account.accountId)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.products) != JSON.stringify(this.state.products)) {
            this.setState({ products: nextProps.products });
        }
        if (JSON.stringify(nextProps.warehouses) != JSON.stringify(this.state.warehouses)) {
            this.setState({ warehouses: nextProps.warehouses });
        }
    }
    onTelBlur = (e) => {
        // const name = e.target.name;
        const supplierTel = e.target.value;
        this.setState({
            loadingTel: 'is-loading',
            order: {
                ...this.state.order,
                supplierTel
            }
        })
        if (supplierTel != '') {
            getMembersByTel(supplierTel, this.state.auth.account.accountId, 'IN')
                .then(row => {
                    const suppliers = row.data[0];
                    if (suppliers.length == 1) {
                        this.setState({
                            order: {
                                ...this.state.order,
                                supplierId: suppliers[0].memberId,
                                supplierName: suppliers[0].memberName,
                                supplierAddr: suppliers[0].memberAddr
                            }
                        })
                    } else if (suppliers.length > 1) {
                        this.setState({ suppliers })
                    }
                    // this.taxInput.focus();
                    this.setState({ disableMember: false, loadingTel: '' })
                })
        } else {
            this.setState({ disableMember: true, loadingTel: '' })
        }
    }
    onSelectProductChange = orderDetail => {
        this.setState(
            { orderDetail },
            // () => console.log(`Option selected:`, this.state.orderDetail)
        );
    };
    onSelectWarehouseChange = (warehouse) => {
        this.setState({
            order: {
                ...this.state.order,
                ..._.pick(warehouse, 'warehouseId', 'warehouseName')
            }
        });
    };
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
    autoCalculator = () => {
        const quantity = _.reduce(_.pluck(this.state.orderDetail, 'quantity'), (x, y) => x + y, 0);
        const subTotal = _.reduce(_.pluck(this.state.orderDetail, 'totalPrice'), (x, y) => x + y, 0);
        const total = subTotal + this.state.order.shipping - this.state.order.discount;
        const vatPrice = (total * this.state.order.vatPercent || 0) / 100;
        const netTotal = total + vatPrice
        // console.log('vat', vat)
        this.setState({
            order: {
                ...this.state.order,
                quantity,
                subTotal,
                total,
                vatPrice,
                netTotal
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
                    customerId: this.state.auth.account.accountId,
                    customerName: this.state.auth.account.accountName,
                    customerTel: this.state.auth.account.accountTel,
                    customerAddr: this.state.auth.account.accountAddr
                },
                orderDetail: this.state.orderDetail.map(m => {
                    return {
                        ...m,
                        // productImg: m.productImg == null ? '' : m.productImg,
                        orderId,
                        accountId,
                        creator
                    }
                })
            })
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
                            error: res.messages
                        })
                    }
                })
        } else {
            alert('กรุณาเลือกสินค้า')
        }
    }
    render() {
        return (
            <div className="container">
                <nav className="level">
                    <div className="level-left">
                    </div>
                    <div className="level-right">
                        <div className="field-label is-normal">
                            <label className="label">วันที่</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <DatePicker
                                    className="input has-text-centered"
                                    dateFormat="DD/MM/YYYY"
                                    placeholderText="เลือกวันที่"
                                    selected={this.state.order.orderDate}
                                    onChange={(orderDate) => this.setState({ order: { ...this.state.order, orderDate } })}
                                />
                            </div>
                            <div className="field">
                                <input className="input" type="text" name="orderNo" placeholder="เลขที่ใบกำกับ (ถ้ามี)"
                                    value={this.state.order.orderNo} onChange={this.onInputChange} />
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="columns">
                    <div className="column is-4">
                        <div className="panel">
                            <p className="panel-heading">ข้อมูลลูกค้า</p>
                            <div className="panel-block">
                                <div className="control">
                                    <label className="label">เบอร์โทร</label>
                                    <p className={`control has-icons-left is-expanded ${this.state.loadingTel}`}>
                                        <NumberFormat className="input"
                                            value={this.state.order.supplierTel}
                                            allowLeadingZeros={true}
                                            required
                                            disabled={this.state.loading != ''}
                                            onBlur={this.onTelBlur}
                                            onValueChange={(values) => {
                                                const { formattedValue, value, floatValue } = values;
                                                this.setState({ order: { ...this.state.order, supplierTel: value } })
                                            }} />
                                        <span className="icon is-medium is-left">
                                            <FaSearch />
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="panel-block">
                                <div className="control">
                                    <label className="label">Tax ID</label>
                                    <p className="control is-expanded">
                                        <NumberFormat className="input"
                                            value={this.state.order.supplierId}
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
                                                            supplierId: taxIdValidator(value) ? '' : 'เลขผู้เสียภาษีไม่ถูกต้อง'
                                                        }
                                                    });
                                                } else {
                                                    this.setState({
                                                        errors: {
                                                            ...this.state.errors,
                                                            supplierId: 'เลขผู้เสียภาษีต้องมี 13 หลัก!'
                                                        }
                                                    });
                                                }
                                                this.setState({ order: { ...this.state.order, supplierId: value } })
                                            }} />
                                    </p>
                                    <p className="help has-text-danger">{this.state.errors.supplierId}</p>
                                </div>
                            </div>
                            <div className="panel-block">
                                <div className="control">
                                    <label className="label">ชื่อ</label>
                                    <p className="control is-expanded">
                                        <input className="input" type="text" name="supplierName"
                                            disabled={this.state.disableMember}
                                            value={this.state.order.supplierName} onChange={this.onInputChange} required />

                                    </p>
                                </div>
                            </div>
                            <div className="panel-block">
                                <div className="control">
                                    <label className="label">ที่อยู่</label>
                                    <div className="control">
                                        <textarea className="textarea" name="supplierAddr"
                                            disabled={this.state.disableMember} style={{ height: '220px' }}
                                            value={this.state.order.supplierAddr} onChange={this.onInputChange} required
                                        ></textarea>
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
                                                onChange={this.onSelectProductChange}
                                                options={this.state.products.map(p => {
                                                    return {
                                                        ..._.omit(p, 'created', 'updated', 'creator', 'updater'),
                                                        quantity: 0,
                                                        unitPrice: 0,
                                                        totalPrice: 0
                                                    }
                                                })}
                                                getOptionValue={(option => option.productId)}
                                                getOptionLabel={(option => option.productName + ' (' + option.categoryId + '/' + option.productId + ')')}
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
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <td>#</td>
                                                <td>สินค้า</td>
                                                <td className="has-text-right">จำนวน</td>
                                                <td className="has-text-right">ราคาต่อหน่วย</td>
                                                <td className="has-text-right">รวม</td>
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
                                                                            if (m.productId == p.productId) {
                                                                                return {
                                                                                    ...p,
                                                                                    quantity: floatValue,
                                                                                    totalPrice: ((floatValue) * p.unitPrice) || 0
                                                                                }
                                                                            } else {
                                                                                return m
                                                                            }
                                                                        })
                                                                    }, this.autoCalculator)
                                                                }} />
                                                        </td>
                                                        <td>
                                                            <NumberFormat className="input has-text-right"
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                value={p.unitPrice}
                                                                onValueChange={(values) => {
                                                                    const { formattedValue, value, floatValue } = values;
                                                                    this.setState({
                                                                        orderDetail: this.state.orderDetail.map(m => {
                                                                            if (m.productId == p.productId) {
                                                                                return {
                                                                                    ...p,
                                                                                    unitPrice: floatValue,
                                                                                    totalPrice: (floatValue * p.quantity) || 0
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
                                                                value={p.totalPrice}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td colSpan={2} className="has-text-right">Subtotal</td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        displayType="text"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        value={this.state.order.quantity}
                                                    />
                                                </td>
                                                <td className="has-text-right"></td>
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
                                                <td colSpan={2} className="has-text-right">Shipping</td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        className="input has-text-right"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        value={this.state.order.shipping}
                                                        onValueChange={(values) => {
                                                            const { formattedValue, value, floatValue } = values;
                                                            this.setState({
                                                                order: {
                                                                    ...this.state.order,
                                                                    shipping: floatValue
                                                                }
                                                            }, this.autoCalculator)
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="has-text-right">Discount</td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        className="input has-text-right"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        value={this.state.order.discount}
                                                        onValueChange={(values) => {
                                                            const { formattedValue, value, floatValue } = values;
                                                            this.setState({
                                                                order: {
                                                                    ...this.state.order,
                                                                    discount: floatValue
                                                                }
                                                            }, this.autoCalculator)
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="has-text-right">Total</td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        displayType="text"
                                                        decimalScale={2}
                                                        value={this.state.order.total}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="has-text-right">Vat</td>
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
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        displayType="text"
                                                        decimalScale={2}
                                                        value={this.state.order.vatPrice}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="has-text-right">Net Total</td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right"></td>
                                                <td className="has-text-right">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        displayType="text"
                                                        decimalScale={2}
                                                        value={this.state.order.netTotal}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                            <div className="panel-tabs" style={{padding:'20px'}}>
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button className={`button is-link ${this.state.loading}`}
                                            disabled={
                                                this.state.order.supplierTel == '' ||
                                                this.state.order.supplierName == '' ||
                                                this.state.order.supplierAddr == '' ||
                                                this.state.order.warehouseId == '' ||
                                                this.state.orderDetail.length == 0
                                            }
                                            onClick={this.onOrderSave}
                                        >บันทึก</button>
                                    </div>
                                    <div className="control">
                                        <Link className="button" to="/orders">ยกเลิก</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.suppliers.length > 0 && <div className="modal is-active">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">รายชื่อ</p>
                            <button className="delete" aria-label="close" onClick={(e) => this.setState({ suppliers: [] })}></button>
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
                                            {this.state.suppliers.map((sup, i) => {
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
                                                                        supplierId: sup.memberId,
                                                                        supplierName: sup.memberName,
                                                                        supplierAddr: sup.memberAddr
                                                                    },
                                                                    suppliers: []
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
    products: state.products,
    warehouses: state.warehouses
});

const mapDispatchToProps = (dispatch) => ({
    startGetProducts: (accountId) => dispatch(startGetProducts(accountId)),
    startGetWarehouses: (accountId) => dispatch(startGetWarehouses(accountId)),
    startAddOrder: (order) => dispatch(startAddOrder(order))
});
export default connect(mapStateToProps, mapDispatchToProps)(InStockPage);
