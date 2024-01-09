import React, { useState } from "react";
import Axios from "../../../utils/service";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const LOGIN_URL = "admin/admin-login";
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(LOGIN_URL, formData);
      if (response.data.status !== "200") {
        if (response.data.status === "2000") {
          setErrors(response.data.message);
          navigate("/mail-verification");
        } else setErrors(response.data.message);
      } else {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setErrors(response.data.message);
        navigate("/");
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
      <div className="col-md-6 bg-info border rounded shadow-xl text-light p-4">
        <h4 className="text-light text-center font-bold"> Login </h4>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column">
            <label htmlFor="email">Email</label>
            <input
              className="form form-control"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="d-flex flex-column mt-2">
            <label htmlFor="password">Password</label>
            <input
              className="form form-control"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p>{errors.password.message} </p>}
          </div>
          <div className="d-flex flex-column mt-3">
            <button className="btn btn-dark">Submit</button>
            {errors ? (
              <h5 className="text-danger bg-white text-center py-2 mt-2">
                {errors}
              </h5>
            ) : (
              ""
            )}
          </div>
          <div className="d-flex justify-content-end mt-2 ">
            <p>dont have an Account ?</p>{" "}
            <Link to={"/sign-up"}>
              <span
                className="font-bold bold pl-1 "
                style={{ color: "#27296d", cursor: "pointer" }}
              >
                {" "}
                Sign up
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
