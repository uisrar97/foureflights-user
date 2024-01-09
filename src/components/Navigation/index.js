/**
 *
 * Navigation
 *
 */

import React, { Fragment, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import HeaderComponent from "../../helper/Navhelp";
import classNames from "classnames";
import { useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { CAvatar } from "@coreui/react";

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [breakpoint, setBreakpoint] = useState("breakpoint-on");
  const [stickyHeader, settickyHeader] = useState("sticky-active");
  const [navmethod, setNavmethod] = useState("");
  const [toggleNav, setToggleNav] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  // const breakpoint = this.state.isMobile ? "breakpoint-on" : "";
  // const stickyHeader = this.state.isTop ? "sticky-active" : "";
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName("");
    navigate("/");
  };
  return (
    <Fragment>
      {/*====== HEADER START ======*/}

      {/* Desktop Header */}
      <header className={`desktop-header sticky-header py-2 ${stickyHeader}`}>
        <div
          className={`d-flex nav-container align-items-center ${breakpoint}`}
        >
          <div className="col-md-2 col-sm-2" style={{ maxWidth: "11%" }}>
            <div className="site-logo">
              <Link to="/">
                <img
                  src="/logo.webp"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = "/no-image.png";
                  }}
                  alt="logo"
                  height="48"
                />
              </Link>
            </div>
          </div>
          <div className="col-md-5 col-sm-5">
            <div className="menu-items">
              <ul>
                <li className="menu-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="menu-item">
                  <Link to="/tours">Tours</Link>
                </li>
                <li className="menu-item">
                  <Link to="/group-travel">Group Travel</Link>
                </li>
                <li className="menu-item">
                  <Link to="/contact-us">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-5 col-sm-5 header-info row">
            <div className="col-md-7 col-sm-7 row m-0 p-0 pr-4 justify-content-end">
              <i className="header-icon my-auto mr-2 fal fa-envelope" />
              <div className="d-flex flex-column">
                <span>Email Address</span>
                <Link to="mailto:info@foureflights.com">
                  <p className="title">info@foureflights.com</p>
                </Link>
              </div>
            </div>
            {/* <div className="col-md-5 col-sm-5 row m-0 p-0 justify-content-end">
                <i className="header-icon my-auto mr-2 fal fa-phone" />
                <div className='d-flex flex-column'>
                  <span>Phone Number</span>
                  <Link to="tel:+923205487700">
                    <p className="title">+92 320 5487700</p>
                  </Link>
                </div>
              </div> */}
            <div className="col-md-5 col-sm-5 row m-0 p-0 justify-content-end">
              {userName ? (
                <div className="d-flex ">
                  <Dropdown className="">
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      <img
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "15px",
                        }}
                        src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                        alt=""
                      />
                      <span className="ml-1">
                        {" "}
                        {userName.firstName + " " + userName.lastName}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <Link to={"/my-booking"}>My Bookings </Link>
                      </Dropdown.Item>

                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div>
                  <div>
                    <Link to={"/sign-in"}>
                      <button className="btn btn-light ">
                        {" "}
                        <span className="">
                          <svg
                            viewBox="64 64 896 896"
                            focusable="false"
                            data-icon="user"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                          </svg>
                        </span>{" "}
                        <span className="pb-1"> Sign In</span>
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className={`mobile-header sticky-header ${stickyHeader}`}>
        <div
          className={`d-flex nav-container justify-content-between align-items-center ${breakpoint}`}
        >
          <div className="site-logo">
            <Link to="/">
              <img
                src="/logo.webp"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "/no-image.png";
                }}
                alt="logo"
                height="48"
              />
            </Link>
          </div>
          <div
            className={classNames("navbar-toggler", {
              active: navmethod,
            })}
            onClick={() => setToggleNav(true)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </header>

      {navmethod && toggleNav && (
        <header>
          <div className="mobile-sidebar nav-container d-flex align-items-center justify-content-between breakpoint-on">
            <div className="nav-menu d-lg-flex align-items-center menu-on">
              <div className="navbar-close" onClick={() => setToggleNav(true)}>
                <div className="cross-wrap">
                  <span className="top" />
                  <span className="bottom" />
                </div>
              </div>
              <div className="menu-items">
                <ul>
                  <li className="menu-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/tours">Tours</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/group-travel">Group Travel</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
      )}
      {/*====== HEADER END ======*/}
    </Fragment>
  );
};

export default Navigation;
