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
  getAllSubTeaTypes,
  createSubTeaType,
  getAllTeaTypes,
  getSubTeaTypeById,
  updateSubTeaType,
  searchSubTeaType,
  uploadAllDocumentsSubTeaTypeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getSubTeaTypeByIdSuccess,
  createEditSubTeaTypeApiStatus,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import $ from "jquery";
import { toast } from "react-toastify";

function CreateSubTeaType({ open, setOpen }) {
  const dispatch = useDispatch();

  const [subTeaTypeName, setSubTeaTypeName] = useState("");
  const [subTeaTypeCode, setSubTeaTypeCode] = useState("");
  const [teaTypeId, setTeaTypeId] = useState("");
  const [editingSubTeaTypeData, setEditingSubTeaTypeData] = useState(null);

  const [getSearchSubTeaType, setGetSearchSubTeaType] = useState([]);
  const [getAllSubTeaType, setGetAllSubTeaType] = useState([]);

  // New state variables for search parameters
  const [searchSubTeaTypeName, setSearchSubTeaTypeName] = useState("");
  const [searchSubTeaTypeCode, setSearchSubTeaTypeCode] = useState("");
  const [searchTeaTypeId, setSearchTeaTypeId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [subTeaTypeNameError, setSubTeaTypeNameError] = useState("");
  const [subTeaTypeCodeError, setSubTeaTypeCodeError] = useState("");
  const [teaTypeIdError, setTeaTypeIdError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewMode, setViewMode] = useState(false);

  const getAllSubTeaTypesData = useSelector(
    (state) => state.subTeaType.allSubTeaTypes.responseData
  );

  const isActiveData =
    getAllSubTeaType && getAllSubTeaType.filter((data) => 1 == data.isActive);

  const editingSubTeaTypeDataFromId = useSelector(
    (state) => state.subTeaType.subTeaType.responseData
  );

  useEffect(() => {
    dispatch(getAllTeaTypes());
  }, []);

  // Function to perform the search API call
  const handleSearch = () => {
    let searchData = {
      subTeaTypeId: searchSubTeaTypeCode,
      subTeaTypeName: searchSubTeaTypeName,
      teaTypeId: searchTeaTypeId,
      isActive,
    };
    dispatch(searchSubTeaType(searchData));
  };

  const clearSearch = () => {
    // Clear search parameters and fetch all auction centers
    setSearchSubTeaTypeCode("");
    setSearchSubTeaTypeName("");
    setSearchTeaTypeId("");
    setIsActive("");
    dispatch(searchSubTeaType({}));
    // setRows(getAllSubTeaType);
  };

  const searchSubTeatypeData = useSelector(
    (state) => state.subTeaType.searchResults.responseData
  );

  const allTeaType = useSelector(
    (state) => state.teaTypeManage.allTeaTypes.responseData
  );

  const isActiveTeaData =
    allTeaType && allTeaType.filter((data) => 1 == data.isActive);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubTeaTypeCodeError("");
    setSubTeaTypeNameError("");
    setTeaTypeIdError("");
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;

    if (!subTeaTypeName.trim()) {
      toast.error("Name is required.");
      isValid = false;
      return;
    }

    if (!subTeaTypeCode) {
      toast.error("Code is required.");
      isValid = false;
      return;
    }

    if (!teaTypeId) {
      toast.error("Id is required.");
      isValid = false;
      return;
    }

    if (!editingSubTeaTypeData) {
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

    if (!isValid) {
      return;
    }

    const subTeaTypeData = {
      subTeaTypeCode: subTeaTypeCode,
      subTeaTypeName: subTeaTypeName,
      isActive: 1,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      teaTypeId: teaTypeId,
    };
    try {
      if (editingSubTeaTypeData) {
        const isFormModified =
          subTeaTypeCode !== editingSubTeaTypeData.subTeaTypeCode ||
          parseInt(teaTypeId) !== parseInt(editingSubTeaTypeData.teaTypeId) ||
          subTeaTypeName !== editingSubTeaTypeData.subTeaTypeName ||
          uploadDocumentRemarks !==
            editingSubTeaTypeData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingSubTeaTypeData.downloadDto.length;
        if (isFormModified) {
          editingSubTeaTypeData.searchData = {};
          dispatch(updateSubTeaType(editingSubTeaTypeData));
        } else {
          // setExpanded("panel2");
        }
      } else {
        dispatch(createSubTeaType(subTeaTypeData));
      }
    } catch (e) {}
  };

  const handleViewClick = (subTeaTypeId) => {
    dispatch(getSubTeaTypeById(subTeaTypeId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const resetForm = () => {
    setSubTeaTypeName("");
    setSubTeaTypeCode("");
    setTeaTypeId("");
    $("#subTeatypeUpload").replaceWith(
      $("#subTeatypeUpload").val("").clone(true)
    );
    setEditingSubTeaTypeData(null);
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setTeaTypeIdError("");
    setSubTeaTypeCodeError("");
    setSubTeaTypeNameError("");
  };
  // Function to handle edit button click
  const handleEditClick = (subTeaTypeId) => {
    dispatch(getSubTeaTypeById(subTeaTypeId));
    setExpanded("panel1");
  };

  useEffect(() => {
    if (editingSubTeaTypeDataFromId) {
      setEditingSubTeaTypeData(editingSubTeaTypeDataFromId);
      setSubTeaTypeName(editingSubTeaTypeDataFromId.subTeaTypeName || "");
      setSubTeaTypeCode(editingSubTeaTypeDataFromId.subTeaTypeCode || "");
      setTeaTypeId(editingSubTeaTypeDataFromId.teaTypeId || "");
      setUploadDocumentRemarks(
        editingSubTeaTypeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingSubTeaTypeDataFromId.downloadDto || []);
    } else {
      // setEditingSubTeaTypeData(null);
      // dispatch(getAllSubTeaTypes()); // Dispatch the action to fetch data
      // dispatch(getAllTeaTypes());
    }
  }, [editingSubTeaTypeDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchSubTeaType({}));
      clearSearch();
      setViewMode(false);
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);
      dispatch(getAllSubTeaTypes());
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsSubTeaTypeAction());
      setViewMode(false);
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);
      resetForm();
    }
  };

  let createData = useSelector(
    (state) => state.subTeaType.createEditSubTeaTypeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditSubTeaTypeApiStatus(false));
      resetForm();
      setExpanded("panel2");
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);
      dispatch(searchSubTeaType({}));
    }
  });

  const getAllUploadedDoc = useSelector(
    (state) => state.subTeaType.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllSubTeaType || getSearchSubTeaType);
  useEffect(() => {
    if (getAllSubTeaTypesData) {
      setGetAllSubTeaType(getAllSubTeaTypesData);
      setRows(getAllSubTeaTypesData); // Update rows with the initial data
    }
  }, [getAllSubTeaTypesData]);

  useEffect(() => {
    if (searchSubTeatypeData != null && searchSubTeatypeData != undefined) {
      setGetSearchSubTeaType(searchSubTeatypeData);
      setRows(searchSubTeatypeData); // Update rows with the search data
    } else {
      setGetSearchSubTeaType([]);
      setRows([]); // Update rows with the search data
    }
  }, [searchSubTeatypeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "subTeaTypeName",
      title: "Sub Tea Type Name",
    },
    {
      name: "subTeaTypeCode",
      title: "Sub Tea Type Code",
    },
    {
      name: "teaTypeName",
      title: "Tea Type Name",
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
        subTeaTypeId: searchSubTeaTypeCode,
        subTeaTypeName: searchSubTeaTypeName,
        teaTypeId: searchTeaTypeId,
        isActive,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateSubTeaType(updatedData));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.subTeaTypeId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.subTeaTypeId}`}
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
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_SubTeaType";
    const moduleName = "SubTeaType";
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
            onClick={() => handleEditClick(data.data.subTeaTypeId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.subTeaTypeId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.subTeaTypeId);
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
              ? "View  Sub Tea Type"
              : editingSubTeaTypeData
              ? "Edit  Sub Tea Type"
              : "Create  Sub Tea Type"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Sub Tea Type Name</label>
                      <input
                        type="text"
                        className="form-control"
                        // value={subTeaTypeName}
                        // onChange={(e) => setSubTeaTypeName(e.target.value)}
                        value={
                          editingSubTeaTypeData?.subTeaTypeName ||
                          subTeaTypeName
                        }
                        maxLength="50"
                        onChange={(e) =>
                          !viewMode &&
                          (editingSubTeaTypeData
                            ? setEditingSubTeaTypeData({
                                ...editingSubTeaTypeData,
                                subTeaTypeName: e.target.value,
                              })
                            : setSubTeaTypeName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {subTeaTypeNameError && (
                        <p className="errorLabel">{subTeaTypeNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Sub Tea Type Code</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="10"
                        // value={subTeaTypeCode}
                        // onChange={(e) => setSubTeaTypeCode(e.target.value)}
                        value={
                          editingSubTeaTypeData?.subTeaTypeCode ||
                          subTeaTypeCode
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingSubTeaTypeData
                            ? setEditingSubTeaTypeData({
                                ...editingSubTeaTypeData,
                                subTeaTypeCode: e.target.value,
                              })
                            : setSubTeaTypeCode(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {subTeaTypeCodeError && (
                        <p className="errorLabel">{subTeaTypeCodeError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Type Name</label>
                      <select
                        className="form-control select-form"
                        // value={teaTypeId}
                        // onChange={(e) => setTeaTypeId(e.target.value)}
                        value={editingSubTeaTypeData?.teaTypeId || teaTypeId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingSubTeaTypeData
                            ? setEditingSubTeaTypeData({
                                ...editingSubTeaTypeData,
                                teaTypeId: e.target.value,
                              })
                            : setTeaTypeId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value="">Select Tea Type</option>
                        {isActiveTeaData?.map((state) => (
                          <option key={state.teaTypeId} value={state.teaTypeId}>
                            {state.teaTypeName}
                          </option>
                        ))}
                      </select>
                      {teaTypeIdError && (
                        <p className="errorLabel">{teaTypeIdError}</p>
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
                          inputId="subTypeUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingSubTeaTypeData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingSubTeaTypeData
                              ? setEditingSubTeaTypeData({
                                  ...editingSubTeaTypeData,
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
                          {editingSubTeaTypeData ? "Update" : "Submit"}
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
          <Typography>Manage Sub Tea Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Sub Tea Type Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchSubTeaTypeName}
                        onChange={(e) =>
                          setSearchSubTeaTypeName(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Sub Tea Type Code</label>
                      <select
                        className="form-control select-form"
                        value={searchSubTeaTypeCode}
                        onChange={(e) =>
                          setSearchSubTeaTypeCode(e.target.value)
                        }
                      >
                        <option value="">Select Sub Tea Type Code</option>
                        {isActiveData?.map((state) => (
                          <option
                            key={state.subTeaTypeId}
                            value={state.subTeaTypeId}
                          >
                            {state.subTeaTypeCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Type Name</label>
                      <select
                        className="form-control select-form"
                        value={searchTeaTypeId}
                        onChange={(e) => setSearchTeaTypeId(e.target.value)}
                      >
                        <option value="">Select Tea Type Name</option>
                        {isActiveTeaData?.map((state) => (
                          <option key={state.teaTypeId} value={state.teaTypeId}>
                            {state.teaTypeName}
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
                  title: "Sub Tea Type Name",
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

export default CreateSubTeaType;
