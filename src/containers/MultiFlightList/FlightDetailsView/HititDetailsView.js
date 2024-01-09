import React from "react";
import Airplane from "../../../assets/img/airplane.webp";
import DetailsViewSidebar from "./DetailsViewSidebar";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import HititSegment from "../FlightDetails/segment/HititSegment";
import {
  time_convert,
  date_convert,
  utc_convert,
  time_zone,
} from "../../../helper/ConvertFunctions";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  FlightDetailsParent,
} from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";

export default function HititDetailsView({ selectedFlight, navigateTo }) {
  const { segments, price_info } = selectedFlight;
  let TotalFlightTime = 0;

  return (
    <FlightDetailsParent key={Math.random()}>
      <ErrorBoundary>
        <DetailsViewSidebar
          selectedFlight={selectedFlight}
          navigateTo={navigateTo}
        />
        <div className="main">
          <AirlineDetailsView>
            <AirlineContainer>
              <SegmentSection className="pr-2">
                {segments.map((seg, index) => {
                  TotalFlightTime += seg.segment_data.FlightTime;
                  return (
                    <div className="segment" key={index}>
                      <div className="logo-section">
                        <img
                          alt="Airline Logo"
                          src={seg.segment_data.airline_logo}
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
                        <span title={time_zone(seg.segment_data.DepartureTime)}>
                          {utc_convert(seg.segment_data.DepartureTime)}
                        </span>
                        <h5>
                          <span>
                            {seg.segment_data.origin_city_name},{" "}
                            {seg.segment_data.Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(seg.segment_data.DepartureTime)}
                          </h6>
                        </span>
                      </div>
                      {/* Stop Details (Desktop View) */}
                      <div className="stop-details">
                        <div className="flight-time">
                          <span>
                            Total Flight Time:{" "}
                            {time_convert(seg.segment_data.FlightTime)}
                          </span>
                        </div>
                        <p className="dotted-line" />
                        <div className="flight-time">
                          <div>{"Multi-Trip"}</div>
                        </div>
                      </div>
                      {/* Stop Details (Mobile View) */}
                      <div className="mobile-stop-details">
                        <div className="flight-time">
                          <span>
                            Total Flight Time:{" "}
                            {time_convert(seg.segment_data.FlightTime)}
                          </span>
                          <div>{"Multi-Trip"}</div>
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
                        <span title={time_zone(seg.segment_data.ArrivalTime)}>
                          {utc_convert(seg.segment_data.ArrivalTime)}
                        </span>
                        <h5>
                          <span>
                            {seg.segment_data.destination_city_name},{" "}
                            {seg.segment_data.Destination}
                          </span>
                        </h5>
                        <span>
                          <h6>{date_convert(seg.segment_data.ArrivalTime)}</h6>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </SegmentSection>
              <div className="price-section">
                <h3>
                  {`${
                    price_info.pricingOverview.totalAmount.currency.code
                  } ${Number(selectedFlight.price)}`}
                </h3>
                <p>(incl.taxes & fees)</p>
              </div>
            </AirlineContainer>
            <HititSegment
              segments={segments}
              price_info={price_info}
              TotalTime={TotalFlightTime}
            />
          </AirlineDetailsView>
        </div>
      </ErrorBoundary>
    </FlightDetailsParent>
  );
}
