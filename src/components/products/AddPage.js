import React from 'react';
import { connect } from 'react-redux';
import { startGetCategories } from '../../actions/categories';
import { startAddProduct } from '../../actions/products';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { FaFileImage } from 'react-icons/fa'
import NumberFormat from 'react-number-format';
import Resizer from 'react-image-file-resizer';
import _ from 'underscore';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            product: { categoryId: '', productId: '', productName: '', unitName: '', productPrice: 0, productCost: 0, productImg: null },
            productImg: {
                file: null,
                preview: null
            },
            products: props.products || [],
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
    }

    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value.toUpperCase();
        if (key == "productId") {
            this.setState({ error: '' })
        }
        this.setState({
            product: {
                ...this.state.product,
                [key]: value
            }
        })
    }

    onCategoryChange = (e) => {
        // let category = this.state.categories.find(f => f.categoryId == e.target.value);

        this.setState({
            product: {
                ...this.state.product,
                categoryId: e.target.value
            }
        })

    }
    fileChange = event => {
        const name = event.target.name;
        const file = event.target.files;
        this.setState({
            [name]: {
                file: file.length > 0 ? event.target.files[0] : null
            }
        })


        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                [name]: {
                    ...this.state[name],
                    preview: file.length > 0 ? reader.result : null
                }
            });
        }
        if (file.length > 0) {
            Resizer.imageFileResizer(
                file[0],
                300,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    reader.readAsDataURL(uri);
                },
                'blob',
                100,
                100,
            );

        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: 'is-loading' })
        if (this.state.products.find(f => f.categoryId + f.productId == this.state.product.categoryId + this.state.product.productId)) {
            this.setState({
                loading: '',
                error: 'รหัสสินค้านี้มีการใช้แล้ว'
            })
        } else {
            this.props.startAddProduct({
                ...this.state.product,
                accountId: this.state.auth.account.accountId,
                productImg: this.state.productImg.preview,
                creator: this.state.auth.email
            })
                .then(res => {
                    this.setState({
                        loading: ''
                    })
                    if (res.error == false) {
                        history.push('/products')
                    } else {
                        this.setState({
                            error: res.messages
                        })
                    }
                })
        }

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
                            <div className="select is-fullwidth">
                                <select value={this.state.product.categoryId} onChange={this.onCategoryChange}>
                                    <option value="NULL">ไม่มี</option>
                                    {this.state.categories.map(cat => {
                                        // console.log(cat)
                                        return (
                                            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryId + ' : ' + cat.categoryName}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        {/* <p className="help is-danger">{this.state.error}</p> */}
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">รหัสสินค้า</label>
                        <div className="control">
                            <input className="input" type="text" name="productId"
                                disabled={this.state.loading != ''}
                                value={this.state.product.productId} onChange={this.onInputChange} required />

                        </div>
                        <p className="help is-danger">{this.state.error}</p>
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
                        <label className="label">ภาพสินค้า</label>
                        <div className="field-body">
                            <div className="field is-grouped">
                                <div className="control">
                                    <figure className="image is-128x128">
                                        <img src={this.state.productImg.file ? this.state.productImg.preview : this.state.product.productImg} />
                                    </figure>
                                </div>
                                <div className="control">
                                    <div className="file has-name is-right">
                                        <label className="file-label">
                                            <input type="file" className="file-input" name="productImg" onChange={this.fileChange} />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <FaFileImage />
                                                </span>
                                                <span className="file-label">เลือกรูปภาพ</span>
                                            </span>
                                            {
                                                this.state.productImg.file &&
                                                <span className="file-name">{this.state.productImg.file.name}</span>
                                            }
                                        </label>
                                    </div>
                                </div>
                            </div>
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
                                เพิ่ม
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
    products: state.products,
    categories: state.categories
});

const mapDispatchToProps = (dispatch) => ({
    startGetCategories: (accountId) => dispatch(startGetCategories(accountId)),
    startAddProduct: (product) => dispatch(startAddProduct(product))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
