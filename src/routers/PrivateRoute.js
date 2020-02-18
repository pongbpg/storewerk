import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Bredcrumb from '../components/Breadcrumb';
export const PrivateRoute = ({
    isAuthenticated,
    isRegistered,
    component: Component,
    breadcrumbs: breadcrumbs,
    ...rest
}) => (
        <Route {...rest} component={(props) => (
            isAuthenticated ?
                (
                    <section className="font-sarabun">
                        <Header />
                        <section className="hero is-link is-fullheight is-bold" >
                            {breadcrumbs.length > 0 &&
                                <div className="hero-head">
                                    <Bredcrumb breadcrumbs={breadcrumbs} />
                                </div>
                            }
                            <div className="hero-body" style={{ paddingTop: '32px' }}>
                                <div className="container">
                                    <Component {...props} />
                                </div>
                            </div>
                        </section >
                    </section>
                )
                : (
                    <Redirect to="/login" />
                )
        )} />
    );

const mapStateToProps = (state) => {
    return {
        isAuthenticated: !!state.auth.uid
    }
};

export default connect(mapStateToProps)(PrivateRoute);