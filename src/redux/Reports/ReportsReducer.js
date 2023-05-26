import {GET_REPORTS, ADD_REPORT_ITEM, DELETE_REPORT_ITEM, SELECTED_REPORT_ID,
  UPDATE_REPORT_ITEM, SELECTED_REPORT_TITLE} from './../ReduxConsants';

const initialReportState = {
  reports: [],
  selectedReportId: null,
  reportTitle: ''
}

export default function reportsReducer(state = initialReportState, action) {
  switch (action.type) {
    case GET_REPORTS:
      return {...state, reports: action.payload};
    case ADD_REPORT_ITEM:
      return {...state, reports: [...state.reports, action.payload]};
    case UPDATE_REPORT_ITEM:
        return {
          ...state,
          reports: [
            ...action.payload
          ]
    };
    case SELECTED_REPORT_ID:
        return {...state, selectedReportId: action.payload};
    case SELECTED_REPORT_TITLE:
        return {...state, reportTitle: action.payload};      
    case DELETE_REPORT_ITEM:
      return {
        ...state,
        reports: state.reports.filter(
            report => report.Id !== action.payload,
        ),
      };  
    default:
      return state;
  }
};
