import React, { useState } from "react";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  Details,
} from "../FlightDetails/wrapper/FlightDetailsStyle";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import Airbluesegment from "../FlightDetails/segment/Airbluesegment";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import {
  diff_minutes,
  date_convert,
  utc_convert,
} from "../../../helper/ConvertFunctions";

export const AirBlueRoundList = ({ flight, queryString, setFlightKey }) => {
  const [segment, setSegment] = useState(false);
  const showSegment = (key) => {
    const elements = document.getElementsByClassName(key)[0];
    if (elements.classList.contains("d-none")) {
      elements.classList.remove("d-none");
    } else {
      elements.classList.add("d-none");
    }
  };
  const { cabin } = queryString;

  const setAirBlueKey = (key) => {
    setFlightKey(key);
  };
  let roundFlights = [];
  let roundAllFlights = flight;

  return (
    <>
      {roundAllFlights.map((roundflt) => {
        let flight = roundflt;
        if (!roundFlights.includes(roundflt.segments.FlightNumber)) {
          roundFlights.push(roundflt.segments.FlightNumber);
          return (
            <AirlineDetailsView className="my-3" key={flight.key}>
              <ErrorBoundary>
                <AirlineContainer>
                  {/* Segment Section Start */}
                  <SegmentSection className="pr-2">
                    {/* Segment Start */}
                    <div key={flight.key} className="segment">
                      <div className="logo-section">
                        <img
                          alt="Airline Logo"
                          src={flight.segments.airline_logo}
                        />
                      </div>
                      <div className="takeoff-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo takeoff"
                          src={Airplane}
                        />
                        <span>
                          {utc_convert(flight.segments.DepartureDateTime)}
                        </span>
                        <h5>
                          <span>
                            {flight.segments.origin_city_name},{" "}
                            {flight.segments.Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(flight.segments.DepartureDateTime)}
                          </h6>
                        </span>
                      </div>

                      {/* Stop Details (Desktop View) */}
                      <div className="stop-details">
                        <div className="size-12">Direct Flight</div>
                        <p className="dotted-line" />
                        <div className="flight-time">
                          <span>
                            Flight Time:{" "}
                            {diff_minutes(
                              flight.segments.DepartureDateTime,
                              flight.segments.ArrivalDateTime
                            )}
                          </span>
                          <div>
                            {queryString.returnDate === "undefined"
                              ? ""
                              : "Round-Trip"}
                          </div>
                        </div>
                      </div>
                      {/* Stop Details (Mobile View) */}
                      <div className="mobile-stop-details">
                        <div className="size-12">Direct Flight</div>
                        <div className="flight-time">
                          <span>
                            Flight Time:{" "}
                            {diff_minutes(
                              flight.segments.DepartureDateTime,
                              flight.segments.ArrivalDateTime
                            )}
                          </span>
                          <div>
                            {queryString.returnDate === "undefined"
                              ? ""
                              : "Round-Trip"}
                          </div>
                        </div>
                      </div>
                      <div className="arrive-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo arrive"
                          src={Airplane}
                        />
                        <span>
                          {utc_convert(flight.segments.ArrivalDateTime)}
                        </span>
                        <h5>
                          <span>
                            {flight.segments.Destination_city_name},{" "}
                            {flight.segments.Destination}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(flight.segments.ArrivalDateTime)}
                          </h6>
                        </span>
                      </div>
                    </div>
                    <div className="card-columns">
                      {roundAllFlights.map((fltbgag) => {
                        if (
                          fltbgag.segments.FlightNumber ===
                          flight.segments.FlightNumber
                        ) {
                          let BaggageInfo = {};
                          let val = "";
                          let unit = "";
                          let baggagePrice = fltbgag.price;

                          if (
                            fltbgag.PTC_FareBreakdowns[0].FareInfo2
                              .PassengerFare
                          ) {
                            val =
                              fltbgag.PTC_FareBreakdowns[0].FareInfo2
                                .PassengerFare.FareBaggageAllowance
                                .UnitOfMeasureQuantity;
                            unit =
                              fltbgag.PTC_FareBreakdowns[0].FareInfo2
                                .PassengerFare.FareBaggageAllowance
                                .UnitOfMeasure === "KGS"
                                ? "Kilograms"
                                : fltbgag.PTC_FareBreakdowns.FareInfo2
                                    .PassengerFare.FareBaggageAllowance
                                    .UnitOfMeasure;
                            BaggageInfo = { Value: val, Unit: unit };
                          } else {
                            val = "Nil";
                            unit = "Baggage";
                            BaggageInfo = { Value: val, Unit: unit };
                          }
                          return (
                            <div
                              className={`border rounded begg-info`}
                              key={fltbgag.key}
                              onClick={() => setAirBlueKey(fltbgag.key)}
                            >
                              <div className=" text-center  py-2">
                                <p className="card-text text-light">
                                  {BaggageInfo.Value} {BaggageInfo.Unit}
                                </p>
                                <p className="text-light">
                                  {" "}
                                  PKR: {baggagePrice}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    {/* Segment End */}
                  </SegmentSection>
                  {/* Segment Section End */}

                  <div className="price-section">
                    <h3>PKR {Number(flight.price)}</h3>
                    <p>{`(incl.taxes & fees)`}</p>
                    <button onClick={() => setAirBlueKey(flight.key)}>
                      Select <AiFillRightCircle className="mb-1" />
                    </button>
                  </div>
                  <Details>
                    <p
                      className="cursor-pointer"
                      onClick={() => showSegment(flight.key)}
                    >
                      View Details
                    </p>
                  </Details>
                </AirlineContainer>
                {
                  <Airbluesegment
                    flight={flight}
                    cabin={cabin}
                    segments={flight.segments}
                    callFrom="airbluelist"
                  />
                }
              </ErrorBoundary>
            </AirlineDetailsView>
          );
        }
      })}
    </>
  );
};
