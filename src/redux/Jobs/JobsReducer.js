import {GET_JOBS, ADD_JOB_ITEM, SELECTED_JOB_ID, DELETE_jOB_ITEM, UPDATE_JOB_ITEM, LOADING_jOBS, SHOW_BARCODE_BUTTON, SET_JOB_TITLE,
   GET_SEARCH_JOBS, CLEAR_JOBS_DATA} from './../ReduxConsants';

const initialJobState = {
  jobs: [],
  searchJobs: [],
  pageInfo: {
    totalRows: 0,
    page: 0,
    offSet: 0,
    pageSize: 5,
    isFirstPage: true,
    isLastPage: false
  },
  pageLoader: false,
  showLoadMore: false,
  selectedJobId: null,
  jobTitle: null,
  jobsRefresh: false,
  showBarCodeScanButton: true
}

export default function jobsReducer(state = initialJobState, action) {
  switch (action.type) {
    case GET_JOBS:
      console.log(...action.payload.list);
      return {...state, jobs: [...state.jobs, ...action.payload.list], pageInfo: action.payload.pageInfo};
    case GET_SEARCH_JOBS:
        console.log(...action.payload.list);
      return {...state, searchJobs: [...action.payload.list], pageInfo: action.payload.pageInfo};  
    case SELECTED_JOB_ID:
      return {...state, selectedJobId: action.payload}; 
    case ADD_JOB_ITEM:
      console.log(state.jobs, action.payload);
      return {...state, jobs: [ action.payload, ...state.jobs], jobsRefresh: true};
    case UPDATE_JOB_ITEM:
        return {
          ...state,
          jobs: [
            ...action.payload
          ],
    };
      case DELETE_jOB_ITEM:
      return {
        ...state,
        jobs: state.jobs.filter(
          job => job.Id !== action.payload,
        ),
      };
    case LOADING_jOBS:
      return {...state, pageLoader: action.payload };
    case SHOW_BARCODE_BUTTON:
      return {...state, showBarCodeScanButton: action.payload};
    case SET_JOB_TITLE:
      return {...state, jobTitle: action.payload}
    case CLEAR_JOBS_DATA:
      return {...state, ...initialJobState }
    default:
      return state;
  }
};
