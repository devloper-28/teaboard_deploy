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
  getAllCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  getCategoryByIdAction,
  searchCategoriesAction,
  uploadAllDocumentsAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditCategoryApiStatus,
  getCategoryByIdSuccess,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { toast } from "react-toastify";

function CreateCategory({ open, setOpen }) {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [editingCategoryData, setEditingCategoryData] = useState(null);

  const [getSearchCategory, setGetCategoryState] = useState([]);
  const [getAllCategory, setGetAllCategory] = useState([]);

  // New state variables for search parameters
  const [searchCategoryName, setSearchCategoryName] = useState("");
  const [searchCategoryCode, setSearchCategoryCode] = useState("");
  const [isActive, setIsActive] = useState("");

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [categoryNameError, setCategoryNameError] = useState("");
  const [categoryCodeError, setCategoryCodeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const getCategoryData = useSelector(
    (state) => state?.categoryManage?.allCategories?.responseData
  );

  // Filter only the data where isActive is 1
  const isActiveData =
    getCategoryData && getCategoryData.filter((data) => 1 == data.isActive);

  const editingCategoryDataFromId = useSelector(
    (state) => state.categoryManage.categoryById.responseData
  );

  // Function to perform the search API call

  const handleSearch = () => {
    let searchData = {
      categoryName: searchCategoryName,
      categoryId: searchCategoryCode,
      isActive,
    };
    dispatch(searchCategoriesAction(searchData));
  };
  const clearSearch = () => {
    setSearchCategoryCode("");
    setSearchCategoryName("");
    setIsActive("");
    dispatch(getAllCategoriesAction());
    dispatch(searchCategoriesAction({}));
    setRows(getCategoryData);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      //To get all data for dropdown
      dispatch(getAllCategoriesAction());
      //Serch API call
      // dispatch(searchCategoriesAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsAction());
      setViewMode(false);
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
      resetForm();
    }
  };

  const searchCategoryData = useSelector(
    (state) => state.categoryManage.searchedCategories.responseData
  );

  const validateForm = () => {
    let isValid = true;

    if (!categoryName.trim()) {
      toast.error("Category Name is required.");
      isValid = false;
      return;
    } else {
      setCategoryNameError("");
    }

    if (!categoryCode) {
      toast.error("Category Code is required.");
      isValid = false;
      return;
    } else {
      setCategoryCodeError("");
    }

    if (!editingCategoryData) {
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

  let createData = useSelector(
    (state) => state.categoryManage.createEditCategoryApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditCategoryApiStatus(false));
      resetForm();
      setExpanded("panel2");
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const categoryData = {
        categoryName: categoryName,
        categoryCode: categoryCode,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
      };
      try {
        if (editingCategoryData) {
          const isFormModified =
            categoryName !== editingCategoryData?.categoryName ||
            categoryCode !== editingCategoryData?.categoryCode ||
            uploadDocumentRemarks !==
              editingCategoryData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingCategoryData?.downloadDto || []).length;
          if (isFormModified) {
            editingCategoryData.serchData = {};
            dispatch(updateCategoryAction(editingCategoryData));
          } else {
          }
        } else {
          dispatch(createCategoryAction(categoryData));
        }
      } catch (e) {}
    }
  };

  const handleEditClick = (categoryId) => {
    dispatch(getCategoryByIdAction(categoryId));
    setExpanded("panel1");
    setViewMode(false);
  };

  useEffect(() => {
    if (
      editingCategoryDataFromId != null &&
      editingCategoryDataFromId != undefined
    ) {
      setEditingCategoryData(editingCategoryDataFromId);
      setCategoryName(editingCategoryDataFromId.categoryName || "");
      setCategoryCode(editingCategoryDataFromId.categoryCode || "");
      setUploadDocumentRemarks(
        editingCategoryDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingCategoryDataFromId.downloadDto || []);
    } else {
      // resetForm();
      // dispatch(getAllCategoriesAction());
    }
  }, [editingCategoryDataFromId]);

  const getAllUploadedDoc = useSelector(
    (state) => state.categoryManage.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllCategory || getSearchCategory);

  useEffect(() => {
    if (getCategoryData) {
      setGetAllCategory(getCategoryData);
      setRows(getCategoryData); // Update rows with the initial data
    }
  }, [getCategoryData]);

  useEffect(() => {
    if (searchCategoryData != null) {
      setGetAllCategory(searchCategoryData);
      setRows(searchCategoryData); // Update rows with the search data
    } else {
      setGetAllCategory([]);
      setRows([]);
    }
  }, [searchCategoryData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "categoryName",
      title: "Category Name",
    },
    {
      name: "categoryCode",
      title: "Category Code",
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

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (categoryId) => {
    dispatch(getCategoryByIdAction(categoryId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        categoryName: searchCategoryName,
        categoryId: searchCategoryCode,
        isActive,
      };
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateCategoryAction(updatedData));
    };
    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.categoryId}`} // Use a unique ID for each switch
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange} // Call the handler on
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.categoryId}`}
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
    const tableName = "tbl_Category";
    const moduleName = "Categoty";
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
            onClick={() => handleEditClick(data.data.categoryId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.categoryId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.categoryId);
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
    setEditingCategoryData(null);
    $("#categoryUpload").replaceWith($("#categoryUpload").val("").clone(true));
    setUploadedDocuments([]);
    setEditingCategoryData(null);
    setCategoryCodeError("");
    setCategoryNameError("");
    setRemarksError("");
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setUploadDocumentError("");
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
              ? "View Category"
              : editingCategoryData
              ? "Edit Category"
              : " Create Category"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-6">
                    <div className="FormGroup">
                      <label>Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="50"
                        // value={categoryName}
                        // onChange={(e) => setCategoryName(e.target.value)}
                        value={
                          editingCategoryData?.categoryName || categoryName
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingCategoryData
                            ? setEditingCategoryData({
                                ...editingCategoryData,
                                categoryName: e.target.value,
                              })
                            : setCategoryName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {categoryNameError && (
                        <p className="errorLabel">{categoryNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="FormGroup">
                      <label>Category Code</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="10"
                        // value={categoryCode}
                        // onChange={(e) => setCategoryCode(e.target.value)}
                        value={
                          editingCategoryData?.categoryCode || categoryCode
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingCategoryData
                            ? setEditingCategoryData({
                                ...editingCategoryData,
                                categoryCode: e.target.value,
                              })
                            : setCategoryCode(e.target.value))
                        }
                        disabled={viewMode}
                      />
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
                          inputId="categoryUpload"
                        />
                      </div>
                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingCategoryData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingCategoryData
                              ? setEditingCategoryData({
                                  ...editingCategoryData,
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
                          {editingCategoryData ? "Update" : "Submit"}
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
          <Typography>Manage Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchCategoryName}
                        onChange={(e) => setSearchCategoryName(e.target.value)}
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
                        {isActiveData?.map((state) => (
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
                  title: "Category Name",
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

export default CreateCategory;
