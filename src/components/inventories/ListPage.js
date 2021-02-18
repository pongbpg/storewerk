import React from 'react';
import { connect } from 'react-redux';
import { startGetInventories } from '../../actions/inventories'
import ReactTable from 'react-table-v6'
import NumberFormat from 'react-number-format'
import DatePicker from 'react-datepicker';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import 'react-table-v6/react-table.css'
import _ from 'underscore';
import moment from 'moment';
import Modal from 'react-modal';
import Workbook from 'react-excel-workbook'
import { FaPrint } from 'react-icons/fa'
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            orderDate: moment(),
            inventories: props.inventories,
            warehouses: [],
            categories: [],
            openModal: false,
            selected: { categoryId: null, productId: null },
            dateRange: [new Date(), new Date()],
            showCost: false,
            filtered: [],
        }
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        } else {
            this.props.startGetInventories(props.auth.account.accountId, moment().format('YYYY-MM-DD'));
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.inventories) != JSON.stringify(this.state.inventories)) {
            this.setState({
                inventories: nextProps.inventories,
                warehouses: _.chain(nextProps.inventories)
                    .groupBy('warehouseName')
                    .map((wh, id) => {
                        return {
                            id
                        }
                    }).value(),
                categories: _.chain(nextProps.inventories)
                    .groupBy('categoryName')
                    .map((ct, id) => {
                        return {
                            id
                        }
                    }).value(),
            });
        }
    }
    onOpenModal = (categoryId, productId) => {
        this.setState({ selected: { categoryId, productId }, openModal: true })
        document.execCommand("copy");
    }
    onDateRangeChange = (e) => {
        const dates = e ? [e[0], e[1]] : [new Date(), new Date()]
        this.setState({
            dateRange: dates
        })
    }
    onFilteredChangeCustom = (value, accessor) => {
        let filtered = this.state.filtered;
        let insertNewFilter = 1;

        if (filtered.length) {
            filtered.forEach((filter, i) => {
                if (filter["id"] === accessor) {
                    if (value === "" || !value.length) filtered.splice(i, 1);
                    else filter["value"] = value;

                    insertNewFilter = 0;
                }
            });
        }

        if (insertNewFilter) {
            filtered.push({ id: accessor, value: value });
        }
        // console.log(filtered)
        this.setState({ filtered: filtered });
    };
    render() {
        let columns = [
            {
                Header: '#',
                Cell: props => props.index + 1,
                className: 'has-text-centered striped',
                maxWidth: 60,
                filterable: false
            },
            {
                Header: 'คลังสินค้า',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'warehouseName',
                filterMethod: (filter, row) => {
                    // console.log(filter,row)
                    if (filter.value == "all") {
                        return true;
                    } else {
                        return row[filter.id] == filter.value;
                    }
                },
                Filter: ({ filter, onChange }) =>
                    <select className="control"
                        onChange={event => this.onFilteredChangeCustom(event.target.value, 'warehouseName')}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}>
                        <option value="all">ทั้งหมด</option>
                        {this.state.warehouses.map((wh) => {
                            return (<option key={wh.id}>{wh.id}</option>)
                        })}
                    </select>
            },
            {
                Header: 'ประเภท',
                headerClassName: 'has-text-left',
                className: 'has-text-left',
                accessor: 'categoryName',
                filterMethod: (filter, row) => {
                    if (filter.value === "all") {
                        return true;
                    } else {
                        return row[filter.id] == filter.value;
                    }
                },
                Filter: ({ filter, onChange }) =>
                    <select className="control"
                        // onChange={event => onChange(event.target.value)}
                        onChange={event => this.onFilteredChangeCustom(event.target.value, 'categoryName')}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}>
                        <option value="all">ทั้งหมด</option>
                        {this.state.categories.map((ct) => {
                            return (<option key={ct.id}>{ct.id}</option>)
                        })}
                    </select>
                // filterMethod: (filter, row) => {
                //     return row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                // }
            },
            {
                Header: 'สินค้า',
                headerClassName: 'has-text-left',
                accessor: 'productName',
                filterMethod: (filter, row) => {
                    return row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                },
                Filter: ({ filter, onChange }) =>
                    <input type="text" className="control"
                        onChange={event => this.onFilteredChangeCustom(event.target.value, 'productName')}
                        value={filter ? filter.value : ''} />
            },
            {
                Header: 'ราคาขาย',
                headerClassName: 'has-text-right',
                className: 'has-text-right',
                accessor: 'productPrice',
                filterable: false,
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
                Header: 'คงเหลือ',
                headerClassName: 'has-text-right',
                className: 'has-text-right',
                accessor: 'quantity1',
                filterable: false,
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
                Header: 'รายงาน',
                headerClassName: 'has-text-right',
                className: 'has-text-right',
                accessor: 'productId',
                filterable: false,
                Cell: props => {
                    return (
                        <button className="button" onClick={() => this.onOpenModal(props.original.categoryId, props.value)}>บัญชี</button>
                    )
                }
            }
        ]
        // console.log('wh', this.state.warehouses)
        const colCost = {
            Header: 'ต้นทุน',
            headerClassName: 'has-text-right',
            className: 'has-text-right',
            accessor: 'productCost',
            filterable: false,
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
        }
        if (this.state.showCost) columns.splice(5, 0, colCost)
        return (
            <div className="box" >
                <div className="level">
                    <div className="level-left">
                        <label className="label">วันที่</label>
                        <div className="control">
                            <DatePicker
                                className="input has-text-centered"
                                dateFormat="DD/MM/YYYY"
                                placeholderText="เลือกวันที่"
                                selected={this.state.orderDate}
                                onChange={(orderDate) => this.setState({
                                    orderDate
                                }, () => this.props.startGetInventories(this.state.auth.account.accountId, moment(orderDate).format('YYYY-MM-DD')))}
                            />
                        </div>
                    </div>
                    <div className="level-right">
                        {['ADMIN', 'FINANCE'].indexOf(this.state.auth.account.roleId) > -1 &&
                            <div className="field is-grouped">
                                <div className="control">
                                    <input type="checkbox" onClick={e => this.setState({ showCost: e.target.checked })} />
                                    <label>ต้นทุน</label>
                                </div>
                                <div className="control">
                                    <Workbook filename={'สินค้าคงคลัง' + this.state.auth.account.accountId + '_' + this.state.orderDate + '.xlsx'}
                                        element={<button className="button is-primary"><FaPrint />&nbsp;Excel</button>}>
                                        <Workbook.Sheet data={this.state.inventories.filter(f1 => {
                                            const wh = this.state.filtered.find(f2 => f2.id == 'warehouseName');
                                            if (wh)
                                                return wh.value == 'all' ? true : f1.warehouseName == wh.value
                                            else return true
                                        })
                                        } name={'สินค้าคงคลัง'}>
                                            <Workbook.Column label="คลัง" value="warehouseName" />
                                            <Workbook.Column label="ประเภท" value="categoryName" />
                                            <Workbook.Column label="สินค้า" value="productName" />
                                            <Workbook.Column label="หน่วยนับ" value="unitName" />
                                            <Workbook.Column label="ต้นทุน" value="productCost" />
                                            <Workbook.Column label="ราคา" value="productPrice" />
                                            <Workbook.Column label="คงเหลือ" value="quantity1" />
                                        </Workbook.Sheet>
                                    </Workbook>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <ReactTable className="table -highlight"
                    filterable
                    filtered={this.state.filtered}
                    // defaultFilterMethod={(filter, row) =>
                    //     String(row[filter.id]) === filter.value}
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        if (typeof filter.value === "object") {
                            return row[id] !== undefined
                                ? filter.value.indexOf(row[id]) > -1
                                : true;
                        } else {
                            return row[id] !== undefined
                                ? String(row[id]).indexOf(filter.value) > -1
                                : true;
                        }
                    }}
                    data={this.state.inventories}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={20}
                />
                <div className={`modal ${this.state.openModal && 'is-active'}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">รายการบัญชีสินค้า</p>
                            <button className="delete" aria-label="close" onClick={() => this.setState({ openModal: false })}></button>
                        </header>
                        <section className="modal-card-body has-text-centered" style={{ height: '300px' }}>
                            <DateRangePicker onChange={this.onDateRangeChange} value={this.state.dateRange} />
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success">Save changes</button>
                            <button className="button" onClick={() => this.setState({ openModal: false })}>Cancel</button>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    inventories: state.inventories
});

const mapDispatchToProps = (dispatch) => ({
    startGetInventories: (accountId, orderDate) => dispatch(startGetInventories(accountId, orderDate))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
