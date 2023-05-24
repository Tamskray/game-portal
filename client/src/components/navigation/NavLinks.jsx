import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

const NavLinks = ({ cl }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
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
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/uitest">UI-test</NavLink>
          </li>
        )}
        <li>
          <NavLink to="/posts">Пости</NavLink>
        </li>
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/login">Увійти</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button
              onClick={() => {
                auth.logout();
                // navigate("/");
              }}
            >
              Вийти
            </button>
          </li>
        )}
      </div>
    </ul>
  );
};

export default NavLinks;
