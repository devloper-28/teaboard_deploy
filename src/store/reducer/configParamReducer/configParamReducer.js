import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getConfigParam: [],
  error: null,
  createdConfigParam: null,
  ConfigParamData: [],
  uploadedDocuments: [],
  createEditConfigureParameterApiStatus: false,
};

const getAllConfigParams = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_CONFIGURE_PARAMETER_SUCCESS:
      return {
        ...state,
        getConfigParam: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_CONFIGURE_PARAMETER_FAIL:
      return {
        ...state,
        getConfigParam: [],
        error: action.payload,
      };

    case actionTypes.CREATE_CONFIGURE_PARAMETER_SUCCESS:
      return {
        ...state,
        createdConfigParam: action.payload,
        error: null,
      };

    case actionTypes.CREATE_CONFIGURE_PARAMETER_FAIL:
      {
        console.log("CREATE_CONFIGURE_PARAMETER_FAIL: Reduser call ");
      }
      return {
        ...state,
        createdConfigParam: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_CONFIGURE_PARAMETER_SUCCESS:
      return {
        ...state,
        updatedConfigParam: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_CONFIGURE_PARAMETER_FAIL:
      return {
        ...state,
        updatedConfigParam: null,
        error: action.payload,
      };
    case actionTypes.GET_CONFIGURE_PARAMETER_BY_ID_SUCCESS:
      return {
        ...state,
        ConfigParamData: action.payload,
        error: null,
      };
    case actionTypes.GET_CONFIGURE_PARAMETER_BY_ID_FAIL:
      return {
        ...state,
        ConfigParamData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_CONFIGURE_PARAMETER_API_STATUS:
      return {
        ...state,
        createEditConfigureParameterApiStatus: action.payload.data,
      };
    default:
      return state;
  }
};

export default getAllConfigParams;
