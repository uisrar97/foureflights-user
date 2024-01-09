import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetBooking } from "./wrapper/NewBookingFormStyle";
import ErrorBoundary from "./../../helper/ErrorBoundary";

const MyBooking = ({ padding }) => {
  const [PNR, setPNR] = useState("");
  const [lastName, setlastName] = useState("");
  const [formSubmit, setFormSubmit] = useState(false);
  const [bookingType, setBookingType] = useState("flight");
  const [isMulti, setIsMulti] = useState(false);

  const history = useNavigate();

  const valUpdate = (event) => {
    event.preventDefault();
    let value = event.target.value;
    let id = event.target.id;

    if (id === "pnr") {
      event.target.value = value.toUpperCase();
      setPNR(value.toUpperCase());
    } else if (id === "last_name") {
      setlastName(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (PNR.length === 6 && lastName.length >= 2) {
      setFormSubmit(true);
    }
  };

  const radioHandler = (e) => {
    setBookingType(e.target.value);
  };

  const multiHandler = () => {
    setIsMulti(!isMulti);
  };

  useEffect(() => {
    if (PNR.length === 6 && lastName.length >= 2 && formSubmit === true) {
      if (bookingType === "flight") {
        if (isMulti) {
          history({
            pathname: `/get-multi-flight-booking/pnr=${PNR}&last_name=${lastName}&pre=200`,
          });
        } else {
          history({
            pathname: `/get-flight-booking/pnr=${PNR}&last_name=${lastName}&pre=200`,
          });
        }
      } else if (bookingType === "hotel") {
        history({
          pathname: `/get-hotel-booking/cnr=${PNR}&last_name=${lastName}`,
        });
      }
    }
  }, [PNR, lastName, formSubmit, bookingType, history]);

  return (
    <ErrorBoundary>
      <GetBooking
        style={{ backgroundColor: "#00000025", height: "235px" }}
        className="booking-form-child border-bottom  border-dark rounded-lg"
      >
        <div className="row m-0 flight-radio-btns d-flex justify-content-center">
          <div
            className="btn-group my-2"
            role="group"
            aria-label="Basic example"
          >
            <button
              type="button"
              className={
                bookingType === "flight"
                  ? "btn btn-selected rounded-0"
                  : "btn btn-trip rounded-0"
              }
              value="flight"
              onClick={radioHandler}
            >
              Flight
            </button>
            <button
              type="button"
              className={
                bookingType === "hotel"
                  ? "btn btn-selected rounded-0"
                  : "btn btn-trip rounded-0"
              }
              value="hotel"
              onClick={radioHandler}
            >
              Hotel
            </button>
          </div>
        </div>
        {bookingType === "flight" ? (
          <>
            <div className="d-flex flex-lg-row flex-column mt-4">
              <div className="row col-md-4 m-0">
                <div className="inputs-filed w-100 d-flex flex-column  px-8">
                  {bookingType === "flight" ? (
                    <i
                      className={
                        padding
                          ? "fa fa-plane navlink-plane-icon"
                          : "fa fa-plane plane-icons"
                      }
                      aria-hidden="true"
                    />
                  ) : (
                    <i
                      className={
                        padding
                          ? "fas fa-hotel navlink-plane-icon"
                          : "fas fa-hotel plane-icons"
                      }
                      aria-hidden="true"
                    />
                  )}
                  <label className="text-light" htmlFor="pnr">
                    {bookingType === "flight" ? "PNR: " : "CNR: "}
                  </label>
                  <input
                    className=""
                    type="search"
                    id="pnr"
                    name="pnr"
                    placeholder={
                      bookingType === "flight"
                        ? "Enter Foure PNR here"
                        : "Enter your CNR here"
                    }
                    minLength="6"
                    maxLength="6"
                    onChange={valUpdate}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="row col-md-5 m-0">
                <div className="inputs-filed w-100 d-flex flex-column  px-8">
                  <i
                    className={
                      padding
                        ? " fas fa-user navlink-plane-icon"
                        : "fas fa-user plane-icons"
                    }
                    aria-hidden="true"
                  />
                  <label className="text-white" htmlFor="last_name">
                    Last Name:{" "}
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Enter your Last Name here"
                    onChange={valUpdate}
                  />
                </div>
              </div>
              <div className=" m-0 py-2 px-3 col-md-3  d-flex justify-content-end align-items-center">
                <div className="col-1 p-0 ">
                  <label htmlFor=""></label>
                  <input
                    type="checkbox"
                    className="mr-2"
                    id="multi-trip"
                    name="multi-trip"
                    onClick={multiHandler}
                    style={{ width: "unset", height: "unset" }}
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="multi-trip"
                    className="font-weight-bold ml-2 pt-4 text-sm text-light"
                    style={{ marginBottom: "unset", fontSize: 13 }}
                  >
                    Check if Flight Is MultiTrip
                  </label>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="inputs-filed mt-3">
                <button
                  type="submit"
                  id="submit"
                  className="main-btn btn-filled get-booking-button"
                  onClick={handleSubmit}
                  disabled={
                    PNR.length < 6 || lastName.length < 2 ? true : false
                  }
                >
                  Get Booking
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className="New-Booking-Coming-Soon d-flex"
            style={{ height: "184px" }}
          >
            <img alt="Coming Soon" src="/com.jpg" />
          </div>
        )}
      </GetBooking>
    </ErrorBoundary>
  );
};

export default MyBooking;
