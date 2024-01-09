/**
 *
 * HotelBooking
 *
 */

import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";
import { hotelBookingRequest } from "./actions";
import { useInjectSaga } from "../../../utils/injectSaga";
import { useInjectReducer } from "../../../utils/injectReducer";
import { useNavigate, useParams } from "react-router-dom";
import makeSelectHotelBooking from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import InputMask from "react-input-mask";
import ErrorBoundary from "../../../helper/ErrorBoundary";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import HotelBookingSidebar from "./HotelBookingSidebar";
import { TravelerParent, FailedBooking } from "../wrapper/HotelListStyle";
import Select from "react-select";
import countries from "../../../data/countries.json";
import validateInfo from "./validateInfo";
import {
  date_convert,
  dates,
  months,
  years,
  expYears,
  titles,
} from "../../../helper/ConvertFunctions";

export function HotelBooking({ hotelBooking, hotelBookingRequest }) {
  useInjectReducer({ key: "hotelBooking", reducer });
  useInjectSaga({ key: "hotelBooking", saga });

  const pagelocation = "Hotel Customer Details";
  const params = useParams();
  const history = useNavigate();

  const { roomsList, loading } = hotelBooking[0];
  const { HotelSearchQuery } = hotelBooking[1];

  const [BtnState, setBtnState] = useState(false);
  const [validErrors, setValidErrors] = useState({});
  const [custEmail, setCustEmail] = useState("");
  const [custContact, setCustContact] = useState("");
  const [custTitle, setCustTitle] = useState("");
  const [custFName, setCustFName] = useState("");
  const [custLName, setCustLName] = useState("");
  const [custNationality, setCustNationality] = useState("");
  const [custDOBDay, setCustDOBDay] = useState("");
  const [custDOBMonth, setCustDOBMonth] = useState("");
  const [custDOBYear, setCustDOBYear] = useState("");
  const [custCNIC, setCustCNIC] = useState("");
  const [custPassport, setCustPassport] = useState("");
  const [custExpDay, setCustExpDay] = useState("");
  const [custExpMonth, setCustExpMonth] = useState("");
  const [custExpYear, setCustExpYear] = useState("");
  const [reqData, setReqData] = useState({});
  const [submitReq, setSubmitReq] = useState(false);

  const handleSubmit = () => {
    const userObj = {
      email: custEmail,
      contact: custContact,
      title: custTitle,
      fName: custFName,
      lName: custLName,
      nationality:
        typeof custNationality.value === "undefined"
          ? "PK"
          : custNationality.value,
      DOB: `${custDOBDay.value}-${custDOBMonth.value}-${custDOBYear.value}`,
      cnic:
        custCNIC !== "_____-_______-_" &&
        (custNationality.value !== "" || custNationality.value === "PK")
          ? custCNIC
          : "",
      passport: custNationality.value !== "PK" ? custPassport : "",
      passportExpiry:
        typeof custExpDay.value !== "undefined" &&
        typeof custExpMonth.value !== "undefined" &&
        typeof custExpYear.value !== "undefined" &&
        (typeof custNationality.value === "undefined" ||
          typeof custNationality.value !== "PK")
          ? `${custExpDay.value}-${custExpMonth.value}-${custExpYear.value}`
          : "",
    };

    const searchQuery = {
      checkin: date_convert(HotelSearchQuery.checkin).replaceAll(" ", "-"),
      checkout: date_convert(HotelSearchQuery.checkout).replaceAll(" ", "-"),
      sName: HotelSearchQuery.sName,
      sector: HotelSearchQuery.sector,
    };

    const FinalData = {
      customerData: userObj,
      rooms: roomsList.selectedRoom,
      totalPrice: roomsList.totalPrice,
      searchQuery: searchQuery,
      hotelName: atob(params.code),
      vendor_id: roomsList.vendorID,
    };
    setReqData(FinalData);
    setSubmitReq(true);
  };

  useEffect(() => {
    if (submitReq && reqData !== {}) {
      hotelBookingRequest(reqData);
      history("/hotel-confirmation/msg=confirm");
    }
    if (
      custEmail ||
      custContact ||
      custTitle ||
      custFName ||
      custLName ||
      custNationality ||
      custDOBDay ||
      custDOBMonth ||
      custDOBYear ||
      custCNIC ||
      custPassport ||
      custExpDay ||
      custExpMonth ||
      custExpYear
    ) {
      setValidErrors(
        validateInfo(
          custEmail,
          custContact,
          custTitle,
          custFName,
          custLName,
          custNationality,
          custDOBDay,
          custDOBMonth,
          custDOBYear,
          date_convert(HotelSearchQuery.checkout).replaceAll(" ", "-"),
          custCNIC,
          custPassport,
          custExpDay,
          custExpMonth,
          custExpYear,
          setBtnState
        )
      );
    }
  }, [
    submitReq,
    custEmail,
    custContact,
    custTitle,
    custFName,
    custLName,
    custNationality,
    custDOBDay,
    custDOBMonth,
    custDOBYear,
    custCNIC,
    custPassport,
    custExpDay,
    custExpMonth,
    custExpYear,
  ]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      <ErrorBoundary>
        {!loading ? (
          <TravelerParent>
            <HotelBookingSidebar
              rooms={roomsList}
              search={HotelSearchQuery}
              hotel={atob(params.code)}
            />
            <div className="InfoParent">
              <div className="heading">
                <h2>Customer Information</h2>
              </div>
              <hr className="separator" />
              <div className="MainAdultForm">
                <div className="traveler-form-inner">
                  {/* PAX Info Div Start */}
                  <div className="contact mb-2">
                    <h3>Contact Details</h3>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label>Email: </label>
                      <input
                        type="text"
                        onChange={(e) => {
                          setCustEmail(e.target.value);
                        }}
                        value={custEmail}
                        name="email"
                        placeholder="Enter Email Address"
                      />
                      {validErrors !== null && validErrors.email && (
                        <label className="warning text-danger">
                          * {validErrors.email}
                        </label>
                      )}
                    </div>
                    <div className="col-md-6 mb-2">
                      <label>Contact Number: </label>
                      <InputMask
                        mask="0399-9999999"
                        maskChar={null}
                        type="text"
                        onChange={(e) => {
                          setCustContact(e.target.value);
                        }}
                        value={custContact}
                        name="phone"
                        placeholder="Enter Contact Number"
                        min="11"
                        max="11"
                      />
                      {validErrors !== null && validErrors.phone && (
                        <label className="warning text-danger">
                          * {validErrors.phone}
                        </label>
                      )}
                    </div>
                  </div>
                  <hr className="separator" />
                  <div className="PAXInfo">
                    <h3 className="mb-2">Customer Details</h3>
                    <div className="row">
                      <div className="col-md-4 mb-2">
                        <label>Title:</label>
                        <Select
                          name="title"
                          placeholder={"Title"}
                          className={"country-select"}
                          classNamePrefix={"hotel-select"}
                          options={titles("ADT")}
                          onChange={(e) => {
                            {
                              setCustTitle(e.value);
                            }
                          }}
                        />
                        {validErrors !== null && validErrors.title && (
                          <label className="warning text-danger">
                            * {validErrors.title}
                          </label>
                        )}
                      </div>
                      <div className="col-md-4 mb-2">
                        <label>First Name:</label>
                        <input
                          type="text"
                          onChange={(e) => {
                            e.target.value.match("^[a-zA-Z ]*$") !== null &&
                              setCustFName(e.target.value);
                          }}
                          value={custFName}
                          name="firstName"
                          placeholder="Enter First Name"
                        />
                        {validErrors !== null && validErrors.fname && (
                          <label className="warning text-danger">
                            * {validErrors.fname}
                          </label>
                        )}
                      </div>
                      <div className="col-md-4 mb-2">
                        <label>Last Name:</label>
                        <input
                          type="text"
                          onChange={(e) => {
                            e.target.value.match("^[a-zA-Z ]*$") !== null &&
                              setCustLName(e.target.value);
                          }}
                          value={custLName}
                          name="lastName"
                          placeholder="Enter Last Name"
                        />
                        {validErrors !== null && validErrors.lname && (
                          <label className="warning text-danger">
                            * {validErrors.lname}
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label>Nationality:</label>
                        <Select
                          name="nation"
                          placeholder={"Select Country"}
                          className={"country-select"}
                          classNamePrefix={"hotel-select"}
                          isSearchable={true}
                          options={countries}
                          onChange={(e) => {
                            {
                              setCustNationality(e);
                            }
                          }}
                          defaultValue={{ value: "PK", label: "Pakistan" }}
                        />
                        {validErrors !== null && validErrors.nationality && (
                          <label className="warning text-danger">
                            * {validErrors.nationality}
                          </label>
                        )}
                      </div>
                      <div className="col-md-6 mb-2">
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
                                  setCustDOBDay(e);
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
                                  setCustDOBMonth(e);
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
                                  setCustDOBYear(e);
                                }
                              }}
                            />
                          </div>
                        </div>
                        {validErrors !== null && validErrors.dob && (
                          <label className="warning text-danger">
                            * {validErrors.dob}
                          </label>
                        )}
                      </div>
                      {((typeof custNationality === "string" &&
                        custNationality.length === 0) ||
                        custNationality.label === "Pakistan") && (
                        <div className="col-md-4 mb-2">
                          <label>CNIC</label>
                          <InputMask
                            mask="99999-9999999-9"
                            maskChar={null}
                            type="text"
                            value={custCNIC}
                            onChange={(e) => setCustCNIC(e.target.value)}
                            name="cnic"
                            placeholder="Enter CNIC"
                            min="13"
                            max="13"
                          />
                          {validErrors !== null && validErrors.cnic && (
                            <label className="warning text-danger">
                              * {validErrors.cnic}
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                    {typeof custNationality !== "string" &&
                      custNationality.length !== 0 &&
                      custNationality.label !== "Pakistan" &&
                      custNationality.label !== "Nationality" && (
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <label>Passport Number: </label>
                            {/* <InputMask mask="*********" type="text" value={custPassport} onChange={e => setCustPassport(e.target.value)}  name="passport_number" placeholder="Enter Passport Number" min='9' max='9' /> */}
                            <InputMask
                              mask="************"
                              maskChar={null}
                              type="text"
                              value={custPassport}
                              onChange={(e) =>
                                setCustPassport(e.target.value.toUpperCase())
                              }
                              name="passport_number"
                              placeholder="Enter Passport Number"
                              min="5"
                              max="12"
                            />
                            {validErrors !== null && validErrors.passport && (
                              <label className="warning text-danger">
                                * {validErrors.passport}
                              </label>
                            )}
                          </div>
                          <div className="col-md-6 mb-2">
                            <label>Passport Expiry: </label>
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
                                      setCustExpDay(e);
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
                                      setCustExpMonth(e);
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
                                  options={expYears()}
                                  onChange={(e) => {
                                    {
                                      setCustExpYear(e);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            {validErrors !== null && validErrors.passExp && (
                              <label className="warning text-danger">
                                * {validErrors.passExp}
                              </label>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                  <hr className="separator" />
                  <div className="row">
                    <button
                      className="proceed"
                      onClick={handleSubmit}
                      disabled={BtnState ? "" : "disabled"}
                    >
                      Proceed With Booking
                    </button>
                  </div>
                </div>
              </div>
              {/* PAX Info Div End */}
            </div>
          </TravelerParent>
        ) : (
          <FailedBooking className="d-flex flex-column text-center p-5 mx-3 my-5 bg-white">
            <h3>Please Select Your Booking Again.</h3>
            <div className="foot mt-3">
              <Link
                className="btn btn-primary"
                to="#"
                onClick={() => history(-1)}
              >
                Go to Back
              </Link>
            </div>
          </FailedBooking>
        )}
      </ErrorBoundary>
      <Footer />
    </React.Fragment>
  );
}

// HotelBooking.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  hotelBooking: makeSelectHotelBooking(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ hotelBookingRequest }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(HotelBooking);
