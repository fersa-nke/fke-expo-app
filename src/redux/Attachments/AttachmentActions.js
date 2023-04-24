
import API from '../../services/Api';
// Define action types
import {GET_ATTACHMENTS, ADD_ATTACHMENT_ITEM, DELETE_ATTACHMENT_ITEM} from './../ReduxConsants';

// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/NKE-Tracebility/Jobs`;

export const getAttachments = () => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.GET(`${BASE_URL}`, token)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: GET_ATTACHMENTS,
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

export const saveReportAttachment = attachmentData => dispatch => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.PATCH(`${BASE_URL}`, token, attachmentData)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: ADD_ATTACHMENT_ITEM,
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

export const removeAttachment = attachment => dispatch => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.DELETE(`${BASE_URL}/${attachment.Id}`, token)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: DELETE_ATTACHMENT_ITEM,
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