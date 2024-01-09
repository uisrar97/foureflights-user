import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import { selectMultiFlight } from "../../NewBookingForm/Flights/Multi/actions";

import { useNavigate } from "react-router-dom";
import { FlightDetailsParent } from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";

import HititDetailsView from "./HititDetailsView";
import AirblueDetailsView from "./AirblueDetailsView";
import ModifySearch from "../FlightDetails/ModifySearch";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import TravelportDetailsView from "./TravelportDetailsView";

import FareRulesmodal from "../../FlightList/FlightDetailsView/FareRulesmodal";

export function FlightDetailsView({
  query,
  fieldsData,
  setSearchHook,
  isMounted,
  handleFlight,
  selectedFlight,
  airBlueMultiObj,
  selectMultiFlight,
}) {
  window.scrollTo(0, 0);

  const pagelocation = `${query.from[0]} - ${query.to[query.to.length - 1]}`;
  const history = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const navigateTo = () => {
    selectMultiFlight(selectedFlight);

    if (selectedFlight[0].provider_type === "travelport") {
      history(`/multi-flight-traveller?${selectedFlight[0].segments[0].Key}`);
    } else if (
      selectedFlight[0].provider_type === "hitit" ||
      selectedFlight[0].provider_type === "airblue"
    ) {
      history(`/multi-flight-traveller?${selectedFlight[0].key}`);
    }
  };

  const handleShow = () => {
    setShowModal(!showModal);
  };

  const providerFlight = () => {
    if (selectedFlight[0].provider_type === "travelport") {
      return (
        <TravelportDetailsView
          key={Math.random()}
          query={query}
          selectedFlight={selectedFlight[0]}
          handleShow={handleShow}
          navigateTo={navigateTo}
        />
      );
    } else if (selectedFlight[0].provider_type === "hitit") {
      return (
        <HititDetailsView
          key={Math.random()}
          selectedFlight={selectedFlight[0]}
          navigateTo={navigateTo}
        />
      );
    } else if (selectedFlight[0].provider_type === "airblue") {
      return (
        <AirblueDetailsView
          key={Math.random()}
          fieldsData={fieldsData}
          selectedFlight={selectedFlight}
          airBlueMultiObj={airBlueMultiObj}
          handleFlight={handleFlight}
          navigateTo={navigateTo}
        />
      );
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {
        <>
          {/* Modify Search Bar Div Start */}
          <div className="d-flex flex-column flex-grow-1 pl-2 pr-2">
            <ModifySearch
              query={query}
              fieldsData={fieldsData}
              setSearchHook={setSearchHook}
              isMultiMounted={isMounted}
            />
          </div>
          {/* Modify Search Bar Div End */}

          <FlightDetailsParent>
            <ErrorBoundary>{providerFlight()}</ErrorBoundary>
          </FlightDetailsParent>
          {selectedFlight[0].provider_type === "travelport" && (
            <FareRulesmodal
              singleFlight={selectedFlight[0]}
              queryString={query}
              showModal={showModal}
              setShowModal={setShowModal}
              handleShow={handleShow}
            />
          )}
        </>
      }
    </React.Fragment>
  );
}

const mapStateToProps = () => {
  return {};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectMultiFlight }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FlightDetailsView);
