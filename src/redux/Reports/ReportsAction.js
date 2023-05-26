
import API from '../../services/Api';
// Define action types
import { GET_REPORTS, ADD_REPORT_ITEM, DELETE_REPORT_ITEM, SELECTED_REPORT_ID, UPDATE_REPORT_ITEM} from './../ReduxConsants';
import { KEYMapper as JobMapper } from '../../services/UserConfig';
// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/FG-MRO-Tracker/Reports`;
import { Toast } from 'toastify-react-native';

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

export const saveJobReport = (reportData, originalData, callBack) => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.POST(`${BASE_URL}`, token, reportData)
        .then(res => {
            //Hide Loader
            if (res) {
                dispatch({
                  type: ADD_REPORT_ITEM,
                  payload: res,
                });
                Toast.success('Job Report Created!');
                callBack();
            } else {
                Toast.error('Unable to save Report');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
  
};


export const updateJobReport = (reportData, originalData, Id, callBack) => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.PATCH(`${BASE_URL}/${Id}`, token, reportData)
        .then(res => {
            console.log(res);
            //Hide Loader
            if (res && res.ok) {
                let reports = getState().reportsReducer.reports;
                let reportIndex = reports.findIndex(x => x.Id === Id);
                reports[reportIndex] = reportData;
                console.log(reportData);
                dispatch({
                  type: UPDATE_REPORT_ITEM,
                  payload: reports
                });
                Toast.success('Job Report Updated!');
                callBack();
            } else {
                Toast.error('Unable to save Report');
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
  
};

export const removeFromReports = (Id) => {
    console.log(Id);
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    API.DELETE(`${BASE_URL}/${Id}`, token)
        .then(res => {
            //Hide Loader
            if (res && res.ok) {
                dispatch({
                    type: DELETE_REPORT_ITEM,
                    payload: Id,
                  });
                Toast.success('Job Report Deleted!');
            } else {
                Toast.error('Unable to DELETE');
                console.log('Unable to DELETE Report', res);
            }
        })
        .catch((error) => {
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};