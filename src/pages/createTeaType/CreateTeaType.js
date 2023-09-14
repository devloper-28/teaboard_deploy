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
  getAllTeaTypes,
  createTeaType,
  updateTeaType,
  getTeaTypeById,
  searchTeaType,
  uploadAllDocumentsTeaTypeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getAllCategoriesAction,
  getTeaTypeByIdSuccess,
  createEditTeaTypeApiStatus,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateTeaType({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [teaTypeName, setTeaTypeName] = useState("");
  const [editingTeaTypeData, setEditingTeatypeData] = useState(null);
  // const [categoryId, setCategoryId] = useState("");

  const [getAllTeaTypeList, setGetAllTeaTypeList] = useState([]);
  const [getSearchTeaType, setGetSearchTeaType] = useState([]);
  // New state variables for search parameters
  const [searchCategoryName, setSearchCategoryName] = useState("");
  const [searchCategoryCode, setSearchCategoryCode] = useState("");
  const [searchTeaTypeName, setSearchTeaTypeName] = useState("");
  const [isActive, setIsActive] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [categoryNameError, setCategoryNameError] = useState("");
  const [categoryCodeError, setCategoryCodeError] = useState("");
  const [teaTypeNameError, setTeaTypeNameError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewMode, setViewMode] = useState(false);

  const getAllTeaType = useSelector(
    (state) => state.teaTypeManage.allTeaTypes.responseData
  );

  const editingTeaTypeDataFromId = useSelector(
    (state) => state.teaTypeManage.teaType.responseData
  );

  // Function to perform the search API call

  const handleSearch = () => {
    let searchData = {
      categoryId: searchCategoryCode,
      teaTypeName: searchTeaTypeName,
      isActive,
    };
    dispatch(searchTeaType(searchData));
  };
  const clearSearch = () => {
    // Clear search parameters and fetch all auction centers
    setSearchCategoryName("");
    setSearchCategoryCode("");
    setSearchTeaTypeName("");
    setIsActive("");
    dispatch(getAllTeaTypes());
    dispatch(searchTeaType({}));
  };

  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, []);

  const searchTeatypeData = useSelector(
    (state) => state.teaTypeManage.searchResults.responseData
  );

  const allActiveCategory = useSelector(
    (state) => state.categoryManage.allCategories.responseData
  );

  const isActiveCategoryData =
    allActiveCategory && allActiveCategory.filter((data) => 1 == data.isActive);

  const validateForm = () => {
    let isValid = true;

    if (!teaTypeName.trim()) {
      toast.error("Tea Type Name is required.");
      isValid = false;
      return;
    } else {
      setTeaTypeNameError("");
    }

    if (!categoryCode) {
      toast.error(" Category Code is required.");
      isValid = false;
      return;
    } else {
      setCategoryCodeError("");
    }

    // Validate Certificate Number
    // if (!categoryName.trim()) {
    //   setCategoryNameError("Category Name is required.");
    //   isValid = false;
    // } else {
    //   setCategoryNameError("");
    // }

    if (!editingTeaTypeData) {
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
      const teaTypeData = {
        categoryId:
          categoryCode != null ? parseInt(categoryCode) : categoryCode,
        teaTypeName: teaTypeName,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
      };
      try {
        if (editingTeaTypeData) {
          const isFormModified =
            categoryName !== editingTeaTypeData?.categoryName ||
            teaTypeName !== editingTeaTypeData?.teaTypeName ||
            categoryCode !== editingTeaTypeData?.categoryCode ||
            uploadDocumentRemarks !==
              editingTeaTypeData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingTeaTypeData?.downloadDto || []).length;

          if (isFormModified) {
            editingTeaTypeData.searchData = {};
            dispatch(updateTeaType(editingTeaTypeData));
          } else {
            // setExpanded("panel2");
          }
        } else {
          dispatch(createTeaType(teaTypeData));
        }
      } catch (error) {}
    }
  };

  // Function to handle edit button click
  const handleEditClick = (teaTypeId) => {
    dispatch(getTeaTypeById(teaTypeId));
    setExpanded("panel1");
  };

  const handleViewClick = (teaTypeId) => {
    dispatch(getTeaTypeById(teaTypeId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  let createData = useSelector(
    (state) => state.teaTypeManage.createEditTeaTypeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditTeaTypeApiStatus(false));
      resetForm();
      setExpanded("panel2");
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      dispatch(searchTeaType({}));
    }
  });

  useEffect(() => {
    if (
      editingTeaTypeDataFromId != null &&
      editingTeaTypeDataFromId != undefined
    ) {
      let tempData = editingTeaTypeDataFromId;
      tempData.categoryCode = editingTeaTypeDataFromId.categoryId;
      setEditingTeatypeData(tempData);

      setTeaTypeName(editingTeaTypeDataFromId.teaTypeName || "");
      setCategoryCode(editingTeaTypeDataFromId.categoryId || "");
      setUploadDocumentRemarks(
        editingTeaTypeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingTeaTypeDataFromId.downloadDto || []);
    } else {
      dispatch(getAllTeaTypes());
    }
  }, [editingTeaTypeDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //To get all data for dropdown
      dispatch(getAllCategoriesAction());
      //Serch API call
      // dispatch(searchTeaType({}));
      clearSearch();
      setViewMode(false);
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      resetForm();
    } else if ("panel3" == panel && !isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsTeaTypeAction());
      setViewMode(false);
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.teaTypeManage.uploadedDocuments.responseData
  );

  useEffect(() => {
    // Fetch uploaded documents when the component mounts
    dispatch(uploadAllDocumentsTeaTypeAction());
  }, [dispatch]);

  const [rows, setRows] = useState(getAllTeaType || getSearchTeaType);

  useEffect(() => {
    if (getSearchTeaType) {
      setGetAllTeaTypeList(getSearchTeaType);
      setRows(getSearchTeaType); // Update rows with the initial data
    }
  }, [getSearchTeaType]);

  useEffect(() => {
    if (searchTeatypeData != null && searchTeatypeData != undefined) {
      setGetSearchTeaType(searchTeatypeData);
      setRows(searchTeatypeData); // Update rows with the search data
    } else {
      setGetSearchTeaType([]);
      setRows([]);
    }
  }, [searchTeatypeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "teaTypeName",
      title: "Tea Type Name",
    },
    {
      name: "categoryCode",
      title: "Category Code",
    },
    {
      name: "categoryName",
      title: "Category Name",
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
        categoryId: searchCategoryCode,
        teaTypeName: searchTeaTypeName,
        isActive,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateTeaType(updatedData));
    };
    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.teaTypeId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.teaTypeId}`}
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
    const tableName = "tbl_TeaType";
    const moduleName = "Tea Type";
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
            onClick={() => handleEditClick(data.data.teaTypeId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.teaTypeId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.teaTypeId);
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
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  const resetForm = () => {
    setCategoryName("");
    setCategoryCode("");
    setTeaTypeName("");
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setRemarksError("");
    $("#teaTypeUpload").replaceWith($("#teaTypeUpload").val("").clone(true));
    setUploadDocumentError("");
    setCategoryCodeError("");
    setCategoryNameError("");
    setTeaTypeNameError("");
    setEditingTeatypeData(null);
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
              ? "View Tea Type"
              : editingTeaTypeData
              ? "Edit Tea Type"
              : "Create Tea Type"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Type Name</label>
                      <input
                        type="text"
                        className="form-control"
                        // value={teaTypeName}
                        // onChange={(e) => setTeaTypeName(e.target.value)}
                        value={editingTeaTypeData?.teaTypeName || teaTypeName}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTeaTypeData
                            ? setEditingTeatypeData({
                                ...editingTeaTypeData,
                                teaTypeName: e.target.value,
                              })
                            : setTeaTypeName(e.target.value))
                        }
                        disabled={viewMode}
                        maxLength="50"
                      />
                      {teaTypeNameError && (
                        <p className="errorLabel">{teaTypeNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Category Code</label>
                      <select
                        className="form-control select-form"
                        value={editingTeaTypeData?.categoryCode || categoryCode}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTeaTypeData
                            ? setEditingTeatypeData({
                                ...editingTeaTypeData,
                                categoryCode: e.target.value,
                              })
                            : setCategoryCode(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value="">Select Category Code</option>
                        {isActiveCategoryData?.map((state) => (
                          <option
                            key={state.categoryId}
                            value={state.categoryId}
                          >
                            {state.categoryCode}
                          </option>
                        ))}
                      </select>
                      {categoryCodeError && (
                        <p className="errorLabel">{categoryCodeError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Category Name</label>
                      <select
                        className="form-control select-form"
                        value={editingTeaTypeData?.categoryCode || categoryCode}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTeaTypeData
                            ? setEditingTeatypeData({
                                ...editingTeaTypeData,
                                categoryCode: e.target.value,
                              })
                            : setCategoryCode(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value="">Select Category Name</option>
                        {isActiveCategoryData?.map((state) => (
                          <option
                            key={state.categoryId}
                            value={state.categoryId}
                          >
                            {state.categoryName}
                          </option>
                        ))}
                      </select>
                      {categoryCodeError && (
                        <p className="errorLabel">{categoryCodeError}</p>
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
                          inputId="teaTypeUpload"
                        />
                      </div>
                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingTeaTypeData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingTeaTypeData
                              ? setEditingTeatypeData({
                                  ...editingTeaTypeData,
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
                          {editingTeaTypeData ? "Update" : "Submit"}
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
          <Typography>Manage Tea Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Type Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchTeaTypeName}
                        onChange={(e) => setSearchTeaTypeName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Category Code</label>
                      <select
                        className="form-control select-form"
                        value={searchCategoryCode}
                        onChange={(e) => setSearchCategoryCode(e.target.value)}
                      >
                        <option value="">Select Category Code</option>
                        {isActiveCategoryData?.map((state) => (
                          <option
                            key={state.categoryId}
                            value={state.categoryId}
                          >
                            {state.categoryCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Category Name</label>
                      <select
                        className="form-control select-form"
                        value={searchCategoryCode}
                        onChange={(e) => setSearchCategoryCode(e.target.value)}
                      >
                        <option value="">Select Category Name</option>
                        {isActiveCategoryData?.map((state) => (
                          <option
                            key={state.categoryId}
                            value={state.categoryId}
                          >
                            {state.categoryName}
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
                  title: "Tea Type Name",
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

export default CreateTeaType;
