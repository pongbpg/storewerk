import React from 'react';
import { connect } from 'react-redux';
import { startGetCategories, startUpdateCategory } from '../../../actions/categories';
import { Link } from 'react-router-dom';
import { history } from '../../../routers/AppRouter';
import _ from 'underscore';
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            categories: props.categories,
            category: props.categories.find(f => f.categoryId == props.match.params.code) || { categoryId: '', categoryName: '' },
            errors: '',
            loading: ''
        }
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/products/categories')
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
            this.setState({
                categories: nextProps.categories,
                category: nextProps.categories.find(f => f.categoryId == nextProps.match.params.code)
            });
        }
    }

    onInputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value.toUpperCase();
        this.setState({
            category: {
                ...this.state.category,
                [key]: value
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.category)
        this.setState({ loading: 'is-loading' })
        this.props.startUpdateCategory({
            ..._.pick(this.state.category, 'accountId', 'categoryId', 'categoryName'),
            updater: this.state.auth.email
        }).then(res => {
            this.setState({
                loading: ''
            })
            if (res.error == false) {
                history.push('/products/categories')
            }
        })
    }

    render() {
        const disabled = this.state.category.categoryName.length < 1
        return (
            <div className="box container">
                <form onSubmit={this.onSubmit}>
                    <div className="field" style={{ paddingTop: '10px' }}>
                        <label className="label">รหัสประเภท</label>
                        <div className="control">
                            <input className="input" type="text" name="categoryId"
                                disabled={this.state.loading != ''}
                                value={this.state.category.categoryId} onChange={this.onInputChange} disabled />

                        </div>
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
    categories: state.categories
});

const mapDispatchToProps = (dispatch) => ({
    startGetCategories: (accountId) => dispatch(startGetCategories(accountId)),
    startUpdateCategory: (category) => dispatch(startUpdateCategory(category))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
