import {
  GET_SIGNED_USER,
  GET_API_Mapper,
  ADD_SIGNED_USER_DATA,
  REMOVE_USER_DATA,
  LOGIN_FAILED,
  LOGIN_LOADING,
  USER_LOGOUT,
  LOGOUT,
  CLEAR_JOBS_DATA,
  LOGIN_SUCCESS,
} from "../ReduxConsants";
import Authservice from "../../services/AuthService";
import { PURGE } from "redux-persist";
const BASE_URL = `auth/login`;
import { callAPI, getAPIMapper, getKEYMapper } from "../Master/MasterActions";
import displayToast from "../../services/ToastService";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("mydb.db");

export const offlineLogin = (payload) => {
  return {
    type: "OFFLINE_LOGIN",
    payload,
  };
};

const createTableForLogin = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS customers (
        Email TEXT PRIMARY KEY,
        Password TEXT
      );`,
        [],
        () => {
          console.log('Table "login" created successfully');
          resolve();
        },
        (error) => {
          console.error("Error creating login table:", error);
          reject();
        }
      );
    });
  });
};

const inserLoggedInUser = (response) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT OR IGNORE INTO customers (Email, Password) VALUES (?, ?)",
        [response.Email, response.Password],
        (_, results) => {
          resolve(
            "logged in user inserted successfully." + JSON.stringify(results)
          );
        },
        (_, error) => {
          console.error("Error inserting data: ", error);
          reject(error);
        }
      );
    });
  });
};

const getLoggedInUser = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM customers",
        [],
        (_, result) => {
          const rows = result.rows._array; // Convert the result to an array of objects
          resolve(rows);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export function login(data) {
  return async function loginThunk(dispatch, getState) {
    dispatch({ type: LOGIN_LOADING, payload: true });
    console.log(data);
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        createTableForLogin()
          .then((res) => console.log(res))
          .catch((e) => console.log(e));

        inserLoggedInUser({
          Email: data.email,
          Password: data.password,
        })
          .then((res) => console.log(res, "table inserted successfully"))
          .catch((e) => console.log(e));
        Authservice.POST(`${BASE_URL}`, {
          Email: data.email,
          Password: data.password,
        })
          .then((response) => {
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
            displayToast("error", "Unable to Login!");
            //Hide Loader
          });
      } else {
        getLoggedInUser()
          .then((res) => {
            console.log(res[0], "res-test");
            if (res !== undefined) {
              console.log("able to fetch the offline user");
              //dispatch({ type: ADD_SIGNED_USER_DATA, payload: res[0] });
              //Authservice.setRole(res[0].Role);
              // getUserInitConfig(dispatch);
              dispatch(offlineLogin(true));
            }
          })
          .catch((e) => {
            dispatch({ type: LOGIN_FAILED, payload: null });
          });
      }
    });
  };
}

function getUserInitConfig(dispatch) {
  dispatch(getAPIMapper());
  dispatch(getKEYMapper());
}

export function logout() {
  return function logoutThunk(dispatch, getState) {
    dispatch({
      type: LOGOUT,
      payload: null,
    });
    dispatch({
      type: USER_LOGOUT,
      payload: null,
    });
    dispatch({
      type: CLEAR_JOBS_DATA,
      payload: null,
    });

    displayToast("success", "Logout Success!");
    // dispatch({
    // 	type: PURGE,
    // 	key: "root",    // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
    //    result: () => null              // Func expected on the submitted action.
    // });
  };
}
