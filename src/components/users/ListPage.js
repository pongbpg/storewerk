import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startGetUsers } from '../../actions/users'
// import Selectors from '../../selectors/users';
import ReactTable from 'react-table-v6'
import { FaSearch } from 'react-icons/fa';
import 'react-table-v6/react-table.css'
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            users: props.users || []
        }
        this.props.startGetUsers(props.auth.account.accountId);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.users != this.state.users) {
            this.setState({ users: nextProps.users });
        }
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
                Header: 'User',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'userId'
            },
            {
                Header: 'Role',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'roleId'
            },
            {
                Header: 'วันที่',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'created',
                maxWidth: 200,
                Cell: props => moment(props.value).format('lll')
            }
        ]
        return (
            <div className="box">
                <nav className="level">
                    <div className="level-left">
                        <Link className="button is-link is-rounded is-hovered" to="/users/add">เพิ่ม</Link>
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
                    data={this.state.users}
                    // data={this.state.users}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={10}
                    defaultSorted={[
                        {
                            id: "roleId",
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
    users: state.users
});

const mapDispatchToProps = (dispatch) => ({
    startGetUsers: (accountId) => dispatch(startGetUsers(accountId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
