import React from 'react'

const ConfirmPopup = ({ message, title, setterFunction, okClickedFunction, source }) => {
  const okClicked = () => {
    okClickedFunction();
    setterFunction(false)
  }

  return (
    <div className='custom-modal '>
      <div className='card'>
        <div className='first-screen'>
          <img src='/images/icons/svg/warning.svg'></img>
          <h1>{title}</h1>
          <p>{message}</p>

          <div className='footer mt-2'>
            <button type='button' className='btn-outlined' onClick={() => setterFunction(false)}>Cancel</button>
            <button type='button' className='btn-primary' onClick={okClicked}>
              {source === 'remove_cart_item' ?
                'Remove' :
                'Proceed'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPopup