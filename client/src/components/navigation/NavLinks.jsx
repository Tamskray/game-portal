import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = ({ cl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ul className={cl.nav_links}>
      <input
        type="checkbox"
        id="checkbox_toggle"
        onChange={() => setIsMenuOpen(!isMenuOpen)}
        checked={isMenuOpen}
      />
      <label htmlFor="checkbox_toggle" className={cl.hamburger}>
        &#9776;
      </label>
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`${cl.menu} menu ${isMenuOpen && "open"}`}
      >
        <li>
          <NavLink to="/uitest">UI-test</NavLink>
        </li>
        <li>
          <NavLink to="/posts">Пости</NavLink>
        </li>
        <li>
          <NavLink to="/login">Увійти</NavLink>
        </li>
      </div>
    </ul>
  );
};

export default NavLinks;
