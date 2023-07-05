
import API from '../../services/Api';
import { GET_JOBS, DELETE_jOB_ITEM, SELECTED_JOB_ID, ADD_JOB_ITEM , UPDATE_JOB_ITEM, LOADING_jOBS, GET_SEARCH_JOBS} from '../ReduxConsants';
// Define action types
import { KEYMapper as JobMapper } from '../../services/UserConfig';
import displayToast  from '../../services/ToastService';

// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/FG-MRO-Tracker/TrackerJobs`;
export const getJobs = () => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    const pageInfo =  getState().jobsReducer.pageInfo;
    const offSet = pageInfo.offSet || 0;
    const pageSize = pageInfo.pageSize|| 5;
    // alert('calling once api job'+token);
    console.log(pageInfo);    
    if(pageInfo.isLastPage) {
        return false;
    }
    dispatch({
        type: LOADING_jOBS,
        payload: true,
      });
      //{sort: `-${JobMapper.JOBDATE},-${JobMapper.ID}
    API.GET(`${BASE_URL}`, token)
        .then(res => {
            console.log('job list lenght', res.list.length, res.pageInfo.isLastPage);
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });

            //Hide Loader
            if (res && res.list && res.list.length > 0) {
                res.pageInfo.offSet = offSet + pageSize;
                console.log(res.pageInfo);
                dispatch({
                  type: GET_JOBS,
                  payload: res,
                });
            } else {
                console.log('Unable to fetch JOB', res, res.list.length);
            }
        })
        .catch((error) => {
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });

            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};

export const getJobsBySearchQuery = (query, formObj) => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    const pageInfo =  getState().jobsReducer.pageInfo;
    const offSet = pageInfo.offSet || 0;
    const pageSize = pageInfo.pageSize|| 5;
    // dispatch({
    //     type: LOADING_jOBS,
    //     payload: true,
    //   });
   // alert('calling once api jobs,'+pageNo+','+pageSize);
   let squery ='';
   if(formObj.windFarm) {
    squery = squery+'('+JobMapper.WINDFARM+',eq,'+formObj.windFarm+')';
   }
   if(formObj.windLocation) {
    if(squery) {
        squery = squery+'~and';
    }
    squery = squery+'('+JobMapper.WINDLOCATION+',eq,'+formObj.windLocation+')';
   }
   if(formObj.windTurbine) {
    if(squery) {
        squery = squery+'~and';
    }
    squery = squery+'('+JobMapper.WINDTURBINE+',like,'+formObj.windTurbine+')';
   }
   if(formObj.jobSearchDate) {
    if(squery) {
        squery = squery+'~and';
    }
    squery = squery+'('+JobMapper.JOBDATE+',eq,exactDate,'+formObj.jobSearchDate+')';
   }
   console.log(squery, formObj);
    API.GET(`${BASE_URL}`, token, {where: squery})
        .then(res => {
            console.log('search job list lenght',res);
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });

            //Hide Loader
            if (res && res.list && res.list.length > 0) {
                dispatch({
                  type: GET_SEARCH_JOBS,
                  payload: res,
                });
            } else {
                console.log('Unable to fetch JOB', res, res.list.length);
            }
        })
        .catch((error) => {
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
            console.log('error -------------->', error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};

export const setSelectedJobId = id => dispatch => {
        dispatch({
            type: SELECTED_JOB_ID,
            payload: id
          });
}

export const saveJob = (formData, jobData, callBack) => {
  return async (dispatch, getState) => {
    dispatch({
        type: LOADING_jOBS,
        payload: true,
    });
    const token = getState().userReducer.token;
    API.POST(`${BASE_URL}`, token, formData)
        .then(res => {
            console.log('save job', res);
            //Hide Loader
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
            if (res) {
                let obj = {...jobData, Id: res.Id};
                console.log('job data', obj);
                displayToast('success', 'Job Created!');
                dispatch({
                  type: ADD_JOB_ITEM,
                  payload: obj,
                });
                callBack(obj.Id);
            } else {
                displayToast('error', 'Unable to save job!');
            }
        })
        .catch((error) => {
            
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
            displayToast('error', 'error -------------->'+error);
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
  
};


export const updateJob = (formData, jobData, Id, navigation) => {
    return async (dispatch, getState) => {
      const token = getState().userReducer.token;
        dispatch({
            type: LOADING_jOBS,
            payload: true,
        });
      API.PATCH(`${BASE_URL}/${Id}`, token, formData)
          .then(res => {
          //  console.log(res);
            //Hide Loader
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
            if (res) {
                let jobs = getState().jobsReducer.jobs;
                let jobIndex = jobs.findIndex(x => x.Id === Id);
                jobs[jobIndex] = {...jobData, Id: Id};
                navigation();
                displayToast('success', 'Job Updated!');
                dispatch({
                  type: UPDATE_JOB_ITEM,
                  payload: jobs
                });
            } else {
                displayToast('error', 'Unable to save job!');
            }
        })
        .catch((error) => {
            console.log('error-------------->', error);
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
          //  Toast.error('error -------------->'+error);
            //Hide Loader
      }); // JSON data parsed by `data.json()` call
      }
    
  };

export const removeJob = (Id) => {
    console.log(Id);
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    dispatch({
        type: LOADING_jOBS,
        payload: true,
    });
    API.DELETE(`${BASE_URL}/${Id}`, token)
        .then(res => {
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
            console.log(res);
            //Hide Loader
            if (res) {
                dispatch({
                  type: DELETE_jOB_ITEM,
                  payload: Id
                });
                displayToast('success', 'Job Deleted!');
            } else {
                displayToast('error', 'Unable to DELETE');
                console.log('Unable to DELETE job', res);
            }
        })
        .catch((error) => {
            displayToast('error', 'Something went wrong in delete actiion');
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
            //Hide Loader
    }); // JSON data parsed by `data.json()` call
    }
};