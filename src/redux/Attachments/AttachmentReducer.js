import {GET_ATTACHMENTS, ADD_ATTACHMENT_ITEM, DELETE_ATTACHMENT_ITEM} from './../ReduxConsants';

const initialAttachmentState = {
  attachments: []
}

export default function attachmentsReducer(state = initialAttachmentState, action) {
  switch (action.type) {
    case GET_REPORTS:
      return {...state, attachments: action.payload};
    case ADD_REPORT_ITEM:
      return {...state, attachments: [...state.jobs, action.payload]};
    case DELETE_REPORT_ITEM:
      return {
        ...state,
        attachments: state.attachments.filter(
            attachment => attachment.id !== action.payload.id,
        ),
      };  
    default:
      return state;
  }
};
