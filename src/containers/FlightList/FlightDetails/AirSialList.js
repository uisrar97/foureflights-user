import React, { useState } from "react";
import { AiFillRightCircle } from "react-icons/ai";
import Airplane from "../../../assets/img/airplane.webp";
import AirSialSegment from "./segment/AirSialSegment";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import {
  AirlineListMain,
  AirlineContainer,
  SegmentSection,
  Details,
} from "./wrapper/FlightDetailsStyle";
import {
  time_convert,
  date_convert,
  airsial_time_convert,
} from "../../../helper/ConvertFunctions";

const AirSialList = ({ flight, handleFlight, query }) => {
  const [segment, setSegment] = useState(false);
  const showSegment = () => (segment ? setSegment(false) : setSegment(true));
  const { segments, price, availableFareTypes } = flight;

  const totalStops = segments.outbound ? segments.outbound.length - 1 : 0;
  const handleFlightView = (
    selectedBagageId,
    selectedBagageDesc,
    bagagePrice
  ) => {
    flight.price = bagagePrice;

    flight.pricing_info.selectedBagageId = selectedBagageId;
    flight.pricing_info.TotalPriceWithCommission = bagagePrice;
    flight.selectedBagageDesc = selectedBagageDesc;
    handleFlight(flight);
  };
  return segments.outbound ? (
    <ErrorBoundary>
      <AirlineListMain className="direct PF">
        <AirlineContainer>
          {/* Segment Section Start */}
          <SegmentSection className="pr-2">
            {/* Segment Start */}
            <div className="segment">
              <div className="logo-section">
                <img
                  alt="Airline Logo"
                  src={segments.outbound[0].airline_logo}
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
                <span>
                  {airsial_time_convert(segments.outbound[0].DEPARTURE_TIME)}
                </span>
                <h5>
                  <span>
                    {segments.outbound[0].origin_city_name},{" "}
                    {segments.outbound[0].Origin}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(segments.outbound[0].DEPARTURE_DATE)}</h6>
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
                  <span>
                    Total Flight Time:{" "}
                    {time_convert(segments.outbound[0].FlightTime)}
                  </span>
                  <div>
                    {query.returnDate === "undefined" ? "" : "Round-Trip"}
                  </div>
                </div>
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
                  <span>
                    Total Flight Time:{" "}
                    {time_convert(segments.outbound[0].FlightTime)}
                  </span>
                </div>
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
                <span>
                  {airsial_time_convert(segments.outbound[0].ARRIVAL_TIME)}
                </span>
                <h5>
                  <span>
                    {segments.outbound[0].Destination_city_name},{" "}
                    {segments.outbound[0].Destination}
                  </span>
                </h5>
                <span>
                  <h6>{date_convert(segments.outbound[0].DEPARTURE_DATE)}</h6>
                </span>
              </div>
            </div>

            <div className="card-columns">
              {flight.availableFareTypes.map((fltbgag) => {
                let bagagePrice = 0;
                //fltbgag.SUB_CLASS_ID
                let FlightSegment = flight.segments.outbound[0].BAGGAGE_FARE;
                FlightSegment.filter((fareBagages) => {
                  if (fareBagages.sub_class_id === fltbgag.SUB_CLASS_ID) {
                    let adultPrice = Number(query.adult) * fareBagages.amount;

                    let childPrice =
                      Number(query.children) * fareBagages.amount;
                    let totalBagagePrice = adultPrice + childPrice;
                    bagagePrice = totalBagagePrice + price;
                  }
                });

                return (
                  <div
                    className={`border rounded begg-info-airsial`}
                    key={Math.random()}
                    onClick={() => {
                      handleFlightView(
                        fltbgag.SUB_CLASS_ID,
                        fltbgag.DESCRIPTION,
                        bagagePrice
                      );
                    }}
                  >
                    <div className=" text-center  py-2">
                      <p className="card-text text-light">
                        {fltbgag.SUB_CLASS_DESC}
                      </p>
                      {bagagePrice !== 0 && (
                        <p className="card-text text-light">
                          {fltbgag.DESCRIPTION}
                        </p>
                      )}

                      {bagagePrice !== 0 ? (
                        <p className="text-light"> PKR: {bagagePrice}</p>
                      ) : (
                        <p className="text-light pb-4"> Sold Out</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Segment End */}
          </SegmentSection>
          {/* Segment Section End */}
          <div className="price-section">
            <h3>PKR {Number(price)}</h3>
            <p>{`(incl.taxes & fees)`}</p>
            <button
              onClick={() => {
                handleFlightView(
                  availableFareTypes[1].SUB_CLASS_ID,
                  availableFareTypes[1].DESCRIPTION,
                  price
                );
              }}
            >
              Select <AiFillRightCircle className="mb-1" />
            </button>
          </div>
          <Details>
            {/* <p onClick={showSegment} to="/">
              View Details
            </p> */}
          </Details>
        </AirlineContainer>
        {segment && (
          <AirSialSegment
            segments={segments}
            baggage={availableFareTypes[1].DESCRIPTION}
            cabin={query.cabin}
          />
        )}
      </AirlineListMain>
    </ErrorBoundary>
  ) : (
    ""
  );
};

export default AirSialList;
