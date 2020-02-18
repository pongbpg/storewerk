import React from 'react';
import { connect } from 'react-redux';
import { startAddCategory } from '../../../actions/categories';
import { Link } from 'react-router-dom';
import { history } from '../../../routers/AppRouter';
import _ from 'underscore';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            category: { categoryId: '', categoryName: '' },
            categories: props.categories || [],
            errors: '',
            loading: ''
        }
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        }
        this.onInputChange = this.onInputChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }

    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value.toUpperCase();
        if (key == "categoryId") {
            this.setState({ error: '' })
        }
        this.setState({
            category: {
                ...this.state.category,
                [key]: value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: 'is-loading' })
        if (this.state.categories.find(f => f.categoryId == this.state.category.categoryId)) {
            this.setState({
                loading: '',
                error: 'รหัสประเภทนี้มีการใช้แล้ว'
            })
        } else {
            this.props.startAddCategory({
                ...this.state.category,
                accountId: this.state.auth.account.accountId,
                creator: this.state.auth.email
            })
                .then(res => {
                    this.setState({
                        loading: ''
                    })
                    if (res.error == false) {
                        history.push('/products/categories')
                    } else {
                        this.setState({
                            error: res.messages
                        })
                    }
                })
        }

    }

    render() {
        const disabled = this.state.category.categoryId.length < 1 ||
            this.state.category.categoryName.length < 1
        // console.log('disabled', disabled)
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">รหัสประเภท</label>
                        <div className="control">
                            <input className="input" type="text" name="categoryId"
                                disabled={this.state.loading != ''}
                                value={this.state.category.categoryId} onChange={this.onInputChange} required />

                        </div>
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="field" style={{ paddingTop: '20px' }}>
                        <label className="label">ชื่อประเภท</label>
                        <div className="control">
                            <input className="input" type="text" name="categoryName"
                                disabled={this.state.loading != ''}
                                value={this.state.category.categoryName} onChange={this.onInputChange} required />
                        </div>
                    </div>
                    <div className="field is-grouped" style={{ paddingTop: '30px' }}>
                        <div className="control">
                            <Link className="button" to="/products/categories">ยกเลิก</Link>
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
    categories: state.categories
});

const mapDispatchToProps = (dispatch) => ({
    startAddCategory: (key, account) => dispatch(startAddCategory(key, account))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
