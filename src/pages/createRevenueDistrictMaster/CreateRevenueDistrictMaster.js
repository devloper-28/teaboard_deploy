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
import {
  createRevenueAction,
  getRevenueByIdAction,
  updateRevenueAction,
  searchRevenueAction,
  uploadAllDocumentsRevanueAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditRevenueApiStatus,
  getRevenueByIdActionSuccess,
  getAllPlantationAction,
  getAllStateAction,
  searchPlantationAction,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateRevenueDistrictMaster({ open, setOpen }) {
  const dispatch = useDispatch();
  const [revenueDistrictName, setRevenueDistrictName] = useState("");
  const [plantationId, setPlantationId] = useState("");
  const [stateId, setStateId] = useState("");
  const [editingRevenueData, setEditingRevenueData] = useState(null);

  const [getSearchRevenue, setGetSearchRevenue] = useState([]);
  const [getAllRevenue, setGetAllRevenue] = useState([]);

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  // New state variables for search parameters
  const [searchRevenueDistrictName, setSearchRevenueDistrictName] =
    useState("");
  const [searchPlantationId, setSearchPlantationId] = useState("");
  const [searchStateId, setSearchStateId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [revenueDistrictNameError, setRevenueDistrictNameError] = useState("");
  const [plantationIdError, setPlantationIdError] = useState("");
  const [stateIdError, setStateIdError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const clearSearch = () => {
    setSearchRevenueDistrictName("");
    setSearchPlantationId("");
    setSearchStateId("");
    setIsActive("");
    dispatch(searchRevenueAction({}));
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchRevenueAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getRevenueByIdActionSuccess([]));
      setEditingRevenueData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsRevanueAction());
      setViewMode(false);
      dispatch(getRevenueByIdActionSuccess([]));
      setEditingRevenueData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getRevenueByIdActionSuccess([]));
      setEditingRevenueData(null);
      resetForm();
    }
  };

  const getAllRevenueData = useSelector(
    (state) => state.Revanue.allRevenue.responseData
  );

  const allStates = useSelector(
    (state) => state.state.getAllState.responseData
  );

  const isActiveStateData =
    allStates && allStates.filter((data) => 1 == data.isActive);

  const getAllPlantationData = useSelector(
    (state) => state.plantation.allPlantations.responseData
  );
  const isActivePlantationData =
    getAllPlantationData &&
    getAllPlantationData.filter((data) => 1 == data.isActive);

  const editingRevenueDataFromId = useSelector(
    (state) => state.Revanue.revenueById.responseData
  );

  // Function to perform the search API call

  const handleSearch = () => {
    let searchData = {
      revenueDistrictName: searchRevenueDistrictName,
      plantationId: searchPlantationId,
      stateId: searchStateId,
      isActive,
    };
    dispatch(searchRevenueAction(searchData));
  };

  const searchRevenueData = useSelector(
    (state) => state.Revanue.searchedRevenue.responseData
  );

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const resetForm = () => {
    setRevenueDistrictName("");
    setPlantationId("");
    setStateId("");
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setEditingRevenueData(null);
    $("#RevenueUpload").replaceWith($("#RevenueUpload").val("").clone(true));
    setRemarksError("");
    setUploadDocumentError("");
    setStateIdError("");
    setPlantationIdError("");
    setRevenueDistrictNameError("");
  };

  const validateForm = () => {
    let isValid = true;

    if (!revenueDistrictName.trim()) {
      toast.error("Revenue District Name is required.");
      isValid = false;
      return;
    } else {
      setRevenueDistrictNameError("");
    }

    if (!plantationId) {
      toast.error("PlantationId is required.");
      isValid = false;
      return;
    } else {
      setPlantationIdError("");
    }

    if (!stateId) {
      toast.error("StateId is required.");
      isValid = false;
      return;
    } else {
      setStateIdError("");
    }

    if (!editingRevenueData) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const revenueData = {
        revenueDistrictName: revenueDistrictName,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
        stateId: stateId,
        plantationId: plantationId,
      };
      try {
        if (editingRevenueData) {
          const isFormModified =
            revenueDistrictName !== editingRevenueData?.revenueDistrictName ||
            plantationId !== editingRevenueData?.plantationId ||
            stateId !== editingRevenueData?.stateId ||
            uploadDocumentRemarks !==
              editingRevenueData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingRevenueData?.downloadDto || []).length;
          if (isFormModified) {
            editingRevenueData.searchData = {};
            dispatch(updateRevenueAction(editingRevenueData));
          } else {
          }
        } else {
          dispatch(createRevenueAction(revenueData));
        }
      } catch (e) {}
    }
  };

  let createData = useSelector(
    (state) => state.Revanue.createEditRevenueApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditRevenueApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getRevenueByIdActionSuccess([]));
      setEditingRevenueData(null);
    }
  });

  // Function to handle edit button click
  const handleEditClick = (revenueId) => {
    dispatch(getRevenueByIdAction(revenueId));
    setExpanded("panel1");
  };

  useEffect(() => {
    if (editingRevenueDataFromId) {
      setEditingRevenueData(editingRevenueDataFromId);
      setRevenueDistrictName(
        editingRevenueDataFromId.revenueDistrictName || ""
      );
      setPlantationId(editingRevenueDataFromId.plantationId || "");
      setStateId(editingRevenueDataFromId.stateId || "");
      setUploadDocumentRemarks(
        editingRevenueDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingRevenueDataFromId.downloadDto || []);

      let searchData = {
        stateId: editingRevenueDataFromId.stateId,
        isActive: 1,
      };
      dispatch(searchPlantationAction(searchData));
    } else {
      // setEditingRevenueData(null);
      dispatch(getAllPlantationAction());
      dispatch(getAllStateAction());
    }
  }, [editingRevenueDataFromId]);

  const getAllUploadedDoc = useSelector(
    (state) => state.Revanue.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllRevenue || getSearchRevenue);
  useEffect(() => {
    if (searchRevenueData != null && searchRevenueData != undefined) {
      setGetAllRevenue(searchRevenueData);
      setRows(searchRevenueData); // Update rows with the initial data
    } else {
      setGetAllRevenue([]);
      setRows([]);
    }
  }, [searchRevenueData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "revenueDistrictName",
      title: "Revenue District Name",
    },
    {
      name: "stateName",
      title: "State",
    },
    {
      name: "plantationDistrictName",
      title: "Plantation District Name",
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
        revenueDistrictName: searchRevenueDistrictName,
        plantationId: searchPlantationId,
        stateId: searchStateId,
        isActive,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateRevenueAction(updatedData));
    };
    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.revenueId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.revenueId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
        </div>
      </>
    );
  }

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (revenueId) => {
    dispatch(getRevenueByIdAction(revenueId));
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
    const tableName = "tbl_revenue";
    const moduleName = "Revenue";
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
            onClick={() => handleEditClick(data.data.revenueId)}
          ></i>
          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.revenueId)}
          ></i>
          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.revenueId);
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

  const stateHandleChange = (value, isEdit) => {
    if (isEdit) {
      setEditingRevenueData({
        ...editingRevenueData,
        stateId: value,
      });
    } else {
      setStateId(value);
    }

    if (value != null && value != "" && value != undefined) {
      let searchData = {
        stateId: value,
        isActive: 1,
      };
      dispatch(searchPlantationAction(searchData));
    }
  };

  const searchPlantationData = useSelector(
    (state) => state.plantation.searchedPlantations.responseData
  );

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
              ? "View Revenue District"
              : editingRevenueData
              ? "Edit Revenue District "
              : "Create Revenue District"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Revenue District Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingRevenueData?.revenueDistrictName ||
                          revenueDistrictName
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingRevenueData
                            ? setEditingRevenueData({
                                ...editingRevenueData,
                                revenueDistrictName: e.target.value,
                              })
                            : setRevenueDistrictName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {revenueDistrictNameError && (
                        <p className="errorLabel">{revenueDistrictNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State</label>
                      <select
                        className="form-control select-form"
                        value={editingRevenueData?.stateId || stateId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingRevenueData
                            ? stateHandleChange(e.target.value, 1)
                            : stateHandleChange(e.target.value, 0))
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

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Plantation District Name</label>
                      <select
                        className="form-control select-form"
                        value={editingRevenueData?.plantationId || plantationId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingRevenueData
                            ? setEditingRevenueData({
                                ...editingRevenueData,
                                plantationId: e.target.value,
                              })
                            : setPlantationId(e.target.value))
                        }
                        disabled={
                          (editingRevenueData?.stateId || stateId != null) &&
                          (editingRevenueData?.stateId || stateId != "") &&
                          (editingRevenueData?.stateId ||
                            stateId != undefined) &&
                          !viewMode
                            ? false
                            : true
                        }
                      >
                        <option value="">
                          Select Plantation District Name
                        </option>
                        {searchPlantationData?.map((state) => (
                          <option
                            key={state.plantationId}
                            value={state.plantationId}
                          >
                            {state.plantationDistrictName}
                          </option>
                        ))}
                      </select>
                      {plantationIdError && (
                        <p className="errorLabel">{plantationIdError}</p>
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
                          inputId="revanueUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingRevenueData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingRevenueData
                              ? setEditingRevenueData({
                                  ...editingRevenueData,
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
                          {editingRevenueData ? "Update" : "Submit"}
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
          <Typography>Manage Revenue District Master</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Revenue District Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchRevenueDistrictName}
                        onChange={(e) =>
                          setSearchRevenueDistrictName(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State</label>
                      <select
                        className="form-control select-form"
                        value={searchStateId}
                        onChange={(e) => setSearchStateId(e.target.value)}
                      >
                        <option value="">Select State </option>
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
                      <label>Plantation District Name</label>
                      <select
                        className="form-control select-form"
                        value={searchPlantationId}
                        onChange={(e) => setSearchPlantationId(e.target.value)}
                      >
                        <option value="">
                          Select Plantation District Name
                        </option>
                        {isActivePlantationData?.map((state) => (
                          <option
                            key={state.plantationId}
                            value={state.plantationId}
                          >
                            {state.plantationDistrictName}
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
                        <option value={""}>All</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
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
                    // setColumns={setColumns}
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
                  title: "Revenue District Name",
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

export default CreateRevenueDistrictMaster;
