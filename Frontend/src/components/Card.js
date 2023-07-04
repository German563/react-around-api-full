import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  const { name, link, likes } = card;

  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = `card__delete-button ${
    isOwn ? "card__delete-button" : "card__delete-button_hidden"
  }`;

  const isLiked = card.likes.some((user) => user._id === currentUser._id);

  const cardLikeButtonClassName = `card__button card__background ${
    isLiked && "card__background_active"
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }
  function handleCardDelete() {
    onCardDelete(card);
  }

  return (
    <li className="card__gallery">
      <div className="card__wrapper">
        <button
          type="button"
          id="deleteButton"
          className={cardDeleteButtonClassName}
          onClick={handleCardDelete}
        ></button>
        <img
          id="myImage"
          className="card__image"
          src={link}
          alt={name}
          onClick={handleClick}
        />
      </div>
      <div className="card__text">
        <h2 className="card__ellipsis">{name}</h2>
        <button
          id="heart"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        ></button>
      </div>
      <span className="card__likes">{likes.length}</span>
    </li>
  );
}

export default Card;
