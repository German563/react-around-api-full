import React from "react";
import plus from "../images/plus.svg";
import Card from "./Card.js";
import pencil from "../images/pencil.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {
  const { cards } = props;

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="main">
      <section className="gallery">
        <div className="gallery__text">
          <div
            className="gallery__image"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
            onClick={props.onEditAvatar}
          >
            <img className="gallery__newImage" src={pencil} alt="pencil" />
          </div>

          <div className="gallery__wrapper gallery__eclipsis">
            <div className="gallery__column">
              <h1 className="gallery__header">{currentUser.name}</h1>

              <button
                className="gallery__pencil"
                type="button"
                onClick={props.onEditProfile}
              ></button>
            </div>
            <p className="gallery__subtext">{currentUser.about}</p>
          </div>
          <button
            className="gallery__button"
            onClick={props.onAddPlace}
            type="button"
          >
            <img src={plus} alt="plus icon" />
          </button>
        </div>
      </section>
      <section className="card">
        <ul className="card__area">
          {cards.map((item) => (
            <Card
              card={item}
              key={item._id}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
export default Main;
