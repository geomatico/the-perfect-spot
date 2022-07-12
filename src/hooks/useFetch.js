import {useEffect, useReducer, useRef} from 'react';

const initialState = {
  isWaiting: false,
  data: null,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
  case 'REQUEST':
    return { ...initialState, isWaiting: true };
  case 'SUCCESS':
    return { ...initialState, isWaiting: false, data: action.payload };
  case 'ERROR':
    return { ...initialState, isWaiting: false, error: action.payload };
  default:
    return state;
  }
};

const useFetch = (url) => {
  const cache = useRef({});

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!url) return;

    dispatch({ type: 'REQUEST' });
    if (cache.current[url]) {
      dispatch({ type: 'SUCCESS', payload: cache.current[url] });
    } else {
      fetch(url)
        .then( response => {
          if (response.status === 200 && response.ok) {
            return response.json();
          } else {
            return Promise.reject( {
              message: `${url} ${response.status} ${response.statusText}`
            });
          }

        })
        .then(data => {
          cache.current[url] = data;
          dispatch({ type: 'SUCCESS', payload: data });
        })
        .catch(error => {
          console.log(JSON.stringify(error));
          dispatch({ type: 'ERROR', payload: error.message});
        });
    }
  }, [url]);

  return state;
};

export default useFetch;
