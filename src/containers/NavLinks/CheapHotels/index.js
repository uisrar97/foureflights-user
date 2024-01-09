import React from 'react';
import Helmet from "react-helmet";
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';

export default function CheapHotels()
{
    const pagelocation = 'Cheap Hotels';
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
                    <h1 className="mb-3 nav-link-head">Cheap Hotels</h1>
                    <div className="col-sm-12 col-md-12 col-lg-12 text-justify">
                        <h5>Content Will be Placed Here</h5>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}