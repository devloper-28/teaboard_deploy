import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getAllAuctionCenterAction,
  createAuctionCenterAction,
  getAuctionCenterByIdAction,
  updateAuctionCenterAction,
  searchAuctionCenterAction,
  getAllStateAction,
  getDocumentByIdAction,
  uploadAllDocumentsAuctionCenterAction,
  getHistoryByIdAction,
  uploadAllDocumentsAction,
  createEditAuctionCenterApiStatus,
  getAuctionCenterByIdActionSuccess,
} from "../../store/actions";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateAuctionCenter({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [auctionCenterName, setAuctionCenterName] = useState("");
  const [auctionCenterCode, setAuctionCenterCode] = useState("");
  const [certificateNo, setCertificateNo] = useState("");
  const [editingAuctionCenterData, setEditingAuctionCenterData] =
    useState(null);
  const [getSearchAuctionCenter, setGetSearchAuctionCenter] = useState([]);
  const [getAllAuctionCenter, setGetAllAuctionCenter] = useState([]);
  const [stateId, setStateId] = useState("");
  // New state variables for search parameters
  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");
  const [searchAuctionCenterCode, setSearchAuctionCenterCode] = useState("");
  const [searchCertificateNo, setSearchCertificateNo] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [auctionCenterNameError, setAuctionCenterNameError] = useState("");
  const [auctionCenterCodeError, setAuctionCenterCodeError] = useState("");
  const [certificateNoError, setCertificateNoError] = useState("");
  const [stateIdError, setStateIdError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchStateId, setSearchStateId] = useState("");
  const [viewMode, setViewMode] = useState(false);

  const handleCloseHistory = () => setShowmodal(false);

  const getAllAuctionCenterList = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenter?.responseData
  );

  // Filter only the data where isActive is 1
  const isActiveData =
    getAllAuctionCenterList &&
    getAllAuctionCenterList?.filter((data) => 1 == data.isActive);

  const editingAuctionCenterDataFromState = useSelector(
    (state) => state?.auctionCenter?.auctionCenterById?.responseData
  );

  console.log(
    "editingAuctionCenterDataFromState",
    editingAuctionCenterDataFromState
  );
  // Function to perform the search API call

  const handleSearch = () => {
    let searchData = {
      auctionCenterName: searchAuctionCenterName,
      auctionCenterCode: searchAuctionCenterCode,

      auctionCenterId:
        searchCertificateNo != ""
          ? parseInt(searchCertificateNo)
          : searchCertificateNo,
      stateId: searchStateId != "" ? parseInt(searchStateId) : searchStateId,
      isActive,
    };
    dispatch(searchAuctionCenterAction(searchData));
  };
  const clearSearch = () => {
    // Clear search parameters and fetch all auction centers
    setSearchAuctionCenterName("");
    setSearchAuctionCenterCode("");
    setSearchCertificateNo("");
    setIsActive("");
    dispatch(getAllAuctionCenterAction());
    dispatch(searchAuctionCenterAction({}));
    setGetSearchAuctionCenter([]);
    setSearchStateId("");
  };

  const searchAuctionCenterData = useSelector(
    (state) => state?.auctionCenter?.searchResults?.responseData
  );

  useEffect(() => {
    dispatch(getAllStateAction());
  }, []);

  const allSateActiveState = useSelector(
    (state) => state.state.getAllState.responseData
  );

  const isActiveStateData =
    allSateActiveState &&
    allSateActiveState.filter((data) => 1 == data.isActive);

  const validateForm = () => {
    let isValid = true;

    // Validate Auction Center Name
    if (!auctionCenterName) {
      isValid = false;
      toast.error("Auction Center Name is required.");
      return;
    } else {
      setAuctionCenterNameError("");
    }

    // Validate Auction Center Code
    if (!auctionCenterCode) {
      toast.error("Auction Center Code is required.");
      isValid = false;
      return;
    } else {
      setAuctionCenterCodeError("");
    }

    // Validate Certificate Number
    if (!certificateNo) {
      toast.error("Certificate Number is required.");
      isValid = false;
      return;
    } else {
      setCertificateNoError("");
    }

    // Validate State ID
    if (!stateId) {
      toast.error("State is required.");
      isValid = false;
      return;
    } else {
      setStateIdError("");
    }

    if (!editingAuctionCenterData) {
      // In create mode, check if the user provided either upload document or remarks
      if (!uploadedDocuments.length && !uploadDocumentRemarks) {
        setUploadDocumentError("");
        setRemarksError("");
      } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
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
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newAuctionCenterData = {
        auctionCenterName: auctionCenterName,
        auctionCenterCode: auctionCenterCode,
        certificateNo: certificateNo,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
        stateId: stateId,
      };
      try {
        if (editingAuctionCenterData) {
          const isFormModified =
            auctionCenterName !== editingAuctionCenterData?.auctionCenterName ||
            auctionCenterCode !== editingAuctionCenterData?.auctionCenterCode ||
            certificateNo !== editingAuctionCenterData?.certificateNo ||
            stateId !== editingAuctionCenterData?.stateId ||
            uploadDocumentRemarks !==
              editingAuctionCenterData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingAuctionCenterData?.downloadDto || []).length;
          if (isFormModified) {
            editingAuctionCenterData.searchData = {};
            dispatch(updateAuctionCenterAction(editingAuctionCenterData));
          } else {
            // setExpanded("panel2");
          }
        } else {
          dispatch(createAuctionCenterAction(newAuctionCenterData));
        }
      } catch (error) {}
    }
  };

  const handleEditClick = (auctionCenterId) => {
    // Call the action creator to get the auction center data by ID
    dispatch(getAuctionCenterByIdAction(auctionCenterId));
    setExpanded("panel1"); // Show the first accordion panel
    setViewMode(false);
  };

  useEffect(() => {
    if (editingAuctionCenterDataFromState) {
      setEditingAuctionCenterData(editingAuctionCenterDataFromState);
      setAuctionCenterName(
        editingAuctionCenterDataFromState?.auctionCenterName || ""
      );
      setAuctionCenterCode(
        editingAuctionCenterDataFromState?.auctionCenterCode || ""
      );
      setCertificateNo(editingAuctionCenterDataFromState.certificateNo || "");
      setStateId(editingAuctionCenterDataFromState.stateId || "");
      setUploadDocumentRemarks(
        editingAuctionCenterDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingAuctionCenterDataFromState.downloadDto || []);
    } else {
      // resetForm();
    }
  }, [editingAuctionCenterDataFromState]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //To get all data for dropdown
      dispatch(getAllAuctionCenterAction({}));
      //Serch API call
      // dispatch(searchAuctionCenterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsAuctionCenterAction());
      setViewMode(false);
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.auctionCenter.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(
    getAllAuctionCenter || getSearchAuctionCenter
  );

  useEffect(() => {
    // Update the searchAuctionCenterData state with the latest search results
    if (searchAuctionCenterData != null) {
      setGetSearchAuctionCenter(searchAuctionCenterData);
      setRows(searchAuctionCenterData);
    } else {
      setGetSearchAuctionCenter([]);
      setRows([]);
    }
  }, [searchAuctionCenterData]);

  useEffect(() => {
    // Update the getAllAuctionCenter state with the initial data
    if (getAllAuctionCenterList) {
      setGetAllAuctionCenter(getAllAuctionCenterList);
    }
  }, [getAllAuctionCenterList]);

  let createData = useSelector(
    (state) => state.auctionCenter.createEditAuctionCenterApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditAuctionCenterApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
    }
  });

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center Name",
    },
    {
      name: "auctionCenterCode",
      title: "Auction Center Code",
    },
    {
      name: "certificateNo",
      title: "Registration Certificate Number",
    },
    {
      name: "stateName",
      title: "State",
    },
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
  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        auctionCenterName: searchAuctionCenterName,
        auctionCenterCode: searchAuctionCenterCode,

        auctionCenterId:
          searchCertificateNo != ""
            ? parseInt(searchCertificateNo)
            : searchCertificateNo,
        stateId: searchStateId != "" ? parseInt(searchStateId) : searchStateId,
        isActive,
      };

      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateAuctionCenterAction(updatedData));
    };
    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.auctionCenterId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.auctionCenterId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
        </div>
      </>
    );
  }

  const handleViewClick = (auctionCenterId) => {
    dispatch(getAuctionCenterByIdAction(auctionCenterId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };
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

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_AuctionCenter";
    const moduleName = "AuctionCenter";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  function ActionData(data) {
    return (
      <>
        <div class="ActionBtn">
          <i
            className="fa fa-edit"
            onClick={() => handleEditClick(data.data.auctionCenterId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.auctionCenterId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.auctionCenterId);
            }}
          ></i>
        </div>
      </>
    );
  }

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
    // setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
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

  const resetForm = () => {
    setAuctionCenterName("");
    setAuctionCenterCode("");
    setCertificateNo("");
    setStateId("");
    $("#auctionCenterUpload").replaceWith(
      $("#auctionCenterUpload").val("").clone(true)
    );
    setUploadedDocuments([]);
    setEditingAuctionCenterData(null);
    setAuctionCenterCodeError("");
    setAuctionCenterNameError("");
    setCertificateNoError("");
    setRemarksError("");
    setUploadDocumentError("");
    setStateIdError("");
  };
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
            {viewMode
              ? "View Auction Center"
              : editingAuctionCenterData
              ? "Edit Auction Center"
              : " Create Auction Center"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingAuctionCenterData?.auctionCenterName ||
                          auctionCenterName
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingAuctionCenterData
                            ? setEditingAuctionCenterData({
                                ...editingAuctionCenterData,
                                auctionCenterName: e.target.value,
                              })
                            : setAuctionCenterName(e.target.value))
                        }
                        maxLength="100"
                        disabled={viewMode}
                      />
                      {auctionCenterNameError && (
                        <p className="errorLabel">{auctionCenterNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center Code</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="10"
                        value={
                          editingAuctionCenterData?.auctionCenterCode ||
                          auctionCenterCode
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingAuctionCenterData
                            ? setEditingAuctionCenterData({
                                ...editingAuctionCenterData,
                                auctionCenterCode: e.target.value,
                              })
                            : setAuctionCenterCode(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {auctionCenterCodeError && (
                        <p className="errorLabel">{auctionCenterCodeError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center Certificate Number</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="20"
                        value={
                          editingAuctionCenterData?.certificateNo ||
                          certificateNo
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingAuctionCenterData
                            ? setEditingAuctionCenterData({
                                ...editingAuctionCenterData,
                                certificateNo: e.target.value,
                              })
                            : setCertificateNo(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {certificateNoError && (
                        <p className="errorLabel">{certificateNoError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State Name</label>
                      <select
                        className="form-control select-form"
                        value={editingAuctionCenterData?.stateId || stateId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingAuctionCenterData
                            ? setEditingAuctionCenterData({
                                ...editingAuctionCenterData,
                                stateId: e.target.value,
                              })
                            : setStateId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value="">Select State</option>
                        {isActiveStateData?.map((state) => (
                          <option key={state.stateId} value={state.stateId}>
                            {state.stateName}
                          </option>
                        ))}
                      </select>
                      {stateIdError && (
                        <p className="errorLabel">{stateIdError}</p>
                      )}
                    </div>
                  </div>

                  {!viewMode ? (
                    <>
                      <div className="col-md-12">
                        <UploadMultipleDocuments
                          onFileSelect={handleFileUpload}
                          uploadedFiles={uploadedFiles}
                          setUploadedFiles={setUploadedFiles}
                          uploadDocumentError={uploadDocumentError}
                          inputId="auctionCenterUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingAuctionCenterData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingAuctionCenterData
                              ? setEditingAuctionCenterData({
                                  ...editingAuctionCenterData,
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
                        <button
                          className="SubmitBtn"
                          onClick={handleSubmit}
                          disabled={viewMode}
                        >
                          {editingAuctionCenterData ? "Update" : "Submit"}
                        </button>
                        <button
                          className="Clear"
                          onClick={resetForm}
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
          <Typography>Manage Auction Center</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchAuctionCenterName}
                        onChange={(e) =>
                          setSearchAuctionCenterName(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center Code</label>
                      <select
                        className="form-control select-form"
                        value={searchAuctionCenterCode}
                        onChange={(e) =>
                          setSearchAuctionCenterCode(e.target.value)
                        }
                      >
                        <option value={0}>Select Auction Center Code</option>
                        {isActiveData?.map((state) => (
                          <option
                            key={state?.auctionCenterId}
                            value={state?.auctionCenterId}
                          >
                            {state.auctionCenterCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center Certificate Number</label>
                      {/* <input
                        type="text"
                        className="form-control"
                        value={searchCertificateNo}
                        onChange={(e) => setSearchCertificateNo(e.target.value)}
                      /> */}
                      <select
                        className="form-control select-form"
                        value={searchCertificateNo}
                        onChange={(e) => setSearchCertificateNo(e.target.value)}
                      >
                        <option value={0}>
                          Select Auction Center Certificate Number
                        </option>
                        {isActiveData?.map((state) => (
                          <option
                            key={state?.auctionCenterId}
                            value={state?.auctionCenterId}
                          >
                            {state.certificateNo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State Name</label>
                      <select
                        className="form-control select-form"
                        value={searchStateId}
                        onChange={(e) => setSearchStateId(e.target.value)}
                      >
                        <option value="">Select State</option>
                        {isActiveStateData?.map((state) => (
                          <option key={state.stateId} value={state.stateId}>
                            {state.stateName}
                          </option>
                        ))}
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
                <div className="TableBox CreateStateMaster">
                  <TableComponent
                    columns={columns}
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
              columns={[
                {
                  name: "index",
                  title: "Sr.",
                },
                {
                  name: "fieldValue",
                  title: "Auction Center Name",
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
              // columns={columns}
              // setColumns={setColumns}
              // rows={rows}
              // setRows={setRows}
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
              columns={[
                {
                  name: "index",
                  title: "Sr.",
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
              sorting={true}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default CreateAuctionCenter;
