import React from "react";

import cl from "./ServerError.module.css";

const ServerError = ({ error }) => {
  return <div className={cl.error__container}>{error}</div>;
};

export default ServerError;
