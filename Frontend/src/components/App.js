import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Menu from "./Menu";
import Footer from "./Footer";
import Register from "./Register";
import ImagePopup from "./ImagePopup.js";
import { api } from "../utils/api";
import { authApi } from "../utils/auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import Login from "./Login.js";

function App() {
  
  const [loggedIn, setLoggedIn] = React.useState(checkLoggedIn());
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isBackPopupOpen, setBackPopupOpen] = React.useState(false);
  const [isLoginPopupOpen, setLoginPopupOpen] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(true);
  function prepareHamburger() {
    setMenuOpen(!isMenuOpen);
  }
  const [isMobile, setMobile] = React.useState(() => {
    if (window.innerWidth < 700) {
      return true;
    } else {
      return false;
    }
  });
  
  const [email, setEmail] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState(
    {
      avatar:
        "",
      name: "",
      about: "",
    },
    []
  );
  React.useEffect(() => {
    api
      .getProfileData()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  const [tooltipPopupState, setTooltipPopupState] = React.useState({
    open: false,
    result: false,
    message: "",
  });

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setBackPopupOpen(true);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  
  }

  function handleUpdateUser(user) {
    api
      .editUserProfile(user)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      })
      .finally((error) => {
        console.log("Update user request completed.", error);
      });
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setBackPopupOpen(false);
    setLoginPopupOpen(false);
    setSelectedCard({});
    setTooltipPopupState({
      ...tooltipPopupState,
      open: false,
      result: false,
      message: "",
    });
  }
  function handleTooltipOpen(result, message) {
    setTooltipPopupState({
      open: true,
      result: result,
      message: message,
    });
  }
  const [cards, setCards] = React.useState([]);

  function onSignUp(email, password) {
    authApi
      .register(email, password)
      .then(() => {
        setLoggedIn(true);
        handleTooltipOpen(true);
      })
      .then(() => {
        setTimeout(() => {
          onSignIn(email, password);
          setLoggedIn(true);
          closeAllPopups();
        }, 1500);
      })
      .catch((err) => {
        handleTooltipOpen(false, `Try again: ${err}`);
      });
  }
  function checkLoggedIn() {
    return localStorage.getItem("token");
  }
  function onSignIn(data) {
    authApi
      .authorize(data)
      .then((res) => {
        setLoggedIn(true);
        localStorage.setItem("token", res.token);
        setEmail(data.email);
        handleTooltipOpen(true);
      })
      .catch((err) => {
        handleTooltipOpen(false, `Can't login: ${err}`);
      });
  }

  React.useEffect(() => {
    const onEscape = (evt) => {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, []);
  function checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      authApi
        .checkToken(token)
        .then(() => {
          setLoggedIn(true);
        })
        .catch((err) => {
          if (err === 401) {
            setLoggedIn(false)
            console.log("Wrong token");
          }
        });
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    function updateCards(newCard) {
      const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
      setCards(newCards);
    }
    if (isLiked) {
      api
        .removeLike(card._id)
        .then((newCard) => {
          updateCards(newCard);
        })
        .catch((err) => console.log(err));
    } else {
      api
        .changeLikeCardStatus(card._id)
        .then((newCard) => {
          updateCards(newCard);
        })
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete(card) {
    const isOwn = card.owner._id === currentUser._id;
    if (isOwn) {
      api
        .removeCard(card._id)
        .then(() => {
          const newCards = cards.filter((c) => c._id !== card._id);
          setCards(newCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleUpdateAvatar(avatar) {
    api
      .editAvatar(avatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddCard(data) {
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
  function onSignOut() {
    localStorage.removeItem("token");
    window.location.reload();
    setLoggedIn(false);
    setEmail("")
  }
  React.useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    checkToken();
  }, [email]);
  React.useEffect(() => {
    const onScreenChange = () => {
      if (window.innerWidth < 700) {
        setMobile(true);
      } else {
        setMobile(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onScreenChange);

    return () => {
      window.removeEventListener("resize", onScreenChange);
    };
  }, []);

  return (
    <Router>
      <div className="body">
        <CurrentUserContext.Provider value={currentUser}>
          <div className={isMenuOpen ? "page nav_menu_opened" : "page"}>
            <div className="page__background "></div>
            <Menu
              onSignOut={onSignOut}
              email={email}
              isMenuOpen={isMenuOpen}
              onSignIn={onSignIn}
              setEmail={setEmail}
            />
            <Header

              onSignIn={onSignIn}
              checkToken={checkToken}
              email={email}
              loggedIn={loggedIn}
              onSignOut={onSignOut}
              isMenuOpen={isMenuOpen}
              prepareHamburger={prepareHamburger}
              isMobile={isMobile}
            />
            <Routes>
              <Route
                path="/sign-in"
                loggedIn={loggedIn}
                email={email}
                element={<Login onSignIn={onSignIn} />}
              />
              <Route
                path="/sign-up"
                email={email}
                loggedIn={loggedIn}
                element={
                  <Register onSignUp={onSignUp} isOpen={isLoginPopupOpen} />
                }
              />
              <Route
                path="/*"
                element={
                  <ProtectedRoute loggedIn={loggedIn}>
                    <Main
                      email={email}
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onEditAvatar={handleEditAvatarClick}
                      cards={cards}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
            <InfoTooltip state={tooltipPopupState} onClose={closeAllPopups} />
            <ImagePopup
              onClose={closeAllPopups}
              card={selectedCard}
              isOpen={isBackPopupOpen}
            />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />
            <AddPlacePopup
              onClose={closeAllPopups}
              isOpen={isAddPlacePopupOpen}
              onAddPlace={handleAddCard}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
          </div>
        </CurrentUserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
