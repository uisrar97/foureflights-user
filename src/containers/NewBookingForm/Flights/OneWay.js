/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import AutoSuggests from "./autosuggests/AutoSuggests";
import validateInfo from "./validateInfo";
import { updateQuery } from "./actions";
import { BookingForm } from "./../wrapper/NewBookingFormStyle";
import Select from "react-select";

// Datepicker CSS
// DO NOT REMOVE THE IMPORT BELOW
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./autosuggests/autosuggests.css";
// DO NOT REMOVE THE IMPORT ABOVE

toast.configure();
export const OneWay = ({
  updateQuery,
  oneway,
  round,
  multiple,
  onChangeTo,
  onChangeFrom,
  fromAirport,
  toAirport,
  departureDate,
  setDepartureDate,
  cityFromList,
  cityToList,
  showToList,
  showFromList,
  AirportListDropdown,
  stateHandler,
}) => {
  const [returnDate, setReturnDate] = useState();
  const [values, setValues] = useState({
    adult: 1,
    children: 0,
    infant: 0,
    ummrah: false,
    cabin: "Economy",
  });
  const [Adult, setAdult] = useState(1);
  const [Child, setChild] = useState(0);
  const [Infant, setInfant] = useState(0);
  const [ummrah, setUmmrah] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useNavigate();

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const flightObject = {
        cabinClass: {
          label: values.cabin,
        },
        flexibility: null,
        legs: [
          {
            origin: {
              city: fromAirport.split("|")[1].trim(),
              iataCode: fromAirport.split("|")[0].trim(),
            },
            destination: {
              city: toAirport.split("|")[1].trim(),
              iataCode: toAirport.split("|")[0].trim(),
            },
            departureDate,
            returnDate,
          },
        ],
        nonStopFlight: false,
        travelerCount: {
          numAdult: values.adult,
          numChild: values.children,
          numInfant: values.infant,
          numUmmrah: ummrah,
        },
        routeType: "ONEWAY",
      };
      updateQuery(flightObject);
      history({
        pathname: `/flight-list/from=${fromAirport}&to=${toAirport}&departDate=${departureDate}&ummrah=${ummrah}&adult=${values.adult}&children=${values.children}&infant=${values.infant}&cabin=${values.cabin}&returnDate=${returnDate}`,
        state: {
          fromAirport,
          toAirport,
          returnDate,
          departureDate,
          ummrah: ummrah,
          adult: values.adult,
          children: values.children,
          infant: values.infant,
          cabin: values.cabin,
        },
      });
    } else if (errors.fromAirport) {
      toast.error(errors.fromAirport, { position: toast.POSITION.TOP_RIGHT });
    } else if (errors.toAirport) {
      toast.error(errors.toAirport, { position: toast.POSITION.TOP_RIGHT });
    } else if (errors.departureDate) {
      toast.error(errors.departureDate, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (errors.returnDate) {
      toast.error(errors.returnDate, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (errors.infantError) {
      setValues({ ...values, infant: values.adult });
      toast.error(errors.infantError, { position: toast.POSITION.TOP_RIGHT });
    }
    // return 0;
  }, [
    departureDate,
    history,
    isSubmitting,
    returnDate,
    updateQuery,
    values,
    round,
    oneway,
    multiple,
    errors,
    toAirport,
    fromAirport,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrors(
      validateInfo({
        fromAirport,
        toAirport,
        departureDate,
        returnDate,
        adult: values.adult,
        infant: values.infant,
        round,
      })
    );
    setIsSubmitting(true);

    return false;
  };
  const handleChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCabinChange = (event) => {
    setValues((values) => ({
      ...values,
      cabin: event.value,
    }));
  };

  const decreaseCount = (event) => {
    let id = event.target.id;

    if (id === "adultIcon" && values.adult > 1) {
      values.adult--;
      setAdult(values.adult);
    } else if (id === "childIcon" && values.children > 0) {
      values.children--;
      setChild(values.children);
    } else if (id === "infantIcon" && values.infant > 0) {
      values.infant--;
      setInfant(values.infant);
    }
  };
  const increaseCount = (event) => {
    let id = event.target.id;

    if (id === "adultIcon" && values.adult <= 7) {
      values.adult++;
      setAdult(values.adult);
    } else if (id === "childIcon" && values.children < 8) {
      values.children++;
      setChild(values.children);
    } else if (id === "infantIcon" && values.infant < 8) {
      values.infant++;
      setInfant(values.infant);
    }
  };

  return (
    <ErrorBoundary>
      <BookingForm onSubmit={handleSubmit}>
        {round && (
          <div className="  d-lg-flex   flex-lg-row justify-content-between">
            <div className="">
              <div className="col-md-12">
                <div className="position-relative inputs-filed ">
                  <label
                    className="text-light"
                    style={{ fontSize: 14 }}
                    htmlFor="arrival-date "
                  >
                    From:{" "}
                  </label>
                  <AutoSuggests
                    name="fromAirport"
                    cityList={cityFromList}
                    value={fromAirport}
                    onChange={onChangeFrom}
                    icon={
                      <i
                        style={{ fontSize: 14 }}
                        className="fas fa-plane-departure"
                      />
                    }
                    AirportListDropdown={AirportListDropdown}
                  />
                  {showFromList &&
                    fromAirport.length > 2 &&
                    cityFromList.length > 0 && (
                      <div className="position-absolute overflow-y w-100 bg-white suggestions from-top">
                        {cityFromList.map((city, index) => {
                          return (
                            <span
                              style={{ fontSize: 12 }}
                              className="suggest-item cursor-pointer w-100 h-100 p-1 pr-4 close-suggest"
                              key={index}
                              onClick={() => {
                                onChangeFrom(
                                  `${city.code} | ${city.city_name}`,
                                  true
                                );
                              }}
                            >
                              <span className=" row m-0 close-suggest">
                                <div className="col-md-12 d-flex pl-0 close-suggest">
                                  <div className="col-1 m-auto close-suggest">
                                    <i
                                      style={{ fontSize: 16 }}
                                      className="fas fa-plane mr-3 close-suggest"
                                    />
                                  </div>
                                  <div className="col-9 d-flex flex-column close-suggest">
                                    <h6 className="col-md-12 remove-flex airport-name close-suggest">
                                      {city.city_name.split(",")[0]}
                                    </h6>
                                    <p className="col-md-12 remove-flex country-name-field close-suggest">
                                      {city.city_name
                                        .split(",")[1]
                                        .replace(", ", "")}
                                    </p>
                                  </div>
                                  <div className="col-2 m-auto close-suggest">
                                    {city.code}
                                  </div>
                                </div>
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="">
              <div className="col-md-12">
                <div className="position-relative inputs-filed">
                  <label
                    className="text-light"
                    style={{ fontSize: 14 }}
                    htmlFor="arrival-date"
                  >
                    To:{" "}
                  </label>
                  <AutoSuggests
                    name="toAirport"
                    cityList={cityToList}
                    value={toAirport}
                    onChange={onChangeTo}
                    icon={
                      <i
                        style={{ fontSize: 14 }}
                        className="fas  fa-plane-arrival"
                      />
                    }
                    AirportListDropdown={AirportListDropdown}
                  />
                  {showToList &&
                    toAirport.length > 2 &&
                    cityToList.length > 0 && (
                      <div className="position-absolute overflow-y w-100 bg-white suggestions to-top">
                        {cityToList.map((city, index) => {
                          return (
                            <span
                              style={{ fontSize: 12 }}
                              className="suggest-item cursor-pointer w-100 h-100 p-1 pr-4 close-suggest"
                              key={index}
                              onClick={() => {
                                onChangeTo(
                                  `${city.code} | ${city.city_name}`,
                                  true
                                );
                              }}
                            >
                              <span className=" row m-0 close-suggest">
                                <div className="col-md-12 d-flex pl-0 close-suggest">
                                  <div className="col-1 m-auto close-suggest">
                                    <i
                                      style={{ fontSize: 16 }}
                                      className="fas fa-plane mr-1 close-suggest"
                                    />
                                  </div>
                                  <div className="col-9 d-flex flex-column close-suggest">
                                    <h6 className="col-md-12 remove-flex airport-name close-suggest">
                                      {city.city_name.split(",")[0]}
                                    </h6>
                                    <p className="col-md-12 remove-flex country-name-field close-suggest">
                                      {city.city_name
                                        .split(",")[1]
                                        .replace(", ", "")}
                                    </p>
                                  </div>
                                  <div className="col-2 m-auto close-suggest">
                                    {city.code}
                                  </div>
                                </div>
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="d-lg-flex d-md-flex flex-lg-row justify-content-around">
              <div className={round ? "col-md-4 " : "col-md-4"}>
                <div className="form date Departure-Date">
                  <div className="inputs-filed mb-2 date d-flex flex-column">
                    <i
                      style={{
                        fontSize: 14,
                        marginTop: 34,
                        color: "black",
                        opacity: "70%",
                      }}
                      className="fal  fa-calendar-alt font-weight-normal position-absolute calender-icon"
                    />
                    <label
                      className="text-light"
                      style={{ fontSize: 14 }}
                      htmlFor="arrival-date"
                    >
                      Departure
                    </label>
                    <DatePicker
                      style={{ fontSize: 12 }}
                      name="departDate"
                      autoComplete="off"
                      dateFormat="dd-MM-yyyy"
                      selected={departureDate}
                      onChange={(date) => setDepartureDate(date)}
                      minDate={new Date()}
                      placeholderText="Departure Date"
                      showDisabledMonthNavigation
                      selectsStart
                      startDate={departureDate}
                      endDate={returnDate}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-4 pr-3">
                <div className="form date Arrival-Date">
                  <div className="inputs-filed mb-2 date d-flex flex-column">
                    <i
                      style={{
                        fontSize: 14,
                        marginTop: 34,
                        color: "black",
                        opacity: "70%",
                      }}
                      className="fal  fa-calendar-alt font-weight-normal position-absolute calender-icon"
                    />
                    <label
                      className="text-light"
                      style={{ fontSize: 14 }}
                      htmlFor="departure-date"
                    >
                      Arrival
                    </label>
                    <DatePicker
                      disabled={!round}
                      name="returnDate"
                      dateFormat="dd-MM-yyyy"
                      autoComplete="off"
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      placeholderText="Return Date"
                      showDisabledMonthNavigation
                      selectsEnd
                      startDate={departureDate}
                      endDate={returnDate}
                      minDate={departureDate}
                    />
                  </div>
                  <input type="hidden" value="round" name="trip" />
                </div>
              </div>

              <div className="col-md-4" style={{ fontSize: 12 }}>
                <div className="form date Flight-Class ">
                  <div className="inputs-filed ">
                    <label
                      className="text-light"
                      style={{ fontSize: 14 }}
                      htmlFor="cabin"
                    >
                      Class
                    </label>
                    <div className="cabin-class-select ">
                      <Select
                        name="cabin"
                        placeholder={"Select Cabin"}
                        className={"bookingform-select"}
                        classNamePrefix={"cabin-select"}
                        isSearchable={true}
                        options={[
                          { value: "Economy", label: "Economy" },
                          { value: "EXECUTIVE_ECONOMY", label: "Economy plus" },
                          { value: "Business", label: "Business" },
                        ]}
                        onChange={(e) => {
                          handleCabinChange(e);
                        }}
                        defaultValue={{ value: "Economy", label: "Economy" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!round && (
          <div className="  d-lg-flex   flex-lg-row justify-content-between">
            <div className="">
              <div className="col-md-12">
                <div className="position-relative inputs-filed ">
                  <label
                    className="text-light"
                    style={{ fontSize: 14 }}
                    htmlFor="arrival-date "
                  >
                    From:{" "}
                  </label>
                  <AutoSuggests
                    name="fromAirport"
                    cityList={cityFromList}
                    value={fromAirport}
                    onChange={onChangeFrom}
                    icon={
                      <i
                        style={{ fontSize: 14 }}
                        className="fas fa-plane-departure"
                      />
                    }
                    AirportListDropdown={AirportListDropdown}
                  />
                  {showFromList &&
                    fromAirport.length > 2 &&
                    cityFromList.length > 0 && (
                      <div className="position-absolute overflow-y w-100 bg-white suggestions from-top">
                        {cityFromList.map((city, index) => {
                          return (
                            <span
                              style={{ fontSize: 12 }}
                              className="suggest-item cursor-pointer w-100 h-100 p-1 pr-4 close-suggest"
                              key={index}
                              onClick={() => {
                                onChangeFrom(
                                  `${city.code} | ${city.city_name}`,
                                  true
                                );
                              }}
                            >
                              <span className=" row m-0 close-suggest">
                                <div className="col-md-12 d-flex pl-0 close-suggest">
                                  <div className="col-1 m-auto close-suggest">
                                    <i
                                      style={{ fontSize: 16 }}
                                      className="fas fa-plane mr-3 close-suggest"
                                    />
                                  </div>
                                  <div className="col-9 d-flex flex-column close-suggest">
                                    <h6 className="col-md-12 remove-flex airport-name close-suggest">
                                      {city.city_name.split(",")[0]}
                                    </h6>
                                    <p className="col-md-12 remove-flex country-name-field close-suggest">
                                      {city.city_name
                                        .split(",")[1]
                                        .replace(", ", "")}
                                    </p>
                                  </div>
                                  <div className="col-2 m-auto close-suggest">
                                    {city.code}
                                  </div>
                                </div>
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="">
              <div className="col-md-12">
                <div className="position-relative inputs-filed">
                  <label
                    className="text-light"
                    style={{ fontSize: 14 }}
                    htmlFor="arrival-date"
                  >
                    To:{" "}
                  </label>
                  <AutoSuggests
                    name="toAirport"
                    cityList={cityToList}
                    value={toAirport}
                    onChange={onChangeTo}
                    icon={
                      <i
                        style={{ fontSize: 14 }}
                        className="fas  fa-plane-arrival"
                      />
                    }
                    AirportListDropdown={AirportListDropdown}
                  />
                  {showToList &&
                    toAirport.length > 2 &&
                    cityToList.length > 0 && (
                      <div className="position-absolute overflow-y w-100 bg-white suggestions to-top">
                        {cityToList.map((city, index) => {
                          return (
                            <span
                              style={{ fontSize: 12 }}
                              className="suggest-item cursor-pointer w-100 h-100 p-1 pr-4 close-suggest"
                              key={index}
                              onClick={() => {
                                onChangeTo(
                                  `${city.code} | ${city.city_name}`,
                                  true
                                );
                              }}
                            >
                              <span className=" row m-0 close-suggest">
                                <div className="col-md-12 d-flex pl-0 close-suggest">
                                  <div className="col-1 m-auto close-suggest">
                                    <i
                                      style={{ fontSize: 16 }}
                                      className="fas fa-plane mr-1 close-suggest"
                                    />
                                  </div>
                                  <div className="col-9 d-flex flex-column close-suggest">
                                    <h6 className="col-md-12 remove-flex airport-name close-suggest">
                                      {city.city_name.split(",")[0]}
                                    </h6>
                                    <p className="col-md-12 remove-flex country-name-field close-suggest">
                                      {city.city_name
                                        .split(",")[1]
                                        .replace(", ", "")}
                                    </p>
                                  </div>
                                  <div className="col-2 m-auto close-suggest">
                                    {city.code}
                                  </div>
                                </div>
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="d-lg-flex d-md-flex flex-lg-row justify-content-around">
              <div className={round ? "col-md-4 " : "col-md-4"}>
                <div className="form date Departure-Date">
                  <div className="inputs-filed mb-2 date d-flex flex-column">
                    <i
                      style={{
                        fontSize: 14,
                        marginTop: 34,
                        color: "black",
                        opacity: "70%",
                      }}
                      className="fal  fa-calendar-alt font-weight-normal position-absolute calender-icon"
                    />
                    <label
                      className="text-light"
                      style={{ fontSize: 14 }}
                      htmlFor="arrival-date"
                    >
                      Departure
                    </label>
                    <DatePicker
                      style={{ fontSize: 12 }}
                      name="departDate"
                      autoComplete="off"
                      dateFormat="dd-MM-yyyy"
                      selected={departureDate}
                      onChange={(date) => setDepartureDate(date)}
                      minDate={new Date()}
                      placeholderText="Departure Date"
                      showDisabledMonthNavigation
                      selectsStart
                      startDate={departureDate}
                      endDate={returnDate}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-4 pr-3">
                <div className="form date Arrival-Date">
                  <div className="inputs-filed mb-2 date d-flex flex-column">
                    <i
                      style={{
                        fontSize: 14,
                        marginTop: 34,
                        color: "black",
                        opacity: "70%",
                      }}
                      className="fal  fa-calendar-alt font-weight-normal position-absolute calender-icon"
                    />
                    <label
                      className="text-light"
                      style={{ fontSize: 14 }}
                      htmlFor="departure-date"
                    >
                      Arrival
                    </label>
                    <div onClick={stateHandler}>
                      <DatePicker
                        disabled={!round}
                        name="returnDate"
                        dateFormat="dd-MM-yyyy"
                        autoComplete="off"
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        placeholderText="Return Date"
                        showDisabledMonthNavigation
                        selectsEnd
                        startDate={departureDate}
                        endDate={returnDate}
                        minDate={departureDate}
                      />
                    </div>
                  </div>
                  <input type="hidden" value="round" name="trip" />
                </div>
              </div>

              <div className="col-md-4" style={{ fontSize: 12 }}>
                <div className="form date Flight-Class ">
                  <div className="inputs-filed ">
                    <label
                      className="text-light"
                      style={{ fontSize: 14 }}
                      htmlFor="cabin"
                    >
                      Class
                    </label>
                    <div className="cabin-class-select ">
                      <Select
                        name="cabin"
                        placeholder={"Select Cabin"}
                        className={"bookingform-select"}
                        classNamePrefix={"cabin-select"}
                        isSearchable={true}
                        options={[
                          { value: "Economy", label: "Economy" },
                          { value: "EXECUTIVE_ECONOMY", label: "Economy plus" },
                          { value: "Business", label: "Business" },
                        ]}
                        onChange={(e) => {
                          handleCabinChange(e);
                        }}
                        defaultValue={{ value: "Economy", label: "Economy" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row d-flex flex-row Passenger-Counters-Row">
          {round && (
            <div className=" d-lg-flex mt-4 mt-md-0 flex-row  Passenger-Counters-Row">
              <div className="col-md-3 d-flex align-items-center bg-lights justify-content-center ">
                <div className="inputs-filed col-md-12 d-flex ">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="adult"
                    className="font-weight-normal pr-2 text-xl text-light pax-label"
                  >
                    Ummrah Pessengers
                  </label>

                  <input
                    onChange={(e) => {
                      setUmmrah(e.target.checked);
                    }}
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                    type="checkbox"
                    value={values.ummrah}
                  />
                </div>
              </div>
              <div className="col-md-2 form Adults">
                <div className="inputs-filed col-md-12">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="adult"
                    className="font-weight-normal text-xl text-light pax-label"
                  >
                    Adults
                  </label>
                  <div className="booking-form-counter border-light d-flex flex-row">
                    <div
                      className="value-button"
                      id="decrease"
                      onClick={decreaseCount}
                      value="Decrease Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-minus-square"
                        id="adultIcon"
                      />
                    </div>
                    <input
                      className="text-light"
                      type="number"
                      name="adult"
                      id="adult"
                      onChange={handleChange}
                      value={Adult}
                    />
                    <div
                      className="value-button"
                      id="increase"
                      onClick={increaseCount}
                      value="Increase Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-plus-square"
                        id="adultIcon"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="adult"
                    className=" text-primary text-light font-weight-normal age-alert"
                  >
                    *Age: 12+ Yrs
                  </label>
                </div>
              </div>
              <div className="col-md-2 form Children">
                <div className="inputs-filed col-md-12 ">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="children"
                    className="font-weight-normal text-light pax-label"
                  >
                    Children
                  </label>
                  <div className="booking-form-counter  border-light d-flex flex-row">
                    <div
                      className="value-button"
                      id="decrease"
                      onClick={decreaseCount}
                      value="Decrease Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far  text-light fa-minus-square"
                        id="childIcon"
                      />
                    </div>
                    <input
                      className="text-light "
                      type="number"
                      name="children"
                      id="children"
                      onChange={handleChange}
                      value={Child}
                    />
                    <div
                      className="value-button"
                      id="increase"
                      onClick={increaseCount}
                      value="Increase Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-plus-square"
                        id="childIcon"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="children"
                    className=" text-primary text-light font-weight-normal age-alert"
                  >
                    *Age: 2-11 Yrs
                  </label>
                </div>
              </div>
              <div className="col-md-2 form Infants">
                <div className="inputs-filed col-md-12 ">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="infant"
                    className="font-weight-normal text-light pax-label"
                  >
                    Infants
                  </label>
                  <div className="booking-form-counter border-light text-light d-flex flex-row">
                    <div
                      className="value-button"
                      id="decrease"
                      onClick={decreaseCount}
                      value="Decrease Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far  text-light fa-minus-square"
                        id="infantIcon"
                      />
                    </div>
                    <input
                      className="text-light"
                      type="number"
                      name="infant"
                      id="infant"
                      onChange={handleChange}
                      value={Infant}
                    />
                    <div
                      className="value-button"
                      id="increase"
                      onClick={increaseCount}
                      value="Increase Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-plus-square"
                        id="infantIcon"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="infant"
                    className=" text-primary text-light font-weight-normal age-alert"
                  >
                    *Age: 0-23 Mths
                  </label>
                </div>
              </div>
              <div className="inputs-filed mt-2 col-md-3  text-right    ">
                <div className="col-md-12">
                  <button
                    style={{ fontSize: 14 }}
                    type="submit"
                    className="btn btn-block mt-30 font-weight-bold btn-primary   "
                    onClick={handleSubmit}
                  >
                    Search Now
                  </button>
                </div>
              </div>
            </div>
          )}
          {!round && (
            <div className=" d-lg-flex mt-4 mt-md-0 flex-row  Passenger-Counters-Row">
              <div className="col-md-3 d-flex align-items-center bg-lights justify-content-center ">
                <div className="inputs-filed col-md-12 d-flex ">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="adult"
                    className="font-weight-normal pr-2 text-xl text-light pax-label"
                  >
                    Ummrah Pessengers
                  </label>

                  <input
                    onClick={stateHandler}
                    onChange={(e) => {
                      setUmmrah(e.target.checked);
                    }}
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                    type="checkbox"
                    value={values.ummrah}
                  />
                </div>
              </div>
              <div className="col-md-2 form Adults">
                <div className="inputs-filed col-md-12">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="adult"
                    className="font-weight-normal text-xl text-light pax-label"
                  >
                    Adults
                  </label>
                  <div className="booking-form-counter border-light d-flex flex-row">
                    <div
                      className="value-button"
                      id="decrease"
                      onClick={decreaseCount}
                      value="Decrease Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-minus-square"
                        id="adultIcon"
                      />
                    </div>
                    <input
                      className="text-light"
                      type="number"
                      name="adult"
                      id="adult"
                      onChange={handleChange}
                      value={Adult}
                    />
                    <div
                      className="value-button"
                      id="increase"
                      onClick={increaseCount}
                      value="Increase Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-plus-square"
                        id="adultIcon"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="adult"
                    className=" text-primary text-light font-weight-normal age-alert"
                  >
                    *Age: 12+ Yrs
                  </label>
                </div>
              </div>
              <div className="col-md-2 form Children">
                <div className="inputs-filed col-md-12 ">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="children"
                    className="font-weight-normal text-light pax-label"
                  >
                    Children
                  </label>
                  <div className="booking-form-counter  border-light d-flex flex-row">
                    <div
                      className="value-button"
                      id="decrease"
                      onClick={decreaseCount}
                      value="Decrease Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far  text-light fa-minus-square"
                        id="childIcon"
                      />
                    </div>
                    <input
                      className="text-light "
                      type="number"
                      name="children"
                      id="children"
                      onChange={handleChange}
                      value={Child}
                    />
                    <div
                      className="value-button"
                      id="increase"
                      onClick={increaseCount}
                      value="Increase Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-plus-square"
                        id="childIcon"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="children"
                    className=" text-primary text-light font-weight-normal age-alert"
                  >
                    *Age: 2-11 Yrs
                  </label>
                </div>
              </div>
              <div className="col-md-2 form Infants">
                <div className="inputs-filed col-md-12 ">
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="infant"
                    className="font-weight-normal text-light pax-label"
                  >
                    Infants
                  </label>
                  <div className="booking-form-counter border-light text-light d-flex flex-row">
                    <div
                      className="value-button"
                      id="decrease"
                      onClick={decreaseCount}
                      value="Decrease Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far  text-light fa-minus-square"
                        id="infantIcon"
                      />
                    </div>
                    <input
                      className="text-light"
                      type="number"
                      name="infant"
                      id="infant"
                      onChange={handleChange}
                      value={Infant}
                    />
                    <div
                      className="value-button"
                      id="increase"
                      onClick={increaseCount}
                      value="Increase Value"
                    >
                      <i
                        style={{ fontSize: 16 }}
                        className="far text-light fa-plus-square"
                        id="infantIcon"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="infant"
                    className=" text-primary text-light font-weight-normal age-alert"
                  >
                    *Age: 0-23 Mths
                  </label>
                </div>
              </div>
              <div className="inputs-filed mt-2 col-md-3  text-right    ">
                <div className="col-md-12">
                  <button
                    style={{ fontSize: 14 }}
                    type="submit"
                    className="btn btn-block mt-30 font-weight-bold btn-primary   "
                    onClick={handleSubmit}
                  >
                    Search Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <div className="row justify-content-center">
          <div className="inputs-filed mt-2">
            <button
              type="submit"
              className="main-btn btn-filled booking-form-button"
              onClick={handleSubmit}
            >
              Search Now
            </button>
          </div>
        </div> */}
      </BookingForm>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state) => ({
  SearchQuery: state.search,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ updateQuery }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OneWay);
