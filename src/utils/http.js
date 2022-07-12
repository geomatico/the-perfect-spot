let _cache = {};

export default {
  get: (url) => {
    return _cache[url] ?
      Promise.resolve(_cache[url])
      :
      fetch(url, {
        method: 'GET'
      }).then(response => {
        if (response.ok && response.status === 200) {
          return response.json();
        } else if (response.error) {
          throw(response.error);
        }
      }).then(json => {
        _cache[url] = json;
        return _cache[url];
      });
  },
  post: (url, body) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'authorization': '5b3ce3597851110001cf6248ab0ecc15618545b58c892918932e898a',
        'Content-Type': 'application/json',
   /*     'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'*/
      },
      body: JSON.stringify(body)
    }).then(response => {
      if (response.status === 200 && response.ok) {
        return response.json();
      } else {
        return Promise.reject({message: response.statusText});
      }
    }).catch(response => {
      return Promise.reject(response.message);
    });
  }
};