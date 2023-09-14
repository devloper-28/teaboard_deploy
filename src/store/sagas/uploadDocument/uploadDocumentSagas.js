import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import { GET_DOCUMENT_BY_ID, GET_HISTORY_BY_ID } from "../../actionLabels";
import {
  getDocumentByIdActionSuccess,
  getDocumentByIdActionFail,
  getHistoryByIdSuccess,
  getHistoryByIdFail,
} from "../../actions";

//Fetch state by ID
function* getDocumentByIdSaga(action) {
  try {
    const uploadData = yield call(
      axiosMain.get,
      `/admin/getdocumentdetail/${action.payload}`
    );

    if (uploadData.status == 200) {
      yield put(getDocumentByIdActionSuccess(uploadData.data));
    } else {
      yield put(getDocumentByIdActionFail(uploadData.message));
    }
  } catch (error) {
    yield put(getDocumentByIdActionFail(error));
  }
}

function* getHistoryByIdSaga(action) {
  try {
    const tableName = action.payload.tableName;
    const moduleName = action.payload.moduleName;
    const tableId = action.payload.id;
    const historyData = yield call(
      axiosMain.get,
      `/admin/getHistory/${tableName}/${moduleName}/${tableId}`
    );

    if (historyData.status == 200) {
      yield put(getHistoryByIdSuccess(historyData.data));
    } else {
      yield put(getHistoryByIdFail(historyData.message));
    }
  } catch (error) {
    yield put(getHistoryByIdFail(error));
  }
}

export function* documentSaga() {
  yield all([
    takeEvery(GET_DOCUMENT_BY_ID, getDocumentByIdSaga),
    takeEvery(GET_HISTORY_BY_ID, getHistoryByIdSaga),
  ]);
}
