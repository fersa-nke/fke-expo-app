
import API from '../../services/Api';
// Define action types
import { GET_REPORTS, ADD_REPORT_ITEM, DELETE_REPORT_ITEM, SELECTED_REPORT_ID, UPDATE_REPORT_ITEM, LOADING_DATA} from './../ReduxConsants';
import { KEYMapper as JobMapper } from '../../services/UserConfig';
// Construct a BASE URL for API endpoint
const BASE_URL = `nocodb/data/FG-MRO-Tracker/Reports`;
import displayToast from '../../services/ToastService';
import NetInfo from "@react-native-community/netinfo";
import {
  createReportTable,
  insertReportTable,
  updateReportTable,
  getAllReports,
  deleteReportTableUsingID,
  truncateReportDataTable,
} from "./Reports.Query";

export const localFlag = (payload) => {
  return {
    type: "LOCAL_ROUTE",
    payload,
  };
};

export const getReports = (Id) => {
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    let squery = "(" + JobMapper.JOBID + ",eq," + Id + ")";
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        API.GET(`${BASE_URL}`, token, { where: squery })
          .then((res2) => {
            getAllReports().then((res1) => {
              if (res1 !== undefined) {
                dispatch(showSyncButton(true));
                const res = {
                  list: [...res1, ...res2.list],
                };
                dispatch(showSyncButton(false));
                if (res) {
                  dispatch({
                    type: GET_REPORTS,
                    payload: res.list,
                  });
                }
              } else {
                const list = res2?.list.filter((obj, index) => {
                  return index === res.findIndex((o) => obj.Id === o.Id);
                });
                const res = {
                  list: list,
                };
                dispatch(showSyncButton(false));
                dispatch({
                  type: GET_REPORTS,
                  payload: res.list,
                });
              }
            });
          })
          .catch((error) => {
            //console.log('error -------------->', error);
            displayToast("Error", "Unable to get reports");
            //Hide Loader
          }); // JSON data parsed by `data.json()` call
      } else {
        getAllReports().then((res1) => {
          if (res1 !== undefined) {
            const res = {
              list: [...res1],
            };
            dispatch(showSyncButton(true));
            if (res) {
              dispatch({
                type: GET_REPORTS,
                payload: res.list,
              });
            }
          }
        });
      }
    });
  };
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
    createReportTable();
    dispatch({
        type: LOADING_DATA,
        payload: true,
    });
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        //  console.log(reportData, token, "reportData save jobs >>>>>>>>>>>>>>>>>>")
        API.POST(`${BASE_URL}`, token, reportData)
          .then((res) => {
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
      } else {
        dispatch({
          type: LOADING_DATA,
          payload: false,
        });
        const res = {
          ...reportData,
          job: [],
          isSync: 1,
        };

        insertReportTable(res);
        dispatch(showSyncButton(true));
        getAllReports()
          .then((res) => {
            const data = [];
            for (let i = 0; i < res.length; i++) {
              data.push(res.at(-1));
            }
            const unique2 = data.filter((obj, index) => {
              return index === data.findIndex((o) => obj.Id === o.Id);
            });
            //  console.log(unique2.length, "unique2")
            dispatch({
              type: ADD_REPORT_ITEM,
              payload: unique2[0],
            });
            displayToast("success", "Offline Job Report Created!");
          })
          .catch((e) => {
            displayToast("error", "Unable to create Report");
          });
      }
    });
  };
};

