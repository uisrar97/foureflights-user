import React from "react";
import { Document, Page, Text, Image, View } from "@react-pdf/renderer";
import BlueArrow from "../../../../assets/img/PDFBlueArrow.jpg";
import PlaneIcon from "../../../../assets/img/pdfPlane.jpg";
import Logo from "../../../../assets/img/logo.png";
import { toUpper } from "lodash";
import { styles } from "../../../FlightList/PaymentConfirmation/wrapper/ConfirmPaymentStyle";
import Invoice from "../../../FlightList/PaymentConfirmation/component/PaymentInvoice";
import {
  diff_minutes,
  date_convert,
  utc_convert,
  time_zone,
} from "../../../../helper/ConvertFunctions";

const MyDocument = ({
  bookingData,
  creationDate,
  totalFlightTime,
  firstSegment,
  lastSegment,
  MainHeading,
  InvoiceData,
}) => (
  <Document>
    {MainHeading === "E-Ticket Reservation" && (
      <Invoice InvoiceData={InvoiceData} />
    )}

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
          <Text style={styles.heading}>{MainHeading}</Text>
          <Text style={styles.link}>https://foureflights.com/</Text>
        </View>
        <Text style={styles.line} />
        {/* PAX Info */}
        <View style={styles.PAXInfo}>
          {bookingData.data.passenger_detail[0].nationality ? (
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
                Nationality:{" "}
                {toUpper(bookingData.data.passenger_detail[0].nationality)}
              </Text>
              <Text style={styles.left}>
                PNR Creation Date: {creationDate.slice(0, 15)}
              </Text>
              <Text style={styles.right}>
                Foure Reference (PNR): {bookingData.data.galilo_pnr}
              </Text>
              <Text style={styles.left}>
                Issuing Agent: Bukhari Travel Services
              </Text>
              <Text style={styles.right}>IATA Number: 27303054</Text>
              <Text style={styles.left}>
                Passport Number:{" "}
                {toUpper(bookingData.data.passenger_detail[0].passport_number)}
              </Text>
              <Text style={styles.right}>
                Passport Expiry:{" "}
                {bookingData.data.passenger_detail[0].exp_day +
                  " " +
                  bookingData.data.passenger_detail[0].exp_month +
                  " " +
                  bookingData.data.passenger_detail[0].exp_year}
              </Text>
              <Text style={styles.left}>Fare: {InvoiceData.price}</Text>
              <Text style={styles.right}>
                Airline Reference: {bookingData.data.SupplierLocatorCode}
              </Text>
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
              <Text style={styles.left}>Fare: {InvoiceData.price}</Text>
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
        <View>
          <View style={styles.flightDetailsParent}>
            <View style={styles.flight}>
              <Text>{firstSegment.origin_city_name}</Text>
              <Text>To</Text>
              <Text>{lastSegment.destination_city_name}</Text>
            </View>
            <Image src={PlaneIcon} style={styles.Plane} />
            <View style={styles.Departure}>
              <Text style={styles.ParentDeptStatus}>Departure</Text>
              <Text style={styles.ParentDeptTime}>
                {utc_convert(firstSegment.DepartureTime)}
              </Text>
              <Text>{time_zone(firstSegment.DepartureTime)}</Text>
              <Text>{date_convert(firstSegment.DepartureTime)}</Text>
            </View>
            <View style={styles.FlightInfo}>
              <Text>Total Flight Time:{" " + totalFlightTime}</Text>
              <Image style={styles.ParentArrow} src={BlueArrow} />
              <Text>Multi-Trip</Text>
            </View>
            <View style={styles.Arrival}>
              <Text style={styles.ParentArrStatus}>Arrival</Text>
              <Text style={styles.ParentArrTime}>
                {utc_convert(lastSegment.ArrivalTime)}
              </Text>
              <Text style={styles.ParentArrDate}>
                {time_zone(lastSegment.ArrivalTime)}
              </Text>
              <Text style={styles.ParentArrDate}>
                {date_convert(lastSegment.ArrivalTime)}
              </Text>
            </View>
          </View>
        </View>

        {bookingData.data.segments.map((segment, index) => {
          let originCity = segment.origin_city_name.split(",");
          let destinationCity = segment.destination_city_name.split(",");
          return (
            <View style={styles.flightsParent} key={Math.random()}>
              <View style={styles.RouteDateRow}>
                <Text style={styles.dateTime}>
                  {date_convert(segment.DepartureTime)} - {originCity[0]}
                  <Text style={{ color: "#FF9800" }}> To </Text>
                  {destinationCity[0]}
                </Text>
              </View>
              <View style={styles.flightDetails}>
                <View style={styles.flightDetailsParent}>
                  <View style={styles.Carrier}>
                    <Image
                      style={styles.AirlineLogo}
                      src={require("./../../../../assets/img/airline_logo/" +
                        segment.Carrier +
                        ".png")}
                    />
                    <Text> </Text>
                    <Text style={styles.AirlineName}>
                      {segment.airline_name +
                        " (" +
                        segment.Carrier +
                        ") " +
                        segment.FlightNumber}
                    </Text>
                    <Text> </Text>
                  </View>
                  <Image src={PlaneIcon} style={styles.Plane} />
                  <View style={styles.InnerDeparture}>
                    <Text style={styles.DeptStatus}>Departure</Text>
                    <Text style={styles.DeptTime}>
                      {utc_convert(segment.DepartureTime)}
                    </Text>
                    <Text>{time_zone(segment.DepartureTime)}</Text>
                    <Text>{date_convert(segment.DepartureTime)}</Text>
                  </View>
                  <View style={styles.InnerFlightInfo}>
                    <Image src={BlueArrow} style={styles.arrow} />
                  </View>
                  <View style={styles.InnerArrival}>
                    <Text style={styles.ArrStatus}>Arrival</Text>
                    <Text style={styles.ArrTime}>
                      {utc_convert(segment.ArrivalTime)}
                    </Text>
                    <Text>{time_zone(segment.ArrivalTime)}</Text>
                    <Text>{date_convert(segment.ArrivalTime)}</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.service}>
                  Class of Service:{" "}
                  {segment.CabinClass
                    ? segment.CabinClass
                    : bookingData.data.cabinClass.cabin}
                </Text>
              </View>

              <View>
                <Text style={styles.service}>
                  {bookingData.data.segments.length > 1 &&
                  bookingData.data.segments.length - 1 !== index ? (
                    "Layover: " +
                    diff_minutes(
                      segment.ArrivalTime,
                      bookingData.data.segments[
                        index + 1 === bookingData.data.segments.length
                          ? bookingData.data.segments.length - 1
                          : index + 1
                      ].DepartureTime
                    )
                  ) : (
                    <Text />
                  )}
                </Text>
              </View>
              {/* <View style={styles.PAXTable}>
                <Text style={styles.PAXTableHead}>Passengers</Text>
              </View> */}
            </View>
          );
        })}
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
