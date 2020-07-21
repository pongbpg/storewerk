import React from 'react';
import { history } from '../routers/AppRouter';
import { connect } from 'react-redux';
import _ from 'underscore';
import moment from 'moment';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
moment.locale('th');
export class ReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      dateRange: [new Date(), new Date()]
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }
  onDateRangeChange = (e) => {
    const dates = e ? [e[0], e[1]] : [new Date(), new Date()]
    this.setState({
      dateRange: dates
    })
  }
  onRptClick = (path, params, method, e) => {
    const rptNo = e.target.name;
    // const offset = new Date().getTimezoneOffset();
    const dateStart = moment(this.state.dateRange[0]).format('YYYY-MM-DD');
    const dateEnd = moment(this.state.dateRange[1]).format('YYYY-MM-DD');
    let param = { dateStart, dateEnd };
    if (path) {
      path = path.split('/')
        .filter(f => f != "")
        .map(p => p.indexOf(':') > -1 ? this.state.auth.account[p.replace(':', '')] : p)
    }
    params.map(m => param[m] = this.state.auth.account[m] || "")
    // console.log(rptNo, path, param)
    fetch('http://yaumjai.com:3000/api/storewerk/' + path.join('/'), {
      method: method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param)
    })
      .then(response => response.blob())
      .then(data => {
        // console.log(data)
        window.open(URL.createObjectURL(data))
      })
  }
  render() {
    return (
      <div className="hero">
        <div className="hero-body">
          <DateRangePicker onChange={this.onDateRangeChange} value={this.state.dateRange} />
          <div className="table-container">
            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>รายงาน</th>
                  <th>Export Files</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>ใบกำกับภาษี</td>
                  <td>
                    <button className="button is-danger is-small" name="rpt01" onClick={e => this.onRptClick('/invoice/out/:accountId', ['accountLicense'], 'POST', e)}>PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
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
export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);
