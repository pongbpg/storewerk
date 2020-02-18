import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
export class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
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
                            <input className="input has-text-centered is-medium" type="search" placeholder="" />
                        </div>
                        <div className="control">
                            <a className="button is-link is-medium">ค้นหา</a>
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
