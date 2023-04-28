import { ADD_SIGNED_USER_DATA, LOGIN_FAILED, REMOVE_USER_DATA, LOGIN_LOADING } from '../ReduxConsants';

const initialState = {
    user: null,
    message: '',
    token: null,
    isLogin: false,
    failed: false,
    loading: false
}

export default function userReducer(state = initialState, action) {
    console.log('login reducer calling------------->', action, state);
    switch (action.type) {
        case ADD_SIGNED_USER_DATA:
            return {
                ...state,
                user: action.payload,
                token: action.payload.token,
                isLogin: true,
                failed: false,
                loading: false
            }
        case LOGIN_FAILED:
            return {
                ...state,
                user: null,
                message: action.payload.message,
                token: null,
                failed: true,
                isLogin: false,
                loading: false
            }
        case LOGIN_LOADING:
            return {
                ...state,
                loading: true
            }   
        case REMOVE_USER_DATA:
            return {
                ...state,
                user: null,
                message: '',
                token: null,
                isLogin: false,
                failed: false,
                loading: false
            };
        default:
            return state
    }
}

