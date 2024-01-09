import styled from 'styled-components';

export const HotelSearchList = styled.div`
  display: flex;
  flex-direction: row;
  @media(max-width: 992px)
  {
    flex-direction: column;
  }
  .hotel-list {
    -ms-flex: 0 0 75%;
    flex: 0 0 75%;
    max-width: 75%;
    @media(max-width: 992px)
    {
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
`;

export const ModifyHotelSearchMain = styled.div`
display: flex;
flex-wrap: wrap;
overflow-x: hidden;
justify-content: space-between;
.back-btn
{
  justify-content: center;
  text-align: center;
  display: flex;
  flex-basis: 5%;
  @media(max-width: 991px)
  {
    flex-basis: 10%;
  }
}
.from-to-hotel-details {
  display: flex;
  padding-left: 15px;
  background: #fff;
  border-radius: 5px;
  flex-basis: 90%;
  border: 1px solid #b4aea3c4;
  h3 {
    font-size: 14px;
    padding-top: 5px;
    margin-right: 15px !important;
    flex-basis: 33.3%;
    color: #fcb040;
    span
    {
      color: #378edd;
    }
  }
  @media (max-width: 991px)
  {
    flex-basis: 85%;
  }
  @media (max-width: 500px)
  {
    flex-basis: 80%;
    flex-direction: column;
  }
}
.from-to-details
{
  display: flex;
  padding-left: 15px;
  background: #fff;
  border-radius: 5px;
  flex-basis: 78%;
  border: 1px solid #b4aea3c4;
  h3 {
    font-size: 14px;
    padding-top: 5px;
    margin-right: 15px !important;
    flex-basis: 33.3%;
    color: #fcb040;
    span
    {
      color: #378edd;
    }
  }
  @media (max-width: 991px)
  {
    flex-basis: 85%;
  }
}
.mod-btn
{
  flex-basis: 15%;
  button 
  {
    border-radius: 3px;
    text-shadow: 0px 0px 2px #776565;
    font-weight: bold;
    font-size: 16px;
    background: #378edd;
    color: #fff;
    padding: 12px 10px;
    border: none;
    transition: background 0.5s;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
      0 2px 10px 0 rgba(0, 0, 0, 0.12);
    height: 44px;
  }
  @media(max-width: 991px)
  {
    flex-basis: 100%;
    margin-top: 10px;
  }
}
`;

export const ModifyHotelSearchFormMain = styled.div`
  max-width: 100%;
  border-radius: 5px;
  padding: 30px 0px;
  margin: 30px 0px;
  background-color: #81b7e82b;
  .main-btn {
    width: unset !important;
  }
  .region-sector-select
  {
    width: 100%;
    border-radius: 5px;
    position: relative;
    border: none;
    height: 40px;
    select
    {
      height: 40px !important;
      border-radius: 5px;
      font-size: 14px;
      padding: 0px 0px 0px 35px;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .react-select__single-value, .react-select__placeholder {
      margin-left: 25px !important;
    }
    .react-select__indicator-separator {
      background-color: #999999 !important;
    }
    .react-select__indicator {
      color: #828282 !important;
    }
    .react-select__menu {
      z-index: 2 !important;
    }
    .react-select__input-container .react-select__input {
      margin-left: 25px !important;
    }
  }
  .react-datepicker-wrapper .react-datepicker__input-container input {
    border: none;
    border-radius: 5px;
    color: #000;
    height: 40px;
    width: 100%;
    padding: 0px 0px 0px 35px;
    font-size: 13.333px;
  }
  .calender-icon {
    z-index: 1;
    margin-top: 45px;
    margin-left: 10px;
    color: #378EDD;
  }
`;

