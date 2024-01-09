import React, { useState, useEffect, useCallback } from "react";
import BlueArrow from "../../assets/img/BlueArrow.webp";
import ErrorBoundary from "./../../helper/ErrorBoundary";
import { Link, useNavigate } from "react-router-dom";
import { last, toUpper } from "lodash";
import {
  ConfirmParent,
  FailedBooking,
  styles,
} from "./wrapper/GetBookingStyle";
// import { PDFViewer } from '@react-pdf/renderer';
import Document from "./component/AirSialTicketPDF";
import CancelModal from "../../helper/CancelModal";
import Axios from "../../utils/service";
import Logo from "../../assets/img/logo.png";
import ReservationImg from "../../assets/img/ReservationImg.jpg";

import {
  time_convert,
  date_convert,
  savePdf,
  TextCapitalizeFirst,
  airsial_time_convert,
} from "../../helper/ConvertFunctions";

export default function AirSialTicket({ bookingData, userId }) {
  const round =
    bookingData.data.segments.inbound &&
    bookingData.data.segments.inbound.length > 0
      ? true
      : false;

  const firstSegment = bookingData.data.segments.outbound[0];
  const lastSegment = round
    ? bookingData.data.segments.inbound[0]
    : bookingData.data.segments.outbound[0];
  const [showModal, setShowModal] = useState(false);
  let ticketing = "E-Ticket Reservation";

  let count = 0;
  bookingData.data.passenger_detail.map((pax) => {
    if (pax.ticket_number && pax.ticket_number !== "") {
      count++;
    }
  });

  if (count === bookingData.data.passenger_detail.length) {
    ticketing = "E-Ticket Confirmation";
  }

  const cancelObj = {
    pnr: bookingData.data.pnr,
    reservationCode: "Not Found",
    provider: bookingData.data.provider_type,
  };
  const [cancel, setCancel] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [cancelRes, setCancelRes] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastStatus, setToastStatus] = useState("");
  const [flightData, setFlightData] = useState({});
  const [ticketLoader, setTicketLoader] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    const APIreq =
      "api/cancelrequest?pnr=" +
      cancelObj.pnr +
      "&ticket_reservation_code=" +
      cancelObj.reservationCode +
      "&provider_type=" +
      cancelObj.provider;
    async function cancelBookings() {
      if (cancel) {
        Axios.get(APIreq).then((response) => {
          const res = response.data;
          setCancelRes(res);
          setLoadings(false);
        });
      }
    }
    cancelBookings();
  }, [cancel]);

  let OutOrigCity = "";
  let OutDestCity = "";
  let InOrigCity = "";
  let InDestCity = "";
  let totalFlightTime = firstSegment.FlightTime;

  const totalStops = round ? 1 : 0;

  OutOrigCity = firstSegment.origin_city_name.split(",");
  OutDestCity = firstSegment.Destination_city_name.split(",");

  if (round) {
    InOrigCity = lastSegment.origin_city_name.split(",");
    InDestCity = lastSegment.Destination_city_name.split(",");
  }

  // PDF Print Function
  function print() {
    savePdf(
      <Document
        bookingData={bookingData}
        firstSegment={firstSegment}
        lastSegment={lastSegment}
        OutOrigCity={OutOrigCity}
        OutDestCity={OutDestCity}
        InOrigCity={InOrigCity}
        InDestCity={InDestCity}
        totalFlightTime={totalFlightTime}
        totalStops={totalStops}
        round={round}
        ticketing={ticketing}
      />,
      "4E - Ticket Information.pdf"
    );
  }

  const ModalToggle = () => {
    setShowModal(!showModal);
  };

  // iframe setting for issue tickets start here
  const isIframe = window.self !== window.top;
  const PNR = bookingData.data.pnr;
  let LastName = bookingData.data.passenger_detail[0].name.split(" ", 1);
  LastName = LastName[0];
  const handleShowToast = (message, status) => {
    setToastMessage(message);
    setToastStatus(status);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide the toast after 3 seconds
  };
  const toastStyle = {
    position: "fixed",
    top: "66%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "5px",
    zIndex: 9999, // Set a high z-index to ensure it appears on top of other elements
    display: showToast ? "block" : "none",
  };
  const handleIssueTicketClick = () => {
    // Call the issueTicketAPI function with the appropriate request data
    const req =
      "api/issue-ticket-airsial?pnr=" +
      bookingData.data.pnr +
      "&payment=true&user_id=" +
      userId;
    issueTicketAPI(req);
  };
  const issueTicketAPI = useCallback(async (req) => {
    Axios.get(req).then((response) => {
      const res = response.data;
      if (res.status === "200") {
        setTicketLoader(false);
        handleShowToast("Great!!! Ticket issued Successfully.", "success");
        history({
          pathname: `/get-flight-booking/pnr=${PNR}&last_name=${LastName}&pre=200`,
        });

        if (
          bookingData.data.passenger_detail.ticket_number.length !==
            undefined ||
          "0"
        ) {
          setShowBtn(false);
        }
      } else if (res.status === "400") {
        handleShowToast(res.message, "error");
      }

      // fetchBookings();
    });
  }, []);
  useEffect(() => {
    if (ticketLoader) {
      let TicketData = {};
      if (flightData.api_type === "airsial") {
        setFlightData(bookingData.data);
        const req =
          "api/issue-ticket-airsial?pnr=" +
          bookingData.data.pnr +
          "&payment=true&user_id=" +
          userId;
        issueTicketAPI(req);
      }
    }
  }, [ticketLoader, flightData, issueTicketAPI]);

  return (
    <>
      {bookingData.status && bookingData.status !== "400" ? (
        <ErrorBoundary>
          <ConfirmParent>
            <div
              style={{
                borderStyle: "dotted",
                borderColor: "#ada397",
                borderRadius: "1%",
                opacity: showModal ? "0.5" : "1",
                marginTop: "5rem",
              }}
              className="main  rounded container"
            >
              <div className="success">
                <div className="success-head mt-4 pt-4 d-flex justify-content-between align-items-center">
                  <div className="">
                    <img className="w-100 " src={Logo} />
                  </div>
                  <div className="font-weight-bold">{ticketing}</div>
                  <div>
                    <Link to={"https://foureflights.com/"}>
                      <span>https://foureflights.com/</span>
                    </Link>
                  </div>
                </div>
                <hr />
                <div className="PAX-info row container">
                  <div className="left">
                    <div
                      className="d-flex font-weight-bold"
                      style={{ fontSize: "14px" }}
                    >
                      <p className="">Total Numbers of Passenger : </p>

                      <p className="pl-2">
                        {bookingData.data.passenger_detail.length}
                      </p>
                    </div>
                    <div
                      className=" d-flex font-weight-bold "
                      style={{ fontSize: "14px" }}
                    >
                      <p>Issuing Agent: </p>
                      <p className="pl-2">Bukhari Travel Services</p>
                    </div>
                  </div>
                  <div className="right">
                    <div
                      className="d-flex font-weight-bold"
                      style={{ fontSize: "14px" }}
                    >
                      <p>Foure Reference (PNR): </p>
                      <p className="pl-2">{bookingData.data.pnr}</p>
                    </div>
                    <div
                      className="d-flex font-weight-bold"
                      style={{ fontSize: "14px" }}
                    >
                      <p>IATA Number: </p>
                      <p className="pl-2">27303054</p>
                    </div>
                  </div>
                </div>
                <table className="table table-bordered">
                  <thead className="py-0 my-0">
                    <tr
                      className="py-0 my-0 font-weight-bold"
                      style={{ fontSize: "14px" }}
                    >
                      <th>Title</th>
                      <th>Full Name</th>
                      <th>Passport/CNIC</th>
                      <th>e-Ticket Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingData.data.passenger_detail.map((pax) => {
                      return (
                        <tr
                          style={{ fontSize: "14px" }}
                          className="font-weight-bold"
                          key={Math.random()}
                        >
                          <td>
                            <p>{`${TextCapitalizeFirst(pax.title)}`}</p>
                          </td>
                          <td>
                            <p>{`${TextCapitalizeFirst(pax.name)}`}</p>
                          </td>
                          {bookingData.data.passenger_detail[0]
                            .passport_number && <td>{pax.passport_number}</td>}
                          {bookingData.data.passenger_detail[0].cnic && (
                            <td>{pax.cnic}</td>
                          )}
                          {pax.ticket_number !== "" &&
                          pax.ticket_number !== undefined ? (
                            <p>{pax.ticket_number}</p>
                          ) : (
                            <td>-------</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <hr />

                <p>Flight Type:{round ? "Round-Trip" : "one-way"}</p>
                <p className="text-primary">
                  Distance :{" "}
                  <span className="text-dark">
                    {" "}
                    {time_convert(totalFlightTime)}
                  </span>
                </p>
                <div className="d-flex container justify-content-between align-items-center mt-4">
                  <div className="text-start">
                    <h3 className="text-primary font-weight-bold d-flex justify-content-start">
                      {firstSegment.Origin}
                    </h3>
                    <p>{firstSegment.origin_city_name}</p>
                    <p className="d-flex justify-content-start">Departure </p>
                    <p className="d-flex justify-content-start">
                      {airsial_time_convert(firstSegment.DEPARTURE_TIME)}
                    </p>
                    <p className="d-flex justify-content-start">
                      {date_convert(firstSegment.DEPARTURE_DATE)}
                    </p>
                  </div>
                  <div>
                    <div style={styles.imageDesign}>
                      <img
                        style={{
                          width: "165px",
                          height: "165px",
                          rounded: "full",
                          borderRadius: "50%",
                        }}
                        src={ReservationImg}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="text-start">
                    <h3 className="text-primary font-weight-bold d-flex justify-content-start">
                      {firstSegment.Destination}
                    </h3>
                    <p>{firstSegment.Destination_city_name}</p>
                    <p className="d-flex justify-content-start">Arrival </p>
                    <p className="d-flex justify-content-start">
                      {airsial_time_convert(firstSegment.ARRIVAL_TIME)}
                    </p>
                    <p className="d-flex justify-content-start">
                      {date_convert(firstSegment.DEPARTURE_DATE)}
                    </p>
                  </div>
                </div>
                <div className="flight-info-parent">
                  <hr />
                  {
                    <div
                      style={{
                        borderStyle: "dotted",
                        borderColor: "#ada397",
                        borderRadius: "1%",
                      }}
                      className="flight-info "
                    >
                      <div className="flight-inner-row">
                        <p
                          style={{ fontSize: "16px" }}
                          className=" font-weight-bold"
                        >
                          <span>
                            {airsial_time_convert(firstSegment.DEPARTURE_TIME)}{" "}
                            - {OutOrigCity[0]}{" "}
                            <span style={{ color: "#FF9800" }}>To</span>{" "}
                            {OutDestCity[0]}
                          </span>
                        </p>
                      </div>
                      <div className="flight-inner-row">
                        <div className="flight-inner-row-desktop">
                          <div className="airline">
                            <img
                              src={firstSegment.airline_logo}
                              alt="Carrier Logo"
                            />
                            <p>
                              {firstSegment.airline_name +
                                " (" +
                                firstSegment.FlightNumber.slice(0, 2) +
                                ") " +
                                firstSegment.FlightNumber.slice(2)}
                            </p>
                          </div>
                          <div className="plane">
                            <i className="fas fa-plane" />
                          </div>
                          <div className="depart">
                            <h4
                              style={{ fontSize: "16px" }}
                              className=" font-weight-bold"
                            >
                              Departure
                            </h4>
                            <div>
                              <h5
                                style={{ fontSize: "16px" }}
                                className=" font-weight-bold"
                              >
                                {airsial_time_convert(
                                  firstSegment.DEPARTURE_TIME
                                )}
                              </h5>
                            </div>
                            <h5
                              style={{ fontSize: "16px" }}
                              className=" font-weight-bold"
                            >
                              {date_convert(firstSegment.DEPARTURE_DATE)}
                            </h5>
                          </div>
                          <div className="arrow">
                            <div>
                              <img src={BlueArrow} alt="arrow" />
                            </div>
                          </div>
                          <div className="arrival">
                            <h4
                              style={{ fontSize: "16px" }}
                              className=" font-weight-bold"
                            >
                              Arrival
                            </h4>
                            <div>
                              <h5
                                style={{ fontSize: "16px" }}
                                className=" font-weight-bold"
                              >
                                {airsial_time_convert(
                                  firstSegment.ARRIVAL_TIME
                                )}
                              </h5>
                            </div>
                            <h5
                              style={{ fontSize: "16px" }}
                              className=" font-weight-bold"
                            >
                              {date_convert(firstSegment.DEPARTURE_DATE)}
                            </h5>
                          </div>
                        </div>

                        <div className="flight-inner-row-mobile">
                          <div className="airline">
                            <img
                              src={firstSegment.airline_logo}
                              alt="Carrier Logo"
                            />
                            <p>
                              {toUpper(firstSegment.airline_name.slice(0, 1)) +
                                firstSegment.airline_name.slice(1) +
                                " (" +
                                firstSegment.FlightNumber.slice(0, 2) +
                                ") " +
                                firstSegment.FlightNumber.slice(2)}
                            </p>
                          </div>
                          <div className="flight-inner-depart-arrive">
                            <div className="depart">
                              <h4>Departure</h4>
                              <h5>
                                {airsial_time_convert(
                                  firstSegment.DEPARTURE_TIME
                                )}
                              </h5>
                              <h4>
                                {date_convert(firstSegment.DEPARTURE_DATE)}
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
                                {airsial_time_convert(
                                  firstSegment.ARRIVAL_TIME
                                )}
                              </h5>
                              <h4>
                                {date_convert(firstSegment.DEPARTURE_DATE)}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {round && (
                    <>
                      {
                        <div
                          style={{
                            borderStyle: "dotted",
                            borderColor: "#ada397",
                            borderRadius: "1%",
                          }}
                          className="flight-info"
                        >
                          <div className="flight-inner-row">
                            <p
                              style={{ fontSize: "16px" }}
                              className=" font-weight-bold"
                            >
                              <span>
                                {airsial_time_convert(
                                  lastSegment.DEPARTURE_TIME
                                )}{" "}
                                - {InOrigCity[0]}{" "}
                                <span style={{ color: "#FF9800" }}>To</span>{" "}
                                {InDestCity[0]}
                              </span>
                            </p>
                          </div>
                          <div className="flight-inner-row">
                            <div className="flight-inner-row-desktop">
                              <div className="airline">
                                <img
                                  src={lastSegment.airline_logo}
                                  alt="Carrier Logo"
                                />
                                <p
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {lastSegment.airline_name +
                                    " (" +
                                    lastSegment.FlightNumber.slice(0, 2) +
                                    ") " +
                                    lastSegment.FlightNumber.slice(2)}
                                </p>
                              </div>
                              <div className="plane">
                                <i className="fas fa-plane" />
                              </div>
                              <div className="depart">
                                <p
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  Departure
                                </p>
                                <div>
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    {airsial_time_convert(
                                      lastSegment.DEPARTURE_TIME
                                    )}
                                  </p>
                                </div>
                                <p
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {date_convert(lastSegment.DEPARTURE_DATE)}
                                </p>
                              </div>
                              <div className="arrow">
                                <div>
                                  <img src={BlueArrow} alt="arrow" />
                                </div>
                              </div>
                              <div className="arrival">
                                <p
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  Arrival
                                </p>
                                <div>
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    {airsial_time_convert(
                                      lastSegment.ARRIVAL_TIME
                                    )}
                                  </p>
                                </div>
                                <p
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {date_convert(lastSegment.DEPARTURE_DATE)}
                                </p>
                              </div>
                            </div>
                            <div className="flight-inner-row-mobile">
                              <div className="airline">
                                <img
                                  src={lastSegment.airline_logo}
                                  alt="Carrier Logo"
                                />
                                <p
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {lastSegment.airline_name +
                                    " (" +
                                    lastSegment.FlightNumber.slice(0, 2) +
                                    ") " +
                                    lastSegment.FlightNumber.slice(2)}
                                </p>
                              </div>
                              <div className="flight-inner-depart-arrive">
                                <div className="depart">
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    Departure
                                  </p>
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    {airsial_time_convert(
                                      lastSegment.DEPARTURE_TIME
                                    )}
                                  </p>
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    {date_convert(lastSegment.DEPARTURE_DATE)}
                                  </p>
                                </div>
                                <div className="arrow">
                                  <div>
                                    <img src={BlueArrow} alt="arrow" />
                                  </div>
                                </div>
                                <div className="arrival">
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    Arrival
                                  </p>
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    {airsial_time_convert(
                                      lastSegment.ARRIVAL_TIME
                                    )}
                                  </p>
                                  <p
                                    style={{ fontSize: "16px" }}
                                    className=" font-weight-bold"
                                  >
                                    {date_convert(lastSegment.DEPARTURE_DATE)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </>
                  )}
                </div>
                <div className="agent">
                  <h3>Agent Details</h3>
                  <p>BUKHARI TRAVEL SERVICES</p>
                  <p>2-Mohammadi Plaza, Blue Area, Islamabad</p>
                  <p>Pakistan</p>
                  <p>Phone: +92-51-28282562</p>
                </div>
              </div>
              {!isIframe && (
                <div className="foot">
                  <span className="cursor-pointer foot-btn" onClick={print}>
                    Download PDF
                  </span>
                  <span
                    className="cursor-pointer cancel btn-danger"
                    onClick={() => setShowModal(true)}
                    data-toggle="modal"
                    data-target="#cancelModal"
                  >
                    Cancel Booking
                  </span>
                  <Link className="cursor-pointer foot-btn" to="/">
                    Go to Home
                  </Link>
                </div>
              )}
              {isIframe && (
                <div className="foot">
                  <span
                    className="cursor-pointer foot-btn cursor-pointer"
                    onClick={print}
                  >
                    Download PDF
                  </span>
                  {/* <span
                    className="cursor-pointer cancel btn-danger cursor-pointer"
                    onClick={() => setShowModal(true)}
                    data-toggle="modal"
                    data-target="#cancelModal"
                  >
                    Cancel Booking
                  </span> */}

                  {/* Your other app content */}

                  {/* Render the toast inline 
                  with inline styles */}
                  <div
                    style={{
                      ...toastStyle,
                      backgroundColor: toastStatus == "error" ? "red" : "green",
                    }}
                  >
                    {toastMessage}
                  </div>
                  {showBtn && (
                    <span
                      className="cursor-pointer cancel btn-success cursor-pointer"
                      onClick={handleIssueTicketClick}
                      data-toggle="modal"
                      data-target="#cancelModal"
                    >
                      Issue Ticket
                    </span>
                  )}
                </div>
              )}
              {/* <PDFViewer style={{width: '100%', height: '1300px'}}>
                                    <Document bookingData={bookingData} firstSegment={firstSegment} lastSegment={lastSegment} OutOrigCity={OutOrigCity} 
                                        OutDestCity={OutDestCity} InOrigCity={InOrigCity} InDestCity={InDestCity} totalFlightTime={totalFlightTime} 
                                        totalStops={totalStops} round={round} ticketing={ticketing} />
                                </PDFViewer> */}
            </div>
            {/* Bootstrap Cancel Modal */}
            {showModal && (
              <CancelModal
                ModalToggle={ModalToggle}
                showModal={showModal}
                setCancel={setCancel}
                loadings={loadings}
                cancelRes={cancelRes}
              />
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
