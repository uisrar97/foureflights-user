import React from "react";
import ErrorBoundary from "../../../../helper/ErrorBoundary";
import { SegmentParent } from "../../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";
import {
  time_convert,
  diff_minutes,
  date_convert,
  utc_convert,
  time_zone,
  TextCapitalizeFirst,
} from "../../../../helper/ConvertFunctions";

export default function HititSegment({
  segments,
  price_info,
  TotalTime,
  query,
}) {
  let cities_name = [];
  let Query_Cities_name = [];
  const firstSegment = segments[0].segment_data;
  const lastSegment = segments[segments.length - 1].segment_data;
  const fareInfoList =
    price_info.fareInfoList.length > 0 ? price_info.fareInfoList : [];
  const RefCode = price_info.fareInfoList[0].fareReferenceCode;

  const segmentData = () => {
    return (
      <ErrorBoundary>
        {segments.map((seg, index) => {
          let city_name = seg.segment_data.destination_city_name.split(",");
          city_name = city_name[0].split(" ");
          city_name = city_name.filter(
            (item) =>
              item !== "International" &&
              item !== "Airport" &&
              item !== "-" &&
              item !== "Bus" &&
              item !== "Station"
          );
          city_name = city_name[city_name.length - 1];
          cities_name.push(city_name);

          query.ToCity.map((qCity, index) => {
            let query_city = qCity.split(",");
            query_city = query_city[0].split(" ");
            query_city = query_city.filter(
              (item) =>
                item !== "International" &&
                item !== "Airport" &&
                item !== "-" &&
                item !== "Bus" &&
                item !== "Station"
            );
            query_city = query_city[query_city.length - 1];

            Query_Cities_name.push(query_city);
          });
          const BaggageInfo = {
            Value:
              typeof fareInfoList === Object
                ? Object.keys(fareInfoList.fareBaggageAllowance).length > 0
                  ? fareInfoList.fareBaggageAllowance.maxAllowedWeight.weight
                  : "0"
                : Object.keys(fareInfoList[index].fareBaggageAllowance).length >
                  0
                ? fareInfoList[index].fareBaggageAllowance.maxAllowedWeight
                    .weight
                : "0",
            Unit:
              typeof fareInfoList === Object
                ? Object.keys(fareInfoList.fareBaggageAllowance).length > 0
                  ? fareInfoList.fareBaggageAllowance.maxAllowedWeight
                      .unitOfMeasureCode
                  : "Kilograms"
                : Object.keys(fareInfoList[index].fareBaggageAllowance).length >
                  0
                ? fareInfoList[index].fareBaggageAllowance.maxAllowedWeight
                    .unitOfMeasureCode
                : "Kilograms",
          };

          const Cabin = `${TextCapitalizeFirst(
            seg.bookingClassList[0].cabin
          )} (${seg.bookingClassList[0].resBookDesigCode})`;

          return (
            <li key={Math.random()}>
              <i className="fa fa-plane plane-icon" />
              <span className="segment-section">
                <div className="col-md-12 text-center">
                  <h6 id="sub-head">
                    {date_convert(seg.segment_data.DepartureTime)}
                  </h6>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-time info">
                      <span title={time_zone(seg.segment_data.DepartureTime)}>
                        {utc_convert(seg.segment_data.DepartureTime)}
                      </span>{" "}
                      -{" "}
                      <span title={time_zone(seg.segment_data.ArrivalTime)}>
                        {utc_convert(seg.segment_data.ArrivalTime)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <div className="dotted-div m-auto" />
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-duration info">
                      {time_convert(seg.segment_data.FlightTime)}
                    </p>
                  </div>
                </div>
                <div className="col-md-12 d-flex px-3 py-2 text-center flight-data-row">
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {seg.segment_data.origin_city_name},{" "}
                      {seg.segment_data.Origin}
                    </p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities arrow">&#8594;</p>
                  </div>
                  <div className="col-md-4 px-0 py-1">
                    <p className="flight-cities info">
                      {seg.segment_data.destination_city_name},{" "}
                      {seg.segment_data.Destination}
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
                      {`${seg.segment_data.Carrier}-${seg.segment_data.FlightNumber}`}
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
                {segments.length > 1 &&
                  index !== segments.length - 1 &&
                  !Query_Cities_name.includes(city_name) &&
                  segments[index + 1] !== segments.length && (
                    <div className="col-md-12 px-3 py-2 text-center">
                      <p className="segment-details info">
                        Layover:{" "}
                        {diff_minutes(
                          segments[index].segment_data.ArrivalTime,
                          segments[index + 1].segment_data.DepartureTime
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
            <ul className="flights d-flex flex-column">{segmentData()}</ul>
          </div>
        </div>
      </SegmentParent>
    </ErrorBoundary>
  );
}
