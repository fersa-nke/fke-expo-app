import {GET_ATTACHMENTS, ADD_ATTACHMENT_ITEM, DELETE_ATTACHMENT_ITEM, DOWNLOADED_ATTACHMENT_ITEM} from './../ReduxConsants';

const initialAttachmentState = {
  attachments: [],
  downloadedFile: null
}

export default function attachmentsReducer(state = initialAttachmentState, action) {
  switch (action.type) {
    case GET_ATTACHMENTS:
      return {...state, attachments: action.payload};
    case ADD_ATTACHMENT_ITEM:
      return {...state, attachments: [...state.attachments, action.payload]};
    case DELETE_ATTACHMENT_ITEM:
      return {
        ...state,
        attachments: state.attachments.filter(
            attachment => attachment.Id !== action.payload,
        ),
      }; 
    case DOWNLOADED_ATTACHMENT_ITEM:
      return {
        ...state,
        downloadedFile: action.payload
      }    
    default:
      return state;
  }
};
