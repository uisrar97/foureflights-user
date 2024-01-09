import React from "react";
import { Document, Page, Text, Image, View } from "@react-pdf/renderer";
import BlueArrow from "../../../assets/img/PDFBlueArrow.jpg";
import PlaneIcon from "../../../assets/img/pdfPlane.jpg";
import Logo from "../../../assets/img/logo.png";
import ReservationImg from "../../../assets/img/ReservationImg.jpg";
import { styles } from "./../wrapper/GetBookingStyle";
import {
  time_convert,
  date_convert,
  TextCapitalizeFirst,
  airsial_time_convert,
} from "../../../helper/ConvertFunctions";

const MyDocument = ({
  bookingData,
  firstSegment,
  lastSegment,
  OutOrigCity,
  OutDestCity,
  InOrigCity,
  InDestCity,
  totalFlightTime,
  totalStops,
  round,
  ticketing,
}) => (
  <Document>
    <Page
      size="A4"
      style={{
        paddingTop: 25,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight: 25,
      }}
    >
      {/* Success Header */}
      <View style={styles.head}>
        <View style={styles.PDFHead}>
          <Image style={styles.Logo} src={Logo} />
          <Text style={styles.heading}>{ticketing}</Text>
          <Text style={styles.link}>https://foureflights.com/</Text>
        </View>
        <Text style={styles.line} />

        <View style={styles.PAXInfo}>
          {bookingData.data.passenger_detail[0].nationality ? (
            <>
              <Text style={styles.left}>
                Total Number of Passenger:{" "}
                {bookingData.data.passenger_detail.length}
              </Text>

              <Text style={styles.right}>
                Foure Reference (PNR): {bookingData.data.galilo_pnr}
              </Text>
              <Text style={styles.left}>
                Issuing Agent: Bukhari Travel Services
              </Text>
              <Text style={styles.right}>IATA Number: 27303054</Text>
            </>
          ) : (
            <>
              <Text style={styles.left}>
                Passenger:{" "}
                {bookingData.data.passenger_detail[0].title +
                  ". " +
                  bookingData.data.passenger_detail[0].firstName +
                  " " +
                  bookingData.data.passenger_detail[0].lastName}
              </Text>
              <Text style={styles.right}>
                Foure Reference (PNR): {bookingData.data.galilo_pnr}
              </Text>
              <Text style={styles.left}>
                Issuing Agent: Bukhari Travel Services
              </Text>
              <Text style={styles.right}>IATA Number: 27303054</Text>
              <Text style={styles.left}>Fare: {TotalPrice}</Text>
              <Text style={styles.right}>
                Airline Reference: {bookingData.data.SupplierLocatorCode}
              </Text>
            </>
          )}
        </View>
        <View style={styles.tableParent}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeader}>First Name</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeader}>Last Name</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeader}>Passport No/Cnic No.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeader}>eTicket Number</Text>
              </View>
            </View>
            {bookingData.data.passenger_detail.map((pax) => {
              return (
                <View style={styles.tableRow} key={Math.random()}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{` ${pax.firstName} `}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text
                      style={styles.tableCell}
                    >{`${pax.lastName}   (${pax.title}) `}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    {bookingData.data.passenger_detail[0].passport_number && (
                      <Text style={styles.tableCell}>
                        {pax.passport_number}
                      </Text>
                    )}
                    {bookingData.data.passenger_detail[0].cnic && (
                      <Text style={styles.tableCell}>{pax.cnic}</Text>
                    )}
                  </View>

                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>----------</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.line}>
          <Text style={styles.flightDetailsHead}>Flight Details</Text>
        </View>
        <View style={styles.secSection}>
          <View>
            <View>
              <Text style={styles.segmentTitle}>{firstSegment.Origin}</Text>
            </View>
            <Text style={styles.h6}>{firstSegment.origin_city_name}</Text>

            <Text style={styles.h6}>Departure</Text>
            <Text style={styles.h6}>
              {airsial_time_convert(firstSegment.DEPARTURE_TIME)}
            </Text>
            <Text style={styles.h6}>
              {date_convert(firstSegment.DEPARTURE_DATE)}
            </Text>
          </View>
          <View style={styles.imgdiv}>
            <View style={styles.flexclass}>
              <View style={styles.flexclass}>
                <Text style={styles.flightType}>
                  Flight Type:{round ? "Round-Trip" : "one-way"}
                </Text>
                <Text style={styles.h5}>Distance</Text>
                <Text style={styles.h6}>
                  Total Flight Time: {" " + time_convert(totalFlightTime)}
                </Text>
              </View>

              <View style={styles.textCenter}>
                <Image style={styles.imgClasses} src={ReservationImg} alt="" />
              </View>
            </View>
          </View>
          <View style={styles.flexclass}>
            <Text style={styles.segmentTitle}>{firstSegment.Destination}</Text>
            <Text style={styles.h6}>{firstSegment.Destination_city_name}</Text>

            <Text style={styles.h6}>Arrival</Text>

            <Text style={styles.h6}>
              {" "}
              {airsial_time_convert(firstSegment.ARRIVAL_TIME)}
            </Text>
            <Text style={styles.h6}>
              {date_convert(firstSegment.DEPARTURE_DATE)}
            </Text>
          </View>
        </View>
        {
          <View style={styles.flightsParent}>
            <View style={styles.RouteDateRow}>
              <Text style={styles.dateTime}>
                {airsial_time_convert(firstSegment.DEPARTURE_TIME)} -{" "}
                {OutOrigCity[0]}
                <Text style={{ color: "#FF9800" }}> To </Text>
                {OutDestCity[0]}
              </Text>
            </View>

            <View style={styles.flightDetails}>
              <View style={styles.flightDetailsParent}>
                <View style={styles.Carrier}>
                  <Image
                    style={styles.AirlineLogo}
                    src={require("./../../../assets/img/airline_logo/" +
                      firstSegment.FlightNumber.slice(0, 2) +
                      ".png")}
                  />
                  <Text> </Text>
                  <Text style={styles.AirlineName}>
                    {firstSegment.airline_name +
                      " (" +
                      firstSegment.FlightNumber.slice(0, 2) +
                      ") " +
                      firstSegment.FlightNumber.slice(2)}
                  </Text>
                  <Text> </Text>
                </View>
                <Image src={PlaneIcon} style={styles.Plane} />
                <View style={styles.InnerDeparture}>
                  <Text style={styles.DeptStatus}>Departure</Text>
                  <Text style={styles.DeptTime}>
                    {airsial_time_convert(firstSegment.DEPARTURE_TIME)}
                  </Text>
                  <Text>{date_convert(firstSegment.DEPARTURE_DATE)}</Text>
                </View>
                <View style={styles.InnerFlightInfo}>
                  <Image src={BlueArrow} style={styles.arrow} />
                </View>
                <View style={styles.InnerArrival}>
                  <Text style={styles.ArrStatus}>Arrival</Text>
                  <Text style={styles.ArrTime}>
                    {airsial_time_convert(firstSegment.ARRIVAL_TIME)}
                  </Text>
                  <Text>{date_convert(firstSegment.DEPARTURE_DATE)}</Text>
                </View>
              </View>
            </View>
          </View>
        }
        {round && (
          <>
            {
              <View style={styles.flightsParent}>
                <View style={styles.RouteDateRow}>
                  <Text style={styles.dateTime}>
                    {airsial_time_convert(lastSegment.DEPARTURE_TIME)} -{" "}
                    {InOrigCity[0]}
                    <Text style={{ color: "#FF9800" }}> To </Text>
                    {InDestCity[0]}
                  </Text>
                </View>

                <View style={styles.flightDetails}>
                  <View style={styles.flightDetailsParent}>
                    <View style={styles.Carrier}>
                      <Image
                        style={styles.AirlineLogo}
                        src={require("./../../../assets/img/airline_logo/" +
                          lastSegment.FlightNumber.slice(0, 2) +
                          ".png")}
                      />
                      <Text> </Text>
                      <Text style={styles.AirlineName}>
                        {lastSegment.airline_name +
                          " (" +
                          lastSegment.FlightNumber.slice(0, 2) +
                          ") " +
                          lastSegment.FlightNumber.slice(2)}
                      </Text>
                      <Text> </Text>
                    </View>
                    <Image src={PlaneIcon} style={styles.Plane} />
                    <View style={styles.InnerDeparture}>
                      <Text style={styles.DeptStatus}>Departure</Text>
                      <Text style={styles.DeptTime}>
                        {airsial_time_convert(lastSegment.DEPARTURE_TIME)}
                      </Text>
                      <Text>{date_convert(lastSegment.DEPARTURE_DATE)}</Text>
                    </View>
                    <View style={styles.InnerFlightInfo}>
                      <Image src={BlueArrow} style={styles.arrow} />
                    </View>
                    <View style={styles.InnerArrival}>
                      <Text style={styles.ArrStatus}>Arrival</Text>
                      <Text style={styles.ArrTime}>
                        {airsial_time_convert(lastSegment.ARRIVAL_TIME)}
                      </Text>
                      <Text>{date_convert(lastSegment.DEPARTURE_DATE)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            }
          </>
        )}
        <View>
          <Text style={styles.greeting}>We wish you a safe journey.</Text>
        </View>
        <View>
          <Text style={styles.agent_head}>Agent Details</Text>
          <Text style={styles.agent_address}>BUKHARI TRAVEL SERVICES</Text>
          <Text style={styles.agent_address}>
            2-Mohammadi Plaza, Blue Area, Islamabad
          </Text>
          <Text style={styles.agent_address}>Pakistan</Text>
          <Text style={styles.agent_address}>Phone: +92-51-28282562</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
