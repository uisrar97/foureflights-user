import React, { useState } from "react";
import { Flights } from "./../../BookingForm/Flights/Flights";
import { ModifySearchMain, ModifyFormMain } from "./wrapper/FlightDetailsStyle";
import ErrorBoundary from "./../../../helper/ErrorBoundary";

function ModifySearch({ query, round, setSearchHook, isMounted }) {
  const [showModifyForm, modifyForm] = useState(false);

  const showFormToggle = () => {
    !showModifyForm ? modifyForm(true) : modifyForm(false);
  };

  const DepartDate =
    query.departDate.indexOf(":") === -1
      ? Number(query.departDate)
      : query.departDate;
  const ArriveDate =
    query.returnDate.indexOf(":") === -1
      ? Number(query.returnDate)
      : query.returnDate;
  const depart = String(new Date(DepartDate)).slice(0, 15);
  const arrival = String(new Date(ArriveDate)).slice(0, 15);
  const [values, setValues] = useState({
    adult: query.adult,
    children: query.children,
    infant: query.infant,
    cabin: query.cabin,
  });

  return (
    <>
      <ErrorBoundary>
        <ModifySearchMain className="col-md-12 px-0">
          <div className="col-lg-10 col-md-12 pl-0 query-div">
            <div className="from-to-details">
              {query && (
                <>
                  <h3>
                    From: <span>{`${query.from} -`}</span> To:{" "}
                    <span>{query.to}</span>
                  </h3>
                  {query.returnDate !== "undefined" ? (
                    <h4>
                      Departure Date: <span>{`${depart} -`}</span> Return Date:{" "}
                      <span>{arrival}</span>
                    </h4>
                  ) : (
                    <h4>
                      Departure Date: <span>{depart}</span>
                    </h4>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="col-lg-2 col-md-12 px-0 text-center">
            <button onClick={showFormToggle} className="p-0 w-100 modify-btn">
              Modify Search
            </button>
          </div>
          {/* Modify Search Form Start */}
          {showModifyForm && (
            <ModifyFormMain className="my-2 w-100">
              <Flights
                query={query}
                round={round}
                setSearchHook={setSearchHook}
                isMounted={isMounted}
              />
            </ModifyFormMain>
          )}
          {/* Modify Search Form End */}
        </ModifySearchMain>
        <div className="row mt-3 mb-2">
          <div className="col-md-6"></div>
          <div className="col-md-6 text-right"></div>
        </div>
      </ErrorBoundary>
    </>
  );
}

export default ModifySearch;
