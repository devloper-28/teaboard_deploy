import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import {
  getAllAuctionCenterAction,
  getAllAuctionCenterActionSuccess,
  getAllAuctionCenterActionFail,
  updateAuctionCenterActionSuccess,
  updateAuctionCenterActionFail,
  createAuctionCenterActionSuccess,
  createAuctionCenterActionFail,
  searchAuctionCenterActionSuccess,
  searchAuctionCenterActionFail,
  getAuctionCenterByIdActionSuccess,
  getAuctionCenterByIdActionFail,
  uploadAllDocumentsAuctionCenterSuccess,
  uploadAllDocumentsAuctionCenterFail,
  createEditAuctionCenterApiStatus,
  searchAuctionCenterAction,
} from "../../actions";
import { toast } from "react-toastify";

function* getAllAuctionCenterSaga() {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/auctionCenter/search`,
      {}
    );
    if (response.status === 200) {
      yield put(getAllAuctionCenterActionSuccess(response.data));
    } else {
      yield put(getAllAuctionCenterActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllAuctionCenterActionFail(error));
  }
}
// CREATE AUCTION CENTER
function* createAuctionCenter(action) {
  try {
    const createdAuctionCenter = yield call(
      axiosMain.post,
      `/admin/auctionCenter/create`,
      action.payload
    );

    if (createdAuctionCenter.status == 200) {
      if (createdAuctionCenter.data.statusCode == 200) {
        toast.success(createdAuctionCenter.data.message);
        yield put(createAuctionCenterActionSuccess(createdAuctionCenter));
        yield put(getAllAuctionCenterAction());
        yield put(searchAuctionCenterAction({}));
        yield put(createEditAuctionCenterApiStatus(true));
      } else {
        toast.error(createdAuctionCenter.data.message);
        yield put(
          createAuctionCenterActionFail(createdAuctionCenter.data.message)
        );
      }
    } else {
      yield put(
        createAuctionCenterActionFail(
          createdAuctionCenter.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createAuctionCenterActionFail(error));
  }
}
// UPDATE AUCTION CENTER
function* updateAuctionCenter(action) {
  try {
    const updatedAuctionCenter = yield call(
      axiosMain.post,
      `/admin/auctionCenter/update`,
      action.payload
    );
    if (updatedAuctionCenter.status == 200) {
      if (updatedAuctionCenter.data.statusCode == 200) {
        toast.success(updatedAuctionCenter.data.message);
        yield put(updateAuctionCenterActionSuccess(updatedAuctionCenter));
        yield put(getAllAuctionCenterAction());
        yield put(searchAuctionCenterAction(action.payload.searchData));
        yield put(createEditAuctionCenterApiStatus(true));
      } else {
        toast.error(updatedAuctionCenter.data.message);
        yield put(
          updateAuctionCenterActionSuccess(updatedAuctionCenter.data.message)
        );
      }
    } else {
      yield put(updateAuctionCenterActionSuccess(updatedAuctionCenter.massage));
    }
  } catch (error) {
    yield put(updateAuctionCenterActionFail(error));
  }
}

// SEARCH AUCTION CENTER
function* searchAuctionCenter(action) {
  try {
    const searchResults = yield call(
      axiosMain.post,
      `/admin/auctionCenter/search`,
      action.payload
    );
    if (searchResults.status === 200) {
      yield put(searchAuctionCenterActionSuccess(searchResults.data));
    } else {
      yield put(searchAuctionCenterActionSuccess(searchResults.massage));
    }
  } catch (error) {
    yield put(searchAuctionCenterActionFail(error));
  }
}

// GET AUCTION CENTER BY ID
function* getAuctionCenterById(action) {
  try {
    const auctionCenter = yield call(
      axiosMain.get,
      `/admin/auctionCenter/get/${action.payload}`
    );
    if (auctionCenter.status == 200) {
      yield put(getAuctionCenterByIdActionSuccess(auctionCenter.data));
    } else {
      yield put(getAuctionCenterByIdActionSuccess(auctionCenter.massage));
    }
  } catch (error) {
    yield put(getAuctionCenterByIdActionFail(error));
  }
}

function* uploadDocumentAuctionCenter(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/auctionCenter/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsAuctionCenterSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsAuctionCenterFail(error.message));
  }
}

export function* allAuctionCenterSaga() {
  yield all([
    yield takeEvery(
      actionTypes.GET_ALL_AUCTION_CENTER,
      getAllAuctionCenterSaga
    ),
    yield takeEvery(actionTypes.CREATE_AUCTION_CENTER, createAuctionCenter),
    yield takeEvery(actionTypes.UPDATE_AUCTION_CENTER, updateAuctionCenter),
    yield takeEvery(actionTypes.SEARCH_AUCTION_CENTER, searchAuctionCenter),
    yield takeEvery(actionTypes.GET_AUCTION_CENTER_BY_ID, getAuctionCenterById),
    yield takeEvery(
      actionTypes.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER,
      uploadDocumentAuctionCenter
    ),
  ]);
}
