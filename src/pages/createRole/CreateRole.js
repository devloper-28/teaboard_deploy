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
  getAllRoles,
  createRole,
  updateRole,
  getRoleById,
  searchRole,
  uploadAllDocumentsRoleAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditRoleApiStatus,
  getRoleByIdSuccess,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateRole({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");

  const [editingRoleData, setEditingRoleData] = useState(null);
  const [getSearchRole, setGetSearchRole] = useState([]);
  const [getAllRole, setGetAllRole] = useState([]);

  // New state variables for search parameters
  const [searchRoleName, setSearchRoleName] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [roleNameError, setRoleNameError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getAllRoleData = useSelector(
    (state) => state.role.allRoles.responseData
  );
  const isActiveData =
    getAllRoleData && getAllRoleData.filter((data) => 1 == data.isActive);

  const editingRoleDataFromId = useSelector(
    (state) => state.role.roleById.responseData
  );

  const getAllUploadedDoc = useSelector(
    (state) => state.role.uploadedDocuments.responseData
  );

  // Function to perform the search API call

  const handleSearch = () => {
    let searchData = {
      roleId: searchRoleName,
      isActive,
    };
    dispatch(searchRole(searchData));
  };
  const clearSearch = () => {
    setSearchRoleName("");
    setIsActive("");
    dispatch(getAllRoles());
    dispatch(searchRole({}));
  };

  const searchRoleData = useSelector(
    (state) => state.role.searchedRoles.responseData
  );

  const resetForm = () => {
    setRoleName("");
    setUploadDocumentRemarks("");
    $("#roleUpload").replaceWith($("#roleUpload").val("").clone(true));
    setUploadedDocuments([]);
    setEditingRoleData(null);
    setRoleNameError("");
    setUploadDocumentError("");
    setRoleNameError("");
  };

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const validateForm = () => {
    let isValid = true;

    if (!roleName.trim()) {
      toast.error("Role Name is required.");
      isValid = false;
      return;
    } else {
      setRoleNameError("");
    }

    if (!editingRoleData) {
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
      const roleData = {
        roleName: roleName,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
      };
      try {
        if (editingRoleData) {
          const isFormModified =
            roleName !== editingRoleData?.roleName ||
            uploadDocumentRemarks !== editingRoleData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingRoleData?.downloadDto || []).length;
          if (isFormModified) {
            editingRoleData.searchData = {};
            dispatch(updateRole(editingRoleData));
          } else {
          }
        } else {
          dispatch(createRole(roleData));
        }
      } catch (e) {}
    }
  };
  // Function to handle edit button click
  const handleEditClick = (roleId) => {
    dispatch(getRoleById(roleId));
    setExpanded("panel1");
  };

  useEffect(() => {
    if (editingRoleDataFromId) {
      setEditingRoleData(editingRoleDataFromId);
      setRoleName(editingRoleDataFromId.roleName || "");
      setUploadDocumentRemarks(
        editingRoleDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingRoleDataFromId.downloadDto || []);
    }
  }, [editingRoleDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchRole({}));
      //Get All roles
      dispatch(getAllRoles());
      clearSearch();
      setViewMode(false);
      dispatch(getRoleByIdSuccess([]));
      setEditingRoleData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsRoleAction());
      setViewMode(false);
      dispatch(getRoleByIdSuccess([]));
      setEditingRoleData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getRoleByIdSuccess([]));
      setEditingRoleData(null);
      resetForm();
    }
  };

  const [rows, setRows] = useState(getSearchRole || getAllRole);
  useEffect(() => {
    if (searchRoleData != null && searchRoleData != undefined) {
      setGetSearchRole(searchRoleData);
      setRows(searchRoleData); // Update rows with the search data
    } else {
      setGetSearchRole([]);
      setRows([]);
    }
  }, [searchRoleData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "roleName",
      title: "Role Name",
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
        roleId: searchRoleName,
        isActive,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateRole(updatedData));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.roleId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.roleId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
        </div>
      </>
    );
  }
  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (roleId) => {
    dispatch(getRoleById(roleId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  let createData = useSelector((state) => state.role.createEditRoleApiStatus);

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditRoleApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getRoleByIdSuccess([]));
      setEditingRoleData(null);
    }
  });

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
    const tableName = "tbl_Role";
    const moduleName = "Role";
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
            onClick={() => handleEditClick(data.data.roleId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.roleId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.roleId);
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
              ? "View Role"
              : editingRoleData
              ? "Edit Role"
              : "Create Role"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-6">
                    <div className="FormGroup">
                      <label>Role Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingRoleData?.roleName || roleName}
                        maxLength="50"
                        onChange={(e) =>
                          !viewMode &&
                          (editingRoleData
                            ? setEditingRoleData({
                                ...editingRoleData,
                                roleName: e.target.value,
                              })
                            : setRoleName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {roleNameError && (
                        <p className="errorLabel">{roleNameError}</p>
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
                          inputId="roleUpload"
                        />
                      </div>
                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingRoleData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingRoleData
                              ? setEditingRoleData({
                                  ...editingRoleData,
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
                          {editingRoleData ? "Update" : "Submit"}
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
          <Typography>Manage Role</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-6">
                    <div className="FormGroup">
                      <label>Role Name</label>
                      <select
                        className="form-control select-form"
                        value={searchRoleName}
                        onChange={(e) => setSearchRoleName(e.target.value)}
                      >
                        <option value="">Select Role Name </option>
                        {isActiveData?.map((state) => (
                          <option key={state.roleId} value={state.roleId}>
                            {state.roleName}
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
                    // rows={rows}
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
                  title: "Role Name",
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

export default CreateRole;
