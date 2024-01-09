import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AirlineCarousel from "./AirlineCarousel";
import AirlineList from "./AirlineList";
import HititList from "./HititList";
import AirblueList from "./AirblueList";
import AirSialList from "./AirSialList";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useInjectSaga } from "./../../../utils/injectSaga";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import validateInfo from "../../BookingForm/Flights/validateInfo";
import { requestApiData } from "../../NewBookingForm/Flights/actions";
import saga from "../../NewBookingForm/Flights/saga";
let PageSize = 10;
function index({
  airlines,
  airlineDetails,
  handleFlightKey,
  query,
  checks,
  setFlight,

  handleDatesFilters,
}) {
  let flights;

  window.scrollTo(0, 0);

  if (airlines !== undefined && airlines.status === "200") {
    flights = airlines.result.flights;
  }

  if (flights) {
    flights = flights.filter(Boolean);
  }
  let pageCount = 0;
  let totalpageCount = 0;
  let pageCountArr = [];
  let airblueFlightsList = [];
  let PreairblueFltNumList = [];
  let currentPage = 1;
  let count2 = 0;
  let countArr = [];

  function getPaginationList(totalrowcount) {
    totalpageCount = Math.ceil(totalrowcount / 10);
    let i = 0;
    let paginationListArr = [];
    while (i < totalpageCount) {
      i++;
      let indexstring = i;
      let paginationclassnum = "pagination" + i;
      paginationListArr.push(
        <li
          className={`shadow page-item ${paginationclassnum} ${
            currentPage === i ? "active" : ""
          }`}
          key={i}
          onClick={() => {
            changePagination(indexstring);
          }}
        >
          <span className="page-link" href="#">
            {i} <span className="sr-only"></span>
          </span>
        </li>
      );
    }
    paginationListArr.push(
      <li
        className="shadow page-item"
        onClick={() => {
          currentPage > 0 && currentPage < totalpageCount
            ? changePagination(currentPage + 1)
            : "";
        }}
      >
        <span className="page-link" href="#">
          Next
        </span>
      </li>
    );

    return paginationListArr;
  }

  function changePagination(pageNumber) {
    currentPage = pageNumber;
    if (currentPage > 0 && currentPage <= totalpageCount) {
      let pageClass = "page" + currentPage;
      let flightelements = document.getElementsByClassName("flight-list");

      for (let i = 0; i <= flightelements.length; i++) {
        if (
          flightelements[i] !== undefined &&
          flightelements[i].classList.contains("d-none")
        ) {
          flightelements[i].classList.remove("d-none");
        }
        if (
          flightelements[i] !== undefined &&
          !flightelements[i].classList.contains(pageClass)
        ) {
          flightelements[i].classList.add("d-none");
        }
      }

      let paginateelements = document.getElementsByClassName("page-item");

      let selectedPageClass = "pagination" + pageNumber;
      for (let l = 0; l <= flightelements.length; l++) {
        if (
          paginateelements[l] !== undefined &&
          paginateelements[l].classList.contains("active")
        ) {
          paginateelements[l].classList.remove("active");
        }
        if (
          paginateelements[l] !== undefined &&
          paginateelements[l].classList.contains(selectedPageClass)
        ) {
          paginateelements[l].classList.add("active");
        }
      }
    }
  }
  const handleSubmitPrev = () => {
    let tomorrow = new Date(query.departDate);
    tomorrow.setDate(tomorrow.getDate(query.departDate) - 1);
    let returnDate = new Date(query.returnDate);
    returnDate.setDate(returnDate.getDate(query.returnDate) - 1);
    let dptDate = tomorrow;
    handleDatesFilters(dptDate, returnDate);

    return false;
  };
  const handleSubmitNext = () => {
    let tomorrow = new Date(query.departDate);
    tomorrow.setDate(tomorrow.getDate(query.departDate) + 1);
    let returnDate = new Date(query.returnDate);
    returnDate.setDate(returnDate.getDate(query.returnDate) + 1);
    let dptDate = tomorrow;
    handleDatesFilters(dptDate, returnDate);

    return false;
  };

  //   if (index === 0) return true; // Include the first object in the filtered array

  //   // Check if flight and its segments are defined
  //   if (
  //     flight &&
  //     flight.segments &&
  //     flight.segments[0] &&
  //     flight.segments[0].FlightNumber &&
  //     flights[0] &&
  //     flights[0].segments &&
  //     flights[0].segments[0] &&
  //     flights[0].segments[0].FlightNumber
  //   ) {
  //     return (
  //       flight.segments[0].FlightNumber !== flights[0].segments[0].FlightNumber
  //     );
  //   }

  //   return flight;
  // });
  let filteredFlights = flights?.filter((flight, index) => {
    if (index === 0) return true; // Include the first object in the filtered array

    // Check if flight and its segments are defined
    if (
      flight &&
      flight.segments &&
      flight.segments[0] &&
      flight.segments[0].FlightNumber &&
      flights[index - 1] &&
      flights[index - 1].segments &&
      flights[index - 1].segments[0] &&
      flights[index - 1].segments[0].FlightNumber
    ) {
      const currentFlightNumber = flight.segments[0].FlightNumber;
      const previousFlightNumber = flights[index - 1].segments[0].FlightNumber;

      // Check if the flight number of the current segment is different from the previous segment
      const isDifferent = currentFlightNumber !== previousFlightNumber;

      return isDifferent;
    }

    return flight;
  });
  filteredFlights = filteredFlights?.reduce((uniqueFlights, currentFlight) => {
    if (currentFlight.provider_type == "hitit") {
      const currentFlightNumber =
        currentFlight.segments?.Outbound?.[0]?.segment_data?.FlightNumber;
      if (
        !uniqueFlights.some(
          (flight) =>
            flight.segments?.Outbound?.[0]?.segment_data?.FlightNumber ===
            currentFlightNumber
        )
      ) {
        uniqueFlights.push(currentFlight);
      }
    } else {
      if (
        !uniqueFlights.some(
          (flight) =>
            flight.segments?.[0]?.FlightNumber ===
            currentFlight.segments?.[0]?.FlightNumber
        )
      ) {
        uniqueFlights.push(currentFlight);
      }
    }
    return uniqueFlights;
  }, []);

  return (
    <>
      <div
        className={
          airlines === undefined || airlines.status === "400" || !flights
            ? "col-md-9 pr-0 flightdetails m-auto"
            : "col-md-9 pr-0 flightdetails"
        }
      >
        <div className="row">
          <div className="col-md-1 d-flex  align-items-center">
            {" "}
            <button
              style={{ fontSize: "14px", fontWeight: "bold" }}
              onClick={handleSubmitPrev}
              className="btn  btn-primary d-flex"
            >
              Prev{" "}
              <p className="pl-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className=""
                  width={"18px"}
                  height={"18px"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </p>
            </button>
          </div>
          <div className="col-md-10 ">
            <AirlineCarousel airlines={airlineDetails} checks={checks} />
          </div>
          <div className="col-md-1 d-flex justify-content-end  align-items-center">
            <button
              style={{ fontSize: "14px", fontWeight: "bold" }}
              onClick={handleSubmitNext}
              className="btn  btn-primary d-flex  "
            >
              Next{" "}
              <p className="pl-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className=""
                  width={"18px"}
                  height={"18px"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </p>
            </button>
          </div>
        </div>

        <ErrorBoundary>
          {airlines !== undefined &&
          airlines.status === "200" &&
          flights &&
          flights.length > 0 ? (
            <>
              {flights.map((flight, index) => {
                if (flight.provider_type === "airblue") {
                  if (
                    !PreairblueFltNumList.includes(flight.segments.FlightNumber)
                  ) {
                    if (index % 10 === 0) {
                      count2 = count2 + 1;
                    }
                    let pageNumClass = "page" + count2;
                    if (count2 > 1) {
                      pageNumClass = pageNumClass + " d-none";
                    }
                    flight.pageNumClass = pageNumClass;
                    PreairblueFltNumList = flight.segments.FlightNumber;
                    pageCount += 1;
                    pageCountArr.push(pageCount);
                  }
                  airblueFlightsList.push(flight);
                }
              })}
              {airblueFlightsList.length !== 0 ? (
                <AirblueList
                  query={query}
                  handleFlight={handleFlightKey}
                  key={Math.random()}
                  flight={airblueFlightsList}
                />
              ) : (
                ""
              )}

              {filteredFlights.map((flight, index) => {
                if (flight.provider_type === "travelport") {
                  pageCount += 1;
                  pageCountArr.push(pageCount);
                  if (index % 10 === 0) {
                    count2 = count2 + 1;
                  }
                  let pageNumClass = "page" + count2;
                  if (count2 > 1) {
                    pageNumClass = pageNumClass + " d-none";
                  }
                  return (
                    <AirlineList
                      query={query}
                      handleFlight={handleFlightKey}
                      setFlight={setFlight}
                      key={Math.random()}
                      flight={flight}
                      paginationClass={pageNumClass}
                    />
                  );
                } else if (flight.provider_type === "hitit") {
                  if (index % 10 === 0) {
                    count2 = count2 + 1;
                  }
                  let pageNumClass = "page" + count2;
                  if (count2 > 1) {
                    pageNumClass = pageNumClass + " d-none";
                  }
                  pageCount += 1;
                  pageCountArr.push(pageCount);
                  return (
                    <HititList
                      query={query}
                      handleFlight={handleFlightKey}
                      key={Math.random()}
                      flight={flight}
                    />
                  );
                } else if (flight.provider_type === "airsial") {
                  if (index % 10 === 0) {
                    count2 = count2 + 1;
                  }
                  let pageNumClass = "page" + count2;
                  if (count2 > 1) {
                    pageNumClass = pageNumClass + " d-none";
                  }
                  pageCount += 1;
                  pageCountArr.push(pageCount);
                  return (
                    <AirSialList
                      query={query}
                      handleFlight={handleFlightKey}
                      key={Math.random()}
                      flight={flight}
                    />
                  );
                } else {
                  return <div></div>;
                }
              })}

              <nav aria-label="..." className="mt-3">
                <ul className="pagination">
                  <li
                    className={`pagination-remove-shadow shadow page-item ${
                      currentPage === 1 ? "" : ""
                    }`}
                    onClick={() => {
                      currentPage > 1 && currentPage <= totalpageCount
                        ? changePagination(currentPage - 1)
                        : "";
                    }}
                  >
                    <span className="page-link" href="#" tabIndex="-1">
                      Previous
                    </span>
                  </li>

                  {getPaginationList(pageCount).map((pagination) => {
                    return pagination;
                  })}
                </ul>
              </nav>

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
            (airlines === undefined ||
              airlines.status === "400" ||
              !flights ||
              flights.length === 0) && (
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
    </>
  );
}

export default index;
