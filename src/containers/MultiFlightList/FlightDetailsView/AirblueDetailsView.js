import React, { useState } from "react";
import Airplane from "../../../assets/img/airplane.webp";
import DetailsViewSidebar from "./DetailsViewSidebar";
import AirblueMultiSegment from "./AirblueMultiSegment";
import AirblueMultiList from "./AirblueMultiList";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import {
  diff_minutes,
  date_convert,
  utc_convert,
} from "../../../helper/ConvertFunctions";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  FlightDetailsParent,
} from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";

export default function AirblueDetailsView({
  fieldsData,
  selectedFlight,
  airBlueMultiObj,
  handleFlight,
  navigateTo,
}) {
  if (selectedFlight.length < fieldsData.length) {
    let selectedLength = selectedFlight.length;
    let nextSelectIndex = selectedLength - 1;
    let multiFlights = airBlueMultiObj[0];
    let fromAirport = fieldsData[selectedLength].fromAirport.slice(0, 3);
    let toAirport = fieldsData[selectedLength].toAirport.slice(0, 3);
    let Flights = [];
    Flights.push(multiFlights);

    return (
      <FlightDetailsParent>
        <ErrorBoundary>
          <div className="d-flex">
            <div className="main">
              <h4
                className="text-center mb-15 font-weight-bold"
                style={{ color: "#378EDD" }}
              >
                Your Selected Flight(s)
              </h4>
              <AirlineDetailsView>
                <AirlineContainer>
                  {selectedFlight.map((flt) => {
                    return (
                      <div
                        className="row w-100"
                        key={flt.toString() + Math.random()}
                      >
                        {/* Segment Section Start */}
                        <SegmentSection className="pr-2">
                          {/* Segment Start */}
                          <div className="segment">
                            <div className="logo-section">
                              <img
                                alt="Airline Logo"
                                src={flt.segments.airline_logo}
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
                                {utc_convert(flt.segments.DepartureDateTime)}
                              </span>
                              <h5>
                                <span>
                                  {flt.segments.origin_city_name},{" "}
                                  {flt.segments.Origin}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(flt.segments.DepartureDateTime)}
                                </h6>
                              </span>
                            </div>
                            {/* Stop Details (Desktop View) */}
                            <div className="stop-details my-auto pt-3">
                              <div className="flight-time">
                                <span>
                                  Total Flight Time:{" "}
                                  {diff_minutes(
                                    flt.segments.DepartureDateTime,
                                    flt.segments.ArrivalDateTime
                                  )}
                                </span>
                              </div>
                              <p className="dotted-line" />
                              <div className="flight-time">
                                <div>{"Multi-Trip"}</div>
                              </div>
                            </div>
                            {/* Stop Details (Mobile View) */}
                            <div className="mobile-stop-details">
                              <div className="flight-time">
                                <span>
                                  Total Flight Time:{" "}
                                  {diff_minutes(
                                    flt.segments.DepartureDateTime,
                                    flt.segments.ArrivalDateTime
                                  )}
                                </span>
                                <div>{"Multi-Trip"}</div>
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
                              <span>
                                {utc_convert(flt.segments.ArrivalDateTime)}
                              </span>
                              <h5>
                                <span>
                                  {`${flt.segments.Destination_city_name}, ${flt.segments.Destination}`}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(flt.segments.ArrivalDateTime)}
                                </h6>
                              </span>
                            </div>
                          </div>
                          {/* Segment End */}
                        </SegmentSection>
                        {/* Segment Section End */}
                        <div className="price-section">
                          <h3>{Number(flt.price)}</h3>
                          <p>(incl.taxes & fees)</p>
                        </div>
                      </div>
                    );
                  })}
                </AirlineContainer>
              </AirlineDetailsView>
              <h4
                className="text-center mt-15 mb-15 font-weight-bold"
                style={{ color: "#378EDD" }}
              >
                Choose Your Flight For {fromAirport} - {toAirport}
              </h4>
              <ErrorBoundary>
                {Flights.map((airblueMulti, index) => {
                  return (
                    <AirblueMultiList
                      key={index}
                      flight={airblueMulti[index]}
                      handleFlight={handleFlight}
                    />
                  );
                })}
              </ErrorBoundary>
            </div>
            <div className="mt-4 pt-3">
              <DetailsViewSidebar
                fieldsData={fieldsData}
                selectedFlight={selectedFlight}
              />
            </div>
          </div>
        </ErrorBoundary>
      </FlightDetailsParent>
    );
  } else {
    return (
      <FlightDetailsParent>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              {selectedFlight.map((airblue) => {
                return (
                  <AirlineContainer key={Math.random()}>
                    <SegmentSection className="pr-2">
                      <div className="segment">
                        <div className="logo-section">
                          <img
                            alt="Airline Logo"
                            src={airblue.segments.airline_logo}
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
                            {utc_convert(airblue.segments.DepartureDateTime)}
                          </span>
                          <h5>
                            <span>
                              {airblue.segments.origin_city_name},{" "}
                              {airblue.segments.Origin}
                            </span>
                          </h5>
                          <span>
                            <h6>
                              {date_convert(airblue.segments.DepartureDateTime)}
                            </h6>
                          </span>
                        </div>
                        {/* Stop Details (Desktop View) */}
                        <div className="stop-details my-auto pt-3">
                          <div className="flight-time">
                            <span>
                              Total Flight Time:{" "}
                              {diff_minutes(
                                airblue.segments.DepartureDateTime,
                                airblue.segments.ArrivalDateTime
                              )}
                            </span>
                          </div>
                          <p className="dotted-line" />
                          <div className="flight-time">
                            <div>{"Multi-Trip"}</div>
                          </div>
                        </div>
                        {/* Stop Details (Mobile View) */}
                        <div className="mobile-stop-details">
                          <div className="flight-time">
                            <span>
                              Total Flight Time:{" "}
                              {diff_minutes(
                                airblue.segments.DepartureDateTime,
                                airblue.segments.ArrivalDateTime
                              )}
                            </span>
                            <div>{"Multi-Trip"}</div>
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
                          <span>
                            {utc_convert(airblue.segments.ArrivalDateTime)}
                          </span>
                          <h5>
                            <span>
                              {`${airblue.segments.Destination_city_name}, ${airblue.segments.Destination}`}
                            </span>
                          </h5>
                          <span>
                            <h6>
                              {date_convert(airblue.segments.ArrivalDateTime)}
                            </h6>
                          </span>
                        </div>
                      </div>
                    </SegmentSection>
                    <div className="price-section">
                      <h3>{Number(airblue.price)}</h3>
                      <p>(incl.taxes & fees)</p>
                    </div>
                  </AirlineContainer>
                );
              })}
              <AirblueMultiSegment selectedFlight={selectedFlight} />
            </AirlineDetailsView>
          </div>
          <DetailsViewSidebar
            fieldsData={fieldsData}
            selectedFlight={selectedFlight}
            navigateTo={navigateTo}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    );
  }
}
