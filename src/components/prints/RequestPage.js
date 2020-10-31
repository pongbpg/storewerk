import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import moment from 'moment';
import querySting from 'query-string'
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            query: props.location.search,
            // queryString: querySting.parse(atob(props.location.search.substring(1)))
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }

    render() {
        const obj = querySting.parse(atob(this.state.query.substring(1)))
        console.log(obj)
        return (
            <div className="box">
                {atob(this.state.query.substring(1))}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
