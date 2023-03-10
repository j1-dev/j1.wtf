import React from "react";
import { NavLink } from "react-router-dom";

/**
 * @component
 * React component for rendering a navigation bar for the login page of the website.
 *
 * @function
 * @name LogInNavbar
 *
 * @returns {JSX.Element} The rendered React element representing the login navigation bar.
 *
 * @requires react
 * @requires react-router-dom
 */

const LogInNavbar = () => {
  return (
    <nav
      className=" z-50 mx-0 list-none  overflow-hidden
                      bg-white pt-20 transition-all"
    >
      <div className="inline-flex">
        <NavLink
          className={({ isActive }) =>
            isActive ? "button-active" : "button-still"
          }
          to="/Login"
        >
          Login
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "button-active" : "button-still"
          }
          to="/Register"
        >
          Register
        </NavLink>
      </div>
    </nav>
  );
};

export default LogInNavbar;
