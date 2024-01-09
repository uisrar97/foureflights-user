import React, { useState, useEffect, useCallback } from "react";
import BlueArrow from "../../assets/img/BlueArrow.webp";
import ErrorBoundary from "./../../helper/ErrorBoundary";
import { Link, useNavigate } from "react-router-dom";
import { toUpper } from "lodash";
import { ConfirmParent, FailedBooking } from "./wrapper/GetBookingStyle";
// import { PDFViewer } from '@react-pdf/renderer';
import Document from "./component/AirBlueTicketPDF";
import CancelModal from "../../helper/CancelModal";
import Axios from "../../utils/service";
import {
  diff_minutes,
  date_convert,
  utc_convert,
  savePdf,
  TextCapitalizeFirst,
} from "../../helper/ConvertFunctions";

export default function AirblueTicket({ bookingData, userId }) {
  const round = bookingData.data.segments.length > 1 ? true : false;
  let totalFlightTime = 0;

  const firstSegment = bookingData.data.segments[0];
  const lastSegment = bookingData.data.segments[0];
  const [showModal, setShowModal] = useState(false);
  const Tickets = bookingData.data.ticketing;

  let ticketing = "E-Ticket Reservation";

  if (
    bookingData.data.ticketing &&
    Tickets.length > 0 &&
    Tickets.filter((tckts) => tckts.TicketDocumentNbr).length >=
      bookingData.data.passenger_detail.length
  ) {
    ticketing = "E-Ticket Confirmation";
  }

  const cancelObj = {
    pnr: bookingData.data.BookingReferenceID.ID,
    reservationCode: bookingData.data.BookingReferenceID.Instance,
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

  totalFlightTime = diff_minutes(
    firstSegment.DepartureDateTime,
    firstSegment.ArrivalDateTime
  );

  const ModalToggle = () => {
    setShowModal(!showModal);
  };

  // PDF Print Function
  function print() {
    savePdf(
      <Document
        bookingData={bookingData}
        round={round}
        totalFlightTime={totalFlightTime}
        firstSegment={firstSegment}
        lastSegment={lastSegment}
        Tickets={Tickets}
        ticketing={ticketing}
      />,
      "4E - Ticket Information.pdf"
    );
  }
  // code for issue ticker and iframe logic start here
  const isIframe = window.self !== window.top;
  const PNR = bookingData.data.BookingReferenceID.ID;
  let LastName = bookingData.data.passenger_detail[0].lastName;
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
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "5px",
    zIndex: 9999, // Set a high z-index to ensure it appears on top of other elements
    display: showToast ? "block" : "none",
  };
  const handleIssueTicketClick = () => {
    console.log(bookingData?.data?.BookingReferenceID?.Instance);
    // Call the issueTicketAPI function with the appropriate request data
    const req =
      "api/issue-ticket-airblue?pnr=" +
      bookingData?.data?.BookingReferenceID?.ID +
      "&instance=" +
      bookingData?.data?.BookingReferenceID?.Instance +
      "&total_amount=" +
      bookingData.data.pricing_info.TotalFare.Amount +
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
        console.log(res.message);
        handleShowToast(res.message, "error");
      }

      // fetchBookings();
    });
  }, []);
  useEffect(() => {
    if (ticketLoader) {
      let TicketData = {};
      if (flightData.api_type === "airblue") {
        setFlightData(bookingData.data);
        TicketData = {
          pnr: bookingData.data.booking_response.BookingReferenceID.ID,
          instance: bookingData.data.BookingReferenceID.Instance,
          price:
            bookingData.data.booking_response.pricing_info.TotalFare.Amount,
          user_id: userId,
        };
        const req =
          "api/issue-ticket-airblue?pnr=" +
          bookingData.data.booking_response.BookingReferenceID.ID +
          "&instance=" +
          bookingData.data.BookingReferenceID.Instance +
          "&total_amount=" +
          bookingData.data.booking_response.pricing_info.TotalFare.Amount +
          "&payment=true&user_id=" +
          userData.userId;
        issueTicketAPI(req);
      }
    }
  }, [ticketLoader, flightData, issueTicketAPI]);
  // code for issue ticket and iframe end here
  return (
    <ErrorBoundary>
      {bookingData.status && bookingData.status !== "400" ? (
        <ErrorBoundary>
          <ConfirmParent>
            <div className="main" style={{ opacity: showModal ? "0.5" : "1" }}>
              <div className="success">
                <div className="success-head">
                  <div>
                    <h2>{ticketing}</h2>
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
                    {bookingData.data.passenger_detail[0].passport_number ? (
                      <div className="PAX-inner-row">
                        <h4>Passport Number: </h4>
                        <p>
                          {toUpper(
                            bookingData.data.passenger_detail[0].passport_number
                          )}
                        </p>
                      </div>
                    ) : (
                      bookingData.data.passenger_detail[0].cnic && (
                        <div className="PAX-inner-row">
                          <h4>CNIC: </h4>
                          <p>{bookingData.data.passenger_detail[0].cnic}</p>
                        </div>
                      )
                    )}
                    <div className="PAX-inner-row">
                      <h4>Issuing Agent: </h4>
                      <p>Bukhari Travel Services</p>
                    </div>
                  </div>
                  <div className="right">
                    <div className="PAX-inner-row">
                      <h4>Nationality: </h4>
                      <p>
                        {bookingData.data.passenger_detail[0].cnic
                          ? "PK"
                          : toUpper(
                              bookingData.data.passenger_detail[0].nationality
                            )}
                      </p>
                    </div>
                    <div className="PAX-inner-row">
                      <h4>Foure Reference (PNR): </h4>
                      <p>{bookingData.data.BookingReferenceID.ID}</p>
                    </div>
                    <div className="PAX-inner-row">
                      <h4>IATA Number: </h4>
                      <p>27303054</p>
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
                        <p>{firstSegment.Destination_city_name}</p>
                      </div>
                      <div className="plane">
                        <i className="fas fa-plane" />
                      </div>
                      <div className="depart">
                        <h4>Departure</h4>
                        <h5>{utc_convert(firstSegment.DepartureDateTime)}</h5>
                        <h5 style={{ flexBasis: "unset", fontSize: "unset" }}>
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
                        <h5>{utc_convert(lastSegment.ArrivalDateTime)}</h5>
                        <h5 style={{ flexBasis: "unset", fontSize: "unset" }}>
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
                          <h5>{utc_convert(firstSegment.DepartureDateTime)}</h5>
                          <h4>
                            {date_convert(firstSegment.DepartureDateTime)}
                          </h4>
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
                          <h5>{utc_convert(lastSegment.ArrivalDateTime)}</h5>
                          <h4>{date_convert(lastSegment.ArrivalDateTime)}</h4>
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
                                {toUpper(segment.airline_name.slice(0, 1)) +
                                  segment.airline_name.slice(1) +
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
                                <h5>
                                  {utc_convert(segment.DepartureDateTime)}
                                </h5>
                              </div>
                              <h5>{date_convert(segment.DepartureDateTime)}</h5>
                            </div>
                            <div className="arrow">
                              <div>
                                <img src={BlueArrow} alt="arrow" />
                              </div>
                            </div>
                            <div className="arrival">
                              <h4>Arrival</h4>
                              <div>
                                <h5>{utc_convert(segment.ArrivalDateTime)}</h5>
                              </div>
                              <h5>{date_convert(segment.ArrivalDateTime)}</h5>
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
                                  {date_convert(segment.DepartureDateTime)}
                                </h4>
                              </div>
                              <div className="arrow">
                                <div>
                                  <img src={BlueArrow} alt="arrow" />
                                </div>
                              </div>
                              <div className="arrival">
                                <h4>Arrival</h4>
                                <h5>{utc_convert(segment.ArrivalDateTime)}</h5>
                                <h4>{date_convert(segment.ArrivalDateTime)}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flight-inner-row flights">
                          <h4 className="PAX-head">Passengers</h4>
                          {bookingData.data.passenger_detail.length > 0 && (
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
                                        <td>{`${TextCapitalizeFirst(
                                          pax.lastName
                                        )}, ${TextCapitalizeFirst(
                                          pax.firstName
                                        )} ${TextCapitalizeFirst(
                                          pax.title
                                        )}.`}</td>
                                        {Tickets[index].TicketDocumentNbr ? (
                                          <td>
                                            {Tickets[index].TicketDocumentNbr}
                                          </td>
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
                          {/* <h4 className="service">Class of Service: <span>{cabin}</span></h4> */}
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
                                    <Document bookingData={bookingData} round={round} totalFlightTime={totalFlightTime} 
                                        firstSegment={firstSegment} lastSegment={lastSegment} Tickets={Tickets} ticketing={ticketing} />
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
    </ErrorBoundary>
  );
}
