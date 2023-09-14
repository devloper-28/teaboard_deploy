import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
//import { fetchGrade } from "../../store/actions"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import {
  getAllAuctionCenterAction,
  getConfigParam,
  createConfigParamAction,
  updateConfigParamAction,
  getConfigParamByIdAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  uploadAllDocumentsConfigParamAction,
  getConfigParamByIdActionSuccess,
  createEditConfigureParameterApiStatus,
} from "../../store/actions";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Modal } from "react-bootstrap";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
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

function CreateConfigureParameter({ open, setOpen }) {
  const getConfigParamData = useSelector(
    (state) => state?.configParam?.getConfigParam?.responseData
  );
  const getAllAuctionCenter = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenter?.responseData
  );

  const dispatch = useDispatch();

  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");

  const [cc, setcc] = useState("");
  const [auctionCenter, setauctionCenter] = useState("");
  const [cp, setcp] = useState("");
  const [bp, setbp] = useState("");
  const [sp, setsp] = useState("");
  const [ib, setib] = useState("");
  const [ccError, setccError] = useState("");
  const [auctionCenterError, setauctionCenterError] = useState("");
  const [cpError, setcpError] = useState("");
  const [bpError, setbpError] = useState("");
  const [spError, setspError] = useState("");
  const [ibError, setibError] = useState("");
  const [editingMode, seteditingMode] = useState(null);
  const navigate = useNavigate();
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showmodal, setShowmodal] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchStateAction({}));

      clearSearch();
      setViewMode(false);
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsConfigParamAction());
      setViewMode(false);
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
      clearSearch();
    }
  };

  useEffect(() => {
    dispatch(getAllAuctionCenterAction());
  }, []);

  const handleSearch = () => {
    setViewMode(false);
    let reqData = {
      auctionCenterId: searchAuctionCenterName,
      isActive,
    };
    dispatch(getConfigParam(reqData));
  };
  const clearSearch = () => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    setSearchAuctionCenterName("");
    setcc("");
    setcp("");
    setbp("");
    setsp("");
    setib("");
    setauctionCenter("");
    dispatch(getConfigParam({}));
    setIsActive("");
    seteditingMode(null);
    $("#configureParameterUpload").replaceWith(
      $("#configureParameterUpload").val("").clone(true)
    );
  };
  const [rows, setRows] = useState(data);

  useEffect(() => {
    if (getConfigParamData != null && getConfigParamData != undefined) {
      setRows(getConfigParamData);
    } else {
      setRows([]);
    }
  }, [getConfigParamData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center Name",
    },
    {
      name: "catalogClosingDay",
      title: "Catalog Closing in Days",
    },
    {
      name: "catalogPublishingDay",
      title: "Catalog Publishing in Days",
    },
    {
      name: "buyersPromptDays",
      title: "Buyer's Prompt in Days",
    },
    {
      name: "sellersPromptDay",
      title: "Seller's Prompt in Days",
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

  const handleSubmit = async (e) => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    e.preventDefault();
    let isValid = true;
    if (!cc) {
      toast.error("Catalog Closing in Days is required.");
      isValid = false;
      return;
    } else {
      setccError("");
    }
    if (!cp) {
      toast.error("Catalog Publishing in Days is required.");
      isValid = false;
      return;
    } else {
      setcpError("");
    }
    if (!bp) {
      toast.error("Buyer's Prompt in Days is required.");
      isValid = false;
      return;
    } else {
      setbpError("");
    }
    if (!sp) {
      toast.error("Seller's Prompt in Days is required.");
      isValid = false;
      return;
    } else {
      setspError("");
    }
    if (!ib) {
      toast.error(
        "Interval between two auction session in minutes is required."
      );
      isValid = false;
      return;
    } else {
      setibError("");
    }
    if (!auctionCenter) {
      toast.error("Auction Center is required.");
      isValid = false;
      return;
    } else {
      setccError("");
    }

    if (cc > cp) {
      toast.error(
        "Catalog Publish Day shoud be greater than catalog Closing Day"
      );
      isValid = false;
      return;
    } else {
      setcpError("");
    }
    if (cp < cc) {
      toast.error("Catalog Closing Day shoud be Less than catalog Publish Day");
      isValid = false;
      return;
    } else {
      setccError("");
    }

    if (!isValid) {
      return;
    }

    const dataForSubmit = {
      auctionCenterId: auctionCenter,
      catalogClosingDay: cc,
      catalogPublishingDay: cp,
      buyersPromptDays: bp,
      sellersPromptDay: sp,
      intervalMin: ib,
      isActive: 1,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
    };
    try {
      if (editingMode) {
        editingMode.searchData = {};
        dispatch(updateConfigParamAction(editingMode));
      } else {
        dispatch(createConfigParamAction(dataForSubmit));
      }
    } catch (error) {
      console.log("Update or create failed");
    }
  };

  const handleEditClick = (configParamId) => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    setcc("");
    setcp("");
    setbp("");
    setsp("");
    setib("");
    setauctionCenter("");
    dispatch(getConfigParamByIdAction(configParamId));
    setViewMode(false);
    setExpanded("panel1");
  };

  const editingConfigParamDataFromState = useSelector(
    (state) => state.configParam.ConfigParamData.responseData
  );

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_ConfigureParameter";
    const moduleName = "Configure Parameter";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const handleCloseHistory = () => setShowmodal(false);
  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

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
  const getAllUploadedDoc = useSelector(
    (state) => state.configParam.uploadedDocuments.responseData
  );

  const setValueWithPatterns = (data, val) => {
    if (data != null && data != "") {
      if (data.toString().match(/^[0-9]*$/)) {
        let number = parseInt(data);
        if (number >= 0 && number < 99.9999999) {
          if (val === "cc") {
            setcc(data);
            setccError("");
          } else if (val === "cp") {
            setcp(data);
            setcpError("");
          } else if (val === "bp") {
            setbp(data);
            setbpError("");
          } else if (val === "sp") {
            setsp(data);
            setspError("");
          } else if (val === "ib") {
            if (number < 60) {
              setib(data);
              setibError("");
            } else {
              setibError(
                "Minimum value should be 1 minutes and maximum value should be 60 minutes can be configured in respective auction center."
              );
            }
          }
        }
      } else {
        if (val === "cc") {
          setccError(
            "only numeric positive value and maximum 2-digit value allowed"
          );
        } else if (val === "cp") {
          setcpError(
            "only numeric positive value and maximum 2-digit value allowed"
          );
        } else if (val === "bp") {
          setbpError(
            "only numeric positive value and maximum 2-digit value allowed"
          );
        } else if (val === "sp") {
          setspError(
            "only numeric positive value and maximum 2-digit value allowed"
          );
        } else if (val === "ib") {
          setibError(
            "only numeric positive value and maximum 2-digit value allowed"
          );
        }
      }
    } else {
      if (val === "cc") {
        setcc(data);
      } else if (val === "cp") {
        setcp(data);
      } else if (val === "bp") {
        setbp(data);
      } else if (val === "sp") {
        setsp(data);
      } else if (val === "ib") {
        setib(data);
      }
    }
  };

  useEffect(() => {
    if (editingConfigParamDataFromState) {
      setcc(editingConfigParamDataFromState.catalogClosingDay || "");
      setbp(editingConfigParamDataFromState.buyersPromptDays || "");
      setcp(editingConfigParamDataFromState.catalogPublishingDay || "");
      setib(editingConfigParamDataFromState.intervalMin || "");
      setsp(editingConfigParamDataFromState.sellersPromptDay || "");
      setauctionCenter(editingConfigParamDataFromState.auctionCenterId || "");
      setUploadDocumentRemarks(
        editingConfigParamDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingConfigParamDataFromState.downloadDto || []);
      seteditingMode(editingConfigParamDataFromState);
    }
  }, [editingConfigParamDataFromState]);

  const [viewMode, setViewMode] = useState(false);
  const handleViewClick = (configParamId) => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    setcc("");
    setcp("");
    setbp("");
    setsp("");
    setib("");
    setauctionCenter("");
    dispatch(getConfigParamByIdAction(configParamId));
    setViewMode(true);
    setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };

  function ActionData(data) {
    return (
      <>
        <div class="ActionBtn">
          <i
            className="fa fa-edit"
            onClick={() => handleEditClick(data.data.configParaId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.configParaId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() => handleHistoryViewClick(data.data.configParaId)}
          ></i>
        </div>
      </>
    );
  }

  function StatusData(data) {
    const handleSwitchChange = () => {
      // Toggle isActive value when the switch is changed
      let searchData = {
        auctionCenterId: searchAuctionCenterName,
        isActive,
      };
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };
      // Call the API to update the isActive status in the backend
      dispatch(updateConfigParamAction(updatedData));
    };
    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.configParaId}`}
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange}
            />
            <label
              class="custom-control-label"
              for={`customSwitch${data.data.configParaId}`}
            >
              {data.data.isActive === 1 ? "Active" : "Inactive"}
            </label>
          </div>
        </div>
      </>
    );
  }

  let createData = useSelector(
    (state) => state.configParam.createEditConfigureParameterApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditConfigureParameterApiStatus(false));
      setExpanded("panel2");
      clearSearch();
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
    }
  });

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
  };
  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
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
              ? "View Configure Parameter"
              : editingMode
              ? "Edit Configure Parameter "
              : "Create Configure Parameter"}
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
                        value={editingMode?.auctionCenterId || auctionCenter}
                        onChange={(e) =>
                          editingMode
                            ? seteditingMode({
                                ...editingMode,
                                auctionCenterId: e.target.value,
                              })
                            : setauctionCenter(e.target.value)
                        }
                        disabled={viewMode}
                      >
                        <option value={0}>Search Auction Center</option>
                        {getAllAuctionCenter?.map((state) => (
                          <option
                            key={state.auctionCenterName}
                            value={state.auctionCenterId}
                          >
                            {state.auctionCenterName}
                          </option>
                        ))}
                      </select>

                      {auctionCenterError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {auctionCenterError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Catalog Closing in Days</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingMode?.catalogClosingDay || cc}
                        onChange={(e) =>
                          editingMode
                            ? seteditingMode({
                                ...editingMode,
                                catalogClosingDay: e.target.value,
                              })
                            : setValueWithPatterns(e.target.value, "cc")
                        }
                        disabled={viewMode}
                      />
                      {ccError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {ccError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Catalog Publishing in Days</label>
                      <input
                        type="number"
                        maxLength="2"
                        className="form-control"
                        value={editingMode?.catalogPublishingDay || cp}
                        onChange={(e) =>
                          editingMode
                            ? seteditingMode({
                                ...editingMode,
                                catalogPublishingDay: e.target.value,
                              })
                            : setValueWithPatterns(e.target.value, "cp")
                        }
                        disabled={viewMode}
                      />
                      {cpError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {cpError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Buyer's Prompt in Days</label>
                      <input
                        type="number"
                        maxLength="2"
                        className="form-control"
                        value={editingMode?.buyersPromptDays || bp}
                        onChange={(e) =>
                          editingMode
                            ? seteditingMode({
                                ...editingMode,
                                buyersPromptDays: e.target.value,
                              })
                            : setValueWithPatterns(e.target.value, "bp")
                        }
                        disabled={viewMode}
                      />
                      {bpError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {bpError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Seller's Prompt in Days</label>
                      <input
                        type="number"
                        maxLength="2"
                        className="form-control"
                        value={editingMode?.sellersPromptDay || sp}
                        onChange={(e) =>
                          editingMode
                            ? seteditingMode({
                                ...editingMode,
                                sellersPromptDay: e.target.value,
                              })
                            : setValueWithPatterns(e.target.value, "sp")
                        }
                        disabled={viewMode}
                      />
                      {spError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {spError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>
                        Interval between two auction session in minutes
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingMode?.intervalMin || ib}
                        onChange={(e) =>
                          editingMode
                            ? seteditingMode({
                                ...editingMode,
                                intervalMin: e.target.value,
                              })
                            : setValueWithPatterns(e.target.value, "ib")
                        }
                        disabled={viewMode}
                      />
                      {ibError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {ibError}
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
                          inputId="configureParameterUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingMode?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingMode
                              ? seteditingMode({
                                  ...editingMode,
                                  uploadDocumentRemarks: e.target.value,
                                })
                              : setUploadDocumentRemarks(e.target.value)
                          }
                          disabled={viewMode}
                        ></textarea>
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
                          {viewMode
                            ? "Submit "
                            : editingMode
                            ? "Update"
                            : "Submit"}
                        </button>
                        <button
                          className="Clear"
                          onClick={clearSearch}
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
          <Typography>Manage Configure Parameter</Typography>
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
                        value={searchAuctionCenterName}
                        onChange={(e) =>
                          setSearchAuctionCenterName(e.target.value)
                        }
                      >
                        <option value={0}>Search Auction Center</option>
                        {getAllAuctionCenter?.map((state) => (
                          <option
                            key={state.auctionCenterName}
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
                      <button
                        className="SubmitBtn"
                        onClick={() => handleSearch()}
                      >
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
                rows?.length > 0
                  ? getHistoryIdData?.length > 0
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

export default CreateConfigureParameter;
