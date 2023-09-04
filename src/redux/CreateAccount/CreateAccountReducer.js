import { GET_COUNTRIES, GET_CUSTOMER_SECTOR, LOADING_DATA } from "../ReduxConsants"

const initialState = {
    countries: [],
    customerSectors: [],
    loading: false
}

const createAccountReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_COUNTRIES:
            return {
                ...state,
                countries: action.payload
            }
        case GET_CUSTOMER_SECTOR:
            return {
                    ...state,
                    customerSectors: action.payload
            }
        case LOADING_DATA:
            return {
                ...state,
                loading: action.payload
            }    
        default:
            return state;        
    }
}

export default createAccountReducer;
