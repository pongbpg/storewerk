import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { startGetWarehouses } from '../../actions/warehouses'
import { startGetProducts } from '../../actions/products'
import { checkPermission } from '../../api/permissions';
import { printProductUsed, printProductInit } from '../../api/prints';
import querySting from 'query-string'
import moment from 'moment';
import Money from '../../selectors/money'
import { FaPrint } from 'react-icons/fa'
import Workbook from 'react-excel-workbook'
moment.locale('th');
export class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            params: querySting.parse(props.location.search.substring(1)),
            warehouses: props.warehouses,
            warehouseSelect: '',
            productSelect: '',
            data: [],
            init: [],
            initStock: 0,
            products: props.products,
            isPrint: false
        }

        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        } else {
            //init get list
            this.props.startGetWarehouses(props.auth.account.accountId)
            this.props.startGetProducts(props.auth.account.accountId)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.warehouses) != JSON.stringify(this.state.warehouses)) {
            this.setState({ warehouses: nextProps.warehouses });
        }
        if (JSON.stringify(nextProps.products) != JSON.stringify(this.state.products)) {
            this.setState({ products: nextProps.products });
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.isPrint) {
            window.print();
            this.setState({ isPrint: false })
        }
    }
    onWarehouseChange = (e) => {
        const warehouseSelect = e.target.value;
        this.setState({ warehouseSelect, data: [], init: [], initStock: 0 })
        checkPermission(this.state.auth.account.accountId, this.state.auth.email, 'ACCOUNTING', 'READ')
            .then(res => {
                //   console.log(res.data)
                if (res.data.result) {
                    printProductUsed(this.state.auth.account.accountId, warehouseSelect, this.state.params.dateStart, this.state.params.dateEnd)
                        .then(res2 => {
                            // console.log(res2.data)
                            this.setState({ data: res2.data })
                            printProductInit(this.state.auth.account.accountId, warehouseSelect, this.state.params.dateStart)
                                .then(res3 => {
                                    this.setState({ init: res3.data, productSelect: res3.data[0].productId })
                                })
                                .catch(err3 => {
                                    console.log(err3)
                                })
                        })
                        .catch(err2 => {
                            alert('Error กรุณาเปิดใหม่อีกครั้ง')
                            console.log(err2)
                            // window.close()
                        })
                } else {
                    alert('คุณไม่มีสิทธิ์ใช้รายงานนี้')
                    // window.close();
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        let balance = this.state.init.find(f => f.productId == this.state.productSelect);
        balance = balance ? balance.init : 0;
        let debit = 0, credit = 0;
        const workbooks = _.chain(this.state.data).groupBy("productId").map((offers, productId) => ({ productId })).value()
            .map(group => {
                const product = this.state.products.find(f => f.categoryId + '#' + f.productId == group.productId)
                let balanceWs = this.state.init.find(f => f.productId == group.productId);
                balanceWs = balanceWs ? balanceWs.init : 0;
                return {
                    ...group,
                    productName: product.productName,
                    balanceWs,
                    dataset: this.state.data.filter(f => f.productId == group.productId)
                        .map(d => {
                            balanceWs = balanceWs + d.debit - d.credit;
                            return { ...d, balanceWs, orderDate: moment(d.orderDate).format('ll') }
                        })
                }
            })
        console.log(workbooks)
        return (
            <div className="box" >
                <div className="level">
                    <div className="level-left">
                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field">
                                    <label className="label">คลังสินค้า</label>
                                    <div className="control">
                                        <div className="select">
                                            <select value={this.state.warehouseSelect} onChange={this.onWarehouseChange}>
                                                <option value="" disabled>เลือก</option>
                                                {this.state.warehouses.map(wh => <option key={wh.warehouseId} value={wh.warehouseId}>{wh.warehouseName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="level-right">
                        <button className="button is-dark" disabled={this.state.productSelect == ''} onClick={() => this.setState({ isPrint: true })}><FaPrint />&nbsp;Print</button>
                        <Workbook filename={this.state.auth.account.accountId + this.state.warehouseSelect + this.state.params.dateStart + '_' + this.state.params.dateEnd + '.xlsx'}
                            element={<button disabled={this.state.warehouseSelect == ''} className="button is-primary"><FaPrint />&nbsp;Excel</button>}>
                            {/* <Workbook.Sheet data={data1} name="Sheet A">
                                <Workbook.Column label="Foo" value="foo" />
                                <Workbook.Column label="Bar" value="bar" />
                            </Workbook.Sheet> */}
                            {workbooks.map(ws => {
                                return <Workbook.Sheet data={ws.dataset} name={ws.productName} key={ws.productId}>
                                    <Workbook.Column label="วันที่" value="orderDate" />
                                    <Workbook.Column label="รับ" value="debit" />
                                    <Workbook.Column label="จ่าย" value="credit" />
                                    <Workbook.Column label="คงเหลือ" value="balanceWs" />
                                </Workbook.Sheet>
                            })}
                        </Workbook>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        {_.chain(this.state.data).groupBy("productId").map((offers, productId) => ({ productId })).value()
                            .map(pd => {
                                const p = this.state.products.find(f => f.categoryId + '#' + f.productId == pd.productId)
                                return <li key={pd.productId} className={this.state.productSelect == pd.productId ? 'is-active' : ''}>
                                    <a onClick={() => this.setState({ productSelect: pd.productId })}>{p.productName}</a>
                                </li>
                            })}
                    </ul>
                </div>
                <div className="row">
                    <table className="table is-bordered is-fullwidth">
                        <thead>
                            <tr>
                                <th className="has-text-centered">วันที่</th>
                                <th className="has-text-centered">รับ</th>
                                <th className="has-text-centered">จ่าย</th>
                                <th className="has-text-centered">คงเหลือ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.length == 0 && (<tr>
                                <td colSpan={4} className="has-text-centered">ไม่มีรายการสินค้า</td>
                            </tr>)}
                            {this.state.data.filter(f => f.productId == this.state.productSelect)
                                .map((d, i) => {
                                    balance = balance + d.debit - d.credit;
                                    debit += d.debit;
                                    credit += d.credit;
                                    return (<tr key={i}>
                                        <td className="has-text-centered">{moment(d.orderDate).format('ll')}</td>
                                        <td className="has-text-right">{Money(d.debit, 2)}</td>
                                        <td className="has-text-right">{Money(d.credit, 2)}</td>
                                        <td className="has-text-right">{Money(balance, 2)}</td>
                                    </tr>)
                                })}
                            <tr>
                                <td className="has-text-centered has-text-weight-bold">รวม</td>
                                <td className="has-text-right has-text-weight-bold">{Money(debit, 2)}</td>
                                <td className="has-text-right has-text-weight-bold">{Money(credit, 2)}</td>
                                <td className="has-text-right has-text-weight-bold">{Money(balance, 2)}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    warehouses: state.warehouses,
    products: state.products
});

const mapDispatchToProps = (dispatch) => ({
    startGetWarehouses: (accountId) => dispatch(startGetWarehouses(accountId)),
    startGetProducts: (accountId) => dispatch(startGetProducts(accountId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
