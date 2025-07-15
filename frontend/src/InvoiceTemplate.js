import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { formatDateTimeToMonthYear } from './GeneralFunctions';


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
  documentContainer: {
    position: 'relative'
  },
  pageContainer: {
    padding: 40,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
  },
  invoiceTitle: {
    fontSize: 12,
    fontFamily: 'PoppinsSemiBold',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#898989',
    fontFamily: 'PoppinsSemiBold',
    marginLeft: 5,
  },

  // address section
  addressContainer: {
    display: 'flex', width: '100%', justifyContent: 'space-between', flexDirection: 'row'
  },
  AddressHeader: {
    color: '#898989',
    fontSize: 9,
    marginBottom: 4,
  },
  fromSection: {
    display: 'flex', alignItems: 'start', width: '100%',
  },
  fromLogo: {
    width: 70, height: 40, marginBottom: 3
  },
  addressTitle: {
    fontSize: 11, marginBottom: 2, fontFamily: 'PoppinsSemiBold', fontWeight: 500
  },
  addressLine: {
    fontSize: 8, fontFamily: 'Poppins',
  },

  // seperation
  horizontalLine: {
    height: 1,
    backgroundColor: '#eb972a',
    marginTop: 10,
    marginBottom: 10,
  },

  // Order-Info
  orderInfoContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20,
  },
  orderInfoSection: {
    width: '23%',
  },
  orderHeader1: {
    color: '#898989',
    fontSize: 9,
    fontFamily: 'Poppins',
    marginBottom: 2,
    textAlign: 'left'
  },
  orderHeader: {
    color: '#898989',
    fontSize: 9,
    fontFamily: 'Poppins',
    marginBottom: 2,
    textAlign: 'center'
  },
  orderHeaderLast: {
    color: '#898989',
    fontSize: 9,
    fontFamily: 'Poppins',
    marginBottom: 2,
    textAlign: 'right'
  },
  orderValue1: {
    fontSize: 10,
    fontFamily: 'PoppinsSemiBold',
    textAlign: "left",
  },
  orderValue: {
    fontSize: 10,
    fontFamily: 'PoppinsSemiBold',
    textAlign: 'center',
  },
  orderValueLast: {
    fontSize: 10,
    fontFamily: 'PoppinsSemiBold',
    textAlign: "right",
  },

  // Item-Table
  tableSection: {
    // flexGrow: 1,
    width: '100%',
    borderBottom: '1pt dashed rgb(128, 127, 127)',
    marginBottom: 10,
    alignItems: 'left'
  },
  tableContainer: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  tableColFixed: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    width: 60,  // Adjust this value as needed for fixed columns
  },
  tableColFlexible: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    flex: 1,  // Flexible width for the ITEM column
  },
  tableHeadingCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 9,
    fontFamily: 'PoppinsSemiBold'
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
    fontFamily: 'Poppins',

  },
  tableCellFixed: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
    fontFamily: 'Poppins',
    whiteSpace: 'nowrap',
  },
  toppingName: {
    fontSize: 8,
    color: '#474747',
    fontFamily: 'Poppins',
    marginLeft: 0,
    textAlign: "left"
  },
  toppingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  toppingPrice: {
    fontSize: 8,
    color: '#474747',
    fontFamily: 'Poppins',
    marginLeft: 5,
    textAlign: "left",
  },


  // Total
  invoiceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signature: {
    color: '#000',
    fontSize: 12,
    marginBottom: 10,
    opacity: 0
  },
  thankYou: {
    color: '#eb972a',
    textAlign: 'left',
    fontFamily: "PoppinsSemiBold",
    fontSize: 9,
    fontWeight: 700,
    opacity: 0
  },
  totalAmounts: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  subTotal: {
    color: '#202020',
    textAlign: 'right',
    fontSize: 10,
    fontFamily: 'PoppinsSemiBold',
    fontWeight: 800,
    marginBottom: 5,
    flexDirection: 'row',

  },
  discount: {
    color: '#9e0000',
    textAlign: 'right',
    fontSize: 9,
    fontFamily: 'PoppinsSemiBold',
    fontWeight: 700,
    marginBottom: 4,
    flexDirection: 'row',

  },
  total: {
    color: '#eb972a',
    textAlign: 'right',
    fontSize: 11,
    fontFamily: 'PoppinsBold',
    fontWeight: 900,
    textTransform: 'capitalize',
    marginBottom: 10,
    flexDirection: 'row',

  },

  // Footer
  invoiceFooter: {
    borderRadius: 9.284,
    backgroundColor: '#d11b4b',
    width: '100%',
    padding: 10,
    marginTop: 20,
    position: 'absolute',
    bottom: 50,
    marginHorizontal: 40,
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 0,
    // lineHeight: 1.5
  },
  footerSpan: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 600,
    // lineHeight: 1.5
  },


});

