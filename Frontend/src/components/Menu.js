import { NavLink, useLocation } from 'react-router-dom';
import React from "react";

function Menu(props) {
  const { onSignOut, email, isMenuOpen, loggedIn } = props;
  const location = useLocation();

  const [isMobile, setMobile] = React.useState(() => {
    if (window.innerWidth < 700) {
      return true;
    } else {
      return false;
    }
  });

const signIn = (
  <div className='nav__container'>
    <div className="nav__item">
      {isMobile && (
        <NavLink to='/sign-in'>
          <span className={`login__button ${location.pathname === '/sign-up' ? '' : 'login__button_hidden'}`}>
            Log in
          </span>
        </NavLink>
      )}
    </div>
    {isMobile && (
      <NavLink to='/sign-up'>
        <span className={`login__button ${location.pathname === '/sign-in' ? '' : 'login__button_hidden'}`}>
          Sign Up
        </span>
      </NavLink>
    )}
    {isMobile && (
      <>
        <p className="nav__item email__item">{email}</p>
        <NavLink to='/sign-in' className="login__button" onClick={onSignOut}>
          <span className={`login__button ${location.pathname === '/cards' ? '' : 'login__button_hidden'}`}>
            Log out
          </span>
        </NavLink>
      </>
    )}
  </div>
);

  


  function mobile_menu() {
      return signIn
  }


  return (
    <>
    {mobile_menu()}
    </>
  );
}


export default Menu;
