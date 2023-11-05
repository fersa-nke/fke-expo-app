import {
  LOGIN_SUCCESS,
  ADD_SIGNED_USER_DATA,
  LOGIN_FAILED,
  REMOVE_USER_DATA,
  LOGIN_LOADING,
  LOGOUT,
} from "../ReduxConsants";

const initialState = {
  user: null,
  message: "",
  token: null,
  isAuthenticate: false,
  failed: false,
  loading: false,
  localAuth: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SIGNED_USER_DATA:
      return {
        ...state,
        user: action.payload,
        message: "Login Success!",
        token: action.payload.token,
        failed: false,
        localAuth: false,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        user: null,
        message: "Login Failed!",
        token: null,
        failed: true,
        isAuthenticate: false,
        loading: false,

        localAuth: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticate: true,
        loading: false,

        localAuth: false,
      };
    case LOGIN_LOADING:
      return {
        ...state,
        loading: action.payload,
        message: "",

        localAuth: false,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticate: false,
        message: "Logout Success!",

        localAuth: false,
      };
    case REMOVE_USER_DATA:
      return {
        ...state,
        user: null,
        message: "",
        token: null,
        isAuthenticate: false,
        failed: false,
        loading: false,
      };
    case "OFFLINE_LOGIN":
      return {
        ...state,
        localAuth: action.payload,
      };
    default:
      return state;
  }
}
