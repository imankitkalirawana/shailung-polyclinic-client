// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Adjust the import based on your file structure

const store = configureStore({
  reducer: rootReducer,
});

export default store;
