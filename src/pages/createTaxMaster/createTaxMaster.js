import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { Card, Modal } from "react-bootstrap";
import $ from "jquery";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  getTaxMasterByIdAction,
  createTaxMasterAction,
  updateTaxMasterAction,
  searchTaxMasterAction,
  getAllAuctionCenterAction,
  getTaxMasterByIdActionSuccess,
  uploadAllDocumentsTaxMasterAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditTaxMasterApiStatus,
  searchChargeAction,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

function CreateTaxMaster({ open, setOpen }) {
  const getAllTaxMasterData = useSelector(
    (state) => state.createTaxMaster.getAllTaxMasterActionSuccess.responseData
  );

  const isActiveData =
    getAllTaxMasterData &&
    getAllTaxMasterData.filter((data) => 1 == data.isActive);

  const dispatch = useDispatch();
  const [chargeName, setchargeName] = useState("");
  const [chargeCode, setchargeCode] = useState("");
  const [hsnSac, sethsnSac] = useState("");
  const [description, setdescription] = useState("");
  const [auctionCenterName, setauctionCenterName] = useState("");
  const [sgst, setsgst] = useState("");
  const [igst, setigst] = useState("");
  const [cgst, setcgst] = useState("");
  const [effectiveFromDate, seteffectiveFromDate] = useState("");
  const [effectiveEndDate, seteffectiveEndDate] = useState("");
  const [chargeCodeId, setchargeCodeId] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [editingTaxData, setEditingTaxData] = useState(null);
  const [getAllTaxMaster, setGetAllTaxMaster] = useState([]);
  const [getSearchTaxMaster, setGetSearchTaxMaster] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [auctionCenterNameError, setauctionCenterNameError] = useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [chargeNameError, setchargeNameError] = useState("");
  const [chargeCodeError, setchargeCodeError] = useState("");
  const [chargeCodeIdError, setchargeCodeIdError] = useState("");
  const [hsnSacError, sethsnSacError] = useState("");
  const [descriptionError, setdescriptionError] = useState("");
  const [sgstError, setsgstError] = useState("");
  const [igstError, setigstError] = useState("");
  const [cgstError, setcgstError] = useState("");
  const [effectiveFromDateError, seteffectiveFromDateError] = useState("");
  const [effectiveEndDateError, seteffectiveEndDateError] = useState("");

  const [searchchargeCode, setsearchchargeCode] = useState("");
  const [searchchargeName, setsearchchargeName] = useState("");
  const [searchhsnSac, setsearchhsnSac] = useState("");

  const [searchauctionCenterName, setsearchauctionCenterName] = useState("");

  const [isActive, setIsActive] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filterChargeData, setFilterChargeData] = useState([]);

  //const [submitSuccess, setSubmitSuccess] = useState(false);

  const [dataById, setDataById] = useState("");

  const [handleSwitchClick, setHandleSwitchClick] = useState(false);

  // const handleDateChange = (date) => {
  //   const today = dayjs();
  //   const selectedDate = dayjs(date);

  //   if (selectedDate.isBefore(today, "day")) {
  //   } else {
  //     setSelectedDate(date);
  //   }
  // };

  const handleChargeCodeChange = (e) => {
    setchargeName(e.target.options[e.target.selectedIndex].id);
    setchargeCodeId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setchargeNameError("");
    setchargeCodeError("");
    setchargeCodeIdError("");
    sethsnSacError("");
    setdescriptionError("");
    setsgstError("");
    setigstError("");
    setcgstError("");
    seteffectiveFromDateError("");
    seteffectiveEndDateError("");
    setauctionCenterNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;
    if (!auctionCenterId) {
      toast.error("Please enter the auction Center Name.");
      isValid = false;
      return;
    }

    if (!chargeName.trim()) {
      toast.error("Charge Name is required.");
      isValid = false;
      return;
    }

    if (!chargeCodeId) {
      toast.error("Please select a charge code from the dropdown menu.");
      isValid = false;
      return;
    }

    if (!hsnSac.trim()) {
      toast.error("Please enter the HSN/SAC code.");
      isValid = false;
      return;
    }

    if (!description.trim()) {
      toast.error(
        "Please enter a description.The description should not exceed 100 characters"
      );
      isValid = false;
      return;
    }
    if (!sgst.trim()) {
      toast.error("Please enter the SGST value.");
      isValid = false;
      return;
    }
    if (!cgst.trim()) {
      toast.error("Please enter the CGST value.");
      isValid = false;
      return;
    }
    if (!igst.trim()) {
      toast.error("Please enter the IGST value.");
      isValid = false;
      return;
    }

    if (!effectiveFromDate) {
      toast.error("Please enter the effective from date.");
      isValid = false;
      return;
    }
    if (!effectiveEndDate) {
      toast.error("Please enter the effective end date.");
      isValid = false;
      return;
    }

    if (!editingTaxData) {
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
      chargeName: chargeName,
      //chargeCode: chargeCode,
      hsnSac: hsnSac,
      description: description,
      //auctionCenterName: auctionCenterName,
      sgst: sgst,
      igst: igst,
      cgst: cgst,
      chargeCodeId: chargeCodeId,
      effectiveFromDate: effectiveFromDate,
      effectiveEndDate: effectiveEndDate,
      auctionCenterId: auctionCenterId,
      chargeMasterId: chargeCodeId,
      isActive: 1,
    };
    try {
      if (editingTaxData) {
        const isFormModified =
          chargeCodeId !== editingTaxData.chargeCodeId ||
          chargeCode !== editingTaxData.chargeCode ||
          chargeName !== editingTaxData.chargeName ||
          hsnSac !== editingTaxData.hsnSac ||
          auctionCenterName !== editingTaxData.auctionCenterName ||
          auctionCenterId !== editingTaxData.auctionCenterId ||
          description !== editingTaxData.description ||
          sgst !== editingTaxData.sgst ||
          cgst !== editingTaxData.cgst ||
          igst !== editingTaxData.email ||
          effectiveFromDate !== editingTaxData.effectiveFromDate ||
          effectiveEndDate !== editingTaxData.effectiveEndDate ||
          uploadDocumentRemarks !== editingTaxData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingTaxData.downloadDto.length;

        if (isFormModified) {
          editingTaxData.searchData = {};
          editingTaxData.chargeMasterId = editingTaxData.chargeCodeId;
          dispatch(updateTaxMasterAction(editingTaxData));
        } else {
          setExpanded("panel2");
        }
      } else {
        dispatch(createTaxMasterAction(newStateData));
      }
    } catch (error) {}
  };

  const handleSearch = () => {
    let searchData = {
      auctionCenterId: searchauctionCenterName,
      chargeCodeId: searchchargeCode,
      chargeName: searchchargeName,
      hsnSac: searchhsnSac,
      isActive,
    };
    dispatch(searchTaxMasterAction(searchData));
  };

  const searchTaxMasterData = useSelector(
    (state) => state.createTaxMaster.searchResults.responseData
  );

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    $("#taxMasterUpload").replaceWith(
      $("#taxMasterUpload").val("").clone(true)
    );
    removeFile();
  };

  const clearSearch = () => {
    setsearchauctionCenterName("");
    setsearchchargeCode("");
    setsearchchargeName("");
    setsearchhsnSac("");
    setIsActive("");
    dispatch(searchTaxMasterAction({}));
  };

  const handleViewClick = (taxMasterId) => {
    dispatch(getTaxMasterByIdAction(taxMasterId));
    setViewMode(true);
    setExpanded("panel1");
  };

  const handleEditClick = (taxMasterId) => {
    dispatch(getTaxMasterByIdAction(taxMasterId));
    setExpanded("panel1");
  };

  const editingTaxDataFromAc = useSelector(
    (state) => state.createTaxMaster.TaxMasterData.responseData
  );

  useEffect(() => {
    if (editingTaxDataFromAc && !handleSwitchClick) {
      editingTaxDataFromAc.chargeCodeId = editingTaxDataFromAc.chargeMasterId;
      setEditingTaxData(editingTaxDataFromAc);
      setauctionCenterName(editingTaxDataFromAc.auctionCenterName || "");
      setauctionCenterId(editingTaxDataFromAc.auctionCenterId || "");
      setchargeCodeId(editingTaxDataFromAc.chargeMasterId || "");
      setchargeName(editingTaxDataFromAc.chargeName || "");
      sethsnSac(editingTaxDataFromAc.hsnSac || "");
      setdescription(editingTaxDataFromAc.description || "");
      setsgst(editingTaxDataFromAc.sgst || "");
      setcgst(editingTaxDataFromAc.cgst || "");
      setigst(editingTaxDataFromAc.igst || "");
      seteffectiveFromDate(
        moment(editingTaxDataFromAc.effectiveFromDate).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      seteffectiveEndDate(
        moment(editingTaxDataFromAc.effectiveEndDate).format("YYYY-MM-DDTHH:mm")
      );

      setUploadDocumentRemarks(
        editingTaxDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingTaxDataFromAc.downloadDto || []);
    } else {
      dispatch(getAllAuctionCenterAction());
      dispatch(searchChargeAction({}));
    }
  }, [editingTaxDataFromAc]);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter.getAllAuctionCenter.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getAllTaxMaster || getSearchTaxMaster);
  // useEffect(() => {
  //   if (getAllTaxMasterData) setGetAllTaxMaster(getAllTaxMasterData);
  //   setRows(getAllTaxMasterData);
  // }, [getAllTaxMasterData]);

  useEffect(() => {
    if (searchTaxMasterData != null && searchTaxMasterData != undefined) {
      setGetSearchTaxMaster(searchTaxMasterData);
      setRows(searchTaxMasterData);
    } else {
      setGetSearchTaxMaster([]);
      setRows([]);
    }
  }, [searchTaxMasterData]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchTaxMasterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsTaxMasterAction());
      setViewMode(false);
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
      handleClear();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createTaxMaster &&
      state.createTaxMaster.uploadedDocuments &&
      state.createTaxMaster.uploadedDocuments.responseData
  );

  const switchTaxDataFromAc = useSelector(
    (state) => state.createTaxMaster.TaxMasterData.responseData
  );

  useEffect(() => {
    if (switchTaxDataFromAc && handleSwitchClick) {
      let searchData = {
        auctionCenterId: searchauctionCenterName,
        chargeCodeId: searchchargeCode,
        chargeName: searchchargeName,
        hsnSac: searchhsnSac,
        isActive,
      };
      const updatedData = {
        ...switchTaxDataFromAc,
        isActive: switchTaxDataFromAc.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };

      dispatch(updateTaxMasterAction(updatedData));
      dispatch(getTaxMasterByIdActionSuccess([]));
      setHandleSwitchClick(false);
    }
  }, [switchTaxDataFromAc]);

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
      name: "chargeName",
      title: "Charge Name",
    },
    {
      name: "chargeCode",
      title: "Charge Code",
    },
    {
      name: "hsnSac",
      title: "HSN/SAC Code",
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
      dispatch(getTaxMasterByIdAction(data.data.taxMasterId));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.taxMasterId}`}
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange}
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.taxMasterId}`}
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
            onClick={() => handleEditClick(data.data.taxMasterId)}
          ></i>
          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.taxMasterId)}
          ></i>
          <i
            className="fa fa-history"
            onClick={() => {
              setShowmodal(true);
            }}
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
    setchargeName("");
    setchargeCode("");
    sethsnSac("");
    setdescription("");
    setauctionCenterName("");
    setsgst("");
    setigst("");
    setcgst("");
    seteffectiveFromDate("");
    seteffectiveEndDate("");
    setauctionCenterId("");
    setchargeCodeId("");
    setchargeCodeIdError("");
    setRemarksError("");
    setUploadDocumentError("");
    setchargeNameError("");
    setchargeCodeError("");
    sethsnSacError("");
    setdescriptionError("");
    setsgstError("");
    setigstError("");
    setcgstError("");
    seteffectiveFromDateError("");
    seteffectiveEndDateError("");
    setauctionCenterNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setEditingTaxData(null);
  };

  function formatFromDateTime(dateTimeString) {
    seteffectiveFromDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
  }
  function formatEndDateTime(dateTimeString) {
    seteffectiveEndDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
  }
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_taxMaster";
    const moduleName = "TaxMaster";
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

  const setValueData = (data, editingTaxData) => {
    setEditingTaxData({
      ...editingTaxData,
      chargeCodeId: data.target.value,
      chargeName: data.target.options[data.target.selectedIndex].id,
    });
  };

  const searchChargeData = useSelector(
    (state) => state.CreateChargeMaster.searchResults.responseData
  );

  const isActiveSearchChargeData =
    searchChargeData && searchChargeData?.filter((data) => 1 == data.isActive);

  let createData = useSelector(
    (state) => state.createTaxMaster.createEditTaxMasterApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditTaxMasterApiStatus(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
    }
  });

  const handleAuctionCenter = (value, isEdit) => {
    if (!isEdit) {
      setauctionCenterId(value);
      setchargeCodeId("");
      setchargeName("");
    } else {
      setEditingTaxData({
        ...editingTaxData,
        auctionCenterId: value,
        chargeCodeId: "",
        chargeName: "",
      });
    }

    if (value != null && value != "" && value != undefined) {
      let tempData = [];
      let data =
        isActiveSearchChargeData &&
        isActiveSearchChargeData.filter((data) => {
          if (value == data.auctionCenterId) {
            tempData.push(data);
          }
        });
      setFilterChargeData(tempData);
    } else {
      setFilterChargeData([]);
    }
  };

  return (
    <>
      {console.log("editingTaxData 678", editingTaxData)}
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
              ? "View Tax Master"
              : editingTaxData
              ? "Edit Tax Master"
              : "Create Tax Master"}
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
                          editingTaxData?.auctionCenterId || auctionCenterId
                        }
                        disabled={viewMode}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaxData
                            ? handleAuctionCenter(e.target.value, true)
                            : handleAuctionCenter(e.target.value, false))
                        }
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
                      <label>Charge Code</label>
                      <select
                        className="form-control select-form"
                        value={editingTaxData?.chargeCodeId || chargeCodeId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaxData
                            ? setValueData(e, editingTaxData)
                            : handleChargeCodeChange(e))
                        }
                        disabled={
                          (editingTaxData?.auctionCenterId ||
                            auctionCenterId != null) &&
                          (editingTaxData?.auctionCenterId ||
                            auctionCenterId != "") &&
                          (editingTaxData?.auctionCenterId ||
                            auctionCenterId != undefined) &&
                          !viewMode
                            ? false
                            : true
                        }
                      >
                        <option value={0}>Select Charge Code</option>
                        {filterChargeData &&
                          filterChargeData.map((state) => (
                            <option
                              key={state.chargeMasterId}
                              value={state.chargeMasterId}
                              id={state.chargesName}
                            >
                              {state.chargeCode}
                            </option>
                          ))}
                      </select>

                      {chargeCodeIdError && (
                        <p className="errorLabel">{chargeCodeIdError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingTaxData?.chargeName || chargeName}
                        disabled={true}
                      />
                      {chargeNameError && (
                        <p className="errorLabel">{chargeNameError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>HSN/SAC</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingTaxData?.hsnSac || hsnSac}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaxData
                            ? setEditingTaxData({
                                ...editingTaxData,
                                hsnSac: e.target.value,
                              })
                            : sethsnSac(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {hsnSacError && (
                        <p className="errorLabel">{hsnSacError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingTaxData?.description || description}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaxData
                            ? setEditingTaxData({
                                ...editingTaxData,
                                description: e.target.value,
                              })
                            : setdescription(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {descriptionError && (
                        <p className="errorLabel">{descriptionError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>SGST</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingTaxData?.sgst || sgst}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaxData
                            ? setEditingTaxData({
                                ...editingTaxData,
                                sgst: e.target.value,
                              })
                            : setsgst(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {sgstError && <p className="errorLabel">{sgstError}</p>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>CGST</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingTaxData?.cgst || cgst}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaxData
                            ? setEditingTaxData({
                                ...editingTaxData,
                                cgst: e.target.value,
                              })
                            : setcgst(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {cgstError && <p className="errorLabel">{cgstError}</p>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>IGST</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingTaxData?.igst || igst}
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaxData
                            ? setEditingTaxData({
                                ...editingTaxData,
                                igst: e.target.value,
                              })
                            : setigst(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {igstError && <p className="errorLabel">{igstError}</p>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Effective from Date</label>
                      <input
                        type="datetime-local"
                        name="effectiveFromDate"
                        class="form-control"
                        onChange={(e) => formatFromDateTime(e.target.value)}
                        value={effectiveFromDate}
                        disabled={viewMode}
                      />

                      {effectiveFromDateError && (
                        <p className="errorLabel">{effectiveFromDateError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Effective End Date</label>
                      <input
                        type="datetime-local"
                        name="effectiveEndDate"
                        class="form-control"
                        onChange={(e) => formatEndDateTime(e.target.value)}
                        value={effectiveEndDate}
                        disabled={viewMode}
                      />

                      {effectiveEndDateError && (
                        <p className="errorLabel">{effectiveEndDateError}</p>
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
                          inputId="taxMasterUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingTaxData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingTaxData
                              ? setEditingTaxData({
                                  ...editingTaxData,
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
                          {editingTaxData ? "Update" : "Submit"}
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
          <Typography>Manage Tax Master</Typography>
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
                        value={searchauctionCenterName}
                        onChange={(e) =>
                          setsearchauctionCenterName(e.target.value)
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
                      <label>Charge Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchchargeName}
                        onChange={(e) => setsearchchargeName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Charge Code</label>
                      <select
                        className="form-control select-form"
                        value={searchchargeCode}
                        onChange={(e) => setsearchchargeCode(e.target.value)}
                      >
                        <option value={0}>Search Charge Code</option>
                        {isActiveSearchChargeData?.map((state) => (
                          <option
                            key={state.chargeCodeId}
                            value={state.chargeCodeId}
                          >
                            {state.chargeCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>HSN/SAC Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchhsnSac}
                        onChange={(e) => setsearchhsnSac(e.target.value)}
                      />
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

export default CreateTaxMaster;
