import { GET_SIGNED_USER, ADD_SIGNED_USER_DATA, REMOVE_USER_DATA, LOGIN_FAILED, LOGIN_LOADING, USER_LOGOUT } from '../ReduxConsants';
import Authservice from '../../services/AuthService';
import { PURGE } from 'redux-persist';
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
    dispatch({ 
			type: PURGE,
			key: "root",    // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
		   result: () => null              // Func expected on the submitted action. 
		});  

    dispatch({
      type: USER_LOGOUT,
      payload: null
    });
  }
};
