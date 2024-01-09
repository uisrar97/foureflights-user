import React from "react";
import { SegmentParent } from "./../wrapper/FlightDetailsStyle";
import ErrorBoundary from "./../../../../helper/ErrorBoundary";
import {
  time_convert,
  diff_minutes,
  date_convert,
  utc_convert,
  time_zone,
  TextCapitalizeFirst,
} from "../../../../helper/ConvertFunctions";

export default function Segment({
  segments,
  totalFlightTime,
  QueryCity,
  showSegments,
  showSegment,
}) {
  const grouped = segments.filter((seg) => seg.Group === "0");

  const firstSegment = segments[0];
  const lastSegment = grouped[grouped.length - 1];

  const FlightSegments = () => {
    if (showSegments) {
      return segments
        .filter((seg) => seg.Group === "0")
        .map((segment, index) => {
          let cabin;
          let baggage;
          if (segment.cabin.BookingCode && segment.cabin.CabinClass) {
            cabin = ` ${TextCapitalizeFirst(segment.cabin.CabinClass)} (${
              segment.cabin.BookingCode
            })`;
          } else if (segment.cabin.CabinClass) {
            cabin = ` ${TextCapitalizeFirst(segment.cabin.CabinClass)}`;
          } else {
            cabin = false;
          }

          if (segment.BaggageInfo.Value && segment.BaggageInfo.Unit) {
            baggage = ` ${segment.BaggageInfo.Value} ${segment.BaggageInfo.Unit}`;
          } else if (segment.BaggageInfo.NumberOfPieces) {
            baggage = ` ${segment.BaggageInfo.NumberOfPieces} Pc(s)`;
          } else {
            baggage = false;
          }
          return (
            <ErrorBoundary key={index}>
              <li>
                <i className="fa fa-plane plane-icon" />
                <span className="segment-section">
                  <div className="col-md-12 text-center">
                    <h6 id="sub-head">{date_convert(segment.DepartureTime)}</h6>
                  </div>
                  <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-time info">
                        <span title={time_zone(segment.DepartureTime)}>
                          {utc_convert(segment.DepartureTime)}
                        </span>{" "}
                        -{" "}
                        <span title={time_zone(segment.ArrivalTime)}>
                          {utc_convert(segment.ArrivalTime)}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <div className="dotted-div m-auto" />
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-duration info">
                        {time_convert(segment.FlightTime)}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-cities info">
                        {segment.origin_city_name}, {segment.Origin}
                      </p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-cities arrow">&#8594;</p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-cities info">
                        {segment.destination_city_name}, {segment.Destination}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                    {cabin !== false && (
                      <div className="col-md-4 px-0 py-1">
                        <p className="segment-details info">
                          <span className="small-head">Class of Service:</span>
                          {cabin}
                        </p>
                      </div>
                    )}
                    <div className="col-md-4 px-0 py-1">
                      <p className="segment-details info">
                        <span className="small-head">Flight #:</span>
                        {` ${segment.Carrier}-${segment.FlightNumber}`}
                      </p>
                    </div>
                    {baggage !== false && (
                      <div className="col-md-4 px-0 py-1">
                        <p className="segment-details info">
                          <span className="small-head">Baggage Info:</span>
                          {baggage}
                        </p>
                      </div>
                    )}
                  </div>

                  {segments.length > 1 &&
                    index !== segments.length - 1 &&
                    QueryCity[0].indexOf(
                      segment.destination_city_name.split(",")[0]
                    ) === -1 &&
                    // segment.destination_city_name.indexOf(QueryCity[0]) === -1 &&
                    QueryCity[0] !== -1 && (
                      <div className="col-md-12 px-3 py-2 text-center">
                        <p className="segment-details info">
                          <span className="small-head">Layover:</span>
                          {` ${diff_minutes(
                            segments[index].ArrivalTime,
                            segments[index + 1].DepartureTime
                          )}`}
                        </p>
                      </div>
                    )}
                </span>
              </li>
            </ErrorBoundary>
          );
        });
    } else if (showSegment) {
      return segments.map((segment, index) => {
        let cabin;
        let baggage;
        if (segment.cabin.BookingCode && segment.cabin.CabinClass) {
          cabin = ` ${TextCapitalizeFirst(segment.cabin.CabinClass)} (${
            segment.cabin.BookingCode
          })`;
        } else if (segment.cabin.CabinClass) {
          cabin = ` ${TextCapitalizeFirst(segment.cabin.CabinClass)}`;
        } else {
          cabin = false;
        }

        if (segment.BaggageInfo.Value && segment.BaggageInfo.Unit) {
          baggage = ` ${segment.BaggageInfo.Value} ${segment.BaggageInfo.Unit}`;
        } else if (segment.BaggageInfo.NumberOfPieces) {
          baggage = ` ${segment.BaggageInfo.NumberOfPieces} Pc(s)`;
        } else {
          baggage = false;
        }
        return (
          <ErrorBoundary key={index}>
            <li>
              <i className="fa fa-plane plane-icon" />
              <span className="segment-section">
                <div className="col-md-12 text-center">
                  <h6 id="sub-head">{date_convert(segment.DepartureTime)}</h6>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-time info">
                      <span title={time_zone(segment.DepartureTime)}>
                        {utc_convert(segment.DepartureTime)}
                      </span>{" "}
                      -{" "}
                      <span title={time_zone(segment.ArrivalTime)}>
                        {utc_convert(segment.ArrivalTime)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <div className="dotted-div m-auto" />
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-duration info">
                      {time_convert(segment.FlightTime)}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {segment.origin_city_name}, {segment.Origin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities arrow">&#8594;</p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {segment.destination_city_name}, {segment.Destination}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  {cabin !== false && (
                    <div className="col-md-4 px-0 py-1">
                      <p className="segment-details info">
                        <span className="small-head">Class of Service:</span>
                        {cabin}
                      </p>
                    </div>
                  )}
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Flight #:</span>
                      {` ${segment.Carrier}-${segment.FlightNumber}`}
                    </p>
                  </div>
                  {baggage !== false && (
                    <div className="col-md-4 px-0 py-1">
                      <p className="segment-details info">
                        <span className="small-head">Baggage Info:</span>
                        {baggage}
                      </p>
                    </div>
                  )}
                </div>

                {segments.length > 1 &&
                  index !== segments.length - 1 &&
                  QueryCity[0].indexOf(
                    segment.destination_city_name.split(",")[0]
                  ) === -1 &&
                  // segment.destination_city_name.indexOf(QueryCity[0]) === -1 &&
                  QueryCity[0] !== -1 && (
                    <div className="col-md-12 px-3 py-2 text-center">
                      <p className="segment-details info">
                        <span className="small-head">Layover:</span>
                        {` ${diff_minutes(
                          segments[index].ArrivalTime,
                          segments[index + 1].DepartureTime
                        )}`}
                      </p>
                    </div>
                  )}
              </span>
            </li>
          </ErrorBoundary>
        );
      });
    }
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
                <b>{date_convert(firstSegment.DepartureTime)}</b>
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                {firstSegment.origin_city_name} &#8594;{" "}
                {lastSegment.destination_city_name}{" "}
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                Total Flight Time: {time_convert(totalFlightTime)}{" "}
              </p>
            </div>
          </div>
          <div className="col-9">
            <ul className="flights d-flex flex-column">{FlightSegments()}</ul>
          </div>
        </div>
      </SegmentParent>
    </ErrorBoundary>
  );
}
