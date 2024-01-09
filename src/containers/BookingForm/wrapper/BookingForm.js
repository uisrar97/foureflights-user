import styled from "styled-components";

// Booking Forms Div Style
export const BookingFormsDiv = styled.div`
  .dropdown {
    @media (max-width: 800px) {
      display: block;
    }
  }
`;

// Bike Form Heading
export const BikeHead = styled.h2`
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
`;

// Booking Nav
export const BookingNav = styled.div`
  ul {
    @media (max-width: 800px) {
      font-size: 10px;
    }
    li {
      &: first-child {
        margin-left: 0px;
      }
      a {
      }
    }
  }
  @media (max-width: 1400px) {
    width: calc(75% + 40px);
    margin-left: calc(18% - 100px);
  }
  @media (max-width: 800px) {
    display: none;
  }
`;

export const BookingForm = styled.div`
  padding: 0px 15px 40px;
  display: flex;
  flex-direction: column;
  .plane-icons {
    position: absolute;
    padding-top: 34px;
    left: 25px;
    margin-top: 3px;
    z-index: 1;
  }

  .date {
    flex-basis: 33.3%;
  }
  .calender-icon {
    z-index: 1;
    margin-top: 37px;
    margin-left: 10px;
  }
  .cabin-class-select {
    width: 100%;
    border-radius: 5px;
    position: relative;
    border: none;
    height: 35px !important;
    margin-bottom: 25px;
    .cabin-select__indicators {
      display: none !important;
    }
    .cabin-select__value-container {
      padding: 0px !important;
    }
    .cabin-select__control {
      height: 35px;
      border: none !important;
      border-radius: 0px;
      font-size: 13.333px;
      background-color: unset;
      padding: 0px 0px 0px 35px;
      -webkit-appearance: none;
      -moz-appearance: none;
      border-bottom: 2px solid #378edd !important;
    }
    .cabin-select__control--is-focused {
      box-shadow: none !important;
    }
    .cabin-select__menu {
      font-size: 14px !important;
      margin-top: 0 !important;
    }
  }

  .booking-form-counter {
    border-bottom: 2px solid #fff;
  }
  .booking-form-button:hover {
    border: none;
  }
`;

//  .cCEbPg {
//     width: 100%;
//     background: #08121a8a;
//     /* color: #000000; */
//     color: white;
//     height: 229px;
//     border: 3px;
//     border-color: balck;
//     border-radius: 0px 0px 4px 4px;
//     box-shadow: rgb(21 23 27 / 24%) 1px 2px 2px;
// }
