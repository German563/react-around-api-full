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

  getProfileData() {
    return this._request(`${this._address}/users/me`, {
      headers: {
        authorization: this._token,
      },
    });
  }

  getInitialCards() {
    return this._request(`${this._address}/cards`, {
      headers: {
        authorization: this._token,
      },
    });
  }

  addCardLike(id) {
    return this._request(`${this._address}/cards/likes/${id}`, {
      method: "PUT",
      headers: {
        authorization: this._token,
      },
    });
  }

  editUserProfile(values) {
    return this._request(`${this._address}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        about: values.about,
      }),
    });
  }

  changeLikeCardStatus(id) {
    return this._request(`${this._address}/cards/likes/${id}`, {
      method: "PUT",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    });
  }

  removeLike(id) {
    return this._request(`${this._address}/cards/likes/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    });
  }

  removeCard(id) {
    return this._request(`${this._address}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    });
  }

  addNewCard(values) {
    return this._request(`${this._address}/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        link: values.link,
      }),
    });
  }

  editAvatar(data) {
    return this._request(`${this._address}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }
}

export const api = new Api({
  address: 'https://herman.goldberg.api.crabdance.com',
  // token: "e311eb36-6a4d-4f2d-8784-2a64b37b741e",
});

