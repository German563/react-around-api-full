import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm.js";

function AddPlacePopup(props) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (props.isOpen) {
      setName("");
      setLink("");
    }
  }, [props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      name,
      link,
    });
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      name="add-card"
      title="New place"
      submitButtonText="Save"
    >
      <input
        className="popup__input"
        type="text"
        placeholder="Title"
        value={name}
        onChange={handleChangeName}
      />
      <input
        className="popup__input"
        type="url"
        placeholder="Image link"
        value={link}
        onChange={handleChangeLink}
      />
    </PopupWithForm>
  );
}

export default AddPlacePopup;
