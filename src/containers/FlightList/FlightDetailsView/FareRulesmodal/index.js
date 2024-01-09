/**
 *
 * FareRulesmodal
 *
 */

import React, { memo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";
import { useInjectSaga } from "../../../../utils/injectSaga";
import { useInjectReducer } from "../../../../utils/injectReducer";
import makeSelectFareRulesmodal from "./selectors";
import { requestFareRules } from "./actions";
import reducer from "./reducer";
import saga from "./saga";
import { Plane } from "react-loader-spinner";
import ErrorBoundary from "./../../../../helper/ErrorBoundary";
import { LoaderMain } from "./wrapper/ModalStyle";
import { Modal, Button } from "react-bootstrap";
import { TextCapitalizeFirst } from "../../../../helper/ConvertFunctions";

export function FareRulesmodal({
  singleFlight,
  queryString,
  showModal,
  setShowModal,
  handleShow,
  fareRulesmodal,
  requestFareRules,
}) {
  useInjectReducer({ key: "fareRulesmodal", reducer });
  useInjectSaga({ key: "fareRulesmodal", saga });

  const [tab, setTab] = useState("fare-notes");
  let selected = "cursor-pointer h5 font-weight-bold text-white tab-head";

  useEffect(() => {
    if (
      Object.keys(singleFlight).length > 0 &&
      singleFlight.provider_type === "travelport"
    ) {
      requestFareRules({ singleFlight: singleFlight, flightData: queryString });
    }
  }, []);

  const { details, loading } = fareRulesmodal;

  const bgInfo = (baggage) => {
    let divs = "";

    baggage.map((bg) => {
      divs += '<div class="mb-4">';
      for (const [key, value] of Object.entries(bg)) {
        divs += `<h6 class="font-weight-bold mb-2">${key}: <span class="font-weight-normal">${value}</span></h6>`;
      }
      divs += "</div>";
    });

    return divs;
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="text-dark">Additional Information</Modal.Title>
        <Button variant="normal" onClick={() => handleShow()}>
          <i className="fas fa-times p-0" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <ErrorBoundary>
          {loading ? (
            <LoaderMain>
              <Plane color="#378edd" secondaryColor="#378edd" />
            </LoaderMain>
          ) : (
            <>
              <div className="col-md-12 d-flex text-center modal-tabs">
                <div
                  className={
                    tab === "fare-notes"
                      ? "cursor-pointer col-md-4 selected-tab rounded"
                      : "cursor-pointer col-md-4"
                  }
                  onClick={() => {
                    setTab("fare-notes");
                  }}
                >
                  <span
                    className={
                      tab === "fare-notes"
                        ? selected
                        : "h5 font-weight-bold text-dark tab-head"
                    }
                  >
                    Fare Notes
                  </span>
                </div>
                <div
                  className={
                    tab === "baggage"
                      ? "cursor-pointer col-md-4 selected-tab rounded"
                      : "cursor-pointer col-md-4"
                  }
                  onClick={() => {
                    setTab("baggage");
                  }}
                >
                  <span
                    className={
                      tab === "baggage"
                        ? selected
                        : "h5 font-weight-bold text-dark tab-head"
                    }
                  >
                    Baggage
                  </span>
                </div>
                <div
                  className={
                    tab === "fare-rules"
                      ? "cursor-pointer col-md-4 selected-tab rounded"
                      : "cursor-pointer col-md-4"
                  }
                  onClick={() => {
                    setTab("fare-rules");
                  }}
                >
                  <span
                    className={
                      tab === "fare-rules"
                        ? selected
                        : "h5 font-weight-bold text-dark tab-head"
                    }
                  >
                    Fare Rules
                  </span>
                </div>
              </div>
              <div className="col-md-12 mt-3 tab-content">
                {tab === "fare-notes" && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        !loading &&
                        details.status === "200" &&
                        details.data.flightInformation !== null &&
                        details.data.flightInformation.FareNote !== null
                          ? [
                              TextCapitalizeFirst(
                                details.data.flightInformation.FareNote
                              ),
                            ]
                          : "No Fare Notes Found",
                    }}
                  ></div>
                )}
                {tab === "baggage" && (
                  <div
                    className="text-lowercase  font-weight-normal font-Epilogue"
                    dangerouslySetInnerHTML={{
                      __html:
                        !loading &&
                        details.status === "200" &&
                        details.data.flightInformation !== null &&
                        details.data.flightInformation.baggage !== null
                          ? [bgInfo(details.data.flightInformation.baggage)]
                          : "No Baggage Information Found",
                    }}
                  ></div>
                )}
                {tab === "fare-rules" && (
                  <div
                    className="text-lowercase  font-weight-normal font-Epilogue"
                    dangerouslySetInnerHTML={{
                      __html:
                        !loading &&
                        details.status === "200" &&
                        details.data.FareRulesOutBound !== null
                          ? [details.data.FareRulesOutBound]
                          : "No Rules Found",
                    }}
                  />
                )}
              </div>
            </>
          )}
        </ErrorBoundary>
      </Modal.Body>
    </Modal>
  );
}

FareRulesmodal.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  fareRulesmodal: makeSelectFareRulesmodal(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestFareRules }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(FareRulesmodal);
