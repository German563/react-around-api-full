function ImagePopup({ card, onClose, isOpen }) {
  const { _id, link, name } = card;
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
      <div
        className={`popup popup_type_foto ${_id && card ? "popup_opened" : ""}`}
        style={{ backgroundImage: `url(${link})` }}
      >
        <button
          className="popup__close"
          id="closeButtonFoto"
          onClick={onClose}
        ></button>
        <div className="popup__content">
          <h3 className="popup__title-foto">{name}</h3>
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;
