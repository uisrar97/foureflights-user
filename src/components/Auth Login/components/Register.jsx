import React, { useState } from "react";
import Axios from "../../../utils/service";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const [error, setError] = useState({});
  const [errors, setErrors] = useState("");
  const REGISTER_URL = "api/signup";
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const validateForm = () => {
    let formErrors = {};
    if (!formData.first_name) {
      formErrors.first_name = "First Name is required";
    }
    if (!formData.last_name) {
      formErrors.last_name = "Last Name is required";
    }
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      formErrors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phone_number) {
      formErrors.phone_number = "Please provide valid phone number";
    } else if (
      !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
        formData.phone_number
      )
    ) {
      formErrors.phone_number = "phone number is invalid";
    }
    setError(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await Axios.post(
          REGISTER_URL,
          formData,

          {
            headers: { "Content-Type": "application/json" },
            withCredentials: false,
          }
        );
        if (response.data.status !== "200") {
          setErrors(response.data.message);
        } else {
          //   localStorage.setItem("user", JSON.stringify(response.data.data));
          setErrors(response.data.message);
          navigate("/mail-verification");
        }
      } catch (err) {
        if (!err?.response) {
          setErrors("No Server Response");
        } else if (err.response?.status === 409) {
          setErrors("Username Taken");
        } else {
          setErrors("Registration Failed");
        }
      }
    }
  };

  return (
    <form
      style={{ height: "100vh", backgroundColor: "#f1f1f1" }}
      className="d-flex justify-content-center align-items-center "
      onSubmit={handleSubmit}
    >
      <div className="container  bg-info border rounded pt-4 text-light shadow-lg ">
        <div className="  row col-md-12 py-2 d-flex flex-column   justify-content-center">
          <h3 className="font-weight-bold text-light  text-center ">Sign Up</h3>
          <div className=" d-flex justify-content-center align-items-center ">
            {errors ? (
              <div className="w-50 d-flex justify-content-center bg-light border rounded ">
                <h5 className="text-danger  text-center py-2 mt-2">{errors}</h5>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className=" col-md-12     ">
          <div style={{ paddingRight: 0 }} className="row col-md-12">
            <div className="col-md-6">
              <label htmlFor="first_name">First Name:</label>
              <input
                className="form form-control"
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
              {error.first_name && (
                <div className="error text-danger  px-2 m-1">
                  {error.first_name}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="last_name">Last Name:</label>
              <input
                className="form form-control"
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
              {error.last_name && (
                <div className="error text-danger  px-2 m-1">
                  {error.last_name}
                </div>
              )}
            </div>
          </div>
          <div style={{ paddingRight: 0 }} className="row col-md-12 mt-2">
            <div className="col-md-6">
              <label htmlFor="email">Email:</label>
              <input
                className="form form-control"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {error.email && (
                <div className="error text-danger  px-2 m-1">{error.email}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="password">Password:</label>
              <input
                className="form form-control"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {error.password && (
                <div className="error text-danger  px-2 m-1">
                  {error.password}
                </div>
              )}
            </div>
          </div>
          <div
            style={{ paddingRight: 0, marginRight: "-23px" }}
            className="row col-md-12 mt-2"
          >
            <div className="col-md-6">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                className="form form-control"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {error.confirmPassword && (
                <div className="error text-danger  px-2 m-1">
                  {error.confirmPassword}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="phone_number">Phone Number:</label>
              <input
                className="form form-control"
                type="phone_number"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
              {error.phone_number && (
                <div className="error text-danger  px-2 m-1">
                  {error.phone_number}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-12 row">
          <div className="col-md-12 d-flex justify-content-center mt-3">
            <button type="submit" className="btn bg-light px-4 my-2">
              Register
            </button>
          </div>
          <div className="col-md-12 my-2">
            {" "}
            <div className="d-flex justify-content-end  mt-2 ">
              <p>Already have an Account ?</p>{" "}
              <Link to={"/sign-in"}>
                <span
                  className="font-bold bold pl-1 "
                  style={{ color: "#27296d", cursor: "pointer" }}
                >
                  {" "}
                  <u className="">Sign In</u>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
