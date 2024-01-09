import React, { useState, useEffect, useRef } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import { useInjectSaga } from "../../utils/injectSaga";
import { createStructuredSelector } from "reselect";
import { Plane } from "react-loader-spinner";
import {
  requestApiData,
  updateQuery,
} from "../NewBookingForm/Flights/Multi/actions";
import {
  makeSelectMultiFlightsList,
  makeSelectMultiFieldsData,
  makeSelectStateQuery,
} from "./selectors";
import Sidebar from "../FlightList/Sidebar";
import FlightDetails from "./FlightDetails";
import FlightDetailsView from "./FlightDetailsView";
import ErrorBoundary from "../../helper/ErrorBoundary";
import ModifySearch from "./FlightDetails/ModifySearch";
import saga from "../NewBookingForm/Flights/Multi/saga";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export function multiFlightList({
  requestApiData,
  updateQuery,
  flightlist,
  fieldsData,
  query,
}) {
  useInjectSaga({ key: "multiFlightList", saga });
  const { flights, aircodes, loading } = flightlist;

  const isMounted = useRef();
  const pagelocation = "Search Results";

  const [selectedFlight, setSelectedFlight] = useState([]);
  const [serachHook, setSearchHook] = useState(false);

  // To separate Airblue Multi Flights from the Remaining Flights
  let airblueMultiObj = [];

  if (Object.keys(flightlist).length > 0) {
    if (
      !loading &&
      flights.status === "200" &&
      flights.result.flights.length > 0
    ) {
      let flightsArray = [];
      flights.result.flights.map((flight) => {
        if (flight !== undefined && flight !== null) {
          flightsArray.push(flight);
        }
      });

      let lastIndex = 0;

      if (
        typeof Object.keys(flightsArray[lastIndex]).length === typeof Number()
      ) {
        airblueMultiObj = flightsArray[lastIndex];
      }
    }
  }

  // Sidebar Functions Start
  const handleAirlineChange = () => {
    checkboxClick();
  };

  function checkboxClick() {
    let a = 0;
    let airlineFlights = 0;

    document.querySelectorAll(".airline-checkbox").forEach(function (el) {
      if (el.checked === true) {
        airlineFlights += 1;
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

    if (airlineFlights > 0) {
      document.querySelector(".cabin-filter-checkbox-div").innerHTML =
        a + " Results Found";
    } else if (airlineFlights === 0) {
      if (
        typeof flights.result.flights[flights.result.flights.length - 1]
          .length === typeof Number()
      ) {
        a = flights.result.flights.length - 1;
      } else {
        a = flights.result.flights.length;
      }
      document.querySelector(".cabin-filter-checkbox-div").innerHTML =
        a + " Results Found";
      document.querySelectorAll(".hidden-flight").forEach(function (el) {
        el.style.display = "block";
        el.classList.remove("hidden-flight");
      });
    }
  }

  const checks = (event) => {
    const ids = event.currentTarget.id;
    if (document.querySelector("#" + ids).checked) {
      document.querySelector("#" + ids).checked = false;
      checkboxClick();
    } else {
      document.querySelector("#" + ids).checked = true;
      checkboxClick();
    }
  };

  const handleCabinClass = (e) => {
    let tmpquery = query;
    tmpquery = JSON.parse(JSON.stringify(tmpquery));
    tmpquery.cabin = e.target.value;

    updateQuery({ query: tmpquery, fieldsData: fieldsData });
    isMounted.current = false;
    setSearchHook(true);
  };
  // Sidebar Functions End

  const handleFlight = (flt) => {
    setSelectedFlight([...selectedFlight, flt]);
  };

  const updateSearch = () => {
    setSelectedFlight([]);
    requestApiData(query, fieldsData);
  };

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    updateSearch();

    isMounted.current = true;
  }, [isMounted, serachHook, window.location.pathname]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {loading ? (
        <div className="flightlist-loader">
          <h3>Please be patient we are finding best solution for you!</h3>
          <Plane color="#378edd" secondaryColor="#378edd" />
        </div>
      ) : (
        <>
          <Navigation />
          <div
            style={{ marginTop: "60px" }}
            className="d-flex flex-column pt-15 px-3 pb-3 mb-115 mr-0"
          >
            {selectedFlight.length === 0 ? (
              <div className="d-flex flex-column w-100">
                <ModifySearch
                  query={query}
                  fieldsData={fieldsData}
                  setSearchHook={setSearchHook}
                  isMultiMounted={isMounted}
                />
                <div className="flightlist mt-2">
                  <ErrorBoundary>
                    <Sidebar
                      cabinClass={query}
                      handleAirlineChange={handleAirlineChange}
                      handleCabinClass={handleCabinClass}
                      airlineDetails={aircodes}
                      airlines={flights}
                      multi
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <FlightDetails
                      handleFlight={handleFlight}
                      query={query}
                      aircodes={aircodes}
                      flights={flights}
                      checks={checks}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            ) : (
              <ErrorBoundary>
                <FlightDetailsView
                  query={query}
                  fieldsData={fieldsData}
                  setSearchHook={setSearchHook}
                  isMounted={isMounted}
                  handleFlight={handleFlight}
                  selectedFlight={selectedFlight}
                  airBlueMultiObj={airblueMultiObj}
                />
              </ErrorBoundary>
            )}
          </div>
          <Footer />
        </>
      )}
    </React.Fragment>
  );
}

const mapStateToProps = createStructuredSelector({
  flightlist: makeSelectMultiFlightsList(),
  fieldsData: makeSelectMultiFieldsData(),
  query: makeSelectStateQuery(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestApiData, updateQuery }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(multiFlightList);
