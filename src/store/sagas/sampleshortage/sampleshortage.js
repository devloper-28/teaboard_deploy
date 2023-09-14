import { all, takeEvery, call, put } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  CHECK_PACKAGE_REQUEST,
  FETCH_SAMPLE_SHORTAGE_ID_REQUEST,
  FETCH_SAMPLE_SHORTAGE_LIST_REQUEST,
  UPDATE_SAMPLE_SHORTAGE_REQUEST,
  UPLOAD_SAMPLE_SHORTAGE_REQUEST,
} from "../../actionLabels";
import {
  checkPackageFailure,
  checkPackageSuccess,
  fetchSampleShortageFailure,
  fetchSampleShortageListFailure,
  fetchSampleShortageListSuccess,
  fetchSampleShortageSuccess,
  updateSampleShortageFailure,
  updateSampleShortageSuccess,
  uploadSampleShortageFailure,
  uploadSampleShortageSuccess,
} from "../../actions";

function fetchSampleShortageListAPI(requestData) {
  return axiosMain.post("/preauction/SampleShortage/GetSampleShortageList", requestData);
}

function* fetchSampleShortageListSaga(action) {
  try {
    const response = yield call(fetchSampleShortageListAPI, action.payload);
    yield put(fetchSampleShortageListSuccess(response.data));
  } catch (error) {
    yield put(fetchSampleShortageListFailure(error));
  }
}

function fetchSampleShortageAPI(shortWeightId) {
  return axiosMain
    .post(`/preauction/SampleShortage/GetSampleShortageById?shortWeightId=${shortWeightId}`)
    .then((response) => response.data);
}

function* fetchSampleShortage(action) {
  try {
    const response = yield call(
      fetchSampleShortageAPI,
      action.payload.shortWeightId
    );
    yield put(fetchSampleShortageSuccess(response));
  } catch (error) {
    yield put(fetchSampleShortageFailure(error.message));
  }
}
function* checkPackageSaga(action) {
  try {
    const response = yield call(fetchCheckPackageAPI, action.payload);

    if (response.status === 200) {
      const result = response.data;
      yield put(checkPackageSuccess(result));
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    yield put(checkPackageFailure(error.message));
  }
}

function fetchCheckPackageAPI(payload) {
  return axiosMain.post("/preauction/SampleShortage/CheckPackageNoByLotNo", payload);
}

function* uploadSampleShortageSaga(action) {
  try {
    yield call(uploadSampleShortageAPI, action.payload);
    yield put(uploadSampleShortageSuccess());
  } catch (error) {
    yield put(uploadSampleShortageFailure(error.message));
  }
}

function uploadSampleShortageAPI(data) {
  return axiosMain.post("/preauction/SampleShortage/UploadSampleShortage", data);
}

function* updateSampleShortageSaga(action) {
  try {
    yield call(updateSampleShortageAPI, action.payload);
    yield put(updateSampleShortageSuccess());
  } catch (error) {
    yield put(updateSampleShortageFailure(error.message));
  }
}

function updateSampleShortageAPI(data) {
  return axiosMain.post("/preauction/SampleShortage/UpdateSampleShortage", data);
}

function* sampleshortagesaga() {
  yield all([
    yield takeEvery(
      FETCH_SAMPLE_SHORTAGE_LIST_REQUEST,
      fetchSampleShortageListSaga
    ),
    yield takeEvery(FETCH_SAMPLE_SHORTAGE_ID_REQUEST, fetchSampleShortage),
    yield takeEvery(CHECK_PACKAGE_REQUEST, checkPackageSaga),
    yield takeEvery(UPLOAD_SAMPLE_SHORTAGE_REQUEST, uploadSampleShortageSaga),
    yield takeEvery(UPDATE_SAMPLE_SHORTAGE_REQUEST, updateSampleShortageSaga),
  ]);
}

export default sampleshortagesaga;
