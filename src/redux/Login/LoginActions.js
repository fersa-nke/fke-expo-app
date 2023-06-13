import { GET_SIGNED_USER, GET_API_Mapper, ADD_SIGNED_USER_DATA, REMOVE_USER_DATA, LOGIN_FAILED, LOGIN_LOADING, USER_LOGOUT, LOGOUT, CLEAR_JOBS_DATA, LOGIN_SUCCESS } from '../ReduxConsants';
import Authservice from '../../services/AuthService';
import { PURGE } from 'redux-persist';
const BASE_URL = `auth/login`;
import  { callAPI, getAPIMapper ,getKEYMapper} from "../Master/MasterActions";
import displayToast from '../../services/ToastService';

export function login(data) {
  return async function loginThunk(dispatch, getState) {
  dispatch({ type: LOGIN_LOADING, payload: true });
 
  Authservice.POST(`${BASE_URL}`, { Email: data.email, Password: data.password })
  .then(response => {
    console.log('user data--->', response);
    //Hide Loader
    if (response && response.success) {
      dispatch({ type: ADD_SIGNED_USER_DATA, payload: response });
      Authservice.setRole(response.Role);
      getUserInitConfig(dispatch);
    } else {
    dispatch({ type: LOGIN_FAILED, payload: null });
    }
})
.catch((error) => {
  console.log(error);
  displayToast('error', 'Unable to Login!');
    //Hide Loader
});
}
}

function getUserInitConfig(dispatch) {
  dispatch(getAPIMapper());
  dispatch(getKEYMapper());
}


export function logout() {
  return function logoutThunk(dispatch, getState) {
    
    dispatch({
      type: LOGOUT,
      payload: null
    });
    dispatch({
      type: USER_LOGOUT,
      payload: null
    });
    dispatch({
      type: CLEAR_JOBS_DATA,
      payload: null
    });
    
    displayToast('success', 'Logout Success!');
    // dispatch({ 
		// 	type: PURGE,
		// 	key: "root",    // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
		//    result: () => null              // Func expected on the submitted action. 
		// });

  }
};
