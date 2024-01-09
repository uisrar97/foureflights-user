import React, { useState } from "react";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import AirblueSegment from "../FlightDetails/segment/AirblueSegment";
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
  Details,
} from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";
import index from "../FlightDetails";

export default function AirblueMultiList({ flight, handleFlight }) {
  const [segment, setSegment] = useState(false);
  const showSegment = () => (segment ? setSegment(false) : setSegment(true));

  const handleFlightView = () => {
    handleFlight(flight);
  };
  return (
    <AirlineDetailsView key={index} className="my-3">
      <ErrorBoundary>
        <AirlineContainer>
          {/* Segment Section Start */}
          <SegmentSection className="pr-2">
            {/* Segment Start */}
            <div key={flight.key} className="segment">
              <div className="logo-section">
                <img alt="Airline Logo" src={flight.segments.airline_logo} />
              </div>
              <div className="takeoff-time">
                <img
                  alt="Airplane Logo"
                  className="airplane-logo takeoff"
                  src={Airplane}
                />
                <span>{utc_convert(flight.segments.DepartureDateTime)}</span>
                <h5>
                  <span>
                    {flight.segments.origin_city_name}, {flight.segments.Origin}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(flight.segments.DepartureDateTime)}</h6>
                </span>
              </div>

              {/* Stop Details (Desktop View) */}
              <div className="stop-details my-auto pt-3">
                <div className="flight-time">
                  <span>
                    Total Flight Time:{" "}
                    {diff_minutes(
                      flight.segments.DepartureDateTime,
                      flight.segments.ArrivalDateTime
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
                      flight.segments.DepartureDateTime,
                      flight.segments.ArrivalDateTime
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
                />
                <span>{utc_convert(flight.segments.ArrivalDateTime)}</span>
                <h5>
                  <span>
                    {flight.segments.Destination_city_name},{" "}
                    {flight.segments.Destination}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(flight.segments.ArrivalDateTime)}</h6>
                </span>
              </div>
            </div>
            {/* Segment End */}
          </SegmentSection>
          {/* Segment Section End */}
          <div className="price-section">
            <h3>PKR {Number(flight.price)}</h3>
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
            segments={flight.segments}
            fare={flight.PTC_FareBreakdowns}
            cabin={flight.cabin_class}
          />
        )}
      </ErrorBoundary>
    </AirlineDetailsView>
  );
}
