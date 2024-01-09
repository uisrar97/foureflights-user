/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import Helmet from "react-helmet";

import Navigation from '../../components/Navigation';
import Sections from './../../components/HomepageSections/Sections';
import Footer from './../../components/Footer';


export default function HomePage() {
  const pagelocation = 'Homepage';
  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Navigation />
      <Sections />
      <Footer />
    </React.Fragment>
  );
}
