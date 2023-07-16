class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _header(customHeaders) {
    if (customHeaders) {
      return customHeaders;
    } else {
      const token = localStorage.getItem("token") || "";
      return {
        ...this._headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      };
    }
  }

  _apiRequest(urlEnd, method, body, customHeaders) {
    const headers = this._header(customHeaders);

    const requestOptions = {
      method: method,
      headers: headers,
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    return fetch(`${this._baseUrl}${urlEnd}`, requestOptions).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  register(data) {
    return this._apiRequest("/signup", "POST", {
      password: data.password,
      email: data.email,
    });
  }

  authorize(data) {
    return this._apiRequest("/signin", "POST", {
      password: data.password,
      email: data.email,
    });
  }

  checkToken() {
    return this._apiRequest("/users/me", "GET", null, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
  }

  getProfileData() {
    return this._apiRequest("/users/me", "GET", null, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
  }

  getInitialCards() {
    return this._apiRequest("/cards", "GET", null, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
  }

  addCardLike(id) {
    return this._apiRequest(`/cards/${id}/likes`, "PUT", {
      "Content-Type": "application/json",
    });
  }

  editUserProfile(userInfo) {
    return this._apiRequest(
      "/users/me",
      "PATCH",
      {
        name: userInfo.name,
        about: userInfo.about,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    );
  }

  removeLike(id) {
    return this._apiRequest(`/cards/${id}/likes`, "DELETE", {
      "Content-Type": "application/json",
    });
  }

  removeCard(id) {
    return this._apiRequest(`/cards/${id}`, "DELETE", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
  }

  addNewCard(card) {
    return this._apiRequest(
      "/cards",
      "POST",
      {
        name: card.name,
        link: card.link,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    );
  }

  editAvatar(data) {
    return this._apiRequest(
      "/users/me/avatar",
      "PATCH",
      {
        avatar: data,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    );
  }
}

export const api = new Api({
  baseUrl: "https://herman.goldberg.api.crabdance.com/",
});

export const authApi = new Api({
  baseUrl: "https://herman.goldberg.api.crabdance.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
