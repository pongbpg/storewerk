import React from 'react';
import { Link } from 'react-router-dom';
export class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: props.breadcrumbs || []
        }
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.breadcrumbs != this.state.breadcrumbs) {
    //         this.setState({ breadcrumbs: nextProps.breadcrumbs });
    //     }
    // }
    render() {
        const len = this.state.breadcrumbs.length || 0;
        let pathx = '';
        return (
            <div className="container">
                <nav className="breadcrumb is-small" aria-label="breadcrumbs" style={{ marginTop: '64px' }}>
                    <ul>
                        {this.state.breadcrumbs.map((bc, i) => {
                            let size = 4 + i;
                            pathx += bc.link
                            if (size > 6)
                                size = 6
                            return (
                                <li key={i} className={(i + 1) == len ?'is-active':''}>
                                    <Link to={pathx} className="title is-5">{bc.name}</Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        )
    }
}
export default Breadcrumb;