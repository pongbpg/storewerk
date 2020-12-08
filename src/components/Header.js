import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { MdExitToApp, MdAccountBox, MdPayment, MdSettings } from 'react-icons/md';
import { TiContacts } from 'react-icons/ti'
import { DiGitBranch } from 'react-icons/di'
import { FaStore, FaList, FaSearch, FaChartLine, FaWarehouse, FaLayerGroup, FaUserCog } from 'react-icons/fa';
import _ from 'underscore'
export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false,
      isBurger: false,
      auth: props.auth || { account: { accountId: '' } },
      showMenu: { m1: false, m2: false }
      // accounts: props.accounts
    };
  }
  toggleIsMenu = () => {
    this.setState(() => ({
      isMenu: !this.state.isMenu
    }))
  };
  toggleIsBurger = () => {
    this.setState(() => ({
      isBurger: !this.state.isBurger
    }))
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
    // if (nextProps.accounts != this.state.accounts) {
    //   this.setState({ accounts: nextProps.accounts });
    // }
  };
  onShowMenuClick = (e) => {
    let showMenu = {};
    Object.keys(this.state.showMenu).map(m => m == e ? showMenu[m] = !this.state.showMenu[m] : showMenu[m] = this.state.showMenu[m])
    this.setState({ showMenu })
    // console.log(showMenu)
  }
  render() {
    const roleId = this.state.auth.account.roleId;
    return (
      <nav className="navbar is-dark is-fixed-top has-shadow">
        <div className="container">
          <div className="navbar-brand">
            <Link to="/home" className="navbar-item brand-text">StoreWerk</Link>
            <div data-target="navMenu" onClick={this.toggleIsBurger}
              className={this.state.isBurger === true ? "navbar-burger burger is-active" : "navbar-burger burger"}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div id="navbarMenu" className={`navbar-menu ${this.state.isBurger && 'is-active'}`}>

            <div className="navbar-start" >
              {/* <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link"><span className="icon"><MdAccountBox /></span>บัญชี</a>
                <div className="navbar-dropdown"> */}
              <Link className="navbar-item" to="/accounts"><span className="icon"><MdAccountBox /></span>บัญชี</Link>
              {/* <Link className="navbar-item" to="/accounts/search"><span className="icon"><FaSearch /></span>ค้นหา</Link> */}
              {/* </div>
              </div> */}
            </div>
            {this.state.auth.account.accountId != '' &&
              <div className="navbar-end" >
                <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link" onClick={e => this.onShowMenuClick('m1')}><span className="icon"><FaStore /></span>{this.state.auth.account.accountName}</a>
                  {this.state.showMenu.m1 && <div className="navbar-dropdown">
                    <Link className="navbar-item" to="/orders"><span className="icon"><FaList /></span>ออเดอร์</Link>
                    <Link className="navbar-item" to="/inventories"><span className="icon"><FaStore /></span>สินค้าคงเหลือ</Link>
                    <Link className="navbar-item" to="/reports"><span className="icon"><FaChartLine /></span>รายงาน</Link>
                  </div>}
                </div>
                {['ADMIN', 'FINANCE'].indexOf(roleId) > -1 &&
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link" onClick={e => this.onShowMenuClick('m2')}><MdSettings />&nbsp;ตั้งค่า</a>
                    {this.state.showMenu.m2 && <div className="navbar-dropdown">
                      <Link className="navbar-item" to="/products/categories"><span className="icon"><FaLayerGroup /></span>ประเภท</Link>
                      <Link className="navbar-item" to="/products"><span className="icon"><FaList /></span>สินค้า</Link>
                      <Link className="navbar-item" to="/warehouses"><span className="icon"><FaWarehouse /></span>คลัง</Link>
                      {/* <Link className="navbar-item" to="/branches"><span className="icon"><DiGitBranch /></span>สาขา</Link>
                      <Link className="navbar-item" to="/members"><span className="icon"><TiContacts /></span>สมาชิก</Link>
                      <Link className="navbar-item" to="/payments"><span className="icon"><MdPayment /></span>ชำระเงิน</Link> */}
                      <Link className="navbar-item" to="/users"><span className="icon"><FaUserCog /></span>จัดการสิทธิ์</Link>
                    </div>}
                  </div>}
              </div>
            }
            <div className={`navbar-item has-dropdown ${this.state.isMenu && 'is-active'}`}>
              <a className="navbar-link is-hidden-touch has-text-white" onClick={this.toggleIsMenu}>{this.props.auth.email}</a>
              <div className="navbar-dropdown">
                <a className="navbar-item" onClick={this.props.startLogout}>
                  <span className="icon"><MdExitToApp /></span>Sign Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav >

    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  // accounts: state.accounts
});
const mapDispatchToProps = (dispatch) => {
  return {
    startLogout: () => dispatch(startLogout())
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
