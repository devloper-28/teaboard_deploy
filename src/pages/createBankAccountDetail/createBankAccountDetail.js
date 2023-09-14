import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  fetchBankAc,
  createBankAcAction,
  updateBankAcAction,
  getBankAcByIdAction,
  getBankAcByIdActionSuccess,
  getAllAuctionCenterAction,
  searchBankAcAction,
  uploadAllDocumentsBankAcAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditBankAcDetailsApiStatus,
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

function CreateBankAccountDetail({ open, setOpen }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [bankAccountNumber, setbankAccountNumber] = useState("");
  const [bankName, setbankName] = useState("");
  const [branchAddress, setbranchAddress] = useState("");
  const [ifscCode, setifscCode] = useState("");
  const [auctionCenterName, setauctionCenterName] = useState("");
  const [beneficiaryName, setbeneficiaryName] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [email, setemail] = useState("");
  const [contactNumber, setcontactNumber] = useState("");
  const [contactPersonAddress, setcontactPersonAddress] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [editingBankData, setEditingBankData] = useState(null);
  const [getAllBankAc, setGetAllBankAc] = useState([]);
  const [getSearchBank, setGetSearchBank] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [searchbankName, setsearchbankName] = useState("");
  const [searchauctionCenterName, setsearchauctionCenterName] = useState("");
  const [searchbankAccountNumber, setsearchbankAccountNumber] = useState("");
  const [searchifscCode, setsearchifscCode] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);

  const [isActive, setIsActive] = useState("");

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [dataById, setDataById] = useState("");

  const [handleSwitchClick, setHandleSwitchClick] = useState(false);

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [bankAccountNumberError, setbankAccountNumberError] = useState("");
  const [bankNameError, setbankNameError] = useState("");
  const [branchAddressError, setbranchAddressError] = useState("");
  const [ifscCodeError, setifscCodeError] = useState("");
  const [beneficiaryNameError, setbeneficiaryNameError] = useState("");
  const [contactPersonError, setcontactPersonError] = useState("");
  const [emailError, setemailError] = useState("");
  const [contactNumberError, setcontactNumberError] = useState("");
  const [auctionCenterNameError, setauctionCenterNameError] = useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [contactPersonAddressError, setcontactPersonAddressError] =
    useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getBankAcData = useSelector(
    (state) => state.createBankAcDetail.getAllBankAcActionSuccess.responseData
  );

  const isActiveData =
    getBankAcData && getBankAcData.filter((data) => 1 == data.isActive);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbankAccountNumberError("");
    setbankNameError("");
    setbranchAddressError("");
    setifscCodeError("");
    setbeneficiaryNameError("");
    setcontactPersonError("");
    setemailError("");
    setcontactNumberError("");
    setauctionCenterNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setcontactPersonAddressError("");

    let isValid = true;

    if (!bankAccountNumber) {
      toast.error("Please enter the bank account number.");
      isValid = false;
      return;
    }

    if (!bankName.trim()) {
      toast.error("Please enter the bank account name.");
      isValid = false;
      return;
    }

    if (!branchAddress.trim()) {
      toast.error("Please enter the branch address.");
      isValid = false;
      return;
    }

    if (!ifscCode.trim()) {
      toast.error("Please enter the IFSC code.");
      isValid = false;
      return;
    }
    if (!beneficiaryName.trim()) {
      toast.error("Please enter the beneficiary name.");
      isValid = false;
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter the email ID.");
      isValid = false;
      return;
    }
    if (!contactNumber) {
      toast.error("Please enter the contact number.");
      isValid = false;
      return;
    }
    if (!auctionCenterId) {
      toast.error("Please select an auction center from the dropdown menu.");
      isValid = false;
      return;
    }
    if (!contactPerson.trim()) {
      toast.error("Please enter the contact person.");
      isValid = false;
      return;
    }
    if (!contactPersonAddress.trim()) {
      toast.error("Please enter the contact person address.");
      isValid = false;
      return;
    }

    if (!editingBankData) {
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
      bankAccountNumber: bankAccountNumber && parseInt(bankAccountNumber),
      bankName: bankName,
      branchAddress: branchAddress,
      ifscCode: ifscCode,
      auctionCenterName: auctionCenterName,
      beneficiaryName: beneficiaryName,
      contactPerson: contactPerson,
      email: email,
      contactNumber: contactNumber && parseInt(contactNumber),
      contactPersonAddress: contactPersonAddress,
      auctionCenterId: auctionCenterId,
      downloadDto: uploadedDocuments,
      isActive: 1,
    };

    try {
      if (editingBankData) {
        const isFormModified =
          bankName !== editingBankData.bankName ||
          bankAccountNumber !== editingBankData.bankAccountNumber ||
          ifscCode !== editingBankData.ifscCode ||
          auctionCenterName !== editingBankData.auctionCenterName ||
          auctionCenterId !== editingBankData.auctionCenterId ||
          beneficiaryName !== editingBankData.beneficiaryName ||
          contactPerson !== editingBankData.contactPerson ||
          contactPersonAddress !== editingBankData.contactPersonAddress ||
          email !== editingBankData.email ||
          parseInt(contactNumber) !== parseInt(editingBankData.contactNumber) ||
          uploadDocumentRemarks !== editingBankData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingBankData.downloadDto.length;

        if (isFormModified) {
          editingBankData.bankAccountNumber =
            editingBankData.bankAccountNumber &&
            parseInt(editingBankData.bankAccountNumber);
          editingBankData.searchData = {};
          dispatch(updateBankAcAction(editingBankData));
        } else {
          setExpanded("panel2");
        }
      } else {
        dispatch(createBankAcAction(newStateData));
      }
    } catch (error) {}
  };

  const handleSearch = () => {
    let searchData = {
      bankAccountDetailId: searchbankName,
      auctionCenterId: searchauctionCenterName,
      bankAccountNumber: searchbankAccountNumber,
      ifscCode: searchifscCode,
      isActive,
    };
    dispatch(searchBankAcAction(searchData));
  };

  const searchBankData = useSelector(
    (state) => state.createBankAcDetail.searchResults.responseData
  );
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    $("#bankAccountUpload").replaceWith(
      $("#bankAccountUpload").val("").clone(true)
    );
    removeFile();
  };

  const clearSearch = () => {
    setsearchbankName("");
    setsearchauctionCenterName("");
    setsearchbankAccountNumber("");
    setIsActive("");
    setsearchauctionCenterName("");
    setsearchifscCode("");
    dispatch(fetchBankAc());
    dispatch(searchBankAcAction({}));
  };

  const handleViewClick = (bankAccountDetailId) => {
    dispatch(getBankAcByIdAction(bankAccountDetailId));
    setViewMode(true);
    setExpanded("panel1");
  };

  const handleEditClick = (bankAccountDetailId) => {
    setViewMode(false);
    dispatch(getBankAcByIdAction(bankAccountDetailId));
    setExpanded("panel1");
  };
  const editingBankDataFromAc = useSelector(
    (state) => state.createBankAcDetail.BankAcData.responseData
  );

  useEffect(() => {
    if (editingBankDataFromAc) {
      setEditingBankData(editingBankDataFromAc);
      setauctionCenterName(editingBankDataFromAc.auctionCenterName || "");
      setauctionCenterId(editingBankDataFromAc.auctionCenterId || "");
      setbankAccountNumber(editingBankDataFromAc.bankAccountNumber || "");
      setbankName(editingBankDataFromAc.bankName || "");
      setbranchAddress(editingBankDataFromAc.branchAddress || "");
      setifscCode(editingBankDataFromAc.ifscCode || "");
      setbeneficiaryName(editingBankDataFromAc.beneficiaryName || "");
      setcontactPerson(editingBankDataFromAc.contactPerson || "");
      setemail(editingBankDataFromAc.email || "");
      setcontactNumber(editingBankDataFromAc.contactNumber || "");
      setcontactPersonAddress(editingBankDataFromAc.contactPersonAddress || "");
      setUploadDocumentRemarks(
        editingBankDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingBankDataFromAc.downloadDto || []);
    } else {
      setEditingBankData(null);
      dispatch(getAllAuctionCenterAction());
    }
  }, [editingBankDataFromAc]);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter.getAllAuctionCenter.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getAllBankAc || getSearchBank);

  useEffect(() => {
    if (searchBankData != null && searchBankData != undefined) {
      setGetSearchBank(searchBankData);
      setRows(searchBankData);
    } else {
      setGetSearchBank([]);
      setRows([]);
    }
  }, [searchBankData]);

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createBankAcDetail &&
      state.createBankAcDetail.uploadedDocuments &&
      state.createBankAcDetail.uploadedDocuments.responseData
  );

  const switchBankDataFromAc = useSelector(
    (state) => state.createBankAcDetail.BankAcData.responseData
  );

  useEffect(() => {
    if (switchBankDataFromAc && handleSwitchClick) {
      let searchData = {
        bankAccountDetailId: searchbankName,
        auctionCenterId: searchauctionCenterName,
        bankAccountNumber: searchbankAccountNumber,
        ifscCode: searchifscCode,
        isActive,
      };

      const updatedData = {
        ...switchBankDataFromAc,
        isActive: switchBankDataFromAc.isActive === 1 ? 0 : 1,
        searchData: searchData,
      };

      setDataById("");
      dispatch(updateBankAcAction(updatedData));
      dispatch(getBankAcByIdActionSuccess([]));
      setHandleSwitchClick(false);
    }
  }, [switchBankDataFromAc]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "bankAccountNumber",
      title: "Bank Account Number",
    },
    {
      name: "bankName",
      title: "Bank Name",
    },
    {
      name: "branchAddress",
      title: "Branch Address",
    },
    {
      name: "ifscCode",
      title: "IFSC Code",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center",
    },
    {
      name: "beneficiaryName",
      title: "Beneficiary Name",
    },
    {
      name: "contactPerson",
      title: "Contact Person",
    },
    {
      name: "email",
      title: "Email",
    },
    {
      name: "contactNumber",
      title: "Contact Number",
    },
    {
      name: "contactPersonAddress",
      title: "Contact Person Address",
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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchTaxMasterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsBankAcAction());
      setViewMode(false);
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
      handleClear();
    }
  };

  let createData = useSelector(
    (state) => state.createBankAcDetail.createEditBankAcDetailsApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditBankAcDetailsApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
    }
  });

  function StatusData(data) {
    const handleSwitchChange = () => {
      setHandleSwitchClick(true);
      dispatch(getBankAcByIdAction(data.data.bankAccountDetailId));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.bankAccountDetailId}`}
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange}
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.bankAccountDetailId}`}
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
            onClick={() => handleEditClick(data.data.bankAccountDetailId)}
          ></i>

          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.bankAccountDetailId)}
          ></i>

          <i
            className="fa fa-history"
            onClick={() =>
              handleHistoryViewClick(data.data.bankAccountDetailId)
            }
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
    setbankAccountNumber("");
    setbankName("");
    setbranchAddress("");
    setifscCode("");
    setauctionCenterName("");
    setbeneficiaryName("");
    setcontactPerson("");
    setcontactPersonAddress("");
    setemail("");
    setcontactNumber("");
    setbankAccountNumberError("");
    setbankNameError("");
    setbranchAddressError("");
    setifscCodeError("");
    setbeneficiaryNameError("");
    setcontactPersonError("");
    setauctionCenterId("");
    setauctionCenterIdError("");
    setemailError("");
    setcontactNumberError("");
    setauctionCenterNameError("");
    setUploadDocumentError("");
    setRemarksError("");
    setcontactPersonAddressError("");
    setEditingBankData(null);
  };
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_BankAccountDetail";
    const moduleName = "BankAccountDetail";
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
              ? "View Bank"
              : editingBankData
              ? "Edit Bank Account Detail"
              : "Create Bank Account Detail"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Bank Account Number</label>
                      <input
                        type="number"
                        maxLength="20"
                        className="form-control"
                        value={
                          editingBankData?.bankAccountNumber ||
                          bankAccountNumber
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                bankAccountNumber: e.target.value,
                              })
                            : setbankAccountNumber(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {bankAccountNumberError && (
                        <p className="errorLabel">{bankAccountNumberError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        maxLength="100"
                        className="form-control"
                        value={editingBankData?.bankName || bankName}
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                bankName: e.target.value,
                              })
                            : setbankName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {bankNameError && (
                        <p className="errorLabel">{bankNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Branch Address</label>
                      <input
                        type="text"
                        maxLength="500"
                        className="form-control"
                        value={editingBankData?.branchAddress || branchAddress}
                        onChange={(e) =>
                          editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                branchAddress: e.target.value,
                              })
                            : setbranchAddress(e.target.value)
                        }
                        disabled={viewMode}
                      />
                      {branchAddressError && (
                        <p className="errorLabel">{branchAddressError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        maxLength="20"
                        className="form-control"
                        value={editingBankData?.ifscCode || ifscCode}
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                ifscCode: e.target.value,
                              })
                            : setifscCode(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {ifscCodeError && (
                        <p className="errorLabel">{ifscCodeError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center</label>
                      <select
                        className="form-control select-form"
                        value={
                          editingBankData?.auctionCenterId || auctionCenterId
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                auctionCenterId: e.target.value,
                              })
                            : setauctionCenterId(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value={0}>Select auctionCenter</option>
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
                      <label>Beneficiary Name </label>
                      <input
                        type="text"
                        maxLength="100"
                        className="form-control"
                        value={
                          editingBankData?.beneficiaryName || beneficiaryName
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                beneficiaryName: e.target.value,
                              })
                            : setbeneficiaryName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {beneficiaryNameError && (
                        <p className="errorLabel">{beneficiaryNameError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Contact Person</label>
                      <input
                        type="text"
                        maxLength="100"
                        className="form-control"
                        value={editingBankData?.contactPerson || contactPerson}
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                contactPerson: e.target.value,
                              })
                            : setcontactPerson(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {contactPersonError && (
                        <p className="errorLabel">{contactPersonError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Email</label>
                      <input
                        type="text"
                        maxLength="50"
                        className="form-control"
                        value={editingBankData?.email || email}
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                email: e.target.value,
                              })
                            : setemail(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {emailError && <p className="errorLabel">{emailError}</p>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Contact Number</label>
                      <input
                        type="number"
                        maxLength="15"
                        className="form-control"
                        value={editingBankData?.contactNumber || contactNumber}
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                contactNumber: e.target.value,
                              })
                            : setcontactNumber(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {contactNumberError && (
                        <p className="errorLabel">{contactNumberError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Contact Person Address</label>
                      <input
                        type="text"
                        maxLength="200"
                        className="form-control"
                        value={
                          editingBankData?.contactPersonAddress ||
                          contactPersonAddress
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingBankData
                            ? setEditingBankData({
                                ...editingBankData,
                                contactPersonAddress: e.target.value,
                              })
                            : setcontactPersonAddress(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {contactPersonAddressError && (
                        <p className="errorLabel">
                          {contactPersonAddressError}
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
                          inputId="bankAccountUpload"
                        />
                      </div>
                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingBankData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
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
                          {editingBankData ? "Update" : "Submit"}
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
          <Typography>Manage Bank Account Detail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Account No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchbankAccountNumber}
                        onChange={(e) =>
                          setsearchbankAccountNumber(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Bank Name</label>
                      <select
                        className="form-control select-form"
                        value={searchbankName}
                        onChange={(e) => setsearchbankName(e.target.value)}
                      >
                        <option value={0}>Search Bank Name</option>
                        {isActiveData?.map((state) => (
                          <option
                            key={state.bankAccountDetailId}
                            value={state.bankAccountDetailId}
                          >
                            {state.bankName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={searchifscCode}
                        onChange={(e) => setsearchifscCode(e.target.value)}
                      />
                    </div>
                  </div>

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

export default CreateBankAccountDetail;
