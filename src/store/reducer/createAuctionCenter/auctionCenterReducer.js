import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getAllAuctionCenter: [],
  createdAuctionCenter: null,
  updatedAuctionCenter: null,
  searchResults: [],
  auctionCenterById: [],
  error: null,
  uploadedDocuments: [],
  createEditAuctionCenterApiStatus: false,
};

const getAuctionCenterReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        getAllAuctionCenter: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_AUCTION_CENTER_FAIL:
      return {
        ...state,
        getAllAuctionCenter: [],
        error: action.payload,
      };
    case actionTypes.CREATE_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        createdAuctionCenter: action.payload,
        error: null,
      };

    case actionTypes.CREATE_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.UPDATE_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        updatedAuctionCenter: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.SEARCH_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_AUCTION_CENTER_BY_ID_SUCCESS:
      return {
        ...state,
        auctionCenterById: action.payload,
        error: null,
      };

    case actionTypes.GET_AUCTION_CENTER_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_AUCTION_CENTER_API_STATUS:
      return {
        ...state,
        createEditAuctionCenterApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAuctionCenterReducer;
