/* FlightList */

import React, { useState, useRef, useEffect } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";
import { useInjectSaga } from "../../utils/injectSaga";
import { Plane } from "react-loader-spinner";
import { makeSelectAirlineCodes, makeSelectQuery } from "./selectors";
import saga from "../NewBookingForm/Flights/saga";
import Sidebar from "./Sidebar";
import FlightDetails from "./FlightDetails";
import FlightDetailsView from "./FlightDetailsView";
import Navigation from "../../components/Navigation";
import Footer from "./../../components/Footer";
import { requestApiData, updateQuery } from "../NewBookingForm/Flights/actions";
import ErrorBoundary from "./../../helper/ErrorBoundary";
import ModifySearch from "./FlightDetails/ModifySearch";

export function FlightList({
  updateQuery,
  historyQuery,
  requestApiData,
  flightlist,
}) {
  useInjectSaga({ key: "FlightList", saga });

  const [flightView, setFlightView] = useState(true);
  const [flight, setFlight] = useState([]);
  const [serachHook, setSearchHook] = useState(true);
  const [layoutIst, SetLayoutISt] = useState(true);
  const [showSegments, setShowSegments] = useState(false);

  const [layoutSecond, SetLayoutSecond] = useState(true);
  const [layoutThird, SetLayouttThird] = useState(false);
  const [selectedNewFlight, SetSelectedNewFlight] = useState({});

  const [cabin, setCabin] = useState({});

  const isMounted = useRef();
  const pagelocation = "Search Results";

  window.scrollTo(0, 0);

  const { flights, aircodes, loading } = flightlist;

  const round =
    historyQuery.query && historyQuery.query.legs[0].returnDate === undefined
      ? false
      : true;
  let tempRound = [];

  const updateSearch = () => {
    setCabin({
      ummrah: historyQuery.query.travelerCount.numUmmrah,
      adult: Number(historyQuery.query.travelerCount.numAdult),
      children: Number(historyQuery.query.travelerCount.numChild),
      infant: Number(historyQuery.query.travelerCount.numInfant),
      to: `${historyQuery.query.legs[0].destination.iataCode} | ${historyQuery.query.legs[0].destination.city}`,
      from: `${historyQuery.query.legs[0].origin.iataCode} | ${historyQuery.query.legs[0].origin.city}`,
      cabin: `${historyQuery.query.cabinClass.label}`,
      departDate: `${historyQuery.query.legs[0].departureDate}`,
      returnDate: `${historyQuery.query.legs[0].returnDate}`,
    });
    requestApiData(historyQuery);
    setFlight([]);
    setSearchHook(false);
    isMounted.current = true;
  };
  useEffect(() => {
    // checkboxClick();
    if (isMounted.current) {
      return;
    }
    if (serachHook || window.location.pathname) {
      updateSearch();
    }
  }, [serachHook, window.location.pathname]);

  // Function for Stops Filter
  const handleChange = () => {
    let filterLen = 0;

    document.querySelectorAll(".airline-checkbox").forEach(function (el) {
      el.checked = false;
    });

    // In case all stops are selected or all are unselected
    if (
      document.querySelector("#direct").checked &&
      document.querySelector("#one-stop").checked &&
      document.querySelector("#multi-stops").checked
    ) {
      document
        .querySelectorAll(".direct, .one-stop, .two-stop")
        .forEach(function (el) {
          filterLen++;
          el.style.display = "block";
          el.classList.remove("hidden-flight");
        });
    } else if (
      !document.querySelector("#direct").checked &&
      !document.querySelector("#one-stop").checked &&
      !document.querySelector("#multi-stops").checked
    ) {
      document
        .querySelectorAll(".direct, .one-stop, .two-stop")
        .forEach(function (el) {
          filterLen++;
          el.style.display = "block";
          el.classList.remove("hidden-flight");
        });
    } else if (
      document.querySelector("#direct").checked &&
      document.querySelector("#one-stop").checked
    ) {
      document.querySelectorAll(".direct, .one-stop").forEach(function (el) {
        filterLen++;
        el.style.display = "block";
        el.classList.remove("hidden-flight");
      });
      document.querySelectorAll(".two-stop").forEach(function (el) {
        el.style.display = "none";
        el.classList.add("hidden-flight");
      });
    } else if (
      document.querySelector("#one-stop").checked &&
      document.querySelector("#multi-stops").checked
    ) {
      document.querySelectorAll(".one-stop, .two-stop").forEach(function (el) {
        filterLen++;
        el.style.display = "block";
        el.classList.remove("hidden-flight");
      });
      document.querySelectorAll(".direct").forEach(function (el) {
        el.style.display = "none";
        el.classList.add("hidden-flight");
      });
    } else if (
      document.querySelector("#direct").checked &&
      document.querySelector("#multi-stops").checked
    ) {
      document.querySelectorAll(".direct, .two-stop").forEach(function (el) {
        filterLen++;
        el.style.display = "block";
        el.classList.remove("hidden-flight");
      });
      document.querySelectorAll(".one-stop").forEach(function (el) {
        el.style.display = "none";
        el.classList.add("hidden-flight");
      });
    } else if (document.querySelector("#direct").checked) {
      document.querySelectorAll(".direct").forEach(function (el) {
        filterLen++;
        el.style.display = "block";
        el.classList.remove("hidden-flight");
      });
      document.querySelectorAll(".one-stop, .two-stop").forEach(function (el) {
        el.style.display = "none";
        el.classList.add("hidden-flight");
      });
    } else if (document.querySelector("#one-stop").checked) {
      document.querySelectorAll(".one-stop").forEach(function (el) {
        filterLen++;
        el.style.display = "block";
        el.classList.remove("hidden-flight");
      });
      document.querySelectorAll(".direct, .two-stop").forEach(function (el) {
        el.style.display = "none";
        el.classList.add("hidden-flight");
      });
    } else if (document.querySelector("#multi-stops").checked) {
      document.querySelectorAll(".two-stop").forEach(function (el) {
        filterLen++;
        el.style.display = "block";
        el.classList.remove("hidden-flight");
      });
      document.querySelectorAll(".direct, .one-stop").forEach(function (el) {
        el.style.display = "none";
        el.classList.add("hidden-flight");
      });
    }

    document.querySelector(
      ".cabin-filter-checkbox-div"
    ).innerHTML = `${filterLen} Results Found`;

    if (
      document.querySelectorAll(".hidden-flight").length ===
      flights.result.flights.length
    ) {
      document.querySelector(".no-flights-filtered").classList.remove("d-none");
    } else {
      document.querySelector(".no-flights-filtered").classList.add("d-none");
    }
  };

  const handleAirlineChange = () => {
    checkboxClick();
  };

  function checkboxClick() {
    let flightListClass = document.getElementsByClassName("flight-list");
    if (flightListClass.length !== 0) {
      for (let j = 0; j <= flightListClass.length; j++) {
        if (
          flightListClass[j] !== undefined &&
          flightListClass[j].classList.contains("d-none")
        ) {
          flightListClass[j].classList.remove("d-none");
        }
      }
    }
    let a = 0;
    document
      .querySelectorAll("#direct, #one-stop, #multi-stops")
      .forEach(function (el) {
        el.checked = false;
      });

    document.querySelectorAll(".airline-checkbox").forEach(function (el) {
      if (el.checked === true) {
        document.querySelectorAll(`.${el.value}`).forEach(function (el) {
          a += 1;
          el.style.display = "block";
          el.classList.remove("hidden-flight");
        });
      } else {
        document.querySelectorAll(`.${el.value}`).forEach(function (el) {
          el.style.display = "none";
          el.classList.add("hidden-flight");
        });
      }
    });

    document.querySelector(".cabin-filter-checkbox-div").innerHTML =
      a + " Results Found";

    if (a === 0) {
      document
        .querySelectorAll(".direct, .one-stop, .two-stop")
        .forEach(function (el) {
          el.style.display = "block";
          el.classList.remove("hidden-flight");
          document.querySelector(".cabin-filter-checkbox-div").innerHTML =
            flights.result.flights.length + " Results Found";
        });
    }
  }

  const handleFlight = (flt, updatedFlight) => {
    if (!updatedFlight) {
      setFlight([...flight, flt]);
      setFlightView(!flightView);
    }
  };
  const handleCabinClass = (e) => {
    let tmpquery = historyQuery.query;
    tmpquery = JSON.parse(JSON.stringify(tmpquery));
    tmpquery.cabinClass.label = e.target.value;

    isMounted.current = false;
    updateQuery(tmpquery);
    setSearchHook(true);
  };

  const handleDatesFilters = (departDate, returnDate) => {
    let tmpquery = historyQuery.query;
    tmpquery = JSON.parse(JSON.stringify(tmpquery));
    tmpquery.legs[0].departureDate = departDate;
    if (round) {
      tmpquery.legs[0].returnDate = returnDate;
    }
    isMounted.current = false;
    updateQuery(tmpquery);
    setSearchHook(true);
  };
  // Airline Carousel Filter Activation
  const checks = (event) => {
    const ids = event.currentTarget.id;
    if (document.querySelector("#" + ids).checked) {
      document.querySelector("#" + ids).checked = false;
      checkboxClick();
    } else {
      document.querySelector("#" + ids).checked = true;
      checkboxClick();
      document.querySelector("#" + ids).checked = false;
    }
  };

  if (round && flights !== undefined && flights.status === "200") {
    let airBlueOutCounter = 0;
    let airBlueInCounter = 0;
    let airSialCounter = 0;
    let tempCodes = aircodes;
    tempRound = flights.result.flights;

    tempRound.map((flight, key = { index }) => {
      if (flight.provider_type === "airblue") {
        if (flight.segments.boundType === "outbound") {
          airBlueOutCounter++;
        } else if (flight.segments.boundType === "inbound") {
          airBlueInCounter++;
        }
      } else if (
        flight.provider_type === "airsial" &&
        flight.segments.inbound &&
        flight.segments.inbound.length > 0
      ) {
        airSialCounter++;
      }
    });

    if (airBlueOutCounter === 0 || airBlueInCounter === 0) {
      let count = 0;
      for (const x of Array.from(tempRound)) {
        if (x.provider_type === "airblue") {
          delete tempRound[count];
        }
        count++;
      }
      count = 0;
      for (const y of Array.from(tempCodes)) {
        if (y.code === "PA") {
          delete tempCodes[count];
        }
        count++;
      }
    }

    tempRound = tempRound.filter(Boolean);
    tempCodes = tempCodes.filter(Boolean);

    if (airSialCounter === 0) {
      let count = 0;
      for (const x of Array.from(tempRound)) {
        if (
          x.provider_type === "airsial" &&
          x.segments.outbound &&
          x.segments.outbound.length > 0
        ) {
          delete tempRound[count];
        }
        count++;
      }
      count = 0;
      for (const y of Array.from(tempCodes)) {
        if (y.code === "PF") {
          delete tempCodes[count];
        }
        count++;
      }
    }

    tempRound = tempRound.filter(Boolean);
    tempCodes = tempCodes.filter(Boolean);

    flightlist.aircodes = tempCodes;
    flights.result.flights = tempRound;
  }

  useEffect(() => {}, [
    layoutSecond,
    layoutThird,
    selectedNewFlight,
    handleFlight,
  ]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {loading || serachHook ? (
        <div className="flightlist-loader">
          <h3>Please be patient we are finding best solution for you!</h3>
          <Plane color="#378edd" secondaryColor="#378edd" />
        </div>
      ) : (
        <>
          <Navigation />
          <div
            style={{ marginTop: "60px" }}
            className="d-flex flex-column pt-15 px-3  pb-3 mb-115 mr-0"
          >
            {flight.length === 0 ? (
              <div className="d-flex flex-column w-100">
                {/* Modify Search Bar Div Start */}
                <ModifySearch
                  query={cabin}
                  round={round}
                  setSearchHook={setSearchHook}
                  isMounted={isMounted}
                  updateQuery={updateQuery}
                  updateSearch={updateSearch}
                  handleDatesFilters={handleDatesFilters}
                />

                {/* Modify Search Bar Div End */}
                <div className="flightlist mt-2">
                  <ErrorBoundary>
                    <Sidebar
                      cabinClass={cabin}
                      handleAirlineChange={handleAirlineChange}
                      handleChange={handleChange}
                      handleCabinClass={handleCabinClass}
                      airlineDetails={aircodes}
                      airlines={flights}
                      round={round}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <FlightDetails
                      query={cabin}
                      handleFlightKey={handleFlight}
                      airlineDetails={aircodes}
                      airlines={flights}
                      checks={checks}
                      handleDatesFilters={handleDatesFilters}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            ) : (
              <>
                <ErrorBoundary>
                  <FlightDetailsView
                    queryString={cabin}
                    allFlights={flights}
                    flight={flight}
                    setFlight={setFlight}
                    round={round}
                    setSearchHook={setSearchHook}
                    isMounted={isMounted}
                    handleFlightKey={handleFlight}
                    layoutThird={layoutThird}
                    layoutSecond={layoutSecond}
                    selectedNewFlight={selectedNewFlight}
                    SetSelectedNewFlight={SetSelectedNewFlight}
                    SetLayoutSecond={SetLayoutSecond}
                    SetLayouttThird={SetLayouttThird}
                    layoutIst={layoutIst}
                    SetLayoutISt={SetLayoutISt}
                    showSegments={showSegments}
                    setShowSegments={setShowSegments}
                  />
                </ErrorBoundary>
              </>
            )}
          </div>
          <Footer />
        </>
      )}
    </React.Fragment>
  );
}

const mapStateToProps = createStructuredSelector({
  flightlist: makeSelectAirlineCodes(),
  historyQuery: makeSelectQuery(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestApiData, updateQuery }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FlightList);