export const updateJobReport = (reportFormData, originalData, Id, callBack) => {
    console.log('calling update method-->',reportFormData);
    return async (dispatch, getState) => {
    const token = getState().userReducer.token;
    dispatch({
        type: LOADING_DATA,
        payload: true,
    });
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        API.PATCH(`${BASE_URL}/${Id}`, token, reportFormData)
          .then((res) => {
            // console.log(res);
            //Hide Loader
            dispatch({
                type: LOADING_DATA,
                payload: false,
            });
            if (res) {
                let reports = getState().reportsReducer.reports;
                let reportIndex = reports.findIndex(x => x.Id === Id);
                reports[reportIndex] = originalData;
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
      } else {
        updateReportTable(reportFormData);
        getAllReports().then((res) => {
          for (const element of res) {
            if (element.Id === Id) {
              let reports = getState().reportsReducer.reports;
              let reportIndex = reports.findIndex((x) => x.Id === Id);
              reports[reportIndex] = originalData;
              //   //  console.log('original form report data', originalData);
              dispatch({
                type: LOADING_DATA,
                payload: false,
              });
              dispatch({
                type: UPDATE_REPORT_ITEM,
                payload: reports,
              });
              displayToast("success", "Offline Job Report Updated!");
              //dispatch(localRoute(true))
              callBack();
            }
          }
        });
      }
    });
  };
};

export const removeFromReports = (Id) => {
    console.log(Id);
  return async (dispatch, getState) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        const token = getState().userReducer.token;
        dispatch({
          type: LOADING_DATA,
          payload: true,
        });
        API.DELETE(`${BASE_URL}/${Id}`, token)
          .then((res) => {
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
            displayToast("error", "Unable to DELETE");
          });
      } else {
        deleteReportTableUsingID(Id);
        dispatch({
          type: DELETE_REPORT_ITEM,
          payload: Id,
        });
        displayToast("success", "Offline Job Report Deleted!");
      }
    });
    // JSON data parsed by `data.json()` call
  };
};

export const showLoadData = (show) => {
  return (dispatch, getState) => {
    dispatch({
        type: LOADING_DATA,
        payload: show,
    });
  };
};

export const showSyncButton = (payload) => {
  return {
    type: "SHOW_SYNC_REPORTS",
    payload,
  };
};

export const synsAllData = (Id) => {
  return async (dispatch, getState) => {
    console.log(Id);
    const token = getState().userReducer.token;
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        dispatch({
          type: LOADING_DATA,
          payload: true,
        });
        getAllReports().then((res) => {
          const reportData = res
            .filter((obj, index) => {
              return index === res.findIndex((o) => obj.Id === o.Id);
            })
            .map((item) => {
              return {
                BearingHousingDEMax: item.BearingHousingDEMax,
                BearingHousingDEMin: item.BearingHousingDEMin,
                BearingHousingNDEMax: item.BearingHousingNDEMax,
                BearingHousingNDEMin: item.BearingHousingNDEMin,
                Comments: item.Comments,
                InsulateResistance: item.InsulateResistance,
                JobId: item.JobId,
                LastLubrication: JSON.parse(item.LastLubrication),
                LubricationGrade: JSON.parse(item.LubricationGrade),
                LubricationType: JSON.parse(item.LubricationType),
                NOKBearing: item.NOKBearing,
                Name: item.Name,
                ReportDate: item.ReportDate,
                ReportId: item.ReportId,
                SerialNumber: item.SerialNumber,
                ShaftJournalDEMax: item.ShaftJournalDEMax,
                ShaftJournalDEMin: item.ShaftJournalDEMin,
                ShaftJournalNDEMax: item.ShaftJournalNDEMax,
                ShaftJournalNDEMin: item.ShaftJournalNDEMin,
                VoltageTested: item.VoltageTested,
              };
            });

          for (let i = 0; i < reportData.length; i++) {
            API.POST(`${BASE_URL}`, token, reportData[i])
              .then((res1) => {
                truncateReportDataTable();
                dispatch({
                  type: LOADING_DATA,
                  payload: true,
                });

                if (res1) {
                  dispatch(showSyncButton(false));

                  const reports = getState().reportsReducer.reports;
                  dispatch(getReports(Id));
                  displayToast("success", "Job Report Created!");
                  // callBack();
                }
              })
              .catch((error) => {
                // console.log('error -------------->', error);
                dispatch({
                  type: LOADING_DATA,
                  payload: false,
                });
                displayToast("error", `Unable to sync all jobs`);
                //Hide Loader
              });
          }
        });
      } else {
        displayToast("error", "Please check your internet");
      }
    });
  };
};
