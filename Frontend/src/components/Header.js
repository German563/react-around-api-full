import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Menu from "./Menu";
import headerLogo from "../../src/images/header__logo.svg";

function Header(props) {
  const { email, loggedIn, isMenuOpen, isMobile } = props;
  const location = useLocation();

  const signedInDesctop = (
    <>
      <div className="header__wrapper">
        <p
          className={`nav__item ${
            loggedIn && !isMobile ? "" : "login__button_hidden"
          }`}
        >
          {email}
        </p>
        <p
          onClick={props.onSignOut}
          className={`header_login__button ${
            loggedIn && !isMobile ? "" : "login__button_hidden"
          }`}
        >
          Log out
        </p>
      </div>
    </>
  );
  const signedInMobile = (
    <>
      <p
        className={`nav__item ${
          loggedIn && !isMobile ? "" : "login__button_hidden"
        }`}
      >
        {email}
      </p>
      <p
        onClick={props.onSignOut}
        className={`header_login__button ${
          loggedIn && !isMobile ? "" : "login__button_hidden"
        }`}
      >
        Log out
      </p>
    </>
  );

  const signedOutHeader = (
    <>
      {!isMobile && !loggedIn && (
        <>
          <NavLink
            to="/sign-up"
            className={`login__button ${
              location.pathname === "/sign-in" ? "" : "login__button_hidden"
            }`}
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/sign-in"
            onClick={props.onSignOut}
            className={`login__button ${
              location.pathname === "/cards" ? "" : "login__button_hidden"
            }`}
          >
            Log out
          </NavLink>
        </>
      )}
    </>
  );
  function headerOptions() {
    if (loggedIn && !isMobile) {
      return signedInDesctop;
    } else if (loggedIn && isMobile) {
      return signedInMobile;
    } else {
      return signedOutHeader;
    }
  }

  return (
    <header className="header_nav">
      <NavLink to="/cards">
        <img src={headerLogo} className="header__logo" alt="Logo" />
      </NavLink>

      {isMenuOpen && (
        <Menu
          onSignOut={props.onSignOut}
          email={props.email}
          isMenuOpen={props.isMenuOpen}
          onSignIn={props.onSignIn}
        />
      )}

      {isMobile && (
        <nav className="nav">
          <button
            className="nav__button"
            type="button"
            onClick={props.prepareHamburger}
          >
            <div
              className={`nav__button-line ${
                props.isMenuOpen ? "nav__button-line_closing" : ""
              }`}
            ></div>
            <div
              className={`nav__button-line ${
                props.isMenuOpen ? "nav__button-line_closing" : ""
              }`}
            ></div>
            <div
              className={`nav__button-line ${
                props.isMenuOpen ? "nav__button-line_closing" : ""
              }`}
            ></div>
          </button>
        </nav>
      )}

      {headerOptions()}
    </header>
  );
}

export default Header;
