import React, { useState } from "react";
import { ModifySearchMain } from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import MultiTrip from "../../NewBookingForm/Flights/Multi";

function ModifySearch({ query, fieldsData, setSearchHook, isMultiMounted }) {
  const [showModal, setShowModal] = useState(false);

  const firstFlight = fieldsData[0];
  const lastFlight = fieldsData[fieldsData.length - 1];

  const handleShow = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <ErrorBoundary>
        {query && fieldsData.length > 0 && (
          <ModifySearchMain className="col-md-12 px-0">
            <div className="col-lg-10 col-md-12 pl-0 query-div">
              <div className="from-to-details">
                <div className="col-md-12 px-0 row mx-0">
                  <div className="col-lg-12 col-md-12 px-0 text-center">
                    <h3 className="font-weight-bold my-1">Multi Trip Search</h3>
                  </div>
                  <div className="col-lg-6 col-md-12 px-0 d-flex">
                    <h3>From:</h3>
                    <h3>
                      <span className="ml-1">{firstFlight.fromAirport}</span>
                    </h3>
                  </div>
                  <div className="col-lg-6 col-md-12 px-0 d-flex">
                    <h3>To:</h3>
                    <h3>
                      <span className="ml-1">{lastFlight.toAirport}</span>
                    </h3>
                  </div>
                  <div className="col-md-6 col-sm-12 px-0 mb-1 d-flex">
                    <h3>Departure Date:</h3>
                    <h3>
                      <span className="ml-1">
                        {String(new Date(firstFlight.departureDate)).slice(
                          0,
                          15
                        )}{" "}
                        -{" "}
                        {String(new Date(lastFlight.departureDate)).slice(
                          0,
                          15
                        )}
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 px-0 text-center d-flex align-items-center justify-content-center">
              <button
                onClick={handleShow}
                className="p-0 w-100 modify-btn"
                style={{ flexBasis: "unset" }}
              >
                Modify Search
              </button>
            </div>
            {/* Modify Search Form Start */}
            {showModal && (
              <MultiTrip
                showModal={showModal}
                setShowModal={setShowModal}
                handleShow={handleShow}
                setStatus={() => {}}
                modify={true}
                queryFieldsData={fieldsData}
                queryData={query}
                setSearchHook={setSearchHook}
                isMultiMounted={isMultiMounted}
              />
            )}
            {/* Modify Search Form End */}
          </ModifySearchMain>
        )}
      </ErrorBoundary>
    </>
  );
}

export default ModifySearch;
