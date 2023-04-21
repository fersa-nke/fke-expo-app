import { GET_SIGNED_USER, ADD_SIGNED_USER_DATA, REMOVE_USER_DATA, LOGIN_FAILED } from '../ReduxConsants';
import Authservice from '../../services/AuthService';
const BASE_URL = `Auth/login`;


export function login(data) {
  return async function loginThunk(dispatch) {
    const response = await Authservice.postData(`${BASE_URL}`, { Email: data.username, Password: data.password });
    console.log('login in response', response);
    if (response.success) {
      dispatch({ type: ADD_SIGNED_USER_DATA, payload: response });
    } else {
      dispatch({ type: LOGIN_FAILED, payload: response });
    }
  }
}

export function logout() {
  return function logoutThunk(dispatch) {
    dispatch({
      type: REMOVE_USER_DATA,
      payload: null
    });
  }
};
