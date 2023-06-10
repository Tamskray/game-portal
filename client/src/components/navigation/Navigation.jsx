import React from "react";
import { NavLink } from "react-router-dom";

import NavLinks from "./NavLinks";

// import Logo from "../../../public/game-svg.svg";
import Logo from "../../assets/game-svg.svg";
import cl from "./Navigation.module.css";

const Navigation = () => {
  return (
    <nav className={cl.navbar}>
      <NavLink to="/">
        <div className={cl.logo}>
          <img src={Logo} alt="logo" />
          {/* <span>TMP</span> */}
        </div>
      </NavLink>
      <NavLinks cl={cl} />
    </nav>
  );
};

export default Navigation;
