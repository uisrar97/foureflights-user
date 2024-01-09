import React, { useState } from "react";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import AirblueSegment from "./segment/AirblueSegment";
import ErrorBoundary from "../../../helper/ErrorBoundary";
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
} from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";

export default function AirblueList({ flight, handleFlight }) {
  const { cabin_class, segments, price, PTC_FareBreakdowns } = flight;

  const [segment, setSegment] = useState(false);
  const showSegment = () => (segment ? setSegment(false) : setSegment(true));

  const handleFlightView = () => {
    handleFlight(flight);
  };

  return (
    <ErrorBoundary key={Math.random()}>
      <AirlineListMain className={segments.Carrier}>
        <AirlineContainer>
          <SegmentSection className="pr-2">
            <div className="segment">
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
                <span>{utc_convert(segments.DepartureDateTime)}</span>
                <h5>
                  <span>
                    {segments.origin_city_name}, {segments.Origin}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(segments.DepartureDateTime)}</h6>
                </span>
              </div>
              {/* Stop Details (Desktop View) */}
              <div className="stop-details my-auto pt-3">
                <div className="flight-time">
                  <span>
                    Total Flight Time:{" "}
                    {diff_minutes(
                      segments.DepartureDateTime,
                      segments.ArrivalDateTime
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
                      segments.DepartureDateTime,
                      segments.ArrivalDateTime
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
                <span>{utc_convert(segments.ArrivalDateTime)}</span>
                <h5>
                  <span>
                    {segments.Destination_city_name}, {segments.Destination}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(segments.ArrivalDateTime)}</h6>
                </span>
              </div>
            </div>
          </SegmentSection>
          <div className="price-section">
            <h3>PKR {Number(price)}</h3>
            <p>{"(incl.taxes & fees)"}</p>
            <button onClick={handleFlightView}>
              {" "}
              Select <AiFillRightCircle className="mb-1" />
            </button>
          </div>
          <Details>
            <p onClick={showSegment}>View Details</p>
          </Details>
        </AirlineContainer>
        {segment && (
          <AirblueSegment
            segments={segments}
            fare={PTC_FareBreakdowns}
            cabin={cabin_class}
          />
        )}
      </AirlineListMain>
    </ErrorBoundary>
  );
}
