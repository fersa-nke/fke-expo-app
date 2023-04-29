
import API from '../../services/Api';
// Define action types
import { GET_REPORTS, ADD_REPORT_ITEM, DELETE_REPORT_ITEM} from './../ReduxConsants';

// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/NKE-Tracebility/Jobs`;

export const getReports = () => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.GET(`${BASE_URL}`, token)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: GET_REPORTS,
                  payload: res.list,
                });
            } else {
                console.log('Unable to fetch Reports');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};

export const saveJobReport = reportData => dispatch => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.PATCH(`${BASE_URL}`, token, reportData)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: ADD_REPORT_ITEM,
                  payload: res,
                });
            } else {
                console.log('Unable to save job Report');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
  
};

export const removeReport = report => dispatch => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.DELETE(`${BASE_URL}/${report.Id}`, token)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: DELETE_REPORT_ITEM,
                  payload: res,
                });
            } else {
                console.log('Unable to DELETE job');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};