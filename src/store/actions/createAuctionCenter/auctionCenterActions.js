import * as actionLabels from "../../actionLabels";

export const getAllAuctionCenterAction = () => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER,
  };
};

export const getAllAuctionCenterActionSuccess = (getAllAuctionCenter) => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER_SUCCESS,
    payload: getAllAuctionCenter,
  };
};

export const getAllAuctionCenterActionFail = (error) => ({
  type: actionLabels.GET_ALL_AUCTION_CENTER_FAIL,
  payload: error,
});

// Action creator for updating an auction center
export const updateAuctionCenterAction = (updatedData) => {
  return {
    type: actionLabels.UPDATE_AUCTION_CENTER,
    payload: updatedData,
  };
};

export const updateAuctionCenterActionSuccess = (updatedAuctionCenter) => {
  return {
    type: actionLabels.UPDATE_AUCTION_CENTER_SUCCESS,
    payload: updatedAuctionCenter,
  };
};

export const updateAuctionCenterActionFail = (error) => {
  return {
    type: actionLabels.UPDATE_AUCTION_CENTER_FAIL,
    payload: error,
  };
};

// Action creator for creating a new auction center
export const createAuctionCenterAction = (newAuctionCenterData) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER,
    payload: newAuctionCenterData,
  };
};

export const createAuctionCenterActionSuccess = (createdAuctionCenter) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER_SUCCESS,
    payload: createdAuctionCenter,
  };
};

export const createAuctionCenterActionFail = (error) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER_FAIL,
    payload: error,
  };
};

// Action creator for searching auction centers
export const searchAuctionCenterAction = (searchTerm) => {
  return {
    type: actionLabels.SEARCH_AUCTION_CENTER,
    payload: searchTerm,
  };
};

export const searchAuctionCenterActionSuccess = (searchResults) => {
  return {
    type: actionLabels.SEARCH_AUCTION_CENTER_SUCCESS,
    payload: searchResults,
  };
};

export const searchAuctionCenterActionFail = (error) => {
  return {
    type: actionLabels.SEARCH_AUCTION_CENTER_FAIL,
    payload: error,
  };
};

// Action creator for getting an auction center by its ID
export const getAuctionCenterByIdAction = (auctionCenterId) => {
  return {
    type: actionLabels.GET_AUCTION_CENTER_BY_ID,
    payload: auctionCenterId,
  };
};

export const getAuctionCenterByIdActionSuccess = (auctionCenter) => {
  return {
    type: actionLabels.GET_AUCTION_CENTER_BY_ID_SUCCESS,
    payload: auctionCenter,
  };
};

export const getAuctionCenterByIdActionFail = (error) => {
  return {
    type: actionLabels.GET_AUCTION_CENTER_BY_ID_FAIL,
    payload: error,
  };
};

// Action creator for uploading all documents
export const uploadAllDocumentsAuctionCenterAction = () => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER,
  };
};

export const uploadAllDocumentsAuctionCenterSuccess = (documents) => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsAuctionCenterFail = (error) => ({
  type: actionLabels.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_FAIL,
  payload: error,
});

export const createEditAuctionCenterApiStatus = (data) => {
  return {
    type: actionLabels.CREATE_EDIT_AUCTION_CENTER_API_STATUS,
    payload: { data: data },
  };
};
