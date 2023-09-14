import * as actionLabels from "../../actionLabels";
import {
  FETCH_SUB_TEATYPE_FAILURE,
  FETCH_SUB_TEATYPE_REQUEST,
  FETCH_SUB_TEATYPE_SUCCESS,
} from "../../actionLabels/teaType/TeaType";

export const teaTypeAction = () => {
  return {
    type: actionLabels.FETCH_TEA_TYPE,
  };
};

export const teaTypeActionSuccess = (teaTypeList) => {
  return {
    type: actionLabels.FETCH_TEA_TYPE_SUCCESS,
    payload: teaTypeList,
  };
};

export const teaTypeActionFail = () => ({
  type: actionLabels.FETCH_TEA_TYPE_FAIL,
});

export const fetchSubTeaTypeRequest = (teaTypeId) => ({
  type: FETCH_SUB_TEATYPE_REQUEST,
  payload: teaTypeId,
});

export const fetchSubTeaTypeSuccess = (data) => ({
  type: FETCH_SUB_TEATYPE_SUCCESS,
  payload: data,
});

export const fetchSubTeaTypeFailure = (error) => ({
  type: FETCH_SUB_TEATYPE_FAILURE,
  payload: error,
});
