import React, { useState, useEffect } from "react";
import OneWay from "./OneWay";
import MultiTrip from "./Multi";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import Cities from "../../../data/cities.json";
import DefaultCities from "../../../data/DefaultCities.json";
export const Flights = () => {
  const [status, setStatus] = useState("one-way");
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => {
    setShowModal(!showModal);
  };

  let date = "";
  if (window.location.pathname === "/cheap-flight-finder") {
    date = new Date().setDate(new Date().getDate() + 7);
  } else {
    date = new Date().setDate(new Date().getDate() + 1);
  }

  date = new Date(date);

  const Airports = Cities;
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [departureDate, setDepartureDate] = useState(date);
  const [cityFromList, setCityFromList] = useState([]);
  const [cityToList, setCityToList] = useState([]);

  const [showToList, setShowToList] = useState(false);
  const [showFromList, setShowFromList] = useState(false);

  const search = async (value, save) => {
    let val = value.toLowerCase();
    let result = [];
    if (val.length === 9) {
      if (save === "fromAirport") {
        setFromAirport(val);
      } else {
        setToAirport(val);
      }

      result = DefaultCities.filter((city) =>
        city.search.toLowerCase().match(val)
      );
      if (result.length === 0) {
        result = DefaultCities.filter((city) =>
          city.search.toLowerCase().match(val)
        );
      }
    } else if (val.length === 3) {
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
      search("islamabad", "fromAirport");
      setShowFromList(true);
      setFromAirport("Select");
      setShowToList(false);
    } else if (trigger === "toAirport") {
      search("islamabad", "toAirport");
      setShowFromList(false);
      setShowToList(true);
      setToAirport("Select");
    } else {
      setCityToList(result);
      setShowFromList(false);
      setShowToList(false);
    }
  };

  const radioHandler = (e) => {
    setStatus(e.target.value);
    if (e.target.value === "multi-trip") {
      handleShow();
    }
  };
  const stateHandler = () => {
    setStatus("round-trip");
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
      if (e.target.className.indexOf("modal") > -1) {
        setStatus("one-way");
        setShowModal(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setShowFromList(false);
        setShowToList(false);
        setStatus("one-way");
        setShowModal(false);
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="row mx-0 flight-radio-btns d-flex justify-content-center  ">
        <div
          className="btn-group my-2 mt-4"
          role="group"
          aria-label="Basic example"
        >
          <button
            type="button"
            className={
              status === "one-way"
                ? "btn btn-selected rounded-0"
                : "btn btn-trip rounded-0"
            }
            value="one-way"
            onClick={radioHandler}
          >
            One Way
          </button>
          <button
            type="button"
            className={
              status === "round-trip"
                ? "btn btn-selected rounded-0"
                : "btn btn-trip rounded-0"
            }
            value="round-trip"
            onClick={radioHandler}
          >
            Round Trip
          </button>
          <button
            type="button"
            className={
              status === "multi-trip"
                ? "btn btn-selected rounded-0"
                : "btn btn-trip rounded-0"
            }
            value="multi-trip"
            onClick={radioHandler}
          >
            Multi Trip
          </button>
        </div>
      </div>
      {status === "one-way" && (
        <div label="Flight" className="Flight">
          <ErrorBoundary>
            <OneWay
              oneway
              round={false}
              fromAirport={fromAirport}
              toAirport={toAirport}
              onChangeFrom={onChangeFrom}
              onChangeTo={onChangeTo}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              cityFromList={cityFromList}
              cityToList={cityToList}
              showToList={showToList}
              showFromList={showFromList}
              AirportListDropdown={AirportListDropdown}
              stateHandler={stateHandler}
            />
          </ErrorBoundary>
        </div>
      )}
      {status === "round-trip" && (
        <div label="Flight" className="Flight">
          <ErrorBoundary>
            <OneWay
              oneway={false}
              round
              fromAirport={fromAirport}
              toAirport={toAirport}
              onChangeFrom={onChangeFrom}
              onChangeTo={onChangeTo}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              cityFromList={cityFromList}
              cityToList={cityToList}
              showToList={showToList}
              showFromList={showFromList}
              AirportListDropdown={AirportListDropdown}
            />
          </ErrorBoundary>
        </div>
      )}
      {status === "multi-trip" && (
        <div label="Flight" className="Flight">
          <MultiTrip
            showModal={showModal}
            setShowModal={setShowModal}
            handleShow={handleShow}
            setStatus={setStatus}
            modify={false}
          />
        </div>
      )}
    </ErrorBoundary>
  );
};

export default Flights;
