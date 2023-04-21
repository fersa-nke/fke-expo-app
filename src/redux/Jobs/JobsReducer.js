import {GET_JOBS, ADD_JOB_ITEM, DELETE_jOB_ITEM} from './../ReduxConsants';

const initialState = {
  jobs: []
}

export default function jobsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_JOBS:
      return {...state, jobs: action.payload};
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
}

;