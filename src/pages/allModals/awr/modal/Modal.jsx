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
import AWRForm from "./form/Form";
import { useDispatch } from "react-redux";
import {
  fetchAwrListRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  fetchSaleNumbersRequest,
  fetchWarehouseUserRequest,
  getSubTeaTypesByStatus,
} from "../../../../store/actions";
import CustomeFormCreater from "../../../../components/common/formCreater/CustomeFormCreater";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axiosMain from "../../../../http/axios/axios_main";

const allAWRs = [
  {
    id: 1,
    season: "Spring 2023",
    saleNo: "12345",
    gatePassQty: "10",
    awrRefNo: "AWR-001",
    mark: "Mark 1",
    warehouse: "Warehouse A",
    arrivalDate: "2023-07-01",
    awrDate: "2023-07-05",
    catalogClosingDate: "2023-07-10",
    manufacturer: "ABC Company",
    grade: "A",
    checked: false,
  },
  {
    id: 2,
    season: "Summer 2023",
    saleNo: "67890",
    gatePassQty: "20",
    awrRefNo: "AWR-002",
    mark: "Mark 2",
    warehouse: "Warehouse B",
    arrivalDate: "2023-08-01",
    awrDate: "2023-08-05",
    catalogClosingDate: "2023-08-10",
    manufacturer: "XYZ Company",
    grade: "B",
    checked: false,
  },
  // Add more AWR objects as needed
];

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

const initialValues = {
  season: currentYear?.toString(),
  saleNo: "",
  awrNo: "",
  mark: "",
  warehouse: "",
  awrDate: "",
  grade: "",
  status: "",
};

const Modal = () => {
  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState(allAWRs);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const dispatch = useDispatch();

  const [handleChnage, setHandleChnage] = useState(false);
  const [saleNo, setSaleNo] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [disable, setDisable] = useState(false);
  const [status, setStatus] = useState([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      // handleSubmit(values);

      const data = {
        season: values.season,
        saleNo: parseInt(values.saleNo),
        markId: parseInt(values.mark) === null ? 0 : parseInt(values.mark),
        wareHouseUserRegId:
          parseInt(values.warehouse) === null ? 0 : parseInt(values.warehouse),
        awrReferenceNo: values.awrNo,
        grade: parseInt(values.grade) === null ? 0 : parseInt(values.grade),
      };

      dispatch(fetchAwrListRequest(data));
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  const [tableData, setTableData] = useState(
    formik.values.awrInvoices !== [] ? formik.values.awrInvoices : []
  );

  const awrList = useSelector((state) => state?.awr.awrList?.responseData);

  const markList = useSelector((state) => state.mark.data.responseData);
  const warehouseUsersList = useSelector(
    (state) => state.warehouseUser.data.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);

  const invoiceData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );

  // console.log(invoiceData, "invoiceData");

  function AwrStatus() {
    axiosMain
      .post("/preauction/Common/BindStatusTypeById?Id=2")
      .then((res) => setStatus(res.data.responseData));
  }

  useEffect(() => {
    dispatch(fetchMarkRequest());
    dispatch(fetchWarehouseUserRequest());
    dispatch(fetchGradeRequest());
    // dispatch(fetchSaleProgramListRequest(saleData));
    dispatch(fetchSaleNumbersRequest(formik.values.season));
    AwrStatus();
  }, []);

  useEffect(() => {
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSaleNo(saleNumber);
    if (awrList?.length > 0) {
      setRows(awrList);
    } else {
      setRows([]);
    }
  }, [markList, warehouseUsersList, grades, saleNumber, awrList]);

  useEffect(() => {
    dispatch(fetchAwrListRequest());
  }, []);

  const awrs = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    {
      name: "saleNo",
      title: "Sale No",
    },
    {
      name: "season",
      title: "Season",
    },
    {
      name: "awrNo",
      title: "AWR No",
    },
    {
      name: "awrDate",
      title: "AWR Date",
    },
    {
      name: "invoiceDate",
      title: "Invoice Date",
    },

    {
      name: "wareHouseName",
      title: "Warehouse",
    },
    {
      name: "markName",
      title: "Mark",
    },
    {
      name: "gradeName",
      title: "Grade",
    },
    {
      name: "arrivalDate",
      title: "Arrival Date",
    },
    {
      name: "awrReferenceNo",
      title: "AWR Ref No",
    },
    {
      name: "totalNetKgs",
      title: "Gate Pass Q ty",
    },
    {
      name: "status",
      title: "Status",
    },
    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
  ];

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setDisable(false);
    setRows([]);
    formik.resetForm();
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
          return setDisable(true);
        }
        case "edit": {
          return setActionData({ ...actionData, view: row.data });
        }
        default:
          return "no data";
      }
    }

    return (
      <>
        <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => handleAction("view")}
        >
          <VisibilityIcon />
        </Button>
        {/* <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => handleAction("edit")}
        >
          <EditIcon />
        </Button> */}

        {/* <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            setOpenDelete(true);
            setActionData({ ...actionData, edit: row.data });
          }}
        >
          <DeleteIcon />
        </Button> */}
      </>
    );
  };

  const AWRCheckBox = (data) => {
    const handleChange = (e) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === data.data.id ? { ...row, checked: e.target.checked } : row
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
    // {
    //   label: "AWR No",
    //   name: "awrNo",
    //   type: "text",
    //   required: true,
    //   className: "FormGroup",
    // },
    {
      label: "Mark",
      name: "mark",
      type: "select",
      options: markDataList?.map((ele) => {
        return { label: ele.markName, value: ele.markId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Warehouse",
      name: "warehouse",
      type: "select",
      options: warehouseUserList?.map((ele) => {
        return { label: ele.wareHouseName, value: ele.wareHouseUserRegId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Grade",
      name: "grade",
      type: "select",
      options: gradesList?.map((ele) => {
        return { label: ele.gradeName, value: ele.gradeId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: status?.map((ele) => {
        return { label: ele.Name, value: ele.Value };
      }),
      required: false,
      className: "FormGroup",
    },
  ];
  const Controlls = () => {
    return (
      <>
        {/* <div className="BtnGroup">
          <Button type="submit" className="SubmitBtn">
            Create
          </Button>

          <Button className="SubmitBtn" onClick={() => {}}>
            Add
          </Button>
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
                    "https://teaboard.procuretiger.com/TEABOARD/preauction/AWRDetails/GetInvoicesByAWRDetails",

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
            setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />
        <Accordion
          expanded={expandedTab === "panel1"}
          className={`${expandedTab === "panel1" ? "active" : ""}`}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>AWR List</Typography>
          </AccordionSummary>
          <AccordionDetails>
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

              <div className="row mb-4">
                <div className="col-12">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" type="submit">
                      Search
                    </Button>
                    <Button
                      className="SubmitBtn"
                      onClick={() => {
                        let data = {
                          season: currentYear?.toString(),
                          saleNo: currentWeek,
                        };

                        dispatch(fetchAwrListRequest(data));
                      }}
                    >
                      Refresh
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
              <div id="invoiceTable">
                <TableComponent
                  columns={awrs}
                  rows={rows}
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
            <Typography>AWR Maintenance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AWRForm isDisabled={disable} />
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default Modal;
