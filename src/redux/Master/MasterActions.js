
import API from '../../services/Api';
import { LOGIN_SUCCESS, GET_API_Mapper, GET_GENERATOR_MODELS, ADD_SIGNED_USER_DATA, GET_KEY_Mapper, GET_BEARING_TYPES, GET_BRANDS, GET_EXCHANGE_TYPES, GET_MODELS, GET_REASON_OF_CHANGES, GET_SHAFT_POSITIONS, GET_WIND_FARMS, GET_WIND_LOCATIONS, GET_STATES, GET_LUBRICATION_GRADES, GET_LUBRICATION_TYPES, LOADING_DATA } from '../ReduxConsants';
// Define action types
import { APIConfig, KEYMapper } from '../../services/UserConfig';
import AuthService from '../../services/AuthService';
import displayToast from '../../services/ToastService';

export const getAPIMapper = (token = '') => {
    return callAPIMapper('APIMapper', GET_API_Mapper, token);
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

export const getWindFarms = () => {
    return callAPI(APIConfig.CUSTOMERWINDFARM, GET_WIND_FARMS);
};

export const getWindLocations = () => {
    return callAPI(APIConfig.CUSTOMERWINDLOCATION, GET_WIND_LOCATIONS);
};

export const getStates = () => {
    return callAPI(APIConfig.STATE, GET_STATES);
}

export const getLubricationGrades = () => {
    return callAPI(APIConfig.LUBRICATIONGRADE, GET_LUBRICATION_GRADES);
}

export const getLubricationTypes = () => {
    return callAPI(APIConfig.LUBRICATIONTYPE, GET_LUBRICATION_TYPES);
}

export const showLoader = (show) => {
    return (dispatch, getState) => {
     dispatch({
        type: LOADING_DATA,
        payload: show
     });
    }
}

export function callAPIMapper(URL, dispatchType, token = '') {
    return async (dispatch, getState) => {
        token = token ? token : getState().userReducer.token;
       await API.GET(`nocodb/data/FG-MRO-Tracker/${URL}`, token)
            .then(res => {
                //Hide Loader
                try {
                if (res) {
                    dispatch({
                        type: dispatchType,
                        payload: res.list,
                    });
                   updateAPIMapper(res.list);
                    let role = getState().userReducer.user.Role;
                    if(token && getState().userReducer.isAuthenticate === false) {
                        displayToast('success', getState().userReducer.message);
                        dispatch({ type: LOGIN_SUCCESS, payload: true });
                    }
                    else {
                        console.log('weeokskdka');
                    }
                    if(dispatchType === GET_KEY_Mapper) {
                        updateKEYMapper(res.list);
                    }
                } else {
                    console.log('Unable to fetch');
                }
            }
            catch(e) {
                console.log('error------------->', e);
            }

            })
            .catch((error) => {
                console.log('error -------------->', error);
                //Hide Loader
            }); // JSON data parsed by `data.json()` call
    }
};

export function callAPI(URL, dispatchType, token = '') {
    return async (dispatch, getState) => {
        token = token ? token : getState().userReducer.token;
        API.GET(`nocodb/data/FG-MRO-Tracker/${URL}`, token)
            .then(res => {
                //Hide Loader
                try {
                if (res) {
                    dispatch({
                        type: dispatchType,
                        payload: res.list,
                    });
                    if(dispatchType === GET_KEY_Mapper) {
                        updateKEYMapper(res.list);
                    }
                } else {
                    console.log('Unable to fetch');
                }
            }
            catch(e) {
                console.log('error------------->', e);
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
    if(element.Name)
       APIConfig[element.Name] = element['API Name'];
   });
   console.log('updated apiconfig', APIConfig);
}

function updateKEYMapper(list) {
    list.forEach(element => {
        if(element.Name)
            KEYMapper[element.Name] = element['TAG Name'];
    });
    console.log('updated KEYMapper', KEYMapper);
}

