import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import InputMask from "react-input-mask";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";
import { useNavigate, Link } from "react-router-dom";

import MultiSidebar from "./MultiSidebar";
import validateinfo from "./MultiValidateInfo";
import Footer from "../../../components/Footer";
import countries from "../../../data/countries.json";
import { makeSelectMultiSearchObj } from "./selectors";
import Navigation from "../../../components/Navigation";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import { bookingRequest } from "../../NewBookingForm/Flights/Multi/actions";
import {
  TravelerParent,
  FailedBooking,
} from "../../FlightList/TravellerDetails/wrapper/TravelerDetailsStyle";
import {
  dates,
  months,
  years,
  expYears,
  titles,
  TextCapitalizeFirst,
} from "../../../helper/ConvertFunctions";

export function MultiTravellerDetails({ multiSearch, bookingRequest }) {
  const pagelocation = "Passenger Details";
  const history = useNavigate();

  const { selectedFlight, query } = multiSearch;
  const { flight_type, provider_type } =
    selectedFlight.length > 0
      ? selectedFlight[0]
      : { flight_type: "", provider_type: "" };

  const [formSubmit, setFormSubmit] = useState(false);
  const [BtnState, setBtnState] = useState(true);
  const [errors, setErrors] = useState([]);

  const bookedByErrors = errors[0];
  const PassengerErrors = errors[1];
  const [userId, setUSerID] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  // Separating Departure Date of 1st Segment and Arrival Date of Last Segment for Passenger Age Validation
  let departDate = "";
  let returnDate = "";

  if (provider_type === "travelport") {
    let firstSegment = selectedFlight[0].segments[0];
    let lastSegment =
      selectedFlight[0].segments[selectedFlight[0].segments.length - 1];

    departDate = firstSegment.DepartureTime;
    returnDate = lastSegment.ArrivalTime;
  } else if (provider_type === "hitit") {
    let firstSegment = selectedFlight[0].segments[0].segment_data;
    let lastSegment =
      selectedFlight[0].segments[selectedFlight[0].segments.length - 1]
        .segment_data;

    departDate = firstSegment.DepartureTime;
    returnDate = lastSegment.ArrivalTime;
  } else if (provider_type === "airblue") {
    let firstSegment = selectedFlight[0].segments;
    let lastSegment = selectedFlight[selectedFlight.length - 1].segments;

    departDate = firstSegment.DepartureDateTime;
    returnDate = lastSegment.ArrivalDateTime;
  }

  let formFileds = [];
  for (let index = 0; index < query.adult; index++) {
    formFileds.push({
      id: uuidv4(),
      number: index + 1,
      passenger_type: "ADT",
      issue_country: "",
      title: "",
      firstName: "",
      lastName: "",
      dob_month: "",
      dob_year: "",
      dob_day: "",
      nationality: "PK",
      cnic: "",
      passport_type: "P",
      passport_number: "",
      exp_day: "",
      exp_month: "",
      exp_year: "",
    });
  }
  for (let index = 0; index < query.children; index++) {
    formFileds.push({
      id: uuidv4(),
      number: index + 1,
      passenger_type: "CNN",
      issue_country: "",
      title: "",
      firstName: "",
      lastName: "",
      dob_month: "",
      dob_year: "",
      dob_day: "",
      nationality: "PK",
      cnic: "",
      passport_type: "P",
      passport_number: "",
      exp_day: "",
      exp_month: "",
      exp_year: "",
    });
  }
  for (let index = 0; index < query.infant; index++) {
    formFileds.push({
      id: uuidv4(),
      number: index + 1,
      passenger_type: "INF",
      issue_country: "",
      title: "",
      firstName: "",
      lastName: "",
      dob_month: "",
      dob_year: "",
      dob_day: "",
      nationality: "PK",
      cnic: "",
      passport_type: "P",
      passport_number: "",
      exp_day: "",
      exp_month: "",
      exp_year: "",
    });
  }
  const [inputFields, setInputFields] = useState(formFileds);

  const [values, setValues] = useState({
    phone: "",
    email: "",
  });

  let tempValues = { phone: values.phone, email: values.email };

  const dynamicSort = (property) => {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      let result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUSerID(user.userId);
      setUserEmail(user.email);
      setUserPhone(user.phone);
    }
  }, []);
  const segData = () => {
    if (provider_type === "travelport" || provider_type === "hitit") {
      return selectedFlight[0];
    } else if (provider_type === "airblue") {
      return selectedFlight;
    }
  };

  let FinalData = {
    booking_data: {
      user_id: userId,

      email: values.email,
      phone_number: values.phone,
      payment_method: "Bank",
      api_type: TextCapitalizeFirst(provider_type),
      adult: query.adult,
      child: query.children,
      infant: query.infant,
    },
    shipping_detail: {
      street: "2-Mohammadi Plaza, Blue Area",
      city: "Islamabad",
      state: "Islamabad",
      postal_code: "44000",
      country: "PK",
    },
    booking_detail: inputFields.sort(dynamicSort("passenger_type")),
    segmentsData: segData(),
  };

  const handleChangeInput = (id, event, field) => {
    const newInputFields = inputFields.map((i) => {
      if (field === "nationality" && flight_type !== "domestic") {
        if (id === i.id) {
          i["nationality"] = event.value;
        }
      } else {
        if (id === i.id) {
          if (field === "title") {
            i["title"] = event.value;
          } else if (field === "dob_day") {
            i["dob_day"] = event.value;
          } else if (field === "dob_month") {
            i["dob_month"] = event.value;
          } else if (field === "dob_year") {
            i["dob_year"] = event.value;
          } else if (field === "exp_day") {
            i["exp_day"] = event.value;
          } else if (field === "exp_month") {
            i["exp_month"] = event.value;
          } else if (field === "exp_year") {
            i["exp_year"] = event.value;
          } else if (event.target.name === "passport_number") {
            i[event.target.name] = event.target.value.toUpperCase();
          } else {
            i[event.target.name] = event.target.value;
          }
        }
        if (flight_type === "domestic") {
          i["nationality"] = "PK";
        }
      }

      return i;
    });
    setInputFields(newInputFields);
    setErrors(
      validateinfo(
        inputFields,
        values,
        departDate,
        returnDate,
        flight_type,
        setBtnState
      )
    );
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    tempValues = { ...tempValues, [event.target.name]: event.target.value };
    setErrors(
      validateinfo(
        inputFields,
        tempValues,
        departDate,
        returnDate,
        flight_type,
        setBtnState
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(
      validateinfo(
        inputFields,
        values,
        departDate,
        returnDate,
        flight_type,
        setBtnState
      )
    );
    if (Object.keys(errors).length === 0) {
      setFormSubmit(true);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && formSubmit) {
      bookingRequest(FinalData);
      history("/multi-flight-reservation");
    }
  }, [errors, formSubmit]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      <ErrorBoundary>
        {provider_type !== "" ? (
          <TravelerParent>
            <div className="InfoParent">
              <form onSubmit={handleSubmit}>
                <div className="heading">
                  <h2>Passenger Information</h2>
                </div>
                <hr className="separator" />
                <div className="MainAdultForm">
                  <div className="traveler-form-inner">
                    <div className="contact mb-2">
                      <h3>Contact Details</h3>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Email: </label>
                        <input
                          value={userEmail ? userEmail : values.email}
                          type="text"
                          onChange={handleChange}
                          name="email"
                          placeholder="Enter Email Address"
                        />
                        {bookedByErrors !== undefined &&
                          bookedByErrors !== null &&
                          bookedByErrors.email && (
                            <label className="warning text-danger">
                              * {bookedByErrors.email}
                            </label>
                          )}
                      </div>
                      <div className="col-md-6">
                        <label>Contact Number: </label>
                        <InputMask
                          mask="0399-9999999"
                          maskChar={null}
                          type="text"
                          onChange={handleChange}
                          value={userPhone ? userPhone : values.phone}
                          name="phone"
                          placeholder="Enter Contact Number"
                          min="11"
                          max="11"
                        />
                        {bookedByErrors !== undefined &&
                          bookedByErrors !== null &&
                          bookedByErrors.phone && (
                            <label className="warning text-danger">
                              * {bookedByErrors.phone}
                            </label>
                          )}
                      </div>
                    </div>
                    <hr className="separator" />
                    {inputFields.map((field, index) => (
                      <div key={field.id} className="PAXInfo">
                        <h3 className="mb-2">
                          Passenger{" "}
                          {field.passenger_type === "ADT"
                            ? `Adult ${field.number}`
                            : field.passenger_type === "CNN"
                            ? `Child ${field.number}`
                            : field.passenger_type === "INF"
                            ? `Infant ${field.number}`
                            : ""}
                        </h3>
                        <div className="row">
                          <div className="col-md-4">
                            <label>Title:</label>
                            <Select
                              name="title"
                              placeholder={"Title"}
                              className={"country-select"}
                              classNamePrefix={"hotel-select"}
                              options={titles(field.passenger_type)}
                              onChange={(e) => {
                                {
                                  handleChangeInput(field.id, e, "title");
                                }
                              }}
                            />
                            {PassengerErrors !== undefined &&
                              PassengerErrors !== null &&
                              typeof PassengerErrors[index].title !==
                                "undefined" && (
                                <label className="warning text-danger">
                                  * {PassengerErrors[index].title}
                                </label>
                              )}
                          </div>
                          <div className="col-md-4">
                            <label>First Name:</label>
                            <input
                              type="search"
                              onChange={(event) =>
                                handleChangeInput(field.id, event)
                              }
                              value={field.firstName}
                              name="firstName"
                              placeholder="Enter First Name"
                            />
                            {PassengerErrors !== undefined &&
                              PassengerErrors !== null &&
                              typeof PassengerErrors[index].firstName !==
                                "undefined" && (
                                <label className="warning text-danger">
                                  * {PassengerErrors[index].firstName}
                                </label>
                              )}
                          </div>
                          <div className="col-md-4">
                            <label>Last Name:</label>
                            <input
                              type="search"
                              onChange={(event) =>
                                handleChangeInput(field.id, event)
                              }
                              value={field.lastName}
                              name="lastName"
                              placeholder="Enter Last Name"
                            />
                            {PassengerErrors !== undefined &&
                              PassengerErrors !== null &&
                              typeof PassengerErrors[index].lastName !==
                                "undefined" && (
                                <label className="warning text-danger">
                                  * {PassengerErrors[index].lastName}
                                </label>
                              )}
                          </div>
                        </div>
                        <div className="row">
                          {flight_type === "international" && (
                            <div className="col-md-6">
                              <label>Nationality:</label>
                              <Select
                                name="nationality"
                                placeholder={"Select Country"}
                                className={"country-select"}
                                classNamePrefix={"hotel-select"}
                                isSearchable={true}
                                options={countries}
                                defaultValue={{
                                  value: "PK",
                                  label: "Pakistan",
                                }}
                                onChange={(e) => {
                                  {
                                    handleChangeInput(
                                      field.id,
                                      e,
                                      "nationality"
                                    );
                                  }
                                }}
                              />
                              {PassengerErrors !== undefined &&
                                PassengerErrors !== null &&
                                typeof PassengerErrors[index].nationality !==
                                  "undefined" && (
                                  <label className="warning text-danger">
                                    * {PassengerErrors[index].nationality}
                                  </label>
                                )}
                            </div>
                          )}
                          <div className="col-md-6">
                            <label>Date of Birth:</label>
                            <div className="row m-0 dates">
                              <div className="col-md-4 pl-0 pr-md-2 pr-sm-0">
                                <Select
                                  name="dob_day"
                                  placeholder={"Date"}
                                  className={"date-select"}
                                  classNamePrefix={"hotel-select"}
                                  isSearchable={true}
                                  options={dates()}
                                  onChange={(e) => {
                                    {
                                      handleChangeInput(field.id, e, "dob_day");
                                    }
                                  }}
                                />
                              </div>
                              <div className="col-md-4 pl-0 pr-md-2 pr-sm-0">
                                <Select
                                  name="dob_month"
                                  placeholder={"Month"}
                                  className={"date-select"}
                                  classNamePrefix={"hotel-select"}
                                  isSearchable={true}
                                  options={months()}
                                  onChange={(e) => {
                                    {
                                      handleChangeInput(
                                        field.id,
                                        e,
                                        "dob_month"
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <div className="col-md-4 px-0">
                                <Select
                                  name="dob_year"
                                  placeholder={"Year"}
                                  className={"date-select"}
                                  classNamePrefix={"hotel-select"}
                                  isSearchable={true}
                                  options={years()}
                                  onChange={(e) => {
                                    {
                                      handleChangeInput(
                                        field.id,
                                        e,
                                        "dob_year"
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            {PassengerErrors !== undefined &&
                              PassengerErrors !== null &&
                              typeof PassengerErrors[index].dob_month !==
                                "undefined" && (
                                <label className="warning text-danger">
                                  * {PassengerErrors[index].dob_month}
                                </label>
                              )}
                          </div>
                          {flight_type === "domestic" &&
                            field.passenger_type !== "INF" && (
                              <div className="col-md-6">
                                <label>CNIC</label>
                                <InputMask
                                  mask="99999-9999999-9"
                                  maskChar={null}
                                  type="text"
                                  onChange={(event) =>
                                    handleChangeInput(field.id, event)
                                  }
                                  value={field.cnic}
                                  name="cnic"
                                  placeholder="Enter CNIC"
                                  min="13"
                                  max="13"
                                />
                                {PassengerErrors !== undefined &&
                                  PassengerErrors !== null &&
                                  typeof PassengerErrors[index].cnic !==
                                    "undefined" && (
                                    <label className="warning text-danger">
                                      * {PassengerErrors[index].cnic}
                                    </label>
                                  )}
                              </div>
                            )}
                        </div>
                        {flight_type === "international" && (
                          <div className="row">
                            <div className="col-md-6">
                              <label>Passport Number: </label>
                              <InputMask
                                mask="*********"
                                maskChar={null}
                                type="text"
                                onChange={(event) =>
                                  handleChangeInput(field.id, event)
                                }
                                value={field.passport_number}
                                name="passport_number"
                                placeholder="Enter Passport Number"
                                min="5"
                                max="12"
                              />
                              {PassengerErrors !== undefined &&
                                PassengerErrors !== null &&
                                typeof PassengerErrors[index]
                                  .passport_number !== "undefined" && (
                                  <label className="warning text-danger">
                                    * {PassengerErrors[index].passport_number}
                                  </label>
                                )}
                            </div>
                            <div className="col-md-6">
                              <label>Passport Expiry: </label>
                              <div className="row m-0 dates">
                                <div className="col-md-4 pl-0 pr-md-2 pr-sm-0">
                                  <Select
                                    name="exp_day"
                                    placeholder={"Date"}
                                    className={"date-select"}
                                    classNamePrefix={"hotel-select"}
                                    isSearchable={true}
                                    options={dates()}
                                    onChange={(e) => {
                                      {
                                        handleChangeInput(
                                          field.id,
                                          e,
                                          "exp_day"
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-md-4 pl-0 pr-md-2 pr-sm-0">
                                  <Select
                                    name="exp_month"
                                    placeholder={"Month"}
                                    className={"date-select"}
                                    classNamePrefix={"hotel-select"}
                                    isSearchable={true}
                                    options={months()}
                                    onChange={(e) => {
                                      {
                                        handleChangeInput(
                                          field.id,
                                          e,
                                          "exp_month"
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-md-4 px-0">
                                  <Select
                                    name="exp_year"
                                    placeholder={"Year"}
                                    className={"date-select"}
                                    classNamePrefix={"hotel-select"}
                                    isSearchable={true}
                                    options={expYears()}
                                    onChange={(e) => {
                                      {
                                        handleChangeInput(
                                          field.id,
                                          e,
                                          "exp_year"
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              {PassengerErrors !== undefined &&
                                PassengerErrors !== null &&
                                typeof PassengerErrors[index].exp_year !==
                                  "undefined" && (
                                  <label className="warning text-danger">
                                    * {PassengerErrors[index].exp_year}
                                  </label>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <hr className="separator" />
                    <div className="row">
                      <button
                        className="proceed"
                        disabled={BtnState && true}
                        style={{ height: "unset", padding: "15px" }}
                      >
                        Proceed With Booking
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <MultiSidebar flight={selectedFlight} />
          </TravelerParent>
        ) : (
          <FailedBooking className="d-flex flex-column">
            <h4>Please Select the Flight Again.</h4>
            <div className="foot">
              <Link to="/">Go to Homepage</Link>
            </div>
          </FailedBooking>
        )}
      </ErrorBoundary>
      <Footer />
    </React.Fragment>
  );
}

const mapStateToProps = createStructuredSelector({
  multiSearch: makeSelectMultiSearchObj(),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ bookingRequest }, dispatch);
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MultiTravellerDetails);
