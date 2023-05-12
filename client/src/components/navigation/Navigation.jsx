import React from "react";
import { NavLink } from "react-router-dom";

import NavLinks from "./NavLinks";

import cl from "./Navigation.module.css";

const Navigation = () => {
  return (
    <nav className={cl.navbar}>
      <NavLink to="/">
        <div className={cl.logo}>Logo Later</div>
      </NavLink>
      <NavLinks cl={cl} />
    </nav>
  );
};

export default Navigation;
