import React, { useState } from "react";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import Hititsegment from "./segment/Hititsegment";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import {
  time_convert,
  date_convert,
  utc_convert,
  time_zone,
  diff_minutes,
  diff_minutes_layover,
} from "../../../helper/ConvertFunctions";
import {
  AirlineListMain,
  AirlineContainer,
  SegmentSection,
  Details,
} from "./wrapper/FlightDetailsStyle";

const HititList = ({ flight, handleFlight, query }) => {
  const [segment, setSegment] = useState(false);

  const showSegment = () => (segment ? setSegment(false) : setSegment(true));
  const { segments, price_info, price } = flight;

  const round = segments.Inbound ? true : false;

  let lengthOut = segments.Outbound.length;
  const lengthIn = segments.Inbound ? segments.Inbound.length : 0;
  let classes = "";
  let seats = 100000;

  const firstSegment = segments.Outbound[0].segment_data;
  const lastSegment = segments.Outbound[lengthOut - 1].segment_data;

  const totalStops = lengthOut - 1;

  let TotalTime = 0;
  segments.Outbound.map((outbound) => {
    return (TotalTime += outbound.segment_data.FlightTime);
  });

  const handleFlightView = () => {
    handleFlight(flight);
  };

  if (totalStops === 0) {
    classes = "direct PK";
  } else if (totalStops === 1) {
    classes = "one-stop PK";
  } else {
    classes = "two-stop PK";
  }

  if (round) {
    let HititClassList = [];
    segments.Outbound.map((seg) => {
      HititClassList.push(seg.bookingClassList);
      return 0;
    });

    segments.Inbound.map((seg) => {
      HititClassList.push(seg.bookingClassList);
      return 0;
    });
    HititClassList.map((list) => {
      if (Number(list[0].resBookDesigQuantity) < seats) {
        seats = Number(list[0].resBookDesigQuantity);
      }
    });
  } else {
    segments.Outbound.map((seg) => {
      if (Number(seg.bookingClassList[0].resBookDesigQuantity) < seats) {
        seats = Number(seg.bookingClassList[0].resBookDesigQuantity);
      }
      return 0;
    });
  }

  if (seats >= 2 && seats < 10) {
    seats = `${seats} Seats Left`;
  } else if (seats === 1) {
    seats = `${seats} Seat Left`;
  } else if (seats === 0) {
    seats = "Sold Out";
  }

  const OutboundLayover = () => {
    let outboundLayover = 0;
    segments.Outbound.map((outbound, index) => {
      if ((lengthOut > 1 || segments.Inbound) && index + 1 !== lengthOut) {
        outboundLayover = diff_minutes_layover(
          outbound.segment_data.ArrivalTime,
          segments.Outbound[index + 1].segment_data.DepartureTime
        );
      }
    });

    return outboundLayover;
  };

  const InboundLayover = () => {
    let inboundlayover = 0;
    if (segments.Inbound) {
      segments.Inbound.map((inboundData, index) => {
        if (lengthIn > 1 && index + 1 !== lengthIn) {
          inboundlayover = diff_minutes_layover(
            inboundData.segment_data.ArrivalTime,
            segments.Inbound[index + 1].segment_data.DepartureTime
          );
        }
      });
    }
    return inboundlayover;
  };
  let totalLAyover = (InboundLayover() + OutboundLayover()) / 1000;
  return (
    <ErrorBoundary>
      <AirlineListMain className={classes}>
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
                <div className="size-12">
                  {totalStops > 1 ? (
                    <>{totalStops} Stops</>
                  ) : totalStops === 1 ? (
                    <>{totalStops} Stop</>
                  ) : (
                    "Direct Flight"
                  )}
                </div>
                <p className="dotted-line" />
                <div className="flight-time">
                  <span>Total Flight Time: {time_convert(TotalTime)}</span>
                  <div className="col-9 ml-4 ">
                    Total Layover:
                    {time_convert(Math.abs(Math.round(totalLAyover / 60)))}
                  </div>
                  <div>{round && "Round-Trip"}</div>
                </div>
                {seats !== "Sold Out" && (
                  <div className="seats-left text-center">
                    <p className="text-danger font-weight-bold">{seats}</p>
                  </div>
                )}
              </div>
              {/* Stop Details (Mobile View) */}
              <div className="mobile-stop-details">
                <div className="size-12">
                  {totalStops > 1 ? (
                    <>{totalStops} Stops</>
                  ) : totalStops === 1 ? (
                    <>{totalStops} Stop</>
                  ) : (
                    "Direct Flight"
                  )}
                </div>
                <div className="flight-time">
                  <span>Total Flight Time: {time_convert(TotalTime)}</span>
                  <div>{round && "Round-Trip"}</div>
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
            <h3>PKR {Number(price)}</h3>
            <p>{"(incl.taxes & fees)"}</p>
            {seats !== "Sold Out" && (
              <button onClick={handleFlightView}>
                {" "}
                Select <AiFillRightCircle className="mb-1" />{" "}
              </button>
            )}
          </div>
          <Details>
            <p onClick={showSegment}>View Details</p>
          </Details>
        </AirlineContainer>
        {segment && (
          <Hititsegment segments={segments} price_info={price_info} />
        )}
      </AirlineListMain>
    </ErrorBoundary>
  );
};

export default HititList;
