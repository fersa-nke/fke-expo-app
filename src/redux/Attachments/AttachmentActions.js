
import API from '../../services/Api';
// Define action types
import {GET_ATTACHMENTS, ADD_ATTACHMENT_ITEM, DELETE_ATTACHMENT_ITEM} from './../ReduxConsants';
import { KEYMapper as JobMapper } from '../../services/UserConfig';
// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/FG-MRO-Tracker/Attachments`;

export const getAttachments = (jobId) => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    let squery = '(RefId,eq,'+jobId+')~and(Type,eq,JobReport)';
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

export const saveReportAttachment = (file, type, jobId) => {
  return async (dispatch, getState) => {
    console.log(file, type, jobId);
    const token = getState().userReducer.token;
    let data = new FormData();
    data.append('file', file);
    data.append('type', type);
    data.append('refId', jobId);
    console.log(data);
    API.UPLOAD(`nocodb/upload`, token, data)
        .then(res => {
            //Hide Loader
            console.log(res);
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


export const downloadAttachment = attachment => {
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

export const removeAttachment = attachment => {
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