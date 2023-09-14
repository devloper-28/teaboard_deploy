import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  fetchSpu,
  createSpuAction,
  updateSpuAction,
  getSpuByIdAction,
  getSpuByIdActionSuccess,
  getAllAuctionCenterAction,
  searchSpuAction,
  uploadAllDocumentsSpuAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getAllCategoriesAction,
  getAllTeaTypes,
  getAllGrades,
  createEditSpuApiStatus,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Form, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { toast } from "react-toastify";

const data = [
  {
    state: "California",
    stateCode: "CA",
    stateInitial: "C",
    action: "Some action",
  },
  {
    state: "New York",
    stateCode: "NY",
    stateInitial: "NY",
    action: "Another action",
  },
];

function CreateSpuMasterDetail({ open, setOpen }) {
  const getSpuData = useSelector(
    (state) => state?.createSpu?.getAllSpuActionSuccess?.responseData
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [teaTypeId, setteaTypeId] = useState("");
  const [gradeId, setgradeId] = useState("");
  const [spuquantity, setspuquantity] = useState("");
  const [manufacturingPeriod, setmanufacturingPeriod] = useState("");
  const [minLotSize, setminLotSize] = useState("");
  const [factoryAnnualCapacity, setfactoryAnnualCapacity] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");

  const [editingSpuData, setEditingSpuData] = useState(null);
  const [getAllSpu, setGetAllSpu] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [searchauctionCenterId, setsearchauctionCenterId] = useState("");
  const [searchgradeId, setsearchgradeId] = useState("");
  const [searchcategoryId, setsearchcategoryId] = useState("");
  const [searchteaTypeId, setsearchteaTypeId] = useState("");
  const [getSearchSpu, setGetSearchSpu] = useState([]);
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);

  const [isActive, setIsActive] = useState("");
  const [dataById, setDataById] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [teaTypeIdError, setteaTypeIdError] = useState("");
  const [gradeIdError, setgradeIdError] = useState("");
  const [spuquantityError, setspuquantityError] = useState("");
  const [manufacturingPeriodError, setmanufacturingPeriodError] = useState("");
  const [minLotSizeError, setminLotSizeError] = useState("");
  const [factoryAnnualCapacityError, setfactoryAnnualCapacityError] =
    useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [categoryIdError, setcategoryIdError] = useState("");
  const [categoryId, setcategoryId] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setteaTypeIdError("");
    setgradeIdError("");
    setcategoryIdError("");
    setspuquantityError("");
    setmanufacturingPeriodError("");
    setminLotSizeError("");
    setfactoryAnnualCapacityError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;

    if (!teaTypeId) {
      toast.error("Please select a tea type from the dropdown menu.");
      isValid = false;
      return;
    }

    if (!gradeId) {
      toast.error("Please select a grade from the dropdown list.");
      isValid = false;
      return;
    }

    if (!categoryId) {
      toast.error("Please select category");
      isValid = false;
      return;
    }

    if (!spuquantity) {
      toast.error("Please enter the SPU quantity.");
      isValid = false;
      return;
    }

    if (!manufacturingPeriod.trim()) {
      toast.error("Please enter the manufacturing period.");
      isValid = false;
      return;
    }
    if (!minLotSize.trim()) {
      toast.error("Please enter the minimum lot size.");
      isValid = false;
      return;
    }
    if (!factoryAnnualCapacity.trim()) {
      toast.error("Please enter the factory annual capacity.");
      isValid = false;
      return;
    }
    if (!auctionCenterId) {
      toast.error("Please select an auction center name from the list.");
      isValid = false;
      return;
    }

    if (!editingSpuData) {
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
      setUploadDocumentError("");
      setRemarksError("");
    }

    if (!isValid) {
      return;
    }

    const newStateData = {
      teaTypeId: teaTypeId,
      gradeId: gradeId,
      manufacturingPeriod: manufacturingPeriod,
      spuQuantity: spuquantity,
      minLotSize: minLotSize,
      factoryAnnualCapacity: factoryAnnualCapacity,
      auctionCenterId: auctionCenterId,
      downloadDto: uploadedDocuments,
      isActive: 1,
      categoryId: categoryId,
    };
    try {
      if (editingSpuData) {
        const isFormModified =
          teaTypeId !== editingSpuData.teaTypeId ||
          gradeId !== editingSpuData.gradeId ||
          categoryId !== editingSpuData.categoryId ||
          manufacturingPeriod !== editingSpuData.manufacturingPeriod ||
          auctionCenterId !== editingSpuData.auctionCenterId ||
          spuquantity != editingSpuData.spuquantity ||
          minLotSize !== editingSpuData.minLotSize ||
          factoryAnnualCapacity !== editingSpuData.contactPersonAddress ||
          uploadDocumentRemarks !== editingSpuData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingSpuData.downloadDto.length;
        if (isFormModified) {
          editingSpuData.spuQuantity = editingSpuData.spuquantity;
          editingSpuData.searchData = {};
          dispatch(updateSpuAction(editingSpuData));
        } else {
          setExpanded("panel2");
        }
      } else {
        dispatch(createSpuAction(newStateData));
      }
      // handleClear();
      // setEditingSpuData(null);
      // clearSearch();
      // setExpanded("panel2");
    } catch (error) {}
  };

  const handleSearch = () => {
    let searchData = {
      teaTypeId: searchteaTypeId,
      auctionCenterId: searchauctionCenterId,
      gradeId: searchgradeId,
      categoryId: searchcategoryId,
      isActive,
    };
    dispatch(searchSpuAction(searchData));
  };

  const searchSpuData = useSelector(
    (state) => state.createSpu.searchResults.responseData
  );

  console.log("searchSpuData 223", searchSpuData);

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    $("#spuUpload").replaceWith($("#spuUpload").val("").clone(true));
    removeFile();
  };

  const clearSearch = () => {
    setsearchcategoryId("");
    setsearchauctionCenterId("");
    setsearchgradeId("");
    setIsActive("");
    setsearchteaTypeId("");
    dispatch(searchSpuAction({}));
    setRows(getAllSpu);
  };

  const handleViewClick = (spuMasterId) => {
    dispatch(getSpuByIdAction(spuMasterId));
    setViewMode(true);
    setExpanded("panel1");
  };

  const handleEditClick = (spuMasterId) => {
    setViewMode(false);
    dispatch(getSpuByIdAction(spuMasterId));
    setExpanded("panel1");
  };

  const editingSpuDataFromAc = useSelector(
    (state) => state.createSpu.SpuData.responseData
  );

  useEffect(() => {
    if (editingSpuDataFromAc) {
      setEditingSpuData(editingSpuDataFromAc);
      setauctionCenterId(editingSpuDataFromAc.auctionCenterId || "");
      setteaTypeId(editingSpuDataFromAc.teaTypeId || "");
      setgradeId(editingSpuDataFromAc.gradeId || "");
      setmanufacturingPeriod(editingSpuDataFromAc.manufacturingPeriod || "");
      setspuquantity(editingSpuDataFromAc.spuquantity || "");
      setminLotSize(editingSpuDataFromAc.minLotSize || "");
      setfactoryAnnualCapacity(
        editingSpuDataFromAc.factoryAnnualCapacity || ""
      );
      setUploadDocumentRemarks(
        editingSpuDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingSpuDataFromAc.downloadDto || []);
      setcategoryId(editingSpuDataFromAc.categoryId || "");
    } else {
      setEditingSpuData(null);
      // dispatch(fetchSpu());
      dispatch(getAllAuctionCenterAction());
      dispatch(getAllGrades());
      dispatch(getAllTeaTypes());
      dispatch(getAllCategoriesAction());
      resetForm();
    }
  }, [editingSpuDataFromAc]);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter.getAllAuctionCenter.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const getAllGradeResponse = useSelector(
    (state) => state.gradeManage.allGrades.responseData
  );

  const getAllGrade =
    getAllGradeResponse &&
    getAllGradeResponse.filter((data) => 1 == data.isActive);

  const getAllTeaTypeResponse = useSelector(
    (state) => state.teaTypeManage.allTeaTypes.responseData
  );

  const getAllTeaType =
    getAllTeaTypeResponse &&
    getAllTeaTypeResponse.filter((data) => 1 == data.isActive);

  const getAllCategoryResponse = useSelector(
    (state) => state.categoryManage.allCategories.responseData
  );

  const getAllCategory =
    getAllCategoryResponse &&
    getAllCategoryResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getAllSpu || getSearchSpu);

  useEffect(() => {
    if (searchSpuData != null && searchSpuData != undefined) {
      setGetSearchSpu(searchSpuData);
      setRows(searchSpuData);
    } else {
      setGetSearchSpu([]);
      setRows([]);
    }
  }, [searchSpuData]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchTaxMasterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsSpuAction());
      setViewMode(false);
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
      handleClear();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createSpu &&
      state.createSpu.uploadedDocuments &&
      state.createSpu.uploadedDocuments.responseData
  );

  const switchSpuDataFromAc = useSelector(
    (state) => state.createSpu.SpuData.responseData
  );

  useEffect(() => {
    if (switchSpuDataFromAc && handleSwitchClick) {
      let searchData = {
        teaTypeId: searchteaTypeId,
        auctionCenterId: searchauctionCenterId,
        gradeId: searchgradeId,
        categoryId: searchcategoryId,
        isActive,
      };
      const updatedData = {
        ...switchSpuDataFromAc,
        isActive: switchSpuDataFromAc.isActive === 1 ? 0 : 1,
        spuQuantity: switchSpuDataFromAc.spuquantity,
        searchData: searchData,
      };

      dispatch(updateSpuAction(updatedData));

      dispatch(getSpuByIdActionSuccess([]));
      setHandleSwitchClick(false);
    }
  }, [switchSpuDataFromAc]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center",
    },
    {
      name: "teaTypeName",
      title: "Tea type",
    },
    {
      name: "categoryName",
      title: "Category",
    },
    {
      name: "gradeName",
      title: "Grade",
    },
    {
      name: "spuquantity",
      title: "SPU Quantity",
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
      setHandleSwitchClick(true);
      dispatch(getSpuByIdAction(data.data.spuMasterId));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.spuMasterId}`}
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange}
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.spuMasterId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
        </div>
      </>
    );
  }

  function ActionData(data) {
    return (
      <>
        <div class="ActionBtn">
          <i
            className="fa fa-edit"
            onClick={() => handleEditClick(data.data.spuMasterId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.spuMasterId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => handleHistoryViewClick(data.data.spuMasterId)}
          ></i>
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

  const resetForm = () => {
    setauctionCenterId("");
    setteaTypeId("");
    setgradeId("");
    setmanufacturingPeriod("");
    setspuquantity("");
    setminLotSize("");
    setfactoryAnnualCapacity("");
    setteaTypeIdError("");
    setgradeIdError("");
    setcategoryIdError("");
    setspuquantityError("");
    setmanufacturingPeriodError("");
    setminLotSizeError("");
    setfactoryAnnualCapacityError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setauctionCenterId("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setEditingSpuData(null);
    setcategoryId("");
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_SPUMaster";
    const moduleName = "SPUMaster";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
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

  let createData = useSelector(
    (state) => state.createSpu.createEditSpuApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditSpuApiStatus(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
    }
  });

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
              ? "View Spu"
              : editingSpuData
              ? "Edit Spu Master"
              : "Create Spu Master"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center</label>
                      <select
                        className="form-control select-form"
                        value={
                          editingSpuData?.auctionCenterId || auctionCenterId
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                auctionCenterId: e.target.value,
                              })
                            : setauctionCenterId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value={0}>Select Auction Center</option>
                        {getAllAuctionCenter?.map((state) => (
                          <option
                            key={state.auctionCenterId}
                            value={state.auctionCenterId}
                          >
                            {state.auctionCenterName}
                          </option>
                        ))}
                      </select>

                      {auctionCenterIdError && (
                        <p className="errorLabel">{auctionCenterIdError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Type Name</label>
                      <select
                        className="form-control select-form"
                        value={editingSpuData?.teaTypeId || teaTypeId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                teaTypeId: e.target.value,
                              })
                            : setteaTypeId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value={0}>Select Tea Type</option>
                        {getAllTeaType?.map((state) => (
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

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Grade Name</label>
                      <select
                        className="form-control select-form"
                        value={editingSpuData?.gradeId || gradeId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                gradeId: e.target.value,
                              })
                            : setgradeId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value={0}>Select Grade</option>
                        {getAllGrade?.map((state) => (
                          <option key={state.gradeId} value={state.gradeId}>
                            {state.gradeName}
                          </option>
                        ))}
                      </select>

                      {gradeIdError && (
                        <p className="errorLabel">{gradeIdError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Category</label>
                      <select
                        className="form-control select-form"
                        value={editingSpuData?.categoryId || categoryId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                categoryId: e.target.value,
                              })
                            : setcategoryId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value={0}>Search Category</option>
                        {getAllCategory?.map((state) => (
                          <option
                            key={state.categoryId}
                            value={state.categoryId}
                          >
                            {state.categoryName}
                          </option>
                        ))}
                      </select>
                      {categoryIdError && (
                        <p className="errorLabel">{categoryIdError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Manufacturing period</label>
                      <input
                        type="text"
                        maxLength="100"
                        className="form-control"
                        value={
                          editingSpuData?.manufacturingPeriod ||
                          manufacturingPeriod
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                manufacturingPeriod: e.target.value,
                              })
                            : setmanufacturingPeriod(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {manufacturingPeriodError && (
                        <p className="errorLabel">{manufacturingPeriodError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Minimum Lot Size</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingSpuData?.minLotSize || minLotSize}
                        onChange={(e) =>
                          !viewMode &&
                          (editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                minLotSize: e.target.value,
                              })
                            : setminLotSize(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {minLotSizeError && (
                        <p className="errorLabel">{minLotSizeError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Factory Annual Capacity</label>
                      <input
                        type="number"
                        maxLength="2"
                        className="form-control"
                        value={
                          editingSpuData?.factoryAnnualCapacity ||
                          factoryAnnualCapacity
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                factoryAnnualCapacity: e.target.value,
                              })
                            : setfactoryAnnualCapacity(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {factoryAnnualCapacityError && (
                        <p className="errorLabel">
                          {factoryAnnualCapacityError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>SPU Quantity</label>
                      <input
                        type="number"
                        maxLength="3"
                        className="form-control"
                        value={editingSpuData?.spuquantity || spuquantity}
                        onChange={(e) =>
                          editingSpuData
                            ? setEditingSpuData({
                                ...editingSpuData,
                                spuquantity: e.target.value,
                              })
                            : setspuquantity(e.target.value)
                        }
                        disabled={viewMode}
                      />
                      {spuquantityError && (
                        <p className="errorLabel">{spuquantityError}</p>
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
                          inputId="spuUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingSpuData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
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
                        <button className="SubmitBtn" onClick={handleSubmit}>
                          {editingSpuData ? "Update" : "Submit"}
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
          <Typography>Manage Spu Account Detail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center</label>
                      <select
                        className="form-control select-form"
                        value={searchauctionCenterId}
                        onChange={(e) =>
                          setsearchauctionCenterId(e.target.value)
                        }
                      >
                        <option value={0}>Search Auction Center</option>
                        {getAllAuctionCenter?.map((state) => (
                          <option
                            key={state.auctionCenterId}
                            value={state.auctionCenterId}
                          >
                            {state.auctionCenterName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea type</label>
                      <select
                        className="form-control select-form"
                        value={searchteaTypeId}
                        onChange={(e) => setsearchteaTypeId(e.target.value)}
                      >
                        <option value={0}>Search Tea type</option>
                        {getAllTeaType?.map((state) => (
                          <option key={state.teaTypeId} value={state.teaTypeId}>
                            {state.teaTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Grade</label>
                      <select
                        className="form-control select-form"
                        value={searchgradeId}
                        onChange={(e) => setsearchgradeId(e.target.value)}
                      >
                        <option value={0}>Search Grade Name</option>
                        {getAllGrade?.map((state) => (
                          <option key={state.gradeId} value={state.gradeId}>
                            {state.gradeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Category</label>
                      <select
                        className="form-control select-form"
                        value={searchcategoryId}
                        onChange={(e) => setsearchcategoryId(e.target.value)}
                      >
                        <option value={0}>Search Category</option>
                        {getAllCategory?.map((state) => (
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
                  title: "Auction Center Name",
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

export default CreateSpuMasterDetail;
