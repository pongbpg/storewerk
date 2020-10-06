import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { startGetProducts } from '../../actions/products'
import Selectors from '../../selectors/products';
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import moment from 'moment';
import { FaSearch } from 'react-icons/fa';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            products: props.products || [],
            isModal: false,
            product: {},
            loading: ''
        }
        this.props.startGetProducts(props.auth.account.accountId)
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.products) != JSON.stringify(this.state.products)) {
            this.setState({ products: nextProps.products });
        }
    }
    onRemoveClick = (code, e) => {
        this.setState({ isModal: true, product: this.state.products.find(f => f.productId == productId) })
    }
    onConfirmRemove = (e) => {
        // this.setState({ loading: 'is-loading' })
        // this.props.startRemoveAccountArray('products', { taxid: this.state.auth.account.taxid, value: this.state.product })
        //     .then(res => {
        //         this.setState({ loading: '', isModal: false })
        //     })
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
                Header: 'รูปสินค้า',
                headerClassName: 'has-text-centered',
                Cell: props => {
                    return (
                        <figure className="image is-96x96">
                            <img src={props.original.productImg} />
                        </figure>
                    )
                }
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
                Header: 'รหัสสินค้า',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'productId',
                maxWidth: 100
            },
            {
                Header: 'ชื่อสินค้า',
                headerClassName: 'has-text-left',
                accessor: 'productName'
            },
            {
                Header: 'ราคาขาย',
                headerClassName: 'has-text-right',
                className: 'has-text-right',
                accessor: 'productPrice'
            },
            {
                Header: 'จัดการ',
                headerClassName: 'has-text-centered',
                Cell: props => {
                    return (
                        <div className="field is-grouped is-grouped-centered">
                            <div className="control">
                                <Link className="button is-small" to={`/products/edit/${props.original.productId}`}>แก้ไข</Link>
                            </div>
                            {/* <div className="control">
                                <button className="button is-small is-danger" onClick={(e) => this.onRemoveClick(props.original.productId, e)}>ลบ</button>
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
                        <Link className="button is-link is-rounded is-hovered" to="/products/add">เพิ่ม</Link>
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
                    data={Selectors(this.state.products, this.state.search)}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={10}
                    defaultSorted={[
                        {
                            id: "categoryId",
                        },
                        {
                            id: "productId",
                        }
                    ]}
                />
                <div className={`modal  is-danger ${this.state.isModal && 'is-active'}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title has-text-danger">ลบสินค้า</p>
                            <button className="delete" aria-label="close" onClick={(e) => this.setState({ isModal: false })}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="message is-danger">
                                <div className="message-body">
                                    ต้องการลบ <strong>{this.state.product.productId}</strong> ({this.state.product.productName})
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
    products: state.products
});

const mapDispatchToProps = (dispatch) => ({
    startGetProducts: (accountId) => dispatch(startGetProducts(accountId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
