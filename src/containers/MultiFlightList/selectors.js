import React from "react";
import { createSelector } from "reselect";
import { initialState } from "../NewBookingForm/Flights/Multi/reducer";
import ErrorBoundary from "../../helper/ErrorBoundary";

const stateMultiFlightsList = (state) =>
  state.multiSearch.multiFlightList || initialState;

const stateMultiQuery = (state) => state.multiSearch.query || initialState;

const stateMultiFieldsData = (state) =>
  state.multiSearch.fieldsData || initialState;

let Aircodes = [];
let newFlights = [];
let sortedAirlines = [];
let tempAircodes = [];
let sortFlts = [];
let flightType = "";

let makeSelectMultiFlightsList = () =>
  createSelector(stateMultiFlightsList, (multiFlightList) => {
    if (
      Object.keys(multiFlightList).length === 0 ||
      multiFlightList.flights.status !== "200" ||
      multiFlightList.flights.result.flights.length === 0
    ) {
      return multiFlightList;
    } else {
      Aircodes = [];
      newFlights = [];
      sortedAirlines = [];
      tempAircodes = [];
      flightType = multiFlightList.flights.result.flight_type;

      <>
        {/* For Taking out Prices of Flights */}
        <ErrorBoundary>
          {multiFlightList.flights.result.flights.map((flt) => {
            let newflt = JSON.parse(JSON.stringify(flt));

            if (typeof newflt === "object") {
              Object.assign(newflt, { flight_type: flightType });
            }

            if (newflt.provider_type === "travelport") {
              let TravelportPrice = Number(
                newflt.price_info.TotalPriceWithCommission
              );
              newflt.price = TravelportPrice;
            } else if (newflt.provider_type === "hitit") {
              let HititPrice = Number(
                newflt.price_info.pricingOverview.TotalPriceWithCommission
              );
              newflt.price = HititPrice;
            } else if (newflt.provider_type === "airblue") {
              let AirbluePrice = Number(
                newflt.pricing_info.TotalPriceWithCommission
              );
              newflt.price = AirbluePrice;
            } else if (
              typeof newflt.length === typeof Number() &&
              newflt.length > 0
            ) {
              newflt.map((abflt) => {
                return abflt.map((AirBlue) => {
                  if (AirBlue.provider_type === "airblue") {
                    let AirbluePrice = Number(
                      AirBlue.pricing_info.TotalPriceWithCommission
                    );
                    AirBlue.price = AirbluePrice;
                    AirBlue.flight_type = flightType;
                  }
                });
              });
            }

            // if (newflt.provider_type !== "hitit") {

            return newFlights.push(newflt);
            // }
          })}
          {(newFlights = newFlights.filter(Boolean))}
        </ErrorBoundary>

        {/* For Taking out Flight Price & Airline Code */}
        <ErrorBoundary>
          {newFlights.map((flight) => {
            if (flight.provider_type === "travelport") {
              let TravelportPrice = Number(
                flight.price_info.TotalPriceWithCommission
              );
              Aircodes.push({
                code: flight.segments[0].Carrier,
                airline_logo: flight.segments[0].airline_logo,
                air_name: flight.segments[0].airline_name,
                price: TravelportPrice,
              });
            } else if (flight.provider_type === "hitit") {
              let HititPrice = Number(
                flight.price_info.pricingOverview.TotalPriceWithCommission
              );
              Aircodes.push({
                code: flight.segments[0].segment_data.Carrier,
                airline_logo: flight.segments[0].segment_data.airline_logo,
                air_name: flight.segments[0].segment_data.airline_name,
                price: HititPrice,
              });
            } else if (flight.provider_type === "airblue") {
              let AirbluePrice = Number(
                flight.pricing_info.TotalPriceWithCommission
              );
              Aircodes.push({
                code: flight.segments.Carrier,
                airline_logo: flight.segments.airline_logo,
                air_name: flight.segments.airline_name,
                price: AirbluePrice,
              });
            }
            return "";
          })}
          {(Aircodes = Aircodes.filter(Boolean))}
        </ErrorBoundary>
      </>;

      tempAircodes = Aircodes;
      for (let i of Aircodes) {
        let loc = i;
        let price = -10000000;
        if (tempAircodes.length > 0) {
          tempAircodes.map((air, index) => {
            if (air.price > price) {
              loc = index;
              price = air.price;
            }
            return 0;
          });
          sortedAirlines.push(tempAircodes[loc]);
          delete tempAircodes[loc];
        }
      }
      sortedAirlines = sortedAirlines.filter(Boolean);
      let codes = sortedAirlines.map((o) => o.code);
      sortedAirlines = sortedAirlines.filter(
        ({ code }, index) => !codes.includes(code, index + 1)
      );

      let temp = newFlights;
      let airBlueFlts = [];
      newFlights = {};
      newFlights.result = {};
      newFlights.result.api_type = multiFlightList.flights.result.api_type;
      newFlights.result.flight_type =
        multiFlightList.flights.result.flight_type;
      newFlights.status = multiFlightList.flights.status;
      if (
        typeof temp[temp.length - 1] === typeof Number() &&
        temp[temp.length - 1].length > 0
      ) {
        airBlueFlts = temp[temp.length - 1];
        delete temp[temp.length - 1];
        temp = temp.filter(Boolean);
        newFlights.result.flights = temp;
      } else {
        newFlights.result.flights = temp;
      }

      if (newFlights.status === "200" && multiFlightList.loading === false) {
        let tempFlight = [];
        sortFlts = [];
        tempFlight = newFlights.result.flights;

        for (let i of Array.from(tempFlight)) {
          let loc = i;
          let price = 10000000;
          if (tempFlight.length > 0) {
            tempFlight.map((flight, index) => {
              if (flight.price < price) {
                loc = index;
                price = flight.price;
              } else if (
                typeof flight.length === typeof Number() &&
                flight.length > 0
              ) {
                sortFlts.push(tempFlight[index]);
                delete tempFlight[index];
              }
              return 0;
            });
            sortFlts.push(tempFlight[loc]);
            delete tempFlight[loc];
          }
        }
        if (airBlueFlts.length > 0) {
          let sortdAirBlue = [];

          airBlueFlts.map(() => {
            sortdAirBlue.push([]);
          });

          let tempABFlts = airBlueFlts;

          if (tempABFlts.length > 0) {
            tempABFlts.map((seg, index) => {
              for (let segFlt of Array.from(seg)) {
                let loc = segFlt;
                let price = 10000000;
                seg.map((flt, index) => {
                  if (flt.price < price) {
                    loc = index;
                    price = flt.price;
                  }
                });
                sortdAirBlue[index].push(seg[loc]);
                delete seg[loc];
              }
            });
          }
          if (sortdAirBlue.length > 0) {
            sortFlts.push(sortdAirBlue);
          }
        }

        newFlights.result.flights = {};
        newFlights.result.flights = sortFlts;
      }
      return {
        flights: newFlights,
        aircodes: sortedAirlines,
        loading: multiFlightList.loading,
      };
    }
  });

let makeSelectStateQuery = () =>
  createSelector(stateMultiQuery, (substate) => substate);

let makeSelectMultiFieldsData = () =>
  createSelector(stateMultiFieldsData, (substate) => substate);

export {
  makeSelectMultiFlightsList,
  makeSelectMultiFieldsData,
  makeSelectStateQuery,
};
