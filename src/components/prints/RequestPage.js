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
import _ from 'underscore';
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            query: props.location.search,
            data: [],
            groups: []
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
                                    console.log(res2.data)
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
    onSelectGroups = (groups) => {
        console.log(groups)
        this.setState({
            groups
        });
    };
    render() {
        // const obj = querySting.parse(atob(this.state.query.substring(1)))
        const groups = this.state.groups;
        const len = this.state.data.length;
        const tempData = JSON.parse(JSON.stringify(this.state.data)).map(m => ({ ...m, customerName: m.orderTypeId == 'IN' ? m.supplierName : m.customerName }));
        if (groups.length > 0) {
            let dd = [];
            for (let i = 0; i < groups.length; i++) {
                console.log(_.chain(tempData)
                    .groupBy(groups[i].value)
                    .map((mm, ii) => {
                        
                    })
                    .value());
            }
        }
        const data = new Array(Math.ceil(len / 3)).fill().map(_ => tempData.splice(0, 3));
        return <section className="hero">
            <div className="hero-body">
                <div className="container">
                    <div className="columns">
                        <div className="column is-6">
                            <h1 className="title">ใบแสดงรายการสินค้า</h1>
                            <h2 className="subtitle">{this.state.auth.account.accountName}</h2>
                        </div>
                        <div className="column is-6">
                            <Select placeholder="ลำดับการจัดกลุ่ม"
                                isMulti
                                value={this.state.groups}
                                onChange={this.onSelectGroups}
                                options={[
                                    { label: 'สินค้า', value: 'productName' },
                                    { label: 'วันที่', value: 'orderDate' },
                                    // { label: 'รหัสสั่งซื้อ', value: 'oderId' }
                                ]}
                            />
                        </div>
                    </div>
                    {data.length > 0 && data.map((d, i) => {
                        return (<div className="columns" key={i}>
                            {d.map((d2, i2) => {
                                return (<div className="column is-4" key={i2}>
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
                                                    <p className="title is-4">{d2.productName} {d2.quantity} {d2.unitName}</p>
                                                    <p className="subtitle is-6">ประเภท: {d2.categoryName} วันที่ {moment(d2.orderDate).format('ll')}</p>
                                                    <p className="subtitle is-6">{d2.customerName}</p>
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
