/**
 *
 * TravellerDetails
 *
 */
import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import Select from "react-select";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";
import { bookingRequest } from "./actions";
import { v4 as uuidv4 } from "uuid";
import { TravelerParent, FailedBooking } from "./wrapper/TravelerDetailsStyle";
import { useInjectSaga } from "../../../utils/injectSaga";
import { useInjectReducer } from "../../../utils/injectReducer";
import {
  makeSelectTravellerRouter,
  makeSelectSingleFlightDetails,
  makeSelectTravellerDetails,
} from "./selectors";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import reducer from "./reducer";
import saga from "./saga";
import Navigation from "../../../components/Navigation";
import Footer from "./../../../components/Footer";
import validateinfo from "./validateInfo";
import TravelportSidebar from "./TravelportSidebar";
import HititSidebar from "./HititSidebar";
import AirblueSidebar from "./AirblueSidebar";
import AirSialSidebar from "./AirSialSidebar";
import countries from "./../../../data/countries.json";
import InputMask from "react-input-mask";
import {
  dates,
  months,
  years,
  expYears,
  titles,
} from "../../../helper/ConvertFunctions";

export function TravellerDetails({
  selectedFlight,
  queryString,
  bookingRequest,
}) {
  useInjectReducer({ key: "travellerDetails", reducer });
  useInjectSaga({ key: "travellerDetails", saga });

  let que = {
    adult: !selectedFlight.bookingResponse
      ? selectedFlight.query.adult
      : queryString.travelerCount.numAdult,
    cabin: !selectedFlight.bookingResponse
      ? selectedFlight.query.cabin
      : queryString.cabinClass.label,
    children: !selectedFlight.bookingResponse
      ? selectedFlight.query.children
      : queryString.travelerCount.numChild,
    departDate: !selectedFlight.bookingResponse
      ? selectedFlight.query.departDate
      : queryString.legs[0].departureDate,
    from: !selectedFlight.bookingResponse
      ? selectedFlight.query.from
      : queryString.legs[0].origin.city,
    infant: !selectedFlight.bookingResponse
      ? selectedFlight.query.infant
      : queryString.travelerCount.numInfant,
    returnDate: !selectedFlight.bookingResponse
      ? selectedFlight.query.returnDate
      : queryString.legs[0].returnDate,
    to: !selectedFlight.bookingResponse
      ? selectedFlight.query.to
      : queryString.legs[0].destination.city,
  };

  let providerType = "";
  let flightType = "";

  if (selectedFlight.singleFlight) {
    const { provider_type, flight_type } = selectedFlight.singleFlight[0];
    providerType = provider_type;
    flightType = flight_type;
  }

  const pagelocation = "Passenger Details";
  let form = que;
  const [formSubmit, setFormSubmit] = useState(false);
  const [errors, setErrors] = useState([]);
  const [BtnState, setBtnState] = useState(true);
  const history = useNavigate();
  const [userId, setUSerID] = useState(0);
  const round = que.returnDate === "undefined" ? false : true;
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  let formFileds = [];
  for (let index = 0; index < form.adult; index++) {
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
  for (let index = 0; index < form.children; index++) {
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
  for (let index = 0; index < form.infant; index++) {
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
    if (
      selectedFlight.singleFlight &&
      (selectedFlight.singleFlight[0].provider_type === "travelport" ||
        selectedFlight.singleFlight[0].provider_type === "hitit" ||
        (selectedFlight.singleFlight[0].provider_type === "airsial" &&
          round === false) ||
        (selectedFlight.singleFlight[0].provider_type === "airblue" &&
          round === false))
    ) {
      return selectedFlight.singleFlight[0];
    } else if (
      selectedFlight.singleFlight &&
      (selectedFlight.singleFlight[0].provider_type === "airblue" ||
        selectedFlight.singleFlight[0].provider_type === "airsial") &&
      round === true
    ) {
      return selectedFlight.singleFlight;
    }
  };
  let FinalData = {
    booking_data: {
      user_id: userId,
      email: values.email,
      phone_number: values.phone,
      payment_method: "Bank",
      api_type: selectedFlight.singleFlight
        ? selectedFlight.singleFlight[0].provider_type.charAt(0).toUpperCase() +
          selectedFlight.singleFlight[0].provider_type.slice(1)
        : "",
      adult: form.adult,
      child: form.children,
      infant: form.infant,
    },
    shipping_detail: {
      street: "street 14",
      city: "Islamabad",
      state: "ABC",
      postal_code: "44000",
      country: "PK",
    },
    booking_detail: inputFields.sort(dynamicSort("passenger_type")),
    segmentsData: segData(),
  };
  const handleChangeInput = (id, event, field) => {
    const newInputFields = inputFields.map((i) => {
      if (field === "nationality" && flightType !== "domestic") {
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
        // if (id === i.id && event.target.name === 'nationality' && flightType !== 'domestic')
        // {
        //   i['issue_country'] = event.target.value;
        // }
        if (flightType === "domestic") {
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
        que.departDate,
        que.returnDate,
        flightType,
        providerType,
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
        que.departDate,
        que.returnDate,
        flightType,
        providerType,
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
        que.departDate,
        que.returnDate,
        flightType,
        providerType,
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
      history("/flight-reservation");
    }
  }, [errors, formSubmit]);

  const bookedByErrors = errors[0];
  const PassengerErrors = errors[1];

  const sidebar = () => {
    if (providerType === "travelport") {
      return (
        <TravelportSidebar
          flight={selectedFlight.singleFlight[0]}
          query={selectedFlight.query}
        />
      );
    } else if (providerType === "hitit") {
      return <HititSidebar flight={selectedFlight.singleFlight[0]} />;
    } else if (providerType === "airblue") {
      return (
        <AirblueSidebar
          flight={selectedFlight.singleFlight}
          query={selectedFlight.query}
        />
      );
    } else if (providerType === "airsial") {
      return (
        <AirSialSidebar
          flight={selectedFlight.singleFlight}
          query={selectedFlight.query}
        />
      );
    }
  };
  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      <ErrorBoundary>
        {providerType !== "" ? (
          <TravelerParent>
            <div className="InfoParent ml-0" style={{ marginTop: "48px" }}>
              <form onSubmit={handleSubmit}>
                <div className="heading">
                  <h2>Passenger Information</h2>
                </div>
                <hr className="separator" />
                <div className="MainAdultForm">
                  <div className="traveler-form-inner" onSubmit={handleSubmit}>
                    {/* PAX Info Div Start */}
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
                              type="text"
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
                              type="text"
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
                          {flightType === "international" && (
                            <div
                              className={
                                flightType === "international" && "col-md-6"
                              }
                            >
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
                          <div className={"col-md-6"}>
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
                          {flightType === "domestic" &&
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
                        {flightType === "international" && (
                          <div className="row">
                            <div className="col-md-6">
                              <label>Passport Number: </label>
                              <InputMask
                                mask="************"
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
                      <button className="proceed" disabled={BtnState && true}>
                        Proceed With Booking
                      </button>
                    </div>
                  </div>
                </div>
                {/* PAX Info Div End */}
              </form>
            </div>
            <div style={{ marginTop: "48px" }}> {sidebar()}</div>
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
  travellerDetails: makeSelectTravellerDetails(),
  queryString: makeSelectTravellerRouter(),
  selectedFlight: makeSelectSingleFlightDetails(),
});

// const mapStateToProps = state => {
//   return {
//     queryString : state.router,
//   };
// }

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ bookingRequest }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TravellerDetails);
