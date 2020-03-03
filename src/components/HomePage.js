import React from 'react';
import { history } from '../routers/AppRouter';
import { connect } from 'react-redux';
import Test from './dashboard/test';
import { getSaleByMonth } from '../api/dashboard';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      db1: [],
    }
    // if (!!props.auth.uid) {
    //   history.push('/login')
    // }
    // console.log(!!props.auth.uid)
    this.getSaleByMonth = getSaleByMonth;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }
  componentDidMount() {
    this.getSaleByMonth('2020', '01')
      .then(rows => this.setState({ db1: rows.data }))
  }

  render() {
    return (
      <div className="hero">
        <div className="hero-body">
          {/* Coming Soon! */}
          <Test data={this.state.db1} />
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
