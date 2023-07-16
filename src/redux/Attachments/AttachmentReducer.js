import {GET_ATTACHMENTS, ADD_ATTACHMENT_ITEM, DELETE_ATTACHMENT_ITEM, DOWNLOADED_ATTACHMENT_ITEM, USER_LOGO} from './../ReduxConsants';

const initialAttachmentState = {
  attachments: [],
  downloadedFile: null,
  userLogo: null
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
    case USER_LOGO: 
      return {
          ...state,
          userLogo: action.payload
      }      
    default:
      return state;
  }
};
