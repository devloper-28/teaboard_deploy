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
  getAllFactoryTypes,
  createFactoryType,
  updateFactoryType,
  getFactoryTypeById,
  searchFactoryType,
  uploadAllDocumentsFactoryTypeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getFactoryTypeByIdSuccess,
  createEditFactoryTypeApiStatus,
  getGradeByIdSuccess,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateFactoryType({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [factoryTypeName, setFactoryTypeName] = useState("");
  const [factoryType, setFactoryType] = useState("");

  const [editingFactoryTypeData, setEditingFactoryTypeData] = useState(null);
  const [getSearchFactoryType, setGetSearchFactoryType] = useState([]);
  const [getAllFactoryType, setGetAllFactoryType] = useState([]);

  // New state variables for search parameters
  const [searchFactoryTypeName, setSearchFactoryTypeName] = useState("");
  const [searchFactoryTypeId, setSearchFactoryTypeId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [factoryTypeNameError, setFactoryTypeNameError] = useState("");
  const [factoryTypeError, setFactoryTypeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getAllFactoryTypeData = useSelector(
    (state) => state.fectoryType.allFactoryTypes.responseData
  );
  const isActiveData =
    getAllFactoryTypeData &&
    getAllFactoryTypeData.filter((data) => 1 == data.isActive);

  const editingFactoryTypeDataFromId = useSelector(
    (state) => state.fectoryType.factoryType.responseData
  );

  const handleSearch = () => {
    let searchData = {
      factoryTypeName: searchFactoryTypeName,
      factoryTypeId: searchFactoryTypeId,
      isActive,
    };
    dispatch(searchFactoryType(searchData));
  };

  const clearSearch = () => {
    setSearchFactoryTypeName("");
    setSearchFactoryTypeId("");
    setIsActive("");
    dispatch(searchFactoryType({}));
  };

  const searchFactoryTypeData = useSelector(
    (state) => state.fectoryType.searchResults.responseData
  );

  let createData = useSelector(
    (state) => state.fectoryType.createEditFactoryTypeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditFactoryTypeApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getGradeByIdSuccess([]));
      setEditingFactoryTypeData(null);
    }
  });

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const resetForm = () => {
    setFactoryTypeName("");
    setFactoryType("");
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setEditingFactoryTypeData(null);
    $("#factoryTypeUpload").replaceWith(
      $("#factoryTypeUpload").val("").clone(true)
    );
    setFactoryTypeNameError("");
    setFactoryTypeError("");
    setRemarksError("");
    setUploadDocumentError("");
  };

  const validateForm = () => {
    let isValid = true;

    if (!factoryTypeName.trim()) {
      toast.error("Factory Type Name is required.");
      isValid = false;
      return;
    } else {
      setFactoryTypeNameError("");
    }

    if (!factoryType) {
      toast.error("Facatory Type is required.");
      isValid = false;
      return;
    } else {
      setFactoryTypeError("");
    }

    if (!editingFactoryTypeData) {
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
      const factoryTypeData = {
        factoryTypeName: factoryTypeName,
        factoryType: factoryType,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
      };

      try {
        if (editingFactoryTypeData) {
          const isFormModified =
            factoryTypeName !== editingFactoryTypeData?.factoryTypeName ||
            factoryType !== editingFactoryTypeData?.factoryType ||
            uploadDocumentRemarks !==
              editingFactoryTypeData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingFactoryTypeData?.downloadDto || []).length;
          if (isFormModified) {
            editingFactoryTypeData.searchData = {};
            dispatch(updateFactoryType(editingFactoryTypeData));
          } else {
          }
        } else {
          dispatch(createFactoryType(factoryTypeData));
        }
      } catch (e) {}
    }
  };
  // Function to handle edit button click
  const handleEditClick = (factoryTypeId) => {
    dispatch(getFactoryTypeById(factoryTypeId));
    setExpanded("panel1");
  };

  useEffect(() => {
    if (editingFactoryTypeDataFromId) {
      setEditingFactoryTypeData(editingFactoryTypeDataFromId);
      setFactoryTypeName(editingFactoryTypeDataFromId.factoryTypeName || "");
      setFactoryType(editingFactoryTypeDataFromId.factoryType || "");
      setUploadDocumentRemarks(
        editingFactoryTypeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingFactoryTypeDataFromId.downloadDto || []);
    } else {
      // setEditingFactoryTypeData(null);
      // Dispatch the action to fetch auction center data
    }
  }, [editingFactoryTypeDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchFactoryType({}));
      //Get All State
      dispatch(getAllFactoryTypes());
      clearSearch();
      setViewMode(false);
      dispatch(getFactoryTypeByIdSuccess([]));
      setEditingFactoryTypeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsFactoryTypeAction());
      setViewMode(false);
      dispatch(getFactoryTypeByIdSuccess([]));
      setEditingFactoryTypeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getFactoryTypeByIdSuccess([]));
      setEditingFactoryTypeData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.fectoryType.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllFactoryType || getSearchFactoryType);

  useEffect(() => {
    if (searchFactoryTypeData != null && searchFactoryTypeData != null) {
      setGetSearchFactoryType(searchFactoryTypeData);
      setRows(searchFactoryTypeData); // Update rows with the search data
    } else {
      setGetSearchFactoryType([]);
      setRows([]); // Update rows with the search data
    }
  }, [searchFactoryTypeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "factoryTypeName",
      title: "Factory Type Name",
    },
    {
      name: "factoryType",
      title: "Factory Type",
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
        factoryTypeName: searchFactoryTypeName,
        factoryTypeId: searchFactoryTypeId,
        isActive,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateFactoryType(updatedData));
    };
    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.factoryTypeId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.factoryTypeId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
        </div>
      </>
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
  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (factoryTypeId) => {
    dispatch(getFactoryTypeById(factoryTypeId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_FactoryType";
    const moduleName = "FactoryType";
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
            onClick={() => handleEditClick(data.data.factoryTypeId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.factoryTypeId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.factoryTypeId);
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
              ? "View Factory Type"
              : editingFactoryTypeData
              ? "Edit Factory Type"
              : "Create Factory Type"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Factory Type Name</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="50"
                        value={
                          editingFactoryTypeData?.factoryTypeName ||
                          factoryTypeName
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingFactoryTypeData
                            ? setEditingFactoryTypeData({
                                ...editingFactoryTypeData,
                                factoryTypeName: e.target.value,
                              })
                            : setFactoryTypeName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {factoryTypeNameError && (
                        <p className="errorLabel">{factoryTypeNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Factory Type</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="50"
                        value={
                          editingFactoryTypeData?.factoryType || factoryType
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingFactoryTypeData
                            ? setEditingFactoryTypeData({
                                ...editingFactoryTypeData,
                                factoryType: e.target.value,
                              })
                            : setFactoryType(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {factoryTypeError && (
                        <p className="errorLabel">{factoryTypeError}</p>
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
                          inputId="factoryTypeUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingFactoryTypeData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingFactoryTypeData
                              ? setEditingFactoryTypeData({
                                  ...editingFactoryTypeData,
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
                          {editingFactoryTypeData ? "Update" : "Submit"}
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
          <Typography>Manage Factory Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Factory Type Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchFactoryTypeName}
                        onChange={(e) =>
                          setSearchFactoryTypeName(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Factory Type</label>
                      <select
                        className="form-control select-form"
                        value={searchFactoryTypeId}
                        onChange={(e) => setSearchFactoryTypeId(e.target.value)}
                      >
                        <option value="">Select Factory Type </option>
                        {isActiveData?.map((state) => (
                          <option
                            key={state.factoryTypeId}
                            value={state.factoryTypeId}
                          >
                            {state.factoryType}
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
                  title: "Factory Type",
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

export default CreateFactoryType;
