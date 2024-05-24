let _cache = {};

let requestError= false ;
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
        'authorization': process.env.API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then(response => {
      if (response.status === 200 && response.ok) {
        return response.json();
      }else if (response.status === 429){
        requestError = true;
      }else {
        return Promise.reject({message: response.statusText});
      }
    }).catch(response => {
      return Promise.reject(response.message);
    });
  },
  getError : () =>{
    return requestError;
  }
};