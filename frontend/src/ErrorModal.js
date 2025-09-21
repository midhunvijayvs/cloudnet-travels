import React from 'react';
import { Modal } from "react-bootstrap";


const ErrorModal = ({title,message, state, setterFunction, okClickedFunction }) => {

 
    const closeModal = () => {
      setterFunction(false);
    }

    const okClicked=()=>{
      okClickedFunction();
      setterFunction(false)
    }
  return (


    <Modal show={state} className="app-modal">

      <Modal.Header closeButton onClick={closeModal}>
        <Modal.Title> <h4 className="modal-title" id="errorModalLabel" style={{ color: 'red', lineHeight: '1' }}>{title?title:'Error'}</h4></Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p style={{ color: 'red', fontSize: '16px', lineHeight: '1.4' , minHeight:"4rem"}}>{message}</p>
      </Modal.Body>


      <Modal.Footer>
        <button className='btn btn-danger' onClick={okClicked}>Ok</button>

      </Modal.Footer>

    </Modal>

  );
};

export default ErrorModal;
