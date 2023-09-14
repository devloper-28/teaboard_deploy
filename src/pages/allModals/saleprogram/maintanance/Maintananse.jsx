import React, { useEffect, useState } from "react";
import {
  Card,
  FormControl,
  FormLabel,
  FormGroup,
  Button,
  Table,
  Col,
  Row,
} from "react-bootstrap";
import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileText,
  AiOutlineFile,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  cancelSaleProgramDocumentRequest,
  cancelSaleProgramRequest,
  checkSaleNoExistence,
  createSaleProgramRequest,
  fetchPromptDatesByAuctionCenterRequest,
  teaTypeAction,
  updateSaleProgramRequest,
} from "../../../../store/actions/index";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import NoData from "../../../../components/nodata/NoData";
import { SettingsSystemDaydreamSharp } from "@mui/icons-material";
import axios from "axios";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import DownloadFile from "../../../../components/common/download/DownloadFile";
import axiosMain from "../../../../http/axios/axios_main";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const AuctionCard = ({
  selectedSaleProgram,
  formData,
  generateYearOptions,
  handleYearChange,
  saleNumber,
  setSelectedSaleProgram,
  isDisabled,
  isEdit,
  resateForm,
  year,
  setYears,
  setSaleDate,
  selectedSalePrograms,
  setSelectedSalePrograms,
  saleProgramDetailList,
  setSaleProgramDetailList,
  currentDate,
  saleDates,
  setSaleDates,
  closingDate,
  setClosingDate,
  selectedSaleNo,
  setSelectedSaleNo,
  publishingDate,
  setPublishingDate,
  uploadedFiles,
  setUploadedFiles,
  numRows,
  setNumRows,
  handleChange,
}) => {
  const dispatch = useDispatch();
  const auctionCenter = useSelector(
    (state) => state.auction.auctionCenter.responseData
  );
  const saleProgramList = useSelector(
    (state) => state.sale.saleProgramList.responseData
  );
  const [teaTypeList, setTeaTeatypeList] = useState([]);

  const saleProgramDetail = useSelector((state) => state);
  const [salePromtDate, setSalePromtDate] = useState([]);
  const [SaleProgramId, setSaleProgramId] = useState(null);

  const exists = useSelector((state) => state.auction.saleNumber);
  const auctionDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Array of auction days
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [minDate, setMinDate] = useState("");
  const [status, setStatus] = useState(null);
  const [saleNo, setSaleNo] = useState([]);
  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );

  const saleDateData = useSelector(
    (state) => state?.auction?.promptDates?.responseData
  );

  useEffect(() => {
    setSalePromtDate(saleDateData?.at(0));
  }, [saleDateData]);

  useEffect(() => {
    dispatch(teaTypeAction());
    axiosMain
      .get(`/preauction/Common/BindSaleNo`)
      .then((response) => {
        if (response.status === 200) {
          // Assuming the response contains the SaleProgram data
          // console.log(response.data)
          setSaleNo(response.data.responseData);
        } else {
          toast.error("API call failed.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        toast.error("An error occurred.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }, []);

  useEffect(() => {
    setTeaTeatypeList(teaType);
  }, [teaType]);

  // Get the total number of pages based on the number of items and the page size
  const totalPages = Math.ceil(numRows / pageSize);

  // Generate an array of page numbers
  const pageNumbers = Array?.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Get the items to display on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, numRows);
  const itemsOnPage = Array?.from(
    { length: numRows },
    (_, index) => index + startIndex
  );

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setSaleProgramDetailList(
      saleProgramDetail.sale.saleProgramDetails.responseData
    );

    if (
      saleProgramDetail.sale.saleProgramDetails.responseData?.at(0)
        .auctionDetails !== undefined
    ) {
      setSelectedSalePrograms(
        saleProgramDetail.sale.saleProgramDetails.responseData?.at(0)
          .auctionDetails
      );
    }

    // console.log(
    //   saleProgramDetail.sale.saleProgramDetails.responseData?.at(0)
    //     .auctionDetails,
    //   "saleProgramDetail"
    // );
  }, [saleProgramDetail]);

  useEffect(() => {
    if (saleProgramDetailList?.length > 0) {
      setYears(saleProgramDetailList?.map((ele) => ele.season));
      setSelectedSaleNo(saleProgramDetailList?.map((ele) => ele.saleNo));
      setClosingDate(
        saleProgramDetailList?.map((ele) =>
          ele.catalogClosingDate?.split("T")?.at(0)
        )
      );
      setPublishingDate(
        saleProgramDetailList?.map((ele) =>
          ele.catalogPublishingDate?.split("T")?.at(0)
        )
      );
      setNumRows(saleProgramDetailList?.map((ele) => ele.noOfAuctionDays));

      setUploadedFiles(
        saleProgramDetailList?.map((ele) => ele?.documentDetails)[0]
      );

      // setStatus(saleProgramDetailList?.map((ele) => ele?.documentDetails)[0]);

      // setSelectedSalePrograms(
      //   saleProgramDetailList?.map((ele) => ele?.auctionDetails)[0]
      // );
      setSaleProgramId(saleProgramDetailList?.map((ele) => ele?.SaleProgramId));
    } else {
    }
  }, [saleProgramDetailList]);

  useEffect(() => {
    document.getElementById("fileInput").value = "";
  }, [uploadedFiles]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredKeys = [
      "teaTypeId",
      "saleDate",
      "buyersPromptDate",
      "sellersPromptDate",
    ];

    // if (!closingDate || !publishingDate || !saleDates) {
    //   toast.error('Please fill in all the form fields');
    //   return;
    // }

    //
    function hasRequiredKeys(obj, keys) {
      return keys?.every((key) => obj?.hasOwnProperty(key));
    }

    const isAllKeysPresent = selectedSalePrograms?.every((item) =>
      hasRequiredKeys(item, requiredKeys)
    );

    const dataList = itemsOnPage
      .slice(startIndex, endIndex)
      ?.map((item, itemindex) =>
        [...selectedSalePrograms]?.filter((ele, index) =>
          index !== itemindex ? (ele.isActive = false) : (ele.isActive = true)
        )
      );

    console.log(dataList, "dataListdataList");

    // if (selectedSalePrograms?.length !== numRows) {
    //   toast.error("Auction Details fields is missing.!");
    //   return;
    // }

    if (!isAllKeysPresent) {
      toast.error("Sale program field is missing !");
      return;
    }

    if (publishingDate < currentDate) {
      toast.error("Publishing date cannot be less than the current date");
      return;
    }

    if (publishingDate <= closingDate) {
      toast.error(
        "Publishing date cannot be less than or equal to the closing date"
      );
      return;
    }
    if (!selectedSaleNo) {
      toast.error("Please select a sale number");
      return;
    }

    if (!closingDate) {
      toast.error("Please enter the closing date");
      return;
    }

    if (!publishingDate) {
      toast.error("Please enter the publishing date");
      return;
    }

    if (
      saleProgramList
        ?.map((ele) => ele.saleNo == selectedSaleNo && isEdit == false)
        .includes(true) == true
    ) {
      toast.error("This sale no is already exist");
      return;
    }
    if (!selectedSaleNo && isEdit == false) {
      toast.error("Please select a sale number");
      return;
    }
    if (!uploadedFiles.length > 0 && isEdit == false) {
      toast.error("Please upload a file");
      return;
    }

    setSelectedSalePrograms([
      ...selectedSalePrograms.filter((item) =>
        item?.teaTypeId === ""
          ? (item.teaTypeId = teaTypeList[0]?.teaTypeName)
          : item.teaTypeId
      ),
    ]);

    if (isEdit == true) {
      const data = selectedSalePrograms.map((ele, index) =>
        index <= numRows - 1 == true
          ? (ele.isActive = true)
          : (ele.isActive = false)
      );

      console.log(
        // MainDataList,
        data,
        selectedSalePrograms,
        // numRows,
        "numRows"
      );

      const formData = {
        SaleProgramId: SaleProgramId[0],
        season: typeof year == "object" ? year[0] : year,
        saleNo: parseInt(selectedSaleNo),
        catalogClosingDate:
          typeof closingDate == "object" ? closingDate[0] : closingDate,
        catalogPublishingDate:
          typeof publishingDate == "object"
            ? publishingDate[0]
            : publishingDate,
        createdBy: 1,
        updatedBy: 1,
        noOfAuctionDays: parseInt(numRows),
        status: 0,
        auctionDate: getMinimumSaleDate(selectedSalePrograms),
        auctionDays: selectedSalePrograms,
        documentList:
          uploadedFiles == []
            ? uploadedFiles[0]?.length > 0
              ? uploadedFiles[0]?.map((ele) => {
                  return {
                    DocumentSize: ele.DocumentSize,
                    documentBrief: ele?.documentBrief,
                    documentId: ele.documentId,
                    // contentType: ele.contentType,
                    documentName: ele?.documentName,
                    // documentPath: ele?.documentPath,
                    status: 0,
                  };
                })
              : uploadedFiles
            : uploadedFiles,
      };

      // resateForm();

      // console.log(formData, "formDataformData");
      dispatch(updateSaleProgramRequest(formData));
    } else {
      const formData = {
        season: year,
        saleNo: parseInt(selectedSaleNo),
        catalogClosingDate: closingDate,
        catalogPublishingDate: publishingDate,
        createdBy: 1,
        noOfAuctionDays: parseInt(numRows),
        status: 0,
        auctionDate: getMinimumSaleDate(selectedSalePrograms),
        auctionDays: selectedSalePrograms,
        documentList: uploadedFiles,
      };

      dispatch(createSaleProgramRequest(formData));
      resateForm();
    }
    handleChange("panel1");
  };
  function getMinimumSaleDate(auctionDays) {
    if (!Array.isArray(auctionDays) || auctionDays.length === 0) {
      toast.error("Auction Days are empty !");
      return null;
    }

    // Extract the saleDates from the auctionDays array
    const saleDates = auctionDays.map((ele) => ele.saleDate);

    // Find the minimum sale date using the reduce function
    const minSaleDate = saleDates.reduce((minDate, currentDate) => {
      return currentDate < minDate ? currentDate : minDate;
    });

    return minSaleDate;
  }

  const handleAuctionDaysChange = (e) => {
    const selectedValue = parseInt(e.target.value);

    setNumRows(selectedValue);
  };
  if (exists === true) {
    toast.success("You can create a sale program");
  } else if (exists === false) {
    toast.error("You are not allowed to create a sale program");
  }

  const renderFileTypeIcon = (file) => {
    const extension = file.name?.split(".").pop().toLowerCase();

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

  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    URL.revokeObjectURL(updatedFiles[index].path); // Release the object URL
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
  };
  const handleSaleNoChange = (event) => {
    const selectedValue = event.target.value;

    if (
      saleProgramList
        ?.map((ele) => ele.saleNo == selectedValue)
        .includes(true) == true
    ) {
      toast.error("This sale no is already exist");
    } else {
      toast.success("You can create a sale program");
    }
    setSelectedSaleNo(selectedValue);
  };

  if (!exists || !saleProgramDetail) {
    return (
      <div>
        <NoData />
      </div>
    ); // Show a message when no data is available
  }
  const handleSaleDateChange = (e) => {
    const selectedSaleDate = e.target.value;
    setSaleDates(selectedSaleDate);
  };
  // Function to update the state for a specific row/item

  const updateSelectedSaleProgram = (index, updatedProgram) => {
    const updatedPrograms = [...selectedSalePrograms];
    updatedPrograms[index] = updatedProgram;

    // You can perform the API call regardless of whether saleDate is available or not
    if (updatedProgram.saleDate) {
      const apiUrl = "/preauction/SaleProgram/GetPromptDateByAuctionCenter";
      const requestData = {
        auctionCenterId: 1,
        saleDate: updatedPrograms[index].saleDate,
      };

      axiosMain.post(apiUrl, requestData).then((response) => {
        const { buyersPromptDate, sellersPromptDate } =
          response.data.responseData[0];

        const combinedObject = {
          ...updatedPrograms[index],
          sellersPromptDate,
          buyersPromptDate,
        };

        updatedPrograms[index] = combinedObject;
        setSelectedSalePrograms(updatedPrograms);
      });
    } else {
      // If saleDate is not available, you can update the selectedSalePrograms directly
      setSelectedSalePrograms(updatedPrograms);
    }
    // setSelectedSalePrograms(updatedPrograms);
  };

  const updateFileBrief = (index, brief) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index].documentBrief = brief;
    updatedFiles[index].status = 0;
    setUploadedFiles(updatedFiles);
  };

  const handleCencal = () => {
    const formData = {
      SaleProgramId: SaleProgramId[0],
      season: typeof year == "object" ? year[0] : year,
      saleNo: parseInt(selectedSaleNo),
      catalogClosingDate:
        typeof closingDate == "object" ? closingDate[0] : closingDate,
      catalogPublishingDate:
        typeof publishingDate == "object" ? publishingDate[0] : publishingDate,
      createdBy: 1,
      updatedBy: 1,
      noOfAuctionDays: parseInt(numRows),
      status: 0,
      remarks: remark,
      auctionDate: typeof saleDates == "object" ? saleDates[0] : saleDates,
      auctionDays: selectedSalePrograms.map((ele) => {
        return {
          buyersPromptDate: ele.buyersPromptDate,
          saleDate: ele.saleDate,
          saleProgramDetailId: ele.saleProgramDetailId,
          sellersPromptDate: ele.sellersPromptDate,
          status: 0,
          teaTypeId: ele.teaTypeId,
          teaTypeName: ele.teaTypeName,
        };
      }),
      documentList:
        uploadedFiles == []
          ? uploadedFiles[0]?.map((ele) => {
              return {
                DocumentSize: ele.DocumentSize,
                documentBrief: ele.documentBrief,
                // contentType: ele.contentType,
                documentId: ele.documentId,
                documentName: ele.documentName,
                // documentPath: ele.documentPath,
                status: 0,
              };
            })
          : uploadedFiles,
    };

    dispatch(cancelSaleProgramRequest(formData));
  };

  const cancelDocument = (documentId) => {
    const documentData = {
      SaleProgramId: SaleProgramId[0],
      documentId: documentId,
      updatedBy: 1,
    };
    dispatch(cancelSaleProgramDocumentRequest(documentData));
  };
  function getStatusText(status) {
    switch (status) {
      case 0: {
        return "Pending";
      }
      case 1: {
        return "Active";
      }
      case 2: {
        return "Completed";
      }
      case 3: {
        return "Cancelled";
      }
      default:
        return "-";
    }
  }
  const allowedFileExtensions = [
    "txt",
    "zip",
    "pdf",
    "jpg",
    "jpeg",
    "gif",
    "bmp",
    "png",
    "tif",
    "tiff",
    "doc",
    "xls",
    "ppt",
    "pps",
    "dxf",
    "docx",
    "xlsx",
    "eml",
    "rar",
  ];

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const updatedFiles = [...uploadedFiles];
    const existingFileNames = updatedFiles.map(
      (uploadedFile) => uploadedFile.documentName.split(".")[0]
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      const isExistingFile = existingFileNames.includes(file.name);
      const isSameNameDifferentExtension = existingFileNames.includes(
        fileNameWithoutExtension
      );
      if (isExistingFile || isSameNameDifferentExtension) {
        toast.warning(`File "${file.name}" already exists.`);
        continue; // Skip this file and proceed to the next one
      }
      if (
        !allowedFileExtensions.includes(fileExtension) ||
        existingFileNames.includes(fileNameWithoutExtension)
      ) {
        toast.error(`File "${file.name}" is not allowed or already exists.`);
        continue; // Skip this file and proceed to the next one
      }
      if (file.size <= MAX_FILE_SIZE) {
        try {
          // Read the file content as a Base64 string using FileReader and async/await
          const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              // Extract the Base64 content from the data URI
              const base64String = event.target.result.split(",")[1];
              resolve(base64String);
            };

            reader.onerror = (event) => {
              reject(event.target.error);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
          });

          const fileInfo = {
            documentName: file.name,
            // documentPath: "xyz/xyz.jpeg",
            documentBrief: "", // Empty document brief, you can set the actual brief value
            DocumentSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            status: 0,
            documentBytes: base64Content, // Store the Base64 content in fileInfo
            // contentType: file.type,
          };
          updatedFiles.push(fileInfo);
        } catch (error) {
          console.error("Error reading the file:", error);
          // Handle the error as per your requirement (e.g., show an error message)
        }
      } else {
        toast.error(`File "${file.name}" has more than 10MB.`);
      }
    }

    // Update the state after all files have been processed
    setUploadedFiles(updatedFiles);
  };

  const handleClosingDate = (e) => {
    const inputValue = e.target.value;
    const currentDate = new Date();

    const inputDate = new Date(inputValue);

    if (inputDate > currentDate) {
      setClosingDate(e.target.value);
    } else {
      // The input date is equal to or earlier than the current date
      toast.error("Input date is equal to or earlier than the current date.");
    }
  };

  const handlePublicingDate = (e) => {
    const pubDate = new Date(e.target.value);
    const nextDayDate = new Date(pubDate);

    const publisceingDate = new Date(e.target.value);
    const closingDates = new Date(closingDate);

    const closingMonth = closingDate?.split("-")[1];
    const publisceingMonth = e.target.value?.split("-")[1];

    if (publisceingDate > closingDates) {
      nextDayDate.setDate(pubDate?.getDate() + 1);
      setMinDate(nextDayDate?.toISOString()?.split("T")?.at(0));
      setPublishingDate(e.target.value);
    } else {
      toast.error(
        "Publishing date cannot be less than or equal to the closing date"
      );
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")?.at(0);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="p-2">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Season</FormLabel>
                <FormControl
                  as="select"
                  name="age1"
                  value={year || ""}
                  onChange={(e) => setYears(e.target.value)}
                  disabled
                >
                  {generateYearOptions()}
                </FormControl>
              </FormGroup>
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Sale No</FormLabel>
                <FormControl
                  as="select"
                  value={selectedSaleNo || ""}
                  onChange={handleSaleNoChange}
                  size="sm"
                  disabled={isEdit ? true : isDisabled}
                >
                  {saleNo?.map((e) => (
                    <option key={e.saleNo} value={e.saleNo}>
                      {e.saleNo}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Catalog Closing Date</FormLabel>
                <FormControl
                  as="input"
                  type="date"
                  size="sm"
                  // value={closingDate}
                  value={
                    isEdit == true || isDisabled == true
                      ? typeof closingDate == "object"
                        ? closingDate[0]
                        : closingDate
                      : closingDate
                  }
                  disabled={isDisabled}
                  onChange={(e) => handleClosingDate(e)}
                  min={getMinDate()} // Set the minimum date allowed
                />
              </FormGroup>
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Catalog Publish Date</FormLabel>
                <FormControl
                  as="input"
                  type="date"
                  size="sm"
                  // value={publishingDate}
                  value={
                    isEdit == true || isDisabled == true
                      ? publishingDate
                      : publishingDate || ""
                  }
                  min={
                    typeof closingDate == "object"
                      ? closingDate[0]
                      : closingDate
                  }
                  disabled={isDisabled}
                  onChange={(e) => handlePublicingDate(e)}
                />
              </FormGroup>
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>No. of Auction Days</FormLabel>
                <FormControl
                  as="select"
                  value={numRows || auctionDays[0]}
                  disabled={isDisabled}
                  onChange={handleAuctionDaysChange}
                  size="sm"
                >
                  {auctionDays?.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>

              {isDisabled !== true ? (
                <div className="col-auto py-3">
                  <div className="BtnGroup">
                    <Button className="mt-2 SubmitBtn" type="submit">
                      {isEdit == true ? "Update" : "Submit"}
                    </Button>
                    <Button
                      className="SubmitBtn ml-2"
                      onClick={() => resateForm()}
                    >
                      <i className="fa fa-refresh"></i>
                    </Button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="col-12 mt-4">
            <Card className="p-2">
              {
                <>
                  <Table>
                    <thead>
                      <tr>
                        <th>Tea Type</th>
                        <th>Sale Date</th>
                        <th>Buyer's Prompt Date</th>
                        <th>Seller's Prompt Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsOnPage
                        .slice(startIndex, endIndex)
                        ?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <FormControl
                                as="select"
                                disabled={isDisabled}
                                size="sm"
                                value={
                                  selectedSalePrograms[index]?.teaTypeId || ""
                                }
                                onChange={(e) => {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    teaTypeId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }}
                              >
                                {teaTypeList?.length > 0
                                  ? teaTypeList?.map((item, index) => (
                                      <option value={item?.teaTypeId}>
                                        {item.teaTypeName}
                                      </option>
                                    ))
                                  : "No Data"}
                              </FormControl>
                            </td>
                            <td>
                              <input
                                type="date"
                                id="saleDate"
                                value={
                                  selectedSalePrograms[index]?.saleDate?.split(
                                    "T"
                                  )[0] || ""
                                }
                                disabled={isDisabled}
                                onChange={(e) => {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    saleDate: e.target.value,
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }}
                                min={minDate}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                disabled={true}
                                value={
                                  selectedSalePrograms[index]?.buyersPromptDate
                                    ?.split("T")
                                    ?.at(0) || ""
                                }
                              />
                            </td>
                            <td>
                              <input
                                disabled={true}
                                type="date"
                                value={
                                  selectedSalePrograms[index]?.sellersPromptDate
                                    ?.split("T")
                                    ?.at(0) || ""
                                  // selectedSalePrograms[index]?.sellersPromptDate?
                                }
                              />
                            </td>
                            <td>
                              {selectedSaleProgram?.status === null
                                ? "-"
                                : getStatusText(selectedSaleProgram?.status)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </>
              }

              <div>
                <ul className="pagination">
                  {/* Previous page button */}
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {/* Page buttons */}
                  {pageNumbers.map((page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {/* Next page button */}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
        <Card className="mt-3 FileUploadBox">
          <Card.Body>
            <Card.Title>File Upload</Card.Title>
            <div className="FileUpload">
              <input
                type="file"
                multiple
                // onChange={handleFileUpload}
                id="fileInput"
                onChange={handleFileUpload}
                disabled={isDisabled}
              />
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles?.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <span>
                        {isDisabled == true || isEdit == true
                          ? file?.documentName
                          : file?.documentName}
                      </span>
                    </td>
                    <td>
                      {isDisabled == true || isEdit == true ? (
                        <>
                          {file?.status === 0
                            ? "Pending"
                            : file?.status === 1
                            ? "Active"
                            : file?.status === 2
                            ? "Cancelled"
                            : ""}
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>

                      <input
                        type="text"
                        value={
                          isDisabled == true || isEdit == true
                            ? file?.documentBrief
                            : file?.documentBrief
                        }
                        onChange={(event) =>
                          updateFileBrief(index, event.target.value)
                        }
                        placeholder="Enter document brief"
                        disabled={isDisabled}
                        required
                      />
                    </td>
                    <td>
                      {isDisabled === true || isEdit ? (
                        <>
                          <DownloadFile
                            documentName={file.documentName}
                            documentBytes={file.documentBytes}
                            element={
                              <i
                                className="fa fa-download"
                                style={{ color: "green", cursor: "pointer" }}
                              ></i>
                            }
                          />
                          {/* <a href={file.documentPath} download={file.documentName}>
                      
                    </a> */}
                          <button
                            style={{
                              backgroundColor: "transparent",
                              cursor: "pointer",
                            }}
                            type="button"
                            onClick={() => cancelDocument(file.documentId)}
                          >
                            <i
                              className="fa fa-cancel"
                              style={{ color: "red", cursor: "pointer" }}
                            ></i>
                          </button>
                        </>
                      ) : (
                        <i
                          className="fa fa-times"
                          onClick={() => removeFile(index)}
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
          {status !== null && isEdit ? <div>{status}</div> : ""}
        </Card>
      </form>

      <ConfirmationModal
        show={showModal}
        onHide={closeModal}
        onDelete={handleCencal}
        setRemark={setRemark}
      />

      <ToastContainer autoClose={1000}/>
    </>
  );
};

export default AuctionCard;
