// reducers.js
import { combineReducers } from 'redux';

const initialFormState = {
    formData: [],
};

const formReducer = (state = initialFormState, action) => {
    switch (action.type) {
        case 'ADD_FORM_DATA':
            return {
                ...state,
                formData: [...state.formData, action.payload],
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    formData: formReducer,
    // other reducers if any
});

export default rootReducer;
