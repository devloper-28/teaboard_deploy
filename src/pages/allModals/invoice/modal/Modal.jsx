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
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import CreateInvoiceForm from "./formCompo";
import {
  fetchInvoiceDetailsIdRequest,
  fetchInvoiceDetailsRequest,
} from "../../../../store/actions/invoice/invoiceActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchMarkRequest, getSaleNoRequest } from "../../../../store/actions";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosMain from "../../../../http/axios/axios_main";

// Get the current date
const currentDate = new Date();

// Get the current year
const currentYear = currentDate.getFullYear();

// Get the current week number of the year
// The week number is calculated based on the ISO 8601 standard, where weeks start on Monday and the first week of the year contains January 4th.
const currentWeek = Math.ceil(
  ((currentDate - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

const Modal = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState([]);
  const [selection, setSelection] = useState([1]);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(6);
  const [srNo, setSrNo] = useState(null);
  const [receivedDateLable, setReceivedDate] = useState(null);
  const [invoiceStatusLable, setInvoiceStatus] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [markDataList, setMarkDataList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [status, setStatus] = useState([]);

  const markList = useSelector((state) => state?.mark?.data?.responseData);
  const invoiceDetails = useSelector(
    (state) => state.invoiceDetails.data.responseData
  );
  console.log(invoiceDetails, "invoiceDetails");
  const saleNumber = useSelector(
    (state) => state?.auction?.saleNumber?.responseData
  );

  const responseData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );
  const invoiceResponseData = useSelector((state) => state);
  const viewedData = useSelector((state) => state?.invoiceDetails);
  // console.log(currentYear,weekNumber,"😂😒");

  const dispatch = useDispatch();

  const initialValues = {
    season: currentYear.toString(), // Set default value if needed
    saleNo: currentWeek, // Set default value if needed
    markId: 0, // Set default value if needed
    status: 1, // Set default value if needed
  };

  const validationSchema = Yup.object().shape({
    season: Yup.string().required("Season is required"),
    saleNo: Yup.number().required("Sale No is required"),
    markId: Yup.number().required("Manufacturer is required"),
    status: Yup.number().required("Status is required"),
  });

  const handleSubmit = (values) => {
    // Handle form submission here, values object will contain the form data
    const { season, saleNo, markId, status } = values;
    const data = {
      markId: parseInt(markId),
      season: season,
      saleNo: parseInt(saleNo),
      status: parseInt(status),
    };
    // dispatch(fetchInvoiceDetailsRequest(data));
    axiosMain
      .post("/preauction/InvoiceDetails/GetInvoiceDetails", data)
      .then((res) => {
        setRows(res.data.responseData);
      });
    // console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    dispatch(fetchInvoiceDetailsRequest(initialValues));
    dispatch(fetchMarkRequest());
    dispatch(getSaleNoRequest());
    axiosMain
      .post(`/preauction/Common/BindStatusTypeById?Id=${1}`, {
        invoiceId: 1,
      })
      .then((res) => setStatus(res.data.responseData));

    // axiosMain
    //   .get(`preauction/Common/Common/BindFactory`)
    //   .then((res) => console.log(res.data.responseData,"2222"));
  }, []);

  useEffect(() => {
    setMarkDataList(markList);
    axiosMain
      .post(
        `/preauction/Common/BindSaleNoBySeason?season=${formik.values.season}`
      )
      .then((res) => {
        setSaleNo(res.data.responseData);
        formik.setFieldValue("saleNo", res.data.responseData?.at(0).saleNo);
      })
      .catch((err) => toast.error(err));
  }, [markList, saleNumber]);

  useEffect(() => {
    setViewData(viewedData);
  }, [viewedData]);

  const invoices = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <InvoiceCheckBox data={row} />,
    // },
    {
      name: "status",
      title: "Invoice Status",
    },
    {
      name: "season",
      title: "Season",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    {
      name: "receivedDate",
      title: "Received Date",
      getCellValue: ({ ...row }) => (
        <span>{row?.receivedDate?.split("T")[0]}</span>
      ),
    },
    {
      name: "invoiceNo",
      title: "Invoice No",
    },
    {
      name: "manufacturerName",
      title: "Manufacturer",
    },
    {
      name: "mark",
      title: "Mark",
    },
    {
      name: "wareHouseName",
      title: "Warehouse",
    },
    {
      name: "gradeName",
      title: "Grade",
    },
    {
      name: "invoiceDate",
      title: "Invoice Date",
    },
    {
      name: "manufactureFromDate",
      title: "Manufacture from Date",
    },
    {
      name: "manufactureToDate",
      title: "Manufacture To Date",
    },
    {
      name: "dateOfDispatch",
      title: "Date of Dispatch",
    },
    {
      name: "invoiceQty",
      title: "Invoice Qty.",
    },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

  const handleToDateChange = (event) => {
    const selectedDate = event.target.value;

    if (selectedDate >= fromDate) {
      setToDate(selectedDate);
    }
  };
  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel2");
      console.log(row, "PPPP");

      switch (action) {
        case "view": {
          setSrNo(rows.map((ele) => ele.invoiceId).indexOf(row.data.invoiceId));
          setReceivedDate(row.data.receivedDate);
          setInvoiceStatus(row.data.status);
          return dispatch(fetchInvoiceDetailsIdRequest(row.data.invoiceId));
        }
        case "edit": {
          setSrNo(null);
          // console.log(row, rows, "row.data.invoiceId");
          // console.log(
          //  rows.map((ele) => ele.invoiceId).indexOf(row.data.invoiceId) ,
          //   "row.data.invoiceId"
          // );

          return dispatch(fetchInvoiceDetailsIdRequest(row.data.invoiceId));
        }
        default:
          return "no data";
      }
    }
    return (
      <>
        <span
          // style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            handleAction("view");
            setIsDisabled(true);
          }}
        >
          <VisibilityIcon />
        </span>
        <span
          // style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            handleAction("edit");
            setIsDisabled(false);
          }}
        >
          <EditIcon />
        </span>
        {/* <span
          // style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            setOpenDelete(true);
            setInvoiceId(row.data.invoiceId);
          }}
        >
          <DeleteIcon />
        </span> */}
      </>
    );
  };

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setActionData({
      view: {},
      edit: {},
    });
    setViewData([]);
    setIsDisabled(false);
  };

  const InvoiceCheckBox = (data) => {
    const handleChange = (e) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.invoiceNo === data.data.invoiceNo
            ? { ...row, checked: e.target.checked }
            : row
        )
      );





      const allChecked = rows.every((row) => row.checked);
      setSelectAllRow(allChecked);
    };
    useEffect(() => {
      const allChecked = rows.every((row) => row.checked);
      setSelectAllRow(allChecked);
    }, [rows]);

    return (
      <>
        <Form.Check
          type="checkbox"
          id="custom-switch"
          checked={data.data.checked}
          onChange={handleChange}
        />
      </>
    );
  };

  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear; i > currentYear - 7; i--) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const { markId, saleNo, season, status } = initialValues;

  //   const searchData = {
  //     markId: parseInt(markId),
  //     season: season,
  //     saleNo: parseInt(saleNo),
  //     status: parseInt(status),
  //   };

  //   dispatch(fetchInvoiceDetailsRequest(searchData));

  //   // console.log(initialValues, "😂😂😂😂😂");
  // };

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          remarkShow={false}
          title="Are you sure you want to delete Invoice"
          onDelete={() => {
            axiosMain
              .post(
                `/preauction/InvoiceDetails/DeleteInvoiceDetails?invoiceId=${invoiceId}`,
                {
                  invoiceId: invoiceId,
                }
              )
              .then((res) => {
                if (res.data.statusCode === 200) {
                  toast.success("Invoice Deleted Successfully");
                  fetchInvoiceDetailsRequest(initialValues);
                } else {
                  toast.error("Invoice not Deleted");
                }
              });

            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />
        <Accordion
          expanded={expandedTab === "panel1"}
          onChange={handleAccordionChange("panel1")}
          className={`${expandedTab === "panel1" ? "active" : ""}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-xl-2 col-lg-3 col-md-4">
                  <label>Select Season</label>
                  <InputGroup up>
                    <Form.Control
                      as="select"
                      name="season"
                      value={formik.values.season}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {generateYearOptions()}
                    </Form.Control>
                    {formik.touched.season && formik.errors.season && (
                      <div className="error-message text-dengar">
                        {formik.errors.season}
                      </div>
                    )}
                  </InputGroup>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-4">
                  <label>Sale No</label>
                  <InputGroup>
                    <Form.Control
                      as="select"
                      name="saleNo"
                      value={formik.values.saleNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {saleNo?.length > 0
                        ? saleNo?.map((item, index) => (
                            <option value={item.saleNoId} key={index}>
                              {item.saleNo}
                            </option>
                          ))
                        : "No Data"}
                    </Form.Control>
                    {formik.touched.saleNo && formik.errors.saleNo && (
                      <div className="error-message text-dengar">
                        {formik.errors.saleNo}
                      </div>
                    )}
                  </InputGroup>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-4">
                  <label>Manufacturer</label>
                  <InputGroup>
                    <Form.Control
                      as="select"
                      name="markId"
                      value={formik.values.markId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {markDataList?.length > 0
                        ? markDataList?.map((item, index) => (
                            <option value={item.markId} key={index}>
                              {item.markName}
                            </option>
                          ))
                        : "No Data"}
                    </Form.Control>
                    {formik.touched.markId && formik.errors.markId && (
                      <div className="error-message text-dengar">
                        {formik.errors.markId}
                      </div>
                    )}
                  </InputGroup>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-4">
                  <label>Status</label>
                  <InputGroup>
                    <Form.Control
                      as="select"
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {status?.length > 0
                        ? status?.map((item, index) => (
                            <option value={item.Value} key={index}>
                              {item.Name}
                            </option>
                          ))
                        : "No Data"}
                    </Form.Control>
                    {formik.touched.status && formik.errors.status && (
                      <div className="error-message text-dengar">
                        {formik.errors.status}
                      </div>
                    )}
                  </InputGroup>
                </div>
                <div className="col-xl-auto mt-2">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" type="submit">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <div>
              {/* <div className="SelectAll">
                   
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
                </div> */}
              <div id="invoiceTable" className="mt-4">
                <TableComponent
                  columns={invoices}
                  rows={rows.length > 0 ? rows : []}
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
          className={`${expandedTab === "panel2" ? "active" : ""}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Maintenance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CreateInvoiceForm
              invoiceResponseData={invoiceResponseData}
              isDisabled={isDisabled}
              srNo={srNo}
              viewData={viewedData}
              handleAccordionChange={handleAccordionChange}
              invoiceStatusLable={invoiceStatusLable}
              receivedDateLable={receivedDateLable}
            />
          </AccordionDetails>
        </Accordion>
      </div>
      <ToastContainer />
    </>
  );
};

export default Modal;
