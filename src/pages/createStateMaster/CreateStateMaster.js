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
  createStateAction,
  getStateByIdAction,
  getAllStateAction,
  updateStateAction,
  searchStateAction,
  uploadAllDocumentsStateAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditApiStatus,
  getStateByIdActionSuccess,
} from "../../store/actions";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateStateMaster({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState();
  const [stateInitial, setStateInitial] = useState("");
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [editingStateData, setEditingStateData] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [getSearchState, setGetSearchState] = useState([]);
  const [getAllState, setGetAllState] = useState([]);

  const [searchStateName, setSearchStateName] = useState("");
  const [searchStateCode, setSearchStateCode] = useState(0);
  const [searchStateInitial, setSearchStateInitial] = useState("");
  const [isActive, setIsActive] = useState("");

  const [stateNameError, setStateNameError] = useState("");
  const [stateCodeError, setStateCodeError] = useState("");
  const [stateInitialError, setStateInitialError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getAllStateData = useSelector(
    (state) => state.state.getAllState.responseData
  );

  const isActiveData =
    getAllStateData && getAllStateData.filter((data) => 1 == data.isActive);

  const editingStateDataFromState = useSelector(
    (state) => state.state.stateData.responseData
  );

  const handleSearch = () => {
    let searchData = {
      stateName: searchStateName,
      stateId: searchStateCode > 0 ? parseInt(searchStateCode) : "",
      stateInitial: searchStateInitial,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
    };
    dispatch(searchStateAction(searchData));
  };

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const resetForm = () => {
    setStateName("");
    setStateCode("");
    setStateInitial("");
    setUploadDocumentRemarks("");
    setEditingStateData(null);
    setStateNameError("");
    setStateCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    setStateInitialError("");
    setUploadedDocuments([]);
    $("#stateUpload").replaceWith($("#stateUpload").val("").clone(true));
    setUploadedFiles([]); // Clear uploaded files
  };

  const handleClear = () => {
    resetForm();
    removeFile();
  };

  const clearSearch = () => {
    setSearchStateName("");
    setSearchStateCode("");
    setSearchStateInitial("");
    setIsActive("");
    dispatch(getAllStateAction());
    dispatch(searchStateAction({}));
  };

  const searchStateData = useSelector(
    (state) => state.state.searchResults.responseData
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset previous validation errors
    setStateNameError("");
    setStateCodeError("");
    setStateInitialError("");
    setUploadDocumentError("");
    setRemarksError("");

    // Perform form validation
    let isValid = true;

    if (!stateName.trim()) {
      // setStateNameError("State Name is required.");
      isValid = false;
      toast.error("Please enter state name");
      return;
    }

    if (!stateCode) {
      // setStateCodeError("State Code is required.");
      toast.error("Please enter state code");
      isValid = false;
      return;
    }

    if (!stateInitial.trim()) {
      // setStateInitialError("State Initial is required.");
      toast.error("Please enter state initial");
      isValid = false;
      return;
    }

    if (!editingStateData) {
      // In create mode, check if the user provided either upload document or remarks
      if (!uploadedDocuments.length && !uploadDocumentRemarks) {
        setUploadDocumentError("");
        setRemarksError("");
      } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
        // setRemarksError("Remarks is required.");
        isValid = false;
        toast.error("Please enter remarks");
        return;
      } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
        // setUploadDocumentError("Upload Document is required.");
        toast.error("Please upload document");
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

    const newStateData = {
      stateName: stateName,
      stateCode: parseInt(stateCode),
      stateInitial: stateInitial,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      isActive: 1,
    };

    try {
      if (editingStateData) {
        const isFormModified =
          stateName !== editingStateData.stateName ||
          parseInt(stateCode) !== parseInt(editingStateData.stateCode) ||
          stateInitial !== editingStateData.stateInitial ||
          uploadDocumentRemarks !== editingStateData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingStateData.downloadDto.length;

        if (isFormModified) {
          editingStateData.searchData = {};
          dispatch(updateStateAction(editingStateData));
        } else {
          setExpanded("panel2");
        }
      } else {
        dispatch(createStateAction(newStateData));
      }
    } catch (error) {}
  };

  let createData = useSelector((state) => state.state.createEditApiStatus);

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatus(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
    }
  });

  const handleEditClick = (stateId) => {
    dispatch(getStateByIdAction(stateId));
    setViewMode(false);
    setExpanded("panel1");
  };

  useEffect(() => {
    if (editingStateDataFromState) {
      setEditingStateData(editingStateDataFromState);
      setStateName(editingStateDataFromState.stateName || "");
      setStateCode(editingStateDataFromState.stateCode || "");
      setStateInitial(editingStateDataFromState.stateInitial || "");
      setUploadDocumentRemarks(
        editingStateDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingStateDataFromState.downloadDto || []);
    } else {
      // resetForm();
    }
  }, [editingStateDataFromState]);

  const handleViewClick = (stateId) => {
    dispatch(getStateByIdAction(stateId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  const handleCloseHistory = () => setShowmodal(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchStateAction({}));
      //Get All State
      dispatch(getAllStateAction());
      clearSearch();
      setViewMode(false);
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsStateAction());
      setViewMode(false);
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
      handleClear();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.state.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllState || getSearchState);

  useEffect(() => {
    if (searchStateData != null) {
      setGetSearchState(searchStateData);
      setRows(searchStateData);
    } else {
      setGetSearchState([]);
      setRows([]);
    }
  }, [searchStateData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "stateName",
      title: "State",
    },
    {
      name: "stateCode",
      title: "State Code",
    },
    {
      name: "stateInitial",
      title: "State Initial",
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
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: {
          stateName: searchStateName,
          stateId: searchStateCode > 0 ? parseInt(searchStateCode) : "",
          stateInitial: searchStateInitial,
          isActive: isActive != "" ? parseInt(isActive) : isActive,
        },
      };
      dispatch(updateStateAction(updatedData));
    };

    return (
      <div class="Switch">
        <div class="custom-control custom-switch">
          <input
            type="checkbox"
            class="custom-control-input"
            id={`customSwitch${data.data.stateId}`}
            checked={data.data.isActive === 1 ? true : false}
            onChange={handleSwitchChange}
          />
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.stateId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        </div>
      </div>
    );
  }

  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    console.log("newFiles", newFiles);
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

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_state";
    const moduleName = "State";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  function ActionData(data) {
    return (
      <div class="ActionBtn">
        <i
          className="fa fa-edit"
          onClick={() => handleEditClick(data.data.stateId)}
        ></i>

        <i
          className="fa fa-eye"
          onClick={() => handleViewClick(data.data.stateId)}
        ></i>

        <i
          className="fa fa-history"
          onClick={() => handleHistoryViewClick(data.data.stateId)}
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
            {/* {editingStateData ? "Edit State" : "Create State"} */}
            {viewMode
              ? "View State"
              : editingStateData
              ? "Edit State"
              : "Create State"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row align-items-end">
                      <div className="col-md-4">
                        <div className="FormGroup">
                          <label>State Name</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength="50"
                            required
                            value={editingStateData?.stateName || stateName}
                            onChange={(e) =>
                              !viewMode &&
                              (editingStateData
                                ? setEditingStateData({
                                    ...editingStateData,
                                    stateName: e.target.value,
                                  })
                                : setStateName(e.target.value))
                            }
                            disabled={viewMode} // Disable the field in view mode
                          />
                          {stateNameError && (
                            <p className="errorLabel">{stateNameError}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="FormGroup">
                          <label>State Code</label>
                          <input
                            type="number"
                            maxLength="2"
                            className="form-control"
                            required
                            value={editingStateData?.stateCode || stateCode}
                            onChange={(e) =>
                              !viewMode &&
                              (editingStateData
                                ? setEditingStateData({
                                    ...editingStateData,
                                    stateCode: e.target.value,
                                  })
                                : setStateCode(e.target.value))
                            }
                            disabled={viewMode}
                          />
                          {stateCodeError && (
                            <p className="errorLabel">{stateCodeError}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="FormGroup">
                          <label>State Initial</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={
                              editingStateData?.stateInitial || stateInitial
                            }
                            maxLength="2"
                            onChange={(e) =>
                              !viewMode &&
                              (editingStateData
                                ? setEditingStateData({
                                    ...editingStateData,
                                    stateInitial: e.target.value,
                                  })
                                : setStateInitial(e.target.value.toUpperCase()))
                            }
                            disabled={viewMode}
                          />
                          {stateInitialError && (
                            <p className="errorLabel">{stateInitialError}</p>
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
                              inputId="stateUpload"
                            />
                          </div>

                          <div className="col-md-12 mt-2">
                            <textarea
                              className="form-control"
                              placeholder="Enter Remarks"
                              value={
                                editingStateData?.uploadDocumentRemarks ||
                                uploadDocumentRemarks
                              }
                              onChange={(e) =>
                                !viewMode &&
                                (editingStateData
                                  ? setEditingStateData({
                                      ...editingStateData,
                                      uploadDocumentRemarks: e.target.value,
                                    })
                                  : setUploadDocumentRemarks(e.target.value))
                              }
                              disabled={viewMode}
                            ></textarea>
                            {remarksError && (
                              <p
                                className="errorLabel"
                                style={{ color: "red" }}
                              >
                                {remarksError}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                {!viewMode ? (
                  <div className="row">
                    <div className="col-md-3">
                      <div className="BtnGroup">
                        <button
                          className="SubmitBtn"
                          onClick={handleSubmit}
                          disabled={viewMode}
                        >
                          {editingStateData ? "Update" : "Submit"}
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
                  </div>
                ) : (
                  ""
                )}
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
          <Typography>Manage State Master</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchStateName}
                        onChange={(e) => setSearchStateName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State Code</label>
                      <select
                        className="form-control select-form"
                        value={searchStateCode}
                        onChange={(e) => setSearchStateCode(e.target.value)}
                      >
                        <option value={0}>Select State Code</option>
                        {isActiveData?.map((state) => (
                          <option key={state.stateId} value={state.stateId}>
                            {state.stateCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State Initial</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchStateInitial}
                        onChange={(e) => setSearchStateInitial(e.target.value)}
                      />
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
                      <button
                        className="SubmitBtn"
                        onClick={() => handleSearch()}
                      >
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
                  title: "State Name",
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
              // rows={rows}
              // setRows={setRows}
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
                  ? getHistoryIdData?.map((row, index) => ({
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

export default CreateStateMaster;
