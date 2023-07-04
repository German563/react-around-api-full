import React from "react";

function PopupWithForm({
  isOpen,
  onClose,
  name,
  title,
  children,
  submitButtonText,
  onSubmit,
}) {
  function handleOverlayClose(evt) {
    if (evt.target.classList.contains("page__background")) {
      onClose();
    }
  }

  return (
    <div>
      <div
        onClick={handleOverlayClose}
        className={`page__background ${
          isOpen ? "page__background_opened" : ""
        }`}
      ></div>
      <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
        <form className="popup__container" name={name} onSubmit={onSubmit}>
          <button type="button" className="popup__close" onClick={onClose} />
          <h2 className="popup__title">{title}</h2>
          {children}
          <button type="submit" className="popup__button">
            {submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
