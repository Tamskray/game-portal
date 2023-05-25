import React from "react";
import ReactDOM from "react-dom";

import cl from "./Backdrop.module.css";

const Backdrop = ({ onClick }) => {
  return ReactDOM.createPortal(
    <div className={cl.backdrop} onClick={onClick}></div>,
    document.getElementById("backdrop-hook")
  );
};

export default Backdrop;
