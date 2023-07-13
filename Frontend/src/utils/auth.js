class Api {
  constructor({ address}) {
    this._address = address;
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

  register(password, email) {
    return this._request(`${this._address}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email })
    });
  }

  authorize(data) {
    return this._request(`${this._address}/signin`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this._token}`,
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
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  }
}

export const authApi = new Api({
  address: 'https://herman.goldberg.api.crabdance.com',
  headers: {
    'Content-Type': 'application/json'
  },
});
