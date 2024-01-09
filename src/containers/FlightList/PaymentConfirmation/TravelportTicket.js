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
import { PDFViewer } from "@react-pdf/renderer";
import Document from "./component/TravelportTicketPDF";
import EasypaisaLogo from "../../../assets/img/Easypaisa.webp";
import ComingSoon from "../../../assets/img/com.jpg";
import CancelModal from "../../../helper/CancelModal";
import Axios from "../../../utils/service";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { Plane } from "react-loader-spinner";
import {
  time_convert,
  diff_minutes,
  utc_convert,
  time_zone,
  date_convert,
  ShowAlert,
  savePdf,
} from "../../../helper/ConvertFunctions";
import InvoiceDocPDF from "./component/TravelPortInvoiceDocPDF";
import { Button } from "bootstrap";

export default function TravelportTicket({ bookingData, query }) {
  const history = useNavigate();
  let QueryCity = query.legs[0].destination.city.trim();
  QueryCity = QueryCity.split(",");

  const totalStops = bookingData.data.segments.length - 1;
  const round = query.legs[0].returnDate !== undefined ? true : false;

  const cancelObj = {
    pnr: bookingData.data.galilo_pnr,
    reservationCode: bookingData.data.LocatorCode,
    provider: bookingData.data.provider_type,
  };
  const [cancel, setCancel] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [cancelRes, setCancelRes] = useState({});
  const [showModal, setShowModal] = useState(false);

  const grouped = bookingData.data.segments.filter((seg) => seg.Group === "0");

  let cot = 0;
  let roundLast = round
    ? bookingData.data.segments.map((segment) => {
        cot = 0;
        let SegmentCity = segment.destination_city_name.split(" ");
        const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        SegmentCity = SegmentCity.map((clean) => {
          return clean.replace(regex, "");
        });
        SegmentCity.map((city) => {
          return QueryCity[0].indexOf(city) > -1 &&
            city != "international" &&
            city != "International" &&
            city != "airport" &&
            city != "Airport"
            ? cot++
            : "";
        });
        return cot > 0 ? segment : "";
      })
    : "";
  roundLast = round
    ? roundLast.filter(function (rL) {
        return rL != "";
      })
    : "";

  const firstSegment = bookingData.data.segments[0];
  const lastSegment = round
    ? roundLast[0]
    : bookingData.data.segments[totalStops];

  let totalFlightTime = 0;
  if (round) {
    let x = 0;

    bookingData.data.segments.map((segment) => {
      if (x === 0) {
        totalFlightTime += Number(segment.TravelTime);
      }
      if (segment.destination_city_name.indexOf(QueryCity[0]) > -1) {
        x++;
      }
      return 0;
    });
  } else {
    totalFlightTime = bookingData.data.segments.reduce(
      (accumulator, segment) => accumulator + Number(segment.TravelTime),
      0
    );
  }
  const creationDate = Date();

  let TotalPrice = 0;
  let pr = 0;

  if (bookingData.data.pricing.length > 0) {
    bookingData.data.pricing.map((price) => {
      TotalPrice += Number(price.TotalPriceWithCommission);
    });
    pr = TotalPrice;
    TotalPrice = "PKR " + TotalPrice + "/-";
  } else {
    pr = 0;
    TotalPrice = "PKR 0/-";
  }

  const PNR = bookingData.data.galilo_pnr;
  const BookingInstance = bookingData.data.used_for_ticket_reservation_code;
  const Price = pr;
  const Pricing = bookingData.data.pricing;
  const LastName = bookingData.data.passenger_detail[0].lastName;

  const TicketData = {
    pnr: PNR,
    locator_code: BookingInstance,
    pricing_info: Pricing,
  };

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

  const TravelportGenerateTicket = useCallback(async () => {
    if (!ticketing && SaleLoading && PayResponse.status === "200") {
      const TravelportTicketAPI = "api/issue-ticket";
      setTicketing(true);
      setSaleLoading(false);
      Axios.post(TravelportTicketAPI, TicketData).then((response) => {
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
      TravelportGenerateTicket();
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

  const ModalToggle = () => {
    setShowModal(!showModal);
  };

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

  let adults = 0;
  let children = 0;
  let infants = 0;

  bookingData.data.passenger_detail.map((pax) => {
    if (pax.passenger_type === "ADT") {
      adults++;
    } else if (pax.passenger_type === "CNN") {
      children++;
    } else if (pax.passenger_type === "INF") {
      infants++;
    }
    return 0;
  });

  const dueDate =
    bookingData.data.pricing.length > 0
      ? date_convert(bookingData.data.pricing[0].TrueLastDateToTicket) +
        " " +
        utc_convert(bookingData.data.pricing[0].TrueLastDateToTicket) +
        " " +
        time_zone(bookingData.data.pricing[0].TrueLastDateToTicket)
      : date_convert(new Date()) +
        " " +
        utc_convert(new Date().toLocaleString()) +
        " UTC +05:00";

  const InvoiceData = {
    invoice_id: Math.floor(100000 + Math.random() * 900000),
    invoice_date: creationDate,
    due_date: dueDate,
    pnr: PNR,
    customer_name:
      bookingData.data.passenger_detail[0].title +
      ". " +
      bookingData.data.passenger_detail[0].firstName +
      " " +
      bookingData.data.passenger_detail[0].lastName,
    origin: firstSegment.Origin,
    destination: lastSegment.Destination,
    trip: round ? "Round-Trip" : "One-Way",
    flight: firstSegment.Carrier + "-" + firstSegment.FlightNumber,
    num_adult: adults,
    num_child: children,
    num_infant: infants,
    price: TotalPrice,
  };

  // PDF Print Function
  function print() {
    savePdf(
      <Document
        InvoiceData={InvoiceData}
        bookingData={bookingData}
        creationDate={creationDate}
        totalStops={totalStops}
        totalFlightTime={totalFlightTime}
        firstSegment={firstSegment}
        lastSegment={lastSegment}
        round={round}
        QueryCity={QueryCity}
      />,
      "4E - Ticket Information.pdf"
    );
  }
  function printInvoice() {
    savePdf(
      <InvoiceDocPDF InvoiceData={InvoiceData}></InvoiceDocPDF>,
      "4E - Ticket Invoice.pdf"
    );
  }
  const redirectToExternalWebsite = () => {
    window.location.href = `https://foureflights.com/payment.php?pnr=${PNR}&total_amount=${Price}&last_name=${LastName}`;
  };
  return (
    <>
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
                            <p>
                              {bookingData.data.passenger_detail[0].title +
                                ". " +
                                bookingData.data.passenger_detail[0].firstName +
                                " " +
                                bookingData.data.passenger_detail[0].lastName}
                            </p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>PNR Creation Date: </h4>
                            <p>{creationDate.slice(0, 15)}</p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>Issuing Agent: </h4>
                            <p>Bukhari Travel Services</p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>Passport Number: </h4>
                            <p>
                              {toUpper(
                                bookingData.data.passenger_detail[0]
                                  .passport_number
                              )}
                            </p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>Fare: </h4>
                            <p>{InvoiceData.price}</p>
                          </div>
                        </div>
                        <div className="right">
                          <div className="PAX-inner-row">
                            <h4>Nationality: </h4>
                            <p>
                              {toUpper(
                                bookingData.data.passenger_detail[0].nationality
                              )}
                            </p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>Foure Reference (PNR): </h4>
                            <p>{bookingData.data.galilo_pnr}</p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>IATA Number: </h4>
                            <p>27303054</p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>Passport Expiry: </h4>
                            <p>
                              {bookingData.data.passenger_detail[0].exp_day +
                                " " +
                                bookingData.data.passenger_detail[0].exp_month +
                                " " +
                                bookingData.data.passenger_detail[0].exp_year}
                            </p>
                          </div>
                          <div className="PAX-inner-row">
                            <h4>Airline Reference: </h4>
                            <p>{bookingData.data.SupplierLocatorCode}</p>
                          </div>
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
                              <p>{lastSegment.destination_city_name}</p>
                            </div>
                            <div className="plane">
                              <i className="fas fa-plane" />
                            </div>
                            <div className="depart">
                              <h4>Departure</h4>
                              <h5 title={time_zone(firstSegment.DepartureTime)}>
                                {utc_convert(firstSegment.DepartureTime)}
                              </h5>
                              <h5
                                style={{
                                  flexBasis: "unset",
                                  fontSize: "unset",
                                }}
                              >
                                {date_convert(firstSegment.DepartureTime)}
                              </h5>
                            </div>
                            <div className="arrow p-2">
                              <div>
                                <p>
                                  {totalStops === 0
                                    ? "Direct Flight"
                                    : totalStops > 1
                                    ? totalStops + " Stops"
                                    : totalStops + " Stop"}
                                </p>
                                <img src={BlueArrow} alt="arrow" />
                                <p>
                                  {"Total Flight Time: " +
                                    time_convert(totalFlightTime)}
                                </p>
                                <p>{round ? "Round-Trip" : ""}</p>
                              </div>
                            </div>
                            <div className="arrival">
                              <h4>Arrival</h4>
                              <h5 title={time_zone(lastSegment.ArrivalTime)}>
                                {utc_convert(lastSegment.ArrivalTime)}
                              </h5>
                              <h5
                                style={{
                                  flexBasis: "unset",
                                  fontSize: "unset",
                                }}
                              >
                                {date_convert(lastSegment.ArrivalTime)}
                              </h5>
                            </div>
                          </div>
                          {/* Mobile View of Flight */}
                          <div className="inner-head-mobile">
                            <div className="flight">
                              <p>{firstSegment.origin_city_name}</p>
                              <p>To</p>
                              <p>{lastSegment.destination_city_name}</p>
                            </div>
                            <div className="depart-arrive">
                              <div className="depart">
                                <h4>Departure</h4>
                                <h5
                                  title={time_zone(firstSegment.DepartureTime)}
                                >
                                  {utc_convert(firstSegment.DepartureTime)}
                                </h5>
                                <h4>
                                  {date_convert(firstSegment.DepartureTime)}
                                </h4>
                              </div>
                              <div className="arrow p-2">
                                <div>
                                  <p>
                                    {totalStops === 0
                                      ? "Direct Flight"
                                      : totalStops > 1
                                      ? totalStops + " Stops"
                                      : totalStops + " Stop"}
                                  </p>
                                  <img src={BlueArrow} alt="arrow" />
                                  <p>
                                    {"Total Time: " +
                                      time_convert(totalFlightTime)}
                                  </p>
                                  <p>{round ? "Round-Trip" : ""}</p>
                                </div>
                              </div>
                              <div className="arrival">
                                <h4>Arrival</h4>
                                <h5 title={time_zone(lastSegment.ArrivalTime)}>
                                  {utc_convert(lastSegment.ArrivalTime)}
                                </h5>
                                <h4>{date_convert(lastSegment.ArrivalTime)}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        {bookingData.data.segments.map((segment, index) => {
                          let originCity = segment.origin_city_name.split(",");
                          let destinationCity =
                            segment.destination_city_name.split(",");
                          return (
                            <div
                              style={{
                                border: "2px",
                                borderStyle: "dotted",
                                borderRadius: "1%",
                              }}
                              className="flight-info"
                              key={Math.random()}
                            >
                              <div className="flight-inner-row">
                                <p>
                                  <span>
                                    {date_convert(segment.DepartureTime)} -{" "}
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
                                      {segment.airline_name +
                                        " (" +
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
                                      <h5
                                        title={time_zone(segment.DepartureTime)}
                                      >
                                        {utc_convert(segment.DepartureTime)}
                                      </h5>
                                    </div>
                                    <h5>
                                      {date_convert(segment.DepartureTime)}
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
                                      <h5
                                        title={time_zone(segment.ArrivalTime)}
                                      >
                                        {utc_convert(segment.ArrivalTime)}
                                      </h5>
                                    </div>
                                    <h5>{date_convert(segment.ArrivalTime)}</h5>
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
                                      <h5
                                        title={time_zone(segment.DepartureTime)}
                                      >
                                        {utc_convert(segment.DepartureTime)}
                                      </h5>
                                      <h4>
                                        {date_convert(segment.DepartureTime)}
                                      </h4>
                                    </div>
                                    <div className="arrow">
                                      <div>
                                        <img src={BlueArrow} alt="arrow" />
                                      </div>
                                    </div>
                                    <div className="arrival">
                                      <h4>Arrival</h4>
                                      <h5
                                        title={time_zone(segment.DepartureTime)}
                                      >
                                        {utc_convert(segment.DepartureTime)}
                                      </h5>
                                      <h4>
                                        {date_convert(segment.ArrivalTime)}
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
                                        (pax) => {
                                          return (
                                            <tr key={Math.random()}>
                                              <td>
                                                {pax.lastName +
                                                  ", " +
                                                  pax.firstName +
                                                  " " +
                                                  pax.title +
                                                  "."}
                                              </td>
                                              <td>----------</td>
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                )}
                                <h4 className="service">
                                  Class of Service:{" "}
                                  <span>{segment.CabinClass}</span>
                                </h4>
                                {bookingData.data.segments.length > 1 &&
                                  bookingData.data.segments.length - 1 !==
                                    index &&
                                  segment.destination_city_name.indexOf(
                                    QueryCity[0]
                                  ) === -1 && (
                                    <h4 className="service">
                                      Layover: &nbsp;
                                      <span>
                                        {diff_minutes(
                                          segment.ArrivalTime,
                                          bookingData.data.segments[
                                            index + 1 ===
                                            bookingData.data.segments.length
                                              ? bookingData.data.segments
                                                  .length - 1
                                              : index + 1
                                          ].DepartureTime
                                        )}
                                      </span>
                                    </h4>
                                  )}
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
                                                    <Document bookingData={bookingData} creationDate={creationDate} totalStops={totalStops} 
                                                        totalFlightTime={totalFlightTime} firstSegment={firstSegment} lastSegment={lastSegment} 
                                                        round={round} QueryCity={QueryCity} InvoiceData={InvoiceData} />
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
    </>
  );
}
