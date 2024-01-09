/**
 *
 * HotelBookingConfirmation
 *
 */

import React, { useState, useEffect, createRef } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { useInjectSaga } from "../../../utils/injectSaga";
import { useInjectReducer } from "../../../utils/injectReducer";
import makeSelectHotelBookingConfirmation from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import InputMask from "react-input-mask";
import Axios from "../../../utils/service";
import { Plane } from "react-loader-spinner";
import Helmet from "react-helmet";
// import { PDFViewer } from '@react-pdf/renderer';
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import {
  ConfirmParent,
  FailedBooking,
  PaymentLoader,
} from "./wrapper/hotelBookingResStyle";
import EasypaisaLogo from "../../../assets/img/Easypaisa.webp";
import ComingSoon from "../../../assets/img/com.jpg";
import CancelModal from "../../../helper/CancelModal";
import {
  date_convert,
  ShowAlert,
  savePdf,
} from "../../../helper/ConvertFunctions";
import Document from "./component/hotelBookingPDF";

export function HotelBookingConfirmation({ hotelBookingRes }) {
  useInjectReducer({ key: "hotelBookingConfirmation", reducer });
  useInjectSaga({ key: "hotelBookingConfirmation", saga });
  const { loading } = hotelBookingRes;
  const ref = createRef();

  const hotelBookingResponse =
    loading !== undefined ? hotelBookingRes.hotelBookingResponse : false;

  const creationDate = Date();
  const history = useNavigate();

  const dueDate = () => {
    let due = new Date().setHours(23, 59, 59);
    let due2 = new Date(due);

    var hours = due2.getHours();
    var minutes = due2.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;

    return date_convert(due2) + " " + strTime;
  };

  const [cancel, setCancel] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [cancelRes, setCancelRes] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [JazzAC, setJazzAC] = useState("");
  const [CNIC, setCNIC] = useState("");
  const [JazzPay, setJazzPay] = useState(false);
  const [PayType, setPayType] = useState("");
  const [PayNowChck, payNowCheck] = useState(false);
  const [PayLaterChck, payLaterCheck] = useState(true);
  const [JazzWallet, showJazzWallet] = useState(false);
  const [EasyWallet, showEasyWallet] = useState(false);
  const [card, showCard] = useState(false);
  const [failedBooking, setFailedBooking] = useState(false);
  const [JazzBtn, setJazzBtn] = useState(true);
  const [PayResponse, setPayResponse] = useState("");
  const [Loading, setloading] = useState(true);

  const ModalToggle = () => {
    setShowModal(!showModal);
  };

  function showPaymentFields(vals) {
    payNowCheck(vals[0]);
    payLaterCheck(vals[1]);
    showJazzWallet(vals[2]);
    showEasyWallet(vals[3]);
    showCard(vals[4]);
  }

  let cancelObj = {};
  let InvoiceData = {};
  let hotel = {};
  let rooms = [];
  let Price = 0;
  let lastName = "";

  if (hotelBookingResponse !== false && !loading) {
    Price = hotelBookingResponse.data.totalPrice;
    lastName = hotelBookingResponse.data.customerData.lName;
    InvoiceData = {
      invoice_date: creationDate,
      due_date: dueDate(),
      pnr: hotelBookingResponse.data.PNR,
      customer_name:
        hotelBookingResponse.data.customerData.title +
        ". " +
        hotelBookingResponse.data.customerData.fName +
        " " +
        hotelBookingResponse.data.customerData.lName,
      nationality: hotelBookingResponse.data.customerData.nationality,
      cnic:
        hotelBookingResponse.data.customerData.cnic !== null
          ? hotelBookingResponse.data.customerData.cnic
          : false,
      dob: hotelBookingResponse.data.customerData.DOB,
      contact: hotelBookingResponse.data.customerData.contact,
      email: hotelBookingResponse.data.customerData.email,
      price: `PKR ${hotelBookingResponse.data.totalPrice}`,
      passport:
        hotelBookingResponse.data.customerData.cnic === null
          ? hotelBookingResponse.data.customerData.passport
          : false,
      passportExp:
        hotelBookingResponse.data.customerData.cnic === null
          ? hotelBookingResponse.data.customerData.passportExpiry.replaceAll(
              "-",
              " "
            )
          : false,
    };
    hotel = {
      hName: hotelBookingResponse.data.hotelName,
      checkin: hotelBookingResponse.data.searchQuery.checkin.replaceAll(
        "-",
        " "
      ),
      checkout: hotelBookingResponse.data.searchQuery.checkout.replaceAll(
        "-",
        " "
      ),
      city: hotelBookingResponse.data.searchQuery.sName,
    };
    rooms = hotelBookingResponse.data.rooms;
    cancelObj = {
      pnr: hotelBookingResponse.data.PNR,
      reservationCode: "Not Found",
    };
  }

  // PDF Print Function
  function print() {
    savePdf(
      <Document InvoiceData={InvoiceData} hotel={hotel} rooms={rooms} />,
      "4E - Hotel Booking Information.pdf"
    );
  }

  function JazzPaySubmit() {
    setJazzPay(true);
    setPayType("jazzcash");
  }

  const JazzPayBtn = () => {
    if (CNIC.length === 6 && JazzAC.length === 11) {
      setJazzBtn(false);
    } else {
      setJazzBtn(true);
    }
  };

  async function cancelBookings() {
    if (cancel) {
      Axios.get(
        `api/cancelrequest?pnr=${cancelObj.pnr}&provider_type=hotel&ticket_reservation_code=${cancelObj.reservationCode}`
      ).then((response) => {
        const res = response.data;
        setCancelRes(res);
        setLoadings(false);
      });
    }
  }
  async function Payment() {
    if (JazzPay) {
      Axios.get(
        `api/paynow?pnr=${InvoiceData.pnr}&account_number=${JazzAC}&cnic=${CNIC}&account_type=${PayType}&total_amount=${Price}&payment_for=Hotels`
      ).then((response) => {
        const res = response.data;
        setPayResponse(res);
        if (res.status === "200") {
          setFailedBooking(false);
        } else if (res.status === "400") {
          setFailedBooking(true);
        }
        setJazzPay(false);
        setloading(false);
      });
    }
  }
  useEffect(() => {
    if (JazzPay) {
      Payment();
    }
    if (!Loading && PayResponse.status === "200") {
      history({
        pathname: `/get-hotel-booking/cnr=${InvoiceData.pnr}&last_name=${lastName}`,
      });
    }
    if (!Loading && PayResponse.status !== "200") {
      setloading(true);
    }
    if (cancel) {
      cancelBookings();
    }
    if (CNIC.length > 0 || JazzAC.length > 0) {
      JazzPayBtn();
    }
  }, [cancel, CNIC, JazzAC, JazzPayBtn]);

  return (
    <>
      <Helmet>
        <title>
          {loading
            ? "Loading | Four-E"
            : !hotelBookingResponse.statuss
            ? hotelBookingResponse.status === "200"
              ? "Booking Successfull | Four-E"
              : "Booking Unsuccessfull | Four-E"
            : "Four-E"}
        </title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      <ErrorBoundary>
        {loading ? (
          <div className="hotel-confirmation">
            <h3 className="mb-4">
              Please be patient. Your Details are being retrieved!
            </h3>
            <Plane color="#378edd" />
          </div>
        ) : hotelBookingResponse !== false ? (
          hotelBookingResponse.status &&
          hotelBookingResponse.status === "200" ? (
            <ConfirmParent>
              {!failedBooking ? (
                <>
                  <div
                    className="main"
                    style={{ opacity: showModal ? "0.5" : "1" }}
                  >
                    {/* Payment Info Start */}
                    <div className="foot container">
                      <div className="PayInfo py-3">
                        <h3>Payment Method</h3>
                        <h6 className="pt-2">
                          Click on Pay Later to View Reservation
                        </h6>
                        <div className="d-flex mt-3 mb-3 justify-content-center">
                          <div className="col-sm-6 col-md-3 col-lg-3">
                            <div className="d-flex flex-row">
                              <input
                                type="radio"
                                id="paynow"
                                name="pay"
                                value="PayNow"
                                onChange={showPaymentFields.bind(this, [
                                  true,
                                  false,
                                  true,
                                  false,
                                  false,
                                ])}
                                checked={PayNowChck}
                              />
                              <label htmlFor="paynow" className="pay-label">
                                Pay Now
                              </label>
                            </div>
                          </div>
                          <div className="col-sm-6 col-md-3 col-lg-3">
                            <div className="d-flex flex-row">
                              <input
                                type="radio"
                                id="paylater"
                                name="pay"
                                value="PayLater"
                                onChange={showPaymentFields.bind(this, [
                                  false,
                                  true,
                                  false,
                                  false,
                                  false,
                                ])}
                                checked={PayLaterChck}
                              />
                              <label htmlFor="paylater" className="pay-label">
                                Pay Later
                              </label>
                            </div>
                          </div>
                        </div>
                        {PayNowChck && (
                          <div className="row justify-content-center mb-3">
                            <div className="col-sm-4 col-md-4 col-lg-4 d-flex">
                              <div className="d-flex flex-row col-12">
                                <input
                                  type="radio"
                                  id="jazzcash"
                                  name="method"
                                  value="Jazzcash"
                                  onChange={showPaymentFields.bind(this, [
                                    true,
                                    false,
                                    true,
                                    false,
                                    false,
                                  ])}
                                  checked={JazzWallet}
                                />
                                <label className="pay-label" htmlFor="jazzcash">
                                  JazzCash
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 d-flex">
                              <div className="d-flex flex-row col-12">
                                <input
                                  type="radio"
                                  id="easypaisa"
                                  name="method"
                                  value="Easypaisa"
                                  onChange={showPaymentFields.bind(this, [
                                    true,
                                    false,
                                    false,
                                    true,
                                    false,
                                  ])}
                                />
                                <label
                                  className="pay-label"
                                  htmlFor="easypaisa"
                                >
                                  EasyPaisa
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 d-flex">
                              <div className="d-flex flex-row col-12">
                                <input
                                  type="radio"
                                  id="card"
                                  name="method"
                                  value="Card"
                                  onChange={showPaymentFields.bind(this, [
                                    true,
                                    false,
                                    false,
                                    false,
                                    true,
                                  ])}
                                />
                                <label className="pay-label" htmlFor="card">
                                  Credit / Debit Card
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        {card && PayNowChck && (
                          <>
                            <div className="row justify-content-center">
                              <img
                                alt="Coming Soon"
                                src={ComingSoon}
                                className="cmng-soon w-50"
                              />
                            </div>
                          </>
                        )}
                        {EasyWallet && PayNowChck && (
                          <div className="row justify-content-center">
                            <img
                              alt="Coming Soon"
                              src={EasypaisaLogo}
                              className="cmng-soon"
                            />
                          </div>
                        )}
                        {JazzWallet && PayNowChck && (
                          <>
                            <div className="row justify-content-center mb-3">
                              <div className="col-md-4 pt-3 pb-3">
                                <InputMask
                                  mask="03999999999"
                                  className="form-control text-dark"
                                  type="text"
                                  onChange={(event) => {
                                    setJazzAC(
                                      event.target.value.replaceAll("_", "")
                                    );
                                  }}
                                  value={JazzAC}
                                  name="JazzAccount"
                                  placeholder="Enter JazzCash Account Number"
                                  min="11"
                                  max="11"
                                />
                                <label className="warning text-danger text-left">
                                  {JazzAC && JazzAC && JazzAC.length === 2
                                    ? "JazzCash Account Number is Required"
                                    : JazzAC &&
                                      JazzAC.length > 2 &&
                                      JazzAC.length < 11 &&
                                      "Provide Complete JazzCash Account Number"}
                                </label>
                              </div>
                              <div className="col-md-4 pt-3 pb-3">
                                <InputMask
                                  mask="999999"
                                  className="form-control text-dark"
                                  type="text"
                                  onChange={(event) => {
                                    setCNIC(
                                      event.target.value.replaceAll("_", "")
                                    );
                                  }}
                                  value={CNIC}
                                  name="CNICNmbr"
                                  placeholder="Enter Last 6 CNIC Digits"
                                  min="6"
                                  max="6"
                                />
                                <label className="warning text-danger text-left">
                                  {CNIC && CNIC && CNIC.length === 0
                                    ? "CNIC Number is Required"
                                    : CNIC &&
                                      CNIC.length > 0 &&
                                      CNIC.length < 6 &&
                                      "Provide Complete CNIC Number"}
                                </label>
                              </div>
                            </div>
                            <div className="row justify-content-center">
                              <button
                                onClick={JazzPaySubmit}
                                style={{ color: "white" }}
                                disabled={JazzBtn && true}
                              >
                                Pay Now
                              </button>
                            </div>
                            {JazzPay ? (
                              <PaymentLoader className="w-100 h-100 position-absolute d-flex align-items-center">
                                <div className="main">
                                  <div className="text-center">
                                    <h3>
                                      Please be Patient! We are Processing your
                                      Payment
                                    </h3>
                                    <Plane
                                      color="#378edd"
                                      secondaryColor="#378edd"
                                    />
                                  </div>
                                </div>
                              </PaymentLoader>
                            ) : (
                              !Loading &&
                              (PayResponse.status === "200" ||
                                PayResponse.status === "400") && (
                                <>
                                  {ShowAlert(
                                    PayResponse.status,
                                    PayResponse.message
                                  )}
                                </>
                              )
                            )}
                            {/* <div className="row justify-content-center mb-3">
                                    <img alt='Coming Soon' src={ComingSoon} className="cmng-soon w-50" />
                                  </div> */}
                          </>
                        )}
                        {PayLaterChck && (
                          <>
                            <div className="row justify-content-center mb-3">
                              <h5 className="col-sm-12 col-md-12 col-lg-4 font-weight-bold">
                                Ticketing Time Limit:{" "}
                              </h5>
                              <p className="col-sm-12 col-md-12 col-lg-4 text-dark">
                                {dueDate()}
                              </p>
                            </div>
                            <div className="row justify-content-center">
                              <a onClick={print}>
                                Download Reservation & Invoice
                              </a>
                              <Link
                                to="/"
                                style={{ color: "white", marginBottom: "10px" }}
                              >
                                Go to Home
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Payment Method End */}
                    {PayLaterChck && (
                      <>
                        <div className="success container" ref={ref}>
                          <div className="success-head col-md-12">
                            <div className="col-md-3 m-auto">
                              <img alt="Logo" src={"/logo.webp"} height="50" />
                            </div>
                            <div className="col-md-6">
                              <h2>E-Hotel Reservation</h2>
                            </div>
                            <div className="col-md-3 mt-4">
                              <Link to="/">https://foureflights.com/</Link>
                            </div>
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
                              {!InvoiceData.cnic && (
                                <div className="PAX-inner-row">
                                  <h4>Passport Number: </h4>
                                  <p>{InvoiceData.passport}</p>
                                </div>
                              )}
                              <div className="PAX-inner-row">
                                <h4>Total Amount: </h4>
                                <p>{InvoiceData.price}</p>
                              </div>
                              {InvoiceData.cnic && (
                                <div className="PAX-inner-row">
                                  <h4>Booking Status: </h4>
                                  <p>
                                    <span className="badge badge-warning">
                                      Incomplete
                                    </span>
                                  </p>
                                </div>
                              )}
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
                              {InvoiceData.cnic ? (
                                <div className="PAX-inner-row">
                                  <h4>CNIC: </h4>
                                  <p>{InvoiceData.cnic}</p>
                                </div>
                              ) : (
                                <div className="PAX-inner-row">
                                  <h4>Passport Expiry: </h4>
                                  <p>{InvoiceData.passportExp}</p>
                                </div>
                              )}
                              {!InvoiceData.cnic && (
                                <div className="PAX-inner-row">
                                  <h4>Booking Status: </h4>
                                  <p>
                                    <span className="badge badge-warning">
                                      Incomplete
                                    </span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <hr />
                          <h3>Hotel Details</h3>
                          <div className="PAX-info">
                            <div className="left">
                              <div className="PAX-inner-row">
                                <h4>Hotel: </h4>
                                <p>{hotel.hName}</p>
                              </div>
                              <div className="PAX-inner-row">
                                <h4>Check-In: </h4>
                                <p>{hotel.checkin}</p>
                              </div>
                            </div>
                            <div className="right">
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
                            {rooms.map((room, index) => {
                              return (
                                <div
                                  className="flight-info row mx-0 mb-3"
                                  key={index}
                                >
                                  <div className="col-lg-4 col-md-4 col-sm-4 my-3">
                                    <h5 className="font-weight-bold">
                                      Room Name:{" "}
                                    </h5>
                                    <h6>{room.title}</h6>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-4 my-3">
                                    <h5 className="font-weight-bold">
                                      Quantity:{" "}
                                    </h5>
                                    <h6>{room.qty}</h6>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-4 my-3">
                                    <h5 className="font-weight-bold">
                                      Price Per Night:{" "}
                                    </h5>
                                    <h6>{`PKR ${room.price}`}</h6>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="agent">
                            <h3>Agent Details</h3>
                            <p>BUKHARI TRAVEL SERVICES</p>
                            <p>2-Mohammadi Plaza, Blue Area, Islamabad</p>
                            <p>Pakistan</p>
                            <p>Phone: +92-51-28282562</p>
                          </div>
                        </div>
                        <div className="cancel-btn-div text-center">
                          <a
                            className="mt-3 p-2 rounded btn-danger cursor-pointer"
                            onClick={() => setShowModal(true)}
                            data-toggle="modal"
                            data-target="#cancelModal"
                          >
                            Cancel Booking
                          </a>
                        </div>
                      </>
                    )}
                    {/* <PDFViewer style={{width: '100%', height: '1300px'}}>
                               <Document InvoiceData={InvoiceData} hotel={hotel} rooms={rooms} />
                             </PDFViewer> */}
                  </div>
                  {showModal && (
                    <CancelModal
                      ModalToggle={ModalToggle}
                      showModal={showModal}
                      setCancel={setCancel}
                      loadings={loadings}
                      cancelRes={cancelRes}
                    />
                  )}
                </>
              ) : (
                <FailedBooking className="d-flex flex-column ml-auto mr-auto">
                  <h5>Reservation Details have been Emailed to you.</h5>
                  <div className="foot">
                    <Link to="/">Go to Home</Link>
                  </div>
                </FailedBooking>
              )}
            </ConfirmParent>
          ) : (
            <FailedBooking className="d-flex flex-column">
              <h4>Booking Unsuccessful. Please Try Again.</h4>
              <div className="foot">
                <Link to="/">Go Back to Homepage</Link>
              </div>
            </FailedBooking>
          )
        ) : (
          <FailedBooking className="d-flex flex-column">
            <h4>Booking Unsuccessful. Please Try Again.</h4>
            <div className="foot">
              <Link to="/">Go Back to Homepage</Link>
            </div>
          </FailedBooking>
        )}
      </ErrorBoundary>
      <Footer />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  hotelBookingRes: makeSelectHotelBookingConfirmation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(HotelBookingConfirmation);
