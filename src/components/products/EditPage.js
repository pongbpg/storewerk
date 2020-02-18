import React from 'react';
import { connect } from 'react-redux';
import { startGetCategories } from '../../actions/categories';
import { startUpdateProduct } from '../../actions/products';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import NumberFormat from 'react-number-format'
import _ from 'underscore';
export class EditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            product: props.products.find(f => f.productId == props.match.params.code) ||
                { categoryId: '', categoryName: '', productId: '', productName: '', unitName: '', productPrice: 0, productCost: 0 },
            categories: props.categories || [],
            errors: '',
            loading: ''
        }
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        } else {
            this.props.startGetCategories(props.auth.account.accountId)
        }
        this.onInputChange = this.onInputChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.categories) != JSON.stringify(this.state.categories)) {
            this.setState({ categories: nextProps.categories });
        }
        if (JSON.stringify(nextProps.products) != JSON.stringify(this.state.products)) {
            this.setState({ products: nextProps.products });
        }
    }

    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value.toUpperCase();
        this.setState({
            product: {
                ...this.state.product,
                [key]: value
            }
        })
    }

    onCategoryChange = (e) => {
        this.setState({
            product: {
                ...this.state.product,
                categoryId: e.target.value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.product)
        this.setState({ loading: 'is-loading' })
        this.props.startUpdateProduct({
            ..._.pick(this.state.product, 'accountId', 'categoryId', 'productId', 'productName', 'unitName', 'productPrice', 'productCost'),
            updater: this.state.auth.email
        })
            .then(res => {
                this.setState({
                    loading: ''
                })
                if (res.error == false) {
                    history.push('/products')
                }
            })
    }

    render() {
        const disabled = this.state.product.productId.length < 1 ||
            this.state.product.productName.length < 1
        // console.log('disabled', disabled)
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">ประเภทสินค้า</label>
                        <div className="control">
                            <div className="select">
                                <select value={this.state.product.categoryId} onChange={this.onCategoryChange}>
                                    <option value="" >ไม่มี</option>
                                    {this.state.categories.map(cat => {
                                        return (
                                            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">รหัสสินค้า</label>
                        <div className="control">
                            <input className="input" type="text" name="productId"
                                disabled={this.state.loading != ''}
                                value={this.state.product.productId} onChange={this.onInputChange} disabled />

                        </div>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ชื่อสินค้า</label>
                        <div className="control">
                            <input className="input" type="text" name="productName"
                                disabled={this.state.loading != ''}
                                value={this.state.product.productName} onChange={this.onInputChange} required />
                        </div>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">หน่วยนับ</label>
                        <div className="control">
                            <input className="input" type="text" name="unitName"
                                disabled={this.state.loading != ''}
                                value={this.state.product.unitName} onChange={this.onInputChange} />
                        </div>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ต้นทุน</label>
                        <div className="control">
                            <NumberFormat className="input"
                                value={this.state.product.productCost}
                                thousandSeparator={true}
                                required
                                disabled={this.state.loading != ''}
                                onValueChange={(values) => {
                                    const { formattedValue, value, floatValue } = values;
                                    this.setState({ product: { ...this.state.product, productCost: floatValue } })
                                }} />
                        </div>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ราคาขาย</label>
                        <div className="control">
                            <NumberFormat className="input"
                                value={this.state.product.productPrice}
                                thousandSeparator={true}
                                required
                                disabled={this.state.loading != ''}
                                onValueChange={(values) => {
                                    const { formattedValue, value, floatValue } = values;
                                    this.setState({ product: { ...this.state.product, productPrice: floatValue } })
                                }} />
                        </div>
                    </div>
                    <div className="field is-grouped" style={{ paddingTop: '30px' }}>
                        <div className="control">
                            <Link className="button" to="/products">ยกเลิก</Link>
                        </div>
                        <div className="control">
                            <button className={`button is-link ${this.state.loading}`}
                                disabled={disabled}
                                type="submit">
                                บันทึก
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    categories: state.categories,
    products: state.products
});

const mapDispatchToProps = (dispatch) => ({
    startGetCategories: (accountId) => dispatch(startGetCategories(accountId)),
    startUpdateProduct: (product) => dispatch(startUpdateProduct(product))
});
export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
