import Authservice from '../../services/AuthService';
const BASE_URL = ``;
import displayToast from '../../services/ToastService';


export function createRequest(data) {
    return async function requestThunk(dispatch, getState) {
    dispatch({ type: LOGIN_LOADING, payload: true });
   
    Authservice.POST(`RequestAccess`, data)
    .then(response => {
      console.log('user data--->', response);
      //Hide Loader
      if (response && response.success) {
        
      } else {
    
    }
  })
  .catch((error) => {
    console.log(error);
    displayToast('error', 'Unable to Login!');
      //Hide Loader
  });
  }
  }