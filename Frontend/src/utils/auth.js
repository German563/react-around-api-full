class Api {
  constructor({ address, token }) {
    this._address = address;
    this._token = token;
  }
  _header(customHeaders) {
    if (customHeaders) {
      return customHeaders;
    } else {
      return this._headers;
    }
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Error: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }
  register(data) {
    return this._request(`${this._address}/signup`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
  }

  authorize(data) {
    return this._request(`${this._address}/signin`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    });
  }

  checkToken() {
    return this._request(`${this._address}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
}
export const authApi = new Api({
  address: "https://register.nomoreparties.co",
  token: "e311eb36-6a4d-4f2d-8784-2a64b37b741e",
  headers: {
    "Content-Type": "application/json",
  },
});
