import React from 'react';
import { history } from '../routers/AppRouter';
import { connect } from 'react-redux';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth
    }
    // if (!!props.auth.uid) {
    //   history.push('/login')
    // }
    // console.log(!!props.auth.uid)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }

  render() {
    return (
      <div className="hero">
        <div className="hero-body">
          Coming Soon!
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
