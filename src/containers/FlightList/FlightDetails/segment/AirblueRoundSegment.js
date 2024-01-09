import React from "react";
import { SegmentParent } from "./../wrapper/FlightDetailsStyle";
import ErrorBoundary from "./../../../../helper/ErrorBoundary";
import {
  diff_minutes,
  date_convert,
  utc_convert,
} from "../../../../helper/ConvertFunctions";

export default function AirblueRoundSegment({ singleFlight, cabin }) {
  let BaggageInfo = [];

  singleFlight.map((flt) => {
    let val = "";
    let unit = "";
    if (flt.PTC_FareBreakdowns[0].FareInfo2.PassengerFare) {
      val =
        flt.PTC_FareBreakdowns[0].FareInfo2.PassengerFare.FareBaggageAllowance
          .UnitOfMeasureQuantity;
      unit =
        flt.PTC_FareBreakdowns[0].FareInfo2.PassengerFare.FareBaggageAllowance
          .UnitOfMeasure === "KGS"
          ? "Kilograms"
          : flt.PTC_FareBreakdowns.FareInfo2.PassengerFare.FareBaggageAllowance
              .UnitOfMeasure;
      BaggageInfo.push({ Value: val, Unit: unit });
    } else {
      val = "Nil";
      unit = "Baggage";
      BaggageInfo.push({ Value: val, Unit: unit });
    }
  });
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
                <b>
                  {date_convert(singleFlight[0].segments.DepartureDateTime)}
                </b>
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                {singleFlight[0].segments.origin_city_name} &#8594;{" "}
                {singleFlight[0].segments.Destination_city_name}{" "}
              </p>
            </div>
            <div className="col-md-12 px-0 mb-2">
              <p className="flight-countries info">
                Total Flight Time:{" "}
                {diff_minutes(
                  singleFlight[0].segments.ArrivalDateTime,
                  singleFlight[0].segments.DepartureDateTime
                )}{" "}
              </p>
            </div>
          </div>
          <div className="col-9">
            <ul className="flights d-flex flex-column">
              {singleFlight.map((flt, index) => {
                return (
                  <li key={Math.random()}>
                    <i className="fa fa-plane plane-icon" />
                    <span className="segment-section">
                      <div className="col-md-12 text-center">
                        <h6 id="sub-head">
                          {date_convert(flt.segments.DepartureDateTime)}
                        </h6>
                      </div>
                      <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                        <div className="col-md-4 px-0 py-1">
                          <p className="flight-time info">
                            <span>
                              {utc_convert(flt.segments.DepartureDateTime)}
                            </span>{" "}
                            -{" "}
                            <span>
                              {utc_convert(flt.segments.ArrivalDateTime)}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-4 px-0 py-1">
                          <div className="dotted-div m-auto" />
                        </div>
                        <div className="col-md-4 px-0 py-1">
                          <p className="flight-duration info">
                            {diff_minutes(
                              flt.segments.ArrivalDateTime,
                              flt.segments.DepartureDateTime
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                        <div className="col-md-4 px-0 py-1">
                          <p className="flight-cities info">
                            {flt.segments.origin_city_name},{" "}
                            {flt.segments.Origin}
                          </p>
                        </div>
                        <div className="col-md-4 px-0 py-1">
                          <p className="flight-cities arrow">&#8594;</p>
                        </div>
                        <div className="col-md-4 px-0 py-1">
                          <p className="flight-cities info">
                            {flt.segments.Destination_city_name},{" "}
                            {flt.segments.Destination}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                        <div className="col-md-4 px-0 py-1">
                          <p className="segment-details info">
                            <span className="small-head">
                              Class of Service:
                            </span>{" "}
                            {cabin}
                          </p>
                        </div>

                        <div className="col-md-4 px-0 py-1">
                          <p className="segment-details info">
                            <span className="small-head">Flight #:</span>{" "}
                            {flt.segments.Carrier}-{flt.segments.FlightNumber}
                          </p>
                        </div>

                        <div className="col-md-4 px-0 py-1">
                          <p className="segment-details info">
                            <span className="small-head">Baggage Info:</span>{" "}
                            {BaggageInfo[index].Value} {BaggageInfo[index].Unit}
                          </p>
                        </div>
                      </div>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SegmentParent>
    </ErrorBoundary>
  );
}
