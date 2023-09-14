// actions.js
import {
    FETCH_DOCUMENTS_REQUEST,
    FETCH_DOCUMENTS_SUCCESS,
    FETCH_DOCUMENTS_FAILURE,
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAILURE,
    GET_DOCUMENT_DETAIL_REQUEST,
    GET_DOCUMENT_DETAIL_SUCCESS,
    GET_DOCUMENT_DETAIL_FAILURE,
    POST_WAREHOUSE_USER_REQUEST,
    POST_WAREHOUSE_USER_SUCCESS,
    POST_WAREHOUSE_USER_FAILURE,
    UPDATE_WAREHOUSE_USER_REQUEST,
    UPDATE_WAREHOUSE_USER_SUCCESS,
    UPDATE_WAREHOUSE_USER_FAILURE,
    FETCH_AUCTION_REQUEST,
    FETCH_AUCTION_SUCCESS,
    FETCH_AUCTION_FAILURE,
    FETCH_STATE_REQUEST,
    FETCH_STATE_SUCCESS,
    FETCH_STATE_FAILURE,
    SEARCH_USERS_REQUEST,
    SEARCH_USERS_SUCCESS,
    SEARCH_USERS_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
  } from '../../actionLabels';
  
  export const fetchDocumentsRequest = () => ({
    type: FETCH_DOCUMENTS_REQUEST,
  });
  
  export const fetchDocumentsSuccess = (data) => ({
    type: FETCH_DOCUMENTS_SUCCESS,
    payload: data,
  });
  
  export const fetchDocumentsFailure = (error) => ({
    type: FETCH_DOCUMENTS_FAILURE,
    payload: error,
  });
  
 
  export const getUsersRequest = () => ({
    type: GET_USERS_REQUEST,
  });
  
  export const getUsersSuccess = (users) => ({
    type: GET_USERS_SUCCESS,
    payload: users,
  });
  
  export const getUsersFailure = (error) => ({
    type: GET_USERS_FAILURE,
    payload: error,
  });

  export const getDocumentDetailRequest = (documentId) => ({
    type: GET_DOCUMENT_DETAIL_REQUEST,
    payload: documentId,
  });
  
  export const getDocumentDetailSuccess = (data) => ({
    type: GET_DOCUMENT_DETAIL_SUCCESS,
    payload: data,
  });
  
  export const getDocumentDetailFailure = (error) => ({
    type: GET_DOCUMENT_DETAIL_FAILURE,
    payload: error,
  });
  
  export const postWarehouseUserRequest = (payload) => ({
    type: POST_WAREHOUSE_USER_REQUEST,
    payload:payload,
  });
  
  export const postWarehouseUserSuccess = (response) => ({
    type: POST_WAREHOUSE_USER_SUCCESS,
    response:response,
  });

  export const postWarehouseUserFailure = (error) => ({
    type: POST_WAREHOUSE_USER_FAILURE,
    error,
  });

  export const updateWarehouseUserRequest = (data) => ({
    type: UPDATE_WAREHOUSE_USER_REQUEST,
    payload: data,
  });
  
  export const updateWarehouseUserSuccess = (response) => ({
    type: UPDATE_WAREHOUSE_USER_SUCCESS,
    payload: response,
  });
  
  export const updateWarehouseUserFailure = (error) => ({
    type: UPDATE_WAREHOUSE_USER_FAILURE,
    payload: error,
  });

  
  export const fetchAuctionRequest = () => ({
    type: FETCH_AUCTION_REQUEST,
  });
  
  export const fetchAuctionSuccess = (data) => ({
    type: FETCH_AUCTION_SUCCESS,
    payload: data,
  });
  
  export const fetchAuctionFailure = (error) => ({
    type: FETCH_AUCTION_FAILURE,
    payload: error,
  });

  export const fetchStateRequest = () => ({
    type: FETCH_STATE_REQUEST,
  });
  
  export const fetchStateSuccess = (data) => ({
    type: FETCH_STATE_SUCCESS,
    payload: data,
  });
  
  export const fetchStateFailure = (error) => ({
    type: FETCH_STATE_FAILURE,
    payload: error,
  });

  export const searchUsersRequest = (query) => ({
    type: SEARCH_USERS_REQUEST,
    payload: query,
  });
  
  export const searchUsersSuccess = (data) => ({
    type: SEARCH_USERS_SUCCESS,
    payload: data,
  });
  
  export const searchUsersFailure = (error) => ({
    type: SEARCH_USERS_FAILURE,
    payload: error,
  });

  export const getUserRequest = (userId) => ({
    type: GET_USER_REQUEST,
    payload:userId ,
  });
  
  export const getUserSuccess = (user) => ({
    type: GET_USER_SUCCESS,
    payload: { user },
  });
  
  export const getUserFailure = (error) => ({
    type: GET_USER_FAILURE,
    payload: { error },
  });