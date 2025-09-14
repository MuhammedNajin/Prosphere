import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';
import { userReducer } from './reducers/userSlice';
import { companyReducer } from './reducers/companySlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'company'], // Updated to match new reducer name
};

const rootReducer = combineReducers({
  user: userReducer, // Changed from 'auth: authReducer'
  company: companyReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;