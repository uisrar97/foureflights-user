import React from "react";
import { createSelector } from "reselect";
import { initialState } from "./reducer";
import ErrorBoundary from "./../../helper/ErrorBoundary";

/**
 * Direct selector to the flightList state domain
 */

const selectFlightListDomain = (state) =>
  state.search.flightList || initialState;

/**
 * Other specific selectors
 */
const selectQuery = (state) => state.search || initialState;

/**
 * Default selector used by FlightList
 */

let makeSelectFlightList = () =>
  createSelector(selectFlightListDomain, (substate) => substate);

let Aircodes = [];
let newFlights = [];
let flightType = "";
let apiType = "";
let sortedAirlines = [];
let tempAir = [];
let sortFlts = [];
let flightBoundType = "";

let lowAirBluePrice = 10000000;
let lowAirSialPrice = 10000000;

let makeSelectAirlineCodes = () =>
  createSelector(selectFlightListDomain, selectQuery, (airlist, query) => {
    if (Object.keys(airlist).length === 0 || airlist.flights.status !== "200") {
      return airlist;
    } else {
      newFlights = [];
      Aircodes = [];
      sortedAirlines = [];
      tempAir = [];
      flightType = "";
      flightType = airlist.flights.result.flight_type;
      apiType = airlist.flights.result.api_type;

      <>
        {/* For Flights */}
        <ErrorBoundary>
          {airlist.flights.result.flights.map((flt) => {
            if (
              flt.provider_type === "airblue" &&
              flt.segments.boundType === "inbound"
            ) {
              flightBoundType = "inbound";
            } else if (
              flt.provider_type === "airblue" &&
              flt.segments.boundType === "outbound"
            ) {
              flightBoundType = "outbound";
            }
            if (
              flt.provider_type === "airblue" &&
              flt.segments.boundType === "inbound" &&
              Number(flt.pricing_info.TotalPriceWithCommission) <
                lowAirBluePrice
            ) {
              lowAirBluePrice = Number(
                flt.pricing_info.TotalPriceWithCommission
              );
            }
          })}
          {airlist.flights.result.flights.map((flt) => {
            if (
              flt.provider_type === "airsial" &&
              flt.segments.inbound !== undefined
            ) {
              flightBoundType = "inbound";
            } else if (
              flt.provider_type === "airsial" &&
              flt.segments.outbound !== undefined
            ) {
              flightBoundType = "outbound";
            }
            if (
              flt.provider_type === "airsial" &&
              flt.segments.inbound !== undefined &&
              Number(flt.pricing_info.TotalPriceWithCommission) <
                lowAirSialPrice
            ) {
              lowAirSialPrice = Number(
                flt.pricing_info.TotalPriceWithCommission
              );
            }
          })}
          {airlist.flights.result.flights.map((flt) => {
            let newflt = JSON.parse(JSON.stringify(flt));

            Object.assign(newflt, { flight_type: flightType });

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
            } else if (newflt.provider_type === "airsial") {
              let AirSialPrice = Number(
                newflt.pricing_info.TotalPriceWithCommission
              );
              newflt.price = AirSialPrice;
            }
            newFlights.push(newflt);
            return "";
          })}
        </ErrorBoundary>
        {(newFlights = newFlights.filter(Boolean))}
        {/* For Airline Carousel */}
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
                code: flight.segments.Outbound[0].segment_data.Carrier,
                airline_logo:
                  flight.segments.Outbound[0].segment_data.airline_logo,
                air_name: flight.segments.Outbound[0].segment_data.airline_name,
                price: HititPrice,
              });
            } else if (
              flight.provider_type === "airblue" &&
              flight.cabin_class == "Economy"
            ) {
              let AirbluePrice = Number(
                flight.pricing_info.TotalPriceWithCommission
              );
              if (flightBoundType === "inbound") {
                AirbluePrice =
                  Number(flight.pricing_info.TotalPriceWithCommission) +
                  lowAirBluePrice;
              }

              Aircodes.push({
                code: flight.segments.Carrier,
                airline_logo: flight.segments.airline_logo,
                air_name: flight.segments.airline_name,
                price: AirbluePrice,
              });
            } else if (flight.provider_type === "airsial") {
              let AirSialPrice = flight.pricing_info.TotalPriceWithCommission;
              if (flightBoundType === "inbound") {
                AirSialPrice =
                  flight.pricing_info.TotalPriceWithCommission +
                  lowAirSialPrice;
              }
              if (flight.segments.outbound) {
                Aircodes.push({
                  code: flight.segments.outbound[0].Carrier,
                  airline_logo: flight.segments.outbound[0].airline_logo,
                  air_name: flight.segments.outbound[0].airline_name,
                  price: AirSialPrice,
                });
              }
            }
            return "";
          })}
        </ErrorBoundary>
      </>;
      Aircodes = Aircodes.filter(Boolean);
      tempAir = Aircodes;
      for (let i of Aircodes) {
        let loc = i;
        let price = -10000000;
        if (tempAir.length > 0) {
          tempAir.map((air, index) => {
            if (air.price > price) {
              loc = index;
              price = air.price;
            }
            return 0;
          });
          sortedAirlines.push(tempAir[loc]);
          delete tempAir[loc];
        }
      }
      sortedAirlines = sortedAirlines.filter(Boolean);
      let codes = sortedAirlines.map((o) => o.code);
      sortedAirlines = sortedAirlines.filter(
        ({ code }, index) => !codes.includes(code, index + 1)
      );

      let temp = newFlights;
      newFlights = {};
      newFlights.result = {};
      newFlights.result.api_type = airlist.flights.result.api_type;
      newFlights.result.flight_type = airlist.flights.result.flight_type;
      newFlights.status = airlist.flights.status;
      newFlights.result.flights = temp;

      if (newFlights.status === "200" && airlist.loading === false) {
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
              }
              return 0;
            });
            sortFlts.push(tempFlight[loc]);
            delete tempFlight[loc];
          }
        }
        newFlights.result.flights = {};
        newFlights.result.flights = sortFlts;
      }
      return {
        flights: newFlights,
        aircodes: sortedAirlines,
        loading: airlist.loading,
      };
    }
  });

let makeSelectQuery = () => createSelector(selectQuery, (substate) => substate);

// export default makeSelectFlightList;
export {
  makeSelectFlightList,
  makeSelectAirlineCodes,
  selectFlightListDomain,
  selectQuery,
  makeSelectQuery,
};
