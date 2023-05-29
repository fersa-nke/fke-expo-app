import { serverURL } from './ServerURL';
import { useSelector } from 'react-redux';
import Axios from "axios";


export default API = {
  UPLOAD: async function (url = '', token = '', data = {}) {
    // Default options are marked with *1
    const response = await Axios.post(serverURL + '' + url, data, {
      headers: {
        'x-access-token': `${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('uploading response--------->', response);
    return response; // parses JSON response into native JavaScript objects
  },

  DOWNLOAD: async function (url = '', token = '', data = {}) {
    // Default options are marked with *1
    const response = await Axios.post(serverURL + '' + url, data, {
      headers: {
        'x-access-token': `${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data; // parses JSON response into native JavaScript objects
  },

  POST: async function (url = '', token = '', data = {}) {
    // Default options are marked with *1
    const response = await Axios.post(serverURL + '' + url, data, {
      headers: {
        'x-access-token': `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return response.data; // parses JSON response into native JavaScript objects
  },

  PATCH: async function (url = '', token = '', data = {}) {
    // Default options are marked with *1
    const response = await Axios.patch(serverURL + '' + url, data, {
      headers: {
        'x-access-token': `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data; // parses JSON response into native JavaScript objects
  },

  DELETE: async function (url = '', token = '', params = {}) {
    const Url = serverURL + '' + url;
   // Object.keys(params).forEach(key => Url.searchParams.append(key, params[key]));
    console.log(Url);
    
    const myHeaders = new Headers({
      'x-access-token': `${token}`,
      'Content-Type': 'text/plain',
    });

    const request = new Request(Url, {
      method: 'DELETE',
      headers: myHeaders
    });
    
    // const response = await fetch(request);
    const response = await Axios.delete(Url, {
      params,
      headers: {
        'x-access-token': `${token}`,
        'Content-Type': 'application/json',
      }    
    });
    console.log(response.status);
    return response;
  },

  GET: async function (url = '', token = '', params = {}) {
   // const Url = new URL(serverURL + '' + url);
    const Url = serverURL+''+url;
   // const params = new URLSearchParams().toString();
   // Object.keys(params).forEach(key => Url.searchParams.append(key, params[key]));
    console.log(Url);
    const myHeaders = new Headers({
      'x-access-token': `${token}`,
      'Content-Type': 'application/json',
    });
    const request = new Request(Url, {
      method: 'GET',
      headers: myHeaders
    });
    console.log(params);
    // const response = await fetch(request);
    const response = await Axios.get(Url, {
      params,
      headers: {
        'x-access-token': `${token}`,
        'Content-Type': 'application/json',
      }      
    });
    console.log(response.data);
    return response.data; // parses JSON response into native JavaScript objects
  }
};
