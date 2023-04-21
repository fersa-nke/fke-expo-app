
import API from '../../services/Api';
import { GET_JOBS, REMOVE_JOB_ITEM, ADD_JOB_ITEM } from '../ReduxConsants';
// Define action types

// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/NKE-Tracebility/Jobs`;

export const getJobs = () => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.GET(`${BASE_URL}`, token)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: GET_JOBS,
                  payload: res.list,
                });
            } else {
                console.log('Unable to fetch JOB');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};

export const saveJob = jobData => dispatch => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.PATCH(`${BASE_URL}`, token, jobData)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: ADD_JOB_ITEM,
                  payload: res,
                });
            } else {
                console.log('Unable to save job');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
  
};

export const removeJob = job => dispatch => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.DELETE(`${BASE_URL}/${job.Id}`, token)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: REMOVE_JOB_ITEM,
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