// sagas.js
import { call, put, takeEvery } from 'redux-saga/effects';
import axios, { all } from 'axios'; // Make sure you've installed Axios

import axiosMain from '../../../http/axios/axios_main';
import { createUserFailure, createUserSuccess, createWarehouseUserFailure, createWarehouseUserSuccess, fetchAuctionCenterFailure, fetchAuctionCenterSuccess, fetchAuctionFailure, fetchAuctionSuccess, fetchDocumentsFailure, fetchDocumentsSuccess, fetchStateFailure, fetchStateSuccess, getDocumentDetailFailure, getDocumentDetailSuccess, getUserFailure, getUserSuccess, getUsersFailure, getUsersSuccess, postWarehouseUserFailure, postWarehouseUserSuccess, searchUsersFailure, searchUsersSuccess, updateWarehouseUserFailure, updateWarehouseUserSuccess } from '../../actions';
import { CREATE_USER_REQUEST, CREATE_WAREHOUSE_USER_REQUEST, FETCH_AUCTION_CENTER_REQUEST, FETCH_AUCTION_REQUEST, FETCH_DOCUMENTS_REQUEST, FETCH_STATE_REQUEST, GET_DOCUMENT_DETAIL_REQUEST,  GET_USERS_REQUEST, GET_USER_REQUEST, POST_WAREHOUSE_USER_REQUEST, SEARCH_USERS_REQUEST, UPDATE_WAREHOUSE_USER_REQUEST } from '../../actionLabels';

// Replace with your API endpoint
const API_URL = '/admin/WareHouseUserReg/getAllUploaddocument';
const GET_ALL_USERS_API = "/admin/WareHouseUserReg/search"
const GET_PDF_API =  '/admin/getdocumentdetail';
const CREATE_USER_API = '/admin/WareHouseUserReg/create';
const UPDATE_API = '/admin/WareHouseUserReg/update';
const AUCTION_CENTER = "/admin/auctionCenter/search"
const STATE_API = "/admin/state/search";
const SEARCH_API = "/admin/WareHouseUserReg/search";
const GET_USER_BY_ID = "/admin/WareHouseUserReg/get"

// Axios GET request
function fetchDocumentsApi() {
  return axiosMain.get(API_URL);
}
function fetchUsersApi() {
  return axiosMain.post(GET_ALL_USERS_API,{});
}
function DownloadPDF(documentId) {
  return axiosMain.get(`${GET_PDF_API}/${documentId}`);
}

function CreateUserAPI(UserData) {
  return axiosMain.post(CREATE_USER_API,UserData);
}

function UpdateUser(UpdatedData){
  return axiosMain.post(UPDATE_API,UpdatedData)
}


function fetchAuctionCenter(){
  return axiosMain.post(AUCTION_CENTER,{})
}

function fetchStateDataFromApi(){
  return axiosMain.post(STATE_API,{})
}

function searchUsersFromApi(usersearch){
  return axiosMain.post(SEARCH_API,usersearch)
}

function getUsersById(userId){
  return axiosMain.get(`${GET_USER_BY_ID}/${userId}`);
}

// Saga function to handle the API call
function* fetchDocuments() {
  try {
    const response = yield call(fetchDocumentsApi);
    const data = response.data; // Assuming your response contains the data you need
    yield put(fetchDocumentsSuccess(data));
  } catch (error) {
    yield put(fetchDocumentsFailure(error));
  }
}

function* getUsers() {
  try {
    const users = yield call(fetchUsersApi);
    yield put(getUsersSuccess(users)); // Use the action creator function
  } catch (error) {
    yield put(getUsersFailure(error.message)); // Use the action creator function
  }
}
 
function* getDocumentDetail(action) {
  try {
    const documentId = action.payload;    
    const response = yield call(DownloadPDF, documentId);
    const data = response.data;
    yield put(getDocumentDetailSuccess(data));
  } catch (error) {
    yield put(getDocumentDetailFailure(error));
  }
}

function* postWarehouseUserSaga(action) {
  try {
    const response = yield call(CreateUserAPI, action.payload);
    console.log('res',response.data)
    yield put(postWarehouseUserSuccess(response.data));
  } catch (error) {
    yield put(postWarehouseUserFailure(error));
  }
}
 
function* updateWarehouseUser(action) {
  try {
    const response = yield call(UpdateUser, action.payload);
    yield put(updateWarehouseUserSuccess(response));
  } catch (error) {
    yield put(updateWarehouseUserFailure(error));
  }
}

function* fetchAuctionSaga() {
  try {
    const response = yield call(fetchAuctionCenter);
    yield put(fetchAuctionSuccess(response.data));
  } catch (error) {
    yield put(fetchAuctionFailure(error.message));
  }
}

function* fetchStateData() {
  try {
    const data = yield call(fetchStateDataFromApi);
    yield put(fetchStateSuccess(data));
  } catch (error) {
    yield put(fetchStateFailure(error));
  }
}

function* searchUsers(action) {
  try {
    const data = yield call(searchUsersFromApi, action.payload);
    yield put(searchUsersSuccess(data));
  } catch (error) {
    yield put(searchUsersFailure(error));
  }
}

function* getUserById(action) {
  try {
    
    const user = yield call(getUsersById, action.payload);  

    yield put(getUserSuccess(user));
  } catch (error) {
    yield put(getUserFailure(error));
  }
}



function* warehouseUserRegistration() {
  yield all([
    yield takeEvery(FETCH_DOCUMENTS_REQUEST, fetchDocuments),
    yield takeEvery(GET_USERS_REQUEST, getUsers),
    yield takeEvery(GET_DOCUMENT_DETAIL_REQUEST, getDocumentDetail),
    yield takeEvery(POST_WAREHOUSE_USER_REQUEST, postWarehouseUserSaga),
    yield takeEvery(UPDATE_WAREHOUSE_USER_REQUEST, updateWarehouseUser),
    yield takeEvery(FETCH_AUCTION_REQUEST, fetchAuctionSaga),
    yield takeEvery(FETCH_STATE_REQUEST, fetchStateData),
    yield takeEvery(SEARCH_USERS_REQUEST, searchUsers),
    yield takeEvery(GET_USER_REQUEST, getUserById),
  ]);
}

export default warehouseUserRegistration;
