import React, { useState } from "react";
import Axios from "../../../utils/service";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const VerifyMail = () => {
  const [formData, setFormData] = useState({
    verification_code: "",
  });

  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const LOGIN_URL = "api/verify_code";
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(LOGIN_URL, formData);
      if (response.data.status !== "200") {
        setErrors(response.data.message);
      } else {
        toast("Email verification successful!");
        navigate("/sign-in");
      }
    } catch (err) {
      setErrors("");
    }
  };

  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex align-items-center justify-content-center  flex-column col-md-12"
    >
      <h4 className="text-success  my-2">
        {" "}
        please check your email for verification code .
      </h4>
      <div className="col-md-6 bg-info border rounded shadow-xl text-light p-4">
        <h4 className="text-light text-center font-bold"> Verify Email </h4>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column">
            <label htmlFor="email">Verfication Code:</label>
            <input
              className="form form-control"
              type="number"
              name="verification_code"
              id="verification_code"
              value={formData.verification_code}
              onChange={handleChange}
            />
            {errors.verification_code && (
              <p>{errors.verification_code.message}</p>
            )}
          </div>

          <div className="d-flex flex-column mt-3">
            <button className="btn btn-dark">Verify</button>
            {errors ? (
              <h5 className="text-danger bg-white text-center py-2 mt-2">
                {errors}
              </h5>
            ) : (
              ""
            )}
          </div>
          <div className="d-flex justify-content-end mt-4 ">
            <p>Haven't Received verfication code?</p>{" "}
            <button
              className=" pl-1 btn btn-primary text-light btn-sm ml-1"
              style={{ color: "#27296d", cursor: "pointer" }}
            >
              {" "}
              Resend code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VerifyMail;
