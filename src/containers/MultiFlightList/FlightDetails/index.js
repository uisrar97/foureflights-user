import React from "react";
import AirlineCarousel from "../../FlightList/FlightDetails/AirlineCarousel";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import { Link } from "react-router-dom";
import TravelportList from "./TravelportList";
import HititList from "./HititList";
import AirblueList from "./AirblueList";

export default function index({
  handleFlight,
  query,
  aircodes,
  flights,
  checks,
}) {
  window.scrollTo(0, 0);
  let flightRslt = [];

  if (flights !== undefined && flights.status === "200") {
    flightRslt = flights.result.flights;
  }

  if (flightRslt) {
    flightRslt = flightRslt.filter(Boolean);
  }

  return (
    <div
      className={
        flights === undefined || flights.status === "400" || !flights
          ? "col-md-9 pr-0 flightdetails m-auto"
          : "col-md-9 pr-0 flightdetails"
      }
    >
      <AirlineCarousel airlines={aircodes} checks={checks} />
      <ErrorBoundary>
        {flights !== undefined &&
        flights.status === "200" &&
        flightRslt.length > 0 ? (
          <>
            {flightRslt.map((flt, index) => {
              if (flt.provider_type === "travelport") {
                return (
                  <TravelportList
                    query={query}
                    flight={flt}
                    handleFlight={handleFlight}
                    key={index}
                  />
                );
              } else if (flt.provider_type === "hitit") {
                return (
                  <HititList
                    flight={flt}
                    handleFlight={handleFlight}
                    key={index}
                    query={query}
                  />
                );
              } else if (flt.provider_type === "airblue") {
                return (
                  <AirblueList
                    flight={flt}
                    handleFlight={handleFlight}
                    key={index}
                  />
                );
              }
            })}
            <div className="w-100 text-center no-flights-filtered d-none">
              <div className="m-auto">
                <span style={{ color: "#fcb040", fontSize: "30px" }}>
                  No Result Found for these Filters
                </span>
                <div className="flightListBackToHome">
                  <Link to="/">Go Back to Homepage</Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          (flights === undefined ||
            flights.status === "400" ||
            flightRslt.length === 0) && (
            <div className="row h-100 text-center ">
              <div className="col-md-12 my-auto">
                <span style={{ color: "#fcb040", fontSize: "30px" }}>
                  No Result Found. Please Try Again
                </span>
                <div className="flightListBackToHome">
                  <Link to="/">Go Back to Homepage</Link>
                </div>
              </div>
            </div>
          )
        )}
      </ErrorBoundary>
    </div>
  );
}
