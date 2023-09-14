import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { Modal as BootstrapModal } from "react-bootstrap";

function Modal({ children, show, handleClose, title,size }) {
  return (
    <BootstrapModal show={show} onHide={handleClose} size={size} centered>
      <BootstrapModal.Header>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
        <i className="fa fa-times CloseModal"  onClick={handleClose}></i>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
      {children}
      </BootstrapModal.Body>
    </BootstrapModal>
  );
}
export default Modal;
