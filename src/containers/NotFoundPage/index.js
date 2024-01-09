/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import Helmet from "react-helmet";
import { Link } from 'react-router-dom';
import Navigation from './../../components/Navigation';
import Footer from './../../components/Footer';

import messages from './messages';

export default function NotFound() {
  const pagelocation = '404 Not Found';
  return (
    <>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
      </Helmet>
      <Navigation />
      <div className="container">
        <div className="row" style={{height: '75vh'}}>
          <div className="col-md-12 align-self-center">
            <div className="row justify-content-center">
              <h2>{messages.header.defaultMessage}</h2>
            </div>
            <div className="row justify-content-center not-found mt-2" style={{height: 'unset'}}>
              <Link to="/">Go Back to Homepage</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer  />
    </>
  );
}
