/* eslint-disable import/prefer-default-export */
import { all, takeEvery, put, call } from "redux-saga/effects";
import {
  loginActionFail,
  loginActionSuccess,
} from "../../actions";
import * as actionLabels from "../../actionLabels";
import axiosMain from "../../../http/axios/axios_main";

// eslint-disable-next-line no-unused-vars
function* loginSaga(action) {
    console.log("entered in saga")
  const { id } = action.payload;
  try {
    const response = yield axiosMain
      .post(`/user/connectUser/${id}`)
      .then((res) => res)
      .catch((err) => err);
    if (response.status === 200) {
      yield put(
        loginActionSuccess({ token: response.data?.data?.accessToken })
      );
    } else {
      yield put(loginActionFail("error"));
    }
  } catch (err) {
    console.log(err);
  }
}

export default function* rootsaga() {
  yield all([yield takeEvery(actionLabels.LOGIN_SAGA, loginSaga)]);
}
