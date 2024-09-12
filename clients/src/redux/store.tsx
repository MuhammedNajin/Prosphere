import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';
import { authReducer } from './Auth';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};


const rootReducer = combineReducers({
  auth: authReducer,
 
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});


export const persistor = persistStore(store);

export default store;