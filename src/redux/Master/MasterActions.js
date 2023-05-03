
import API from '../../services/Api';
import { LOGIN_SUCCESS, GET_API_Mapper, GET_GENERATOR_MODELS, ADD_SIGNED_USER_DATA, GET_KEY_Mapper, GET_BEARING_TYPES, GET_BRANDS, GET_EXCHANGE_TYPES, GET_MODELS, GET_REASON_OF_CHANGES, GET_SHAFT_POSITIONS } from '../ReduxConsants';
// Define action types
import { APIConfig, KEYMapper } from '../../services/UserConfig';
import { Toast } from 'toastify-react-native';
import AuthService from '../../services/AuthService';

export const getAPIMapper = (token = '') => {
    return callAPI('APIMapper', GET_API_Mapper, token);
};

export const getKEYMapper = (token = '') => {
    return callAPI('KEYMapper', GET_KEY_Mapper, token);
};

export const getExchangeTypes = () => {
    return callAPI(APIConfig.EXCHANGETYPE, GET_EXCHANGE_TYPES);
};

export const getShaftPositions = () => {
    return callAPI(APIConfig.POSITIONTYPE, GET_SHAFT_POSITIONS);
};

export const getReasonOfChanges = () => {
    return callAPI(APIConfig.REASONTYPE, GET_REASON_OF_CHANGES);
};

export const getBrands = () => {
    return callAPI(APIConfig.BEARINGBRAND, GET_BRANDS);
};

export const getModels = () => {
    return callAPI(APIConfig.BEARINGMODEL, GET_MODELS);
};

export const getBearingTypes = () => {
    return callAPI(APIConfig.BEARINGTYPE, GET_BEARING_TYPES);
};

export const getGeneratorModels = () => {
    return callAPI(APIConfig.GENERATORMODEL, GET_GENERATOR_MODELS);
};

export function callAPI(URL, dispatchType, token = '') {
    return async (dispatch, getState) => {
        token = token ? token : getState().userReducer.token;
        console.log(URL, 'api config urls');
        API.GET(`nocodb/data/FG-MRO-Tracker/${URL}`, token)
            .then(res => {
                //Hide Loader
                if (res) {
                    dispatch({
                        type: dispatchType,
                        payload: res.list,
                    });
                    if(dispatchType === GET_API_Mapper) {
                        updateAPIMapper(res.list);
                        let role = getState().userReducer.user.Role;
                        if(role){
                            AuthService.setRole(role);
                        }
                        if(token && getState().userReducer.isLogin === false) {
                            Toast.success(getState().userReducer.message);
                            dispatch({ type: LOGIN_SUCCESS, payload: true });
                        }
                    }
                    if(dispatchType === GET_KEY_Mapper) {
                        updateKEYMapper(res.list);
                    }
                } else {
                    console.log('Unable to fetch');
                }
            })
            .catch((error) => {
                console.log('error -------------->', error);
                //Hide Loader
            }); // JSON data parsed by `data.json()` call
    }
};



function updateAPIMapper(list) {
   list.forEach(element => {
    APIConfig[element.Title] = element['API Name'];
   });
   console.log('updated apiconfig', APIConfig);
}

function updateKEYMapper(list) {
    list.forEach(element => {
        KEYMapper[element.Title] = element['TAG Name'];
    });
    console.log('updated KEYMapper', KEYMapper);
}

