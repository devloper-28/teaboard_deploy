import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React, { useState, useEffect } from "react";

import { Card, Form, Modal } from "react-bootstrap";

import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";

import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import $ from "jquery";

import moment from "moment";

import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import {
  getAllChargeAction,
  createChargeAction,
  getChargeByIdAction,
  updateChargeAction,
  searchChargeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  uploadAllDocumentsChargeAction,
  getChargeByIdActionSuccess,
  getAllAuctionCenterAction,
  createEditChargeMasterApiStatus,
  getChargeCodeWithoutFilter,
} from "../../store/actions";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import { toast } from "react-toastify";

// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function CreateChargeMaster({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [chargesName, setChargesName] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [chargesValueIn, setChargesValueIn] = useState("");
  const [chargesValue, setChargesValue] = useState("");
  const [effectiveFromDate, setEffectiveFromDate] = useState("");
  const [effectiveEndDate, setEffectiveEndDate] = useState("");
  const [chargeCodeId, setChargeCodeId] = useState("");
  const [chargeType, setChargeType] = useState("");
  const [auctionCenter, setAuctionCenter] = useState("");
  const [auctionCenterId, setAuctionCenterId] = useState("");
  const [stateInitial, setStateInitial] = useState("");
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [editingChargeData, setEditingChargeData] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [getSearchCharge, setGetSearchCharge] = useState([]);
  const [getAllCharge, setGetAllCharge] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [searchStateInitial, setSearchStateInitial] = useState("");
  const [isActive, setIsActive] = useState("");
  const [searchChargeName, setSearchChargeName] = useState("");
  const [searchChargeCode, setSearchChargeCode] = useState("");
  const [chargesNameError, setChargesNameError] = useState("");
  const [chargeTypeError, setChargeTypeError] = useState("");
  const [chargesValueInError, setChargesValueInError] = useState("");
  const [auctionCenterIdError, setAuctionCenterIdError] = useState("");
  const [chargeCodeError, setChargeCodeError] = useState("");
  const [chargeCodeIdError, setChargeCodeIdError] = useState("");
  const [chargesValueError, setChargesValueError] = useState("");
  const [effectiveFromDateError, setEffectiveFromDateError] = useState("");
  const [effectiveEndDateError, setEffectiveEndDateError] = useState("");
  const [auctionCenterError, setAuctionCenterError] = useState("");
  const [stateInitialError, setStateInitialError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);

  //getend
  const [dataById, setDataById] = useState("");

  const [handleSwitchClick, setHandleSwitchClick] = useState(false);

  const handleChargeCodeChange = (e) => {
    setChargesName(e.target.options[e.target.selectedIndex].id);
    setChargeCodeId(e.target.value);
  };

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter.getAllAuctionCenter.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  //UploadDocument

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.CreateChargeMaster &&
      state.CreateChargeMaster.uploadedDocuments &&
      state.CreateChargeMaster.uploadedDocuments.responseData
  );

  const handleSearch = () => {
    let searchData = {
      auctionCenterId: searchAuctionCenterName,
      chargeName: searchChargeName,
      chargeCode: searchChargeCode,
      chargeCodeId: searchChargeCode,
      isActive,
    };

    dispatch(searchChargeAction(searchData));
  };

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    $("#chargeMasterUpload").replaceWith(
      $("#chargeMasterUpload").val("").clone(true)
    );
    // removeFile();
    // setUploadedFiles([]);
  };

  const clearSearch = () => {
    setSearchChargeName("");
    setSearchChargeCode("");
    setSearchAuctionCenterName("");
    setIsActive("");
    dispatch(searchChargeAction({}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset previous validation errors
    setChargesNameError("");
    setChargeCodeError("");
    setChargesValueInError("");
    setChargeTypeError("");
    setChargesValueError("");
    setChargeCodeIdError("");
    setEffectiveFromDateError("");
    setAuctionCenterIdError("");
    setEffectiveEndDateError("");
    setAuctionCenterError("");
    setStateInitialError("");
    setUploadDocumentError("");
    setRemarksError("");

    // Perform form validation
    let isValid = true;

    if (!chargesName.trim()) {
      toast.error(" Please enter Charge Name is required.");
      isValid = false;
      return;
    }

    if (!chargeCodeId) {
      toast.error("Please select a charge code from the dropdown menu.");
      isValid = false;
      return;
    }
    if (!chargesValueIn) {
      toast.error(" Please enter Charges Value In  is required.");
      isValid = false;
      return;
    }
    if (!effectiveFromDate) {
      toast.error("Please enter the effective From date.");
      isValid = false;
      return;
    }
    if (!effectiveEndDate) {
      toast.error("Please enter the effective End date.");
      isValid = false;
      return;
    }
    if (!chargesValue) {
      toast.error("Please enter the charge value.");
      isValid = false;
      return;
    }
    if (!auctionCenterId) {
      toast.error(
        "Please select an auction center name from the dropdown menu."
      );
      isValid = false;
      return;
    }

    // if (!stateInitial.trim()) {
    //   setStateInitialError("State Initial is required.");
    //   isValid = false;
    // }

    if (!editingChargeData) {
      // In create mode, check if the user provided either upload document or remarks
      if (!uploadedDocuments.length && !uploadDocumentRemarks) {
        setUploadDocumentError("");
        setRemarksError("");
      } else if (uploadedDocuments.length === 1 && !uploadDocumentRemarks) {
        toast.error("Remarks is required.");
        isValid = false;
        return;
      } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
        toast.error("Upload Document is required.");
        isValid = false;
        return;
      }
    } else {
      // In edit mode, reset the errors for upload document and remarks
      setUploadDocumentError("");
      setRemarksError("");
    }

    if (!isValid) {
      return;
    }
    const newChargeData = {
      chargesName: chargesName,
      chargeCodeId: parseInt(chargeCodeId),
      chargeType: chargesValueIn,
      // chargeType: chargeType,
      chargesValue: chargesValue,
      effectiveFromDate: effectiveFromDate,
      effectiveEndDate: effectiveEndDate,
      auctionCenterId: auctionCenterId,
      //auctionCenter:auctionCenter,
      stateInitial: stateInitial,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      isActive: 1,
    };

    console.log("newChargeData", newChargeData);
    try {
      if (editingChargeData) {
        const isFormModified =
          chargesName !== editingChargeData.chargesName ||
          chargeCodeId !== editingChargeData.chargeCodeId ||
          parseInt(searchChargeCode) !==
            parseInt(editingChargeData.chargeCode) ||
          chargeType !== editingChargeData.chargeType ||
          chargesValueIn !== editingChargeData.chargeType ||
          chargesValue !== editingChargeData.chargesValue ||
          effectiveFromDate !== editingChargeData.effectiveFromDate ||
          effectiveEndDate !== editingChargeData.effectiveEndDate ||
          //auctionCenter !==editingChargeData.auctionCenter ||
          auctionCenterId !== editingChargeData.auctionCenterId ||
          stateInitial !== editingChargeData.stateInitial ||
          uploadDocumentRemarks !== editingChargeData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingChargeData.downloadDto.length;

        if (isFormModified) {
          editingChargeData.searchData = {};
          editingChargeData.chargesValue = parseInt(
            editingChargeData.chargesValue
          );
          dispatch(updateChargeAction(editingChargeData));
        } else {
          setExpanded("panel2");
        }
      } else {
        dispatch(createChargeAction(newChargeData));
      }
    } catch (error) {
      setSubmitSuccess(false);
    }
  };

  const handleEditClick = (chargeId) => {
    setViewMode(false);
    dispatch(getChargeByIdAction(chargeId));
    setExpanded("panel1");
  };

  const editingChargeDataFromState = useSelector(
    (state) => state.CreateChargeMaster.ChargeData.responseData
  );

  useEffect(() => {
    if (editingChargeDataFromState) {
      setEditingChargeData(editingChargeDataFromState);
      setChargesName(editingChargeDataFromState.chargesName || "");
      setSearchChargeCode(editingChargeDataFromState.chargeCodeId || "");
      setSearchChargeCode(editingChargeDataFromState.searchChargeCode || "");
      setChargesValueIn(editingChargeDataFromState.chargeType || "");
      setChargeCodeId(editingChargeDataFromState.chargeCodeId || "");
      setEffectiveFromDate(editingChargeDataFromState.effectiveFromDate || "");
      setEffectiveEndDate(editingChargeDataFromState.effectiveEndDate || "");
      setChargesValue(editingChargeDataFromState.chargesValue || "");
      setChargeType(editingChargeDataFromState.chargeType || "");
      setAuctionCenter(editingChargeDataFromState.auctionCenter || "");
      setAuctionCenterId(editingChargeDataFromState.auctionCenterId || "");
      setStateInitial(editingChargeDataFromState.stateInitial || "");
      setEffectiveFromDate(
        moment(editingChargeDataFromState.effectiveFromDate).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      setEffectiveEndDate(
        moment(editingChargeDataFromState.effectiveEndDate).format(
          "YYYY-MM-DDTHH:mm"
        )
      );

      setUploadDocumentRemarks(
        editingChargeDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingChargeDataFromState.downloadDto || []);
    } else {
      setEditingChargeData(null);
      dispatch(getChargeCodeWithoutFilter());
      dispatch(getAllAuctionCenterAction());
      resetForm();
    }
  }, [editingChargeDataFromState]);

  const getChargeCodeWithoutFilterResponse = useSelector(
    (state) => state.chargeCode.getChargeCodeWithoutFilter.responseData
  );

  const isActiveGetChargeCodeWithoutFilterData =
    getChargeCodeWithoutFilterResponse &&
    getChargeCodeWithoutFilterResponse?.filter((data) => 1 == data.isActive);

  const handleViewClick = (chargeId) => {
    dispatch(getChargeByIdAction(chargeId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  const handleCloseHistory = () => setShowmodal(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      // dispatch(searchChargeAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsChargeAction());
      setViewMode(false);
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
      resetForm();
    }
  };

  function formatFromDateTime(dateTimeString) {
    setEffectiveFromDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
  }
  function formatEndDateTime(dateTimeString) {
    setEffectiveEndDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
  }

  const [rows, setRows] = useState([]);

  const searchChargeData = useSelector(
    (state) => state.CreateChargeMaster.searchResults.responseData
  );

  useEffect(() => {
    if (searchChargeData != null && searchChargeData != undefined) {
      setGetSearchCharge(searchChargeData);
      setRows(searchChargeData);
    } else {
      setGetSearchCharge(searchChargeData);
      setRows(searchChargeData);
    }
  }, [searchChargeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "chargesName",
      title: "Charges Name",
    },
    {
      name: "chargeCode",
      title: "Charge Code",
    },
    // {
    //   name: "chargeType",
    //   title: "Charges in",
    // },
    // {
    //   name: "chargesValue",
    //   title: "Charges value",
    // },
    // {
    //   name: "effectiveFromDate",
    //   title: "Effective From Date",
    // },
    // {
    //   name: "effectiveEndDate",
    //   title: "Effective To Date",
    // },
    {
      name: "isActive",
      title: "Status",
      getCellValue: (rows) => <StatusData data={rows} />,
    },
    {
      name: "action",
      title: "Action",
      getCellValue: (rows) => <ActionData data={rows} />,
    },
  ];

  const switchChargedata = useSelector(
    (state) => state.CreateChargeMaster.ChargeData.responseData
  );

  useEffect(() => {
    if (switchChargedata && handleSwitchClick) {
      setHandleSwitchClick(false);
      let searchData = {
        auctionCenterId: searchAuctionCenterName,
        chargeName: searchChargeName,
        chargeCode: searchChargeCode,
        chargeCodeId: searchChargeCode,
        isActive,
      };
      const updatedData = {
        ...switchChargedata,
        isActive: switchChargedata.isActive === 1 ? 0 : 1,
        chargesValue: parseInt(switchChargedata.chargesValue),
        searchData: searchData,
      };
      dispatch(updateChargeAction(updatedData));
      dispatch(getChargeByIdActionSuccess([]));
    }
  });

  function StatusData(data) {
    const handleSwitchChange = () => {
      setHandleSwitchClick(true);
      dispatch(getChargeByIdAction(data.data.chargeMasterId));
    };

    return (
      <div class="Switch">
        <div class="custom-control custom-switch">
          <input
            type="checkbox"
            class="custom-control-input"
            id={`customSwitch${data.data.chargeMasterId}`}
            checked={data.data.isActive === 1 ? true : false}
            onChange={handleSwitchChange}
          />
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.chargeMasterId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        </div>
      </div>
    );
  }

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_ChargeMaster";
    const moduleName = "ChargeMaster";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };

  const renderFileTypeIcon = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return <AiOutlineFilePdf />;
    } else if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png"
    ) {
      return <AiOutlineFileImage />;
    } else if (extension === "txt") {
      return <AiOutlineFileText />;
    } else {
      return <AiOutlineFile />;
    }
  };

  const setValueData = (data, editingChargeData) => {
    setEditingChargeData({
      ...editingChargeData,
      chargeCodeId: data.target.value,
      chargesName: data.target.options[data.target.selectedIndex].id,
    });
  };

  function ActionData(data) {
    return (
      <div class="ActionBtn">
        <i
          className="fa fa-edit"
          onClick={() => handleEditClick(data.data.chargeMasterId)}
        ></i>

        <i
          className="fa fa-eye"
          onClick={() => handleViewClick(data.data.chargeMasterId)}
        ></i>

        <i
          className="fa fa-history"
          onClick={() => handleHistoryViewClick(data.data.chargeMasterId)}
        ></i>
      </div>
    );
  }

  const handleDownloadClick = (uploadDocumentConfId) => {
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );

  const handleDownloadPDF = () => {
    if (getUploadedIdData && getUploadedIdData.documentContent) {
      uploadedFileDownload(
        getUploadedIdData.documentContent,
        "downloaded_document.pdf"
      );
    }
  };

  function UploadActionData(data) {
    return (
      <div class="ActionBtn">
        <i
          class="fa fa-download"
          onClick={() => {
            handleDownloadClick(data.data.uploadDocumentConfId);
            handleDownloadPDF();
          }}
        ></i>
      </div>
    );
  }

  const resetForm = () => {
    setChargesName("");
    setSearchChargeCode("");
    setChargesValue("");
    setChargesValueIn("");
    setChargeType("");
    setEffectiveFromDate("");
    setSearchAuctionCenterName("");
    setEffectiveEndDate("");
    setAuctionCenter("");
    setAuctionCenterId("");
    setChargeCodeId("");
    setChargeCodeIdError("");
    setUploadDocumentRemarks("");
    setEditingChargeData(null);
    setChargesNameError("");
    setChargeCodeError("");
    setChargesValueError("");
    setEffectiveFromDateError("");
    setChargesValueInError("");
    setEffectiveEndDateError("");
    setAuctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setStateInitialError("");
    setEditingChargeData(null);
    setUploadedFiles([]); // Clear uploaded files
  };

  let createData = useSelector(
    (state) => state.CreateChargeMaster.createEditChargeMasterApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditChargeMasterApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
    }
  });

  return (
    <>
      <Accordion
        expanded={expanded === "panel1"}
        className={`${expanded === "panel1" ? "active" : ""}`}
        onChange={handleChange("panel1")}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            {/* {editingChargeData ? "Edit Charge" : "Create Charge"} */}
            {viewMode
              ? "View Charge Master"
              : editingChargeData
              ? "Edit Charge Master"
              : "Create Charge Master"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Code</label>
                      <select
                        className="form-control select-form"
                        value={editingChargeData?.chargeCodeId || chargeCodeId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingChargeData
                            ? setEditingChargeData(e, editingChargeData)
                            : handleChargeCodeChange(e))
                        }
                      >
                        <option value={0}>Select Charge Code</option>
                        {isActiveGetChargeCodeWithoutFilterData?.map(
                          (state) => (
                            <option
                              key={state.chargeCodeId}
                              value={state.chargeCodeId}
                              id={state.chargeCodeName}
                            >
                              {state.chargeCode}
                            </option>
                          )
                        )}
                        disabled={viewMode}
                      </select>
                      {chargeCodeIdError && (
                        <p className="errorLabel">{chargeCodeIdError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingChargeData?.chargesName || chargesName}
                        // onChange={(e) =>
                        //   !viewMode &&
                        //   (editingTaxData
                        //     ? setEditingTaxData({
                        //         ...editingTaxData,
                        //         chargeName: e.target.value,
                        //       })
                        //     : setchargeName(e.target.value))
                        // }
                        disabled={true}
                      />
                      {chargesNameError && (
                        <p className="errorLabel">{chargesNameError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charges Value In</label>
                      <select
                        className="form-control select-form"
                        value={
                          editingChargeData?.chargesValueIn || chargesValueIn
                        }
                        onChange={(e) => setChargesValueIn(e.target.value)}
                      >
                        <option value="">Select Charges Value In</option>
                        <option value="%">%</option>
                        <option value="Rs.">Rs.</option>
                      </select>
                      {chargesValueInError && (
                        <p className="errorLabel">{chargesValueInError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charges Value</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={editingChargeData?.chargesValue || chargesValue}
                        onChange={(e) =>
                          !viewMode &&
                          (editingChargeData
                            ? setEditingChargeData({
                                ...editingChargeData,
                                chargesValue: e.target.value,
                              })
                            : setChargesValue(e.target.value))
                        }
                        disabled={viewMode} // Disable the field in view mode
                      />
                      {chargesValueError && (
                        <p className="errorLabel">{chargesValueError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Effective From Date</label>
                      <input
                        type="datetime-local"
                        name="effectiveFromDate"
                        class="form-control"
                        onChange={
                          (e) => formatFromDateTime(e.target.value)
                          // {
                          // const selectedDateTime = e.target.value;
                          // const formattedDateTime =
                          //   formatFromDateTime(selectedDateTime);
                          // !viewMode &&
                          //   (editingChargeData
                          //     ? setEditingChargeData({
                          //         ...editingChargeData,
                          //         effectiveFromDate: formattedDateTime,
                          //         formatFromDateTime,
                          //       })
                          //     : setEffectiveFromDate(formattedDateTime));
                          // }
                        }
                        value={effectiveFromDate}
                        disabled={viewMode}
                      />

                      {effectiveFromDateError && (
                        <p className="errorLabel">{effectiveFromDateError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Effective End Date</label>
                      <input
                        type="datetime-local"
                        name="effectiveEndDate"
                        class="form-control"
                        onChange={
                          (e) => formatEndDateTime(e.target.value)
                          //{
                          // const selectedDateTime = e.target.value;
                          // const formattedDateTime =
                          //   formatEndDateTime(selectedDateTime);
                          // !viewMode &&
                          //   (editingChargeData
                          //     ? setEditingChargeData({
                          //         ...editingChargeData,
                          //         effectiveEndDate: formattedDateTime,
                          //       })
                          //     : setEffectiveEndDate(formattedDateTime));
                          //}
                        }
                        value={effectiveEndDate}
                        disabled={viewMode}
                      />
                      {effectiveEndDateError && (
                        <p className="errorLabel">{effectiveEndDateError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center</label>
                      <select
                        className="form-control select-form"
                        value={auctionCenterId}
                        onChange={(e) => setAuctionCenterId(e.target.value)}
                        disabled={viewMode}
                      >
                        <option value={0}>Select Auction Center</option>
                        {getAllAuctionCenter?.map((state) => (
                          <option
                            key={state.auctionCenter}
                            value={state.auctionCenterId}
                          >
                            {state.auctionCenterName}
                          </option>
                        ))}
                      </select>
                      {auctionCenterIdError && (
                        <p className="errorLabel">{auctionCenterIdError}</p>
                      )}
                    </div>
                  </div>

                  {!viewMode ? (
                    <>
                      <div className="col-md-12">
                        <UploadMultipleDocuments
                          onFileSelect={handleFileUpload}
                          uploadedFiles={uploadedDocuments}
                          setUploadedFiles={setUploadedDocuments}
                          uploadDocumentError={uploadDocumentError}
                          inputId="chargeMasterUpload"
                          // ref="#chargeMasterUpload"
                        />
                      </div>
                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingChargeData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingChargeData
                              ? setEditingChargeData({
                                  ...editingChargeData,
                                  uploadDocumentRemarks: e.target.value,
                                })
                              : setUploadDocumentRemarks(e.target.value)
                          }
                        ></textarea>
                        {remarksError && (
                          <p className="errorLabel">{remarksError}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  {!viewMode ? (
                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button className="SubmitBtn" onClick={handleSubmit}>
                          {editingChargeData ? "Update" : "Submit"}
                        </button>
                        <button
                          className="Clear"
                          onClick={handleClear}
                          disabled={viewMode}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel2"}
        className={`${expanded === "panel2" ? "active" : ""}`}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Manage Charge Master</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchChargeName}
                        onChange={(e) => setSearchChargeName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Code</label>
                      <select
                        className="form-control select-form"
                        value={searchChargeCode}
                        onChange={(e) => setSearchChargeCode(e.target.value)}
                      >
                        <option value={0}>Select Charge Code</option>
                        {isActiveGetChargeCodeWithoutFilterData?.map(
                          (state) => (
                            <option
                              key={state.chargeCodeId}
                              value={state.chargeCodeId}
                            >
                              {state.chargeCode}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Status</label>
                      <select
                        className="form-control select-form"
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="BtnGroup">
                      <button className="SubmitBtn" onClick={handleSearch}>
                        Search
                      </button>
                      <button className="Clear" onClick={clearSearch}>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 mt-4">
                <div className="TableBox CreateChargeMaster">
                  <TableComponent
                    columns={columns}
                    // setColumns={setColumns}
                    //rows={rows?.length > 0 ? rows : []}
                    rows={
                      rows?.length > 0
                        ? rows?.map((row, index) => ({
                            ...row,
                            index: index + 1,
                          }))
                        : []
                    }
                    setRows={setRows}
                    sorting={true}
                    dragdrop={false}
                    fixedColumnsOn={false}
                    resizeingCol={false}
                  />
                </div>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel3"}
        className={`${expanded === "panel3" ? "active" : ""}`}
        onChange={handleChange("panel3")}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Uploaded Document</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <TableComponent
              //columns={columns}
              columns={[
                {
                  name: "index",
                  title: "Sr.",
                },
                {
                  name: "fieldValue",
                  title: "Charge Name",
                },
                {
                  name: "documentUploadTime",
                  title: "Document Upload Time",
                },
                {
                  name: "uploadDocumentRemarks",
                  title: "Document Document Remarks",
                },
                {
                  name: "action",
                  title: "Action",
                  getCellValue: (rows) => <UploadActionData data={rows} />,
                },
              ]}
              // setColumns={setColumns}
              //rows={rows}
              rows={
                getAllUploadedDoc == undefined || getAllUploadedDoc == null
                  ? []
                  : getAllUploadedDoc?.map((row, index) => ({
                      ...row,
                      index: index + 1,
                      documentUploadTime: new Date(
                        row.documentUploadTime
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      }),
                    }))
              }
              setRows={setRows}
              sorting={true}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
            />
          </Typography>
        </AccordionDetails>
      </Accordion>

      {showmodal && (
        <Modal show={showmodal} onHide={handleCloseHistory} size="lg" centered>
          <Modal.Header>
            <Modal.Title>History</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleCloseHistory}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <TableComponent
              //columns={columns}
              // setColumns={setColumns}
              columns={[
                {
                  name: "index",
                  title: "Sr.",
                },
                {
                  name: "fieldValue",
                  title: "Charge Code",
                },
                {
                  name: "fieldLabel",
                  title: "Field Name",
                },
                {
                  name: "oldValue",
                  title: "Old Value",
                },
                {
                  name: "newValue",
                  title: "New Value",
                },
                {
                  name: "updatedOn",
                  title: "Updated on Date And Time",
                },
                {
                  name: "updatedBy",
                  title: "Updated By",
                },
              ]}
              //rows={rows}
              rows={
                getHistoryIdData?.length > 0
                  ? getHistoryIdData.map((row, index) => ({
                      ...row,
                      index: index + 1,
                      updatedOn: new Date(row.updatedOn).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        }
                      ),
                    }))
                  : []
              }
              setRows={setRows}
              sorting={true}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
            />
          </Modal.Body>
        </Modal>
      )}
      {/* {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )} */}
    </>
  );
}
export default CreateChargeMaster;
