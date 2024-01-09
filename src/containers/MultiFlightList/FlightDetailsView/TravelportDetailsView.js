import React from "react";
import Airplane from "../../../assets/img/airplane.webp";
import TravelportSegment from "../FlightDetails/segment/TravelportSegment";
import DetailsViewSidebar from "./DetailsViewSidebar";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import {
  time_convert,
  date_convert,
  utc_convert,
  time_zone,
} from "../../../helper/ConvertFunctions";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  FlightDetailsParent,
} from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";

export default function TravelportDetailsView({
  selectedFlight,
  handleShow,
  navigateTo,
  query,
}) {
  const { segments, price } = selectedFlight;

  let totalFlightTime = 0;
  totalFlightTime = segments.reduce(
    (accumulator, segment) => accumulator + Number(segment.FlightTime),
    0
  );

  return (
    <FlightDetailsParent key={Math.random()}>
      <ErrorBoundary>
        <div className="main">
          <AirlineDetailsView>
            <AirlineContainer>
              <SegmentSection className="pr-2">
                {segments.map((segment, index) => {
                  return (
                    <div className="segment" key={index}>
                      <div className="logo-section">
                        <img
                          alt="Airline Logo"
                          src={segment.airline_logo}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/no-image.png";
                          }}
                        />
                      </div>
                      <div className="takeoff-time d">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo takeoff"
                          src={Airplane}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/no-image.png";
                          }}
                        />
                        <span title={time_zone(segment.DepartureTime)}>
                          {utc_convert(segment.DepartureTime)}
                        </span>
                        <h5>
                          <span>
                            {segment.origin_city_name}, {segment.Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>{date_convert(segment.DepartureTime)}</h6>
                        </span>
                      </div>
                      {/* Stop Details (Desktop View) */}
                      <div className="stop-details">
                        <div className="flight-time">
                          <span>
                            Total Flight Time:{" "}
                            {time_convert(segment.FlightTime)}
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
                            {time_convert(segment.FlightTime)}
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
                        <span title={time_zone(segment.ArrivalTime)}>
                          {utc_convert(segment.ArrivalTime)}
                        </span>
                        <h5>
                          <span>
                            {segment.destination_city_name},{" "}
                            {segment.Destination}
                          </span>
                        </h5>
                        <span>
                          <h6>{date_convert(segment.ArrivalTime)}</h6>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </SegmentSection>
              <div className="price-section">
                <h3>
                  {selectedFlight.price_info.TotalPrice.slice(0, 3) +
                    " " +
                    price}
                </h3>
                <p>{"(incl.taxes & fees)"}</p>
              </div>
            </AirlineContainer>
            <TravelportSegment
              segments={segments}
              totalFlightTime={totalFlightTime}
              query={query}
            />
          </AirlineDetailsView>
        </div>
        <DetailsViewSidebar
          handleShow={handleShow}
          selectedFlight={selectedFlight}
          navigateTo={navigateTo}
        />
      </ErrorBoundary>
    </FlightDetailsParent>
  );
}
