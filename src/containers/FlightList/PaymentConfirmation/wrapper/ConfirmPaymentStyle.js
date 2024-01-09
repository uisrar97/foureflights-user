import styled from "styled-components";
import { StyleSheet } from "@react-pdf/renderer";

export const ConfirmParent = styled.div`
  width: 100%;
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  overflow: hidden;
  background-color: #fff;
  button:disabled {
    cursor: no-drop;
  }
  .main {
    flex-basis: 100%;
    padding: 10px;
    .text-center div {
      display: unset !important;
    }
    .success,
    .failure {
      width: 60%;
      text-align: center;
      margin: auto;
    }

    .success {
      padding: 0px 5%;
      width: 100% !important;
      hr {
        margin: 30px 0px 30px 0px;
      }
      h3 {
        font-size: 25px;
        margin-bottom: 30px;
      }
      .foot-btn {
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
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12);
        &: hover {
          background: #fcb040;
        }
      }
      .success-head {
        display: flex;
        flex-direction: row;
        width: 100%;
        * {
          margin: auto;
          flex-basis: 33.3%;
        }
        img {
          width: 15%;
          @media (max-width: 800px) {
            width: calc(5% + 45px);
          }
        }
        h2 {
          padding-top: 20px;
          @media (max-width: 800px) {
            font-size: 16px;
          }
        }
        .PDF {
          margin: auto;
          a {
            font-size: 30px;
            cursor: pointer;
            span {
              font-size: 20px;
              @media (max-width: 800px) {
                font-size: calc(5% + 15px);
              }
            }
            @media (max-width: 800px) {
              display: flex;
              flex-direction: column;
              font-size: 20px;
            }
          }
          // PDF Icon
          .fas {
            color: #dd4c4c;
          }
        }
      }
      .PAX-info,
      .flight-info {
        display: flex;
        width: 100%;
        text-align: left;
        margin-bottom: 30px;
      }
      .PAX-info {
        flex-direction: row;
        .left,
        .right {
          flex-basis: 50%;
          flex-direction: column;
          .PAX-inner-row {
            width: 100%;
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            h4,
            p {
              color: black;
              font-size: 16px;
            }
            h4 {
              font-weight: bold;
            }
            * {
              flex-basis: 50%;
              margin-top: auto;
              margin-bottom: auto;
            }
          }
          @media (max-width: 800px) {
            flex-basis: 100%;
          }
        }
        @media (max-width: 800px) {
          flex-direction: column;
          padding-left: 10%;
        }
      }
      .flight-info-head {
        padding: 15px;
        justify-content: center;
        text-align: center;
        .inner-head-desktop {
          display: flex;
          flex-direction: row;
          .plane,
          .arrow {
            flex-basis: 20%;
          }
          .flight {
            flex-basis: 30%;
            font-weight: bold;
            * {
              margin-bottom: 5px;
            }
          }
          .plane {
            text-align: center;
            i {
              font-size: 50px;
              color: #fcb040;
            }
          }
          .depart,
          .arrival {
            flex-basis: 15%;
            text-align: left;
            h5 {
              flex-basis: 45%;
              font-size: 40px;
            }
          }
          .arrow {
            text-align: center;
            p {
              margin-left: 5px;
            }
            img {
              width: 50%;
            }
          }
          @media (max-width: 800px) {
            display: none;
          }
        }
        .inner-head-mobile {
          display: none;
          flex-direction: column;
          .flight {
            flex-basis: 100%;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
            * {
              margin-bottom: 5px;
            }
          }
          .depart-arrive {
            display: flex;
            flex-direction: row;
            justify-content: center;
            .depart,
            .arrival {
              flex-basis: 30%;
              text-align: center;
              h4 {
                font-size: calc(5% + 15px);
              }
              h5 {
                font-size: calc(5% + 28px);
              }
            }
          }
          .arrow {
            flex-basis: 40%;
            text-align: center;
            p {
              margin-left: 5px;
            }
            img {
              width: calc(5% + 90px);
            }
          }
          @media (max-width: 800px) {
            display: flex;
          }
        }
      }
      .flight-info {
        flex-direction: column;
        border: 2px solid #378cdd;
        padding: 15px;
        .flight-inner-row {
          display: flex;
          flex-direction: row;
          text-align: left;
          flex-basis: 100%;
          margin-bottom: 20px;
          * {
            margin-top: auto;
            margin-bottom: auto;
          }
          .flight-status {
            color: green;
          }
          p {
            color: black;
            font-size: 20px;
            @media (max-width: 800px) {
              font-size: 17px;
            }
          }
          .flight-inner-row-desktop {
            display: flex;
            flex-direction: row;
            text-align: left;
            flex-basis: 100%;
            margin-bottom: 20px;
            .airline {
              display: flex;
              flex-basis: 30%;
              flex-direction: row;
              p {
                font-size: 15px;
                font-weight: bold;
                padding-left: 15px;
              }
            }
            .plane {
              flex-basis: 11%;
              text-align: center;
              i {
                font-size: 50px;
                color: #fcb040;
              }
            }
            .arrow {
              flex-basis: 25%;
              text-align: center;
              p {
                margin-left: 5px;
              }
              img {
                width: 40%;
              }
            }
            .depart,
            .arrival {
              flex-basis: 16%;
              div {
                display: flex;
                flex-direction: row;
                h5 {
                  font-size: 40px;
                }
                div {
                  display: flex;
                  flex-direction: column;
                  margin-top: 5px;
                  margin-left: 5px;
                }
              }
            }
            @media (max-width: 800px) {
              display: none;
            }
          }
          .flight-inner-row-mobile {
            display: none;
            .airline {
              display: flex;
              flex-basis: 100%;
              flex-direction: row;
              text-align: center;
              img {
                flex-basis: 15%;
              }
              p {
                font-size: calc(5px + 10px);
                font-weight: bold;
                flex-basis: 42.5%;
              }
            }
            .flight-inner-depart-arrive {
              display: flex;
              flex-direction: row;
              .arrow {
                flex-basis: 40%;
                text-align: center;
                p {
                  margin-left: 5px;
                }
                img {
                  width: 40%;
                }
              }
              .depart,
              .arrival {
                flex-basis: 30%;
                text-align: center;
                h4 {
                  font-size: calc(5% + 15px);
                }
                h5 {
                  font-size: calc(5% + 28px);
                }
              }
            }
            @media (max-width: 800px) {
              display: flex;
              flex-direction: column;
            }
          }

          .PAX-head,
          .ticket-info,
          .service,
          .airport-head,
          .airport-info {
            flex-basis: 100%;
          }
          .ticket-info {
            * {
              border: 2px solid black;
              padding: 5px;
            }
            thead {
              font-weight: bold;
              color: black;
            }
            tbody {
              color: #141111;
            }
          }
          .airport-info {
            display: flex;
            flex-direction: row;
            * {
              flex-basis: 33%;
              margin-top: auto;
              margin-bottom: auto;
            }
            .to {
              text-align: center;
            }
          }
        }
        .flights {
          flex-direction: column;

          * {
            margin-bottom: 15px;
          }
        }
      }
      .agent {
        text-align: left;
        p {
          font-weight: bold;
        }
      }
      @media (max-width: 800px) {
        margin: 0px;
        padding: 5px;
        width: 100%;
      }
    }
    .foot {
      text-align: center;
      margin-bottom: 20px;
      padding: 0px 5%;
      a,
      .foot-btn {
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
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12);
        &: hover {
          background: #fcb040;
        }
      }
      .PDF {
        margin: auto;
        font-size: 16px;
        width: 10%;
        cursor: pointer;
        span {
          font-size: 20px;
          @media (max-width: 800px) {
            font-size: calc(5% + 15px);
          }
        }
        @media (max-width: 800px) {
          display: flex;
          flex-direction: column;
          font-size: 20px;
        }
        // PDF Icon
        .fas {
          color: #dd4c4c;
        }
      }
    }
  }
`;

