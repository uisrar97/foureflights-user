import React, { useEffect, useState, useCallback } from "react";
import BlueArrow from "../../../assets/img/BlueArrow.webp";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import { Link } from "react-router-dom";
import { toUpper } from "lodash";
import {
  ConfirmParent,
  FailedBooking,
  PaymentLoader,
} from "./wrapper/ConfirmPaymentStyle";
// import { PDFViewer } from '@react-pdf/renderer';
import Document from "./component/AirBlueTicketPDF";
import EasypaisaLogo from "../../../assets/img/Easypaisa.webp";
import ComingSoon from "../../../assets/img/com.jpg";
import CancelModal from "../../../helper/CancelModal";
import Axios from "../../../utils/service";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { Plane } from "react-loader-spinner";
import {
  diff_minutes,
  date_convert,
  utc_convert,
  ShowAlert,
  savePdf,
  TextCapitalizeFirst,
} from "../../../helper/ConvertFunctions";
import AirBlueDocPDF from "./AirBlueDocPDF ";

export default function AirblueTicket({ bookingData, query }) {
  const creationDate = Date();
  const history = useNavigate();

  const round = query.legs[0].returnDate === undefined ? false : true;
  let totalFlightTime = diff_minutes(
    bookingData.data.segments[0].DepartureDateTime,
    bookingData.data.segments[0].ArrivalDateTime
  );

  const cabin = query.cabinClass.label;
  const firstSegment = bookingData.data.segments[0];
  const lastSegment = bookingData.data.segments[0];

  const PNR = bookingData.data.BookingReferenceID.ID;
  const BookingInstance = bookingData.data.BookingReferenceID.Instance;
  const Price = bookingData.data.pricing_info.TotalPriceWithCommission;
  const LastName = bookingData.data.passenger_detail[0].lastName;

  const cancelObj = {
    pnr: bookingData.data.BookingReferenceID.ID,
    reservationCode: bookingData.data.BookingReferenceID.Instance,
    provider: bookingData.data.provider_type,
  };
  const [cancel, setCancel] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [cancelRes, setCancelRes] = useState({});
  const [showModal, setShowModal] = useState(false);

  const ModalToggle = () => {
    setShowModal(!showModal);
  };

  let tickets = "";

  if (
    bookingData.data.ticket_details &&
    bookingData.data.ticket_details.length > 0
  ) {
    tickets = bookingData.data.ticket_details;
  }

  const [JazzAC, setJazzAC] = useState("");
  const [CNIC, setCNIC] = useState("");
  const [JazzPay, setJazzPay] = useState(false);
  const [PayType, setPayType] = useState("");
  const [PayResponse, setPayResponse] = useState("");
  const [TicketResponse, setTicketResponse] = useState("");
  const [Loading, setloading] = useState(true);
  const [SaleLoading, setSaleLoading] = useState(true);
  const [FailedTicketing, setFailedTicketing] = useState(false);
  const [JazzBtn, setJazzBtn] = useState(true);
  const [ticketing, setTicketing] = useState(false);

  const JazzPayBtn = () => {
    if (CNIC.length === 6 && JazzAC.length === 11) {
      setJazzBtn(false);
    } else {
      setJazzBtn(true);
    }
  };

  const AirBlueGenerateTicket = useCallback(async () => {
    if (!ticketing && SaleLoading && PayResponse.status === "200") {
      const AirblueTicketAPI = `api/issue-ticket-airblue?pnr=${PNR}&instance=${BookingInstance}&total_amount=${bookingData.data.pricing_info.TotalFare.Amount}`;
      setTicketing(true);
      setSaleLoading(false);
      Axios.get(AirblueTicketAPI).then((response) => {
        const res = response.data;
        setTicketResponse(res);
        setTicketing(false);
      });
    }
  }, [SaleLoading, PayResponse, PNR, BookingInstance, bookingData]);

  const Payment = useCallback(async () => {
    if (JazzPay) {
      Axios.get(
        `api/paynow?pnr=${PNR}&account_number=${JazzAC}&cnic=${CNIC}&account_type=${PayType}&total_amount=${Price}&payment_for=Flights`
      ).then((response) => {
        const res = response.data;
        setPayResponse(res);
        setJazzPay(false);
        setloading(false);
      });
    }
  }, [JazzAC, CNIC, PNR, PayType, Price, JazzPay]);

  const cancelBookings = useCallback(async () => {
    if (cancel) {
      Axios.get(
        `api/cancelrequest?pnr=${cancelObj.pnr}&ticket_reservation_code=${cancelObj.reservationCode}&provider_type=${cancelObj.provider}`
      ).then((response) => {
        const res = response.data;
        setCancelRes(res);
        setCancel(false);
        setLoadings(false);
      });
    }
  }, [cancel, cancelObj]);

  useEffect(() => {
    if (JazzPay) {
      Payment();
    }

    if (Loading && SaleLoading && PayResponse.status === "200") {
      AirBlueGenerateTicket();
    }

    if (!SaleLoading && TicketResponse.status === "200") {
      history({
        pathname: `/get-flight-booking/pnr=${PNR}&last_name=${LastName}&pre=400`,
      });
    }

    if (!SaleLoading && TicketResponse.status === "400") {
      setFailedTicketing(true);
    }

    if (cancel) {
      cancelBookings();
    }

    if (CNIC.length > 0 || JazzAC.length > 0) {
      JazzPayBtn();
    }
  }, [JazzPay, Loading, SaleLoading, cancel, JazzPayBtn, CNIC, JazzAC]);

  const errorDivs = () => {
    if (!SaleLoading && TicketResponse.status === "400") {
      return (
        <>
          <h4>Ticketing Error</h4>
          <h4>{TicketResponse.message}</h4>
        </>
      );
    } else if (!Loading && PayResponse.status === "400") {
      return (
        <>
          <h4>Payment Error</h4>
          <h4>{PayResponse.message}</h4>
        </>
      );
    }
  };

  const [PayNowChck, payNowCheck] = useState(false);
  const [PayLaterChck, payLaterCheck] = useState(true);
  const [JazzWallet, showJazzWallet] = useState(false);
  const [EasyWallet, showEasyWallet] = useState(false);
  const [card, showCard] = useState(false);

  function showPaymentFields(vals) {
    payNowCheck(vals[0]);
    payLaterCheck(vals[1]);
    showJazzWallet(vals[2]);
    showEasyWallet(vals[3]);
    showCard(vals[4]);
  }

  function JazzPaySubmit() {
    setJazzPay(true);
    setPayType("jazzcash");
  }

  let adults =
    bookingData.data.PTC_FareBreakdowns[0].PassengerTypeQuantity.Code === "ADT"
      ? Number(
          bookingData.data.PTC_FareBreakdowns[0].PassengerTypeQuantity.Quantity
        )
      : 0;
  let children =
    bookingData.data.PTC_FareBreakdowns[1] &&
    bookingData.data.PTC_FareBreakdowns[1].PassengerTypeQuantity.Code === "CHD"
      ? Number(
          bookingData.data.PTC_FareBreakdowns[1].PassengerTypeQuantity.Quantity
        )
      : 0;
  let infants =
    bookingData.data.PTC_FareBreakdowns[2] &&
    bookingData.data.PTC_FareBreakdowns[2].PassengerTypeQuantity.Code === "INF"
      ? Number(
          bookingData.data.PTC_FareBreakdowns[2].PassengerTypeQuantity.Quantity
        )
      : 0;

  const dueDate =
    date_convert(bookingData.data.ticketing[0].TicketTimeLimit) +
    " " +
    utc_convert(bookingData.data.ticketing[0].TicketTimeLimit);

  const InvoiceData = {
    invoice_id: Math.floor(100000 + Math.random() * 900000),
    invoice_date: creationDate,
    due_date: dueDate,
    pnr: PNR,
    customer_name: `${TextCapitalizeFirst(
      bookingData.data.passenger_detail[0].title
    )}. ${TextCapitalizeFirst(
      bookingData.data.passenger_detail[0].firstName
    )} ${TextCapitalizeFirst(bookingData.data.passenger_detail[0].lastName)}`,
    origin: firstSegment.Origin,
    destination: lastSegment.Destination,
    trip: round ? "Round-Trip" : "One-Way",
    flight: firstSegment.Carrier + "-" + firstSegment.FlightNumber,
    num_adult: adults,
    num_child: children,
    num_infant: infants,
    price: bookingData.data.pricing_info
      ? `${bookingData.data.pricing_info.TotalFare.CurrencyCode} ${bookingData.data.pricing_info.TotalPriceWithCommission} /-`
      : "PKR 0",
  };

  // PDF Print Function
  function print() {
    savePdf(
      <Document
        bookingData={bookingData}
        creationDate={creationDate}
        round={round}
        totalFlightTime={totalFlightTime}
        firstSegment={firstSegment}
        lastSegment={lastSegment}
        cabin={cabin}
        tickets={tickets}
        InvoiceData={InvoiceData}
      />,
      "4E - Ticket Information.pdf"
    );
  }
  function printInvoice() {
    savePdf(
      <AirBlueDocPDF InvoiceData={InvoiceData} />,
      "4E - Ticket Invoice.pdf"
    );
  }
  const redirectToExternalWebsite = () => {
    window.location.href = `https://foureflights.com/payment.php?pnr=${PNR}&total_amount=${Price}&last_name=${LastName}`;
  };
  return (
    <ErrorBoundary>
      {bookingData.status && bookingData.status !== "400" ? (
        <ErrorBoundary>
          <ConfirmParent>
            {ticketing ? (
              <div className="main">
                <div className="text-center">
                  <h3>Please be Patient! We are Generating your Ticket</h3>
                  <Plane color="#378edd" secondaryColor="#378edd" />
                </div>
              </div>
            ) : !FailedTicketing ? (
              <>
                <div
                  className="main"
                  style={{ opacity: showModal ? "0.5" : "1" }}
                >
                  {/* Payment Info Start */}
                  <div
                    className="foot container"
                    style={{ border: "2px solid #378edd", padding: "25px" }}
                  >
                    <div className="PayInfo">
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
                        <button onClick={redirectToExternalWebsite}>
                          {" "}
                          pay now{" "}
                        </button>
                      )}
                      {/* {PayNowChck && (
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
                              <label className="pay-label" htmlFor="easypaisa">
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
                              <label className="warning w-100 text-danger text-left">
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
                              <label className="warning w-100 text-danger text-left">
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
                                {setloading(true)}
                              </>
                            )
                          )}
                          {/* <div className="row justify-content-center mb-3">
                                                                        <img alt='Coming Soon' src={ComingSoon} className="cmng-soon w-50" />
                                                                    </div> */}

                      {PayLaterChck && (
                        <>
                          <div className="row justify-content-center mb-3">
                            <h5 className="col-sm-12 col-md-12 col-lg-4 font-weight-bold">
                              Ticketing Time Limit:{" "}
                            </h5>
                            <p className="col-sm-12 col-md-12 col-lg-4 text-dark">
                              {dueDate}
                            </p>
                          </div>
                          <div className="row  justify-content-center">
                            <div className="row ">
                              <a
                                className="cursor-pointer"
                                onClick={printInvoice}
                                style={{
                                  color: "white",
                                  marginBottom: "10px",
                                }}
                              >
                                Download Invoice
                              </a>
                              <a
                                className="cursor-pointer"
                                onClick={print}
                                style={{
                                  color: "white",
                                  marginBottom: "10px",
                                }}
                              >
                                Download Reservation
                              </a>
                              <Link
                                to="/"
                                style={{ color: "white", marginBottom: "10px" }}
                              >
                                Go to Home
                              </Link>
                            </div>{" "}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Payment Method End */}
                  {PayLaterChck && (
                    <div className="success">
                      <div className="success-head">
                        <div>
                          <h2>E-Ticket Reservation</h2>
                        </div>
                      </div>
                      <hr />
                      <div className="PAX-info row">
                        <div className="left">
                          <div className="PAX-inner-row">
                            <h4>Passenger: </h4>
                            <p>{`${TextCapitalizeFirst(
                              bookingData.data.passenger_detail[0].title
                            )}. ${TextCapitalizeFirst(
                              bookingData.data.passenger_detail[0].firstName
                            )} ${TextCapitalizeFirst(
                              bookingData.data.passenger_detail[0].lastName
                            )}`}</p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>PNR Creation Date: </h4>
                            <p>{creationDate.slice(0, 15)}</p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>Issuing Agent: </h4>
                            <p>Bukhari Travel Services</p>
                          </div>
                          {bookingData.data.passenger_detail[0]
                            .passport_number && (
                            <div className="PAX-inner-row">
                              <h4>Passport Number: </h4>
                              <p>
                                {toUpper(
                                  bookingData.data.passenger_detail[0]
                                    .passport_number
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="right">
                          {bookingData.data.passenger_detail[0].nationality && (
                            <div className="PAX-inner-row">
                              <h4>Nationality: </h4>
                              <p>
                                {toUpper(
                                  bookingData.data.passenger_detail[0]
                                    .nationality
                                )}
                              </p>
                            </div>
                          )}
                          <div className="PAX-inner-row">
                            <h4>Foure Reference (PNR): </h4>
                            <p>{bookingData.data.BookingReferenceID.ID}</p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>IATA Number: </h4>
                            <p>27303054</p>
                          </div>
                          {bookingData.data.passenger_detail[0].cnic && (
                            <div className="PAX-inner-row">
                              <h4>CNIC: </h4>
                              <p>{bookingData.data.passenger_detail[0].cnic}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <hr />
                      <h3>Flight Details</h3>
                      <div className="flight-info-parent">
                        <div className="flight-info-head">
                          {/* Desktop View of Flight */}
                          <div className="inner-head-desktop">
                            <div className="flight">
                              <p>{firstSegment.origin_city_name}</p>
                              <p>To</p>
                              <p>{firstSegment.Destination_city_name}</p>
                            </div>
                            <div className="plane">
                              <i className="fas fa-plane" />
                            </div>
                            <div className="depart">
                              <h4>Departure</h4>
                              <h5>
                                {utc_convert(firstSegment.DepartureDateTime)}
                              </h5>
                              <h5
                                style={{
                                  flexBasis: "unset",
                                  fontSize: "unset",
                                }}
                              >
                                {date_convert(firstSegment.DepartureDateTime)}
                              </h5>
                            </div>
                            <div className="arrow p-2">
                              <div>
                                <p>{round ? "2 Stops" : "Direct Flight"}</p>
                                <img src={BlueArrow} alt="arrow" />
                                <p>{"Total Flight Time: " + totalFlightTime}</p>
                                <p>{round ? "Round-Trip" : ""}</p>
                              </div>
                            </div>
                            <div className="arrival">
                              <h4>Arrival</h4>
                              <h5>
                                {utc_convert(lastSegment.ArrivalDateTime)}
                              </h5>
                              <h5
                                style={{
                                  flexBasis: "unset",
                                  fontSize: "unset",
                                }}
                              >
                                {date_convert(lastSegment.ArrivalDateTime)}
                              </h5>
                            </div>
                          </div>
                          {/* Mobile View of Flight */}
                          <div className="inner-head-mobile">
                            <div className="flight">
                              <p>{firstSegment.origin_city_name}</p>
                              <p>To</p>
                              <p>{lastSegment.Destination_city_name}</p>
                            </div>
                            <div className="depart-arrive">
                              <div className="depart">
                                <h4>Departure</h4>
                                <h5>
                                  {utc_convert(firstSegment.DepartureDateTime)}
                                </h5>
                                <h4>
                                  {date_convert(firstSegment.DepartureDateTime)}
                                </h4>
                              </div>
                              <div className="arrow p-2">
                                <div>
                                  <p>{round ? "2 Stops" : "Direct Flight"}</p>
                                  <img src={BlueArrow} alt="arrow" />
                                  <p>
                                    {"Total Flight Time: " + totalFlightTime}
                                  </p>
                                  <p>{round ? "Round-Trip" : ""}</p>
                                </div>
                              </div>
                              <div className="arrival">
                                <h4>Arrival</h4>
                                <h5>
                                  {utc_convert(lastSegment.ArrivalDateTime)}
                                </h5>
                                <h4>
                                  {date_convert(lastSegment.ArrivalDateTime)}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        {bookingData.data.segments.map((segment) => {
                          let originCity = segment.origin_city_name.split(",");
                          let destinationCity =
                            segment.Destination_city_name.split(",");
                          return (
                            <div className="flight-info" key={Math.random()}>
                              <div className="flight-inner-row">
                                <p>
                                  <span>
                                    {date_convert(segment.DepartureDateTime)} -{" "}
                                    {originCity[0]}{" "}
                                    <span style={{ color: "#FF9800" }}>To</span>{" "}
                                    {destinationCity[0]}
                                  </span>
                                </p>
                              </div>
                              <div className="flight-inner-row">
                                <div className="flight-inner-row-desktop">
                                  <div className="airline">
                                    <img
                                      src={segment.airline_logo}
                                      alt="Carrier Logo"
                                    />
                                    <p>
                                      <span
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {segment.airline_name}
                                      </span>
                                      {" (" +
                                        segment.Carrier +
                                        ") " +
                                        segment.FlightNumber}
                                    </p>
                                  </div>
                                  <div className="plane">
                                    <i className="fas fa-plane" />
                                  </div>
                                  <div className="depart">
                                    <h4>Departure</h4>
                                    <div>
                                      <h5>
                                        {utc_convert(segment.DepartureDateTime)}
                                      </h5>
                                    </div>
                                    <h5>
                                      {date_convert(segment.DepartureDateTime)}
                                    </h5>
                                  </div>
                                  <div className="arrow">
                                    <div>
                                      <img src={BlueArrow} alt="arrow" />
                                    </div>
                                  </div>
                                  <div className="arrival">
                                    <h4>Arrival</h4>
                                    <div>
                                      <h5>
                                        {utc_convert(segment.ArrivalDateTime)}
                                      </h5>
                                    </div>
                                    <h5>
                                      {date_convert(segment.ArrivalDateTime)}
                                    </h5>
                                  </div>
                                </div>
                                <div className="flight-inner-row-mobile">
                                  <div className="airline">
                                    <img
                                      src={segment.airline_logo}
                                      alt="Carrier Logo"
                                    />
                                    <p>
                                      {segment.airline_name +
                                        " (" +
                                        segment.Carrier +
                                        ") " +
                                        segment.FlightNumber}
                                    </p>
                                  </div>
                                  <div className="flight-inner-depart-arrive">
                                    <div className="depart">
                                      <h4>Departure</h4>
                                      <h5>
                                        {utc_convert(segment.DepartureDateTime)}
                                      </h5>
                                      <h4>
                                        {date_convert(
                                          segment.DepartureDateTime
                                        )}
                                      </h4>
                                    </div>
                                    <div className="arrow">
                                      <div>
                                        <img src={BlueArrow} alt="arrow" />
                                      </div>
                                    </div>
                                    <div className="arrival">
                                      <h4>Arrival</h4>
                                      <h5>
                                        {utc_convert(segment.ArrivalDateTime)}
                                      </h5>
                                      <h4>
                                        {date_convert(segment.ArrivalDateTime)}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flight-inner-row flights">
                                <h4 className="PAX-head">Passengers</h4>
                                {bookingData.data.passenger_detail.length >
                                  0 && (
                                  <table className="ticket-info">
                                    <thead>
                                      <tr key={Math.random()}>
                                        <td>Name</td>
                                        <td>eTicket Number</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {bookingData.data.passenger_detail.map(
                                        (pax, index) => {
                                          return (
                                            <tr key={Math.random()}>
                                              {!(
                                                tickets && tickets.length > 0
                                              ) && (
                                                <td>{`${TextCapitalizeFirst(
                                                  pax.lastName
                                                )}, ${TextCapitalizeFirst(
                                                  pax.firstName
                                                )} ${TextCapitalizeFirst(
                                                  pax.title
                                                )}.`}</td>
                                              )}
                                              {tickets && tickets.length > 0 ? (
                                                <>
                                                  <td>{`${TextCapitalizeFirst(
                                                    tickets[index].lastName
                                                  )}, ${TextCapitalizeFirst(
                                                    tickets[index].firstName
                                                  )} ${TextCapitalizeFirst(
                                                    tickets[index].title
                                                  )}.`}</td>
                                                  <td>
                                                    {
                                                      tickets[index]
                                                        .ticket_number
                                                    }
                                                  </td>
                                                </>
                                              ) : (
                                                <td>----------</td>
                                              )}
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                )}
                                <h4 className="service">
                                  Class of Service:{" "}
                                  <span>{query.cabinClass.label}</span>
                                </h4>
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
                      <div className="cancel-btn-div">
                        <a
                          className="cursor-pointer p-3 rounded btn-danger"
                          onClick={() => setShowModal(true)}
                          data-toggle="modal"
                          data-target="#cancelModal"
                        >
                          Cancel Booking
                        </a>
                      </div>
                    </div>
                  )}
                  {/* <PDFViewer style={{width: '100%', height: '1300px'}}>
                                                    <Document bookingData={bookingData} creationDate={creationDate} round={round} 
                                                        totalFlightTime={totalFlightTime} firstSegment={firstSegment} lastSegment={lastSegment}
                                                        cabin={cabin} tickets={tickets} InvoiceData={InvoiceData} />
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
                {errorDivs()}
                <h5>Reservation Details have been Emailed to you.</h5>
                <div className="foot">
                  <Link to="/">Go to Home</Link>
                </div>
              </FailedBooking>
            )}
          </ConfirmParent>
        </ErrorBoundary>
      ) : (
        <FailedBooking className="d-flex flex-column">
          <h4>Booking Unsuccessful. Please Try Again.</h4>
          <div className="foot">
            <Link to="/">Go to Home</Link>
          </div>
        </FailedBooking>
      )}
    </ErrorBoundary>
  );
}
