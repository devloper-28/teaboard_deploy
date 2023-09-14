import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_ROLES,
  CREATE_ROLE,
  UPDATE_ROLE,
  SEARCH_ROLE,
  GET_ROLE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_ROLE,
} from "../../actionLabels";
import {
  getAllRoles,
  getAllRolesSuccess,
  getAllRolesFail,
  createRoleSuccess,
  createRoleFail,
  updateRoleSuccess,
  updateRoleFail,
  searchRoleSuccess,
  searchRoleFail,
  getRoleByIdSuccess,
  getRoleByIdFail,
  uploadAllDocumentsRoleSuccess,
  uploadAllDocumentsRoleFail,
  searchRole,
  createEditRoleApiStatus,
} from "../../actions";
import { toast } from "react-toastify";

// Worker function for getting all roles
function* getAllRolesSaga() {
  try {
    const response = yield call(axiosMain.post, `/admin/role/search`, {});
    yield put(getAllRolesSuccess(response.data));
  } catch (error) {
    yield put(getAllRolesFail(error));
  }
}
// Worker function for creating a new role
function* createRoleSaga(action) {
  try {
    const { roleData } = action.payload;

    const response = yield call(axiosMain.post, `/admin/role/create`, roleData);
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        toast.success(response.data.message);
        yield put(createRoleSuccess());
        yield put(getAllRoles());
        yield put(searchRole({}));
        yield put(createEditRoleApiStatus(true));
      } else {
        toast.error(response.data.message);
        yield put(createRoleFail(response.data.message));
      }
    } else {
      yield put(
        createRoleFail(response.data.message || "Unknown error occurred.")
      );
    }
  } catch (error) {
    yield put(createRoleFail(error));
  }
}
// Worker function for updating a role
function* updateRoleSaga(action) {
  try {
    const { updatedData } = action.payload;
    const response = yield call(
      axiosMain.post,
      `/admin/role/update`,
      updatedData
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        toast.success(response.data.message);
        yield put(updateRoleSuccess(response));
        yield put(searchRole(action.payload.updatedData.searchData));
        yield put(createEditRoleApiStatus(true));
      } else {
        toast.error(response.data.message);
        yield put(updateRoleFail(response.data.message));
      }
    } else {
      yield put(
        updateRoleFail(response.data.message || "Unknown error occurred.")
      );
    }
  } catch (error) {
    yield put(updateRoleFail(error));
  }
}

// Worker function for searching roles based on criteria
function* searchRoleSaga(action) {
  try {
    const { searchCriteria } = action.payload;
    const response = yield call(
      axiosMain.post,
      `/admin/role/search`,
      searchCriteria
    );
    yield put(searchRoleSuccess(response.data));
  } catch (error) {
    yield put(searchRoleFail(error));
  }
}

// Worker function for getting a role by ID
function* getRoleByIdSaga(action) {
  try {
    const { roleId } = action.payload;
    const response = yield call(axiosMain.get, `/admin/role/get/${roleId}`);
    yield put(getRoleByIdSuccess(response.data));
  } catch (error) {
    yield put(getRoleByIdFail(error));
  }
}
function* uploadDocumentRole(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/role/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsRoleSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsRoleFail(error.message));
  }
}

export function* roleSaga() {
  yield all([
    yield takeEvery(GET_ALL_ROLES, getAllRolesSaga),
    yield takeEvery(CREATE_ROLE, createRoleSaga),
    yield takeEvery(UPDATE_ROLE, updateRoleSaga),
    yield takeEvery(SEARCH_ROLE, searchRoleSaga),
    yield takeEvery(GET_ROLE_BY_ID, getRoleByIdSaga),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_ROLE, uploadDocumentRole),
  ]);
}
