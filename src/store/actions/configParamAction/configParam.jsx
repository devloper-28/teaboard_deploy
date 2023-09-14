import * as actionTypes from "../../actionLabels/configureParameter/configureParameter";

export const getConfigParam = (payloadConfigParamData) => {
  return {
    type: actionTypes.GET_ALL_CONFIGURE_PARAMETER,
    payload: payloadConfigParamData,
  };
};

export const getConfigParamSuccess = (ConfigParamData) => {
  return {
    type: actionTypes.GET_ALL_CONFIGURE_PARAMETER_SUCCESS,
    payload: ConfigParamData,
  };
};

export const getConfigParamFail = (error) => {
  return {
    type: actionTypes.GET_ALL_CONFIGURE_PARAMETER_FAIL,
    payload: error,
  };
};

// Action creator for creating a ConfigParam
export const createConfigParamAction = (newConfigParamData) => {
  return {
    type: actionTypes.CREATE_CONFIGURE_PARAMETER,
    payload: newConfigParamData,
  };
};

export const createConfigParamActionSuccess = (createdConfigParam) => {
  return {
    type: actionTypes.CREATE_CONFIGURE_PARAMETER_SUCCESS,
    payload: createdConfigParam,
  };
};

export const createConfigParamActionFail = (error) => ({
  type: actionTypes.CREATE_CONFIGURE_PARAMETER_FAIL,
  payload: error,
});

// Action creator for updating a ConfigParam
export const updateConfigParamAction = (updatedConfigParamData) => {
  return {
    type: actionTypes.UPDATE_CONFIGURE_PARAMETER,
    payload: {
      updatedConfigParamData,
    },
  };
};

export const updateConfigParamActionSuccess = (updatedConfigParam) => {
  return {
    type: actionTypes.UPDATE_CONFIGURE_PARAMETER_SUCCESS,
    payload: updatedConfigParam,
  };
};

export const updateConfigParamActionFail = (error) => ({
  type: actionTypes.UPDATE_CONFIGURE_PARAMETER_FAIL,
  payload: error,
});

// Action creator for getting state by ConfigParam ID
export const getConfigParamByIdAction = (ConfigParamId) => {
  return {
    type: actionTypes.GET_CONFIGURE_PARAMETER_BY_ID,
    payload: ConfigParamId,
  };
};

export const getConfigParamByIdActionSuccess = (ConfigParamData) => {
  return {
    type: actionTypes.GET_CONFIGURE_PARAMETER_BY_ID_SUCCESS,
    payload: ConfigParamData,
  };
};

export const getConfigParamByIdActionFail = (error) => ({
  type: actionTypes.GET_CONFIGURE_PARAMETER_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsConfigParamAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM,
  };
};

export const uploadAllDocumentsConfigParamSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsConfigParamFail = (error) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM_FAIL,
    payload: error,
  };
};

export const createEditConfigureParameterApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_CONFIGURE_PARAMETER_API_STATUS,
    payload: { data: data },
  };
};
