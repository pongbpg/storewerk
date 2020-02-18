import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Bredcrumb from '../components/Breadcrumb';
export const PublicRoute = ({
    isAuthenticated,
    isRegistered,
    breadcrumbs: breadcrumbs,
    component: Component,
    ...rest
}) => (
        <Route {...rest} component={(props) => (
            isAuthenticated ?
                (
                    <section className="font-sarabun" style={{ background: '' }}>
                        <Header />
                        <div className="container" style={{ paddingTop: '0px', minHeight: '100vh' }}>
                            <div className="column is-full">
                                {breadcrumbs.length > 0 &&
                                    <Bredcrumb breadcrumbs={breadcrumbs} />
                                }
                            </div>
                            <div className="column is-full">
                                <Component {...props} />
                            </div>
                        </div>
                        {/* <section className="hero is-warning is-fullheight is-bold" >
                            {breadcrumbs.length > 0 &&
                                <div className="hero-head">
                                    <Bredcrumb breadcrumbs={breadcrumbs} />
                                </div>
                            }
                            <div className="hero-body" style={{ paddingTop: '0px' }}>
                                <div className="container">
                                    <Component {...props} />
                                </div>
                            </div>
                        </section > */}
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

export default connect(mapStateToProps)(PublicRoute);