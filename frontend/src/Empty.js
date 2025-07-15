import React from 'react';



const EmptyTableMessage = ({ message }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <img style={{height:"40px", marginBottom:"10px"}} src="/images/no-data.png"></img>
        <p style={{fontSize: "11px", color:"grey", textDecoration:"italic",  width:"300px"}}>{message}</p>
      </div>
    </div>
  );
};

export default EmptyTableMessage;