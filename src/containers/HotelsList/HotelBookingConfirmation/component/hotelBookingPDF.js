import React from 'react';
import { Document, Page, Text, Image, View } from '@react-pdf/renderer';
import Logo from '../../../../assets/img/logo.webp';
import { styles } from '../wrapper/hotelBookingResStyle';
import Invoice from './hotelInvoice';

const MyDocument = ({ InvoiceData, hotel, rooms }) => (
    <Document>
        <Invoice InvoiceData={InvoiceData} hotel={hotel} />   
        <Page size="A4" style={{ paddingTop: 25, paddingBottom: 25, paddingLeft: 25, paddingRight: 25, }}>
            {/* Success Header */}
            <View style={styles.head}>
                <View style={styles.PDFHead}>
                    <Image style={styles.Logo} src={Logo} />
                    <Text style={styles.heading}>E-Hotel Booking Reservation</Text>
                    <Text style={styles.link}>https://foureflights.com/</Text>
                </View>
                <Text style={styles.line} />
                {/* PAX Info */}
                <View style={styles.PAXInfo}>
                    {
                        (!InvoiceData.cnic) ?
                            <>
                                <Text style={styles.left}>Customer: {InvoiceData.customer_name}</Text>
                                <Text style={styles.right}>Nationality: {InvoiceData.nationality}</Text>
                                <Text style={styles.left}>Booking Reference (CNR): {InvoiceData.pnr}</Text>
                                <Text style={styles.right}>CNR Creation Date: {InvoiceData.invoice_date.slice(0, 15)}</Text>
                                <Text style={styles.left}>Passport Number: {InvoiceData.passport}</Text>
                                <Text style={styles.right}>Passport Expiry: {InvoiceData.passportExp}</Text>
                                <Text style={styles.left}>Total Amount: {InvoiceData.price}</Text>
                            </>
                            :
                            <>
                                <Text style={styles.left}>Customer: {InvoiceData.customer_name}</Text>
                                <Text style={styles.right}>Nationality: {InvoiceData.nationality}</Text>
                                <Text style={styles.left}>Booking Reference (CNR): {InvoiceData.pnr}</Text>
                                <Text style={styles.right}>CNR Creation Date: {InvoiceData.invoice_date.slice(0, 15)}</Text>
                                <Text style={styles.left}>CNIC: {InvoiceData.cnic}</Text>
                                <Text style={styles.right}>Total Amount: {InvoiceData.price}</Text>
                            </>
                    }
                </View>
                <View style={styles.line}>
                    <Text style={styles.flightDetailsHead}>Hotel Details</Text>
                </View>
                <View style={styles.PAXInfo}>
                    <Text style={styles.left}>Hotel: {hotel.hName}</Text>
                    <Text style={styles.right}>City: {hotel.city}</Text>
                    <Text style={styles.left}>Check-In: {hotel.checkin}</Text>
                    <Text style={styles.right}>Check-Out: {hotel.checkout}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.flightDetailsHead}>Room Details</Text>
                </View>
                <View style={styles.roomsParent}>
                    <View>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    {/* <Text style={styles.tableHeader}>S.No.</Text> */}
                                    <Text style={styles.tableCell}>S.No.</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    {/* <Text style={styles.tableHeader}>Room Name</Text> */}
                                    <Text style={styles.tableCell}>Room Name</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    {/* <Text style={styles.tableHeader}>Room Quantity</Text> */}
                                    <Text style={styles.tableCell}>Room Quantity</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    {/* <Text style={styles.tableHeader}>Price Per Night</Text> */}
                                    <Text style={styles.tableCell}>Price Per Night</Text>
                                </View>
                            </View>
                            {
                                rooms.map((room, index) => {
                                    return (
                                        <View style={styles.tableRow} key={Math.random()}>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{index + 1}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{room.title}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{room.qty}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{`PKR ${room.price}`}</Text>
                                            </View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={styles.greeting}>We hope that you have a comfortable stay.</Text>
                </View>
                <View>
                    <Text style={styles.agent_head}>Agent Details</Text>
                    <Text style={styles.agent_address}>BUKHARI TRAVEL SERVICES</Text>
                    <Text style={styles.agent_address}>2-Mohammadi Plaza, Blue Area, Islamabad</Text>
                    <Text style={styles.agent_address}>Pakistan</Text>
                    <Text style={styles.agent_address}>Phone: +92-51-28282562</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default MyDocument;