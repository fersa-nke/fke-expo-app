import {GET_JOBS, ADD_JOB_ITEM, SELECTED_JOB_ID, DELETE_jOB_ITEM} from './../ReduxConsants';

const initialJobState = {
  jobs: [],
  pageInfo: {
    totalRows: 0,
    page: 0,
    pageSize: 5,
    isFirstPage: true,
    isLastPage: false
  },
  pageLoader: false,
  showLoadMore: false,
  selectedJobId: null
}

export default function jobsReducer(state = initialJobState, action) {
  switch (action.type) {
    case GET_JOBS:
      return {...state, jobs:[...state.jobs, ...action.payload.list], pageInfo: action.payload.pageInfo};
    case SELECTED_JOB_ID:
      return {...state, selectedJobId: action.payload} 
    case ADD_JOB_ITEM:
      return {...state, jobs: [...state.jobs, action.payload]};
    case DELETE_jOB_ITEM:
      return {
        ...state,
        jobs: state.jobs.filter(
          job => job.id !== action.payload.id,
        ),
      };  
    default:
      return state;
  }
};
