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
  createPlantationAction,
  getAllStateAction,
  updatePlantationAction,
  getPlantationByIdAction,
  searchPlantationAction,
  uploadAllDocumentsPlantationAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditPlantationApiStatus,
  getPlantationByIdActionSuccess,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import $ from "jquery";
import { toast } from "react-toastify";

function CreatePlantationDistrictMaster({ open, setOpen }) {
  const dispatch = useDispatch();
  const [plantationDistrictName, setPlantationDistrictName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState(0);
  const [editingPlantationData, setEditingPlantationData] = useState(null);

  const [getSearchPlantation, setGetSearchPlantation] = useState([]);
  const [getAllPlantation, setGetAllPlantation] = useState([]);

  // New state variables for search parameters
  const [searchPlantationDistrictName, setSearchPlantationDistrictName] =
    useState("");
  const [searchStateId, setSearchStateId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [plantationDistrictNameError, setPlantationDistrictNameError] =
    useState("");
  const [selectedStateIdError, setSelectedStateIdError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getAllPlantationData = useSelector(
    (state) => state.plantation.allPlantations.responseData
  );

  const allStates = useSelector(
    (state) => state.state.getAllState.responseData
  );

  const isActiveData =
    allStates && allStates.filter((data) => 1 == data.isActive);

  const editingPlantationDataFromId = useSelector(
    (state) => state.plantation.plantationById.responseData
    // .plantation.plantationById.responseData
  );

  // Function to perform the search API call
  const handleSearch = () => {
    let searchData = {
      plantationDistrictName: searchPlantationDistrictName,
      stateId: searchStateId,
      isActive,
    };
    dispatch(searchPlantationAction(searchData));
  };

  const clearSearch = () => {
    setSearchPlantationDistrictName("");
    setSearchStateId("");
    setIsActive("");
    dispatch(searchPlantationAction({}));
  };

  const searchPlantationData = useSelector(
    (state) => state.plantation.searchedPlantations.responseData //.plantation.searchedPlantations.responseData
  );

  const validateForm = () => {
    let isValid = true;

    // Validate Auction Center Name
    if (!plantationDistrictName.trim()) {
      toast.error("Plantation District Name is required.");
      isValid = false;
      return;
    } else {
      setPlantationDistrictNameError("");
    }

    // Validate Auction Center Code
    if (!selectedStateId) {
      toast.error("StateId is required.");
      isValid = false;
      return;
    } else {
      setSelectedStateIdError("");
    }

    if (!editingPlantationData) {
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
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  const resetForm = () => {
    setPlantationDistrictName("");
    setSelectedStateId("");
    $("#plantationUpload").replaceWith(
      $("#plantationUpload").val("").clone(true)
    );
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setEditingPlantationData(null);

    setPlantationDistrictNameError("");
    setSelectedStateIdError("");
    setUploadDocumentError("");
    setRemarksError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const plantationData = {
        plantationDistrictName: plantationDistrictName,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
        stateId: selectedStateId,
      };
      try {
        if (editingPlantationData) {
          const isFormModified =
            plantationDistrictName !==
              editingPlantationData?.plantationDistrictName ||
            selectedStateId !== editingPlantationData?.selectedStateId ||
            uploadDocumentRemarks !==
              editingPlantationData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingPlantationData?.downloadDto || []).length;
          if (isFormModified) {
            editingPlantationData.searchData = {};
            dispatch(updatePlantationAction(editingPlantationData));
          } else {
          }
        } else {
          dispatch(createPlantationAction(plantationData));
        }
      } catch (e) {}
    }
  };
  // Function to handle edit button click
  const handleEditClick = (plantationId) => {
    console.log("in plantation 191", plantationId);
    dispatch(getPlantationByIdAction(plantationId));
    setExpanded("panel1");
  };

  useEffect(() => {
    if (editingPlantationDataFromId) {
      console.log(
        "editingPlantationDataFromId 198",
        editingPlantationDataFromId
      );
      setEditingPlantationData(editingPlantationDataFromId);
      setPlantationDistrictName(
        editingPlantationDataFromId.plantationDistrictName || ""
      );
      setSelectedStateId(editingPlantationDataFromId.stateId || "");
      setUploadDocumentRemarks(
        editingPlantationDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingPlantationDataFromId.downloadDto || []);
    } else {
      setEditingPlantationData(null);
      dispatch(getAllStateAction());
    }
  }, [editingPlantationDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchPlantationAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
      dispatch(getAllStateAction());
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsPlantationAction());
      setViewMode(false);
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.plantation.uploadedDocuments.responseData
  );

  let createData = useSelector(
    (state) => state.plantation.createEditPlantationApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditPlantationApiStatus(false));
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
      clearSearch();
      setExpanded("panel2");
    }
  });

  const [rows, setRows] = useState(getAllPlantation || getSearchPlantation);

  useEffect(() => {
    if (searchPlantationData != null && searchPlantationData != undefined) {
      setGetSearchPlantation(searchPlantationData);
      setRows(searchPlantationData); // Update rows with the search data
    } else {
      setGetSearchPlantation([]);
      setRows([]); // Update rows with the search data
    }
  }, [searchPlantationData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "plantationDistrictName",
      title: "Plantation District name",
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
        plantationDistrictName: searchPlantationDistrictName,
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
      dispatch(updatePlantationAction(updatedData));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.plantationId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.plantationId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
        </div>
      </>
    );
  }

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (plantationId) => {
    dispatch(getPlantationByIdAction(plantationId));
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
    const tableName = "tbl_plantation";
    const moduleName = "Plantation";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  function ActionData(data) {
    return (
      <>
        {console.log("data 384", data)}
        <div class="ActionBtn">
          <i
            className="fa fa-edit"
            onClick={() => handleEditClick(data.data.plantationId)}
          ></i>
          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.plantationId)}
          ></i>
          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.plantationId);
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
              ? "View Plantation District"
              : editingPlantationData
              ? "Edit Plantation District"
              : "Create Plantation District"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Plantation District name</label>
                      <input
                        type="text"
                        maxLength="50"
                        className="form-control"
                        value={
                          editingPlantationData?.plantationDistrictName ||
                          plantationDistrictName
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingPlantationData
                            ? setEditingPlantationData({
                                ...editingPlantationData,
                                plantationDistrictName: e.target.value,
                              })
                            : setPlantationDistrictName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {plantationDistrictNameError && (
                        <p className="errorLabel">
                          {plantationDistrictNameError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State</label>
                      <select
                        className="form-control select-form"
                        // value={selectedStateId}
                        // onChange={(e) => setSelectedStateId(e.target.value)}
                        value={
                          editingPlantationData?.selectedStateId ||
                          selectedStateId
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingPlantationData
                            ? setEditingPlantationData({
                                ...editingPlantationData,
                                selectedStateId: e.target.value,
                              })
                            : setSelectedStateId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value="">Select State</option>
                        {isActiveData?.map((state) => (
                          <option key={state.stateId} value={state.stateId}>
                            {state.stateName}
                          </option>
                        ))}
                      </select>
                      {selectedStateIdError && (
                        <p className="errorLabel">{selectedStateIdError}</p>
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
                          inputId="plantationUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingPlantationData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingPlantationData
                              ? setEditingPlantationData({
                                  ...editingPlantationData,
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
                          {editingPlantationData ? "Update" : "Submit"}
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
          <Typography>Manage Plantation District</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Plantation District name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchPlantationDistrictName}
                        onChange={(e) =>
                          setSearchPlantationDistrictName(e.target.value)
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
                        {isActiveData?.map((state) => (
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
                  title: "Plantation District Name",
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

export default CreatePlantationDistrictMaster;
