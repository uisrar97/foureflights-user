import React from "react";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import { SidebarTravellerDetails } from "../../FlightList/TravellerDetails/wrapper/TravelerDetailsStyle";
import {
  time_convert,
  diff_in_minutes,
} from "../../../helper/ConvertFunctions";

export default function MultiSidebar({ flight }) {
  let fromCity = "";
  let toCity = "";
  let flightTime = 0;
  let fare = 0;

  if (flight[0].provider_type === "travelport") {
    const { price, segments } = flight[0];

    let firstSegment = segments[0];
    let lastSegment = segments[segments.length - 1];

    fromCity = firstSegment.origin_city_name;
    toCity = lastSegment.destination_city_name;

    segments.map((seg) => {
      flightTime += Number(seg.FlightTime);
    });

    flightTime = time_convert(flightTime);

    fare = `PKR ${price}`;
  } else if (flight[0].provider_type === "hitit") {
    const { price, segments } = flight[0];

    let firstSegment = segments[0].segment_data;
    let lastSegment = segments[segments.length - 1].segment_data;

    fromCity = firstSegment.origin_city_name;
    toCity = lastSegment.destination_city_name;

    segments.map((seg) => {
      flightTime += Number(seg.segment_data.FlightTime);
    });

    flightTime = time_convert(flightTime);

    fare = `PKR ${price}`;
  } else if (flight[0].provider_type === "airblue") {
    let firstSegment = flight[0].segments;
    let lastSegment = flight[flight.length - 1].segments;

    fromCity = firstSegment.origin_city_name;
    toCity = lastSegment.Destination_city_name;

    flight.map((flt) => {
      fare += flt.price;
      flightTime += diff_in_minutes(
        flt.segments.ArrivalDateTime,
        flt.segments.DepartureDateTime
      );
    });

    fare = `PKR ${fare}`;
    flightTime = time_convert(flightTime);
  }

  return (
    <SidebarTravellerDetails>
      <ErrorBoundary>
        <div className="additional-info">
          <h3>Your Booking</h3>
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-4">
                  <p>From: </p>
                </div>
                <div className="col-8">
                  <span className="address">{fromCity}</span>
                </div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner row">
                <div className="col-4">
                  <p>To: </p>
                </div>
                <div className="col-8">
                  <span className="address">{toCity}</span>
                </div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner">
                <div className="text-center">
                  <span className="address bound">Multi-Trip</span>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-0" />
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5">
                  <p>Total Flight Time: </p>
                </div>
                <div className="col-7">
                  <span className="flight-info">{flightTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="additional-info">
          <h3>Summary</h3>
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5">
                  <p>Four-E Flight </p>
                </div>
                <div className="col-7">
                  <span className="address">{fare}</span>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-0" />
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5">
                  <p>Price You Pay </p>
                </div>
                <div className="col-7">
                  <span className="address">{fare}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </SidebarTravellerDetails>
  );
}
