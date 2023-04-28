import { GET_SIGNED_USER, ADD_SIGNED_USER_DATA, REMOVE_USER_DATA, LOGIN_FAILED, LOGIN_LOADING, USER_LOGOUT } from '../ReduxConsants';
import Authservice from '../../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = `Auth/login`;


export function login(data) {
  return async function loginThunk(dispatch) {
    dispatch({ type: LOGIN_LOADING, payload: true });
    const response = await Authservice.postData(`${BASE_URL}`, { Email: data.username, Password: data.password });
    if (response.success) {
      dispatch({ type: ADD_SIGNED_USER_DATA, payload: response });
    } else {
      dispatch({ type: LOGIN_FAILED, payload: response });
    }
  }
}

export function logout() {
  return function logoutThunk(dispatch) {
    AsyncStorage.clear();
    dispatch({
      type: USER_LOGOUT,
      payload: null
    });
  }
};
