import React, { Children } from "react";
import './CommonSection.css';

const CommonSection = ({ className, bgUrl, bgSize, bgPosition, paddingProp, children }) => {

  var commonSectionStyle;


  if (bgUrl) {
    if ((window.innerWidth >= 992)) {
      commonSectionStyle = {
        backgroundImage: `url(` + bgUrl + `)`,
        backgroundSize: "cover",
        WebkitBackgroundSize:"cover",
        MozBackgroundSize:"cover",
        OBackgroundSize: "cover",
        backgroundPosition: bgPosition,
        backgroundRepeat: "no-repeat",
      }
    }

    else {
      if ((768 <=window.innerWidth&& window.innerWidth<992)) {
        commonSectionStyle = {
          backgroundImage: `url(` + bgUrl + `)`,
          backgroundSize: "cover",
          WebkitBackgroundSize: "cover",
          MozBackgroundSize: "cover",
          OBackgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }
      }
      else {
         commonSectionStyle = {
          backgroundImage: `url(` + bgUrl + `)`,
          backgroundSize: "cover",
          WebkitBackgroundSize: "cover",
          MozBackgroundSize: "cover",
          OBackgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }
      }
    }
  }




  const cls = className + " common-section"


  return (
    <section className={cls} style={commonSectionStyle} >
      
        {children}



    </section>

  )
}

export default CommonSection