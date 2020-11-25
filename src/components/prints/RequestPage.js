import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { checkPermission } from '../../api/permissions';
import { printRequest } from '../../api/prints';
import moment from 'moment';
import querySting from 'query-string'
import Select from 'react-select';
import Money from '../../selectors/money'
import _, { isNull } from 'underscore';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            query: props.location.search,
            data: [],
            groups: { value: null },
            cols: 3,
            isCol: 4,
            decimal: 0,
            isPrint: false,
            // queryString: querySting.parse(atob(props.location.search.substring(1)))
        }
        if (props.location.search) {
            let obj = querySting.parse(atob(props.location.search.substring(1)));
            if (obj.id) {
                let ids = obj.id.split(',')
                checkPermission(props.auth.account.accountId, props.auth.email, 'REQUESTED', 'READ')
                    .then(res => {
                        if (res.data.result) {
                            printRequest(props.auth.account.accountId, ids)
                                .then(res2 => {
                                    this.setState({ data: res2.data })
                                })
                                .catch(err2 => {
                                    alert('Error กรุณาเปิดใหม่อีกครั้ง')
                                    window.close()
                                })
                        } else {
                            alert('คุณไม่มีสิทธิ์ใช้รายงานนี้')
                            window.close();
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.isPrint) {
            window.print();
        }
    }
    onSelectGroups = (groups) => {
        this.setState({
            groups: isNull(groups) ? { value: null } : groups
        });
    };
    onColsChange = (e) => {
        const cols = e.target.value;
        if (cols > 0 && cols < 5) {
            this.setState({
                cols,
                isCols: 12 / cols
            })
        }
    }
    onDecimalChange = (e) => {
        const decimal = e.target.value;
        if (decimal >= 0 && decimal <= 4) {
            this.setState({
                decimal
            })
        }
    }
    render() {
        // const obj = querySting.parse(atob(this.state.query.substring(1)))
        const groups = this.state.groups;
        const len = this.state.data.length;
        let tempData = JSON.parse(JSON.stringify(this.state.data)).map(m => {
            const customerName = m.orderTypeId == 'IN' ? m.supplierName : m.customerName
            return {
                ...m,
                customerName,
                orderDate: moment(m.orderDate).format('l')
            }
        })

        if (!isNull(groups.value) && Object.keys(groups).length > 0) {
            tempData = _.chain(tempData)
                .groupBy(value => {
                    if (groups.value == 'product') {
                        return value.categoryId + '#' + value.productId
                    } else {
                        return value.categoryId + '#' + value.productId + '#' + value.customerName
                    }
                })
                .map((mm, ii) => {
                    return {
                        categoryName: mm[0].categoryName,
                        productName: mm[0].productName,
                        quantity: mm.reduce((r, l) => r + l.quantity, 0),
                        productImg: mm[0].productImg,
                        unitName: mm[0].unitName,
                        customerName: groups.value == 'customer' ? mm[0].customerName : '',
                        orderDate: mm.map(mmm => {
                            const res = mmm.orderDate + ' (' + Money(mmm.quantity, this.state.decimal) + ' ' + mmm.unitName + ')'
                            if (groups.value == 'product') {
                                return mmm.customerName + ' ' + res
                            } else {
                                return res
                            }
                        })
                    }
                })
                .value();
        }
        const data = new Array(Math.ceil(len / this.state.cols)).fill().map(_ => tempData.splice(0, this.state.cols));
        return <section className="hero">
            <div className="hero-body">
                <div className="container">
                    <div className="columns">
                        <div className="column is-4">
                            <h1 className="title">ใบแสดงรายการสินค้า</h1>
                            <h2 className="subtitle">{this.state.auth.account.accountName}</h2>
                            <button className="button" onClick={e => {
                                this.setState({ isPrint: !this.state.isPrint })//.bind(window.print())
                            }}>{!this.state.isPrint ? 'Print' : 'รายการสินค้า'}</button>
                        </div>
                        {!this.state.isPrint && <div className="column is-5">
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="field has-addons">
                                        <p className="control">
                                            <a className="button">ทศนิยม</a>
                                        </p>
                                        <p className="control">
                                            <input type="number" className="input" onChange={this.onDecimalChange} value={this.state.decimal} max={4} min={0} />
                                        </p>
                                    </div>
                                </div>
                                <div className="column is-6">
                                    <div className="field has-addons">
                                        <p className="control">
                                            <a className="button">คอลั่ม</a>
                                        </p>
                                        <p className="control">
                                            <input type="number" className="input" onChange={this.onColsChange} value={this.state.cols} max={4} min={1} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {!this.state.isPrint && <div className="column is-3">
                            <Select
                                placeholder={<div>Type to search</div>}
                                value={this.state.groups}
                                onChange={this.onSelectGroups}
                                isClearable
                                options={[
                                    { label: 'ชื่อสินค้า', value: 'product' },
                                    { label: 'ชื่อลูกค้า', value: 'customer' }
                                ]} />
                        </div>}
                    </div>
                    {data.length > 0 && data.map((d, i) => {
                        return (<div className="columns" key={i}>
                            {d.map((d2, i2) => {
                                return (<div className={`column is-${this.state.isCol}`} key={i2}>
                                    <div className="card">
                                        <div className="card-image">
                                            <figure className="image is-square">
                                                <img src={d2.productImg} alt="No Image" />
                                            </figure>
                                        </div>
                                        <div className="card-content">
                                            <div className="media">
                                                {/* <div className="media-left"> </div> */}
                                                <div className="media-content">
                                                    <p className="title is-4">{d2.productName} {Money(d2.quantity, this.state.decimal)} {d2.unitName}</p>
                                                    <p className="subtitle is-6">ประเภท: {d2.categoryName}</p>
                                                    {!isNull(this.state.groups.value) && (<p className="subtitle is-6">{d2.customerName}</p>)}
                                                    {Array.isArray(d2.orderDate)
                                                        ? d2.orderDate.map(d3 => (<p key={d3} className="subtitle is-6">{d3}</p>))
                                                        : (<p className="subtitle is-6">{d2.customerName} {d2.orderDate}</p>)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>);
                            })}
                        </div>)
                    })}

                </div>
            </div>
        </section >
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
