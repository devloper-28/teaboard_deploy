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
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import ExcelUploadComponent from "./form/ExcelUploadComponent";
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
import ExportData from "../../../../components/common/exportData/ExportData";

const allSampleShortage = [
  {
    id: 1,
    LotNo: "2",
    teaTypeName: "tea1",
    invoiceNo: "tea2",
    markName: "",
    gradeName: "",
    categoryName: "",
    packageNo: "",
    noofpackage: "",
    netKgs: "",
    totalSampleQty: "",
    totalShortQty: "",
    inspectionCharges: "",
    reInspectionCharges: "",
    checked: false,
  },
  {
    id: 2,
    LotNo: "2",
    teaTypeName: "tea3",
    invoiceNo: "tea4",
    markName: "",
    gradeName: "",
    categoryName: "",
    packageNo: "",
    noofpackage: "",
    netKgs: "",
    totalSampleQty: "",
    totalShortQty: "",
    inspectionCharges: "",
    reInspectionCharges: "",
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
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [disable, setDisable] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewData, setViewData] = useState([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      // handleSubmit(values);

      const data = {
        pageNumber: 1,
        pageSize: 10,
        season: values.season,
        saleNo: parseInt(values.saleNo),
        markId: parseInt(values.mark),
        // === null ? parseInt(values.mark) : 0
      };

      dispatch(fetchSampleShortageListRequest(data));
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  const [tableData, setTableData] = useState(
    formik.values.awrInvoices !== [] ? formik.values.awrInvoices : []
  );

  const awrList = useSelector((state) => state?.awr.awrList?.responseData);
  const shortageList = useSelector(
    (state) => state.sampleShortageReducer.data?.responseData
  );
  console.log(shortageList, "AA");
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
  console.log(formik.values.mark, "markList");

  // console.log(invoiceData, "invoiceData");
  useEffect(() => {
    dispatch(fetchSampleShortageRequest(5));
    dispatch(fetchMarkRequest());
    dispatch(fetchWarehouseUserRequest());
    dispatch(fetchGradeRequest());
    // dispatch(fetchSaleProgramListRequest(saleData));
    dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, []);

  useEffect(() => {
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSaleNo(saleNumber);
    if (shortageList?.length > 0) {
      setRows(shortageList);
    } else {
      setRows([]);
    }
  }, [markList, warehouseUsersList, grades, saleNumber, shortageList]);

  useEffect(() => {
    dispatch(fetchAwrListRequest());
  }, []);

  const sampleshortage = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },

    {
      name: "LotNo",
      title: "Lot No",
    },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "invoiceNo",
      title: "Invoice No",
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
      name: "categoryName",
      title: "Category",
    },
    {
      name: "ShortPackageNo",
      title: "Packages No.",
    },
    {
      name: "totalPackages",
      title: "No Of Packages",
    },
    // {
    //   name: "noofpackage",
    //   title: "No Of Packages",
    // },

    {
      name: "netKgs",
      title: "Net Weight",
    },
    {
      name: "totalSampleQty",
      title: "Total Sample Qty",
    },
    {
      name: "totalShortQty",
      title: "Total Short Qty",
    },
    {
      name: "inspectionCharges",
      title: "Inspection Charges",
    },
    {
      name: "reInspectionCharges",
      title: "Re-Inspection Charges",
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
    setIsEdit(false);
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
          setDisable(true);
          setIsEdit(false);

          return dispatch(fetchSampleShortageRequest(row.data.shortWeightId));
          // eslint-disable-next-line no-unreachable
        }
        case "edit": {
          setDisable(false);
          setIsEdit(true);

          return dispatch(fetchSampleShortageRequest(row.data.shortWeightId));
        }
        default:
          return "no data";
      }
    }

    return (
      <>
        <div class="BtnGroup">
          {" "}
          <Button
            style={{
              background: "transparent",
              border: "none",
              color: "green",
            }}
            onClick={() => handleAction("view")}
          >
            <VisibilityIcon />
          </Button>
          <Button
            style={{
              background: "transparent",
              border: "none",
              color: "green",
            }}
            onClick={() => handleAction("edit")}
          >
            <EditIcon />
          </Button>
        </div>

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
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Sample Shortage List</Typography>
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
              <div className="row">
                <div className="col-2 my-3">
                  <div className="BtnGroup">
                    <Button type="submit">Search</Button>
                    <Button
                      onClick={() => {
                        let data = {
                          season: currentYear?.toString(),
                          saleNo: currentWeek,
                        };

                        dispatch(fetchAwrListRequest(data));
                      }}
                    >
                      Clear
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
                <ExportData data={rows} exportType={"all"} />

                <TableComponent
                  columns={sampleshortage}
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
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Sample & Shortage Maintenance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ExcelUploadComponent isDisable={disable} isEdit={isEdit} />
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default Modal;
