/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useInjectSaga } from "../../../utils/injectSaga";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import saga from "../../NewBookingForm/Flights/saga";
import AutoSuggests from "./autosuggests/AutoSuggests";
import validateInfo from "./validateInfo";
import { updateQuery } from "../../NewBookingForm/Flights/actions";
import { BookingForm } from "../wrapper/BookingForm";
import Select from "react-select";

// Datepicker CSS
// DO NOT REMOVE THE IMPORT BELOW
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
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
  returnDate,
  setReturnDate,
  adult,
  child,
  infant,
  cabin,
  setSearchHook,
  cityFromList,
  cityToList,
  showToList,
  showFromList,
  AirportListDropdown,
  isMounted,
}) => {
  // useInjectReducer({ key: 'OneWay', reducer });
  useInjectSaga({ key: "OneWay", saga });

  const [values, setValues] = useState({
    adult: adult,
    children: child,
    infant: infant,
    cabin: cabin,
  });

  const [Adult, setAdult] = useState(adult);
  const [Child, setChild] = useState(child);
  const [Infant, setInfant] = useState(infant);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useNavigate();

  let defaultVal = { label: cabin, value: cabin };

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
        },
        routeType: "ONEWAY",
      };
      updateQuery(flightObject);
      setSearchHook(true);
      isMounted.current = false;
      history({
        pathname: `/flight-list/from=${fromAirport}&to=${toAirport}&departDate=${departureDate}&adult=${values.adult}&children=${values.children}&infant=${values.infant}&cabin=${values.cabin}&returnDate=${returnDate}`,
        state: {
          fromAirport,
          toAirport,
          returnDate,
          departureDate,
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
    setSearchHook,
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
      <BookingForm
        className="booking-form-inner modify-search-form pr-3"
        onSubmit={handleSubmit}
      >
        <div className="row align-items-end m-0">
          {oneway ? <input type="hidden" value="oneway" name="trip" /> : ""}
          <div className=" col-lg-3 col-md-3 col-sm-12">
            <div className="form From-Airport">
              <div className="position-relative inputs-filed">
                <label htmlFor="arrival-date">From: </label>
                <AutoSuggests
                  name="fromAirport"
                  cityList={cityFromList}
                  value={fromAirport}
                  onChange={onChangeFrom}
                  AirportListDropdown={AirportListDropdown}
                />
                {showFromList &&
                  fromAirport.length > 2 &&
                  cityFromList.length > 0 && (
                    <div className="col-lg-12 position-absolute overflow-y bg-white suggestions from-top">
                      {cityFromList.map((city, index) => {
                        return (
                          <span
                            className="d-flex suggest-item cursor-pointer w-100 p-2 close-suggest"
                            key={index}
                            onClick={() => {
                              onChangeFrom(
                                `${city.code} | ${city.city_name}`,
                                true
                              );
                            }}
                          >
                            {/* <span className=" row m-0 close-suggest"> */}
                            {/* <div className="col-md-12 d-flex pl-0 close-suggest"> */}
                            <div className="col-1 m-auto close-suggest p-0 text-center">
                              <i className="fas fa-plane mr-3 close-suggest" />
                            </div>
                            <div className="col-9 d-flex flex-column close-suggest">
                              <h6 className="col-md-12 px-0 remove-flex airport-name close-suggest">
                                {city.city_name.split(",")[0]}
                              </h6>
                              <p className="col-md-12 px-0 remove-flex country-name-field close-suggest">
                                {city.city_name.split(",")[1].replace(", ", "")}
                              </p>
                            </div>
                            <div className="col-2 m-auto close-suggest p-0 text-center">
                              {city.code}
                            </div>
                            {/* </div> */}
                            {/* </span> */}
                          </span>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-12">
            <div className="form To-Airport">
              <div className="position-relative inputs-filed">
                <label htmlFor="arrival-date">To: </label>
                <AutoSuggests
                  name="toAirport"
                  cityList={cityToList}
                  value={toAirport}
                  onChange={onChangeTo}
                  AirportListDropdown={AirportListDropdown}
                />
                {showToList &&
                  toAirport.length > 2 &&
                  cityToList.length > 0 && (
                    <div className="col-lg-12 position-absolute overflow-y bg-white suggestions to-top">
                      {cityToList.map((city, index) => {
                        return (
                          <span
                            className="d-flex suggest-item cursor-pointer w-100 p-2 close-suggest"
                            key={index}
                            onClick={() => {
                              onChangeTo(
                                `${city.code} | ${city.city_name}`,
                                true
                              );
                            }}
                          >
                            {/* <span className=" row m-0 close-suggest"> */}
                            {/* <div className="d-flex pl-0 close-suggest"> */}
                            <div className="col-1 m-auto close-suggest p-0 text-center">
                              <i className="fas fa-plane mr-3 close-suggest" />
                            </div>
                            <div className="col-9 d-flex flex-column close-suggest">
                              <h6 className="col-md-12 px-0 remove-flex airport-name close-suggest">
                                {city.city_name.split(",")[0]}
                              </h6>
                              <p className="col-md-12 px-0 remove-flex country-name-field close-suggest">
                                {city.city_name.split(",")[1].replace(", ", "")}
                              </p>
                            </div>
                            <div className="col-2 m-auto close-suggest p-0 text-center">
                              {city.code}
                            </div>
                            {/* </div> */}
                            {/* </span> */}
                          </span>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-12">
            <div className="form Departure-Date">
              <div className="inputs-filed mt-10 date">
                <label htmlFor="arrival-date">Departure Date</label>
                <div className="icon">
                  <i className="fal fa-calendar-alt" />
                </div>
                <DatePicker
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

          <div className="col-lg-3 col-md-3 col-sm-12">
            <div className="form Arrival-Date">
              <div className="inputs-filed mt-10 date">
                <label htmlFor="departure-date">Arrival Date</label>
                <div className="icon">
                  <i className="fal fa-calendar-alt" />
                </div>
                <DatePicker
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
        </div>
        <div className="row align-items-end m-0">
          <div className="col-md-2">
            <div className="form Flight-Class">
              <div className="inputs-filed mt-10">
                <label htmlFor="cabin">Class</label>
                <div className="cabin-class-select">
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
                      {
                        handleCabinChange(e);
                      }
                    }}
                    defaultValue={defaultVal}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2 PAX">
            <div className="form Adults">
              <div className="inputs-filed mt-10">
                <label htmlFor="adult">Adults</label>
                <div className="booking-form-counter d-flex flex-row">
                  <div
                    className="value-button"
                    id="decrease"
                    onClick={decreaseCount}
                    value="Decrease Value"
                  >
                    <i className="far fa-minus-square" id="adultIcon" />
                  </div>
                  <input
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
                    <i className="far fa-plus-square" id="adultIcon" />
                  </div>
                </div>
                {/* <label htmlFor="adult" className="old-alert text-primary age-alert">*Age: 12+ Yrs</label> */}
              </div>
            </div>
          </div>
          <div className="col-md-2 PAX">
            <div className="form Children">
              <div className="inputs-filed mt-10">
                <label htmlFor="children">Children</label>
                <div className="booking-form-counter d-flex flex-row">
                  <div
                    className="value-button"
                    id="decrease"
                    onClick={decreaseCount}
                    value="Decrease Value"
                  >
                    <i className="far fa-minus-square" id="childIcon" />
                  </div>
                  <input
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
                    <i className="far fa-plus-square" id="childIcon" />
                  </div>
                </div>
                {/* <label htmlFor="children" className="old-alert text-primary age-alert">*Age: 2-11 Yrs</label> */}
              </div>
            </div>
          </div>
          <div className="col-md-2 PAX">
            <div className="form Infants">
              <div className="inputs-filed mt-10">
                <label htmlFor="infant">Infants</label>
                <div className="booking-form-counter d-flex flex-row">
                  <div
                    className="value-button"
                    id="decrease"
                    onClick={decreaseCount}
                    value="Decrease Value"
                  >
                    <i className="far fa-minus-square" id="infantIcon" />
                  </div>
                  <input
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
                    <i className="far fa-plus-square" id="infantIcon" />
                  </div>
                </div>
                {/* <label htmlFor="infant" className="old-alert text-primary age-alert">*Age: 0-23 Mths</label> */}
              </div>
            </div>
          </div>
        </div>
        <div className="row align-items-end m-0">
          <div className="inputs-filed mt-30">
            <button
              type="submit"
              className="main-btn btn-filled booking-form-button"
              onClick={handleSubmit}
            >
              Search Now
            </button>
          </div>
        </div>
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
