import React, { useState } from "react";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import Airbluesegment from "./segment/Airbluesegment";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import {
  date_convert,
  diff_minutes,
  utc_convert,
} from "../../../helper/ConvertFunctions";

import {
  AirlineListMain,
  AirlineContainer,
  SegmentSection,
  Details,
} from "./wrapper/FlightDetailsStyle";

const AirblueList = ({ flight, handleFlight, query }) => {
  const [segment, setSegment] = useState(false);

  const showSegment = (key) => {
    const elements = document.getElementsByClassName(key)[0];
    if (elements.classList.contains("d-none")) {
      elements.classList.remove("d-none");
    } else {
      elements.classList.add("d-none");
    }
  };

  const { cabin } = query;

  const handleFlightView = (flt) => {
    handleFlight(flt);
  };
  let preFlightNum = [];
  if (cabin == "EXECUTIVE_ECONOMY" || cabin == "Business") {
    return;
  } else {
    return (
      <>
        {flight.map((flt) => {
          let segments = flt.segments;
          let price = flt.price;
          let key = flt.key;

          if (!preFlightNum.includes(flt.segments.FlightNumber)) {
            preFlightNum.push(flt.segments.FlightNumber);
            return (
              segments.boundType !== "inbound" && (
                <ErrorBoundary key={key}>
                  <AirlineListMain
                    className={`flight-list direct PA ${
                      flt.pageNumClass !== undefined ? flt.pageNumClass : ""
                    }`}
                  >
                    <AirlineContainer>
                      {/* Segment Section Start */}
                      <SegmentSection className="pr-2">
                        {/* Segment Start */}
                        <div key={segments.key} className="segment">
                          <div className="logo-section">
                            <img
                              alt="Airline Logo"
                              src={segments.airline_logo}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "/no-image.png";
                              }}
                            />
                          </div>
                          <div className="takeoff-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo takeoff"
                              src={Airplane}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "/no-image.png";
                              }}
                            />
                            <span>
                              {utc_convert(segments.DepartureDateTime)}
                            </span>
                            <h5>
                              <span>
                                {segments.origin_city_name}, {segments.Origin}
                              </span>
                            </h5>
                            <span>
                              <h6>
                                {date_convert(segments.DepartureDateTime)}
                              </h6>
                            </span>
                          </div>

                          {/* Stop Details (Desktop View) */}
                          <div className="stop-details">
                            <div className="size-12">Direct Flight</div>
                            <p className="dotted-line" />
                            <div className="flight-time">
                              <span>
                                Total Flight Time:{" "}
                                {diff_minutes(
                                  segments.DepartureDateTime,
                                  segments.ArrivalDateTime
                                )}
                              </span>
                              <div>
                                {query.returnDate === "undefined"
                                  ? ""
                                  : "Round-Trip"}
                              </div>
                              <div>
                                {query.returnDate === "undefined"
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
                                Total Flight Time:{" "}
                                {diff_minutes(
                                  segments.DepartureDateTime,
                                  segments.ArrivalDateTime
                                )}
                              </span>
                              <div>
                                {query.returnDate === "undefined"
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
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "/no-image.png";
                              }}
                            />
                            <span>{utc_convert(segments.ArrivalDateTime)}</span>
                            <h5>
                              <span>
                                {segments.Destination_city_name},{" "}
                                {segments.Destination}
                              </span>
                            </h5>
                            <span>
                              <h6>{date_convert(segments.ArrivalDateTime)}</h6>
                            </span>
                          </div>
                        </div>
                        <div className="card-columns">
                          {flight.map((fltbgag) => {
                            if (
                              fltbgag.segments.FlightNumber ===
                              segments.FlightNumber
                            ) {
                              let BaggageInfo = {};
                              let val = "";
                              let unit = "";
                              let baggagePrice = fltbgag.price;
                              if (
                                fltbgag.PTC_FareBreakdowns[0].FareInfo !==
                                  undefined &&
                                fltbgag.PTC_FareBreakdowns[0].FareInfo2 !==
                                  undefined
                              ) {
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
                              }
                              return (
                                <div
                                  className={`border rounded begg-info`}
                                  key={fltbgag.key}
                                  onClick={() => {
                                    handleFlightView(fltbgag);
                                  }}
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
                        <h3>PKR {Number(price)}</h3>
                        <p>{"(incl.taxes & fees)"}</p>
                        <button
                          onClick={() => {
                            handleFlightView(flt);
                          }}
                        >
                          {" "}
                          Select <AiFillRightCircle className="mb-1" />
                        </button>
                      </div>

                      <Details>
                        <p onClick={() => showSegment(key)} to="/">
                          View Details
                        </p>
                      </Details>
                    </AirlineContainer>
                    {
                      <Airbluesegment
                        flight={flt}
                        segments={segments}
                        cabin={cabin}
                        callFrom="airbluelist"
                      />
                    }
                  </AirlineListMain>
                </ErrorBoundary>
              )
            );
          }
        })}
      </>
    );
  }
};

export default AirblueList;
