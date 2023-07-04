import React from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  let navigate = useNavigate();
  const { onSignIn, loggedIn } = props;

  const [email, setEmail] = React.useState("");
  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  const [password, setPassword] = React.useState("");
  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSignIn({
      password,
      email,
    })
    setTimeout(() => {
      navigate("/cards");
    }, 1000); // Delay of 1 second (1000 milliseconds)
  }

  return (
    <main className="content">
      <div className="login-container">
        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <h2 className="login-form__title">Log in</h2>
          <input
            type="email"
            className="login-form__input"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleChangeEmail}
          />
          <div className="popup__form-error-container">
            <span className="email-error popup__form-error"></span>
          </div>
          <input
            type="password"
            className="login-form__input"
            id="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={handleChangePassword}
          />
          <div className="popup__form-error-container">
            <span className="password-error popup__form-error"></span>
          </div>
          <button type="submit" className="login-form__button button">
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
