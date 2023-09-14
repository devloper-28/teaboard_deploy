import * as actionLabels from "../../actionLabels";

export const loginAction = (payload) => {
  return {
    type: actionLabels.LOGIN_SAGA,
    payload,
  };
};
export const loginActionSuccess = (payload) => {
  return {
    type: actionLabels.LOGIN_SUCCESS,
    payload,
  };
};

export const loginActionFail = (payload) => ({
  type: actionLabels.LOGIN_FAIL,
  payload,
});
