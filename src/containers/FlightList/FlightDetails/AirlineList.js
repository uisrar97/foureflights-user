import React, { useState } from "react";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import Segment from "./segment/Segment";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
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
} from "./wrapper/FlightDetailsStyle";

const AirlineList = ({
  flight,
  handleFlight,
  query,
  paginationClass,
  setFlight,
}) => {
  const [segment, setSegment] = useState(false);
  const [showSegments, setshowSegments] = useState(false);

  const showSegment = () => {
    setSegment((prevSegment) => !prevSegment); // Toggle segment state
    setshowSegments(true);
  };
  // const showSegment = () => (segment ? setSegment(false) : setSegment(true));
  const { segments, price } = flight;

  let seats = 1000000;
  let QueryCity = query.to.slice(6);
  QueryCity = QueryCity.split(",");

  const round = query.returnDate === "undefined" ? false : true;

  const grouped = segments.filter((seg) => seg.Group === "0");

  const firstSegment = segments[0];
  const lastSegment = grouped[grouped.length - 1];

  let totalStops = 0;
  let classes = "";

  let totalFlightTime = 0;
  if (round) {
    let x = 0;

    segments.map((segment) => {
      if (x === 0) {
        totalFlightTime += Number(segment.FlightTime);
      }
      if (segment.destination_city_name.indexOf(QueryCity[0]) > -1) {
        x++;
      }
    });

    totalStops = segments.length - 1;

    if (totalStops === 1) {
      totalStops = "Direct Flight";
      classes = `direct ${firstSegment.Carrier}`;
    } else if (totalStops >= 1) {
      totalStops = -1;
      segments.map((seg) => {
        if (seg.Group === "0") {
          totalStops++;
        }
      });

      if (totalStops === 1) {
        totalStops = totalStops + " Stop";
        classes = `one-stop ${firstSegment.Carrier}`;
      } else {
        totalStops = totalStops + " Stops";
        classes = `two-stop ${firstSegment.Carrier}`;
      }
    }
  } else {
    totalFlightTime = segments.reduce(
      (accumulator, segment) => accumulator + Number(segment.FlightTime),
      0
    );

    totalStops = segments.length - 1;

    if (totalStops === 1) {
      totalStops = "1 Stop";
      classes = `one-stop ${firstSegment.Carrier}`;
    } else if (totalStops > 1) {
      totalStops = totalStops + " Stops";
      classes = `two-stop ${firstSegment.Carrier}`;
    } else if (totalStops === 0) {
      totalStops = "Direct Flight";
      classes = `direct ${firstSegment.Carrier}`;
    }
  }
  const FlightSegments = () => {
    let layover = 0;
    let arr = 0;
    let dept = 0;
    segments.map((segment, index) => {
      if (
        segments.length > 1 &&
        index !== segments.length - 1 &&
        QueryCity[0].indexOf(segment.destination_city_name.split(",")[0]) ===
          -1 &&
        QueryCity[0] !== -1
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
        style={{ width: 250 }}
        className="segment-details info  ml-4 pl-2
      "
      >
        <span className="small-head"> Total Layover:</span>
        {` ${diff_minutes(new Date(arr), new Date(dept))}`}
      </p>
    );
  };
  const handleFlightView = () => {
    handleFlight(flight);
    // setFlight([...flight, flt]);
  };

  segments.map((seg) => {
    if (Number(seg.cabin.remainingSeats) < seats) {
      seats = Number(seg.cabin.remainingSeats);
    }
    return 0;
  });

  if (seats >= 2 && seats < 10) {
    seats = `${seats} Seats Left`;
  } else if (seats === 1) {
    seats = `${seats} Seat Left`;
  } else if (seats === 0) {
    seats = "Sold Out";
  }
  return (
    <ErrorBoundary>
      <AirlineListMain className={`flight-list ${classes} ${paginationClass}`}>
        <AirlineContainer>
          {/* Segment Section Start */}
          <SegmentSection className="pr-2">
            {/* Segment Start */}
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
                <div className="size-12">{totalStops}</div>
                <p className="dotted-line" />
                <div className="flight-time">
                  <span>
                    Total Flight Time: {time_convert(totalFlightTime)}
                  </span>
                  <div className="col-9">
                    <ul className="flights d-flex flex-column">
                      {FlightSegments()}
                    </ul>
                  </div>
                  <div>
                    {query.returnDate === "undefined" ? "" : "Round-Trip"}
                  </div>
                </div>
                {seats !== "Sold Out" && (
                  <div className="seats-left text-center">
                    <p className="text-danger font-weight-bold">{seats}</p>
                  </div>
                )}
              </div>
              {/* Stop Details (Mobile View) */}
              <div className="mobile-stop-details">
                <div className="size-12">{totalStops}</div>
                <div className="flight-time">
                  <span>
                    Total Flight Time: {time_convert(totalFlightTime)}
                  </span>
                  <div>
                    {query.returnDate === "undefined" ? "" : "Round-Trip"}
                  </div>
                </div>
                {seats !== "Sold Out" && (
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
            {/* Segment End */}
          </SegmentSection>
          {/* Segment Section End */}
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
          <Segment
            segments={segments}
            totalFlightTime={totalFlightTime}
            QueryCity={QueryCity}
            round={round}
            showSegments={showSegments}
          />
        )}
      </AirlineListMain>
    </ErrorBoundary>
  );
};

export default AirlineList;
