import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import NotFoundPage from '../components/NotFoundPage';
import ReportPage from '../components/ReportPage';
import { AccountSearch, AccountAdd, AccountEdit, AccountList } from './pages/Accounts';
import { ProductCatsList, ProductCatsAdd, ProductCatsEdit, ProductList, ProductAdd, ProductEdit } from './pages/Products';
import { WarehousesList, WarehousesAdd, WarehousesEdit } from './pages/Warehouses';
import { BranchesList, BranchesAdd, BranchesEdit } from './pages/Branches';
import { PaymentsList, PaymentsAdd, PaymentsEdit } from './pages/Payments';
import { MembersList, MembersAdd, MembersEdit } from './pages/Members';
import { OrderList, OrderInStock, OrderOutStock } from './pages/Orders';
import { UserList, UserAdd } from './pages/Users';
import { PrintRequest } from './pages/Prints';
import InventoriesList from '../components/inventories/ListPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" breadcrumbs={[]} component={HomePage} exact={true} />
        <Route path="/login" component={LoginPage} exact={true} />
        <PublicRoute path="/home" breadcrumbs={[]} component={HomePage} exact={true} />
        <Route path="/accounts" component={AccountsRoute} />
        <Route path="/products" component={ProductsRoute} />
        <Route path="/warehouses" component={WarehousesRoute} />
        <Route path="/branches" component={BranchesRoute} />
        <Route path="/payments" component={PaymentsRoute} />
        <Route path="/members" component={MembersRoute} />
        <Route path="/orders" component={OrdersRoute} />
        <Route path="/users" component={UsersRoute} />
        <Route path='/print' component={PrintsRoute} />
        <PublicRoute path="/reports" component={ReportPage} breadcrumbs={[{ link: '', name: 'รายงาน' }]} exact={true} />
        <PublicRoute path="/inventories" component={InventoriesList}
          breadcrumbs={[{ link: "/inventories", name: 'สินค้าคงเหลือ' }, { link: '', name: 'รายการ' }]}
          exact={true} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

class AccountsRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return <div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'บัญชี' }, { link: '', name: 'รายการ' }]}
        component={AccountList} exact={true} />
      <PublicRoute path={`${path}/add`}
        breadcrumbs={[{ link: path, name: 'บัญชี' }, { link: '/add', name: 'ลงทะเบียน' }]}
        component={AccountAdd} exact={true} />
      <PublicRoute path={`${path}/edit/:id`}
        breadcrumbs={[{ link: path, name: 'บัญชี' }, { link: '/edit', name: 'แก้ไข' }]}
        component={AccountEdit} exact={true} />
      <PublicRoute path={path + '/search'}
        breadcrumbs={[{ link: path, name: 'บัญชี' }, { link: '/search', name: 'ค้นหา' }]}
        component={AccountSearch} exact={true} />
    </div>
  }
}
class ProductsRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return <div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'สินค้า' }, { link: '', name: 'รายการ' }]}
        component={ProductList} exact={true} />
      <PublicRoute path={path + '/add'}
        breadcrumbs={[{ link: path, name: 'สินค้า' }, { link: '/add', name: 'เพิ่ม' }]}
        component={ProductAdd} exact={true} />
      <PublicRoute path={path + '/edit/:cid/:pid'}
        breadcrumbs={[{ link: path, name: 'สินค้า' }, { link: '/edit', name: 'แก้ไข' }]}
        component={ProductEdit} exact={true} />
      <PublicRoute path={path + '/categories'}
        breadcrumbs={[{ link: path, name: 'สินค้า' }, { link: '/categories', name: 'ประเภท' }, { link: '', name: 'รายการ' }]}
        component={ProductCatsList} exact={true} />
      <PublicRoute path={path + '/categories/add'}
        breadcrumbs={[{ link: path, name: 'สินค้า' }, { link: '/categories', name: 'ประเภท' }, { link: '/add', name: 'เพิ่ม' }]}
        component={ProductCatsAdd} exact={true} />
      <PublicRoute path={path + '/categories/edit/:code'}
        breadcrumbs={[{ link: path, name: 'สินค้า' }, { link: '/categories', name: 'ประเภท' }, { link: '/edit', name: 'แก้ไข' }]}
        component={ProductCatsEdit} exact={true} />
    </div>
  }
}
class WarehousesRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return (<div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'คลัง' }, { link: '', name: 'รายการ' }]}
        component={WarehousesList} exact={true} />
      <PublicRoute path={path + '/add'}
        breadcrumbs={[{ link: path, name: 'คลัง' }, { link: '/add', name: 'เพิ่ม' }]}
        component={WarehousesAdd} exact={true} />
      <PublicRoute path={path + '/edit/:code'}
        breadcrumbs={[{ link: path, name: 'คลัง' }, { link: '/edit', name: 'แก้ไข' }]}
        component={WarehousesEdit} exact={true} />
    </div>
    )
  }
}
class BranchesRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return (<div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'คลัง' }, { link: '', name: 'รายการ' }]}
        component={BranchesList} exact={true} />
      <PublicRoute path={path + '/add'}
        breadcrumbs={[{ link: path, name: 'คลัง' }, { link: '/add', name: 'เพิ่ม' }]}
        component={BranchesAdd} exact={true} />
      <PublicRoute path={path + '/edit/:code'}
        breadcrumbs={[{ link: path, name: 'คลัง' }, { link: '/edit', name: 'แก้ไข' }]}
        component={BranchesEdit} exact={true} />
    </div>
    )
  }
}
class MembersRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return (<div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'สมาชิก' }, { link: '', name: 'รายการ' }]}
        component={MembersList} exact={true} />
      <PublicRoute path={path + '/add'}
        breadcrumbs={[{ link: path, name: 'สมาชิก' }, { link: '/add', name: 'เพิ่ม' }]}
        component={MembersAdd} exact={true} />
      <PublicRoute path={path + '/edit/:code'}
        breadcrumbs={[{ link: path, name: 'สมาชิก' }, { link: '/edit', name: 'แก้ไข' }]}
        component={MembersEdit} exact={true} />
    </div>
    )
  }
}
class PaymentsRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return (<div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'การชำระเงิน' }, { link: '', name: 'รายการ' }]}
        component={PaymentsList} exact={true} />
      <PublicRoute path={path + '/add'}
        breadcrumbs={[{ link: path, name: 'การชำระเงิน' }, { link: '/add', name: 'เพิ่ม' }]}
        component={PaymentsAdd} exact={true} />
      <PublicRoute path={path + '/edit/:code'}
        breadcrumbs={[{ link: path, name: 'การชำระเงิน' }, { link: '/edit', name: 'แก้ไข' }]}
        component={PaymentsEdit} exact={true} />
    </div>
    )
  }
}
class OrdersRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return (<div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'ออเดอร์' }, { link: '', name: 'รายการ' }]}
        component={OrderList} exact={true} />
      <PublicRoute path={path + '/in'}
        breadcrumbs={[{ link: path, name: 'ออเดอร์' }, { link: '/in', name: 'สั่งซื้อ' }]}
        component={OrderInStock} />
      <PublicRoute path={path + '/out'}
        breadcrumbs={[{ link: path, name: 'ออเดอร์' }, { link: '/out', name: 'จำหน่าย' }]}
        component={OrderOutStock} />
    </div>
    )
  }
}
class UsersRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return (<div>
      <PublicRoute path={path}
        breadcrumbs={[{ link: path, name: 'จัดการสิทธิ์' }, { link: '', name: 'รายการ' }]}
        component={UserList} exact={true} />
      <PublicRoute path={path + '/add'}
        breadcrumbs={[{ link: path, name: 'จัดการสิทธิ์' }, { link: '/add', name: 'เพิ่ม' }]}
        component={UserAdd} exact={true} />
    </div>
    )
  }
}
class PrintsRoute extends React.Component {
  render() {
    const path = this.props.match.path;
    return (<div>
      <Route component={PrintRequest} />
    </div>
    )
  }
}
export default AppRouter;
