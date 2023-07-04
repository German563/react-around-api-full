import React from "react";
import sucess from "../images/success.png";
import fail from "../images/fail.png";

function InfoTooltip(props) {
  const { state, onClose } = props;
  const { open, result, message } = state;

  function handleOverlayClose(evt) {
    if (evt.target.classList.contains("popup")) {
      onClose();
    }
  }

  return (
    <div
      className={`popup ${open ? "popup_opened" : ""}`}
      onClick={handleOverlayClose}
    >
      <div className=" popup__container_tooltip">
        <button
          className="popup__close"
          id="closeButtonFoto"
          onClick={onClose}
        ></button>
        <img
          src={result ? sucess : fail}
          className="popup__tooltip-image"
          alt={result ? "success!" : "fail!"}
        />
        <h2 className="popup__tooltip-title">
          {result
            ? "Success! You have now been registered."
            : `Oops, something went wrong! Please try again.`}
        </h2>
        <p className="nav__email">{message}</p>
      </div>
    </div>
  );
}

export default InfoTooltip;
