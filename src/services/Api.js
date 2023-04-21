import { serverURL } from './ServerURL';
import { useSelector } from 'react-redux';



export default API = {
  POST: async function (url = '', token = '', data = {}) {
    // Default options are marked with *1
    const response = await fetch(serverURL + '' + url, {
      method: 'POST',
      headers: {
        'x-access-token': `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
  },

  PATCH: async function (url = '', token = '', data = {}) {
    // Default options are marked with *1
    const response = await fetch(serverURL + '' + url, {
      method: 'PATCH',
      headers: {
        'x-access-token': `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
  },

  DELETE: async function (url = '', token = '', data = {}) {
    const Url = new URL(serverURL + '' + url);
    Object.keys(params).forEach(key => Url.searchParams.append(key, params[key]));
    console.log(Url);
    const myHeaders = new Headers({
      'x-access-token': `${token}`,
      'Content-Type': 'application/json',
    });
    const request = new Request(Url, {
      method: 'DELETE',
      headers: myHeaders
    });
    
    const response = await fetch(request);
    return response.json(); 
  },

  GET: async function (url = '', token = '', params = {}) {
    const Url = new URL(serverURL + '' + url);
    Object.keys(params).forEach(key => Url.searchParams.append(key, params[key]));
    console.log(Url);
    const myHeaders = new Headers({
      'x-access-token': `${token}`,
      'Content-Type': 'application/json',
    });
    const request = new Request(Url, {
      method: 'GET',
      headers: myHeaders
    });
    
    const response = await fetch(request);
    return response.json(); // parses JSON response into native JavaScript objects
  }
};
