import React from "react";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import { SidebarTravellerDetails } from "./wrapper/TravelerDetailsStyle";
import { time_convert } from "../../../helper/ConvertFunctions";

export const TravelportSidebar = ({ flight, query }) => {
  const { price, segments } = flight;
  let QueryCity = query.to.slice(6);
  QueryCity = QueryCity.split(",");

  const round = query.returnDate === "undefined" ? false : true;

  const grouped = segments.filter((seg) => seg.Group === "0");

  const firstSegment = segments[0];
  const lastSegment = grouped[grouped.length - 1];

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
      return 0;
    });
  } else {
    totalFlightTime = segments.reduce(
      (accumulator, segment) => accumulator + Number(segment.FlightTime),
      0
    );
  }

  return (
    <SidebarTravellerDetails>
      <ErrorBoundary>
        <div className="additional-info ">
          <h3>Your Booking</h3>
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-4">
                  <p>From: </p>
                </div>
                <div className="col-8">
                  <span className="address">
                    {firstSegment.origin_city_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner row">
                <div className="col-4">
                  <p>To: </p>
                </div>
                <div className="col-8">
                  <span className="address">
                    {lastSegment.destination_city_name}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="location"
              style={{ display: round ? "block" : "none" }}
            >
              <div className="loc-inner">
                <div className="text-center">
                  <span className="address bound">
                    {round ? "Round-Trip" : ""}
                  </span>
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
                  <span className="flight-info">
                    {time_convert(totalFlightTime)}
                  </span>
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
                  <span className="address">{"PKR " + price}</span>
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
                  <span className="address">{"PKR " + price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </SidebarTravellerDetails>
  );
};

export default TravelportSidebar;
