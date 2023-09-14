import * as actionLabels from '../../actionLabels';

const initialState = {
  token:'',
  errorMsg:''
};

export default (state = initialState, {type,payload}) => {
  switch (type) {
    case actionLabels.LOGIN_SUCCESS: {
      return {
        ...state,
        token: payload.token,
      };
    }
    case actionLabels.LOGIN_FAIL:{
      return {
        ...state,
       errorMsg:payload
      }
    }
    default:
      return state;
  }
};
