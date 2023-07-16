
import { Platform } from "react-native";
import API from '../../services/Api';
import mime from "mime";

// Define action types
import {GET_ATTACHMENTS, ADD_ATTACHMENT_ITEM, DELETE_ATTACHMENT_ITEM ,DOWNLOADED_ATTACHMENT_ITEM, LOADING_DATA, USER_LOGO} from './../ReduxConsants';
import { KEYMapper as JobMapper } from '../../services/UserConfig';
// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/FG-MRO-Tracker/Attachments`;
import  displayToast  from '../../services/ToastService';

export const getAttachments = (jobId) => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    dispatch({
        type: LOADING_DATA,
        payload: true,
    });
    let squery = '(RefId,eq,'+jobId+')~and(Type,eq,JobReport)';
    API.GET(`${BASE_URL}`, token, {where: squery})
        .then(res => {
            //Hide Loader
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
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
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};

export const saveReportAttachment = (file, type, reportId) => {
  return async (dispatch, getState) => {
    console.log('filessss-------------->',file, type, reportId);
    const token = getState().userReducer.token;
    const newFileUri =  "file:///" + file.uri.split("file:/").join("");
    if(file && (file.size || file.fileSize)) {
        const fileSize = file.size || file.fileSize;
        const size = (fileSize / 1000000);
        if(size > 5) {
            displayToast('error','File too Big, please select a file less than 5mb');
            return;
        }
    }

    let data = new FormData();
    data.append('file', {
        name: file.name ? file.name : newFileUri.split('/').pop(),
        type: mime.getType(newFileUri),
        uri: newFileUri,
    });
   // data.append('file', file);
    data.append('type', type);
    data.append('refId', reportId);
    
    dispatch({
        type: LOADING_DATA,
        payload: true
    });
     console.log('file-->',data);
    API.UPLOAD(`nocodb/upload`, token, data)
        .then(res => {
            //Hide Loader
            dispatch({
                type: LOADING_DATA,
                payload: false
            });
            console.log('upload------->',res);
         //   return;
            if (res) {
                displayToast('success','Upload Success!');
                dispatch({
                  type: ADD_ATTACHMENT_ITEM,
                  payload: res,
                });
            } else {
                displayToast('error','Upload Failed!');
            }
        })
        .catch((error) => {
           // return;
            dispatch({
                type: LOADING_DATA,
                payload: false
            });
           displayToast('error', 'something went wrong!');
             console.log('error -------------->', error);
            // //Hide Loader
            // dispatch({
            //     type: LOADING_DATA,
            //     payload: false
            // });

    }); // JSON data parsed by `data.json()` call
    }
  
};


export const downloadAttachment = (path, imageType='') => {
    return async (dispatch, getState) => {
      const token = getState().userReducer.token;
      dispatch({
        type: LOADING_DATA,
        payload: true,
    });
      API.DOWNLOAD(`nocodb/download`, token, {path, type: 'base64'})
          .then(res => {
              //Hide Loader
              dispatch({
                type: LOADING_DATA,
                payload: false,
            });
              if (res && res.value) {
                  dispatch({
                    type: DOWNLOADED_ATTACHMENT_ITEM,
                    payload: res.value,
                  });
              } else {
                dispatch({
                    type: DOWNLOADED_ATTACHMENT_ITEM,
                    payload: null,
                  });
                  console.log('Unable to show attachment');
              }
          })
          .catch((error) => {
              console.log('error -------------->', error);
              //Hide Loader
              dispatch({
                type: LOADING_DATA,
                payload: false,
            });
      }); // JSON data parsed by `data.json()` call
      }
  };

export const removeAttachment = Id => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    dispatch({
        type: LOADING_DATA,
        payload: false,
    });
    API.DELETE(`${BASE_URL}/${Id}`, token)
        .then(res => {
            //Hide Loader
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
            if (res) {
                displayToast('success','Deleted Success!');
                dispatch({
                  type: DELETE_ATTACHMENT_ITEM,
                  payload: Id,
                });
            } else {
                console.log('Unable to DELETE job');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
    }); // JSON data parsed by `data.json()` call
    }
};


export function getUserLogo() {
    return async (dispatch, getState) => {
        const token = getState().userReducer.token;
        const customerId = getState().userReducer.user.CustomerId;
        let squery = '(RefId,eq,'+customerId+')~and(Type,eq,CustomerLogo)';
        API.GET(`${BASE_URL}`, token, {where: squery})
            .then(res => {
                console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',customerId, res);
                //Hide Loader
                try {
                if (res && res.list && res.list.length > 0) {
                    downloadUserLogo(res.list[0].Path, token, dispatch);
                } else {
                    console.log('Unable to fetch');
                }
            }
            catch(e) {
                console.log('error------------->', e);
            }
          })
            .catch((error) => {
                console.log('error -------------->', error);
                //Hide Loader
            }); // JSON data parsed by `data.json()` call
    }
};


function downloadUserLogo(path,token, dispatch) {
    console.log(path, token, dispatch);
    API.DOWNLOAD(`nocodb/download`, token, {path, type: 'base64'})
                    .then(res => {
                        //Hide Loader
                        if (res && res.value) {
                            dispatch({
                              type: USER_LOGO,
                              payload: res.value,
                            });
                         //   console.log('LOOOOOOOOOOOOOOOO', res.value);

                        } else {
                          dispatch({
                              type: USER_LOGO,
                              payload: null,
                            });
                            console.log('Unable to show attachment');
                        }
                    })
                    .catch((error) => {
                        console.log('error -------------->', error);
                        //Hide Loader
                }); // JSON data parsed by `data.json()` call
}