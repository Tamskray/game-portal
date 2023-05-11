import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <header>
        <NavLink to="/"> Home</NavLink>
        <NavLink to="/uitest">UI-Test</NavLink>
      </header>
      <main>
        <Outlet />
      </main>
      <footer style={{ marginTop: 100 }}>Footer</footer>
    </div>
  );
};

export default Layout;
