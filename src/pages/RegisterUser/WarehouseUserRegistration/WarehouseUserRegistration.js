/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Modals from "../../../components/common/Modal";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { Card, Form } from "react-bootstrap";
import { resolveTimeFormat } from "@mui/x-date-pickers/internals/utils/time-utils";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
import * as Yup from "yup";
import { ErrorMessage, Formik } from "formik";
import UploadMultipleDocuments from "../../uploadDocument/UploadMultipleDocuments";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  createUserRequest,
  createWarehouseUserRequest,
  fetchAuctionRequest,
  fetchDocumentsRequest,
  fetchStateRequest,
  getDocumentDetailRequest,
  getUserRequest,
  getUsersRequest,
  // postWarehouseUserRequest,
  postWarehouseUserSuccess,
  searchUsersRequest,
  updateWarehouseUserRequest,
} from "../../../store/actions";
import { useSelector } from "react-redux";

function RegisterUserModal({ open, setOpen }) {
  const [expanded, setExpanded] = React.useState("panel1");
  // const handleCloseHistory = () => setShowmodal(false);
  const dispatch = useDispatch();

  const handleChangeExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  let SrNo = 1;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [AuctionCenter, setAuctionCenter] = useState([]);
  const [StateList, setStateList] = useState([]);
  const [StateCode, setStateCode] = useState([]);
  const [RegUsers, setRegUsers] = useState([]);
  const [isEdit, setIsedit] = useState(false);
  const [UploadedDocuemnt, setUploadedDocument] = useState([]);
  const [userId, setUserId] = useState("");
  const [downlodDocument, setDownloadDocument] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [field, setField] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [formData, setFormData] = useState({
    wareHouseUserRegId: 0,
    wareHouseName: "",
    wareHouseCode: "",
    wareHouseLicenseNo: "",
    address: "",
    city: "",
    contactPerson: "",
    email: "",
    entityCode: "",
    phoneNo: "",
    mobileNo: "",
    fax: "",
    auctionCenterId: [field],
    shortName: "",
    stateId: null,
    panNo: "",
    gstNo: "",
    taxIdentityNo: "",
    teaBoardRegistrationNo: "",
    isActive: null,
    uploadDocumentRemarks: "",
    downloadDto: [],
  });
  const isValid = true;
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    formData.auctionCenterId = field;
    if (validate() && isEdit !== true) {
      console.log("formData", formData);
      // dispatch(postWarehouseUserRequest(formData));
    }
  };

  const EditUserData = (id) => {
    setUserId(id);
    setIsedit(true);
    setDisabled(false);
    setExpanded("panel1");
    dispatch(getUserRequest(id));
  };
  const SaveUpdatedUser = () => {
    if (validate() && isEdit == true) {
      dispatch(updateWarehouseUserRequest(formData));
    }
  };

  const downloadDocument = (documentId) => {
    dispatch(getDocumentDetailRequest(documentId));
  };
  const ViewUserData = (Viewwarehouse) => {
    setFormData(Viewwarehouse);
    setExpanded("panel1");
    setDisabled(true);
  };
  const handleDownloadPDF = () => {
    debugger;
    if (downlodDocument && downlodDocument.documentContent) {
      uploadedFileDownload(
        downlodDocument.documentContent,
        "downloaded_document.pdf"
      );
    }
  };

  const [searchData, setSearchData] = useState({});
  const [isSearch, setIsSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchData.wareHouseCode != "" || searchData.wareHouseName != "") {
      setIsSearch(true);
      dispatch(searchUsersRequest(searchData));
    }
  };

  const handleWarehouseNameChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const UploadedDocumentList = useSelector(
    (res) => res.warehouseUserRegistration.documents?.responseData
  );
  const GetAllUsers = useSelector(
    (res) => res.warehouseUserRegistration.users.data?.responseData
  );
  const AuctionCenterList = useSelector(
    (res) => res.warehouseUserRegistration.auctionCenter?.responseData
  );
  const States = useSelector(
    (res) => res?.warehouseUserRegistration.stateList.data?.responseData
  );
  const SearchUser = useSelector(
    (res) => res.warehouseUserRegistration.userSearch.data?.responseData
  );
  const UserById = useSelector(
    (res) => res?.warehouseUserRegistration?.userById?.data?.responseData
  );

  const [clearSearch, setClearSearch] = useState(false);

  const ClearSearch = () => {
    setIsSearch(false);
    setClearSearch(true);
    dispatch(getUsersRequest());
  };

  useEffect(() => {
    let data = StateList?.filter((ele) => ele.stateId == formData.stateId);
    setStateCode(data?.at(0)?.stateCode);
  }, [formData.stateId]);

  useEffect(() => {
    dispatch(fetchStateRequest());
    dispatch(fetchDocumentsRequest());
    dispatch(getUsersRequest());
    dispatch(postWarehouseUserSuccess());
    dispatch(fetchAuctionRequest());
  }, []);

  useEffect(() => {
    setRegUsers(GetAllUsers);
    setUploadedDocument(UploadedDocumentList);
    setAuctionCenter(AuctionCenterList);
    setStateList(States);
    if (isEdit === true) {
      setFormData(UserById);
    }
    if (isSearch == true) {
      debugger;
      setRegUsers(SearchUser);
    } else {
      setRegUsers(GetAllUsers);
    }
    if (clearSearch == true) {
      setRegUsers(GetAllUsers);
    }
  }, [
    GetAllUsers,
    UploadedDocumentList,
    AuctionCenterList,
    States,
    UserById,
    SearchUser,
  ]);

  const roles = [
    "Select Role",
    "Buyer",
    "Seller",
    "TAO User",
    "Tea Board",
    "Buyer",
    "Warehouse",
  ];

  const [role, setRole] = useState("");

  const selectRole = (role) => {
    setRole(role);
  };

  const handleSearchRole = () => {
    if (role === "Select Role") {
      toast.error("Select Role");
    }
    selectRole();
  };

  const [addressvalid, setAddressvalid] = useState("");
  const [auctionCenterIdvalid, setAuctionCenterIdvalid] = useState("");
  const [cityValid, setCityValid] = useState("");
  const [contactPersonValid, setContactPersonValid] = useState("");
  const [emailValid, setemailValid] = useState("");
  const [faxValid, setfaxValid] = useState("");
  const [gstNoValid, setgstNoValid] = useState("");
  const [mobileNoValid, setmobileNoValid] = useState("");
  const [panNoValid, setpanNoValid] = useState("");
  const [phoneNoValid, setphoneNoValid] = useState("");
  const [shortNameValid, setshortNameValid] = useState("");
  const [stateIdValid, setstateIdValid] = useState("");
  const [taxIdentityNoValid, settaxIdentityNoValid] = useState("");
  const [teaBoardRegistrationNoValid, setteaBoardRegistrationNoValid] =
    useState("");
  const [wareHouseCodeValid, setwareHouseCodeValid] = useState("");
  const [wareHouseNameValid, setwareHouseNameValid] = useState("");
  const [wareHouseLicenseNoValid, setwareHouseLicenseNoValid] = useState("");

  const validate = () => {
    let isValid = true;

    if (formData.address == "") {
      setAddressvalid("Please Enter Address");
      isValid = false;
    } else {
      setAddressvalid("");
    }
    if (formData.auctionCenterId == "") {
      setAuctionCenterIdvalid("Please Enter Auction Center");
      isValid = false;
    } else {
      setAuctionCenterIdvalid("");
    }
    if (formData.city == "") {
      setCityValid("Please Enter City");
      isValid = false;
    } else {
      setCityValid("");
    }
    if (formData.contactPerson == "") {
      setContactPersonValid("Please Enter Contact Person");
      isValid = false;
    } else {
      setContactPersonValid("");
    }
    if (formData.email == "") {
      setemailValid("Please Enter Email");
      isValid = false;
    } else {
      setemailValid("");
    }
    if (formData.fax == "") {
      setfaxValid("Please Enter Fax");
      isValid = false;
    } else {
      setfaxValid("");
    }
    if (formData.gstNo == "") {
      setgstNoValid("Please Enter GST No");
      isValid = false;
    } else {
      setgstNoValid("");
    }
    if (formData.mobileNo == "") {
      setmobileNoValid("Please Enter Mobile No");
      isValid = false;
    } else {
      setmobileNoValid("");
    }
    if (formData.panNo == "") {
      setpanNoValid("Please Enter Pan No");
      isValid = false;
    } else {
      setpanNoValid("");
    }
    if (formData.phoneNo == "") {
      setphoneNoValid("Please Enter Phone No");
      isValid = false;
    } else {
      setphoneNoValid("");
    }
    if (formData.shortName == "") {
      setshortNameValid("Please Enter Short Name");
      isValid = false;
    } else {
      setshortNameValid("");
    }
    if (formData.stateId == "") {
      setstateIdValid("Please Enter State Name");
      isValid = false;
    } else {
      setstateIdValid();
    }
    if (formData.taxIdentityNo == "") {
      settaxIdentityNoValid("Please Enter Tax Identity No");
      isValid = false;
    } else {
      settaxIdentityNoValid("");
    }
    if (formData.teaBoardRegistrationNo == "") {
      setteaBoardRegistrationNoValid("Please Enter Teaboard Registration No");
      isValid = false;
    } else {
      setteaBoardRegistrationNoValid("");
    }

    if (formData.wareHouseCode == "") {
      setwareHouseCodeValid("Please Enter Ware House Code");
      isValid = false;
    } else {
      setwareHouseCodeValid("");
    }
    if (formData.wareHouseName == "") {
      setwareHouseNameValid("Please Enter Ware House Name");
      isValid = false;
    } else {
      setwareHouseNameValid("");
    }
    if (formData.wareHouseLicenseNo == "") {
      setwareHouseLicenseNoValid("Please Enter Ware House License No");
      isValid = false;
    } else {
      setwareHouseLicenseNoValid("");
    }

    return isValid;
  };

  const resetForm = () => {
    setDisabled(false);

    setAddressvalid("");
    setAuctionCenterIdvalid("");
    setCityValid("");
    setContactPersonValid("");
    setemailValid("");
    setfaxValid("");
    setgstNoValid("");
    setmobileNoValid("");
    setpanNoValid("");
    setphoneNoValid("");
    setshortNameValid("");
    setstateIdValid("");
    settaxIdentityNoValid("");
    setteaBoardRegistrationNoValid("");
    setwareHouseCodeValid("");
    setwareHouseNameValid("");
    setwareHouseLicenseNoValid("");

    setFormData({
      wareHouseUserRegId: 0,
      wareHouseName: "",
      wareHouseCode: "",
      wareHouseLicenseNo: "",
      address: "",
      city: "",
      contactPerson: "",
      email: "",
      entityCode: "",
      phoneNo: "",
      mobileNo: "",
      fax: "",
      auctionCenterId: [],
      shortName: "",
      stateId: 0,
      panNo: "",
      gstNo: "",
      taxIdentityNo: "",
      teaBoardRegistrationNo: "",
      isActive: 0,
      uploadDocumentRemarks: "",
      downloadDto: [],
    });
    setIsedit(false);
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
  useEffect(() => {
    formData.downloadDto = uploadedDocuments;
  }, [formData.downloadDto]);

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
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
      <Modals
        title={"Register User"}
        show={open === "RegisterUser"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <div className="row align-items-end mb-4">
          <div className="col-md-3">
            <label>Select Role </label>
            <select
              className="select-form form-control"
              onChange={(e) => selectRole(e.target.value)}
            >
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="col-auto">
            <div className="BtnGroup">
              <button className="SubmitBtn" onClick={() => handleSearchRole()}>
                Submit
              </button>
            </div>
          </div> */}
        </div>

        {role === "Warehouse" && (
          <>
            <Accordion
              expanded={expanded === "panel1"}
              className={`${expanded === "panel1" ? "active" : ""}`}
              onChange={handleChangeExpand("panel1")}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Warehouse User Registration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Address</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            maxLength={500}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{addressvalid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Auction center</label>
                          <Form.Group controlId="my_multiselect_field">
                            <Form.Control
                              as="select"
                              multiple
                              value={field}
                              onChange={(e) =>
                                setField(
                                  [].slice
                                    .call(e.target.selectedOptions)
                                    .map((item) => item.value)
                                )
                              }
                              disabled={disabled}
                            >
                              {AuctionCenter?.map((AuctionCenter, index) => (
                                <option
                                  key={index}
                                  value={AuctionCenter.auctionCenterId}
                                >
                                  {AuctionCenter.auctionCenterName}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                          <p className="errorLabel">{auctionCenterIdvalid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>City</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            maxLength={50}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{cityValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Contact Person</label>
                          <input
                            type="text"
                            className="form-control"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            maxLength={100}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{contactPersonValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>E Mail</label>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={50}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{emailValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Entity Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="entityCode"
                            value={formData.entityCode}
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Fax</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fax"
                            value={formData.fax}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{faxValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>GST No</label>
                          <input
                            type="text"
                            className="form-control"
                            name="gstNo"
                            value={formData.gstNo}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{gstNoValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Mobile No</label>
                          <input
                            type="text"
                            className="form-control"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel"> {mobileNoValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>PAN no</label>
                          <input
                            type="text"
                            className="form-control"
                            name="panNo"
                            value={formData.panNo}
                            onChange={handleChange}
                            maxLength={10}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{panNoValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Phone: </label>
                          <input
                            type="text"
                            className="form-control"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{phoneNoValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Short Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="shortName"
                            value={formData.shortName}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{shortNameValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>State Name</label>
                          <select
                            name="stateId"
                            value={formData?.stateId}
                            onChange={handleChange}
                            className="form-control select-form"
                            maxLength={500}
                            disabled={disabled}
                          >
                            <option>Select State</option>
                            {StateList?.map((StateList, index) => (
                              <option key={index} value={StateList.stateId}>
                                {StateList.stateName}
                              </option>
                            ))}
                          </select>
                          <p className="errorLabel">{stateIdValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>State Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="StateCode"
                            value={StateCode}
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Tax Id No</label>
                          <input
                            type="text"
                            className="form-control"
                            name="taxIdentityNo"
                            value={formData.taxIdentityNo}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{taxIdentityNoValid}</p>
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Teaboard Reg No</label>
                          <input
                            type="text"
                            className="form-control"
                            name="teaBoardRegistrationNo"
                            value={formData.teaBoardRegistrationNo}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel">
                            {teaBoardRegistrationNoValid}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Ware House Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="wareHouseCode"
                            value={formData.wareHouseCode}
                            onChange={handleChange}
                            maxLength={10}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{wareHouseCodeValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Ware House Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="wareHouseName"
                            value={formData.wareHouseName}
                            onChange={handleChange}
                            maxLength={50}
                            disabled={disabled}
                          />
                          <p className="errorLabel">{wareHouseNameValid}</p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Ware House License No</label>
                          <input
                            type="text"
                            className="form-control"
                            name="wareHouseLicenseNo"
                            value={formData.wareHouseLicenseNo}
                            onChange={handleChange}
                            maxLength={15}
                            disabled={disabled}
                          />
                          <p className="errorLabel">
                            {wareHouseLicenseNoValid}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="FormGroup">
                          <Card className="mt-3 FileUploadBox">
                            <Card.Body>
                              <Card.Title>File Upload</Card.Title>
                              <div className="">
                                <UploadMultipleDocuments
                                  onFileSelect={handleFileUpload}
                                  uploadedFiles={uploadedDocuments}
                                  inputId="warehouseUpload"
                                />
                                {uploadDocumentError && (
                                  <p
                                    className="errorLabel"
                                    style={{ color: "red" }}
                                  >
                                    {uploadDocumentError}
                                  </p>
                                )}
                              </div>
                              {/* Render file type icons based on uploaded files */}
                              {uploadedFiles &&
                                uploadedFiles?.map((file, index) => (
                                  <div className="UploadedFile" key={index}>
                                    <div>
                                      {renderFileTypeIcon(file)}
                                      <span>{file.name}</span>
                                    </div>
                                    <i
                                      className="fa fa-times"
                                      onClick={() => removeFile(index)}
                                    ></i>
                                  </div>
                                ))}
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12"></div>
                      <div className="col-12">
                        <div className="BtnGroup">
                          {isEdit == true ? (
                            <button
                              className={"SubmitBtn"}
                              onClick={() => SaveUpdatedUser()}
                              disabled={disabled}
                            >
                              Update
                            </button>
                          ) : (
                            <button className="SubmitBtn" disabled={disabled}>
                              Submit
                            </button>
                          )}

                          <button
                            className="SubmitBtn"
                            type="button"
                            onClick={() => resetForm()}
                            disabled={disabled}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              className={`${expanded === "panel2" ? "active" : ""}`}
              onChange={handleChangeExpand("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Manage Warehouse User </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <form onSubmit={handleSearch}>
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <div className="FomrGroup">
                          <label>Ware House Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="wareHouseName"
                            value={searchData.wareHouseName}
                            onChange={handleWarehouseNameChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="FomrGroup">
                          <label>Ware House Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="wareHouseCode"
                            value={searchData.wareHouseCode}
                            onChange={handleWarehouseNameChange}
                          />
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="BtnGroup">
                          <button className="SubmitBtn">Search</button>
                          <button
                            className="SubmitBtn"
                            onClick={() => ClearSearch()}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="TableBox">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Sr.</th>
                                <th>Ware House Code</th>
                                <th>Ware House Name</th>
                                <th>Email</th>
                                <th>Pan No</th>
                                <th>GST No</th>
                                <th>Teaboard Registration No</th>
                                <th>Phone No</th>
                                <th>Mobile No</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {RegUsers?.map((warehouse) => (
                                <tr key={warehouse.userId}>
                                  <td>{SrNo++}</td>
                                  <td>{warehouse.wareHouseCode}</td>
                                  <td>{warehouse.wareHouseName}</td>
                                  <td>{warehouse.email}</td>
                                  <td>{warehouse.panNo}</td>
                                  <td>{warehouse.gstNo}</td>
                                  <td>{warehouse.teaBoardRegistrationNo}</td>
                                  <td>{warehouse.phoneNo}</td>
                                  <td>{warehouse.mobileNo}</td>
                                  <td>
                                    {warehouse.isActive == 1
                                      ? "Active"
                                      : "Inactive"}
                                  </td>
                                  <td className="Action">
                                    <i
                                      className="fa fa-eye"
                                      onClick={() => ViewUserData(warehouse)}
                                    ></i>
                                    <i
                                      className="fa fa-edit"
                                      onClick={() =>
                                        EditUserData(
                                          warehouse.wareHouseUserRegId
                                        )
                                      }
                                    ></i>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </form>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              className={`${expanded === "panel3" ? "active" : ""}`}
              onChange={handleChangeExpand("panel3")}
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
                  <div className="TableBox">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Remarks</th>
                          <th>Upload Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {UploadedDocuemnt &&
                          UploadedDocuemnt.map((document, index) => (
                            <tr key={document.id}>
                              <td>{index + 1}</td>
                              <td>{document.uploadDocumentRemarks}</td>
                              <td>
                                {document.documentUploadTime}

                                {new Date(
                                  document.documentUploadTime
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "2-digit",
                                })}
                              </td>
                              <td className="Action">
                                <i className="fa fa-eye"></i>
                                <i
                                  className="fa fa-download"
                                  onClick={() => {
                                    downloadDocument(
                                      document.uploadDocumentConfId
                                    );
                                    handleDownloadPDF();
                                  }}
                                ></i>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Modals>
    </>
  );
}

export default RegisterUserModal;
