import React from "react";
import ErrorBoundary from "./../../../../helper/ErrorBoundary";
import { SegmentParent } from "./../wrapper/FlightDetailsStyle";
import {
  time_convert,
  date_convert,
  airsial_time_convert,
} from "../../../../helper/ConvertFunctions";

export default function AirSialSegment({ segments, baggage, cabin }) {
  const firstSegment = segments.outbound
    ? segments.outbound[0]
    : segments.inbound[0];

  const outboundSegments = () => {
    return (
      <ErrorBoundary>
        {segments.outbound.map((outbound) => {
          return (
            <span key={Math.random()}>
              <i className="fa fa-plane plane-icon" />
              <li className="segment-section">
                <div className="col-md-12 text-center">
                  <h6 id="sub-head">{date_convert(outbound.DEPARTURE_DATE)}</h6>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-time info">
                      <span
                        title={airsial_time_convert(outbound.DEPARTURE_TIME)}
                      >
                        {airsial_time_convert(outbound.DEPARTURE_TIME)}
                      </span>{" "}
                      -{" "}
                      <span title={airsial_time_convert(outbound.ARRIVAL_TIME)}>
                        {airsial_time_convert(outbound.ARRIVAL_TIME)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <div className="dotted-div m-auto" />
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-duration info">
                      {time_convert(outbound.FlightTime)}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {outbound.origin_city_name}, {outbound.Origin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities arrow">&#8594;</p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {outbound.Destination_city_name}, {outbound.Destination}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Class of Service:</span>{" "}
                      {cabin === "EXECUTIVE_ECONOMY" ? "Economy" : "Economy"}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Flight #:</span>{" "}
                      {outbound.FlightNumber.slice(0, 2)}-
                      {outbound.FlightNumber.slice(2)}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Baggage Info:</span>{" "}
                      {baggage}
                    </p>
                  </div>
                </div>
              </li>
            </span>
          );
        })}
      </ErrorBoundary>
    );
  };

  const InboundSegments = () => {
    return (
      <ErrorBoundary>
        {segments.inbound.map((inbound) => {
          return (
            <li key={Math.random()}>
              <i className="fa fa-plane plane-icon" />
              <span className="segment-section">
                <div className="col-md-12 text-center">
                  <h6 id="sub-head">{date_convert(inbound.DEPARTURE_DATE)}</h6>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-time info">
                      <span
                        title={airsial_time_convert(inbound.DEPARTURE_TIME)}
                      >
                        {airsial_time_convert(inbound.DEPARTURE_TIME)}
                      </span>{" "}
                      -{" "}
                      <span title={airsial_time_convert(inbound.ARRIVAL_TIME)}>
                        {airsial_time_convert(inbound.ARRIVAL_TIME)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <div className="dotted-div m-auto" />
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-duration info">
                      {time_convert(inbound.FlightTime)}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {inbound.origin_city_name}, {inbound.Origin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities arrow">&#8594;</p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {inbound.Destination_city_name}, {inbound.Destination}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Class of Service:</span>{" "}
                      {cabin === "EXECUTIVE_ECONOMY" ? "Economy" : "Economy"}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Flight #:</span>{" "}
                      {inbound.FlightNumber.slice(0, 2)}-
                      {inbound.FlightNumber.slice(2)}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Baggage Info:</span>{" "}
                      {baggage}
                    </p>
                  </div>
                </div>
              </span>
            </li>
          );
        })}
      </ErrorBoundary>
    );
  };

  return (
    <ErrorBoundary>
      <SegmentParent>
        <div className="flight-routes">
          <div className="col-3">
            <div className="col-md-12 px-0 mb-2">
              <h6 id="sub-head">DEPART</h6>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-date info">
                <b>{date_convert(firstSegment.DEPARTURE_DATE)}</b>
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                {firstSegment.origin_city_name} &#8594;{" "}
                {firstSegment.Destination_city_name}{" "}
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                Total Flight Time: {time_convert(firstSegment.FlightTime)}{" "}
              </p>
            </div>
          </div>
          <div className="col-9">
            <ul className="flights d-flex flex-column">
              {segments.outbound && outboundSegments()}
              {segments.inbound && InboundSegments()}
            </ul>
          </div>
        </div>
      </SegmentParent>
    </ErrorBoundary>
  );
}
