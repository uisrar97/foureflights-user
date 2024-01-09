import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BookingForm } from "../../wrapper/NewBookingFormStyle";
import { validateFlightFields } from "./validation";
import { updateQuery } from "./actions";
import Select from "react-select";
import DatePicker from "react-datepicker";
import AutoSuggests from "../autosuggests/AutoSuggests";
import Cities from "../../../../data/cities.json";
import { FormatDate } from "../../../../helper/ConvertFunctions";

// Datepicker CSS
// DO NOT REMOVE THE IMPORT BELOW
import "react-datepicker/dist/react-datepicker.css";
// DO NOT REMOVE THE IMPORT ABOVE

export function MultiTrip({
  showModal,
  setShowModal,
  handleShow,
  setStatus,
  updateQuery,
  modify,
  queryFieldsData,
  queryData,
  setSearchHook,
  isMultiMounted,
}) {
  const isMounted = useRef();
  const history = useNavigate();
  const Airports = Cities;

  const [fieldCount, setFieldCount] = useState(2);
  const [fieldStatus, setFieldStatus] = useState(true);
  const [fieldsData, setFieldsData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ummrah, setUmmrah] = useState(false);
  const [Cabin, setCabin] = useState("Economy");
  const [Adult, setAdult] = useState(1);
  const [Child, setChild] = useState(0);
  const [Infant, setInfant] = useState(0);

  let DefaultDate = "";
  if (window.location.pathname === "/cheap-flight-finder") {
    DefaultDate = new Date().setDate(new Date().getDate() + 7);
  } else {
    DefaultDate = new Date().setDate(new Date().getDate() + 1);
  }

  DefaultDate = new Date(DefaultDate);

  // Search Airports Function
  const search = (value) => {
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

    return result;
  };

  // Functions for Adding / Removing Fields
  const initialFields = () => {
    let field = [];
    for (let i = 0; i < fieldCount; i++) {
      field.push({
        id: uuidv4(),
        toAirport: "",
        fromAirport: "",
        departureDate: "",
        cityFromList: [],
        cityToList: [],
        showFromList: false,
        showToList: false,
        ummrah: ummrah,
        errors: {},
      });
    }
    setFieldsData(field);
    setFieldStatus(false);
  };

  // Function for Modify Search
  const modifySearch = () => {
    let field = [];
    for (let i = 0; i < queryFieldsData.length; i++) {
      field.push({
        id: queryFieldsData[i].id,
        toAirport: queryFieldsData[i].toAirport,
        fromAirport: queryFieldsData[i].fromAirport,
        departureDate: new Date(queryFieldsData[i].departureDate),
        cityFromList: [],
        cityToList: [],
        showFromList: false,
        showToList: false,
        ummrah: ummrah,
        errors: {},
      });
    }
    setFieldsData(field);

    setCabin(queryData.cabin);
    setAdult(queryData.adult);
    setChild(queryData.children);
    setInfant(queryData.infant);

    setFieldStatus(false);
  };

  const addField = () => {
    let index = fieldsData.length - 1;
    let field = {
      id: uuidv4(),
      toAirport: "",
      fromAirport: fieldsData[index].toAirport,
      departureDate: "",
      cityFromList: [],
      cityToList: [],
      showFromList: false,
      showToList: false,
      ummrah: ummrah,
      errors: {},
    };
    setFieldsData([...fieldsData, field]);
    setFieldStatus(false);
  };

  const incFCount = () => {
    let x = fieldCount;
    if (x < 5) {
      isMounted.current = false;
      x += 1;
      setFieldCount(x);
      addField();
    }
  };

  const decFCount = (id) => {
    let data = fieldsData;
    let count = fieldCount;
    data = data.map((fld) => {
      if (fld.id === id) {
        count -= 1;
        return false;
      } else {
        return fld;
      }
    });
    data = data.filter(Boolean);
    setFieldsData(data);
    setFieldCount(count);
  };

  // Functions for Showing / Hiding and Adding / Removing Values in To and From Fields
  const onChangeFrom = (newValue, clear, obj) => {
    const fields = fieldsData.map((fld) => {
      if (fld.id === obj.id) {
        fld["fromAirport"] = newValue;
        fld.showFromList = false;
        fld.cityFromList = [];
      } else {
        fld.showFromList = false;
      }
      return fld;
    });
    if (obj.fromAirport.length === 0 && clear === false) {
      let rslt = search(obj.fromAirport);
      obj.showFromList = true;
      obj.cityFromList = rslt;
    }
    if (obj.fromAirport.length >= 3 && clear === false) {
      let rslt = search(obj.fromAirport);
      obj.showFromList = true;
      obj.cityFromList = rslt;
    }
    setFieldsData(validateFlightFields(fields));
  };

  const onChangeTo = (newValue, clear, obj) => {
    const fields = fieldsData.map((fld, index) => {
      if (fld.id === obj.id) {
        fld["toAirport"] = newValue;
        fld.showToList = false;
        fld.cityToList = [];
        if (
          clear &&
          index + 1 < fieldsData.length &&
          fieldsData[index + 1]["id"] !== fld.id
        ) {
          fieldsData[index + 1]["fromAirport"] = newValue;
          fieldsData[index + 1].showFromList = false;
          fieldsData[index + 1].cityFromList = [];
        }
      } else {
        fld.showToList = false;
      }
      return fld;
    });
    if (obj.toAirport.length >= 3 && clear === false) {
      let rslt = search(obj.toAirport);
      obj.showToList = true;
      obj.cityToList = rslt;
    }
    setFieldsData(validateFlightFields(fields));
  };

  const showList = (trigger, id) => {
    const fields = fieldsData.map((fld) => {
      if (fld.id === id && trigger === "fromAirport") {
        fld.showFromList = true;
        fld.showToList = false;
      } else if (fld.id === id && trigger === "toAirport") {
        fld.showFromList = false;
        fld.showToList = true;
      } else if (fld.id !== id) {
        fld.showFromList = false;
        fld.showToList = false;
      }
      return fld;
    });

    setFieldsData(fields);
  };

  // Function for Setting Departure Date
  const departDate = (date, id) => {
    const fields = fieldsData.map((fld) => {
      if (fld.id === id) {
        fld.departureDate = date;
      }
      return fld;
    });
    setFieldsData(validateFlightFields(fields));
  };

  // Functions for Cabin Class and PAX Quantity
  const handleCabinChange = (e) => {
    setCabin(e.value);
  };

  const decreaseCount = (event) => {
    let id = event.target.id;
    if (id === "adultIcon" && Adult > 1) {
      let value = Adult - 1;
      setAdult(value);
      if (value < Infant) {
        setInfant(value);
      }
    } else if (id === "childIcon" && Child > 0) {
      let value = Child - 1;
      setChild(value);
    } else if (id === "infantIcon" && Infant > 0) {
      let value = Infant - 1;
      setInfant(value);
    }
  };

  const increaseCount = (event) => {
    let id = event.target.id;
    if (id === "adultIcon" && Adult <= 7) {
      let value = Adult + 1;
      setAdult(value);
    } else if (id === "childIcon" && Child < 8) {
      let value = Child + 1;
      setChild(value);
    } else if (id === "infantIcon" && Infant < 8) {
      let value = Infant + 1;
      if (value <= Adult) {
        setInfant(value);
      }
    }
  };

  // Submit and Validate Function
  const handleSubmit = () => {
    const fieldVals = validateFlightFields(fieldsData);
    setFieldsData(fieldVals);

    let check = false;

    fieldVals.map((fld) => {
      if (Object.keys(fld.errors).length > 0) {
        check = true;
      }
    });

    if (!check) {
      setIsSubmitting(true);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    if (fieldStatus && fieldCount >= 2 && fieldCount <= 5 && !modify) {
      initialFields();
    } else if (fieldStatus && modify) {
      modifySearch();
    }

    isMounted.current = true;
  }, [fieldCount, initialFields]);

  useEffect(() => {
    if (isSubmitting) {
      const multiObj = {
        from_date: [],
        from: [],
        to: [],
        cabin: Cabin,
        adult: Adult,
        children: Child,
        infant: Infant,
        ummrah: ummrah,
        ToCity: [],
      };

      fieldsData.map((fld) => {
        let fromCity = fld.fromAirport.split(" | ");
        fromCity = fromCity[0];
        let toCity = fld.toAirport.split(" | ");
        toCity = toCity[0];
        let ToCityName = fld.toAirport.split("|");
        ToCityName = ToCityName[1];
        let date = FormatDate(fld.departureDate);

        multiObj.from.push(fromCity);
        multiObj.to.push(toCity);
        multiObj.from_date.push(date);
        multiObj.ToCity.push(ToCityName);
      });

      updateQuery({ query: multiObj, fieldsData: fieldsData });

      if (modify) {
        setSearchHook(true);
        isMultiMounted.current = false;
      }

      history(`/multi-flight-list/from=${multiObj.from}&to=${multiObj.to}&ToCity=${multiObj.ToCity}&from_date=${multiObj.from_date}&ummrah=${multiObj.ummrah}&ticket_class=
            ${multiObj.cabin}&adult=${multiObj.adult}&children=${multiObj.children}&infant=${multiObj.infant}`);
    }
  }, [isSubmitting, history, setSearchHook]);

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title className="text-dark font-weight-bold">
            Multi City Trip
          </Modal.Title>
          <Button
            variant="normal"
            onClick={() => {
              handleShow();
              setStatus("one-way");
            }}
          >
            <i className="fas fa-times p-0" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <BookingForm>
            {fieldsData.length > 0 &&
              fieldsData.map((fld, index) => {
                return (
                  <div
                    className="col-md-12 px-0 d-flex flex-row border-bottom py-3"
                    key={index}
                  >
                    <div
                      className={
                        index > 1
                          ? "col-md-12 col-sm-12 col-12 row d-flex px-0 border-right"
                          : "col-md-12 col-sm-12 col-12 row d-flex px-0"
                      }
                      key={index}
                    >
                      <div className="col-md-4">
                        <div className="position-relative inputs-filed">
                          <label htmlFor="fromAirport">From: </label>
                          <AutoSuggests
                            name="fromAirport"
                            id="fromAirport"
                            cityList={fld.cityFromList}
                            value={fld.fromAirport}
                            onChange={onChangeFrom}
                            icon={<i className="fas fa-plane-departure" />}
                            AirportListDropdown={() => {
                              showList("fromAirport", fld.id);
                            }}
                            obj={fld}
                          />
                          {fld.showFromList &&
                            fld.fromAirport.length > 2 &&
                            fld.cityFromList.length > 0 && (
                              <div className="position-absolute overflow-y w-100 bg-white suggestions from-top">
                                {fld.cityFromList.map((city, index) => {
                                  return (
                                    <span
                                      className="suggest-item cursor-pointer w-100 p-2 close-suggest"
                                      key={index}
                                      onClick={() => {
                                        onChangeFrom(
                                          `${city.code} | ${city.city_name}`,
                                          true,
                                          fld
                                        );
                                      }}
                                    >
                                      <span className=" row m-0 close-suggest">
                                        <div className="col-md-12 d-flex pl-0 close-suggest">
                                          <div className="col-1 m-auto close-suggest">
                                            <i className="fas fa-plane mr-3 close-suggest" />
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
                          {fld.errors.fromAirport && (
                            <label className="text-danger font-weight-bold error-warning">
                              {fld.errors.fromAirport}
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="position-relative inputs-filed">
                          <label htmlFor="toAirport">To: </label>
                          <AutoSuggests
                            name="toAirport"
                            id="toAirport"
                            cityList={fld.cityToList}
                            value={fld.toAirport}
                            onChange={onChangeTo}
                            icon={<i className="fas fa-plane-arrival" />}
                            AirportListDropdown={() => {
                              showList("toAirport", fld.id);
                            }}
                            obj={fld}
                          />
                          {fld.showToList &&
                            fld.toAirport.length > 2 &&
                            fld.cityToList.length > 0 && (
                              <div className="position-absolute overflow-y w-100 bg-white suggestions to-top">
                                {fld.cityToList.map((city, index) => {
                                  return (
                                    <span
                                      className="suggest-item cursor-pointer w-100 p-2 close-suggest"
                                      key={index}
                                      onClick={() => {
                                        onChangeTo(
                                          `${city.code} | ${city.city_name}`,
                                          true,
                                          fld
                                        );
                                      }}
                                    >
                                      <span className=" row m-0 close-suggest">
                                        <div className="col-md-12 d-flex pl-0 close-suggest">
                                          <div className="col-1 m-auto close-suggest">
                                            <i className="fas fa-plane mr-3 close-suggest" />
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
                          {fld.errors.toAirport && (
                            <label className="text-danger font-weight-bold error-warning">
                              {fld.errors.toAirport}
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form date Departure-Date">
                          <div className="inputs-filed mb-2 date d-flex flex-column">
                            <i className="fal fa-calendar-alt position-absolute calender-icon" />
                            <label htmlFor="departDate">Departure</label>
                            <DatePicker
                              name="departDate"
                              id="departDate"
                              autoComplete="off"
                              dateFormat="dd-MM-yyyy"
                              onFocus={() => {
                                showList("datePicker", "0");
                              }}
                              selected={fld.departureDate}
                              onChange={(date) => departDate(date, fld.id)}
                              minDate={
                                index !== 0 &&
                                fieldsData[index - 1].departureDate !== ""
                                  ? fieldsData[index - 1].departureDate
                                  : DefaultDate
                              }
                              placeholderText="Departure Date"
                              showDisabledMonthNavigation
                              selectsStart
                            />
                            {fld.errors.departureDate && (
                              <label className="text-danger font-weight-bold error-warning">
                                {fld.errors.departureDate}
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index > 1 && (
                      <div className="col-md-1 col-sm-1 col-1 mx-auto d-flex align-items-center">
                        <div className="col-12">
                          <label />
                          <div
                            className="text-center border-0 cursor-pointer"
                            onClick={() => {
                              decFCount(fld.id);
                            }}
                          >
                            <i className="fas fa-trash-alt my-auto" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {fieldCount >= 2 && fieldCount < 5 && (
              <div className="col-md-12 px-0 mt-2">
                <label
                  onClick={incFCount}
                  className=" btn btn-primary btn-sm age-alert cursor-pointer"
                >
                  <i className="far fa-plus" /> Add Another Flight
                </label>
              </div>
            )}
            <div className="pl-0 col-md-12 d-flex mt-4 ">
              <label
                style={{ fontSize: 13 }}
                htmlFor="adult"
                className="font-weight-normal pr-2 text-xl  pax-label"
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
                value={ummrah}
              />
            </div>
            <div className="col-md-12 px-0 d-flex flex-row border-bottom py-3">
              <div className="col-md-12 col-sm-12 col-12 row d-flex px-0">
                <div className="col-md-4 text-left">
                  <div className="form date Flight-Class">
                    <div className="inputs-filed mt-2">
                      <label htmlFor="cabin">Class</label>
                      <div className="cabin-class-select">
                        <Select
                          name="cabin"
                          placeholder={"Select Cabin"}
                          className={"bookingform-select"}
                          classNamePrefix={"cabin-select"}
                          isSearchable={true}
                          onFocus={() => {
                            showList("datePicker", "0");
                          }}
                          options={[
                            { value: "Economy", label: "Economy" },
                            {
                              value: "EXECUTIVE_ECONOMY",
                              label: "Economy plus",
                            },
                            { value: "Business", label: "Business" },
                          ]}
                          onChange={(e) => {
                            handleCabinChange(e);
                          }}
                          value={{ value: Cabin, label: Cabin }}
                          // defaultValue={{ value: "Economy", label: "Economy" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 px-0 row mx-0">
                  <div className="col-md-4 col-sm-12 form Adults">
                    <div className="inputs-filed mt-10">
                      <label
                        htmlFor="adult"
                        className="font-weight-normal pax-label"
                      >
                        Adults
                      </label>
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
                          value={Adult}
                          readOnly
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
                      <label htmlFor="adult" className="text-primary age-alert">
                        *Age: 12+ Yrs
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 form Children">
                    <div className="inputs-filed mt-10">
                      <label
                        htmlFor="children"
                        className="font-weight-normal pax-label"
                      >
                        Children
                      </label>
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
                          value={Child}
                          readOnly
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
                      <label
                        htmlFor="children"
                        className="text-primary age-alert"
                      >
                        *Age: 2-11 Yrs
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 form Infants">
                    <div className="inputs-filed mt-10">
                      <label
                        htmlFor="infant"
                        className="font-weight-normal pax-label"
                      >
                        Infants
                      </label>
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
                          value={Infant}
                          readOnly
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
                      <label
                        htmlFor="infant"
                        className="text-primary age-alert"
                      >
                        *Age: 0-23 Mths
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
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
        </Modal.Body>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  SearchQuery: state.multiSearch,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ updateQuery }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MultiTrip);
