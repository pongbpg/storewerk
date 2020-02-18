import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import Selectors from '../../selectors/warehouses';
import { startGetWarehouses } from '../../actions/warehouses'
import { FaSearch } from 'react-icons/fa';
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
            warehouses: props.warehouses || [],
            isModal: false,
            warehouse: {},
            loading: ''
        }
        this.props.startGetWarehouses(props.auth.account.accountId)
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.warehouses) != JSON.stringify(this.state.warehouses)) {
            this.setState({ warehouses: nextProps.warehouses });
        }
    }
    onRemoveClick = (code, e) => {
        this.setState({ isModal: true, warehouse: this.state.warehouses.find(f => f.warehouseId == warehouseId) })
    }
    // onConfirmRemove = (e) => {
    //     this.setState({ loading: 'is-loading' })
    //     this.props.startRemoveAccountArray('warehouses', { accountId: this.state.auth.account.accountId, value: this.state.warehouse })
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
                Header: 'รหัสคลัง',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'warehouseId',
                maxWidth: 100
            },
            {
                Header: 'ชื่อคลัง',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'warehouseName'
            },
            {
                Header: 'จัดการ',
                headerClassName: 'has-text-centered',
                Cell: props => {
                    return (
                        <div className="field is-grouped is-grouped-centered">
                            <div className="control">
                                <Link className="button is-small" to={`/warehouses/edit/${props.original.warehouseId}`}>แก้ไข</Link>
                            </div>
                            {/* <div className="control">
                                <button className="button is-small is-danger" onClick={(e) => this.onRemoveClick(props.original.warehouseId, e)}>ลบ</button>
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
                        <Link className="button is-link is-rounded is-hovered" to="/warehouses/add">เพิ่ม</Link>
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
                    data={Selectors(this.state.warehouses, this.state.search)}
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
                                    ต้องการลบ <strong>{this.state.warehouse.warehouseId}</strong> ({this.state.warehouse.warehouseName})
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
    warehouses: state.warehouses
});

const mapDispatchToProps = (dispatch) => ({
    startGetWarehouses: (accountId) => dispatch(startGetWarehouses(accountId))
    // startRemoveAccountArray: (key, account) => dispatch(startRemoveAccountArray(key, account))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
