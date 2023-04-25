// import { configureStore } from '@reduxjs/toolkit'
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import userReducer from './Login/LoginReducer';
import jobsReducer from './Jobs/JobsReducer';
import masterReducer from './Master/MasterReducer';
import reportsReducer from './Reports/ReportsReducer';
import attachmentsReducer from './Attachments/AttachmentReducer';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension';

// const middleware = [ thunk ];

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))

const persistConfig = {
	key: 'JobsPersist',
	storage: AsyncStorage
}
AsyncStorage.clear();

const rootReducer = combineReducers({
    userReducer : persistReducer(persistConfig, userReducer),
    jobsReducer : persistReducer(persistConfig, jobsReducer),
	reportsReducer : persistReducer(persistConfig, reportsReducer),
	attachmentsReducer : persistReducer(persistConfig, attachmentsReducer),
	masterReducer: persistReducer(persistConfig, masterReducer)
})

// const rootReducer = combineReducers({
//     userReducer,
//     jobsReducer
// })

// export const store = configureStore({
//     reducer: rootReducer,
// 	middleware: composedEnhancer
//     }
// );

export const store = createStore(rootReducer, composedEnhancer);

// export const persistor = persistStore(store);