import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";

const Layout = () => {
  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
      <footer style={{ marginTop: 100 }}>Footer</footer>
    </div>
  );
};

export default Layout;
