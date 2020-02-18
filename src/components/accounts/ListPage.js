import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startGetAccounts, setAccounts } from '../../actions/accounts'
import Selectors from '../../selectors/accounts';
import { startSetAccountUser } from '../../actions/auth';
import ReactTable from 'react-table-v6'
import { FaSearch } from 'react-icons/fa';
import { IoMdLogIn } from 'react-icons/io'
import 'react-table-v6/react-table.css'
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            accounts: props.accounts || []
        }
        this.props.startGetAccounts(props.auth);
        this.onSelectedClick = this.onSelectedClick.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.accounts != this.state.accounts) {
            this.setState({ accounts: nextProps.accounts });
        }
    }

    onSelectedClick(rowId) {
        let account = this.state.accounts.find(f => f.accountId == rowId)
        if (rowId == this.state.auth.account.accountId) {
            account = { accountId: '' }
        }
        this.setState({
            auth: {
                ...this.state.auth,
                account
            }
        })
        this.props.startSetAccountUser(this.state.auth.email, account)
    }

    render() {
        const columns = [
            {
                Header: '#',
                Cell: props => props.index + 1,
                className: 'has-text-centered striped',
                maxWidth: 60
            },
            {
                Header: 'เลขที่ผู้เสียภาษี',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'accountId',
                maxWidth: 150
            },
            {
                Header: 'ชื่อ/ บริษัท',
                headerClassName: 'has-text-left',
                accessor: 'accountName'
            },
            {
                Header: 'เบอร์ติดต่อ',
                headerClassName: 'has-text-left',
                accessor: 'accountTel',
                maxWidth: 120
            },
            {
                Header: 'วันที่',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'created',
                maxWidth: 200,
                Cell: props => moment(props.value).format('lll')
            },
            {
                Header: 'สถานะ',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'isStatus',
                Cell: props => {
                    const colors = [{ status: 'WAITING', color: 'warning' }, { status: 'ACTIVE', color: 'success' }, { status: 'REJECT', color: 'danger' }]
                    const value = colors.find(f => f.status == props.value);
                    return (
                        <span className={`tag is-${value.color}`}>
                            {props.value}
                        </span>
                    )
                },
                maxWidth: 100
            },
            {
                Header: 'จัดการ',
                headerClassName: 'has-text-centered',
                Cell: props => {
                    // console.log(props.original.id, '=', this.state.auth.account, props.original.id == this.state.auth.account)
                    return (
                        <div className="field is-grouped is-grouped-centered">
                            <div className="control">
                                <Link className="button is-small" to={`/accounts/edit/${props.original.accountId}`}>แก้ไข</Link>
                            </div>
                            {props.original.isStatus == 'ACTIVE' &&
                                <div className="control">
                                    <button className={`button is-small ${(props.original.accountId == this.state.auth.account.accountId) && 'is-link'}`}
                                        onClick={(e) => this.onSelectedClick(props.original.accountId, e)}>
                                        <span className="icon"><IoMdLogIn /></span>&nbsp;เลือก
                                </button>
                                </div>
                            }
                        </div>
                    )
                }
            },
        ]
        // console.log('render',this.state.accounts)
        return (
            <div className="box">
                <nav className="level">
                    <div className="level-left">
                        <Link className="button is-link is-rounded is-hovered" to="/accounts/add">เพิ่ม</Link>
                    </div>
                    <div className="level-right">
                        <div className="field">
                            <p className="control is-expanded has-icons-left">
                                <input className="input" type="text" placeholder="ค้นหา"
                                    value={this.state.search}
                                    onChange={(e) => this.setState({ search: e.target.value })} />
                                <span className="icon is-small is-left">
                                    <FaSearch />
                                </span>
                            </p>
                        </div>
                    </div>
                </nav>
                <ReactTable className="table -highlight"
                    data={Selectors(this.state.accounts, this.state.search)}
                    // data={this.state.accounts}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={10}
                    defaultSorted={[
                        {
                            id: "isStatus",
                        },
                        {
                            id: "created",
                        }
                    ]}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    accounts: state.accounts
});

const mapDispatchToProps = (dispatch) => ({
    startGetAccounts: (auth) => dispatch(startGetAccounts(auth)),
    setAccounts: (accounts) => dispatch(setAccounts(accounts)),
    startSetAccountUser: (email, account) => dispatch(startSetAccountUser(email, account))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
