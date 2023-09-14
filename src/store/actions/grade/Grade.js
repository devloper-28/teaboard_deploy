import { FETCH_GRADE_FAILURE, FETCH_GRADE_REQUEST, FETCH_GRADE_SUCCESS } from "../../actionLabels";

  
  export const fetchGradeRequest = () => ({
    type: FETCH_GRADE_REQUEST,
  });
  
  export const fetchGradeSuccess = (data) => ({
    type: FETCH_GRADE_SUCCESS,
    payload: data,
  });
  
  export const fetchGradeFailure = (error) => ({
    type: FETCH_GRADE_FAILURE,
    payload: error,
  });
  