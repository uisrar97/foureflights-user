import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plane } from 'react-loader-spinner';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { LoaderMain, FailedBooking } from '../../FlightList/PaymentConfirmation/wrapper/ConfirmPaymentStyle';
import { makeSelectMultiSearchObj } from '../MultiTravellerDetails/selectors';
import ErrorBoundary from '../../../helper/ErrorBoundary';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import TravelportBooking from './TravelportBooking';
import AirblueBooking from './AirblueBooking';

export function MultiFlightBooking ({ multiSearch })
{
    window.scrollTo(0,0);
    const { multiBooking, query } = multiSearch;
    const { bookRes, loading } = multiBooking;

    const providerFilter = () => {
        if (bookRes.data.provider_type === 'travelport')
        {
            return <TravelportBooking bookingData={bookRes} query={query} />
        }
        else if (bookRes.data.provider_type === 'hitit')
        {
        }
        else if (bookRes.data.provider_type === 'airblue')
        {
            return <AirblueBooking bookingData={bookRes} query={query} />
        }
    }

    return(
        <>
            <Helmet>
                <title>Multi Booking | Four-E</title>
                <meta name="description" content="#" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Navigation />
            <ErrorBoundary>
                {
                    (loading) ?
                        <LoaderMain>
                            <h3>Please be patient. Your Details are being retrieved!</h3>
                            <Plane color="#378edd" secondaryColor="#378edd" />
                        </LoaderMain>
                    :
                        (Object.keys(bookRes).length > 0 && bookRes.status === '200') ?
                            providerFilter()
                        :
                            <FailedBooking className="d-flex flex-column">
                                <h4>Booking Unsuccessful. Please Try Again.</h4>
                                <div className="foot">
                                <Link to="/">Go Back to Homepage</Link>
                                </div>
                            </FailedBooking>
                            
                }
            </ErrorBoundary>
            <Footer />
        </>
    );
}

const mapStateToProps = createStructuredSelector({
    multiSearch: makeSelectMultiSearchObj(),
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({  }, dispatch);
};

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(withConnect)(MultiFlightBooking);