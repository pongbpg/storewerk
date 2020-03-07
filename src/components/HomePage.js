import React from 'react';
import { history } from '../routers/AppRouter';
import { connect } from 'react-redux';
import Sale from './dashboard/sale';
import Product from './dashboard/product';
import { getSaleByMonth, getProductByMonth } from '../api/dashboard';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      sale: [],
      product: []
    }
    // if (!!props.auth.uid) {
    //   history.push('/login')
    // }
    // console.log(!!props.auth.uid)
    this.getSaleByMonth = getSaleByMonth;
    this.getProductByMonth = getProductByMonth;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }
  componentDidMount() {
    this.getSaleByMonth('2020', '01', this.state.auth.account.accountId)
      .then(rows => this.setState({ sale: rows.data }))
    this.getProductByMonth('2020', '01', this.state.auth.account.accountId)
      .then(rows => this.setState({ product: rows.data }))
  }

  render() {
    return (
      <div className="hero">
        <div className="hero-body">
          <div className="columns">
            <div className="column">

            </div>
          </div>
          <div className="columns">
            <div className="column is-12">
              <Sale data={this.state.sale} />
            </div>
          </div>
          <div className="columns">
            <div className="column is-12">
              <Product data={this.state.product} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
