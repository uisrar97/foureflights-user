/**
 *
 * App.js
 *
 * This element is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "../HomePage/Loadable";
import NotFoundPage from "../NotFoundPage/Loadable";
import Tours from "../NavLinks/Tours";
import GroupTravel from "../NavLinks/GroupTravel";
import CheapFlights from "../NavLinks/CheapFlightFinder";
import PaymentOption from "../NavLinks/PaymentOption";
import VisaAssistance from "../NavLinks/VisaAssistance";
import RefundApplications from "../NavLinks/RefundApplications";
import TermsConditions from "../NavLinks/Terms";
import ModifyBooking from "../NavLinks/ModifyBooking";
import CheapHotels from "../NavLinks/CheapHotels";
import UmrahPackages from "../NavLinks/UmrahPackages";
import TravelInsurance from "../NavLinks/TravelInsurance";
import FoureRental from "../NavLinks/FoureRental";
import FoureTours from "../NavLinks/FoureTours";
import BeforeYouFly from "../NavLinks/BeforeYouFly";
import About from "../NavLinks/About";
import Contact from "../NavLinks/Contact";
import FlightList from "../FlightList";
import MultiFlightList from "../MultiFlightList";
import FlightDetailsView from "../FlightList/FlightDetailsView";
import TravellerDetails from "../FlightList/TravellerDetails";
import MultiTravellerDetails from "../MultiFlightList/MultiTravellerDetails";
import MultiFlightBooking from "../MultiFlightList/MultiFlightBooking";
import PaymentConfirmation from "../FlightList/PaymentConfirmation";
import GetFlightBooking from "../GetBookingPnr";
import GetMultiBooking from "../MultiFlightList/GetMultiBooking";
import HotelsList from "../HotelsList";
import HotelDetailView from "../HotelsList/HotelDetailView";
import HotelBooking from "../HotelsList/HotelBooking";
import HotelBookingConfirmation from "../HotelsList/HotelBookingConfirmation";
import GetHotelBooking from "../GetBookingCnr";

// Css
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/magnific-popup/dist/magnific-popup.css";
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../assets/css/animate.min.css";
import "../../assets/css/font-awesome.min.css";
import "../../assets/css/flaticon.css";
import "../../assets/css/default.css";
import "../../assets/css/style.css";
import "../../assets/css/index.css";
import Reservations from "../FlightList/PaymentConfirmation/component/Reservations";
import Login from "../../components/Auth Login/components/Login";
import Register from "../../components/Auth Login/components/Register";
import MyBooking from "../../components/myBooking/MyBooking";
import VerifyMail from "../../components/Auth Login/components/VerifyMail";
export default function Appdata() {
  return (
    <Router>
      <Routes>
        {/* Header Links */}
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/tours" element={<Tours />} />
        <Route exact path="/group-travel" element={<GroupTravel />} />
        {/* Body Links */}
        <Route exact path="/sign-in" element={<Login />}>
          {" "}
        </Route>
        <Route exact path="/sign-up" element={<Register />}></Route>{" "}
        <Route exact path="/flight-list/:from" element={<FlightList />} />
        <Route exact path="/my-booking" element={<MyBooking />} />
        <Route exact path="/mail-verification" element={<VerifyMail />} />
        <Route
          exact
          path="/multi-flight-list/:from"
          element={<MultiFlightList />}
        />
        <Route
          exact
          path="/flight-details-view"
          element={<FlightDetailsView />}
        />
        <Route exact path="/traveller" element={<TravellerDetails />} />
        <Route
          exact
          path="/multi-flight-traveller"
          element={<MultiTravellerDetails />}
        />
        <Route
          exact
          path="/multi-flight-reservation"
          element={<MultiFlightBooking />}
        />
        <Route
          exact
          path="/flight-reservation"
          element={<PaymentConfirmation />}
        />
        <Route
          exact
          path="/get-flight-booking/:pnr"
          element={<GetFlightBooking />}
        />
        <Route
          exact
          path="/get-multi-flight-booking/:pnr"
          element={<GetMultiBooking />}
        />
        <Route exact path="/hotels-list/:sector" element={<HotelsList />} />
        <Route
          exact
          path="/hotel-detail-view/:hotel"
          element={<HotelDetailView />}
        />
        <Route exact path="/hotel-booking/:code" element={<HotelBooking />} />
        <Route
          exact
          path="/hotel-confirmation/:key"
          element={<HotelBookingConfirmation />}
        />
        <Route
          exact
          path="/get-hotel-booking/:pnr"
          element={<GetHotelBooking />}
        />
        {/* Footer Links */}
        <Route exact path="/cheap-flight-finder" element={<CheapFlights />} />
        <Route exact path="/before-you-fly" element={<BeforeYouFly />} />
        <Route exact path="/payment-options" element={<PaymentOption />} />
        <Route exact path="/visa-assistance" element={<VisaAssistance />} />
        <Route
          exact
          path="/refund-applications"
          element={<RefundApplications />}
        />
        <Route
          exact
          path="/terms-and-conditions"
          element={<TermsConditions />}
        />
        <Route exact path="/about-us" element={<About />} />
        <Route exact path="/contact-us" element={<Contact />} />
        <Route exact path="/modify-booking" element={<ModifyBooking />} />
        <Route exact path="/cheap-hotels" element={<CheapHotels />} />
        <Route exact path="/umrah-packages" element={<UmrahPackages />} />
        <Route exact path="/travel-insurance" element={<TravelInsurance />} />
        <Route exact path="/foure-car-rental" element={<FoureRental />} />
        <Route exact path="/foure-tours" element={<FoureTours />} />
        <Route exact path="/foure-tours-ticket" element={<Reservations />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
