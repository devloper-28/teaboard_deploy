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
  getAllGrades,
  createGrade,
  updateGrade,
  getGradeById,
  searchGrade,
  uploadAllDocumentsGradeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getGradeByIdSuccess,
  createEditGradeApiStatus,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateGrade({ open, setOpen }) {
  const dispatch = useDispatch();
  const [gradeName, setGradeName] = useState("");
  const [gradeCode, setGradeCode] = useState("");
  const [editingGradeData, setEditingGradeData] = useState(null);

  const [getSearchGrade, setGetSearchGrade] = useState([]);
  const [getAllGradeList, setGetAllGradeList] = useState([]);

  // New state variables for search parameters
  const [searchGradeName, setSearchGradeName] = useState("");
  const [searchGradeCode, setSearchGradeCode] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [gradeNameError, setGradeNameError] = useState("");
  const [gradeCodeError, setGradeCodeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getAllGrade = useSelector(
    (state) => state.gradeManage.allGrades.responseData
  );

  const isActiveData =
    getAllGrade && getAllGrade.filter((data) => 1 == data.isActive);

  const editingGradeDataFromId = useSelector(
    (state) => state.gradeManage.grade.responseData
  );

  // Function to perform the search API call

  const handleSearch = () => {
    let searchData = {
      gradeName: searchGradeName,
      gradeId: searchGradeCode,
      isActive,
    };
    dispatch(searchGrade(searchData));
  };

  const clearSearch = () => {
    setSearchGradeName("");
    setSearchGradeCode("");
    setIsActive("");
    dispatch(searchGrade({}));
  };

  const searchGradeData = useSelector(
    (state) => state.gradeManage.searchResults.responseData
  );

  const resetForm = () => {
    setGradeName("");
    setGradeCode("");
    setEditingGradeData(null);
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setGradeNameError("");
    setGradeCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    $("#gradeUpload").replaceWith($("#gradeUpload").val("").clone(true));
  };
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const validateForm = () => {
    let isValid = true;

    if (!gradeName.trim()) {
      toast.error("Grade Name is required.");
      isValid = false;
      return;
    } else {
      setGradeNameError("");
    }

    if (!gradeCode) {
      toast.error("Grade Code is required.");
      isValid = false;
      return;
    } else {
      setGradeCodeError("");
    }

    if (!editingGradeData) {
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

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (gradeId) => {
    dispatch(getGradeById(gradeId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const gradeData = {
        gradeName: gradeName,
        gradeCode: gradeCode,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
      };
      try {
        if (editingGradeData) {
          const isFormModified =
            gradeName !== editingGradeData?.gradeName ||
            gradeCode !== editingGradeData?.gradeCode ||
            uploadDocumentRemarks !== editingGradeData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingGradeData?.downloadDto || []).length;
          if (isFormModified) {
            editingGradeData.searchData = {};

            dispatch(updateGrade(editingGradeData));
          } else {
          }
        } else {
          dispatch(createGrade(gradeData));
        }
      } catch (e) {}
    }
  };

  // Function to handle edit button click
  const handleEditClick = (gradeId) => {
    dispatch(getGradeById(gradeId));
    setExpanded("panel1");
  };

  useEffect(() => {
    if (editingGradeDataFromId) {
      setEditingGradeData(editingGradeDataFromId);
      setGradeName(editingGradeDataFromId.gradeName || "");
      setGradeCode(editingGradeDataFromId.gradeCode || "");
      setUploadDocumentRemarks(
        editingGradeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingGradeDataFromId.downloadDto || []);
    }
  }, [editingGradeDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchGrade({}));
      //Get All grade
      dispatch(getAllGrades());
      clearSearch();
      setViewMode(false);
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsGradeAction());
      setViewMode(false);
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.gradeManage.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getSearchGrade || getAllGradeList);
  useEffect(() => {
    if (searchGradeData != null && searchGradeData != undefined) {
      setGetSearchGrade(searchGradeData);
      setRows(searchGradeData); // Update rows with the search data
    } else {
      setGetSearchGrade([]);
      setRows([]); // Update rows with the search data
    }
  }, [searchGradeData]);

  let createData = useSelector(
    (state) => state.gradeManage.createEditGradeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditGradeApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
    }
  });

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "gradeName",
      title: "Grade Name",
    },
    {
      name: "gradeCode",
      title: "Grade Code",
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
    const tableName = "tbl_Grade";
    const moduleName = "Grade";
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
            onClick={() => handleEditClick(data.data.gradeId)}
          ></i>
          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.gradeId)}
          ></i>
          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.gradeId);
            }}
          ></i>
        </div>
      </>
    );
  }
  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        gradeName: searchGradeName,
        gradeId: searchGradeCode,
        isActive,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateGrade(updatedData));
    };
    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.gradeId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.gradeId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
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
              ? "View Grade"
              : editingGradeData
              ? "Edit Grade "
              : "Create Grade"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Grade Name</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="50"
                        value={editingGradeData?.gradeName || gradeName}
                        onChange={(e) =>
                          !viewMode &&
                          (editingGradeData
                            ? setEditingGradeData({
                                ...editingGradeData,
                                gradeName: e.target.value,
                              })
                            : setGradeName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {gradeNameError && (
                        <p className="errorLabel">{gradeNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Grade Code</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="10"
                        // value={gradeCode}
                        // onChange={(e) => setGradeCode(e.target.value)}
                        value={editingGradeData?.gradeCode || gradeCode}
                        onChange={(e) =>
                          !viewMode &&
                          (editingGradeData
                            ? setEditingGradeData({
                                ...editingGradeData,
                                gradeCode: e.target.value,
                              })
                            : setGradeCode(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {gradeCodeError && (
                        <p className="errorLabel">{gradeCodeError}</p>
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
                          inputId="gradeUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingGradeData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingGradeData
                              ? setEditingGradeData({
                                  ...editingGradeData,
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
                          {editingGradeData ? "Update" : "Submit"}
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
          <Typography>Manage Grade</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Grade Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchGradeName}
                        onChange={(e) => setSearchGradeName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Grade Code</label>
                      <select
                        className="form-control select-form"
                        value={searchGradeCode}
                        onChange={(e) => setSearchGradeCode(e.target.value)}
                      >
                        <option value="">Select Grade Code </option>
                        {isActiveData?.map((state) => (
                          <option key={state.gradeId} value={state.gradeId}>
                            {state.gradeCode}
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
                  title: "Grade Name",
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

export default CreateGrade;
