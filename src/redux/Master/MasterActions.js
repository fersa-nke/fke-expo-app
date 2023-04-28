
import API from '../../services/Api';
import { GET_BEARING_TYPES, GET_BRANDS, GET_EXCHANGE_TYPES, GET_MODELS, GET_REASON_OF_CHANGES, GET_SHAFT_POSITIONS } from '../ReduxConsants';
// Define action types

export const getExchangeTypes = () => {
    return callAPI('Exchange Type', GET_EXCHANGE_TYPES);
};

export const getShaftPositions = () => {
    return callAPI('Shaft Position', GET_SHAFT_POSITIONS);
};

export const getReasonOfChanges = () => {
    return callAPI('Reasons', GET_REASON_OF_CHANGES);
};

export const getBrands = () => {
    return callAPI('Brand', GET_BRANDS);
};

export const getModels = () => {
    return callAPI('Model', GET_MODELS);
};

export const getBearingTypes = () => {
    return callAPI('Part Type', GET_BEARING_TYPES);
};

function callAPI(URL, dispatchType) {
    return async (dispatch, getState) => {
        const token = getState().userReducer.token;
        API.GET(`nocodb/data/NKE-Tracebility/${URL}`, token)
            .then(res => {
                //Hide Loader
                if (res) {
                    dispatch({
                        type: dispatchType,
                        payload: res.list,
                    });
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
