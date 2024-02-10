
import API from '../../services/Api';
import { GET_JOBS,
	 DELETE_jOB_ITEM,
	  SELECTED_JOB_ID,
	  ADD_JOB_ITEM ,
	  UPDATE_JOB_ITEM,
	  LOADING_jOBS,
	  GET_SEARCH_JOBS
	  } from '../ReduxConsants';
// Define action types
import { KEYMapper as JobMapper } from "../../services/UserConfig";
import displayToast from "../../services/ToastService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
  createPageInfoQuery,
  createOrCheckTable,
  createformDataTable,
  insertPageInfo,
  insertDataToTable,
  insertFormDataintoTable,
  getAllJobs,
  getPageInfo,
  syncAllDataToDB,
  checkIfFormDataPresent,
  truncateformDataTable,
  truncateJobsDataTable,
  updateDataInTable,
  updateFormDataintoTable,
} from "./Jobs.Query";

// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/FG-MRO-Tracker/TrackerJobs`;
export const getJobs = () => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    const pageInfo =  getState().jobsReducer.pageInfo;
    const offSet = pageInfo.offSet || 0;
    const pageSize = pageInfo.pageSize || 5;
    // alert('calling once api job'+token);
    console.log(pageInfo);    
    if(pageInfo.isLastPage) {
        return false;
    }
    dispatch({
        type: LOADING_jOBS,
        payload: true,
      });
    let tempData = [];
    NetInfo.fetch().then((state) => {
      createOrCheckTable();
      createPageInfoQuery();
      if (state.isConnected) {
        //{sort: `-${JobMapper.JOBDATE},-${JobMapper.ID}
        const res1 = [];
        console.log("jobs online connected");
        Promise.all([getAllJobs(), getPageInfo()])
          .then((results) => {
            dispatch({
              type: LOADING_jOBS,
              payload: false,
            });
            //console.log(results, "result");
            for (let x of results) {

              console.log("offline records",x);
              res1.push(x);
            }

            if (res1[0].length > 0) {
              //  console.log(res1[0][0], "jobs list");
              const newRes = res1[0];
              // const newRes = res1[0].filter(
              //   (value, index, self) =>
              //     index === self.findIndex((t) => t.JobId === value.JobId)
              // );
              newRes.forEach((item) => {
                if (item?.isSync === 1) {
                  dispatch(showSyncButtonFlag(true));
                }
              });
              const res = {
                list: newRes,
                pageInfo: res1[1],
              };
              //console.log(res.list, "res.list.length");
              dispatch({
                type: GET_JOBS,
                payload: res,
              });
            } else {
              API.GET(`${BASE_URL}`, token, { offset: offSet, limit: pageSize })
                .then((res) => {
                  dispatch({
                    type: LOADING_jOBS,
                    payload: false,
                  });
                  if (res && res.list && res.list.length > 0) {
                    res.pageInfo.offSet = offSet + pageSize;
                    insertPageInfo(res.pageInfo);

                    dispatch({
                      type: GET_JOBS,
                      payload: res,
                    });
                    {
                      /* truncate table before insert */
                      truncateJobsDataTable();
                   //   truncateformDataTable();
                    }

                    console.log("jobs data.....>", res);
                    insertDataToTable(res);

                   // console.log("job data****",res);
                  }
                })
                .catch((error) => {
                  dispatch({
                    type: LOADING_jOBS,
                    payload: false,
                  });
                  //console.log("error -------------->", error);
                  //Hide Loader
                });
            }
          })
          .catch((e) => {
            //console.log("askdjkasjdkas")
          });
      } else {
        dispatch({
          type: LOADING_jOBS,
          payload: true,
        });
        const res1 = [];
        console.log("************************jobs offline connected");
        Promise.all([getAllJobs(), getPageInfo()])
          .then((results) => {
            dispatch({
              type: LOADING_jOBS,
              payload: false,
            });
            console.log( "result***********",results);
            for (let x of results) {
              console.log("offline data....>",x);
              res1.push(x);
            }
            const newRes = res1[0];
            // const newRes = res1[0].filter(
            //   (value, index, self) =>
            //     index === self.findIndex((t) => t.JobId === value.JobId)
            // );
            newRes.forEach((item) => {
              if (item?.isSync === 1) {
                dispatch(showSyncButtonFlag(true));
              }
            });
            const res = {
              list: newRes,
              pageInfo: res1[1],
            };
            //console.log(res.list, "res.list.length");
            dispatch({
              type: GET_JOBS,
              payload: res,
            });
          })
          .catch((e) => console.log(e));
      }
    });
  };
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
        payload: false,
    });
    const token = getState().userReducer.token;
    createformDataTable();
    NetInfo.fetch().then((state) => {
      //console.log(formData, "formdata>>>>>>>>+++++++++++++++++++++++")
      if (state.isConnected) {
        API.POST(`${BASE_URL}`, token, formData)
          .then((res) => {
            //console.log("save job", res);
            //Hide Loader
            dispatch({
                type: LOADING_jOBS,
                payload: false,
            });
            if (res) {
              let obj = { ...jobData, Id: res.Id };
              displayToast("success", "Job Created!");
              insertDataToTable(
                {
                  list: [{ ...jobData }],
                },
                0
              );
              insertFormDataintoTable(formData);
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
      } else {
        dispatch({
          type: LOADING_jOBS,
          payload: false,
        });

        insertDataToTable(
          {
            list: [{ ...jobData }],
          },
          1
        );
        insertFormDataintoTable(formData);

        getPageInfo().then((pageInfo) => {
          const res = {
            list: [],
            pageInfo: pageInfo,
          };
          displayToast("success", "Job Created!");

          dispatch(getJobs());
          dispatch(showSyncButtonFlag(true));
          callBack();
        });
      }
    });
  };
};

export const updateJob = (formData, jobData, Id, navigation) => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    dispatch({
      type: LOADING_jOBS,
      payload: true,
    });
    NetInfo.fetch().then(async (state) => {
      createformDataTable();
      if (state.isConnected) {
        // console.log(formData, "form data from update call");
        API.PATCH(`${BASE_URL}/${Id}`, token, formData)
          .then(async (res) => {
            // console.log(res);
            //  //console.log(res);
            //Hide Loader
            dispatch({
              type: LOADING_jOBS,
              payload: false,
            });
            if (res) {
              let jobs = getState().jobsReducer.jobs;
              let jobIndex = jobs.findIndex((x) => x.Id === Id);
              jobs[jobIndex] = { ...jobData, Id: Id };
              const formdata = await checkIfFormDataPresent(formData.JobId);

              if (formdata.length === 0) {
                insertDataToTable(
                  {
                    list: [{ ...jobData }],
                  },
                  1
                );
                insertFormDataintoTable(formData);
                navigation();
              } else {
                updateDataInTable(
                  {
                    list: [{ ...jobData, isSync: 0 }],
                  },
                  1
                );
                updateFormDataintoTable(formData);
              }
              // console.log(formdata, "offline form data updated");
              navigation();
              displayToast("success", "Job Updated!");
              dispatch({
                type: UPDATE_JOB_ITEM,
                payload: jobs,
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
      } else {
        let jobs = getState().jobsReducer.jobs;
        let jobIndex = jobs.findIndex((x) => x.Id === Id);
        jobs[jobIndex] = { ...jobData, Id: Id };        
        const formdata = await checkIfFormDataPresent(formData.JobId);
        //console.log("inside else{{{{{{{{{{{{{}}}}}}}}}}}}}}}}", formData);
        if (formdata.length === 0) {
          insertDataToTable(
            {
              list: [{ ...jobData }],
            },
            1
          );
          insertFormDataintoTable(formData);
        } else {

          truncateJobsDataTable();
          truncateformDataTable();
          updateDataInTable(
            {
              list: [{ ...jobData, isSync: 1 }],
            },
            1
          );
          updateFormDataintoTable(formData);
        }

        getPageInfo()
          .then((pageInfo) => {
            const res = {
              list: [],
              pageInfo: pageInfo,
            };
            displayToast("success", "Job Updated");
            dispatch(getJobs());
            dispatch(showSyncButtonFlag(true));
            navigation();
          })
          .catch((error) => {
            displayToast("error", "Unable to update jobs");
          });
      }
    });
  };
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
      .then((res) => {
        dispatch({
          type: LOADING_jOBS,
          payload: false,
        });
        //console.log(res);
        //Hide Loader
        if (res) {
          dispatch({
            type: DELETE_jOB_ITEM,
            payload: Id,
          });
          displayToast("success", "Job Deleted!");
        } else {
          displayToast("error", "Unable to DELETE");
          //console.log("Unable to DELETE job", res);
        }
      })
      .catch((error) => {
        displayToast("error", "Something went wrong in delete actiion");
        dispatch({
          type: LOADING_jOBS,
          payload: false,
        });
        //Hide Loader
      }); // JSON data parsed by `data.json()` call
  };
};

export const showSyncButtonFlag = (payload) => {
  return {
    type: "SHOW_SYNC_BUTTON_FLAG",
    payload,
  };
};

export const syncAllJobs = () => {
  return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    const pageInfo = getState().jobsReducer.pageInfo;
    const offSet = pageInfo.offSet || 0;
    const pageSize = pageInfo.pageSize || 5;
    const formData = await syncAllDataToDB();

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        for (let x = 0; x < formData.length; x++) {
          //console.log(formData[x]);
          API.POST(`${BASE_URL}`, token, formData[x])
            .then((res) => {
              if (res) {
                dispatch({
                  type: ADD_JOB_ITEM,
                  payload: res,
                });
                truncateJobsDataTable();
                truncateformDataTable();
              } else {
                displayToast("error", "Unable to save job!");
              }
            })
            .catch(() => {
              dispatch({
                type: LOADING_jOBS,
                payload: false,
              });

              displayToast("error", "Unable to sync Jobs.");
              //Hide Loader
            });
        }
        API.GET(`${BASE_URL}`, token, { offset: offSet, limit: pageSize })
          .then((res) => {
            dispatch({
              type: LOADING_jOBS,
              payload: true,
            });

            if (res && res.list && res.list.length > 0) {
              res.pageInfo.offSet = offSet + pageSize;
              dispatch(showSyncButtonFlag(false));
              dispatch({
                type: LOADING_jOBS,
                payload: false,
              });
              dispatch({
                type: GET_JOBS,
                payload: res,
              });
            }
          })
          .catch((error) => {
            dispatch({
              type: LOADING_jOBS,
              payload: false,
            });
            displayToast("error", "please try again");
          });
      } else {
        displayToast("error", "Please check your internet");
      }
    });
  };
};