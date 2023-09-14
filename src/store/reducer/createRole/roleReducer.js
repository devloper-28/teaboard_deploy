import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allRoles: [],
  searchedRoles: [],
  roleById: [],
  error: null,
  uploadedDocuments: [],
  createEditRoleApiStatus: false,
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_ROLES_SUCCESS:
      return {
        ...state,
        allRoles: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_ROLES_FAIL:
      return {
        ...state,
        allRoles: [],
        error: action.payload,
      };

    case actionTypes.CREATE_ROLE_SUCCESS:
      return {
        ...state,
        error: null,
      };

    case actionTypes.CREATE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        error: null,
      };

    case actionTypes.UPDATE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.SEARCH_ROLE_SUCCESS:
      return {
        ...state,
        searchedRoles: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_ROLE_FAIL:
      return {
        ...state,
        searchedRoles: [],
        error: action.payload,
      };

    case actionTypes.GET_ROLE_BY_ID_SUCCESS:
      return {
        ...state,
        roleById: action.payload,
        error: null,
      };

    case actionTypes.GET_ROLE_BY_ID_FAIL:
      return {
        ...state,
        roleById: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_ROLE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_ROLE_API_STATUS:
      return {
        ...state,
        createEditRoleApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default roleReducer;
