import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { expenseSlice } from "./expense/expense-slice";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Combine the reducers (slices content) into a single reducer
const rootReducer = combineReducers({
  EXPENSE: expenseSlice.reducer,
});

// Create a basic configuration to tell redux to use the local storage
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["EXPENSE"], // This will persist the entire EXPENSE state including budget
};

// Persist the reducers
const persistedReducers = persistReducer(persistConfig, rootReducer);

// Send the persisted reducers to the store
const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persisted version of the store
const persistor = persistStore(store);

export { store, persistor }; 