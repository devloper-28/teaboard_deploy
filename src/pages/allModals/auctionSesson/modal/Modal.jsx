import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
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
import { useDispatch } from "react-redux";
import {
  fetchAwrListRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsIdRequest,
  fetchMarkRequest,
  fetchSaleNumbersRequest,
  fetchSampleShortageListRequest,
  fetchSampleShortageRequest,
  fetchWarehouseUserRequest,
} from "../../../../store/actions";
import CustomeFormCreater from "../../../../components/common/formCreater/CustomeFormCreater";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axios from "axios";
import ConvertTo12HourFormat from "../../../../components/common/dateAndTime/ConvertTo12HourFormat";
import Maintananse from "../maintanance/Maintananse";
import { ToastContainer, toast } from "react-toastify";
import axiosMain from "../../../../http/axios/axios_main";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";

const allSampleShortage = [];

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const currentWeek = Math.ceil(
  ((new Date() - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

const validationSchema = Yup.object().shape({
  season: Yup.string().required("Season is required"),
  saleNo: Yup.string().required("Sale No is required"),
});

const initialValues = {
  season: currentYear?.toString(),
  saleNo: 0,
  saleDate: "",
  noOfSession: "",
  teaType: "",
  teaTypeId: null,
};

const Modal = () => {
  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState(allSampleShortage);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const dispatch = useDispatch();

  const [handleChnage, setHandleChnage] = useState(false);
  const [saleNo, setSaleNo] = useState([]);
  const [teaTypeList, setTeaTypeList] = useState([]);
  const [dataByID, setDataByID] = useState([]);
  const [saleDates, setSaleDates] = useState([]);
  const [disable, setDisable] = useState(false);
  const [onEdit, setEdit] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      // handleSubmit(values);
      const apiUrl = `/preauction/AuctionSession/GetAuctionSessionList`;
      const { season, saleNo, saleDate, noOfSession } = values;
      const teaType = teaTypeList[0]?.teatypeid;

      if (noOfSession === "") {
        // Show toaster for no data found
        toast.error("No of session is blank, data not found");
        return;
      }
      const data = {
        season: season,
        saleNo: parseInt(saleNo),
        saleDate: saleDate,
        teaTypeId: teaType,
        noOfSession: noOfSession,
        pageNumber: 1,
        pageSize: 10,

        // === null ? parseInt(values.mark) : 0
      };

      axiosMain
        .post(apiUrl, data)
        .then((response) => {
          // Handle the API response here
          setRows(response?.data?.responseData);
          // setRows(response?.data?.responseData[0]);
          formik.resetForm();
        })
        .catch((error) => {
          // Handle errors here
        });
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  // console.log(invoiceData, "invoiceData");
  useEffect(() => {
    dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, []);
  
  useEffect(() => {
    setSaleNo(saleNumber);
  }, [saleNumber]);
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetSaleDateAndTeaType`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "") {
      axiosMain
        .post(apiUrl, { saleNo: parseInt(saleNo), season: season })
        .then((response) => {
          // Handle the API response here
          setSaleDates(response?.data?.responseData);
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
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    const saleDate = formik.values.saleDate;
    const teaType = teaTypeList[0]?.teatypeid;

    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetNoOfSession`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (teaTypeList.length > 0) {
      axiosMain
        .post(apiUrl, {
          season: season,
          saleNo: parseInt(saleNo),
          saleDate: saleDate,
          teaTypeId: teaType,
        })
        .then((response) => {
          // Handle the API response here
          formik.setFieldValue(
            "noOfSession",
            response?.data?.responseData[0]?.noOfSession
          );
        })
        .catch((error) => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleDate, teaTypeList]);
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    const saleDate = formik.values.saleDate;
    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetTeaTypeByParam`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== 0 && saleDate !== "") {
      axiosMain
        .post(apiUrl, {
          season: season,
          saleNo: parseInt(saleNo),
          saleDate: saleDate,
        })
        .then((response) => {
          // Handle the API response here
          setTeaTypeList(response?.data?.responseData);
        })
        .catch((error) => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleDate]);

  useEffect(() => {
    formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  }, [saleDates]);

  const sampleshortage = [
    {
      name: "userName",
      title: "Auctioneer",
    },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "categoryName",
      title: "Category",
    },
    {
      name: "sessionTypeName",
      title: "Session Type",
    },
    {
      name: "saleDate",
      title: "Sale Date",
      getCellValue: ({ ...row }) => <span>{row?.saleDate?.split("T")[0]}</span>,
    },
    {
      name: "startDate",
      title: "Start Time",
      getCellValue: ({ ...row }) => (
        <span>{ConvertTo12HourFormat(row?.startDate?.split("T")[1])}</span>
      ),
    },
    {
      name: "enddate",
      title: "End Time",
      getCellValue: ({ ...row }) => (
        <span>{ConvertTo12HourFormat(row?.enddate?.split("T")[1])}</span>
      ),
    },
    {
      name: "noOfLots",
      title: "Number of Lots",
    },
    {
      name: "minimumBidTime",
      title: "MBT",
    },
    {
      name: "status",
      title: "Status",
    },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setDisable(false);
    setDataByID([]);
    setEdit(false);
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAllRow(checked);
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        checked,
      }))
    );
  };

  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel2");
      switch (action) {
        case "view": {
          const apiURL = `/preauction/AuctionSession/GetAuctionSessionById?auctionSessionDetailId=${row.data.auctionSessionDetailId}`; // Replace with your API URL
          axiosMain
            .post(apiURL)
            .then((response) => {
              // console.log("API Response:", response.data);
              setEdit(true);
              setDataByID(response.data);
              // Handle the response data here
            })
            .catch((error) => {
              console.error("API Error:", error);
              // Handle the error here
            });
          break; // Make sure to break after the API call
        }
        case "edit": {
          const apiURL = `/preauction/AuctionSession/GetAuctionSessionById?auctionSessionDetailId=${row.data.auctionSessionDetailId}`; // Replace with your API URL
          axiosMain
            .post(apiURL)
            .then((response) => {
              // console.log("API Response:", response.data);
              setEdit(false);
              setDataByID(response.data);
              // Handle the response data here
            })
            .catch((error) => {
              console.error("API Error:", error);
              // Handle the error here
            });
          break;
        }
        default:
          return "no data";
      }
      // switch (action) {
      //   case "view": {
      //     return dispatch(fetchSampleShortageRequest(row.data.shortWeightId));
      //     // eslint-disable-next-line no-unreachable
      //   }
      //   case "edit": {
      //     return setActionData({ ...actionData, view: row.data });
      //   }
      //   default:
      //     return "no data";
      // }
    }

    return (
      <>
        <div className="BtnGroup">
          <Button className="action-btn" onClick={() => handleAction("view")}>
            <VisibilityIcon />
          </Button>
          <Button className="action-btn" onClick={() => handleAction("edit")}>
            <EditIcon />
          </Button>
        </div>

        <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            setOpenDelete(true);
            setActionData({ ...actionData, edit: row.data });
          }}
        >
          <DeleteIcon />
        </Button>
      </>
    );
  };

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
      type: "select",
      options: generateYearOptions(),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Sale No",
      name: "saleNo",
      type: "select",
      options: saleNo?.map((ele) => {
        return { label: ele.saleNo, value: ele.saleNo };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Sale Date",
      name: "saleDate",
      type: "select",
      options: saleDates?.map((ele) => {
        return { label: ele.saleDate, value: ele.saleDate };
      }),
      required: true,
      className: "FormGroup",
    },
    {
      label: "Tea Type",
      name: "teaType",
      type: "disableSelect",
      options: teaTypeList?.map((ele) => {
        return { label: ele.teaTypeName, value: ele.teatypeid };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "No of Session",
      name: "noOfSession",
      type: "disable",
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

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          onDelete={() => {
            // setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            let data = {
              auctionSessionId: actionData.edit.auctionSessionId,
              auctionSessionDetailId: actionData.edit.auctionSessionDetailId,
              updatedBy: actionData.edit.userId,
            };

            axiosMain
              .post("/preauction/AuctionSession/CancelAuctionSession", data)
              .then((res) => {
                if (res.data.statusCode === 200) {
                  toast.success(res.data.message);
                  setRows([]);
                  formik.resetForm();
                } else {
                  toast.error(res.data.message);
                }
              });
            // console.log(data, "actionDataactionData");
            setOpenDelete(false);
          }}
          title="Are you sure to want to cancel the selected auction session?"
          onHide={() => setOpenDelete(false)}
        />
        <Accordion
          expanded={expandedTab === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Auction Session Master List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="">
              <form onSubmit={formik.handleSubmit}>
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
                <div className="">
                  <div className="BtnGroup">
                    <Button
                      variant="primary"
                      type="submit"
                      className="SubmitBtn btn btn-primary"
                    >
                      Search
                    </Button>
                    <Button
                      variant="primary"
                      className="SubmitBtn btn btn-primary"
                    >
                      Update Actual Lots
                    </Button>
                    <Button
                      variant="primary"
                      className="SubmitBtn"
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
                </div>
              </form>
            </div>
            <div className="mt-5"> 
              <div className="SelectAll">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                    checked={selectAllRow}
                    onChange={handleSelectAllChange}
                  />
                  <label className="form-check-label" for="defaultCheck1">
                    Select All
                  </label>
                </div>
              </div>
              <div id="invoiceTable">
                <TableComponent
                  columns={sampleshortage}
                  rows={rows?.length > 0 ? rows : []}
                  setRows={setRows}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                  selectionCol={true}
                  sorting={true}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expandedTab === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Auction Session Master Maintenance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Maintananse
              dataByID={dataByID}
              onEdit={onEdit}
              expandedTab={expandedTab}
            />
          </AccordionDetails>
        </Accordion>
      </div>
      <ToastContainer />
    </>
  );
};

export default Modal;