const invoicePDFGenerator = ({ data }) =>
(
  <Document style={styles.documentContainer}>
    <Page size="A4" style={styles.pageContainer}>
      {/* Invoice Header Section */}
      <View style={styles.invoiceHeader}>
        <View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>
        <View>
          <Text style={styles.invoiceNumber}>#{data.id}</Text>
        </View>
      </View>

      {/* Address Section */}
      <View style={styles.addressContainer}>
        {/* From Address */}
        <View >
          <Text style={styles.AddressHeader}>From</Text>
          <View style={styles.fromSection}>
            <View>
              <Image src="/images/orders/logo-for-invoice-pdf.png" style={styles.fromLogo} />
            </View>
            <View >
              <Text style={styles.addressTitle}>Cloudnet Travels</Text>
              <Text style={styles.addressLine}>2 Brook Street,
              </Text>
              <Text style={styles.addressLine}>Wrexham, LL13 7LH</Text>
              <Text style={styles.addressLine}>{'connect@rangrasoii.com '}</Text>
              <Text style={styles.addressLine}>Ph: 07777760756</Text>
            </View>
          </View>
        </View>
        {/* Billing Address */}
        <View style={{ marginRight: 5 }}>
          <Text style={styles.AddressHeader}>Billing Address</Text>
          <View style={{ display: 'flex', alignItems: 'center', width: '100%', }}>
            <View>
              <Text style={styles.addressTitle}>{data.user}</Text>
              <Text style={styles.addressLine}>
                {data.billing_number && `${data.billing_number}, `}
                {data.billing_address_line1 && `${data.billing_address_line1}, `}
              </Text>
              <Text style={styles.addressLine}>
                {data.billing_premise && `${data.billing_premise}, `}
                {data.billing_street && `${data.billing_street}, `}
                {data.billing_posttown && `${data.billing_posttown}, `}
              </Text>
              <Text style={styles.addressLine}>
                {data.billing_postcode && `${data.billing_postcode}, `}
                {data.billing_county && `${data.billing_county},`}
              </Text>
              <Text style={styles.addressLine}>United Kingdom</Text>
              <Text style={styles.addressLine}>{data.email}</Text>
              {data.billing_phone_number &&
                <Text style={styles.addressLine}>Ph: +{data.billing_phone_number}</Text>
              }
            </View>
          </View>
        </View>
        <View style={{ marginRight: 5 }}>
          <Text style={styles.AddressHeader}>Delivery Address</Text>
          <View style={{ display: 'flex', alignItems: 'center', width: '100%', }}>
            <View>
              <Text style={styles.addressTitle}>{data.user}</Text>
              <Text style={styles.addressLine}>
                {data.number && `${data.number}, `}
                {data.address_line1 && `${data.address_line1}, `}
              </Text>
              <Text style={styles.addressLine}>
                {data.premise && `${data.premise}, `}
                {data.street && `${data.street}, `}
                {data.posttown && `${data.posttown}, `}
              </Text>
              <Text style={styles.addressLine}>
                {data.postcode && `${data.postcode}, `}
                {data.county && `${data.county},`}
              </Text>
              <Text style={styles.addressLine}>United Kingdom</Text>
              <Text style={styles.addressLine}>{data.email}</Text>
              {data.phone_number &&
                <Text style={styles.addressLine}>Ph: +{data.phone_number}</Text>
              }

            </View>
          </View>
        </View>
      </View>

      {/* Black Line under the address sections */}
      <View style={styles.horizontalLine} />

      {/* Order Details Section */}
      <View style={styles.orderInfoContainer}>
        <View style={styles.orderInfoSection}>
          <Text style={styles.orderHeader1}>Order ID</Text>
          <Text style={styles.orderValue1}>#{data.order}</Text>
        </View>
        <View style={styles.orderInfoSection}>
          <Text style={styles.orderHeader}>
            {String(data?.order).startsWith("G") ?
              'Grocery Store' :
              'Restaurant'
            }
          </Text>
          <Text style={styles.orderValue}>
            Cloudnet Travels,&nbsp;

            Wrexham</Text>
        </View>
        <View style={styles.orderInfoSection}>
          <Text style={styles.orderHeader}>Issued Date</Text>
          <Text style={styles.orderValue}>
            {data.created_at && formatDateTimeToMonthYear(data.created_at)}
          </Text>
        </View>
        <View style={styles.orderInfoSection}>
          <Text style={styles.orderHeaderLast}>Due Date</Text>
          <Text style={styles.orderValueLast}>
            {data.due_date && formatDateTimeToMonthYear(data.due_date)}
          </Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.tableSection}>
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColFixed}>
              <Text style={styles.tableHeadingCell}>SL.NO</Text>
            </View>
            <View style={styles.tableColFlexible}>
              <Text style={styles.tableHeadingCell}>ITEM</Text>
            </View>
            <View style={styles.tableColFixed}>
              <Text style={styles.tableHeadingCell}>QUANTITY</Text>
            </View>
            <View style={styles.tableColFixed}>
              <Text style={styles.tableHeadingCell}>PRICE</Text>
            </View>
            <View style={styles.tableColFixed}>
              <Text style={styles.tableHeadingCell}>TOTAL</Text>
            </View>
          </View>
          {/* Table Data */}
          {data.items && data.items.map((order_item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableColFixed}>
                <Text style={styles.tableCell}>{index + 1}</Text>
              </View>
              {/* <View style={styles.tableColFlexible}>
                <View>
                  <Text style={styles.tableCellFixed}>
                    {order_item.menu_item} {order_item.variant_name && `(${order_item.variant_name})`}
                  </Text>
                  {order_item.topping && (
                    <Text style={styles.toppingName}>+({order_item.topping})</Text>
                  )}
                </View>
              </View> */}
              <View style={styles.tableColFlexible}>
                <View>
                  <Text style={styles.tableCellFixed}>
                    {order_item.menu_item} {order_item.variant_name && `(${order_item.variant_name})`}
                  </Text>
                  {order_item.topping_name && order_item.topping_name.length > 0 && (
                    order_item.topping_name.split(",").map((name, index) => {
                      const count = order_item.topping_count.split(",")[index];
                      const price = parseFloat(order_item.topping_price.split(",")[index]);
                      return (
                        <View key={index} style={styles.toppingContainer}>
                          <Text style={styles.toppingName}>+ {name.trim()} (x{count})</Text>
                          {price > 0 && <Text style={styles.toppingPrice}>£{price.toFixed(2)}</Text>}
                        </View>
                      );
                    })
                  )}
                </View>
              </View>


              <View style={styles.tableColFixed}>
                <Text style={styles.tableCell}>{order_item.count}</Text>
              </View>
              <View style={styles.tableColFixed}>
                <Text style={styles.tableCell}>£{order_item.price}</Text>
              </View>
              <View style={styles.tableColFixed}>
                <Text style={styles.tableCell}>£{Number((order_item.count * order_item.price).toFixed(2)).toString()}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>


      <View style={styles.invoiceTotal}>
        <View >
          <Text style={styles.signature}></Text>
          <Text style={styles.thankYou}></Text>
        </View>

        <View style={styles.totalAmounts}>
          <View style={styles.subTotal} >
            <Text>SUB TOTAL:&nbsp; </Text>
            <Text> £{data.sub_total}</Text>
          </View>
          {/* Discounts */}
          {data.coupon_discount_applied_pounds > 0 && (
            <View style={styles.discount} >
              <Text>DISCOUNT (COUPON):&nbsp; </Text>
              <Text> £{data.coupon_discount_applied_pounds}</Text>
            </View>
          )}
          {data.wallet_amount_used > 0 && (
            <View style={styles.discount} >
              <Text>DISCOUNT (Wallet):&nbsp; </Text>
              <Text> £{data.wallet_amount_used}</Text>
            </View>
          )}
          {data.credit_balance_used > 0 && (
            <View style={styles.discount} >
              <Text>DISCOUNT (Credit Points):&nbsp; </Text>
              <Text> £{data.credit_balance_used}</Text>
            </View>
          )}
          {data.gift_card_amount > 0 && (
            <View style={styles.discount} >
              <Text>DISCOUNT (Gift Card):&nbsp; </Text>
              <Text> £{data.gift_card_amount}</Text>
            </View>
          )}
          <View style={styles.subTotal} >
            <Text>DELIVERY CHARGE:&nbsp; </Text>
            <Text> £{data.delivery_charge?.toFixed(2)}</Text>
          </View>
          <View style={styles.subTotal} >
            <Text>TAX:&nbsp; </Text>
            <Text> 0%</Text>
          </View>
          <View style={styles.total}>
            <Text>TOTAL:&nbsp; </Text>
            <Text> £{data.total_amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.invoiceFooter}>
        <Text style={styles.footerText}>
          Thank you for choosing Cloudnet Travels. We look forward to serving you again.
        </Text>

      </View>
    </Page>
  </Document>
);

export default invoicePDFGenerator;
