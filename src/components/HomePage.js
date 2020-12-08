import React from 'react';
import { history } from '../routers/AppRouter';
import { connect } from 'react-redux';
import Sale from './dashboard/sale';
import Product from './dashboard/product';
import { getSaleByMonth, getProductByMonth } from '../api/dashboard';
import { getYearsByAccId, getMonthsByAccId } from '../api/accounts';
import moment from 'moment';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      sale: [],
      product: [],
      years: [],
      year: 0,
      months: [],
      month: 0
    }
    // if (!!props.auth.uid) {
    //   history.push('/login')
    // }
    // console.log(!!props.auth.uid)
    this.getSaleByMonth = getSaleByMonth;
    this.getProductByMonth = getProductByMonth;
    this.getYearsByAccId = getYearsByAccId;
    this.getMonthsByAccId = getMonthsByAccId;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }
  componentDidMount() {
    this.getYearsByAccId(this.state.auth.account.accountId)
      .then(rows => {
        const years = rows.data[0];
        if (years.length > 0) {
          const year = years[years.length - 1].year;
          this.setState({ years, year })
          this.getMonthsByAccId(this.state.auth.account.accountId, year)
            .then(rows2 => {
              const months = rows2.data[0];
              const month = months[months.length - 1].month;
              this.setState({ months, month })
              this.getSaleByMonth(year, month, this.state.auth.account.accountId)
                .then(rows => this.setState({ sale: rows.data }))
              this.getProductByMonth(year, month, this.state.auth.account.accountId)
                .then(rows => this.setState({ product: rows.data }))
            })
        }
      })
  }
  onYearChange = (e) => {
    const year = e.target.value;
    this.setState({ year })
  }
  onMonthChange = (e) => {
    const month = e.target.value;
    this.setState({ month })
    this.getSaleByMonth(this.state.year, month, this.state.auth.account.accountId)
      .then(rows => this.setState({ sale: rows.data }))
    this.getProductByMonth(this.state.year, month, this.state.auth.account.accountId)
      .then(rows => this.setState({ product: rows.data }))
  }
  render() {
    return (
      <div className="hero">
        <div className="hero-body">
          <div className="columns">
            <div className="column">
              <div className="select">
                <select className="input" onChange={this.onYearChange} value={this.state.year}>
                  {this.state.years.map(y => {
                    return <option key={y.year} value={y.year}>{y.year}</option>
                  })}
                </select>
              </div>
              <div className="select">
                <select className="input" onChange={this.onMonthChange} value={this.state.month}>
                  {this.state.months.map(m => {
                    return <option key={m.month} value={m.month}>{m.month}</option>
                  })}
                </select>
              </div>
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
