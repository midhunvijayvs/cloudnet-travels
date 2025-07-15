import React from 'react'


const LoadingSpinner=()=>{


    return(
        <div
style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '70vh'
}}
>
{/* <div className="spinner-border" role="status">
  <span className="sr-only "></span>
</div> */}
<img style={{height:"40px"}} src='/images/loader.gif'></img>
</div>
    )
} 

export default LoadingSpinner