export const HotelListMain = styled.div`
  margin-bottom: 10px;
  width: 100%;
  transition: transform 0.8s;
  -webkit-box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.21);
  box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.21);
  .hotel-details
  {
    @media(max-width: 767px)
    {
      text-align: center;
    }
  }
  .hotel-title
  {
    h3
    {
      font-size: 2vw;
      @media(max-width: 767px)
      {
        margin-top: 10px;
        font-size: 3.5vw;
      }
      @media(max-width: 500px)
      {
        font-size: 4.5vw;
      }
    }
    @media(max-width: 767px)
    {
      margin-bottom: 10px;
    }
  }
  .badge
  {
    @media(max-width: 767px)
    {
      align-self: center;
    }
  }
`;

export const ViewHotelButton = styled.div`
  a {
    margin-left: 20px;
    font-size: 12px;
    text-align: left;
    color: blue;
    cursor: pointer;
    text-decoration: none;
    @media (max-width: 500px) {
      flex-basis: 33%;
      text-align: center;
    }
  }
  h3 {
    color: #fcb040;
    font-size: 20px;
    margin-bottom: 5px;
  }
  p {
    font-size: 11px;
    color: #0000009e;
  }
  button {
    text-decoration: none;
    background: #378edd;
    width: 80%;
    margin-top: 10px;
    text-shadow: none;
    box-shadow: 0 2px 2px 0 rgb(162 152 152 / 16%), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    font-size: 16px;
    padding: 5px 10px;
    margin-left: 5px;
    border-radius: 3px;
    font-weight: bold;
    color: #fff;
    border: none;
    transition: background 0.5s;
    &: hover {
      background: #fcb040;
    }
    @media (max-width: 767px) {
      width: 40%;
    }
    @media (max-width: 400px) {
      font-size: 3.5vw;
    }
  }
`;

