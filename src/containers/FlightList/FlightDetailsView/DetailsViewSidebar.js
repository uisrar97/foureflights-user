import React from "react";

import { SidebarDetailsView } from "../FlightDetails/wrapper/FlightDetailsStyle";
import ErrorBoundary from "./../../../helper/ErrorBoundary";

export const DetailsViewSidebar = ({
  queryString,
  showModal,
  singleFlight,
  navigateTo,
  flightKey,
}) => {
  const flightPrice = () => {
    if (singleFlight.provider_type === "travelport") {
      let changePenalty = false;
      let cancelPenalty = false;
      if (singleFlight.price_info.ChangePenalty) {
        changePenalty =
          singleFlight.price_info.ChangePenalty.indexOf("PKR") > -1
            ? singleFlight.price_info.ChangePenalty.replace("PKR", "PKR ")
            : singleFlight.price_info.ChangePenalty;
      }
      if (singleFlight.price_info.CancelPenalty) {
        cancelPenalty =
          singleFlight.price_info.CancelPenalty.indexOf("PKR") > -1
            ? singleFlight.price_info.CancelPenalty.replace("PKR", "PKR ")
            : singleFlight.price_info.CancelPenalty;
      }
      return (
        <>
          <ErrorBoundary>
            {(changePenalty !== false || cancelPenalty !== false) && (
              <div className="additional-info">
                <h3>Penalties</h3>
                {changePenalty !== false && (
                  <div className="add-sec">
                    <div className="location">
                      <div className="loc-inner row">
                        <div className="col-7">
                          <p>Change Penalty</p>
                        </div>
                        <div className="col-5">
                          <span className="address">{changePenalty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {changePenalty !== false && cancelPenalty !== false && (
                  <hr className="mt-0" />
                )}
                {cancelPenalty !== false && (
                  <div className="add-sec">
                    <div className="location">
                      <div className="loc-inner row">
                        <div className="col-7">
                          <p>Cancel Penalty</p>
                        </div>
                        <div className="col-5">
                          <span className="address">{cancelPenalty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="additional-info">
              <h3>Summary</h3>
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Four-E Flight </p>
                    </div>
                    <div className="col-5">
                      <span className="address">
                        {"PKR " + singleFlight.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mt-0" />
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Price You Pay </p>
                    </div>
                    <div className="col-5">
                      <span className="address">
                        {"PKR " + singleFlight.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="continue-btn">
              <button onClick={navigateTo}>Continue Booking</button>
            </div>
          </ErrorBoundary>
        </>
      );
    } else if (singleFlight.provider_type === "hitit") {
      return (
        <>
          <ErrorBoundary>
            <div className="additional-info">
              <h3>Summary</h3>
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Four-E Flight </p>
                    </div>
                    <div className="col-5">
                      <span className="address">
                        {"PKR " + singleFlight.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mt-0" />
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Price You Pay </p>
                    </div>
                    <div className="col-5">
                      <span className="address">
                        {"PKR " + singleFlight.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="continue-btn">
              <button onClick={navigateTo}>Continue Booking</button>
            </div>
          </ErrorBoundary>
        </>
      );
    } else if (singleFlight.provider_type === "airblue") {
      if (queryString.returnDate === "undefined") {
        return (
          <>
            <ErrorBoundary>
              <div className="additional-info">
                <h3>Summary</h3>
                <div className="add-sec">
                  <div className="location">
                    <div className="loc-inner row">
                      <div className="col-7">
                        <p>Four-E Flight </p>
                      </div>
                      <div className="col-5">
                        <span className="address">
                          {singleFlight.pricing_info.TotalPrice.CurrencyCode +
                            " " +
                            singleFlight.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="mt-0" />
                <div className="add-sec">
                  <div className="location">
                    <div className="loc-inner row">
                      <div className="col-7">
                        <p>Price You Pay </p>
                      </div>
                      <div className="col-5">
                        <span className="address">
                          {singleFlight.pricing_info.TotalPrice.CurrencyCode +
                            " " +
                            singleFlight.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="continue-btn">
                <button onClick={navigateTo}>Continue Booking</button>
              </div>
            </ErrorBoundary>
          </>
        );
      } else if (
        queryString.returnDate !== "undefined" &&
        flightKey === false
      ) {
        return "";
      }
    } else if (singleFlight.provider_type === "airsial") {
      if (queryString.returnDate === "undefined") {
        return (
          <>
            <ErrorBoundary>
              <div className="additional-info">
                <h3>Summary</h3>
                <div className="add-sec">
                  <div className="location">
                    <div className="loc-inner row">
                      <div className="col-7">
                        <p>Four-E Flight </p>
                      </div>
                      <div className="col-5">
                        <span className="address">
                          {"PKR " + singleFlight.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="mt-0" />
                <div className="add-sec">
                  <div className="location">
                    <div className="loc-inner row">
                      <div className="col-7">
                        <p>Price You Pay </p>
                      </div>
                      <div className="col-5">
                        <span className="address">
                          {"PKR " + singleFlight.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="continue-btn">
                <button onClick={navigateTo}>Continue Booking</button>
              </div>
            </ErrorBoundary>
          </>
        );
      } else if (
        queryString.returnDate !== "undefined" &&
        flightKey === false
      ) {
        return "";
      }
    } else if (
      singleFlight[0].provider_type === "airblue" &&
      queryString.returnDate !== "undefined" &&
      flightKey !== false
    ) {
      let CurrencyCode = "PKR";
      let totalPrice = 0;
      singleFlight.map((flt) => {
        return (totalPrice += Number(flt.price));
      });
      return (
        <>
          <ErrorBoundary>
            <div className="additional-info">
              <h3>Summary</h3>
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Four-E Flight </p>
                    </div>
                    <div className="col-5">
                      <span className="address">
                        {CurrencyCode + " " + totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mt-0" />
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Price You Pay </p>
                    </div>
                    <div className="col-5">
                      <span className="address">
                        {CurrencyCode + " " + totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="continue-btn">
              <button onClick={navigateTo}>Continue Booking</button>
            </div>
          </ErrorBoundary>
        </>
      );
    } else if (
      singleFlight[0].provider_type === "airsial" &&
      queryString.returnDate !== "undefined" &&
      flightKey !== false
    ) {
      let totalPrice = 0;
      singleFlight.map((flt) => {
        return (totalPrice += Number(flt.price));
      });
      return (
        <>
          <ErrorBoundary>
            <div className="additional-info">
              <h3>Summary</h3>
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Four-E Flight </p>
                    </div>
                    <div className="col-5">
                      <span className="address">{"PKR " + totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mt-0" />
              <div className="add-sec">
                <div className="location">
                  <div className="loc-inner row">
                    <div className="col-7">
                      <p>Price You Pay </p>
                    </div>
                    <div className="col-5">
                      <span className="address">{"PKR " + totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="continue-btn">
              <button onClick={navigateTo}>Continue Booking</button>
            </div>
          </ErrorBoundary>
        </>
      );
    }
  };

  return (
    <ErrorBoundary>
      <SidebarDetailsView>
        <div className="additional-info">
          <h3>Additional </h3>
          {queryString && (
            <div className="add-sec">
              <div className="location">
                <div className="loc-inner row">
                  <div className="col-4">
                    <p>From: </p>
                  </div>
                  <div className="col-8">
                    <span className="address">{queryString.from}</span>
                  </div>
                </div>
              </div>
              <div className="location">
                <div className="loc-inner row">
                  <div className="col-4">
                    <p>To: </p>
                  </div>
                  <div className="col-8">
                    <span className="address">{queryString.to}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {singleFlight.provider_type === "travelport" && (
            <span>
              <h3>Fare Rules</h3>
              <p>
                Any cancellation or changes made to this booking may be subject
                to airline fees, please check fare rules before requesting for a
                refund.
              </p>
              <p className="fare-link cursor-pointer" onClick={showModal}>
                Check Fare Rules{" "}
              </p>
            </span>
          )}
        </div>
        {flightPrice()}
      </SidebarDetailsView>
    </ErrorBoundary>
  );
};

export default DetailsViewSidebar;
