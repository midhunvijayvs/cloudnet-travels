import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';


Font.register({
  family: "Poppins",
  src: "/fonts/Poppins/Poppins Regular 400.ttf",
})
Font.register({
  family: "PoppinsSemiBold",
  src: "/fonts/Poppins/Poppins SemiBold 600.ttf",
})
Font.register({
  family: "PoppinsBold",
  src: "/fonts/Poppins/Poppins Bold 700.ttf",
})

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Poppins',
    //fontSize: 12,
    padding: 40,
  },
  companyLogo: {
    height: 32,
    width:80,
    marginBottom: 8,
  },
  companyAddress: {
    fontSize: 10,
    lineHeight:1.3
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop:20
  },
  invoiceInfo: {
    flexDirection: 'column',
    
  },
  invoiceNumber: {
    marginBottom: 5,
    color: '#E05A67',
    fontSize: 13,
    fontFamily: 'PoppinsSemiBold',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  invoiceOrderId: {
    marginBottom: 2,
    color: '#000',
    fontSize: 11,
    fontWeight: 500,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  invoiceIssueDate: {
    marginBottom: 2,
    color: '#000',
    fontSize: 11,
    fontWeight: 400,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  invoiceDueDate: {
    marginBottom: 2,
    color: '#000',
    fontSize: 11,
    fontWeight: 400,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  invoiceAddressRow: {
    backgroundColor: '#e05a670a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  invoiceAddress: {
    fontSize: 11,
    maxWidth: 200
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: 5,
    fontSize: 12,
  },
  invoiceItems: {
    width: '100%',
    borderBottom: '1pt dashed rgb(128, 127, 127)',
    fontSize: 12,
    marginBottom: 20,
    minHeight:270
  },
  table:{
width:'100%',
marginTop:15,
  },
  thead:{
    width:'100%'
  },
  tbody:{
    width:'100%',
  },
  tr:{
    width:'100%',
    flexDirection:'row',
    justifyContent:"space-between",
    marginBottom:15
  },
  th:{

    fontSize: 10,
    fontFamily: 'PoppinsSemiBold',
  },
  td:{
    fontSize: 10,
    fontFamily: 'Poppins',
  },
  slHead:{
    fontSize: 10,
    fontFamily: 'PoppinsSemiBold',
    marginRight:0
  },
  sl:{
    fontSize: 10,
    fontFamily: 'Poppins',
    marginRight:0
  },
  nameHead:{
    fontSize: 10,
    fontFamily: 'PoppinsSemiBold',
    marginLeft:0,
    width:150,
    textAlign:"left"
  },
  name:{
    fontSize: 10,
    fontFamily: 'Poppins',
    marginLeft:0,
    width:150,
    textAlign:"left"
  },
  invoiceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signature: {
    color: '#000',
    fontSize: 12,
    marginBottom:10,
    opacity:0
  },
  thankYou: {
    color: '#97262c',
    textAlign: 'left',
    fontFamily:"PoppinsSemiBold",
    fontSize: 9,
    fontWeight: 700,
    opacity:0
  },
  totalAmounts: {
    flexDirection: 'column',
    alignItems: 'flex-end',

  },
  subTotal: {
    color: '#202020',
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'PoppinsSemiBold',
    fontWeight: 900,
    marginBottom: 10,
    flexDirection: 'row',
    
  },
  total: {
    color: '#97262c',
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'PoppinsBold',
    fontWeight: 900,
    textTransform: 'capitalize',
    marginBottom: 10,
    flexDirection: 'row',
    
  },
  
  invoiceFooter: {
    borderRadius: 9.284,
    backgroundColor: '#E05A67',
    width: '100%',
    padding: 10,
    marginTop: 20,
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 0,
    lineHeight:1.5
  },
  footerSpan: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 600,
    lineHeight:1.5
  },
});

const invoicePDFGenerator = ({ invoiceData }) =>
 (
  <Document>
    <Page size="A4" style={styles.container}>
      <View style={styles.invoiceHeader}>
        <View>
          <Image
            src="/images/app-logo-for-invoice-pdf.png"
            style={styles.companyLogo}
          />
          <View style={styles.companyAddress}>
            <Text>Sibu Fish and Meat,</Text>
            <Text>5 Seafield Place, Formby,</Text>
            <Text> L37 4AW, United Kingdom</Text>
          </View>
        </View>
        <View style={styles.invoiceInfo}>
          <View style={styles.invoiceNumber}>
            <Text>Invoice # :</Text>
            <Text>{invoiceData.invoice_number}</Text>
          </View>
          <View style={styles.invoiceOrderId}>
            <Text>Order ID :</Text>
            <Text>{invoiceData.order_id}</Text>
          </View>
          <View style={styles.invoiceIssueDate}>
            <Text>Date Issued :</Text>
            <Text>{invoiceData.issued_date}</Text>
          </View>
          <View style={styles.invoiceDueDate}>
            <Text>Date Due :</Text>
            <Text>{invoiceData.due_date}</Text>
          </View>
        </View>
      </View>

      <View style={styles.invoiceAddressRow}>
        <View style={styles.invoiceAddress}>
          <View style={styles.sectionTitle}>
            <Text>Invoice To:</Text>
          </View>
          <Text>{invoiceData.firstname} {invoiceData.lastname}</Text>
         
          <Text>{invoiceData.invoice_to_address_line_1}</Text>
          <Text>{invoiceData.invoice_to_address_line_2}</Text>
          <Text>{invoiceData.invoice_to_address_city}</Text>
          <Text>{invoiceData.invoice_to_address_zip_code}</Text>
        </View>

        <View style={styles.invoiceAddress}>
          <View style={styles.sectionTitle}>
            <Text>Bill To:</Text>
          </View>
          <Text>{invoiceData.firstname} {invoiceData.lastname}</Text>
         
          <Text>{invoiceData.bill_to_address_line_1}</Text>
          <Text>{invoiceData.bill_to_address_line_2}</Text>
          <Text>{invoiceData.bill_to_address_city}</Text>
          <Text>{invoiceData.bill_to_address_zip_code}</Text>
        </View>
      </View>

      <View style={styles.invoiceItems}>
        {/* Invoice items */}
        <View style={styles.table}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={styles.slHead}>SL.NO</Text>
              <Text style={styles.nameHead}>ITEM</Text>
              <Text style={styles.th}>QUANTITY</Text>
              <Text style={styles.th}>PRICE</Text>
              <Text style={styles.th}>TOTAL</Text>
            </View>
          </View>
          <View style={styles.tbody}>
            {/* Map through invoice items */}
            {invoiceData.items.map((order_item, index) => {
            return (
              <View style={styles.tr} key={index}>
              <Text style={styles.sl}>{index + 1}</Text>
                <Text style={styles.name}>{order_item.product_name}</Text>
                <Text style={styles.td}>{order_item.quantity}</Text>
                <Text style={styles.td}>{order_item.unit_price}</Text>
                <Text style={styles.td}>{order_item.total_price}</Text>
              </View>
            )
            }
            )}
          </View>
        </View>
      </View>

      <View style={styles.invoiceTotal}>
        <View >
          <Text style={styles.signature}>Sale Person : Tommy Shelby</Text>
          <Text style={styles.thankYou}>Thank you for your business</Text>
        </View>

        <View style={styles.totalAmounts}>
          <View  style={styles.subTotal} >
            <Text>SUB TOTAL:&nbsp; </Text>
            <Text> £{invoiceData.sub_total}</Text>
          </View>
          <View  style={styles.subTotal} >
            <Text>DELIVERY CHARGE:&nbsp; </Text>
            <Text> £{invoiceData.delivery_charge}</Text>
          </View>
          <View  style={styles.subTotal} >
            <Text>TAX:&nbsp; </Text>
            <Text> 0</Text>
          </View>
          <View style={styles.total}>
            <Text>TOTAL:&nbsp; </Text>
            <Text> £{invoiceData.total}</Text>
          </View>
        </View>
      </View>

      <View style={styles.invoiceFooter}>
        <Text style={styles.footerText}>
        Thank you for choosing Sibu Fish and Meat. We look forward to serving you again.
        </Text>
     
      </View>
    </Page>
  </Document>
);

export default invoicePDFGenerator;
