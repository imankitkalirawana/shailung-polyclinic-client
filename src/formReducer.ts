// actions.js
export const submitFormData = (formData: any) => {
  return {
    type: 'SUBMIT_FORM_DATA',
    payload: formData,
  };
};

// reducers.js
const initialState = {
  formData: {},
};

const formReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SUBMIT_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
      };
    default:
      return state;
  }
};

export default formReducer;
