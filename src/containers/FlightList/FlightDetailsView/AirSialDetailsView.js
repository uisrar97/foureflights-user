import React, { useState } from "react";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  FlightDetailsParent,
} from "../FlightDetails/wrapper/FlightDetailsStyle";
import Airplane from "../../../assets/img/airplane.webp";
import AirSialSegment from "../FlightDetails/segment/AirSialSegment";
import AirSialRoundSegment from "../FlightDetails/segment/AirSialRoundSegment";
import { AirSialRoundList } from "./AirSialRoundList";
import DetailsViewSidebar from "./DetailsViewSidebar";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import {
  time_convert,
  date_convert,
  airsial_time_convert,
} from "../../../helper/ConvertFunctions";

export const AirSialDetailsView = ({
  navigateTo,
  showModal,
  singleFlight,
  queryString,
  flights,
  flightKey,
  setFlightKey,
}) => {
  const { cabin, returnDate } = queryString;
  let airSialInbound = [];
  flights.result.flights.map((flt) => {
    if (
      flt.provider_type === "airsial" &&
      flt.segments.inbound &&
      returnDate !== "undefined"
    ) {
      airSialInbound.push(flt);
    }
    return 0;
  });

  if (returnDate === "undefined") {
    const { segments, price, availableFareTypes, selectedBagageDesc } =
      singleFlight[0];
    const lengthOut = segments.outbound.length;

    return segments !== null ? (
      <FlightDetailsParent key={Math.random()}>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              <AirlineContainer>
                {/* Segment Section Start */}
                <SegmentSection className="pr-2">
                  {/* Segment Start */}
                  {segments.outbound.map((outbound) => (
                    <div key={Math.random()} className="segment">
                      <div className="logo-section">
                        <img alt="Airline Logo" src={outbound.airline_logo} />
                      </div>
                      <div className="takeoff-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo takeoff"
                          src={Airplane}
                        />
                        <span>
                          {airsial_time_convert(outbound.DEPARTURE_TIME)}
                        </span>
                        <h5>
                          <span>
                            {outbound.origin_city_name}, {outbound.Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>{date_convert(outbound.DEPARTURE_DATE)}</h6>
                        </span>
                      </div>
                      {/* Stop Details (Desktop View) */}
                      <div className="stop-details">
                        <div className="size-12">
                          {lengthOut === 1
                            ? "Direct Flight"
                            : lengthOut + " Stops"}
                        </div>
                        <p className="dotted-line" />
                        <div className="flight-time">
                          <span>
                            Flight Time: {time_convert(outbound.FlightTime)}
                          </span>
                        </div>
                      </div>
                      {/* Stop Details (Mobile View) */}
                      <div className="mobile-stop-details">
                        <div className="size-12">
                          {lengthOut === 1
                            ? "Direct Flight"
                            : lengthOut + " Stops"}
                        </div>
                        <div className="flight-time">
                          <span>
                            Flight Time: {time_convert(outbound.FlightTime)}
                          </span>
                        </div>
                      </div>
                      <div className="arrive-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo arrive"
                          src={Airplane}
                        />
                        <span>
                          {airsial_time_convert(outbound.ARRIVAL_TIME)}
                        </span>
                        <h5>
                          <span>
                            {`${outbound.Destination_city_name}, ${outbound.Destination}`}
                          </span>
                        </h5>
                        <span>
                          <h6>{date_convert(outbound.DEPARTURE_DATE)}</h6>
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* Segment End */}
                </SegmentSection>
                {/* Segment Section End */}
                <div className="price-section">
                  <h3>{`PKR ${Number(price)}`}</h3>
                  <p>(incl.taxes & fees)</p>
                </div>
              </AirlineContainer>

              <AirSialSegment
                cabin={cabin}
                baggage={selectedBagageDesc}
                segments={segments}
              />
            </AirlineDetailsView>
          </div>
          <DetailsViewSidebar
            queryString={queryString}
            showModal={showModal}
            singleFlight={singleFlight[0]}
            navigateTo={navigateTo}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    ) : (
      ""
    );
  } else if (returnDate !== "undefined" && flightKey === false) {
    const { segments, price } = singleFlight[0];
    const lengthOut = segments.outbound.length;

    return segments !== null ? (
      <FlightDetailsParent>
        <ErrorBoundary>
          <div className="main">
            <h4
              className="text-center mt-30 mb-30 font-weight-bold"
              style={{ color: "#378EDD" }}
            >
              Your Selected Outgoing Flight
            </h4>
            <AirlineDetailsView>
              <AirlineContainer>
                {/* Segment Section Start */}
                <SegmentSection className="pr-2">
                  {/* Segment Start */}
                  {
                    <div className="segment">
                      <div className="logo-section">
                        <img
                          alt="Airline Logo"
                          src={segments.outbound[0].airline_logo}
                        />
                      </div>
                      <div className="takeoff-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo takeoff"
                          src={Airplane}
                        />
                        <span>
                          {airsial_time_convert(
                            segments.outbound[0].DEPARTURE_TIME
                          )}
                        </span>
                        <h5>
                          <span>
                            {segments.outbound[0].origin_city_name},{" "}
                            {segments.outbound[0].Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(segments.outbound[0].DEPARTURE_DATE)}
                          </h6>
                        </span>
                      </div>
                      {/* Stop Details (Desktop View) */}
                      <div className="stop-details">
                        <div className="size-12">
                          {lengthOut === 1
                            ? "Direct Flight"
                            : lengthOut + " Stops"}
                        </div>
                        <p className="dotted-line" />
                        <div className="flight-time">
                          <span>
                            Flight Time:{" "}
                            {time_convert(segments.outbound[0].FlightTime)}
                          </span>
                        </div>
                      </div>
                      {/* Stop Details (Mobile View) */}
                      <div className="mobile-stop-details">
                        <div className="size-12">
                          {lengthOut === 1
                            ? "Direct Flight"
                            : lengthOut + " Stops"}
                        </div>
                        <div className="flight-time">
                          <span>
                            Flight Time:{" "}
                            {time_convert(segments.outbound[0].FlightTime)}
                          </span>
                        </div>
                      </div>
                      <div className="arrive-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo arrive"
                          src={Airplane}
                        />
                        <span>
                          {airsial_time_convert(
                            segments.outbound[0].ARRIVAL_TIME
                          )}
                        </span>
                        <h5>
                          <span>
                            {`${segments.outbound[0].Destination_city_name}, ${segments.outbound[0].Destination}`}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(segments.outbound[0].DEPARTURE_DATE)}
                          </h6>
                        </span>
                      </div>
                    </div>
                  }
                  {/* Segment End */}
                </SegmentSection>
                {/* Segment Section End */}
                <div className="price-section">
                  <h3>{`PKR ${Number(price)}`}</h3>
                  <p>(incl.taxes & fees)</p>
                </div>
              </AirlineContainer>
            </AirlineDetailsView>
            <h4
              className="text-center mt-30 mb-30 font-weight-bold"
              style={{ color: "#378EDD" }}
            >
              Choose Your Incoming Flight
            </h4>
            <ErrorBoundary>
              {airSialInbound.map((ASInbound) => {
                return (
                  <AirSialRoundList
                    flight={ASInbound}
                    queryString={queryString}
                    setFlightKey={setFlightKey}
                    key={Math.random()}
                  />
                );
              })}
            </ErrorBoundary>
          </div>
          <DetailsViewSidebar
            queryString={queryString}
            showModal={showModal}
            singleFlight={singleFlight[0]}
            navigateTo={navigateTo}
            flightKey={flightKey}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    ) : (
      ""
    );
  } else if (
    returnDate !== "undefined" &&
    flightKey !== false &&
    singleFlight.length > 1
  ) {
    return (
      <FlightDetailsParent key={Math.random()}>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              {singleFlight.map((singleAirSial) => {
                if (singleAirSial.segments.outbound) {
                  return (
                    <AirlineContainer key={Math.random()}>
                      {/* Segment Section Start */}
                      <SegmentSection className="pr-2">
                        {/* Segment Start */}
                        <div className="segment">
                          <div className="logo-section">
                            <img
                              alt="Airline Logo"
                              src={
                                singleAirSial.segments.outbound[0].airline_logo
                              }
                            />
                          </div>
                          <div className="takeoff-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo takeoff"
                              src={Airplane}
                            />
                            <span>
                              {airsial_time_convert(
                                singleAirSial.segments.outbound[0]
                                  .DEPARTURE_TIME
                              )}
                            </span>
                            <h5>
                              <span>
                                {
                                  singleAirSial.segments.outbound[0]
                                    .origin_city_name
                                }
                                , {singleAirSial.segments.outbound[0].Origin}
                              </span>
                            </h5>
                            <span>
                              <h6>
                                {date_convert(
                                  singleAirSial.segments.outbound[0]
                                    .DEPARTURE_DATE
                                )}
                              </h6>
                            </span>
                          </div>
                          {/* Stop Details (Desktop View) */}
                          <div className="stop-details">
                            <div className="size-12">
                              {singleAirSial.segments.outbound.length === 1
                                ? "Direct Flight"
                                : singleAirSial.segments.outbound.length +
                                  " Stops"}
                            </div>
                            <p className="dotted-line" />
                            <div className="flight-time">
                              <span>
                                Flight Time:{" "}
                                {time_convert(
                                  singleAirSial.segments.outbound[0].FlightTime
                                )}
                              </span>
                            </div>
                          </div>
                          {/* Stop Details (Mobile View) */}
                          <div className="mobile-stop-details">
                            <div className="size-12">
                              {singleAirSial.segments.outbound.length === 1
                                ? "Direct Flight"
                                : singleAirSial.segments.outbound.length +
                                  " Stops"}
                            </div>
                            <div className="flight-time">
                              <span>
                                Flight Time:{" "}
                                {time_convert(
                                  singleAirSial.segments.outbound[0].FlightTime
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="arrive-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo arrive"
                              src={Airplane}
                            />
                            <span>
                              {airsial_time_convert(
                                singleAirSial.segments.outbound[0].ARRIVAL_TIME
                              )}
                            </span>
                            <h5>
                              <span>
                                {`${singleAirSial.segments.outbound[0].Destination_city_name}, ${singleAirSial.segments.outbound[0].Destination}`}
                              </span>
                            </h5>
                            <span>
                              <h6>
                                {date_convert(
                                  singleAirSial.segments.outbound[0]
                                    .DEPARTURE_DATE
                                )}
                              </h6>
                            </span>
                          </div>
                        </div>
                        {/* Segment End */}
                      </SegmentSection>
                      {/* Segment Section End */}
                      <div className="price-section">
                        <h3>{`PKR ${Number(singleFlight[0].price)}`}</h3>
                        <p>(incl.taxes & fees)</p>
                      </div>
                    </AirlineContainer>
                  );
                } else if (singleAirSial.segments.inbound) {
                  return (
                    <AirlineContainer key={Math.random()}>
                      {/* Segment Section Start */}
                      <SegmentSection className="pr-2">
                        {/* Segment Start */}
                        <div className="segment">
                          <div className="logo-section">
                            <img
                              alt="Airline Logo"
                              src={
                                singleAirSial.segments.inbound[0].airline_logo
                              }
                            />
                          </div>
                          <div className="takeoff-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo takeoff"
                              src={Airplane}
                            />
                            <span>
                              {airsial_time_convert(
                                singleAirSial.segments.inbound[0].DEPARTURE_TIME
                              )}
                            </span>
                            <h5>
                              <span>
                                {
                                  singleAirSial.segments.inbound[0]
                                    .origin_city_name
                                }
                                , {singleAirSial.segments.inbound[0].Origin}
                              </span>
                            </h5>
                            <span>
                              <h6>
                                {date_convert(
                                  singleAirSial.segments.inbound[0]
                                    .DEPARTURE_DATE
                                )}
                              </h6>
                            </span>
                          </div>
                          {/* Stop Details (Desktop View) */}
                          <div className="stop-details">
                            <div className="size-12">
                              {singleAirSial.segments.inbound.length === 1
                                ? "Direct Flight"
                                : singleAirSial.segments.inbound.length +
                                  " Stops"}
                            </div>
                            <p className="dotted-line" />
                            <div className="flight-time">
                              <span>
                                Flight Time:{" "}
                                {time_convert(
                                  singleAirSial.segments.inbound[0].FlightTime
                                )}
                              </span>
                            </div>
                          </div>
                          {/* Stop Details (Mobile View) */}
                          <div className="mobile-stop-details">
                            <div className="size-12">
                              {singleAirSial.segments.inbound.length === 1
                                ? "Direct Flight"
                                : singleAirSial.segments.inbound.length +
                                  " Stops"}
                            </div>
                            <div className="flight-time">
                              <span>
                                Flight Time:{" "}
                                {time_convert(
                                  singleAirSial.segments.inbound[0].FlightTime
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="arrive-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo arrive"
                              src={Airplane}
                            />
                            <span>
                              {airsial_time_convert(
                                singleAirSial.segments.inbound[0].ARRIVAL_TIME
                              )}
                            </span>
                            <h5>
                              <span>
                                {`${singleAirSial.segments.inbound[0].Destination_city_name}, ${singleAirSial.segments.inbound[0].Destination}`}
                              </span>
                            </h5>
                            <span>
                              <h6>
                                {date_convert(
                                  singleAirSial.segments.inbound[0]
                                    .DEPARTURE_DATE
                                )}
                              </h6>
                            </span>
                          </div>
                        </div>
                        {/* Segment End */}
                      </SegmentSection>
                      {/* Segment Section End */}
                      <div className="price-section">
                        <h3>{`PKR ${Number(singleFlight[1].price)}`}</h3>
                        <p>(incl.taxes & fees)</p>
                      </div>
                    </AirlineContainer>
                  );
                }
              })}
              <AirSialRoundSegment cabin={cabin} singleFlight={singleFlight} />
            </AirlineDetailsView>
          </div>
          <DetailsViewSidebar
            queryString={queryString}
            showModal={showModal}
            singleFlight={singleFlight}
            navigateTo={navigateTo}
            flightKey={singleFlight[0].key}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    );
  }
};

export default AirSialDetailsView;
