import React from 'react';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
export class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            accountId: '',
            loading: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }
    onSearchClick = () => {
        console.log(this.state.accountId)
    }
    render() {
        return (
            <div className="container">
                <div className="box" style={{ height: '400px' }}>
                    <div className="column has-text-left">
                        <h3 className="subtitle">เลขที่ผู้เสียภาษี</h3>
                    </div>
                    <div className="field has-addons">
                        <div className="control is-expanded">
                            <NumberFormat className="input has-text-centered is-medium"
                                value={this.state.accountId}
                                isNumericString={true}
                                format="#-####-#####-##-#"
                                mask="_"
                                disabled={this.state.loading != ''}
                                onValueChange={(values) => {
                                    const { formattedValue, value, floatValue } = values;
                                    this.setState({ accountId: value })
                                }} />
                            {/* <input className="input has-text-centered is-medium" placeholder=""
                                value={this.state.accountId} onChange={e => this.setState({ accountId: e.target.value })} /> */}
                        </div>
                        <div className="control">
                            <button className="button is-link is-medium"
                                onClick={this.onSearchClick}>ค้นหา</button>
                        </div>
                    </div>
                </div >
                <p>
                    <Link to="/accounts/add" className="button is-text has-text-dark">ลงทะเบียนใหม่</Link> &nbsp;·&nbsp;
                        <a href="../" className="button is-text">ลืมรหัสบัญชี</a> &nbsp;·&nbsp;
                        <a href="../" className="button is-text">ต้องการความช่วยเหลือ?</a>
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
