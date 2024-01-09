import React, { useState, useEffect, useCallback } from "react";
import BlueArrow from "../../assets/img/BlueArrow.webp";
import ErrorBoundary from "./../../helper/ErrorBoundary";
import { Link, useNavigate } from "react-router-dom";
import { toUpper } from "lodash";
import { ConfirmParent, FailedBooking } from "./wrapper/GetBookingStyle";
// import { PDFViewer } from '@react-pdf/renderer';
import Document from "./component/TravelportTicketPDF";
import CancelModal from "../../helper/CancelModal";
import Axios from "../../utils/service";
import Logo from "../../assets/img/logo.png";
import ReservationImg from "../../assets/img/ReservationImg.jpg";
import {
  time_convert,
  diff_minutes,
  utc_convert,
  time_zone,
  date_convert,
  savePdf,
} from "../../helper/ConvertFunctions";
import { toast } from "react-toastify";

export default function TravelportTicket({ bookingData, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [cancelRes, setCancelRes] = useState({});
  const [SaleLoading, setSaleLoading] = useState(true);
  const [ticket, setTicket] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastStatus, setToastStatus] = useState("");

  const history = useNavigate();

  const cancelObj = useCallback(() => {
    return {
      pnr: bookingData.data.galilo_pnr,
      reservationCode: bookingData.data.LocatorCode,
      provider: bookingData.data.provider_type,
    };
  }, [bookingData]);

  const cancelBookings = useCallback(async () => {
    let obj = cancelObj();
    Axios.get(
      `api/cancelrequest?pnr=${obj.pnr}&ticket_reservation_code=${obj.reservationCode}&provider_type=${obj.provider}`
    ).then((response) => {
      const res = response.data;
      setCancelRes(res);
      setLoadings(false);
    });
  }, [cancelObj]);

  useEffect(() => {
    if (cancel) {
      cancelBookings();
    }
  }, [cancel, cancelBookings]);

  if (bookingData.data.segments.length === 0) {
    return (
      <FailedBooking className="d-flex flex-column">
        <h4>Booking Not Found.</h4>
        <div className="foot">
          <Link to="/">Go to Home</Link>
        </div>
      </FailedBooking>
    );
  }

  const lastIndex = bookingData.data.segments.length - 1;
  let firstCity = bookingData.data.segments[0].origin_city_name.split(",");
  firstCity = firstCity[0].split(" ");
  let lastCity =
    bookingData.data.segments[lastIndex].destination_city_name.split(",");
  lastCity = lastCity[0].split(" ");

  let ticketing = "E-Ticket Reservation";

  if (
    bookingData.data.ticket_numbers &&
    bookingData.data.ticket_numbers.length ===
      bookingData.data.passenger_detail.length
  ) {
    ticketing = "E-Ticket Confirmation";
  }

  let count = 0;

  firstCity.map((origin) => {
    lastCity.map((destination) => {
      if (destination === origin) {
        count++;
      }
      return 0;
    });
    return 0;
  });

  const round = count > 0 ? true : false;

  let post = 0;
  let current = 0;
  let counter = 0;
  let roundLast = round
    ? bookingData.data.segments.map((segment, index) => {
        current = index;
        counter = 0;
        post =
          bookingData.data.segments.length > current + 1
            ? current + 1
            : current;
        let destCity = segment.destination_city_name.split(" ");
        let originCity =
          bookingData.data.segments[post].origin_city_name.split(" ");

        destCity.map((destination) => {
          originCity.map((origin) => {
            if (destination == origin) {
              counter++;
            }
          });
        });

        if (counter > 0 && bookingData.data.segments.length > 2) {
          return bookingData.data.segments[post];
        } else if (counter > 0 && bookingData.data.segments.length <= 2) {
          return segment;
        }
      })
    : "";
  if (roundLast != "" && round) {
    roundLast = roundLast.filter(Boolean);
  }

  const grouped = bookingData.data.segments.filter((seg) => seg.Group === "0");

  const firstSegment = bookingData.data.segments[0];
  const lastSegment = round
    ? roundLast[0]
    : bookingData.data.segments[lastIndex];
  const totalStops = bookingData.data.segments.length - 1;

  let totalFlightTime = 0;

  if (round) {
    let x = 0;

    bookingData.data.segments.map((segment) => {
      if (x === 0) {
        totalFlightTime += Number(segment.TravelTime);
      }

      if (
        lastSegment.destination_city_name === segment.destination_city_name ||
        lastSegment.origin_city_name !== segment.origin_city_name
      ) {
        x++;
      }

      return "";
    });
  } else {
    totalFlightTime = bookingData.data.segments.reduce(
      (accumulator, segment) => accumulator + Number(segment.TravelTime),
      0
    );
  }

  let TotalPrice = 0;
  if (bookingData.data.pricing.length > 0) {
    bookingData.data.pricing.map((price) => {
      return (TotalPrice += Number(price.TotalPriceWithCommission));
    });
    TotalPrice = "PKR " + TotalPrice + "/-";
  } else {
    TotalPrice = "PKR 0/-";
  }

  // PDF Print Function
  function print() {
    savePdf(
      <Document
        bookingData={bookingData}
        totalStops={totalStops}
        totalFlightTime={totalFlightTime}
        firstSegment={firstSegment}
        lastSegment={lastSegment}
        round={round}
        TotalPrice={TotalPrice}
        ticketing={ticketing}
      />,
      "4E - Ticket Information.pdf"
    );
  }

  const ModalToggle = () => {
    setShowModal(!showModal);
  };
  const isIframe = window.self !== window.top;
  const PNR = bookingData.data.galilo_pnr;
  const BookingInstance = bookingData.data.used_for_ticket_reservation_code;
  const Pricing = bookingData.data.pricing;
  const LastName = bookingData.data.passenger_detail[0].lastName;
  let TicketData = {};
  if (userId !== "") {
    TicketData = {
      pnr: PNR,
      locator_code: BookingInstance,
      pricing_info: Pricing,
      user_id: userId,
    };
  } else {
    TicketData = {
      pnr: PNR,
      locator_code: BookingInstance,
      pricing_info: Pricing,
    };
  }
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
    top: "70%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "5px",
    zIndex: 9999, // Set a high z-index to ensure it appears on top of other elements
    display: showToast ? "block" : "none",
  };
  const TravelportGenerateTicket = useCallback(async () => {
    if (!ticket && SaleLoading) {
      const TravelportTicketAPI = "api/issue-ticket";
      setTicket(true);
      setSaleLoading(false);
      Axios.post(TravelportTicketAPI, TicketData).then((response) => {
        const res = response.data;
        if (res.status === "200") {
          handleShowToast("Great!!! Ticket issued Successfully.", "success");
          history({
            pathname: `/get-flight-booking/pnr=${PNR}&last_name=${LastName}&pre=200`,
          });
          if (bookingData.data.ticket_numbers.length !== "0") {
            setShowBtn(false);
          }
        } else if (res.status === "400") {
          handleShowToast(res.message, "error");
        }
      });
    }
  }, [SaleLoading, PNR, BookingInstance, bookingData]);
  return (
    <>
      {bookingData.status && bookingData.status !== "400" ? (
        <ErrorBoundary>
          <ConfirmParent>
            <div
              className="main container"
              style={{
                borderStyle: "dotted",
                borderColor: "#ada397",
                borderRadius: "1%",
                opacity: showModal ? "0.5" : "1",
                marginTop: "5rem",
              }}
            >
              <div className="success ">
                <div className="success-head">
                  <div className="success-head pt-3 d-flex justify-content-between align-items-center">
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
                </div>
                <hr />
                {/* <div className="PAX-info row">
                  <div className="left">
                    <div className="PAX-inner-row">
                      <h4>Passenger: </h4>
                      <p>
                        {bookingData.data.passenger_detail[0].firstName +
                          " " +
                          bookingData.data.passenger_detail[0].lastName}
                      </p>
                    </div>
                    <div className="PAX-inner-row">
                      <h4>Issuing Agent: </h4>
                      <p>Bukhari Travel Services</p>
                    </div>
                    <div className="PAX-inner-row">
                      <h4>PNR Creation Date: </h4>
                      <p>{date_convert(bookingData.data.CreateDateTime)}</p>
                    </div>
                    <div className="PAX-inner-row">
                      <h4>Airline Reference: </h4>
                      <p>{bookingData.data.SupplierLocatorCode}</p>
                    </div>
                    {bookingData.data.passenger_detail[0].passport_number && (
                      <div className="PAX-inner-row">
                        <h4>Passport Number: </h4>
                        <p>
                          {toUpper(
                            bookingData.data.passenger_detail[0].passport_number
                          )}
                        </p>
                      </div>
                    )}
                    {bookingData.data.passenger_detail[0].nationality && (
                      <div className="PAX-inner-row">
                        <h4>Fare: </h4>
                        <p>{TotalPrice}</p>
                      </div>
                    )}
                  </div>
                  <div className="right">
                    {bookingData.data.passenger_detail[0].nationality && (
                      <div className="PAX-inner-row">
                        <h4>Nationality: </h4>
                        <p>
                          {toUpper(
                            bookingData.data.passenger_detail[0].nationality
                          )}
                        </p>
                      </div>
                    )}
                    <div className="PAX-inner-row">
                      <h4>Foure Reference (PNR): </h4>
                      <p>{bookingData.data.galilo_pnr}</p>
                    </div>
                    <div className="PAX-inner-row">
                      <h4>IATA Number: </h4>
                      <p>27303054</p>
                    </div>
                    {bookingData.data.passenger_detail[0].passport_number && (
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
                    )}
                    {!bookingData.data.passenger_detail[0].nationality && (
                      <div className="PAX-inner-row">
                        <h4>Fare: </h4>
                        <p>{TotalPrice}</p>
                      </div>
                    )}
                  </div>
                </div> */}
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
                      <p className="pl-2">{bookingData.data.galilo_pnr}</p>
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
                <hr />
                <table className="table table-bordered">
                  <thead className="py-0 my-0">
                    <tr
                      className="py-0 my-0 font-weight-bold"
                      style={{ fontSize: "14px" }}
                    >
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Passport/CNIC</th>
                      <th>e-Ticket Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingData.data.passenger_detail.map((pax, index) => {
                      return (
                        <tr
                          style={{ fontSize: "14px" }}
                          className="font-weight-bold"
                          key={Math.random()}
                        >
                          <td>
                            <p>
                              {pax.title}.{pax.firstName}
                            </p>
                          </td>
                          <td>
                            <p>{pax.lastName}</p>
                          </td>
                          {bookingData.data.passenger_detail[index]
                            .passport_number && <td>{pax.passport_number}</td>}
                          {bookingData.data.passenger_detail[index].cnic ? (
                            <td>{pax.cnic}</td>
                          ) : (
                            <td>-------</td>
                          )}

                          {bookingData.data.ticket_numbers !== "" &&
                          bookingData.data.ticket_numbers !== undefined ? (
                            <p className="mt-3">
                              {
                                bookingData.data.ticket_numbers[index]
                                  .ticket_number
                              }
                            </p>
                          ) : (
                            <td>-------</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <hr />

                <div className="flight-info-parent">
                  <h3>Flight Details</h3>
                  <p>Flight Type:{round ? "Round-Trip" : "one-way"}</p>
                  <p className="text-primary">
                    Distance : <span className="text-dark"> </span>
                    {time_convert(totalFlightTime)}
                  </p>
                  <div className="d-flex container justify-content-between align-items-center mt-4 mb-4">
                    <div className="text-start">
                      <h3 className="text-primary font-weight-bold d-flex justify-content-start">
                        {firstSegment.Origin}
                      </h3>
                      <p>{firstSegment.origin_city_name}</p>
                      <p className="d-flex justify-content-start">Departure </p>
                      <p
                        className="d-flex justify-content-start"
                        title={time_zone(firstSegment.DepartureTime)}
                      >
                        {utc_convert(firstSegment.DepartureTime)}
                      </p>
                      <p className="d-flex justify-content-start">
                        {date_convert(firstSegment.DepartureTime)}
                      </p>
                    </div>
                    <div>
                      <div>
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
                      <p>{firstSegment.destination_city_name}</p>
                      <p className="d-flex justify-content-start">Arrival </p>
                      <p
                        className="d-flex justify-content-start"
                        title={time_zone(lastSegment.ArrivalTime)}
                      >
                        {utc_convert(lastSegment.ArrivalTime)}
                      </p>
                      <p className="d-flex justify-content-start">
                        {date_convert(lastSegment.ArrivalTime)}
                      </p>
                    </div>
                  </div>
                  <hr />
                  {bookingData.data.segments.map((segment, index) => {
                    let originCity = segment.origin_city_name.split(",");
                    let destinationCity =
                      segment.destination_city_name.split(",");
                    return (
                      <div
                        style={{
                          borderStyle: "dotted",
                          borderColor: "#ada397",
                          borderRadius: "1%",
                        }}
                        className="flight-info"
                        key={Math.random()}
                      >
                        <div className="flight-inner-row">
                          <p
                            style={{ fontSize: "16px" }}
                            className=" font-weight-bold"
                          >
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
                              {segment.airline_name !== null ? (
                                <p
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {toUpper(segment.airline_name.slice(0, 1)) +
                                    segment.airline_name.slice(1) +
                                    " (" +
                                    segment.Carrier +
                                    ") " +
                                    segment.FlightNumber}
                                </p>
                              ) : (
                                <p>{`${segment.Carrier}-${segment.FlightNumber}`}</p>
                              )}
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
                                  title={time_zone(segment.DepartureTime)}
                                >
                                  {utc_convert(segment.DepartureTime)}
                                </h5>
                              </div>
                              <h5>{date_convert(segment.DepartureTime)}</h5>
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
                                  title={time_zone(segment.ArrivalTime)}
                                >
                                  {utc_convert(segment.ArrivalTime)}
                                </h5>
                              </div>
                              <h5
                                style={{ fontSize: "16px" }}
                                className=" font-weight-bold"
                              >
                                {date_convert(segment.ArrivalTime)}
                              </h5>
                            </div>
                          </div>
                          <div className="flight-inner-row-mobile">
                            <div className="airline">
                              <img
                                src={segment.airline_logo}
                                alt="Carrier Logo"
                              />
                              <p
                                style={{ fontSize: "16px" }}
                                className=" font-weight-bold"
                              >
                                {segment.airline_name +
                                  " (" +
                                  segment.Carrier +
                                  ") " +
                                  segment.FlightNumber}
                              </p>
                            </div>
                            <div className="flight-inner-depart-arrive">
                              <div className="depart">
                                <h4
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  Departure
                                </h4>
                                <h5
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                  title={time_zone(segment.DepartureTime)}
                                >
                                  {utc_convert(segment.DepartureTime)}
                                </h5>
                                <h4
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {date_convert(segment.DepartureTime)}
                                </h4>
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
                                <h5 title={time_zone(segment.ArrivalTime)}>
                                  {utc_convert(segment.ArrivalTime)}
                                </h5>
                                <h4
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {date_convert(segment.ArrivalTime)}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <h4
                            style={{ fontSize: "16px" }}
                            className=" font-weight-bold"
                          >
                            Class of Service: <span>{segment.CabinClass}</span>
                          </h4>
                          {bookingData.data.segments.length > 1 &&
                            bookingData.data.segments.length - 1 !== index &&
                            segment.origin_city_name !==
                              lastSegment.destination_city_name &&
                            segment.destination_city_name !==
                              lastSegment.destination_city_name && (
                              <h4
                                style={{ fontSize: "16px" }}
                                className=" font-weight-bold"
                              >
                                Layover: &nbsp;
                                <span
                                  style={{ fontSize: "16px" }}
                                  className=" font-weight-bold"
                                >
                                  {diff_minutes(
                                    segment.ArrivalTime,
                                    bookingData.data.segments[
                                      index + 1 ===
                                      bookingData.data.segments.length
                                        ? bookingData.data.segments.length - 1
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
              </div>
              {!isIframe && (
                <div className="foot">
                  <span
                    className="cursor-pointer foot-btn cursor-pointer"
                    onClick={print}
                  >
                    Download PDF
                  </span>
                  <span
                    className="cursor-pointer cancel btn-danger cursor-pointer"
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
                      onClick={TravelportGenerateTicket}
                      data-toggle="modal"
                      data-target="#cancelModal"
                    >
                      Issue Ticket
                    </span>
                  )}
                </div>
              )}

              {/* <PDFViewer style={{width: '100%', height: '1300px'}}>
                                    <Document bookingData={bookingData} totalStops={totalStops} totalFlightTime={totalFlightTime} 
                                        firstSegment={firstSegment} lastSegment={lastSegment} round={round} TotalPrice={TotalPrice} 
                                        ticketing={ticketing} />
                                </PDFViewer> */}
            </div>
          </ConfirmParent>
          {/* Bootstrap Cancel Modal */}
          {showModal ? (
            <CancelModal
              ModalToggle={ModalToggle}
              showModal={showModal}
              setCancel={setCancel}
              loadings={loadings}
              cancelRes={cancelRes}
            />
          ) : (
            ""
          )}
        </ErrorBoundary>
      ) : (
        <FailedBooking className="d-flex flex-column">
          <h4>Booking Not Found.</h4>
          <div className="foot">
            <Link to="/">Go to Home</Link>
          </div>
        </FailedBooking>
      )}
    </>
  );
}
