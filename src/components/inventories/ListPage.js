import React from 'react';
import { connect } from 'react-redux';
import { startGetInventories } from '../../actions/inventories'
import ReactTable from 'react-table-v6'
import NumberFormat from 'react-number-format'
import 'react-table-v6/react-table.css'
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            inventories: props.inventories,
            warehouses: _.chain(props.inventories)
                .groupBy('warehouseName')
                .map((wh, id) => {
                    return {
                        id
                    }
                }).value()
        }
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        } else {
            this.props.startGetInventories(props.auth.account.accountId);
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
                    }).value()
            });
        }
    }

    render() {

        const columns = [
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
                    if (filter.value === "all") {
                        return true;
                    } else {
                        return row[filter.id] == filter.value;
                    }
                },
                Filter: ({ filter, onChange }) =>
                    <select className="control"
                        onChange={event => onChange(event.target.value)}
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
                    return row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                }
            },
            {
                Header: 'สินค้า',
                headerClassName: 'has-text-left',
                accessor: 'productName',
                filterMethod: (filter, row) => {
                    return row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                }
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
            }
        ]
        // console.log('wh', this.state.warehouses)

        return (
            <div className="box" >
                <ReactTable className="table -highlight"
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                    data={this.state.inventories}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={20}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    inventories: state.inventories
});

const mapDispatchToProps = (dispatch) => ({
    startGetInventories: (accountId) => dispatch(startGetInventories(accountId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
