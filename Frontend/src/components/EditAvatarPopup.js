import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarRef = React.useRef();
  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }
  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      name="avatar"
      title="Change profile picture"
      submitButtonText="Save"
    >
      <input
        className="popup__input popup__input_type_avatar-link"
        type="url"
        name="avatar"
        placeholder="Avatars Image link"
        required
        ref={avatarRef}
      />
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
