import React, { useState } from "react";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import TravelportSegment from "./segment/TravelportSegment";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import {
  time_convert,
  utc_convert,
  date_convert,
  time_zone,
  diff_minutes,
} from "../../../helper/ConvertFunctions";
import {
  AirlineListMain,
  AirlineContainer,
  SegmentSection,
  Details,
} from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";

export default function TravelportList({ flight, handleFlight, query }) {
  const { segments, price } = flight;
  const [segment, setSegment] = useState(false);
  const showSegment = () => (segment ? setSegment(false) : setSegment(true));

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  let QueryCity = query.ToCity;
  let seats = 1000000;

  let totalFlightTime = 0;

  segments.map((seg) => {
    totalFlightTime += Number(seg.FlightTime);
    if (Number(seg.cabin.remainingSeats) < seats) {
      seats = Number(seg.cabin.remainingSeats);
    }
    return 0;
  });

  // if (seats < 5) {
  if (seats >= 2 && seats < 10) {
    seats = `${seats} Seats Left`;
  } else if (seats === 1) {
    seats = `${seats} Seat Left`;
  } else if (seats === 0) {
    seats = "Sold Out";
  }
  // } else {
  //   seats = "none";
  // }
  const FlightSegments = () => {
    let cities_name = [];
    let Query_Cities_name = [];
    let layover = 0;
    let arr = 0;
    let dept = 0;
    segments.map((segment, index) => {
      let city_name = segment.destination_city_name.split(",");
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

      if (
        segments.length > 1 &&
        index !== segments.length - 1 &&
        !Query_Cities_name.includes(city_name) &&
        segments[index + 1] !== segments.length
      ) {
        arr += new Date(segments[index].ArrivalTime).getTime();

        dept += new Date(segments[index + 1].DepartureTime).getTime();
      }
      return (
        <ErrorBoundary key={index}>
          <li>
            {segments.length > 1 &&
              index !== segments.length - 1 &&
              segment.destination_city_name.indexOf(QueryCity[0]) === -1 && (
                <div style={{}} className="col-md-12   text-center"></div>
              )}
          </li>
        </ErrorBoundary>
      );
    });
    return (
      <p
        style={{ width: 250, fontSize: "12px" }}
        className="segment-details info  ml-3
      "
      >
        <span className="text-sm"> Total Layover:</span>
        {` ${diff_minutes(new Date(arr), new Date(dept))}`}
      </p>
    );
  };

  const handleFlightView = () => {
    handleFlight(flight);
  };

  return (
    <ErrorBoundary>
      <AirlineListMain className={firstSegment.Carrier}>
        <AirlineContainer>
          <SegmentSection className="pr-2">
            <div key={firstSegment.key} className="segment">
              <div className="logo-section">
                <img
                  alt="Airline Logo"
                  src={firstSegment.airline_logo}
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
                <span title={time_zone(firstSegment.DepartureTime)}>
                  {utc_convert(firstSegment.DepartureTime)}
                </span>
                <h5>
                  <span>
                    {firstSegment.origin_city_name}, {firstSegment.Origin}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(firstSegment.DepartureTime)}</h6>
                </span>
              </div>
              {/* Stop Details (Desktop View) */}
              <div className="stop-details">
                <div className="flight-time">
                  <span>
                    Total Flight Time: {time_convert(totalFlightTime)}
                  </span>
                </div>
                <div className="col-9">
                  <ul className="flights d-flex flex-column">
                    {FlightSegments()}
                  </ul>
                </div>
                <p className="dotted-line" />
                <div className="flight-time">
                  <div>{"Multi-Trip"}</div>
                </div>
                {seats !== "Sold Out" && seats !== "none" && (
                  <div className="seats-left text-center">
                    <p className="text-danger font-weight-bold">{seats}</p>
                  </div>
                )}
              </div>
              {/* Stop Details (Mobile View) */}
              <div className="mobile-stop-details">
                <div className="flight-time">
                  <span>
                    Total Flight Time: {time_convert(totalFlightTime)}
                  </span>
                  <div>{"Multi-Trip"}</div>
                </div>
                {seats !== "Sold Out" && seats < 5 && (
                  <div className="seats-left text-center">
                    <p className="text-danger font-weight-bold">{seats}</p>
                  </div>
                )}
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
                <span title={time_zone(lastSegment.ArrivalTime)}>
                  {utc_convert(lastSegment.ArrivalTime)}
                </span>
                <h5>
                  <span>
                    {lastSegment.destination_city_name},{" "}
                    {lastSegment.Destination}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(lastSegment.ArrivalTime)}</h6>
                </span>
              </div>
            </div>
          </SegmentSection>
          <div className="price-section">
            <h3>{flight.price_info.TotalPrice.slice(0, 3) + " " + price}</h3>
            <p>{"(incl.taxes & fees)"}</p>
            {seats !== "Sold Out" && (
              <button onClick={handleFlightView}>
                Select <AiFillRightCircle className="mb-1" />
              </button>
            )}
          </div>
          <Details>
            <p onClick={showSegment}>View Details</p>
          </Details>
        </AirlineContainer>
        {segment && (
          <TravelportSegment
            query={query}
            segments={segments}
            totalFlightTime={totalFlightTime}
          />
        )}
      </AirlineListMain>
    </ErrorBoundary>
  );
}
