import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../modal/modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";

import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Accordion,
} from "@mui/material";
import { SelectAll } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import { useDispatch } from "react-redux";
import {
  fetchAwrListRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsIdRequest,
  fetchMarkRequest,
  fetchMarkTypeRequest,
  fetchSaleNumbersRequest,
  fetchSampleShortageListRequest,
  fetchSampleShortageRequest,
  fetchSessionTypeRequest,
  fetchWarehouseUserRequest,
  teaTypeAction,
} from "../../../../store/actions";
import CustomeFormCreater from "../../../../components/common/formCreater/CustomeFormCreater";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axios from "axios";
import ConvertTo12HourFormat from "../../../../components/common/dateAndTime/ConvertTo12HourFormat";
import { ToastContainer, toast } from "react-toastify";
import axiosMain from "../../../../http/axios/axios_main";
import PrePostDate from "./PrePostDate";

const allSampleShortage = [];

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const currentWeek = Math.ceil(
  ((new Date() - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

console.log(currentWeek, currentDate, "currentWeek");

const validationSchema = Yup.object().shape({
  season: Yup.string().required("Season is required"),
  saleNo: Yup.string().required("Sale No is required"),
});

function Maintananse({ ...dataBy }) {
  const [rows, setRows] = useState(allSampleShortage);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [rowValues, setRowValues] = useState([]);

  const dispatch = useDispatch();

  const [handleChnage, setHandleChnage] = useState(false);
  const [saleNo, setSaleNo] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [disable, setDisable] = useState(false);
  const [numRows, setNumRows] = useState(1);
  const [markDataList, setMarkDataList] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [startDate, setStartDate] = useState("");

  const [selectedSalePrograms, setSelectedSalePrograms] = useState([]);
  const [sessionTypes, setSessionType] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, numRows);
  const itemsOnPage = Array?.from(
    { length: numRows },
    (_, index) => index + startIndex
  );

  const { dataByID, onEdit, expandedTab } = dataBy;

  // const [formData, setFormData] = useState(
  //   dataBy?.dataByID?.responseData?.at(0)?.searchParam
  // );
  const [auctioneer, setAuctioneer] = useState([]);
  const [dataListBy, setDataBy] = useState(dataBy);
  const [smShow, setSmShow] = useState(false);
  const [show, setShow] = useState(false);
  const [prePostData, setPrePostData] = useState([]);
  const [saleDates, setSaleDates] = useState([]);
  const initialValues = {
    season: currentYear?.toString(),
    saleNo: null,
    saleDate: "",
    teaTypeId: null,
    createdBy: 1,
    noOfSession: 1,
    sessionList: selectedSalePrograms,
  };

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );
  const markType = useSelector((state) => state.mark.markTypeData.responseData);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");

      // handleSubmit(values);
      const {
        season,
        saleNo,
        saleDate,
        teaTypeId,
        createdBy,
        categoryId,
        noOfSession,
        sessionList,
      } = values;
      if (sessionList?.length > 0) {
        const requiredKeys = [
          "userId",
          "marketTypeId",
          "remarks",
          "categoryId",
          "noOfLots",
        ];

        // const results = selectedSalePrograms.map((program, index) => {
        //   const missingKeys = [];
        //   const emptyValueKeys = [];

        //   requiredKeys.forEach((key) => {
        //     if (!(key in program)) {
        //       missingKeys.push(key);
        //     } else if (program[key] === "") {
        //       emptyValueKeys.push(key);
        //     }
        //   });

        //   return {
        //     programIndex: index + 1,
        //     missingKeys,
        //     emptyValueKeys,
        //     allRequiredKeysPresent:
        //       missingKeys.length === 0 && emptyValueKeys.length === 0,
        //   };
        // });

        // console.log(results, "results");

        const apiUrl = `/preauction/AuctionSession/CreateAuctionSession`;

        const extractedData = selectedSalePrograms.map((program) => ({
          auctionSessionId: program.auctionSessionId,
          auctionSessionDetailId: program.auctionSessionDetailId,
          userId: program.userId,
          marketTypeId: program.marketTypeId,
          categoryId: program.categoryId,
          teaTypeId: program.teaTypeId,
          sessionTypeId: program.sessionTypeId,
          startDate: program.startDate,
          enddate: program.enddate,
          minimumBidTime: program.minimumBidTime,
          noOfLots: program.noOfLots,
          updatedBy: 1,
        }));

        if (
          selectedSalePrograms?.some((ele) => ele.noOfLots > 0) &&
          selectedSalePrograms?.some((ele) => ele.minimumBidTime > 0) &&
          selectedSalePrograms?.some((ele) => ele.userId) > 0
        ) {
          if (selectedSalePrograms?.some((ele) => ele.remarks !== "")) {
            if (dataBy?.dataByID?.responseData?.at(0) !== undefined) {
              axiosMain
                .post(
                  "/preauction/AuctionSession/UpdateAuctionSession",
                  extractedData?.at(0)
                )
                .then((response) => {
                  console.log(response, "Sss");
                  if (response.data.statusCode === 200) {
                    toast.success(response.data.message);
                    formik.resetForm();
                  } else {
                    toast.warning(response.data.message);
                  }
                  // Handle the API response here
                  // setRows(response?.data?.responseData[0]);
                })
                .catch((error) => {
                  // Handle errors here
                });
            } else {
              axiosMain
                .post(apiUrl, {
                  season: season,
                  saleNo: parseInt(saleNo),
                  saleDate: saleDate,
                  teaTypeId: teaTypeId,
                  categoryId:categoryId,
                  createdBy: createdBy,
                  noOfSession: noOfSession,
                  sessionList: sessionList,
                })
                .then((response) => {
                  console.log(response, "Sss");
                  if (response.data.statusCode === 200) {
                    toast.success(response.data.message);
                    formik.resetForm();
                  } else {
                    toast.warning(response.data.message);
                  }
                  // Handle the API response here
                  // setRows(response?.data?.responseData[0]);
                })
                .catch((error) => {
                  // Handle errors here
                });
            }
          } else {
            toast.error("Please fill Remark.");
          }
        } else {
          toast.error("Please Check No Of Lots , MBT , Auctioneer.");
        }
      } else {
        toast.error("Please fill auction session.");
      }

      console.log(values, selectedSalePrograms, "results");
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  // useEffect(() => {
  //   if (formData !== undefined) {

  //   }
  // }, [formData]);
  // useEffect(() => {
  //   setDataBy(dataListBy);
  // }, [dataBy]);

  useEffect(() => {
    let data = dataBy?.dataByID?.responseData?.at(0)?.searchParam;

    if (data !== undefined) {
      // setFormData(dataByID.dataByID.responseData?.at(0)?.searchParam);
      formik.setValues({
        ...formik.values,
        season: data.season,
        saleNo: data.saleNo,
        saleDate: data.saleDate.split("T")[0],
        teaTypeId: data.teaTypeId,
        createdBy: 1,
        noOfSession: data.noOfSession,
        sessionList: selectedSalePrograms,
      });
      // setFormTableData(
      //   dataByID.dataByID.responseData?.at(0)?.auctionSessionList
      // );
      setSelectedSalePrograms([
        dataBy?.dataByID?.responseData?.at(0)?.auctionSessionList,
      ]);
    } else {
      console.log(data);
    }
  }, [dataBy]);
  const resetForm = () => {
    formik.handleReset();
    setHandleChnage(false); // Reset the "handleChange" flag as well
    fields
      .filter(
        (field) => field.type === "select" || field.type === "disableSelect"
      )
      .forEach((field) => {
        formik.setFieldValue(field.name, "");
      });
    setSelectedSalePrograms([
      {
        userId: 0,
        marketTypeId: 0,
        categoryId: 1,
        teaTypeId: 1,
        sessionTypeId: 1,
        saleDate: formik.values.saleDate,
        startDate: null,
        enddate: null,
        minimumBidTime: 1,
        noOfLots: 0,
        status: 0,
        remarks: "",
      },
    ]);

    // console.log(, "updatedProgram");
  };

  useEffect(() => {
    resetForm();

    console.log(expandedTab, "expandedTab");
  }, [expandedTab]);

  useEffect(() => {
    formik.setFieldValue("sessionList", selectedSalePrograms);
  }, [selectedSalePrograms]);

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);
  const sessionType = useSelector(
    (state) => state?.sessionTypesReducer?.data?.responseData
  );
  // console.log(invoiceData, "invoiceData");
  useEffect(() => {
    dispatch(fetchSaleNumbersRequest(formik.values.season));
    dispatch(teaTypeAction());
    dispatch(fetchMarkTypeRequest());
    dispatch(fetchCategoryRequest());
    dispatch(fetchSessionTypeRequest());
    axiosMain
      .post("/preauction/SaleProgram/GetAuctioneerList")
      .then((response) => {
        // Handle the API response here
        setAuctioneer(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });

    const updatedProgram = {
      ...selectedSalePrograms[0],
      userId: 0,
      marketTypeId: 0,
      categoryId: 1,
      teaTypeId: 1,
      sessionTypeId: 1,
      saleDate: formik.values.saleDate,
      startDate: null,
      enddate: null,
      minimumBidTime: 1,
      noOfLots: 0,
      status: 0,
      remarks: "",
    };

    updateSelectedSaleProgram(0, updatedProgram);
  }, []);

  useEffect(() => {
    setSaleNo(saleNumber);
    // setCategory(category);
    setSessionType(sessionType);
    setTeaTeatypeList(teaType);
  }, [saleNumber, teaType, category, sessionType]);

  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetSaleDateAndTeaType`;
    const apiUrlAuctioneer = "/preauction/Common/BindAuctioneerByInvoice";

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "") {
      axiosMain
        .post(apiUrl, { saleNo: parseInt(saleNo), season: season })
        .then((response) => {
          // Handle the API response here
          formik.setFieldValue(
            "saleDate",
            response?.data?.responseData[0]?.saleDate?.split("T")[0]
          );

          setSaleDates(response?.data?.responseData);

          itemsOnPage
            .slice(startIndex, endIndex)
            ?.map(
              (ele, index) =>
                (selectedSalePrograms[index].saleDate =
                  response?.data?.responseData[0]?.saleDate?.split("T")[0])
            );
          itemsOnPage
            .slice(startIndex, endIndex)
            ?.map(
              (ele, index) =>
                (selectedSalePrograms[index].teaTypeId =
                  response?.data?.responseData[0]?.teaTypeId)
            );
          formik.setFieldValue(
            "teaTypeId",
            response?.data?.responseData[0]?.teaTypeId
          );
        })
        .catch((error) => {
          // Handle errors here
        });
      axiosMain
        .post(apiUrlAuctioneer, {
          season: season,
          saleNo: parseInt(saleNo),
          AuctioneerId: 10056,
        })
        .then((response) => {
          // Handle the API response here'

          setAuctioneer(response?.data?.responseData);
          // setSelectedSalePrograms({
          //   ...selectedSalePrograms,
          //   categoryId: response?.data?.responseData[0].categoryId,
          // });
          console.log(response);
        })
        .catch((error) => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    setNumRows(formik.values.noOfSession);
  }, [formik.values.noOfSession]);

  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear; i > currentYear - 7; i--) {
      options.push({ label: i, value: i });
    }

    return options;
  }

  const fields = [
    {
      label: "Season",
      name: "seson",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? "disableSelect"
          : "select",
      options: generateYearOptions(),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Sale No",
      name: "saleNo",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? "disableSelect"
          : "select",
      options: saleNo?.map((ele) => {
        return { label: ele.saleNo, value: ele.saleNo };
      }),
      required: false,
      className: "FormGroup",
    },
    // {
    //   label: "Sale Date",
    //   name: "saleDate",
    //   type: "disableDatePicker",
    //   required: true,
    //   className: "FormGroup",

    // },
    {
      label: "Sale Date",
      name: "saleDate",
      type: "select",
      options: saleDates?.map((ele) => {
        return { label: ele.saleDate, value: ele.saleDate?.split("T")?.at(0) };
      }),
      required: true,
      className: "FormGroup",
    },
    {
      label: "Tea Type",
      name: "teaTypeId",
      type: "disableSelect",
      options: teaTypeList?.map((ele) => {
        return { label: ele.teaTypeName, value: ele.teaTypeId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "No of Session",
      name: "noOfSession",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? "disable"
          : "text",
      required: false,
      className: "FormGroup",
    },
  ];

  const Controlls = () => {
    return (
      <>
        {/* <div className="BtnGroup">
          <Button type="submit" className="SubmitBtn">
            Refresh
          </Button>
          <Button type="submit" className="SubmitBtn">
            Update Actual Lots
          </Button>

          <Button className="SubmitBtn">Close</Button>
          {/* <Button
            type="submit"
            className="SubmitBtn w-25"
            onClick={() => {
              if (
                formik.values.saleNo !== null &&
                formik.values.mark !== "" &&
                formik.values.warehouse !== "" &&
                formik.values.grade !== "" &&
                formik.values.invoiceDate !== ""
              ) {
                axios
                  .post(
                    "/preauction/AWRDetails/GetInvoicesByAWRDetails",

                    {
                      season: formik.values.season,
                      saleNo:
                        formik.values.saleNo === ""
                          ? parseInt(currentWeek)
                          : parseInt(formik.values.saleNo),
                      markId: parseInt(formik.values.mark),
                      wareHouseUserRegId: parseInt(formik.values.warehouse),
                      gradeId: parseInt(formik.values.grade),
                      invoiceDate: formik.values.invoiceDate + "T17:16:40",
                    }
                  )
                  .then((res) => {
                    setTableData(res.data.responseData);
                    const data = res.data.responseData.map(
                      (ele) => ele.totalWeight
                    );
                    // console.log(
                    //   ,"res"
                    // );

                    if (data.length > 0) {
                      let gpq = data.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue;
                      });
                      formik.setFieldValue("gatePassQuantity", gpq);
                    }
                  });
              } else {
                toast.error(
                  "Please First fill those fields Sale No,Mark,WareHouse,Grade and Invoice Date"
                );
              }
            }}
          >
            Get AWR Detail
          </Button> */}
        {/* <label className="btn SubmitBtn mr-2">
            <ImportExportIcon />
          </label> */}

        {/* <label htmlFor="fileUpload" className="btn SubmitBtn mr-2">
            <FileUploadIcon />
          </label> */}
        {/* <input
            type="file"
            className="form-control"
            id="fileUpload"
            accept=".xls, .xlsx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            multiple
          /> */}
        {/* <label className="btn SubmitBtn">
            <PictureAsPdfIcon />
        </label>
        </div> */}
      </>
    );
  };

  const updateSelectedSaleProgram = (index, updatedProgram) => {
    try {
      const updatedPrograms = [...selectedSalePrograms];
      updatedPrograms[index] = updatedProgram;

      // You can perform the API call regardless of whether saleDate is available or not

      setSelectedSalePrograms(updatedPrograms);
    } catch (error) {
      console.error("API call error:", error);
      // Handle the error if needed
    }
  };

  // useEffect(() => {
  //   const saleNo = formik.values.saleNo;
  //   const season = formik.values.season;
  //   const apiUrlCatagory = "/preauction/Common/BindCatagoryByParam";
  //   if (dataBy?.dataByID?.responseData?.at(0) !== undefined) {
  //     if (selectedSalePrograms?.length > 0) {
  //       selectedSalePrograms.map((ele) => {
  //         if (ele.userId) {
  //           axiosMain
  //             .post(apiUrlCatagory, {
  //               season: season,
  //               saleNo: parseInt(saleNo),
  //               AuctioneerId: parseInt(ele.userId),
  //             })
  //             .then((response) => {
  //               // Handle the API response here'

  //               setCategory(response?.data?.responseData);
  //               // setSelectedSalePrograms({
  //               //   ...selectedSalePrograms,
  //               //   categoryId: response?.data?.responseData[0].categoryId,
  //               // });
  //               console.log(response);
  //             })
  //             .catch((error) => {
  //               // Handle errors here
  //             });
  //         }
  //       });
  //     }
  //   }
  // }, [selectedSalePrograms]);

  const validateTimeRanges = () => {
    selectedSalePrograms.map((ele, index) => {
      if (
        selectedSalePrograms[index - 1]?.endTime >
        selectedSalePrograms[index].startTime
      ) {
        console.log(
          "The end time of the first interval is greater than the start time of the second interval."
        );
      } else {
        console.log(
          "The end time of the first interval is not greater than the start time of the second interval."
        );
      }
    });
  };

  // console.log(, "validateTimeRanges");

  const handlePrePost = (rowData) => {
    // if (
    //   dataBy?.dataByID?.responseData?.at(0)?.auctionSessionList !== undefined
    // ) {
    //   setPrePostData(
    //     dataBy?.dataByID?.responseData?.at(0)?.auctionSessionList?.at(rowData)
    //   );
    // } else {
    //   setPrePostData({});
    // }
    setPrePostData(selectedSalePrograms[rowData]);

    axiosMain
      .post(
        "/preauction/AuctionSession/PrePostponeAuctionSessionRequest?auctionSessionDetailId=" +
          selectedSalePrograms[rowData]?.auctionSessionDetailId
      )
      .then((response) => {
        setPrePostData(response.data.responseData?.at(0));
      });

    setSmShow(true);
  };

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          title={"Are you sure you "}
          onDelete={() => {
            setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />

        <form onSubmit={formik.handleSubmit}>
          <div className="">
            <div className="row">
              <div className="col-md-12">
                <CustomeFormCreater
                  fields={fields}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  // handleSubmit={() => handleSubmit()}
                  // uploadedFiles={uploadedFiles}
                  // setUploadedFiles={setUploadedFiles}
                  // handleFileRemove={handleFileRemove}
                  formik={formik}
                  Controlls={Controlls}
                  setHandleChnage={setHandleChnage}
                />
                {/* <div className="col-lg-2 my-3">
                    <div className="row g-3">
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Add
                      </Button>
                      <Button variant="primary">Update Actual Lots</Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          let data = {
                            season: currentYear?.toString(),
                            saleNo: currentWeek,
                          };
                        }}
                      >
                        Refresh
                      </Button>
                    </div>
                  </div> */}
              </div>
              <div className="col-md-12 mt-3">
                <table className="table table-responsive">
                  <thead>
                    <tr>
                      <th>Auctioneer</th>
                      <th>Market Type</th>
                      <th>Category</th>
                      <th>TeaType</th>
                      <th>Session Type</th>
                      <th>Sale Date</th>
                      <th>Start Date</th>
                      <th>EndDate</th>
                      <th>minimumBidTime</th>
                      <th>No Of Lots</th>
                      <th>Status</th>
                      <th
                        style={{
                          display:
                            dataBy?.dataByID?.responseData?.at(0) !== undefined
                              ? "none"
                              : "block",
                        }}
                      >
                        Remark
                      </th>
                      <th
                        style={{
                          display:
                            dataBy?.dataByID?.responseData?.at(0) !== undefined
                              ? "block"
                              : "none",
                        }}
                      >
                        {" "}
                        Action{" "}
                      </th>
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
                              size="sm"
                              name="userId"
                              value={selectedSalePrograms[index]?.userId || ""}
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].userId = parseInt(
                                    e.target.value
                                  );
                                  const saleNo = formik.values.saleNo;
                                  const season = formik.values.season;
                                  const apiUrlCatagory =
                                    "/preauction/Common/BindCatagoryByParam";
                                  axiosMain
                                    .post(apiUrlCatagory, {
                                      season: season,
                                      saleNo: parseInt(saleNo),
                                      AuctioneerId: parseInt(e.target.value),
                                    })
                                    .then((response) => {
                                      // Handle the API response here'

                                      setCategory(response?.data?.responseData);
                                      selectedSalePrograms[index].categoryId =
                                        response?.data?.responseData?.at(
                                          0
                                        )?.categoryId;
                                      // setSelectedSalePrograms({
                                      //   ...selectedSalePrograms,
                                      //   categoryId: response?.data?.responseData[0].categoryId,
                                      // });
                                      console.log(response);
                                    })
                                    .catch((error) => {
                                      // Handle errors here
                                    });
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    userId: parseInt(e.target.value),
                                  };
                                  const saleNo = formik.values.saleNo;
                                  const season = formik.values.season;
                                  const apiUrlCatagory =
                                    "/preauction/Common/BindCatagoryByParam";
                                  axiosMain
                                    .post(apiUrlCatagory, {
                                      season: season,
                                      saleNo: parseInt(saleNo),
                                      AuctioneerId: parseInt(e.target.value),
                                    })
                                    .then((response) => {
                                      // Handle the API response here'

                                      setCategory(response?.data?.responseData);
                                      // setSelectedSalePrograms({
                                      //   ...selectedSalePrograms,
                                      //   categoryId: response?.data?.responseData[0].categoryId,
                                      // });
                                      console.log(response);
                                    })
                                    .catch((error) => {
                                      // Handle errors here
                                    });
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            >
                              <option value={0}>Select Auctioneer</option>

                              {auctioneer?.length > 0 ? (
                                auctioneer?.map((item, index) => (
                                  <option value={item.userId} key={item.userId}>
                                    {item.userName}
                                  </option>
                                ))
                              ) : (
                                <option>No Data</option>
                              )}
                            </FormControl>
                          </td>
                          <td>
                            <FormControl
                              as="select"
                              size="sm"
                              name="marketTypeId"
                              value={
                                selectedSalePrograms[index]?.marketTypeId || ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].marketTypeId =
                                    parseInt(e.target.value);
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    marketTypeId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            >
                              {markType?.length > 0 ? (
                                markType?.map((item, index) => (
                                  <option
                                    value={item.marketTypeId}
                                    key={item.marketTypeId}
                                  >
                                    {item.marketTypeName}
                                  </option>
                                ))
                              ) : (
                                <option>No Data</option>
                              )}
                            </FormControl>
                          </td>
                          <td>
                            <FormControl
                              as="select"
                              size="sm"
                              name="categoryId"
                              value={
                                selectedSalePrograms[index]?.categoryId || ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].categoryId =
                                    parseInt(e.target.value);
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    categoryId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            >
                              <option value={0}>Select Category</option>
                              {catagory?.length > 0
                                ? catagory?.map((item, index) => (
                                    <option value={item.categoryId} key={index}>
                                      {item.categoryName}
                                    </option>
                                  ))
                                : "No Data"}
                            </FormControl>
                          </td>
                          <td>
                            <FormControl
                              as="select"
                              size="sm"
                              name="teaTypeId"
                              value={
                                selectedSalePrograms[index]?.teaTypeId ||
                                formik.values.teaTypeId
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].teaTypeId =
                                    parseInt(e.target.value);
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    teaTypeId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              disabled
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
                            <FormControl
                              as="select"
                              size="sm"
                              value={
                                selectedSalePrograms[index]?.sessionTypeId || ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].sessionTypeId =
                                    parseInt(e.target.value);
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    teaTypeId: formik.values.teaTypeId,
                                    sessionTypeId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            >
                              {sessionTypes?.length > 0
                                ? sessionTypes?.map((item, index) => (
                                    <option value={item?.sessionTypeId}>
                                      {item.sessionTypeName}
                                    </option>
                                  ))
                                : "No Data"}
                            </FormControl>
                          </td>
                          <td>
                            <input
                              type="date"
                              id="saleDate"
                              value={formik?.values?.saleDate}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              id="startDate"
                              value={
                                selectedSalePrograms[index]?.startDate?.split(
                                  "T"
                                )[1] || ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].startDate =
                                    formik?.values?.saleDate +
                                    "T" +
                                    e.target.value +
                                    ":00";
                                  setStartDate(e.target.value);
                                } else {
                                  validateTimeRanges();

                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    saleDate: formik.values.saleDate,
                                    startDate:
                                      formik.values.saleDate +
                                      "T" +
                                      e.target.value +
                                      ":00",
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );

                                  setStartDate(e.target.value);
                                }

                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              id="enddate"
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                              // min={startDate || undefined} // Set min time to the start time
                              value={
                                selectedSalePrograms[index]?.enddate?.split(
                                  "T"
                                )[1] || ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  if (e.target.value > startDate) {
                                    selectedSalePrograms[index].enddate =
                                      formik.values.saleDate +
                                      "T" +
                                      e.target.value +
                                      ":00";
                                  } else {
                                    toast.error(
                                      "End Date must be grater then start date"
                                    );
                                  }
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    enddate:
                                      formik.values.saleDate +
                                      "T" +
                                      e.target.value +
                                      ":00",
                                  };

                                  if (e.target.value > startDate) {
                                    updateSelectedSaleProgram(
                                      index,
                                      updatedProgram
                                    );
                                  } else {
                                    toast.error(
                                      "End Date must be grater then start date"
                                    );
                                  }
                                }

                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id="minimumBidTime"
                              value={
                                selectedSalePrograms[index]?.minimumBidTime ||
                                ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].minimumBidTime =
                                    parseInt(e.target.value) || "";
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    minimumBidTime:
                                      parseInt(e.target.value) || "",
                                  };

                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id="No of Lots"
                              value={
                                selectedSalePrograms[index]?.noOfLots || ""
                              }
                              maxLength={4}
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].noOfLots =
                                    parseInt(e.target.value);
                                  setStartDate(e.target.value);
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    noOfLots: parseInt(e.target.value),
                                    status: 0,
                                  };

                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }

                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id="Status"
                              value={
                                selectedSalePrograms[index]?.status === 5
                                  ? "Cancelled"
                                  : "Pending"
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].startDate = 0;
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    status: 0,
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // const pubDate = new Date(e.target.value);
                                  // const nextDayDate = new Date(pubDate);
                                  // nextDayDate.setDate(pubDate?.getDate() + 1);
                                  // setMinDate(
                                  //   nextDayDate?.toISOString()?.split("T")[0]
                                  // );
                                }
                              }}
                              disabled
                            />
                          </td>
                          <td
                            style={{
                              display:
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? "none"
                                  : "block",
                            }}
                          >
                            <input
                              type="text"
                              id="Remark"
                              value={selectedSalePrograms[index]?.remarks || ""}
                              onChange={(e) => {
                                const updatedProgram = {
                                  ...selectedSalePrograms[index],
                                  remarks: e.target.value,
                                };
                                updateSelectedSaleProgram(
                                  index,
                                  updatedProgram
                                );
                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            />
                          </td>
                          <td
                            style={{
                              display:
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? ""
                                  : "none",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handlePrePost(item)}
                            >
                              Pre/Postponad
                            </button>
                            {/* <button
                              type="button"preauction/AuctionSession/UpdateAuctionSession
                              onClick={() => {
                                axiosMain.post(
                                  "/AuctionSession/CancelAuctionSession",
                                  {
                                    auctionSessionId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionId,
                                    auctionSessionDetailId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionDetailId,
                                    updatedBy: 1,
                                  }
                                );
                              }}
                            >
                              Cancle
                            </button> */}
                            {/* <button
                              type="button"
                              onClick={async () => {
                                const response = await axiosMain.post(
                                  "/preauction/AuctionSession/CancelAuctionSession",
                                  {
                                    auctionSessionId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionId,
                                    auctionSessionDetailId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionDetailId,
                                    updatedBy: 1,
                                  }
                                );
                                console.log(response, "responseresponse");
                                if (response.data.statusCode === 204) {
                                  // Show toast message here
                                  toast.error(response.data.message);
                                }
                                if (response.data.statusCode === 200) {
                                  // Show toast message here
                                  toast.success(response.data.message);
                                }
                              }}
                            >
                              Cancel
                            </button> */}
                          </td>

                          {/* <td>
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
                              updateSelectedSaleProgram(index, updatedProgram);
                              // const pubDate = new Date(e.target.value);
                              // const nextDayDate = new Date(pubDate);
                              // nextDayDate.setDate(pubDate?.getDate() + 1);
                              // setMinDate(
                              //   nextDayDate?.toISOString()?.split("T")[0]
                              // );
                            }}
                            min={minDate}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            disabled={true}
                            value={
                              selectedSalePrograms[
                                index
                              ]?.buyersPromptDate?.split("T")[0] || ""
                            }
                          />
                        </td>
                        <td>
                          <input
                            disabled={true}
                            type="date"
                            value={
                              selectedSalePrograms[
                                index
                              ]?.sellersPromptDate?.split("T")[0] || ""
                              // selectedSalePrograms[index]?.sellersPromptDate?
                            }
                          />
                        </td>
                        <td>
                          {selectedSaleProgram?.status === null
                            ? "-"
                            : getStatusText(selectedSaleProgram?.status)}
                        </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="col-auto py-3">
                <div className="BtnGroup ">
                  <Button
                    type="submit"
                    className="SubmitBtn"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   console.log(startDate, "startDate");
                    // }}
                  >
                    {dataBy?.dataByID?.responseData?.at(0) !== undefined
                      ? "Update"
                      : "Submit"}
                  </Button>
                  {dataBy?.dataByID?.responseData?.at(0) !== undefined ? (
                    ""
                  ) : (
                    <Button
                      type="button"
                      onClick={resetForm}
                      className="SubmitBtn"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
      <Modal
        size="xl"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Prepone/Postpone Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to want to Prepone/Postpone the selected auction session?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(true)}>Yes</Button>
          <Button onClick={() => setShow(false)}>No</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show}
        size="xl"
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {`Postpone details of auctioneer ${prePostData?.userName} for Season ${formik.values.season} Sale No. ${formik.values.saleNo} and Tea Type: ${prePostData?.teaTypeName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrePostDate dateAndTime={prePostData} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Maintananse;
