// saga.js

import { put, takeEvery, call } from "redux-saga/effects";
import {
  ADD_LOT_SERIES_REQUEST,
  DELETE_LOT_SERIES_REQUEST,
  FETCH_LOT_SERIES_BY_ID_REQUEST,
  FETCH_LOT_SERIES_REQUEST,
  UPDATE_LOT_SERIES_REQUEST,
} from "../../actionLabels";
import {
  addLotSeriesFailure,
  addLotSeriesSuccess,
  deleteLotSeriesFailure,
  deleteLotSeriesSuccess,
  fetchLotSeriesByIdFailure,
  fetchLotSeriesByIdSuccess,
  fetchLotSeriesFailure,
  fetchLotSeriesSuccess,
  updateLotSeriesFailure,
  updateLotSeriesSuccess,
} from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import { toast } from "react-toastify";

// Replace the URLs with the actual endpoints for different APIs
// const OTHER_API_URL = 'http://example.com/api/endpoint';

function* fetchLotSeriesSaga(action) {
  try {
    // Extract the payload from the action
    const requestData = action.payload;

    const response = yield call(
      axiosMain.post,
      "/preauction/LotNoSeries/GetLotSeries",
      requestData
    );

    // Dispatch the success action with the response data
    yield put(fetchLotSeriesSuccess(response.data));
  } catch (error) {
    // Dispatch the failure action with the error message
    yield put(fetchLotSeriesFailure(error.message));
  }
}

function* fetchLotSeriesByIdSaga(action) {
  console.log("Saga triggered!"); //
  try {
    // Extract the "lotNoSeriesID" from the action payload
    const lotNoSeriesID = action.payload;
    // Make the GET API call with the dynamic ID
    const response = yield call(
      axiosMain.get,
      `/preauction/LotNoSeries/GetLotSeriesById?lotNoSeriesID=${lotNoSeriesID}`
    );

    // Dispatch the success action with the response data
    yield put(fetchLotSeriesByIdSuccess(response.data));
  } catch (error) {
    // Dispatch the failure action with the error message
    yield put(fetchLotSeriesByIdFailure(error.message));
  }
}

function* addLotSeriesSaga(action) {
  try {
    const requestData = action.payload;

    // Make the POST API call
    const response = yield call(
      axiosMain.post,
      "/preauction/LotNoSeries/AddLotNoSeries",
      requestData
    );

    // if (response.data.statusCode === 200) {
    //   // console.log(response, "response,response");
    //   toast.success(response.data.message);
    yield put(addLotSeriesSuccess(response.data));
    
    // } else {
    //   toast.error(response.data.message);
    // }

    // Dispatch the success action with the response data
    if (response.data.statusCode === 200) {
      toast.success(response.data.message);
      return;
    }
    if (response.data.statusCode === 403) {
      toast.warning(response.data.message);
      return;
    }
  } catch (error) {
    // Dispatch the failure action with the error message
    yield put(addLotSeriesFailure(error.message));
  }
}

function* updateLotSeriesSaga(action) {
  try {
    const requestData = action.payload;

    // Make the POST API call
    const response = yield call(
      axiosMain.post,
      "/preauction/LotNoSeries/UpdateLotSeries",
      requestData
    );

    // Dispatch the success action with the response data
    yield put(updateLotSeriesSuccess(response.data));
  } catch (error) {
    // Dispatch the failure action with the error message
    yield put(updateLotSeriesFailure(error.message));
  }
}

function* deleteLotSeriesSaga(action) {
  try {
    const requestData = action.payload;

    // Make the GET API call
    const response = yield call(
      axiosMain.post,
      `/preauction/LotNoSeries/DeleteLotSeries`,
      requestData
    );

    if (response.data.statusCode === 200) {
      toast.success(response.data.message);
      return;
    }
    if (response.data.statusCode === 403) {
      toast.warning(response.data.message);
      return;
    }

    // Dispatch the success action with the response data
    yield put(deleteLotSeriesSuccess(response.data));
  } catch (error) {
    // Dispatch the failure action with the error message
    yield put(deleteLotSeriesFailure(error.message));
  }
}

function* watchLotNotSeriesSaga() {
  yield takeEvery(FETCH_LOT_SERIES_REQUEST, fetchLotSeriesSaga);
  yield takeEvery(FETCH_LOT_SERIES_BY_ID_REQUEST, fetchLotSeriesByIdSaga);
  yield takeEvery(ADD_LOT_SERIES_REQUEST, addLotSeriesSaga);
  yield takeEvery(UPDATE_LOT_SERIES_REQUEST, updateLotSeriesSaga);
  yield takeEvery(DELETE_LOT_SERIES_REQUEST, deleteLotSeriesSaga);
}

export default watchLotNotSeriesSaga;
