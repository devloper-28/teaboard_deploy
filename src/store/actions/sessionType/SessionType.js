import { FETCH_SESSION_TYPE_FAILURE, FETCH_SESSION_TYPE_REQUEST, FETCH_SESSION_TYPE_SUCCESS } from "../../actionLabels/sessionType/SessionType";

export const fetchSessionTypeRequest = () => ({
    type: FETCH_SESSION_TYPE_REQUEST,
  });
  
  export const fetchSessionTypeSuccess = (data) => ({
    type: FETCH_SESSION_TYPE_SUCCESS,
    payload: data,
  });
  
  export const fetchSessionTypeFailure = (error) => ({
    type: FETCH_SESSION_TYPE_FAILURE,
    payload: error,
  });