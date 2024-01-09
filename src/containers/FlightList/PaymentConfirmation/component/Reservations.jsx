import React from "react";
import Logo from "../../../../assets/img/logo.png";
import ReservationImg from "../../../../assets/img/ReservationImg.jpg";
import { Document, Page, Text, Image, View } from "@react-pdf/renderer";
import { styles } from "./../wrapper/ConfirmPaymentStyle";

const Reservations = () => {
  return (
    <Page size="A4">
      <View style={styles.page}>
        <View style={styles.parentSection}>
          <View style={styles.istSection}>
            <View className="  bg-light border rounded d-flex justify-content-start">
              <img className="bg-cover" src={Logo} alt="" />
            </View>
            <View style={styles.flexclass}>
              <Text style={styles.h6}>Nationality: PK</Text>
              <Text style={styles.span}> (PNR): 8GFZ64</Text>
              <Text>IATA Number: 27303054</Text>
              {/* <Text>23 nov 2023</Text> */}
            </View>
          </View>
          <View style={styles.istSectionSecdiv}>
            <View style={styles.flexclass}>
              <Text className="text-info">Passenger: Mr. bukhari travels</Text>
              <Text className="fontClass">
                PNR Creation Date: Fri Dec 16 2022
              </Text>
              <Text>Issuing Agent: Bukhari Travel Services</Text>
              <Text>CNIC: 56745-7457457-4</Text>
            </View>
            <View style={styles.flexclass}>
              <Text>Booking Time:10:22 Pm</Text>
              {/* <Text></Text> */}
            </View>
          </View>
          <View style={styles.secSection}>
            <View style={styles.flexclass}>
              <Text style={styles.titleText}>ISB</Text>
              <Text style={styles.h6}>Islamabad</Text>
              <Text>10:20pm</Text>
              <Text style={styles.textIfo}>Nov 13 2022</Text>
              <Text style={styles.divMargin}>Departure</Text>
              <Text>8:30 PM </Text>
              <Text>
                UTC +05:00 <br /> 30 December 2022
              </Text>
            </View>
            <View style={styles.imgdiv}>
              <View style={styles.flexclass}>
                <View style={styles.flexclass}>
                  <Text style={styles.distance}>Distance</Text>
                  <Text style={styles.h6}>3 Hours 55 Minutues</Text>
                </View>

                <View style={styles.textCenter}>
                  <img style={styles.imgClasses} src={ReservationImg} alt="" />
                </View>
              </View>
            </View>
            <View style={styles.flexclass}>
              <Text style={styles.titleText}>KHI</Text>
              <Text style={styles.h6}>Karachi</Text>
              <Text>10:20pm</Text>
              <Text style={styles.textIfo}>Nov 13 2022</Text>
              <Text style={styles.divMargin}>Arrival</Text>
              <Text>10:25 PM</Text>
              <Text>
                UTC +05:00 <br /> 30 December 2022
              </Text>
            </View>
          </View>
          <View style={styles.cardDesign}>
            <View style={styles.cardText}>
              <Text>Qatar Airways Qr-509</Text>
              <Text> 1/PNR:D555RPY</Text>
            </View>
          </View>
          <View style={styles.lastSecMargin}>
            <View style={styles.flex}>
              <View>
                <Text>
                  Pessener:{" "}
                  <Text className="text-info">1Adults , 2 children</Text>
                </Text>
              </View>
              <View>
                <Text>E-Ticket No:</Text>
              </View>
            </View>
            <View style={styles.flex}>
              <View>
                <Text>Jhontan Carona</Text>
              </View>
              <View>
                <span>D55YRP</span>
              </View>
            </View>
            <View style={styles.flex}>
              <View>
                <Text className="">Denish Carona</Text>
              </View>
              <View>
                <Text>D55YRP</Text>
              </View>
            </View>
            <View style={styles.flex}>
              <View>
                <Text className="">Lilly Carona</Text>
              </View>
              <View>
                <Text>D55YRP</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default Reservations;
