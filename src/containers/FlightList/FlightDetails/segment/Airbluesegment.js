import React from "react";
import { SegmentParent } from "./../wrapper/FlightDetailsStyle";
import ErrorBoundary from "./../../../../helper/ErrorBoundary";
import {
  diff_minutes,
  date_convert,
  utc_convert,
} from "../../../../helper/ConvertFunctions";

export default function Airbluesegment({ flight, segments, cabin, callFrom }) {
  let BaggageInfo = {};
  let val = "";
  let unit = "";

  if (
    flight.PTC_FareBreakdowns[0].FareInfo !== undefined &&
    flight.PTC_FareBreakdowns[0].FareInfo2 !== undefined
  ) {
    {
      if (flight.PTC_FareBreakdowns[0].FareInfo2.PassengerFare) {
        val =
          flight.PTC_FareBreakdowns[0].FareInfo2.PassengerFare
            .FareBaggageAllowance.UnitOfMeasureQuantity;
        unit =
          flight.PTC_FareBreakdowns[0].FareInfo2.PassengerFare
            .FareBaggageAllowance.UnitOfMeasure === "KGS"
            ? "Kilograms"
            : flight.PTC_FareBreakdowns.FareInfo2.PassengerFare
                .FareBaggageAllowance.UnitOfMeasure;
        BaggageInfo = { Value: val, Unit: unit };
      } else {
        val = "Nil";
        unit = "Baggage";
        BaggageInfo = { Value: val, Unit: unit };
      }
    }
  }

  return (
    <ErrorBoundary>
      <SegmentParent
        className={`${callFrom == "airbluelist" ? "d-none" : ""} ${flight.key}`}
      >
        <div className="flight-routes">
          <div className="col-3">
            <div className="col-md-12 px-0 mb-2">
              <h6 id="sub-head">DEPART</h6>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-date info">
                <b>{date_convert(segments.DepartureDateTime)}</b>
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                {segments.origin_city_name} &#8594;{" "}
                {segments.Destination_city_name}{" "}
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                Total Flight Time:{" "}
                {diff_minutes(
                  segments.ArrivalDateTime,
                  segments.DepartureDateTime
                )}{" "}
              </p>
            </div>
          </div>
          <div className="col-9">
            <ul className="flights d-flex flex-column">
              <li>
                <i className="fa fa-plane plane-icon" />
                <span className="segment-section">
                  <div className="col-md-12 text-center">
                    <h6 id="sub-head">
                      {date_convert(segments.DepartureDateTime)}
                    </h6>
                  </div>
                  <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-time info">
                        <span>{utc_convert(segments.DepartureDateTime)}</span> -{" "}
                        <span>{utc_convert(segments.ArrivalDateTime)}</span>
                      </p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <div className="dotted-div m-auto" />
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-duration info">
                        {diff_minutes(
                          segments.ArrivalDateTime,
                          segments.DepartureDateTime
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-cities info">
                        {segments.origin_city_name}, {segments.Origin}
                      </p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-cities arrow">&#8594;</p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="flight-cities info">
                        {segments.Destination_city_name}, {segments.Destination}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                    <div className="col-md-4 px-0 py-1">
                      <p className="segment-details info">
                        <span className="small-head">Class of Service:</span>{" "}
                        {cabin}
                      </p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="segment-details info">
                        <span className="small-head">Flight #:</span>{" "}
                        {segments.Carrier}-{segments.FlightNumber}
                      </p>
                    </div>
                    <div className="col-md-4 px-0 py-1">
                      <p className="segment-details info">
                        <span className="small-head">Baggage Info:</span>{" "}
                        {BaggageInfo.Value} {BaggageInfo.Unit}
                      </p>
                    </div>
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </SegmentParent>
    </ErrorBoundary>
  );
}