export const HotelDetailsMain = styled.div`
  font-family: Epilogue !important;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #b4aea3c4;
  flex-direction: row;
  .rooms-shadow, .selected-rooms
  {
    transition: transform 0.8s;
    -webkit-box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.5);
  }
  .total-row
  {
    .grand-total
    {
      div
      {
        @media(max-width: 991px)
        {
          text-align: center !important;
        }
      }
    }
    @media(max-width: 991px)
    {
      align-items: center;
      flex-direction: column;
    }
  }
  .feature-heads
  {
    @media(max-width: 350px)
    {
      font-size: 6vw;
    }
  }
  .selected-rooms-btn
  {
    button
    {
      font-size: 1.2vw;
      width: 40%;
      @media(max-width: 991px)
      {
        font-size: 1.5vw;
        width: 50%;
      }
      @media(max-width: 767px)
      {
        font-size: 2vw;
      }
      @media(max-width: 530px)
      {
        font-size: 2.5vw;
      }
      @media(max-width: 430px)
      {
        font-size: 3.5vw;
        width: 75%;
      }
    }
    @media(max-width: 991px)
    {
      text-align: center !important;
    }
  }
  .selected-rooms
  {
    .col-md-11
    {
      div
      {
        @media(max-width: 767px)
        {
          margin-bottom: 10px !important;
        }
      }
      @media(max-width: 767px)
      {
        text-align: center !important;
      }
    }
  }
  .img-thumb
  {
    height: 100px;
    width: 100px;
  }
  .select-room-btn
  {
    button
    {
      @media (max-width: 400px)
      {
        width: 100% !important;
      }
    }
  }
  .selected-room-title
  {
    font-size: 2vw;
    @media(max-width: 767px)
    {
      font-size: 3vw;
    }
    @media(max-width: 500px)
    {
      font-size: 4vw;
    }
    @media(max-width: 350px)
    {
      font-size: 5vw;
    }
  }
  .hotel-room-details
  {
    .d-flex
    {
      margin-bottom: 10px;
      .col-md-10
      {
        @media(max-width: 800px)
        {
          padding-right: 0;
          padding-left: 10px;
        }
      }
      @media(max-width: 800px)
      {
        text-align: initial !important;
      }
      @media(max-width: 380px)
      {
        flex-direction: column;
        text-align: center !important;
        align-items: center;
      }
    }
    @media(max-width: 800px)
    {
      align-self: center !important;
    }
  }
  .hotel-title
  {
    font-size: 3vw;
    @media(max-width: 600px)
    {
      font-size: 5vw; 
    }
    @media(max-width: 450px)
    {
      font-size: 6vw; 
    }
  }
  .room-title
  {
    font-size: 1.8vw;
    @media(max-width: 991px)
    {
      font-size: 2vw;
    }
    @media(max-width: 800px)
    {
      font-size: 3vw; 
    }
    @media(max-width: 600px)
    {
      font-size: 4vw; 
    }
    @media(max-width: 600px)
    {
      font-size: 5vw; 
    }
  }
  .feature-width
  {
    @media(max-width: 767px)
    {
      width: unset !important;
      padding: 0 0 0 5px !important;
    }
  }
  .features
  {
    @media(max-width: 360px)
    {
      flex-direction: column !important;
    }
  }
  .room-stats
  {
    @media(max-width: 900px)
    {
      flex-direction: column;
      text-align: left;
    }
  }
  .selected-room-price
  {
    color: #fcb040;
    @media (max-width: 1200px)
    {
      font-size: 15px;
    }
  }
  .rooms-details
  {
    .col-md-3, .col-md-6
    {
      @media (max-width: 800px)
      {
        flex: unset !important;
        max-width: unset !important;
      }
    }
    @media (max-width: 800px)
    {
      flex-direction: column;
      text-align: center;
    }
  }
  .add-ons
  {
    font-size: 16px;
  }
  .desc
  {
    font-size: 14px;
  }
  .vendor-location-iframe
  {
    width: 100%;
    height: 300px;
    iframe
    {
      border: 2px solid lightgray !important;
      width: 100% !important;
      height: 300px !important;
    }
  }
  .price-section {
    flex-basis: 20%;
    text-align: center;
    h3 {
      color: #fcb040;
      font-size: 25px;
      margin-bottom: 5px;
      @media (max-width: 1200px) {
        font-size: 15px;
      }
    }
    p {
      font-size: 11px;
      color: #0000009e;
      @media (max-width: 1200px) {
        font-size: 5px;
      }
    }
    button {
      text-decoration: none;
      background: #378edd;
      width: 68%;
      margin-top: 20px;
      display: inline-block;
      text-shadow: none;
      box-shadow: 0 2px 2px 0 rgb(162 152 152 / 16%),
        0 2px 10px 0 rgba(0, 0, 0, 0.12);
      font-size: 16px;
      padding: 10px 10px;
      margin-left: 5px;
      border-radius: 3px;
      font-weight: bold;
      color: #fff;
      border: none;
      transition: background 0.5s;
      &: hover {
        background: #fcb040;
      }
      @media (max-width: 1200px) {
        font-size: 10px;
      }
    }
    @media (max-width: 1200px) {
      flex-basis: calc(20% - 5px);
    }
    @media (max-width: 800px) {
      flex-basis: 100%;
      margin-bottom: 10px;
    }
  }
  .booking-form-counter input {
    background-color: transparent;
    width: 100%;
    font-size: 14px;
    border: none;
    outline: none;
    text-align: center;
    line-height: 19px;
    color: #777777;
    padding: 0;
  }
    
  /* Chrome, Safari, Edge, Opera */
  .booking-form-counter input::-webkit-outer-spin-button,
  .booking-form-counter input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
    
  /* Firefox */
  .booking-form-counter input[type=number] {
    -moz-appearance: textfield;
  }
    
  .booking-form-counter .value-button:hover {
    cursor: pointer;
  }
  .booking-form-counter #decrease i {
    margin-right: 0px;
    border-radius: 3px;
    align-self: center;
    font-size: 20px;
    color: #378EDD
  }
  .booking-form-counter #increase i {
    margin-left: 0px;
    border-radius: 3px;
    align-self: center;
    font-size: 20px;
    color: #378EDD
  }
    
  .booking-form-counter {
    border-bottom: 2px solid #378EDD;
  }
  .booking-form-button:hover {
    border: none;
  }
  .qty-input {
      margin-bottom: 0px;
  }
  .proceed-btn {
    text-decoration: none;
    background: #378edd;
    display: inline-block;
    text-shadow: none;
    box-shadow: 0 2px 2px 0 rgb(162 152 152 / 16%),
      0 2px 10px 0 rgba(0, 0, 0, 0.12);
    font-size: 14px;
    padding: 10px 10px;
    margin-left: 5px;
    border-radius: 3px;
    font-weight: bold;
    color: #fff;
    border: none;
    transition: background 0.5s;
    &: hover {
      background: #fcb040;
    }
    @media (max-width: 1200px) {
      font-size: 10px;
    }
  }
`;

