import React from "react";
import { SidebarDetailsView } from "../../FlightList/FlightDetails/wrapper/FlightDetailsStyle";
import ErrorBoundary from "../../../helper/ErrorBoundary";

export default function DetailsViewSidebar({
  fieldsData,
  selectedFlight,
  handleShow,
  navigateTo,
}) {
  let fromCity = "";
  let toCity = "";
  if (selectedFlight.provider_type === "travelport") {
    fromCity = selectedFlight.segments[0].origin_city_name;
    toCity =
      selectedFlight.segments[selectedFlight.segments.length - 1]
        .destination_city_name;
  } else if (selectedFlight.provider_type === "hitit") {
    fromCity = selectedFlight.segments[0].segment_data.origin_city_name;
    toCity =
      selectedFlight.segments[selectedFlight.segments.length - 1].segment_data
        .destination_city_name;
  } else if (selectedFlight[0].provider_type === "airblue") {
    fromCity = selectedFlight[0].segments.origin_city_name;
    toCity =
      selectedFlight[selectedFlight.length - 1].segments.Destination_city_name;
  }

  const flightPrice = () => {
    if (selectedFlight.provider_type === "travelport") {
      let changePenalty = false;
      let cancelPenalty = false;
      if (selectedFlight.price_info.ChangePenalty) {
        changePenalty =
          selectedFlight.price_info.ChangePenalty.indexOf("PKR") > -1
            ? selectedFlight.price_info.ChangePenalty.replace("PKR", "PKR ")
            : selectedFlight.price_info.ChangePenalty;
      }
      if (selectedFlight.price_info.CancelPenalty) {
        cancelPenalty =
          selectedFlight.price_info.CancelPenalty.indexOf("PKR") > -1
            ? selectedFlight.price_info.CancelPenalty.replace("PKR", "PKR ")
            : selectedFlight.price_info.CancelPenalty;
      }
      return (
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
                      {"PKR " + selectedFlight.price}
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
                      {"PKR " + selectedFlight.price}
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
      );
    } else if (selectedFlight.provider_type === "hitit") {
      return (
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
                      {"PKR " + selectedFlight.price}
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
                      {"PKR " + selectedFlight.price}
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
      );
    } else if (selectedFlight[0].provider_type === "airblue") {
      if (selectedFlight.length === fieldsData.length) {
        let CurrencyCode = "PKR";
        let totalPrice = 0;
        selectedFlight.map((flt) => {
          return (totalPrice += Number(flt.price));
        });
        return (
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
        );
      }
    }
  };

  return (
    <ErrorBoundary>
      <SidebarDetailsView>
        <div className="additional-info">
          <h3>Additional Information</h3>
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-4">
                  <p>From: </p>
                </div>
                <div className="col-8">
                  <span className="address">{fromCity}</span>
                </div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner row">
                <div className="col-4">
                  <p>To: </p>
                </div>
                <div className="col-8">
                  <span className="address">{toCity}</span>
                </div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner row">
                <div className="col-12 text-center">
                  <span className="address">Multi Trip</span>
                </div>
              </div>
            </div>
          </div>
          {selectedFlight.provider_type === "travelport" && (
            <span>
              <h3>Fare Rules</h3>
              <p>
                Any cancellation or changes made to this booking may be subject
                to airline fees, please check fare rules before requesting for a
                refund.
              </p>
              <p className="fare-link cursor-pointer" onClick={handleShow}>
                Check Fare Rules{" "}
              </p>
            </span>
          )}
        </div>
        {flightPrice()}
      </SidebarDetailsView>
    </ErrorBoundary>
  );
}
