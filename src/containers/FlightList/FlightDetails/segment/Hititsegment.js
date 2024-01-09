import React from "react";
import ErrorBoundary from "./../../../../helper/ErrorBoundary";
import { SegmentParent } from "./../wrapper/FlightDetailsStyle";
import {
  time_convert,
  diff_minutes,
  date_convert,
  utc_convert,
  time_zone,
  TextCapitalizeFirst,
} from "../../../../helper/ConvertFunctions";

export default function Hititsegment({ segments, price_info, showSegments }) {
  const lengthOut = segments.Outbound.length;
  const lengthIn = segments.Inbound ? segments.Inbound.length : 0;
  const firstSegment = segments.Outbound[0].segment_data;
  const lastSegment = segments.Outbound[lengthOut - 1].segment_data;
  const fareInfoList =
    price_info.fareInfoList.length > 0 ? price_info.fareInfoList : [];

  let OutTime = 0;
  let InTime = 0;

  segments.Outbound.map((outbound) => {
    OutTime += outbound.segment_data.FlightTime;
  });
  segments.Inbound &&
    segments.Inbound.map((inbound) => {
      InTime += inbound.segment_data.FlightTime;
    });

  const TotalTime = OutTime + InTime;
  const RefCode = price_info.fareInfoList[0].fareReferenceCode;
  const OutboundSegments = () => {
    return (
      <ErrorBoundary>
        {segments.Outbound.map((outbound, index) => {
          const BaggageInfo = {
            Value:
              typeof fareInfoList === Object
                ? Object.keys(fareInfoList.fareBaggageAllowance).length > 0
                  ? fareInfoList.fareBaggageAllowance.maxAllowedPieces
                  : "0"
                : Object.keys(fareInfoList[index].fareBaggageAllowance).length >
                  0
                ? fareInfoList[0].fareBaggageAllowance.maxAllowedPieces
                : "0",
            Unit:
              typeof fareInfoList === Object
                ? Object.keys(fareInfoList.fareBaggageAllowance).length > 0
                  ? fareInfoList.fareBaggageAllowance.maxAllowedPieces
                      .pieceDefinitions
                  : "Kilograms"
                : Object.keys(fareInfoList[index].fareBaggageAllowance).length >
                  0
                ? fareInfoList[0].fareBaggageAllowance.maxAllowedPieces
                    .pieceDefinitions
                : "Kilograms",
          };

          const Cabin = `${TextCapitalizeFirst(
            outbound.bookingClassList[0].cabin
          )} (${outbound.bookingClassList[0].resBookDesigCode})`;

          return (
            <li key={Math.random()}>
              <i className="fa fa-plane plane-icon" />
              <span className="segment-section">
                <div className="col-md-12 text-center">
                  <h6 id="sub-head">
                    {date_convert(outbound.segment_data.DepartureTime)}
                  </h6>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-time info">
                      <span
                        title={time_zone(outbound.segment_data.DepartureTime)}
                      >
                        {utc_convert(outbound.segment_data.DepartureTime)}
                      </span>{" "}
                      -{" "}
                      <span
                        title={time_zone(outbound.segment_data.ArrivalTime)}
                      >
                        {utc_convert(outbound.segment_data.ArrivalTime)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <div className="dotted-div m-auto" />
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-duration info">
                      {time_convert(outbound.segment_data.FlightTime)}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {outbound.segment_data.origin_city_name},{" "}
                      {outbound.segment_data.Origin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities arrow">&#8594;</p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {outbound.segment_data.destination_city_name},{" "}
                      {outbound.segment_data.Destination}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Class of Service:</span>{" "}
                      {Cabin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Flight #:</span>{" "}
                      {`${outbound.segment_data.Carrier}-${outbound.segment_data.FlightNumber}`}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Baggage Info:</span>{" "}
                      {BaggageInfo.Value}{" "}
                      {BaggageInfo.Unit === "KG"
                        ? "Kilograms"
                        : BaggageInfo.Unit}
                    </p>
                  </div>
                </div>
                {(lengthOut > 1 || segments.Inbound) &&
                  index + 1 !== lengthOut && (
                    <div className="col-md-12 px-3 py-2 text-center">
                      <p className="segment-details info">
                        Layover:{" "}
                        {diff_minutes(
                          outbound.segment_data.ArrivalTime,
                          segments.Outbound[index + 1].segment_data
                            .DepartureTime
                        )}
                      </p>
                    </div>
                  )}
              </span>
            </li>
          );
        })}
      </ErrorBoundary>
    );
  };

  const InboundSegments = () => {
    return (
      <ErrorBoundary>
        {segments.Inbound.map((inbound, index) => {
          const BaggageInfo = {
            Value:
              typeof fareInfoList === Object
                ? Object.keys(fareInfoList.fareBaggageAllowance).length > 0
                  ? fareInfoList.fareBaggageAllowance.maxAllowedPieces
                  : "0"
                : Object.keys(fareInfoList[index].fareBaggageAllowance).length >
                  0
                ? fareInfoList[1].fareBaggageAllowance.maxAllowedPieces
                : "0",
            Unit:
              typeof fareInfoList === Object
                ? Object.keys(fareInfoList.fareBaggageAllowance).length > 0
                  ? fareInfoList.fareBaggageAllowance.maxAllowedPieces
                      .allowanceType
                  : "Kilograms"
                : Object.keys(fareInfoList[1].fareBaggageAllowance).length > 0
                ? fareInfoList[index].fareBaggageAllowance.maxAllowedPieces
                    .allowanceType
                : "Kilograms",
          };

          const Cabin = `${TextCapitalizeFirst(
            inbound.bookingClassList[0].cabin
          )} (${inbound.bookingClassList[0].resBookDesigCode})`;

          return (
            <li key={Math.random()}>
              <i className="fa fa-plane plane-icon" />
              <span className="segment-section">
                <div className="col-md-12 text-center">
                  <h6 id="sub-head">
                    {date_convert(inbound.segment_data.DepartureTime)}
                  </h6>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-time info">
                      <span
                        title={time_zone(inbound.segment_data.DepartureTime)}
                      >
                        {utc_convert(inbound.segment_data.DepartureTime)}
                      </span>{" "}
                      -{" "}
                      <span title={time_zone(inbound.segment_data.ArrivalTime)}>
                        {utc_convert(inbound.segment_data.ArrivalTime)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <div className="dotted-div m-auto" />
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-duration info">
                      {time_convert(inbound.segment_data.FlightTime)}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {inbound.segment_data.origin_city_name},{" "}
                      {inbound.segment_data.Origin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities arrow">&#8594;</p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {inbound.segment_data.destination_city_name},{" "}
                      {inbound.segment_data.Destination}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Class of Service:</span>{" "}
                      {Cabin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Flight #: </span>{" "}
                      {`${inbound.segment_data.Carrier}-${inbound.segment_data.FlightNumber}`}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="segment-details info">
                      <span className="small-head">Baggage Info:</span>{" "}
                      {BaggageInfo.Value}{" "}
                      {BaggageInfo.Unit === "KG"
                        ? "Kilograms"
                        : BaggageInfo.Unit}
                    </p>
                  </div>
                </div>
                {lengthIn > 1 && index + 1 !== lengthIn && (
                  <div className="col-md-12 px-3 py-2 text-center">
                    <p className="segment-details info">
                      Layover:{" "}
                      {diff_minutes(
                        inbound.segment_data.ArrivalTime,
                        segments.Inbound[index + 1].segment_data.DepartureTime
                      )}
                    </p>
                  </div>
                )}
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
                <b>{date_convert(firstSegment.DepartureTime)}</b>
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                {firstSegment.origin_city_name} &#8594;{" "}
                {lastSegment.Destination_city},{" "}
                {lastSegment.Destination_country}{" "}
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                Total Flight Time: {time_convert(TotalTime)}{" "}
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">Ref. Code: {RefCode}</p>
            </div>
          </div>
          <div className="col-9">
            <ul className="flights d-flex flex-column">
              {OutboundSegments()}
              {showSegments && InboundSegments()}
              {/* {segments.Inbound && InboundSegments()} */}
            </ul>
          </div>
        </div>
      </SegmentParent>
    </ErrorBoundary>
  );
}
