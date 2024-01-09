/**
 *
 * FlightDetailsView
 *
 */

import React, { memo, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";
import { useInjectSaga } from "../../../utils/injectSaga";
import { useInjectReducer } from "../../../utils/injectReducer";
import { requestSingle, addQuery } from "./actions";
import makeSelectFlightDetailsView from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import FareRulesmodal from "./FareRulesmodal";
import TravelportDetailsView from "./TravelportDetailsView.js";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import ModifySearch from "../FlightDetails/ModifySearch";
import HititDetailsView from "./HititDetailsView";
import AirBlueDetailsView from "./AirBlueDetailsView";
import AirSialDetailsView from "./AirSialDetailsView";
import { FlightDetailsParent } from "../FlightDetails/wrapper/FlightDetailsStyle";

export function FlightDetailsView({
  queryString,
  allFlights,
  flight,
  setFlight,
  round,
  setSearchHook,
  addQuery,
  requestSingle,
  isMounted,
  handleFlightKey,
  layoutThird,
  layoutSecond,
  selectedNewFlight,
  SetSelectedNewFlight,
  SetLayoutSecond,
  SetLayouttThird,
  layoutIst,
  SetLayoutISt,
  showSegments,
  setShowSegments,
}) {
  useInjectReducer({ key: "flightDetailsView", reducer });
  useInjectSaga({ key: "flightDetailsView", saga });
  const history = useNavigate();
  window.scrollTo(0, 0);
  const pagelocation =
    queryString.from.slice(0, 3) + " - " + queryString.to.slice(0, 3);

  const roundAirSelect = () => {
    allFlights.result.flights.map((flt) => {
      if (
        flt.provider_type === "airblue" &&
        flt.segments.boundType === "inbound" &&
        flt.key === flightKey
      ) {
        setFlight([...flight, flt]);
      }
      if (
        flt.provider_type === "airsial" &&
        flt.segments.inbound &&
        flt.key === flightKey
      ) {
        setFlight([...flight, flt]);
      }
      return 0;
    });
  };
  const [flightKey, setFlightKey] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [show, setShow] = useState(false);
  // const [disp, setDisp] = useState(false);

  const handleShow = () => {
    setShowModal(!showModal);
  };

  const navigateTo = () => {
    requestSingle(flight);
    addQuery(queryString);
    if (flight[0].provider_type === "travelport") {
      history("/traveller?key=" + flight[0].segments[0].Key);
    }
    if (
      flight[0].provider_type === "hitit" ||
      flight[0].provider_type === "airblue" ||
      flight[0].provider_type === "airsial"
    ) {
      history("/traveller?key=" + flight[0].key);
    }
  };

  const providerFlight = () => {
    if (flight[0].provider_type === "travelport") {
      return (
        <TravelportDetailsView
          navigateTo={navigateTo}
          showModal={handleShow}
          queryString={queryString}
          singleFlight={flight[0]}
          handleFlight={handleFlightKey}
          flights={allFlights}
          key={Math.random()}
          layoutThird={layoutThird}
          layoutSecond={layoutSecond}
          selectedNewFlight={selectedNewFlight}
          SetSelectedNewFlight={SetSelectedNewFlight}
          SetLayoutSecond={SetLayoutSecond}
          SetLayouttThird={SetLayouttThird}
          setFlight={setFlight}
        />
      );
    } else if (flight[0].provider_type === "hitit") {
      return (
        <HititDetailsView
          navigateTo={navigateTo}
          showModal={handleShow}
          queryString={queryString}
          singleFlight={flight[0]}
          handleFlight={handleFlightKey}
          flights={allFlights}
          key={Math.random()}
          layoutThird={layoutThird}
          layoutSecond={layoutSecond}
          selectedNewFlight={selectedNewFlight}
          SetSelectedNewFlight={SetSelectedNewFlight}
          SetLayoutSecond={SetLayoutSecond}
          SetLayouttThird={SetLayouttThird}
          setFlight={setFlight}
          layoutIst={layoutIst}
          SetLayoutISt={SetLayoutISt}
          showSegments={showSegments}
          setShowSegments={setShowSegments}
        />
      );
    } else if (flight[0].provider_type === "airblue") {
      return (
        <AirBlueDetailsView
          navigateTo={navigateTo}
          showModal={handleShow}
          queryString={queryString}
          singleFlight={flight}
          flights={allFlights}
          flightKey={flightKey}
          setFlightKey={setFlightKey}
          key={Math.random()}
        />
      );
    } else if (flight[0].provider_type === "airsial") {
      return (
        <AirSialDetailsView
          navigateTo={navigateTo}
          showModal={handleShow}
          queryString={queryString}
          singleFlight={flight}
          flights={allFlights}
          flightKey={flightKey}
          setFlightKey={setFlightKey}
          key={Math.random()}
        />
      );
    } else {
      return <div>Another Empty Div</div>;
    }
  };

  useEffect(() => {
    if (flightKey !== false) {
      roundAirSelect();
    }
  }, [flightKey]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {Object.keys(flight).length > 0 && (
        <>
          {/* Modify Search Bar Div Start */}
          <div className="d-flex flex-column flex-grow-1 pl-2 pr-2">
            <ModifySearch
              query={queryString}
              round={round}
              setSearchHook={setSearchHook}
              isMounted={isMounted}
            />
          </div>
          {/* Modify Search Bar Div End */}
          <FlightDetailsParent>
            <ErrorBoundary>{providerFlight()}</ErrorBoundary>
          </FlightDetailsParent>
          {/* modal start from here */}
          {flight[0].provider_type === "travelport" && (
            <FareRulesmodal
              singleFlight={flight[0]}
              queryString={queryString}
              showModal={showModal}
              setShowModal={setShowModal}
              handleShow={handleShow}
            />
          )}
        </>
      )}
    </React.Fragment>
  );
}

const container = document.createElement("div");
document.body.appendChild(container);
FlightDetailsView.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  flightDetailsView: makeSelectFlightDetailsView(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestSingle, addQuery }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(FlightDetailsView);
