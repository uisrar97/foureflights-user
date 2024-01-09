import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Backtotop extends Component {
    backToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    render() {
        return (
            <Link to="#" className="back-to-top" id="backToTop" onClick={this.backToTop}>
                <i className="fal fa-angle-double-up"/>
            </Link>
        );
    }
}

export default Backtotop;