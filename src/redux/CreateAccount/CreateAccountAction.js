import API from '../../services/Api';
import Authservice from '../../services/AuthService';
const BASE_URL = ``;
import displayToast from '../../services/ToastService';
import { APIConfig } from '../../services/UserConfig';
import { GET_CUSTOMER_SECTOR, GET_COUNTRIES, LOADING_DATA } from '../ReduxConsants';

export const getCountries = () => {
  return callAPI(APIConfig.COUNTRY, GET_COUNTRIES);
}

export const getCustomerSectors = () => {
  return callAPI(APIConfig.CUSTOMERSECTOR, GET_CUSTOMER_SECTOR);
}


export function createRequest(data, callBack) {
    return async function requestThunk(dispatch, getState) {
    dispatch({ type: LOADING_DATA, payload: true });
    const URL = 'RequestAccess';  
    Authservice.POST(`nocodb/data/FG-MRO-Tracker/${URL}`, data)
    .then(response => {
    console.log('user data--->', response);
    //Hide Loader
        dispatch({
          type: LOADING_DATA,
          payload: false,
        });
      if (response) {
        displayToast('success','Created Successfully!');
        callBack();
      } else {
        displayToast('error', 'Unable to Create Account');
    }
    
  })
  .catch((error) => {
    displayToast('error', 'Something went wrong!');
    console.log('error -------------->', error);
    //Hide Loader
    dispatch({
        type: LOADING_DATA,
        payload: false,
    });
  });
  }
}

export function callAPI(URL, dispatchType, token = '') {
  return async (dispatch, getState) => {
      API.GET(`nocodb/data/FG-MRO-Tracker/${URL}`, token)
          .then(res => {
              //Hide Loader
              try {
              if (res) {
                  dispatch({
                      type: dispatchType,
                      payload: res.list,
                  });
              } else {
                  console.log('Unable to fetch');
              }
          }
          catch(e) {
              console.log('error------------->', e);
          }

          })
          .catch((error) => {
              console.log('error -------------->', error);
              //Hide Loader
          }); // JSON data parsed by `data.json()` call
  }
};