import React, { useState, useEffect } from "react";
import OneWay from "./OneWay";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import Cities from "../../../data/cities.json";

export const Flights = ({ query, round, setSearchHook, isMounted }) => {
  const Airports = Cities;
  let state;
  let retDate;
  let depDate;

  if (round) {
    state = "round-trip";
    retDate = new Date(query.returnDate);
    depDate = new Date(query.departDate);
  } else {
    state = "one-way";
    retDate = "";
    depDate = new Date(query.departDate);
  }

  const [status, setStatus] = useState(state);
  const [fromAirport, setFromAirport] = useState(query.from);
  const [toAirport, setToAirport] = useState(query.to);
  const [departureDate, setDepartureDate] = useState(depDate);
  const [returnDate, setReturnDate] = useState(retDate);
  const [cityFromList, setCityFromList] = useState([]);
  const [cityToList, setCityToList] = useState([]);

  const [showToList, setShowToList] = useState(false);
  const [showFromList, setShowFromList] = useState(false);

  const search = async (value, save) => {
    let val = value.toLowerCase();
    let result = [];
    if (val.length === 3) {
      result = Airports.filter((city) => city.code.toLowerCase().match(val));
      if (result.length === 0) {
        result = Airports.filter((city) =>
          city.city_name.toLowerCase().match(val)
        );
      }
    } else if (val.length < 3 || val.length > 3) {
      result = Airports.filter(
        (city) =>
          city.code.toLowerCase().match(val) ||
          city.city_name.toLowerCase().match(val)
      );
    } else {
      result = [];
    }

    if (save === "fromAirport") {
      setCityFromList(result);
    } else {
      setCityToList(result);
    }
  };

  const onChangeFrom = (newValue, clear) => {
    AirportListDropdown("fromAirport");
    setFromAirport(newValue);

    if (newValue.length >= 3 && clear === false) {
      search(newValue, "fromAirport");
    } else {
      setCityFromList([]);
    }
  };

  const onChangeTo = (newValue, clear) => {
    AirportListDropdown("toAirport");
    setToAirport(newValue);
    if (newValue.length >= 3 && clear === false) {
      search(newValue, "toAirport");
    } else {
      setCityToList([]);
    }
  };

  const AirportListDropdown = (trigger) => {
    if (trigger === "fromAirport") {
      setShowFromList(true);
      setShowToList(false);
    } else if (trigger === "toAirport") {
      setShowFromList(false);
      setShowToList(true);
    } else {
      setShowFromList(false);
      setShowToList(false);
    }
  };

  const radioHandler = (e) => {
    setStatus(e.target.value);
  };

  useEffect(() => {
    document.addEventListener("mouseup", function (e) {
      if (
        typeof e.target.className.indexOf === "function" &&
        e.target.className.indexOf("close-suggest") === -1
      ) {
        setShowFromList(false);
        setShowToList(false);
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="flight-radio-btns">
        <input
          type="radio"
          name="flight"
          value="one-way"
          onChange={radioHandler}
          checked={status === "one-way"}
          id="one"
        />
        <label htmlFor="one">One Way</label>
        <input
          type="radio"
          name="flight"
          value="round-trip"
          onChange={radioHandler}
          checked={status === "round-trip"}
          id="round"
        />
        <label htmlFor="round">Round Trip</label>
        {/* <input type="radio" name="flight" onChange={radioHandler} checked={status === 'multi-trip'} value="multi-trip" /><span>Multi Trip</span> */}
      </div>
      {status === "one-way" ? (
        <div label="Flight" className="Flight">
          <ErrorBoundary>
            <OneWay
              oneway
              round={false}
              multiple={false}
              fromAirport={fromAirport}
              toAirport={toAirport}
              onChangeFrom={onChangeFrom}
              onChangeTo={onChangeTo}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              adult={Number(query.adult)}
              child={Number(query.children)}
              infant={Number(query.infant)}
              cabin={query.cabin}
              setSearchHook={setSearchHook}
              cityFromList={cityFromList}
              cityToList={cityToList}
              showToList={showToList}
              showFromList={showFromList}
              AirportListDropdown={AirportListDropdown}
              isMounted={isMounted}
            />
          </ErrorBoundary>
        </div>
      ) : (
        ""
      )}
      {status === "round-trip" ? (
        <div label="Flight" className="Flight">
          <ErrorBoundary>
            <OneWay
              oneway={false}
              round
              multiple={false}
              fromAirport={fromAirport}
              toAirport={toAirport}
              onChangeFrom={onChangeFrom}
              onChangeTo={onChangeTo}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
              adult={Number(query.adult)}
              child={Number(query.children)}
              infant={Number(query.infant)}
              cabin={query.cabin}
              setSearchHook={setSearchHook}
              cityFromList={cityFromList}
              cityToList={cityToList}
              showToList={showToList}
              showFromList={showFromList}
              AirportListDropdown={AirportListDropdown}
              isMounted={isMounted}
            />
          </ErrorBoundary>
        </div>
      ) : (
        ""
      )}
      {status === "multi-trip" ? (
        <div label="Flight" className="Flight">
          <center>
            <h2>Multi-Trip</h2>
            <br />
          </center>
          <OneWay oneway={false} round={false} multiple={true} />
        </div>
      ) : (
        ""
      )}
    </ErrorBoundary>
  );
};

export default Flights;
