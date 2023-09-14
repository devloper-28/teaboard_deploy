// sagas.js
import { put, takeLatest, call } from "redux-saga/effects";

import { all } from "axios";
import {
  fetchSaleNumbersFailure,
  fetchSaleNumbersSuccess,
} from "../../actions/createdSaleNo/CreatedSaleNo";
import { FETCH_SALE_NUMBERS_REQUEST } from "../../actionLabels";
import axiosMain from "../../../http/axios/axios_main";

function* fetchSaleNumbersSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/Common/BindSaleNoBySeason?season=${action.payload}`,
      action.payload
    );  
    const responseData = response.data;
    yield put(fetchSaleNumbersSuccess(responseData));
  } catch (error) {
    yield put(fetchSaleNumbersFailure(error.message));
  }
}

function* createdSaleNo() {
  yield all([
    yield takeLatest(FETCH_SALE_NUMBERS_REQUEST, fetchSaleNumbersSaga),
  ]);
}

export default createdSaleNo;