export const SidebarTravellerDetails = styled.div`
  flex-basis: 24%;
  .additional-info,
  .summary
  {
    width: 100%;
    background: #fff;
    -webkit-box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.21);
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.21);
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    h3
    {
      font-size: 16px;
      text-align: center;
      font-weight: bold;
      padding: 10px 0px;
    }
  }
  .summary
  {
    font-weight: bold;
    .summary-sub
    {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 5px;
      p
      {
        flex-basis: 45%;
        margin: auto;
        text-align: left;
        padding: 10px 10px 10px 10px;
        @media (max-width: 950px)
        {
          font-size: calc(16px - 3px);
        }
      }
      span
      {
        flex-basis: 55%;
        margin: auto;
        text-align: right;
        padding: 10px 10px 10px 10px;
      }
    }
    .price
    {
      float: right;
      color: #378edd;
    }
    @media(max-width: 1400px)
    {
      font-size: 12px;
    }
  }
  .additional-info
  {
    .add-sec
    {
      padding: 10px;
      font-size: 15px;
      display: flex;
      flex-direction: column;
      .location
      {
        margin-bottom: 10px;
        font-weight: bold;
        .loc-inner
        {
          p
          {
            flex-basis: 25%
            @media (max-width: 950px)
            {
              font-size: calc(16px - 3px);
            }
          }
          .address, .flight-info
          {
            color: #378edd;
          }
          .bound
          {
            flex: 100%;
            text-align: center;
            justify-content: center;
            color: #FCB040;
          }
        }
      }
      @media(max-width: 1400px)
      {
        font-size: 12px;
      }
    }
  }
  @media(max-width: 800px)
  {
    flex-basis: 100%;
  }
`;

export const TravelerParent = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  margin-top: 20px;
  .InfoParent
  {
    flex-basis: 75%;
    max-width: 100%;
    margin-left: calc(10px - 3px);
    padding: 10px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.21);
    background-color: #fff;
    // overflow: hidden;
    .heading
    {
      text-align: center;
      width: 100%;
      margin-bottom: 1%;
    }
    .MainAdultForm
    {
      margin-top: 1%;
      padding: 1%;
      .contact, .PayInfo
      {
        flex-direction: column;
        text-align: center;
        .cont-details
        {
          justify-content: center;
        }
      }
      .separator
      {
        width: 100%;
        margin-bottom: 10px;
      }
      .submit
      {
        flex-direction: row-reverse;
        @media(max-width: 800px)
        {
          flex-direction: row;
          justify-content: center;
        }
      }
      .PAXInfo
      {
        display: flex;
        flex-direction: column;
        h3
        {
          flex-basis: 100%;
          text-align: center;
        }
      }
    }
    @media(max-width: 800px)
    {
      flex-basis: 100%;
    }
  }
`;

export const FailedBooking = styled.div`
    text-align: center;
    justify-content: center;
    margin-top: 201px;
    margin-bottom: 205px;
    *
    {
        margin-bottom: 30px;
    }
    .foot
    {
        text-align: center;
        margin-bottom: 20px;
        a
        {
            margin-left: 5px;
            border-radius: 3px;
            text-shadow: 0px 0px 2px #776565;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            background: #378edd;
            color: #ffffff;
            padding: 12px 10px;
            border: none;
            transition: backgroung 0.5s;
            box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
            &: hover
            {
                background: #fcb040;
            }
        }
    }
`;