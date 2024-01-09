/**
 *
 * GetBookingCnr
 *
 */

import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { requestCnrHotel } from './actions';
import makeSelectGetBookingCnr from './selectors';
import reducer from './reducer';
import saga from './saga';
import Axios from '../../utils/service';
import ErrorBoundary from '../../helper/ErrorBoundary';
import CancelModal from '../../helper/CancelModal';
import { Link } from 'react-router-dom';
import { Plane } from 'react-loader-spinner';
// import { PDFViewer } from '@react-pdf/renderer';
import Helmet from "react-helmet";
import Navigation from './../../components/Navigation';
import Footer from './../../components/Footer';
import { useParams } from 'react-router-dom';
import { ConfirmParent, FailedBooking } from '../HotelsList/HotelBookingConfirmation/wrapper/hotelBookingResStyle';
import { date_convert, savePdf } from '../../helper/ConvertFunctions';
import Document from './hotelBookingPDF';

export function GetBookingCnr({ getBookingCnr, requestCnrHotel })
{
  useInjectReducer({ key: 'getBookingCnr', reducer });
  useInjectSaga({ key: 'getBookingCnr', saga });

  const { booking, loading } = getBookingCnr;
  const pagelocation = 'Hotel Booking';
  const params = useParams();

  let split = params.pnr.split('&');
  let cnr = split[0].split('=');
  let lastName = split[1].split('=');

  const paramsObj = useCallback(() => {
    return {
        cnr: cnr[1],
        last_name: lastName[1],
        endpoint: 'api/get-booking-by-cnr'
    }
  }, [cnr, lastName]);

  useEffect(() => {
    try {
      let obj = paramsObj();
      requestCnrHotel(obj);
    } catch (error) {

    }
  }, [paramsObj, requestCnrHotel])

  const dueDate = (date) => {
    let due = new Date(date).setHours(23, 59, 59);
    let due2 = new Date(due);

    var hours = due2.getHours();
    var minutes = due2.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    return date_convert(due2) + ' ' + strTime;
  }

  const [cancel, setCancel] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [cancelRes, setCancelRes] = useState({});
  const [showModal, setShowModal] = useState(false);

  const ModalToggle = () => {
    setShowModal(!showModal);
  }

  let cancelObj = {};
  let InvoiceData = {};
  let hotel = {};
  let rooms = [];

  if (booking !== undefined && !loading) {
    InvoiceData = {
      invoice_date: Date(booking.data.searchQuery.cnr_creation_date),
      due_date: dueDate(new Date(booking.data.searchQuery.cnr_creation_date)),
      pnr: booking.data.customerData.cnr,
      customer_name: booking.data.customerData.title + ". " + booking.data.customerData.fName + " " + booking.data.customerData.lName,
      nationality: booking.data.customerData.nationality,
      cnic: (booking.data.customerData.cnic !== null) ? booking.data.customerData.cnic : false,
      contact: booking.data.customerData.contact,
      email: booking.data.customerData.email,
      price: `PKR ${booking.data.totalPrice}`,
      passport: (booking.data.customerData.cnic === null) ? booking.data.customerData.passport : false,
      passportExp: (booking.data.customerData.cnic === null) ? date_convert(booking.data.customerData.passportExpiry) : false,
      bookingStatus: booking.data.customerData.booking_status,
      title: (booking.data.customerData.booking_status === 'Incompleted') ? 'E-Hotel Booking Reservation' : 'E-Hotel Booking'
    };
    hotel = {
      hName: booking.data.hotelName,
      checkin: booking.data.searchQuery.checkin.replaceAll('-', ' '),
      checkout: booking.data.searchQuery.checkout.replaceAll('-', ' '),
      city: booking.data.searchQuery.sName,
    }
    rooms = booking.data.rooms;
    cancelObj = {
      pnr: booking.data.customerData.cnr,
      reservationCode: 'Not Found',
    };
  }

  async function cancelBookings() {
    if (cancel) {
      Axios.get(`api/cancelrequest?pnr=${cancelObj.pnr}&provider_type=hotel&ticket_reservation_code=${cancelObj.reservationCode}`)
        .then((response) => {
          const res = response.data;
          setCancelRes(res);
          setLoadings(false);
        });
    }
  }
  useEffect(() => {
    if (cancel) {
      cancelBookings();
    }
  }, [cancel, cancelBookings]);

  // PDF Print Function
  function print() {
    savePdf(<Document InvoiceData={InvoiceData} hotel={hotel} rooms={rooms} />,
      "4E - Hotel Booking Information.pdf");
  }

  return (
    <>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      {
        (loading) ?
          <div className="flightlist-loader">
            <h3 className='mb-4'>Please be patient. Your Details are being retrieved!</h3>
            <Plane color="#378edd" secondaryColor="#378edd"/>
          </div>
          :
          (booking !== undefined && booking.status === '200') ?
            <ErrorBoundary>
              <ConfirmParent>
                <div className="main" style={{ opacity: (showModal) ? '0.5' : '1' }}>
                  <div className="success container">
                    <div className="success-head text-center">
                      <h2>{InvoiceData.title}</h2>
                    </div>
                    <hr />
                    <div className="PAX-info">
                      <div className="left">
                        <div className="PAX-inner-row">
                          <h4>Customer: </h4>
                          <p>{InvoiceData.customer_name}</p>
                        </div>
                        <div className="PAX-inner-row">
                          <h4>Booking Reference (CNR): </h4>
                          <p>{InvoiceData.pnr}</p>
                        </div>
                        {
                          (!InvoiceData.cnic) &&
                          <div className="PAX-inner-row">
                            <h4>Passport Number: </h4>
                            <p>{InvoiceData.passport}</p>
                          </div>
                        }
                        <div className="PAX-inner-row">
                          <h4>Total Amount: </h4>
                          <p>{InvoiceData.price}</p>
                        </div>
                        {
                          (InvoiceData.cnic) &&
                          <div className="PAX-inner-row">
                            <h4>Booking Status: </h4>
                            <p>
                              <span className='badge badge-warning'>Incomplete</span>
                            </p>
                          </div>
                        }
                      </div>
                      <div className="right">
                        <div className="PAX-inner-row">
                          <h4>Nationality: </h4>
                          <p>{InvoiceData.nationality}</p>
                        </div>
                        <div className="PAX-inner-row">
                          <h4>CNR Creation Date: </h4>
                          <p>{InvoiceData.invoice_date.slice(0, 15)}</p>
                        </div>
                        {
                          (InvoiceData.cnic) ?
                            <div className="PAX-inner-row">
                              <h4>CNIC: </h4>
                              <p>{InvoiceData.cnic}</p>
                            </div>
                            :
                            <div className="PAX-inner-row">
                              <h4>Passport Expiry: </h4>
                              <p>{InvoiceData.passportExp}</p>
                            </div>
                        }
                        {
                          (!InvoiceData.cnic) &&
                          <div className="PAX-inner-row">
                            <h4>Booking Status: </h4>
                            <p>
                              <span className='badge badge-warning'>Incomplete</span>
                            </p>
                          </div>
                        }
                      </div>
                    </div>
                    <hr />
                    <h3>Hotel Details</h3>
                    <div className="PAX-info">
                      <div className='left'>
                        <div className="PAX-inner-row">
                          <h4>Hotel: </h4>
                          <p>{hotel.hName}</p>
                        </div>
                        <div className="PAX-inner-row">
                          <h4>Check-In: </h4>
                          <p>{hotel.checkin}</p>
                        </div>
                      </div>
                      <div className='right'>
                        <div className="PAX-inner-row">
                          <h4>City: </h4>
                          <p>{hotel.city}</p>
                        </div>
                        <div className="PAX-inner-row">
                          <h4>Check-Out: </h4>
                          <p>{hotel.checkout}</p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h3>Room Details</h3>
                    <div className="flight-info-parent">
                      {
                        rooms.map((room, index) => {
                          return (
                            <div className='flight-info row mx-0 mb-3' key={index}>
                              <div className='col-lg-4 col-md-4 col-sm-4 my-3'>
                                <h5 className='font-weight-bold'>Room Name: </h5>
                                <h6>{room.title}</h6>
                              </div>
                              <div className='col-lg-4 col-md-4 col-sm-4 my-3'>
                                <h5 className='font-weight-bold'>Quantity: </h5>
                                <h6>{room.qty}</h6>
                              </div>
                              <div className='col-lg-4 col-md-4 col-sm-4 my-3'>
                                <h5 className='font-weight-bold'>Price Per Night: </h5>
                                <h6>{`PKR ${room.price}`}</h6>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                    <div className="agent">
                      <h3>Agent Details</h3>
                      <p>BUKHARI TRAVEL SERVICES</p>
                      <p>2-Mohammadi Plaza, Blue Area, Islamabad</p>
                      <p>Pakistan</p>
                      <p>Phone: +92-51-28282562</p>
                    </div>
                    <div className="cancel-btn-div col-md-12 text-center mt-3">
                      <span className="rounded btn btn-primary mr-2 mb-2" onClick={print}>Download PDF</span>
                      <span className="rounded btn btn-danger mr-2 mb-2" onClick={() => setShowModal(true)} data-toggle="modal" data-target="#cancelModal">Cancel Booking</span>
                      <Link className="rounded btn btn-primary mb-2" to="/">Go to Home</Link>
                    </div>
                  </div>
                  {/* <PDFViewer style={{width: '100%', height: '1300px'}}>
                    <Document InvoiceData={InvoiceData} hotel={hotel} rooms={rooms} />
                  </PDFViewer> */}
                </div>
                {
                  (showModal) &&
                  <CancelModal ModalToggle={ModalToggle} showModal={showModal} setCancel={setCancel} loadings={loadings} cancelRes={cancelRes} />
                }
              </ConfirmParent>
            </ErrorBoundary>
            :
            <FailedBooking className="d-flex flex-column">
              <h4>Booking Not Found</h4>
              <div className="foot">
                <Link to="/">Go Back to Homepage</Link>
              </div>
            </FailedBooking>
      }
      <Footer />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  getBookingCnr: makeSelectGetBookingCnr(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { requestCnrHotel },
    dispatch,
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(GetBookingCnr);
