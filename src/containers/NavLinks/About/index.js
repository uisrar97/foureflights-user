import React from 'react';
import Helmet from "react-helmet";
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';

export default function About()
{
    const pagelocation = 'About Us';
    window.scrollTo(0, 0);
    return(
        <>
            <Helmet>
                <title>{pagelocation} | Four-E</title>
                <meta name="description" content="#" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Navigation />
            <div className="d-flex justify-content-center">
                <div className="col-lg-12 text-center mt-5 mb-5">
                    <h1 className="mb-3 nav-link-head">About Four-E Flights</h1>
                    <div className="col-sm-12 col-md-12 col-lg-12 text-justify">
                        <h5>
                            Four-E Flights is an online travel, tours & hotels portal. It is a product owned and offered by Bukhari Group of 
                            Pakistan. Bukhari Group is among the top five travel services provider in Pakistan with a stand-alone largest 
                            network of travel agencies across the country.
                        </h5>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}