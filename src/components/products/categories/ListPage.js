import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../../routers/AppRouter';
import { startGetCategories } from '../../../actions/categories'
import Selectors from '../../../selectors/categories'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { FaSearch } from 'react-icons/fa';
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            categories: props.categories || [],
            isModal: false,
            category: {},
            loading: ''
        }
        this.props.startGetCategories(props.auth.account.accountId);
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.categories) != JSON.stringify(this.state.categories)) {
            this.setState({ categories: nextProps.categories });
        }
    }
    onRemoveClick = (categoryId, e) => {
        this.setState({ isModal: true, category: this.state.categories.find(f => f.categoryId == categoryId) })
    }
    onConfirmRemove = (e) => {
        // this.setState({ loading: 'is-loading' })
        // this.props.startRemoveAccountArray('categories', { taxid: this.state.auth.account.taxid, value: this.state.category })
        // .then(res => {
        //     this.setState({ loading: '', isModal: false })
        // })
    }
    render() {
        const columns = [
            {
                Header: '#',
                Cell: props => props.index + 1,
                className: 'has-text-centered striped',
                maxWidth: 60
            },
            {
                Header: 'รหัสประเภท',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'categoryId',
                maxWidth: 100
            },
            {
                Header: 'ชื่อประเภท',
                headerClassName: 'has-text-left',
                accessor: 'categoryName'
            },
            {
                Header: 'จัดการ',
                headerClassName: 'has-text-centered',
                Cell: props => {
                    return (
                        <div className="field is-grouped is-grouped-centered">
                            <div className="control">
                                <Link className="button is-small" to={`/products/categories/edit/${props.original.categoryId}`}>แก้ไข</Link>
                            </div>
                            {/* <div className="control">
                                <button className="button is-small is-danger" onClick={(e) => this.onRemoveClick(props.original.categoryId, e)}>ลบ</button>
                            </div> */}
                        </div>
                    )
                }
            },
        ]
        // console.log(this.state.categories, this.state.auth)
        return (
            <div className="box">
                <nav className="level">
                    <div className="level-left">
                        <Link className="button is-link is-rounded is-hovered" to="/products/categories/add">เพิ่ม</Link>
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
                    data={Selectors(this.state.categories, this.state.search)}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={10}
                />
                <div className={`modal  is-danger ${this.state.isModal && 'is-active'}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title has-text-danger">ลบประเภทสินค้า</p>
                            <button className="delete" aria-label="close" onClick={(e) => this.setState({ isModal: false })}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="message is-danger">
                                <div className="message-body">
                                    ต้องการลบ <strong>{this.state.category.categoryId}</strong> ({this.state.category.categoryName})
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
    categories: state.categories
});

const mapDispatchToProps = (dispatch) => ({
    startGetCategories: (accountId) => dispatch(startGetCategories(accountId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
