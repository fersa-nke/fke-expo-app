
import API from '../../services/Api';
// Define action types
import { GET_REPORTS, ADD_REPORT_ITEM, DELETE_REPORT_ITEM, SELECTED_REPORT_ID, UPDATE_REPORT_ITEM, LOADING_DATA} from './../ReduxConsants';
import { KEYMapper as JobMapper } from '../../services/UserConfig';
// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/FG-MRO-Tracker/Reports`;
import displayToast from '../../services/ToastService';

export const getReports = (Id) => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    let squery = '('+JobMapper.JOBID+',eq,'+Id+')';
    API.GET(`${BASE_URL}`, token , {where: squery})
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

export const setSelectedReportId = id => dispatch => {
    dispatch({
        type: SELECTED_REPORT_ID,
        payload: id
      });
}

export const saveJobReport = (reportData, callBack) => {
    return async (dispatch, getState) => {
        console.log('calling save method-->',reportData);    
    const token = getState().userReducer.token;
    dispatch({
        type: LOADING_DATA,
        payload: true,
    });
    API.POST(`${BASE_URL}`, token, reportData)
        .then(res => {
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
            //Hide Loader
            if (res) {
                dispatch({
                  type: ADD_REPORT_ITEM,
                  payload: res,
                });
                displayToast('success', 'Job Report Created!');
                callBack();
            } else {
                displayToast('error', 'Unable to save Report!');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
  
};


export const updateJobReport = (reportFormData, originalData, Id, callBack) => {
    console.log('calling update method-->',reportFormData);
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    dispatch({
        type: LOADING_DATA,
        payload: true,
    });
    API.PATCH(`${BASE_URL}/${Id}`, token, reportFormData)
        .then(res => {
            console.log(res);
            //Hide Loader
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
            if (res) {
                let reports = getState().reportsReducer.reports;
                let reportIndex = reports.findIndex(x => x.Id === Id);
                reports[reportIndex] = originalData;
                console.log(originalData);
                dispatch({
                  type: UPDATE_REPORT_ITEM,
                  payload: reports
                });
                displayToast('success','Job Report Updated!');
                callBack();
            } else {
                displayToast('error', 'Unable to save Report');
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

export const removeFromReports = (Id) => {
    console.log(Id);
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    dispatch({
        type: LOADING_DATA,
        payload: true,
    });
    API.DELETE(`${BASE_URL}/${Id}`, token)
        .then(res => {
            //Hide Loader
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
            if (res) {
                dispatch({
                    type: DELETE_REPORT_ITEM,
                    payload: Id,
                  });
                displayToast('success','Job Report Deleted!');
            } else {
                displayToast('error','Unable to DELETE');
                console.log('Unable to DELETE Report', res);
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

export const showLoadData = (show) => {
  return (dispatch, getState) => {
    dispatch({
        type: LOADING_DATA,
        payload: show,
    });
  }
}
