// FlightTicketInvoiceTemplate.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Font Registration
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins/Poppins Regular 400.ttf",
});
Font.register({
  family: "PoppinsSemiBold",
  src: "/fonts/Poppins/Poppins SemiBold 600.ttf",
});
Font.register({
  family: "PoppinsBold",
  src: "/fonts/Poppins/Poppins Bold 700.ttf",
});

// Theme colors
const COLORS = {
  primary: "#0A74CE",
  secondary: "#FBBC05",
  bg: "#faf9f6",
  bgLight: "#F5F5F5",
  black: "#000000",
  white: "#FFFFFF",
  darkGrey: "#555555",
  lightGrey: "#EBE7E7",
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: COLORS.bg,
    fontFamily: "Poppins",
    fontSize: 10,
    color: COLORS.black,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottom: `2pt solid ${COLORS.primary}`,
    paddingBottom: 8,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  companyInfo: {
    flexDirection: "column",
  },
  companyName: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    color: COLORS.primary,
    marginBottom: 2,
  },
  companyDetails: {
    fontSize: 9,
    color: COLORS.darkGrey,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "PoppinsSemiBold",
    color: COLORS.primary,
    marginVertical: 8,
    borderBottom: `1pt solid ${COLORS.lightGrey}`,
    paddingBottom: 2,
  },
  ticketInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgLight,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  infoBlock: {
    width: "48%",
    marginBottom: 6,
  },
  label: {
    fontSize: 8,
    color: COLORS.darkGrey,
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontFamily: "PoppinsSemiBold",
  },
  sectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    border: `1pt solid ${COLORS.lightGrey}`,
    borderRadius: 6,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 9,
    color: COLORS.darkGrey,
    borderTop: `1pt solid ${COLORS.lightGrey}`,
    paddingTop: 5,
  },
});

const FlightTicketInvoiceTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src="/images/logo.png" style={styles.logo} />
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>Cloudnet Travels</Text>
          <Text style={styles.companyDetails}>Koduvali Post, Kozhikode, Kerala</Text>
          <Text style={styles.companyDetails}>Ph: 9747020268</Text>
          <Text style={styles.companyDetails}>Email: cloudnettravels@gmail.com</Text>
        </View>
      </View>

      {/* Ticket Section */}
      <Text style={styles.sectionTitle}>flight ticket details</Text>
      <View style={styles.ticketInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>flight_number</Text>
          <Text style={styles.value}>{data.flight_number}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>airline_pnr</Text>
          <Text style={styles.value}>{data.airline_pnr}</Text>
        </View>
      </View>

      <View style={styles.ticketInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>ticket_number</Text>
          <Text style={styles.value}>{data.ticket_number}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>fare_type</Text>
          <Text style={styles.value}>{data.fare_type}</Text>
        </View>
      </View>

      {/* Passenger Section */}
      <Text style={styles.sectionTitle}>passenger information</Text>
      <View style={styles.ticketInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>passenger_name</Text>
          <Text style={styles.value}>{data.passenger_name}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>ticket_issued_date</Text>
          <Text style={styles.value}>{data.ticket_issued_date}</Text>
        </View>
      </View>

      {/* Travel Details */}
      <Text style={styles.sectionTitle}>travel details</Text>
      <View style={styles.sectorRow}>
        <View>
          <Text style={styles.label}>from</Text>
          <Text style={styles.value}>{data.sector_from_code} - {data.sector_from_name}</Text>
        </View>
        <View>
          <Text style={styles.label}>to</Text>
          <Text style={styles.value}>{data.sector_to_code} - {data.sector_to_name}</Text>
        </View>
      </View>
      <View style={styles.ticketInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>travel_date</Text>
          <Text style={styles.value}>{data.travel_date}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>time</Text>
          <Text style={styles.value}>{data.time}</Text>
        </View>
      </View>
      <View style={styles.ticketInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>flight_duration</Text>
          <Text style={styles.value}>{data.flight_duration}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>connection_time</Text>
          <Text style={styles.value}>{data.connection_time || "N/A"}</Text>
        </View>
      </View>

      {/* Services */}
      <Text style={styles.sectionTitle}>services</Text>
      <View style={styles.ticketInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>baggage</Text>
          <Text style={styles.value}>{data.baggage}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>meal</Text>
          <Text style={styles.value}>{data.meal}</Text>
        </View>
      </View>
      <View style={styles.ticketInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>other_services</Text>
          <Text style={styles.value}>{data.other_services}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>cloudnet_ref</Text>
          <Text style={styles.value}>{data.cloudnet_ref}</Text>
        </View>
      </View>

      {/* Price */}
      <Text style={styles.sectionTitle}>ticket price</Text>
      <View style={styles.ticketInfo}>
        <Text style={[styles.value, { color: COLORS.secondary, fontSize: 12 }]}>
          ₹ {data.ticket_price}
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Thank you for booking with Cloudnet Travels. Have a pleasant journey!
      </Text>
    </Page>
  </Document>
);

export default FlightTicketInvoiceTemplate;