export const PaymentLoader = styled.div`
    z-index: 999 !important;
    backdrop-filter: blur(5px);
    top: 0;
    left: 0;
    height
`;

export const FailedBooking = styled.div`
  text-align: center;
  justify-content: center;
  margin-top: 201px;
  margin-bottom: 205px;
  * {
    margin-bottom: 30px;
  }
  .foot {
    text-align: center;
    margin-bottom: 20px;
    a {
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
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
        0 2px 10px 0 rgba(0, 0, 0, 0.12);
      &: hover {
        background: #fcb040;
      }
    }
  }
`;

export const LoaderMain = styled.div`
  text-align: center;
  margin-top: 149px;
  margin-bottom: 150px;
  div {
    display: unset !important;
  }
`;

export const styles = StyleSheet.create({
  fontClass: {
    fontsize: "12px",
  },
  page: {
    display: "flex",
    fledDirection: "column",
    justifyContent: "center",
    backgroundColor: "#536162",
    paddingBottom: "80px",
  },
  // w-50 bg-white rounded border border-b-dotted px-4
  parentSection: {
    width: "50%",
    backgroundColor: "#fff",
    border: "2px dotted gray",
    borderRadius: "15px",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "16px",
    marginTop: "4%",
  },
  // d-flex justify-content-between align-items-center mt-4 pt-4
  istSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  // d-flex justify-content-between border-bottom pb-2
  istSectionSecdiv: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px dashed gray",
    paddingBottom: "10px",
  },
  //  style={{ marginTop: "80px" }}
  // className=" d-flex justify-content-around  "
  secSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    fontsize: "x-large",
    marginTop: "40px",
    marginBottom: "20px",
  },
  divMargin: {
    marginTop: "16px",
  },
  tableMargin: {
    marginTop: "25px",
  },
  h3: {
    color: "red",
    fontsize: 16,
  },
  h6: {
    fontSize: 12,
    textAlign: "center",
    paddingBottom: "5px",
  },
  Layover: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  flightType: {
    fontSize: 12,

    textAlign: "",
    paddingBottom: "5px",
  },
  margin: {
    marginBottom: 40,
  },
  h5: {
    fontSize: 14,
    paddingBottom: "5px",
    fontWeight: "bold",
    width: "40%",
    textAlign: "center",
    color: "#009EFF",
  },
  distance: {
    fontSize: 14,
    paddingBottom: "5px",
    fontWeight: "bold",
    width: "40%",
    textAlign: "",
    color: "#009EFF",
  },
  textIfo: {
    color: "#009EFF",
  },
  // className="d-flex  justify-content-center"
  imgdiv: {
    display: "flex",
    justifyContent: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  fontBold: {
    fontWeight: "bold",
    fontsize: 16,
  },
  imgClasses: {
    // className="rounded-circle shadow-xl "
    // style={{ width: "180px", height: "180px", marginTop: "20px" }}

    width: 140,
    height: 140,
    backgroundColor: "gray",
    marginTop: 14,
    borderRadius: "50%",
    boxShadow: "10px 10px 5px #ccc",
  },
  imageDesign: {
    paddingLeft: 30,
  },
  // className="border mt-4 d-flex justify-content-center align-items-center py-4"
  cardDesign: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px  solid #D3DEDC",
    borderRadius: "4px",
    marginTop: "16px",
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  cardText: {
    // text-center font-weight-bold
    textAlign: "center",
    fontWeight: "bold",
    fontsize: "22px",
    paddingBottom: "8px",
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
  },
  lastSecMargin: {
    marginTop: "16px",
    padding: "4px",
  },

  segmentTitle: {
    color: "#009EFF",
    paddingBottom: "5px",
    fontWeight: "bold",
  },

  line: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    borderTopColor: "#DFD3C3",
  },
  PDFHead: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  Logo: {
    maxWidth: "100%",
    width: 100,
  },
  head: {
    display: "flex",
    flexDirection: "column",
  },
  link: {
    fontSize: 13,
    marginTop: 10,
    marginLeft: 90,
    color: "#2596be",
  },
  greeting: {
    fontSize: 16,
    marginLeft: 150,
    marginTop: 10,
    marginBottom: 60,
    fontWeight: "700",
  },
  heading: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 80,
  },
  PAXInfo: {
    marginLeft: 10,
    marginTop: 0,
    fontSize: 10,
  },
  totalPassenger: {
    marginLeft: 10,
    marginTop: 0,
    fontSize: 10,
  },
  left: {
    marginBottom: 5,
    marginLeft: 1,
  },
  right: {
    marginLeft: 265,
    marginTop: -15,
    marginBottom: 5,
  },
  flightDetailsHead: {
    width: "100%",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 0,
    marginTop: 10,
  },
  flightsParent: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#F8EDE3",
    boxShadow: 10,
    marginBottom: 20,
  },
  flight: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    fontSize: 12,
    fontWeight: "bold",
  },
  Departure: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 15,
  },
  InnerDeparture: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 30,
  },
  Arrival: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "15",
  },
  InnerArrival: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 30,
  },
  dateTime: {
    fontSize: 12,
    paddingTop: 2,
  },
  confirmed: {
    width: "12%",
  },
  flightDetails: {
    display: "flex",
    flexDirection: "column",
    fontSize: 10,
    marginTop: 10,
  },
  PAXTable: {
    marginTop: 5,
  },
  PAXTableHead: {
    fontSize: 16,
    fontWeight: "bold",
  },
  flightDetailsParent: {
    display: "flex",
    flexDirection: "row",
    fontSize: 10,
    marginTop: 0,
    marginBottom: 10,
  },
  Carrier: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "40%",
    margin: 0,
  },
  AirlineLogo: {
    width: "50px",
    height: "50px",
  },
  AirlineName: {
    margin: "auto",
    maxWidth: "80px",
    wordWrap: "break-word",
  },
  Confirm: {
    margin: "auto",
    maxWidth: "70px",
    wordWrap: "break-word",
  },
  Plane: {
    width: 30,
    height: 30,
    marginLeft: 15,
    marginTop: 10,
  },
  ParentStops: {
    fontSize: 13,
  },
  arrow: {
    width: "60px",
    height: "15px",
  },
  ParentArrow: {
    width: "100px",
    height: "15px",
  },
  RouteDateRow: {
    display: "flex",
    flexDirection: "row",
  },
  DeptStatus: {
    fontWeight: "bold",
    fontSize: 16,
  },
  DeptTime: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ParentDeptStatus: {
    fontWeight: "bold",
    fontSize: 16,
  },
  FlightInfo: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "15",
    maxWidth: "17%",
    justifyContent: "center",
    textAlign: "center",
  },
  InnerFlightInfo: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 30,
    maxWidth: "17%",
    justifyContent: "center",
    textAlign: "center",
  },
  ParentDeptTime: {
    fontSize: 25,
    fontWeight: "bold",
  },
  ArrStatus: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ArrTime: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ParentArrStatus: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ParentArrTime: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableParent: {
    marginTop: 12,
  },
  table: {
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#DFD3C3",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginLeft: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#DFD3C3",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    marginTop: 5,
    paddingBottom: 5,
    fontSize: 10,
    paddingLeft: 5,
  },
  tableHead: {
    fontWeight: "bold",
    fontSize: 13,
    paddingLeft: 5,
  },
  tableHeader: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 11,
    paddingLeft: 5,
  },
  service: {
    fontSize: 10,
    fontWeight: "bold",
  },
  routes: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingTop: 10,
    fontSize: 12,
  },
  routeCity: {
    marginRight: 20,
  },
  agent_head: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  agent_address: {
    fontSize: 10,
  },
});

