import {GET_REPORTS, ADD_REPORT_ITEM, DELETE_REPORT_ITEM, SELECTED_REPORT_ID,
  UPDATE_REPORT_ITEM} from './../ReduxConsants';

const initialReportState = {
  reports: [],
  selectedReportId: null
}

export default function reportsReducer(state = initialReportState, action) {
  switch (action.type) {
    case GET_REPORTS:
      return {...state, reports: action.payload};
    case ADD_REPORT_ITEM:
      return {...state, reports: [...state.jobs, action.payload]};
    case UPDATE_REPORT_ITEM:
        return {
          ...state,
          reports: [
            ...action.payload
          ]
    };
    case SELECTED_REPORT_ID:
        return {...state, selectedReportId: action.payload};  
    case DELETE_REPORT_ITEM:
      return {
        ...state,
        reports: state.reports.filter(
            report => report.id !== action.payload.id,
        ),
      };  
    default:
      return state;
  }
};
