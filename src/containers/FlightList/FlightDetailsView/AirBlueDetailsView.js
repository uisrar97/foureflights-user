import React, { useState, useEffect } from "react";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  FlightDetailsParent,
} from "../FlightDetails/wrapper/FlightDetailsStyle";
import Airplane from "../../../assets/img/airplane.webp";
import Airbluesegment from "../FlightDetails/segment/Airbluesegment";
import AirblueRoundSegment from "../FlightDetails/segment/AirblueRoundSegment";
import DetailsViewSidebar from "./DetailsViewSidebar";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import { AirBlueRoundList } from "./AirBlueRoundList";
import {
  diff_minutes,
  date_convert,
  utc_convert,
} from "../../../helper/ConvertFunctions";

export const AirBlueDetailsView = ({
  navigateTo,
  showModal,
  singleFlight,
  queryString,
  flights,
  flightKey,
  setFlightKey,
}) => {
  const { cabin } = queryString;

  let airBlueInbound = [];
  flights.result.flights.map((flt) => {
    if (
      flt.provider_type === "airblue" &&
      flt.segments.boundType === "inbound" &&
      queryString.returnDate !== "undefined"
    ) {
      airBlueInbound.push(flt);
    }
    return 0;
  });

  if (queryString.returnDate === "undefined") {
    return (
      <FlightDetailsParent key={Math.random()}>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              <AirlineContainer>
                {/* Segment Section Start */}
                <SegmentSection className="pr-2">
                  {/* Segment Start */}
                  <div className="segment">
                    <div className="logo-section">
                      <img
                        alt="Airline Logo"
                        src={singleFlight[0].segments.airline_logo}
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
                        {utc_convert(
                          singleFlight[0].segments.DepartureDateTime
                        )}
                      </span>
                      <h5>
                        <span>
                          {singleFlight[0].segments.origin_city_name},{" "}
                          {singleFlight[0].segments.Origin}
                        </span>
                      </h5>
                      <span>
                        <h6>
                          {date_convert(
                            singleFlight[0].segments.DepartureDateTime
                          )}
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
                            singleFlight[0].segments.DepartureDateTime,
                            singleFlight[0].segments.ArrivalDateTime
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
                            singleFlight[0].segments.DepartureDateTime,
                            singleFlight[0].segments.ArrivalDateTime
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
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "/no-image.png";
                        }}
                      />
                      <span>
                        {utc_convert(singleFlight[0].segments.ArrivalDateTime)}
                      </span>
                      <h5>
                        <span>
                          {`${singleFlight[0].segments.Destination_city_name}, ${singleFlight[0].segments.Destination}`}
                        </span>
                      </h5>
                      <span>
                        <h6>
                          {date_convert(
                            singleFlight[0].segments.ArrivalDateTime
                          )}
                        </h6>
                      </span>
                    </div>
                  </div>

                  {/* Segment End */}
                </SegmentSection>
                {/* Segment Section End */}
                <div className="price-section">
                  <h3>
                    {singleFlight[0].pricing_info.TotalPrice.CurrencyCode +
                      " " +
                      Number(singleFlight[0].price)}
                  </h3>
                  <p>(incl.taxes & fees)</p>
                </div>
              </AirlineContainer>
              <Airbluesegment
                flight={singleFlight[0]}
                cabin={cabin}
                segments={singleFlight[0].segments}
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
    );
  } else if (queryString.returnDate !== "undefined" && flightKey === false) {
    return (
      <>
        <FlightDetailsParent key={Math.random()}>
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
                    <div className="segment">
                      <div className="logo-section">
                        <img
                          alt="Airline Logo"
                          src={singleFlight[0].segments.airline_logo}
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
                          {utc_convert(
                            singleFlight[0].segments.DepartureDateTime
                          )}
                        </span>
                        <h5>
                          <span>
                            {singleFlight[0].segments.origin_city_name},{" "}
                            {singleFlight[0].segments.Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(
                              singleFlight[0].segments.DepartureDateTime
                            )}
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
                              singleFlight[0].segments.DepartureDateTime,
                              singleFlight[0].segments.ArrivalDateTime
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
                              singleFlight[0].segments.DepartureDateTime,
                              singleFlight[0].segments.ArrivalDateTime
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
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/no-image.png";
                          }}
                        />
                        <span>
                          {utc_convert(
                            singleFlight[0].segments.ArrivalDateTime
                          )}
                        </span>
                        <h5>
                          <span>
                            {`${singleFlight[0].segments.Destination_city_name}, ${singleFlight[0].segments.Destination}`}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(
                              singleFlight[0].segments.ArrivalDateTime
                            )}
                          </h6>
                        </span>
                      </div>
                    </div>

                    {/* Segment End */}
                  </SegmentSection>
                  {/* Segment Section End */}
                  <div className="price-section">
                    <h3>
                      {singleFlight[0].pricing_info.TotalPrice.CurrencyCode +
                        " " +
                        Number(singleFlight[0].price)}
                    </h3>
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
                <AirBlueRoundList
                  flight={airBlueInbound}
                  queryString={queryString}
                  setFlightKey={setFlightKey}
                />
              </ErrorBoundary>
            </div>
            <DetailsViewSidebar
              queryString={queryString}
              showModal={showModal}
              singleFlight={singleFlight}
              navigateTo={navigateTo}
              flightKey={flightKey}
            />
          </ErrorBoundary>
        </FlightDetailsParent>
      </>
    );
  } else if (queryString.returnDate !== "undefined" && flightKey !== false) {
    return (
      <FlightDetailsParent key={Math.random()}>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              {singleFlight.map((singleAirBlue, index) => {
                return (
                  <AirlineContainer key={index}>
                    {/* Segment Section Start */}
                    <SegmentSection className="pr-2">
                      {/* Segment Start */}
                      <div className="segment">
                        <div className="logo-section">
                          <img
                            alt="Airline Logo"
                            src={singleAirBlue.segments.airline_logo}
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
                            {utc_convert(
                              singleAirBlue.segments.DepartureDateTime
                            )}
                          </span>
                          <h5>
                            <span>
                              {singleAirBlue.segments.origin_city_name},{" "}
                              {singleAirBlue.segments.Origin}
                            </span>
                          </h5>
                          <span>
                            <h6>
                              {date_convert(
                                singleAirBlue.segments.DepartureDateTime
                              )}
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
                                singleAirBlue.segments.DepartureDateTime,
                                singleAirBlue.segments.ArrivalDateTime
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
                                singleAirBlue.segments.DepartureDateTime,
                                singleAirBlue.segments.ArrivalDateTime
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
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = "/no-image.png";
                            }}
                          />
                          <span>
                            {utc_convert(
                              singleAirBlue.segments.ArrivalDateTime
                            )}
                          </span>
                          <h5>
                            <span>
                              {`${singleAirBlue.segments.Destination_city_name}, ${singleAirBlue.segments.Destination}`}
                            </span>
                          </h5>
                          <span>
                            <h6>
                              {date_convert(
                                singleAirBlue.segments.ArrivalDateTime
                              )}
                            </h6>
                          </span>
                        </div>
                      </div>
                      {/* Segment End */}
                    </SegmentSection>
                    {/* Segment Section End */}
                    <div className="price-section">
                      <h3>
                        {singleAirBlue.pricing_info.TotalPrice.CurrencyCode +
                          " " +
                          Number(singleAirBlue.price)}
                      </h3>
                      <p>(incl.taxes & fees)</p>
                    </div>
                  </AirlineContainer>
                );
              })}
              <AirblueRoundSegment cabin={cabin} singleFlight={singleFlight} />
            </AirlineDetailsView>
          </div>
          <DetailsViewSidebar
            queryString={queryString}
            showModal={showModal}
            singleFlight={singleFlight}
            navigateTo={navigateTo}
            airBlueKey={singleFlight[0].key}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    );
  }
};

export default AirBlueDetailsView;