export const InvoiceStyles = StyleSheet.create({
  line: {
    marginTop: 5,
    marginBottom: 5,
    width: "96%",
    marginLeft: "2%",
    marginRight: "2%",
    borderTopWidth: 0.8,
    borderTopStyle: "solid",
    borderTopColor: "#000000",
  },
  page: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 25,
  },
  PDFHead: {
    display: "flex",
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
    marginTop: 45,
  },
  FoureLogo: {
    width: 120,
    marginLeft: -12,
    marginBottom: 20,
  },
  heading: {
    flexBasis: "39.3%",
    fontSize: 14,
    marginTop: -18,
    textAlign: "center",
  },
  HeadLink: {
    flexBasis: "33.3%",
    fontSize: 14,
    marginTop: -18,
    textAlign: "right",
  },
  Logo: {
    width: 100,
    marginTop: 10,
  },
  InvoiceHead: {
    width: "100%",
  },
  head: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    border: "1 px solid black",
    padding: 15,
  },
  PAXInfo: {
    marginLeft: 10,
    marginTop: 0,
    fontSize: 10,
  },
  left: {
    marginBottom: 5,
    marginLeft: 1,
    fontFamily: "Helvetica-Bold",
  },
  right: {
    marginLeft: 150,
    marginTop: -16,
    marginBottom: 5,
  },
  flightDetailsHead: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
  },
  ACRow: {
    marginLeft: "25%",
    flex: "row",
  },
  ACTitle: {
    textAlign: "center",
    fontSize: 12,
    marginTop: -8,
    marginRight: 90,
  },
  agent_address: {
    fontSize: 10,
    marginLeft: 5,
  },
});
