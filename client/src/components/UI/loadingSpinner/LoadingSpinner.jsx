import React from "react";

import cl from "./LoadingSpinner.module.css";

const LoadingSpinner = ({ asOverlay }) => {
  return (
    <div className={`${asOverlay && cl.loading_spinner__overlay}`}>
      <div className={cl.lds_dual_ring}></div>
    </div>
  );
};

export default LoadingSpinner;
