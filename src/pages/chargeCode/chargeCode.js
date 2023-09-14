import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import {
  getChargeCode,
  createChargeCodeAction,
  getChargeCodeByIdAction,
  updateChargeCodeAction,
  getHistoryByIdAction,
  getDocumentByIdAction,
  uploadAllDocumentsChargeCodeAction,
  getChargeCodeByIdActionSuccess,
  createEditChargeCodeApiStatus,
  getChargeCodeWithoutFilter,
} from "../../store/actions";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import $ from "jquery";
import { toast } from "react-toastify";

const data = [
  {
    state: "California",
    chargeCode: "CA",
    stateInitial: "C",
    action: "Some action",
  },
  {
    state: "New York",
    chargeCode: "NY",
    stateInitial: "NY",
    action: "Another action",
  },
];

function ChargeCode({ open, setOpen }) {
  const getChargeCodeData = useSelector(
    (state) => state.chargeCode.getChargeCode.responseData
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [ChargeCodeName, setChargeCodeName] = useState("");
  const [chargeCode, setchargeCode] = useState("");
  const [stateInitial, setStateInitial] = useState("");

  const [editingChargeCodeData, setEditingChargeCodeData] = useState(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [ChargeCodeNameError, setChargeCodeNameError] = useState("");
  const [ChargeCodeError, setChargeCodeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showmodal, setShowmodal] = useState(false);
  const [isActive, setIsActive] = useState("");

  const editingChargeCodeDataFromState = useSelector(
    (state) => state.chargeCode.chargeCodeData.responseData
  );
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_ChargeCode";
    const moduleName = "ChargeCode";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };
  const getAllUploadedDoc = useSelector(
    (state) => state.chargeCode.uploadedDocuments.responseData
  );
  const handleCloseHistory = () => setShowmodal(false);
  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );
  const handleDownloadClick = (uploadDocumentConfId) => {
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
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

  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    $("#chargeCodeUpload").replaceWith(
      $("#chargeCodeUpload").val("").clone(true)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setChargeCodeNameError("");
    setChargeCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    let isValid = true;

    if (!ChargeCodeName.trim()) {
      toast.error("Charge Code Name is required.");
      isValid = false;
      return;
    }

    if (!chargeCode) {
      toast.error("Charge Code is required.");
      isValid = false;
      return;
    }

    if (!editingChargeCodeData) {
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

    const newChargeCodedata = {
      chargeCodeName: ChargeCodeName,
      chargeCode: chargeCode,
      stateInitial: stateInitial,
      isActive: 1,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
    };
    try {
      if (editingChargeCodeData) {
        const isFormModified =
          ChargeCodeName !== editingChargeCodeData.chargeCodeName ||
          chargeCode !== editingChargeCodeData.chargeCode ||
          uploadDocumentRemarks !==
            editingChargeCodeData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingChargeCodeData.downloadDto.length;
        if (isFormModified) {
          editingChargeCodeData.searchData = {};
          dispatch(updateChargeCodeAction(editingChargeCodeData));
        } else {
        }
      } else {
        dispatch(createChargeCodeAction(newChargeCodedata));
      }

      // dispatch(getAllStateAction());
    } catch (error) {
      setSubmitSuccess(false);
    }
  };
  const handleEditClick = (ChargeCodeId) => {
    setViewMode(false);
    dispatch(getChargeCodeByIdAction(ChargeCodeId));
    setExpanded("panel1");
  };
  useEffect(() => {
    if (editingChargeCodeDataFromState) {
      setEditingChargeCodeData(editingChargeCodeDataFromState);
      setChargeCodeName(editingChargeCodeDataFromState.chargeCodeName || "");
      setchargeCode(editingChargeCodeDataFromState.chargeCode || "");
      setUploadDocumentRemarks(
        editingChargeCodeDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingChargeCodeDataFromState.downloadDto || []);
    } else {
      resetForm();
    }
  }, [editingChargeCodeDataFromState]);

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (ChargeCodeId) => {
    dispatch(getChargeCodeByIdAction(ChargeCodeId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  const handleSearch = () => {
    setViewMode(false);

    let data = {
      chargeCodeName: ChargeCodeName,
      chargeCodeId: chargeCode,
      isActive,
    };
    dispatch(getChargeCode(data));
  };

  const clearSearch = () => {
    setChargeCodeName("");
    setchargeCode("");
    setIsActive("");
    setUploadDocumentRemarks("");
    dispatch(getChargeCode({}));
  };

  const resetForm = () => {
    setChargeCodeName("");
    setchargeCode("");
    setUploadDocumentRemarks("");
    setEditingChargeCodeData(null);
    setChargeCodeNameError("");
    setChargeCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    // setUploadedFiles([]); // Clear uploaded files
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      dispatch(getChargeCode({}));
      // dispatch(getChargeCodeWithoutFilter());
      //Get All roles
      // dispatch(getAllRoles());
      clearSearch();
      setViewMode(false);
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsChargeCodeAction());
      setViewMode(false);
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
      resetForm();
    }
  };

  const getChargeCodeWithoutFilterResponse = useSelector(
    (state) => state.chargeCode.getChargeCodeWithoutFilter.responseData
  );

  const isActiveGetChargeCodeWithoutFilterData =
    getChargeCodeWithoutFilterResponse &&
    getChargeCodeWithoutFilterResponse?.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getChargeCodeData);

  useEffect(() => {
    if (getChargeCodeData != null && getChargeCodeData != undefined) {
      setRows(getChargeCodeData);
    } else {
      setRows([]);
    }
  }, [getChargeCodeData && getChargeCodeData]);

  let createData = useSelector(
    (state) => state.chargeCode.createEditChargeCodeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditChargeCodeApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
    }
  });

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "chargeCodeName",
      title: "Charge Code name",
    },
    {
      name: "chargeCode",
      title: "Charge Code",
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

  function ActionData(data) {
    return (
      <>
        <div class="ActionBtn">
          <i
            className="fa fa-edit"
            onClick={() => handleEditClick(data.data.chargeCodeId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.chargeCodeId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => handleHistoryViewClick(data.data.chargeCodeId)}
          ></i>
        </div>
      </>
    );
  }

  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        chargeCodeName: ChargeCodeName,
        chargeCodeId: chargeCode,
        isActive,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateChargeCodeAction(updatedData));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.chargeCodeId}`}
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange}
            />
            <label
              class="custom-control-label"
              for={`customSwitch${data.data.chargeCodeId}`}
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
            {/* {editingChargeCodeData ? "Edit Charge Code " : "Create Charge Code" } */}
            {viewMode
              ? "View Charge Code"
              : editingChargeCodeData
              ? "Edit Charge Code "
              : "Create Charge Code"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Code name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingChargeCodeData?.chargeCodeName ||
                          ChargeCodeName
                        }
                        maxLength="50"
                        onChange={(e) =>
                          editingChargeCodeData
                            ? setEditingChargeCodeData({
                                ...editingChargeCodeData,
                                chargeCodeName: e.target.value,
                              })
                            : setChargeCodeName(e.target.value)
                        }
                        disabled={viewMode}
                      />
                      {ChargeCodeNameError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {ChargeCodeNameError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingChargeCodeData?.chargeCode || chargeCode}
                        maxLength="10"
                        onChange={(e) =>
                          !viewMode &&
                          (editingChargeCodeData
                            ? setEditingChargeCodeData({
                                ...editingChargeCodeData,
                                chargeCode: e.target.value,
                              })
                            : setchargeCode(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {ChargeCodeError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {ChargeCodeError}
                        </p>
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
                          inputId="chargeCode"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingChargeCodeData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingChargeCodeData
                              ? setEditingChargeCodeData({
                                  ...editingChargeCodeData,
                                  uploadDocumentRemarks: e.target.value,
                                })
                              : setUploadDocumentRemarks(e.target.value))
                          }
                          disabled={viewMode}
                        ></textarea>
                        {remarksError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {remarksError}
                          </p>
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
                          disabled={viewMode}
                          onClick={handleSubmit}
                        >
                          {editingChargeCodeData ? "Update" : "Submit"}
                        </button>
                        <button
                          className="Clear"
                          disabled={viewMode}
                          onClick={handleClear}
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
          <Typography>Manage Charge Code</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Code Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={ChargeCodeName}
                        onChange={(e) => setChargeCodeName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Code</label>
                      <select
                        className="form-control select-form"
                        value={chargeCode}
                        onChange={(e) => setchargeCode(e.target.value)}
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
                <div className="TableBox CreateStateMaster" sahil="sahil">
                  <TableComponent
                    columns={columns}
                    // setColumns={setColumns}
                    //rows={rows}
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
                  title: "Charge Code",
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

export default ChargeCode;
