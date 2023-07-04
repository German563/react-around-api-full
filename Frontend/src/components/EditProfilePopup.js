import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
function EditProfilePopup(props) {
  const { isOpen, onClose, onUpdateUser } = props;
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="edit-profile"
      title="Edit profile"
      submitButtonText="Save"
    >
      <input
        className="popup__input"
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleChangeName}
      />
      <input
        className="popup__input"
        type="text"
        placeholder="Profession"
        value={description}
        onChange={handleChangeDescription}
      />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
