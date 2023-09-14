import * as actionTypes from "../../actionLabels/index";

const initialState = {
  documentData: [],
  error: null,
  historyData: [],
};

const documentByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DOCUMENT_BY_ID_SUCCESS:
      return {
        ...state,
        documentData: action.payload,
        error: null,
      };
    case actionTypes.GET_DOCUMENT_BY_ID_FAIL:
      return {
        ...state,
        documentData: [],
        error: action.payload,
      };
    case actionTypes.GET_HISTORY_BY_ID_SUCCESS:
      return {
        ...state,
        historyData: action.payload,
        error: null,
      };
    case actionTypes.GET_HISTORY_BY_ID_FAIL:
      return {
        ...state,
        historyData: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default documentByIdReducer;
