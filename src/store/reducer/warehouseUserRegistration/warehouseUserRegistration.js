// reducer.js
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
} from "../../actionLabels";

const initialState = {
  documents: [],
  users: [],
  auctionCenter: [],
  stateList: [],
  userSearch: [],
  data: null,
  loading: false,
  error: null,
  createUser: "null",
  updatedData: null,
  userById:null,
};

const warehouseUserRegistration = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOCUMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_DOCUMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        documents: action.payload,
      };
    case FETCH_DOCUMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_DOCUMENT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        data: null,
        error: null,
      };
    case GET_DOCUMENT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case GET_DOCUMENT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
      };
    case POST_WAREHOUSE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case POST_WAREHOUSE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        createUser: action.payload,
        error: null,
      };
    case POST_WAREHOUSE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case UPDATE_WAREHOUSE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_WAREHOUSE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        updatedData: action.payload,
      };
    case UPDATE_WAREHOUSE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_AUCTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionCenter: action.payload,
        error: null,
      };
    case FETCH_AUCTION_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
      };
    case FETCH_STATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_STATE_SUCCESS:
      return {
        ...state,
        stateList: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_STATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SEARCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        userSearch: action.payload,
        loading: false,
        error: null,
      };
    case SEARCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userById: action.payload.user,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default warehouseUserRegistration;
