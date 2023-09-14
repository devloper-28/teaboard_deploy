import { all, call, put, takeEvery } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_CONFIGURE_PARAMETER,
  UPDATE_CONFIGURE_PARAMETER,
  CREATE_CONFIGURE_PARAMETER,
  GET_CONFIGURE_PARAMETER_BY_ID,
  UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM,
} from "../../actionLabels";
import { toast } from "react-toastify";

function* getAllConfigParamSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/ConfigureParameter/search",
      action.payload
    );
    yield put(allActions.getConfigParamSuccess(response.data));
  } catch (error) {
    yield put(allActions.getConfigParamFail(error));
  }
}
function* updatedConfigParamSaga(action) {
  try {
    const { updatedConfigParamData } = action.payload;
    const updatedConfigParam = yield call(
      axiosMain.post,
      `/admin/ConfigureParameter/update`,
      updatedConfigParamData
    );
    if (updatedConfigParam.status == 200) {
      if (updatedConfigParam.data.statusCode == 200) {
        toast.success(updatedConfigParam.data.message);
        yield put(
          allActions.updateConfigParamActionSuccess(updatedConfigParam)
        );
        yield put(allActions.getConfigParam(updatedConfigParamData.searchData));
        yield put(allActions.createEditConfigureParameterApiStatus(true));
      } else {
        toast.error(updatedConfigParam.data.message);
        yield put(
          allActions.updateConfigParamActionFail(
            updatedConfigParam.data.message
          )
        );
      }
    } else {
      yield put(allActions.updateConfigParamActionFail(updatedConfigParam));
    }
  } catch (error) {
    yield put(allActions.updateConfigParamActionFail(error));
  }
}
function* createConfigParamSaga(action) {
  try {
    const newConfigParamData = action.payload;
    const createdConfigParam = yield call(
      axiosMain.post,
      `/admin/ConfigureParameter/create`,
      newConfigParamData
    );

    if (createdConfigParam.data.statusCode == 200) {
      toast.success(createdConfigParam.data.message);
      yield put(allActions.createConfigParamActionSuccess(createdConfigParam));
      yield put(allActions.getConfigParam({}));
      yield put(allActions.createEditConfigureParameterApiStatus(true));
    } else {
      toast.error(createdConfigParam.data.message);
      yield put(
        allActions.createConfigParamActionFail(createdConfigParam.data.message)
      );
    }
  } catch (error) {
    yield put(allActions.createConfigParamActionFail(error));
  }
}
function* getConfigParamByIdSaga(action) {
  try {
    const ConfigParamId = action.payload;
    const ConfigParamData = yield call(
      axiosMain.get,
      `/admin/ConfigureParameter/get/${ConfigParamId}`
    );
    yield put(allActions.getConfigParamByIdActionSuccess(ConfigParamData.data));
  } catch (error) {
    yield put(allActions.getConfigParamByIdActionFail(error));
  }
}
function* uploadDocumentConfigParam(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/ConfigureParameter/getdocumentdetail/alluploaddocument"
    );
    yield put(allActions.uploadAllDocumentsConfigParamSuccess(response.data));
  } catch (error) {
    yield put(allActions.uploadAllDocumentsConfigParamFail(error.message));
  }
}
export function* configParamSagas() {
  yield all([
    yield takeEvery(GET_ALL_CONFIGURE_PARAMETER, getAllConfigParamSaga),
    yield takeEvery(UPDATE_CONFIGURE_PARAMETER, updatedConfigParamSaga),
    yield takeEvery(CREATE_CONFIGURE_PARAMETER, createConfigParamSaga),
    yield takeEvery(GET_CONFIGURE_PARAMETER_BY_ID, getConfigParamByIdSaga),
    yield takeEvery(
      UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM,
      uploadDocumentConfigParam
    ),
  ]);
}
export default configParamSagas;
