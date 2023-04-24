import {GET_JOBS, ADD_JOB_ITEM, SELECTED_JOB_ID, DELETE_jOB_ITEM} from './../ReduxConsants';

const initialJobState = {
  jobs: [],
  selectedJobId: null
}

export default function jobsReducer(state = initialJobState, action) {
  switch (action.type) {
    case GET_JOBS:
      return {...state, jobs: action.payload};
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
