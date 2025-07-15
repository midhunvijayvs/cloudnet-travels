
import React, { useState } from "react";

import { useNavigate } from 'react-router-dom';

const FloatingMobileNavbar = () => {


  const enable=true;
  let navigate = useNavigate();

  const [activeTabIndex, selectTab]=useState(0)

  const menuItemNormalStyle={
    
    display: "flex",
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 'fit-content',
    backgroundColor: "transparent",
    borderRadius: "17px",
    padding: "5px 10px",
    curser:"pointer"
  }
  

  const menuItemActiveStyle={
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '35%',
    backgroundColor: "#fff",
    borderRadius: "17px",
    padding: "5px 10px",
  }
  

  return (
    <div
      style={{
        display:enable?'flex':"none",
        position: 'fixed',
        zIndex: 998,
        bottom: '0px',
        left: '0',
        right: '0',
        backgroundColor: '#d11b4b',
        // boxShadow: '0px -2px 4px #1C9050',
        height: '90px', // Adjust the height as needed
        justifyContent: 'space-around',
        alignItems: 'center',
        width: "100%",
        borderRadius: "0px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "10px"
      }}
    >


      <div
        style={activeTabIndex==0?menuItemActiveStyle:menuItemNormalStyle}
        className="menu-item"
        onClick={() => {selectTab(0); navigate("/")}}
      >
        {/* Replace 'icon1.svg' with your SVG icon */}
        <img  style={{height:"25px"}} src={activeTabIndex==0?"/images/floating-mobile-navbar/home-dark.svg":"/images/floating-mobile-navbar/home-light.svg"} alt="Icon 1" />
        {activeTabIndex==0&&<span style={{ color: "#d11b4b", fontSize:"15px" }}>Home</span>}
      </div>


      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '15%',
        }}
        onClick={() => navigate("/")}
      >
       
        <img src="/images/floating-mobile-navbar/search.svg" alt="Icon 2" />
      </div> */}



      <div
       style={activeTabIndex==1?menuItemActiveStyle:menuItemNormalStyle}
        className="menu-item"
        onClick={() => {selectTab(1); navigate("/checkout-address")}}
      >
        {/* Replace 'icon3.svg' with your SVG icon */}
        <img style={{height:"25px"}} src={activeTabIndex==1?"/images/floating-mobile-navbar/cart-dark.svg":"/images/floating-mobile-navbar/cart-light.svg"} alt="Icon 1" />
        {activeTabIndex==1&&<span style={{ color: "#d11b4b", fontSize:"15px" }}>Cart</span>}
        </div>


      <div
        style={activeTabIndex==2?menuItemActiveStyle:menuItemNormalStyle}
        className="menu-item"
        onClick={() => {selectTab(2); navigate("/orders")}}
      >
        {/* Replace 'icon4.svg' with your SVG icon */}
        <img style={{height:"25px"}} src={activeTabIndex==2?"/images/floating-mobile-navbar/orders-dark.svg":"/images/floating-mobile-navbar/orders-light.svg"} alt="Icon 1" />
        {activeTabIndex==2&&<span style={{ color: "#d11b4b", fontSize:"15px" }}>Orders</span>}
        </div>

      
      <div
        style={activeTabIndex==3?menuItemActiveStyle:menuItemNormalStyle}
        className="menu-item"
        onClick={() => {selectTab(3); navigate("/profile")}}
      >
        {/* Replace 'icon5.svg' with your SVG icon */}
        <img style={{height:"25px"}} src={activeTabIndex==3?"/images/floating-mobile-navbar/user-dark.svg":"/images/floating-mobile-navbar/user-light.svg"} alt="Icon 1" />
        {activeTabIndex==3&&<span style={{ color: "#d11b4b", fontSize:"15px" }}>Profile</span>}
        </div>
      
    </div>
  );
};

export default FloatingMobileNavbar;
