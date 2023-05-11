import React from "react";

import cl from "./Button.module.css";

// type --> submit || reset
// size --> small || big

const Button = ({ label, disabled, onClick, type, size, inverse, danger }) => {
  return (
    <button
      className={`${cl.button} 
      ${size === "big" && cl.button__big} 
      ${size === "small" && cl.button__small}
      ${inverse && cl.button__inverse} 
      ${danger && cl.button__danger}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
