class Api {
  constructor({ address }) {
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

  _apiRequest(url, method, headers = {}, body = {}) {
    const requestOptions = {
      method: method,
      headers: {
        ...headers,
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    };

    return this._request(`${this._address}${url}`, requestOptions);
  }

  getProfileData() {
    return this._apiRequest('/users/me', 'GET');
  }

  getInitialCards() {
    return this._apiRequest('/cards', 'GET');
  }

  addCardLike(id) {
    return this._apiRequest(`/cards/likes/${id}`, 'PUT', {
      'Content-Type': 'application/json',
    });
  }

  editUserProfile(values) {
    return this._apiRequest('/users/me', 'PATCH', {
      'Content-Type': 'application/json',
    }, {
      name: values.name,
      about: values.about,
    });
  }

  changeLikeCardStatus(id) {
    return this._apiRequest(`/cards/likes/${id}`, 'PUT', {
      'Content-Type': 'application/json',
    });
  }

  removeLike(id) {
    return this._apiRequest(`/cards/likes/${id}`, 'DELETE', {
      'Content-Type': 'application/json',
    });
  }

  removeCard(id) {
    return this._apiRequest(`/cards/${id}`, 'DELETE', {
      'Content-Type': 'application/json',
    });
  }

  addNewCard(values) {
    return this._apiRequest('/cards', 'POST', {
      'Content-Type': 'application/json',
    }, {
      name: values.name,
      link: values.link,
    });
  }

  editAvatar(data) {
    return this._apiRequest('/users/me/avatar', 'PATCH', {
      'Content-Type': 'application/json',
    }, {
      avatar: data.avatar,
    });
  }
}

export const api = new Api({
  address: 'https://herman.goldberg.api.crabdance.com',
});
