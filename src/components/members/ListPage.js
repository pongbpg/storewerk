import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import Selectors from '../../selectors/members';
import { startGetMembers } from '../../actions/members'
import { FaSearch } from 'react-icons/fa';
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            search: '',
            members: props.members || [],
            isModal: false,
            member: {},
            loading: ''
        }
        this.props.startGetMembers(props.auth.account.accountId)
        if (props.auth.account.accountId == '') {
            alert('คุณยังไม่ได้เลือกบัญชี!!')
            history.push('/accounts')
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (JSON.stringify(nextProps.members) != JSON.stringify(this.state.members)) {
            this.setState({ members: nextProps.members });
        }
    }
    // onRemoveClick = (code, e) => {
    //     this.setState({ isModal: true, member: this.state.members.find(f => f.code == code) })
    // }
    // onConfirmRemove = (e) => {
    //     this.setState({ loading: 'is-loading' })
    //     this.props.startRemoveAccountArray('members', { taxid: this.state.auth.account.taxid, value: this.state.member })
    //         .then(res => {
    //             this.setState({ loading: '', isModal: false })
    //         })
    // }
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
                accessor: 'memberId'
            },
            {
                Header: 'ชื่อ',
                headerClassName: 'has-text-left',
                className: 'has-text-left',
                accessor: 'memberName'
            },
            {
                Header: 'ที่อยู่',
                headerClassName: 'has-text-left',
                className: 'has-text-left',
                accessor: 'memberAddr'
            },
            {
                Header: 'เบอร์ติดต่อ',
                headerClassName: 'has-text-centered',
                className: 'has-text-centered',
                accessor: 'memberTel'
            },
            {
                Header: 'จัดการ',
                headerClassName: 'has-text-centered',
                Cell: props => {
                    return (
                        <div className="field is-grouped is-grouped-centered">
                            <div className="control">
                                <Link className="button is-small" to={`/members/edit/${props.original.memberId}`}>แก้ไข</Link>
                            </div>
                            {/* <div className="control">
                                <button className="button is-small is-danger" onClick={(e) => this.onRemoveClick(props.original.code, e)}>ลบ</button>
                            </div> */}
                        </div>
                    )
                }
            },
        ]
        return (
            <div className="box">
                <nav className="level">
                    <div className="level-left">
                        <Link className="button is-link is-rounded is-hovered" to="/members/add">เพิ่ม</Link>
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
                    data={Selectors(this.state.members, this.state.search)}
                    columns={columns}
                    resolveData={data => data.map(row => row)}
                    defaultPageSize={10}
                />
                <div className={`modal  is-danger ${this.state.isModal && 'is-active'}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title has-text-danger">ลบผู้ติดต่อ</p>
                            <button className="delete" aria-label="close" onClick={(e) => this.setState({ isModal: false })}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="message is-danger">
                                <div className="message-body">
                                    ต้องการลบ <strong>{this.state.member.memberId}</strong> ({this.state.member.memberName})
                                </div>
                            </div>
                            {/* <p className="has-background-danger"></p> */}
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button" onClick={(e) => this.setState({ isModal: false })}>ยกเลิก</button>
                            <button className={`button is-danger ${this.state.loading}`} onClick={this.onConfirmRemove}>ลบ</button>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    members: state.members
});

const mapDispatchToProps = (dispatch) => ({
    startGetMembers: (accountId) => dispatch(startGetMembers(accountId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
