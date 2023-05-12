import React from "react";
import { NavLink } from "react-router-dom";

const NavLinks = ({ cl }) => {
  return (
    <ul className={cl.nav_links}>
      <input type="checkbox" id="checkbox_toggle" />
      <label htmlFor="checkbox_toggle" className={cl.hamburger}>
        &#9776;
      </label>
      <div className={cl.menu}>
        <li>
          <NavLink to="/uitest">UI-test</NavLink>
        </li>
        <li>
          <NavLink to="/fd">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/fds">Login</NavLink>
        </li>
      </div>
    </ul>
  );
};

export default NavLinks;
