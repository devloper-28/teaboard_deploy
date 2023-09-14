import React, { useEffect, useState } from "react";
import { Button, Form, ToastContainer } from "react-bootstrap";
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
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import AWRForm from "./form/Form";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  addLotSeriesRequest,
  deleteLotSeriesRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchKutchaCatalogueRequest,
  fetchLotSeriesByIdRequest,
  fetchLotSeriesRequest,
  fetchMarkRequest,
  fetchMarkTypeRequest,
  fetchSaleNumbersRequest,
  fetchSessionTypeRequest,
  fetchStatusRequest,
  getSaleNoRequest,
  teaTypeAction,
  updateLotSeriesRequest,
} from "../../../../store/actions";
import { useDispatch } from "react-redux";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import KutchaCataloguePDF from "../KutchaCataloguePDF";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object().shape({
  // mark: Yup.string().required("Mark is required"),
  // LotNoStatus: Yup.string().required("Lot Number is required"),
  // category: Yup.string().required("Category is required"),
  saleNo: Yup.string().required("Sale No is required"),
  // season: Yup.string().required("Season is required"),
  // teaType: Yup.string().required("Tea Type is required"),
  // grade: Yup.string().required("Grade is required"),
  // markType: Yup.string().required("Mark Type is required"),
});
const initialValues = {
  season: "2023",
  saleNo: "",
};
// const initialValues = {
//   mark: "Mark Value",
//   markType: "Mark Type",
//   warehouse: "Warehouse Value",
//   warehouseName: "Warehouse Name Value",
//   warehouseAddress: "Warehouse Address Value",
//   invoiceNo: "Invoice No Value",
//   invoiceQty: "Invoice Qty Value",
//   origin: "Origin Value",
//   year: "year",
//   manufacture: "Manufacture Value",
//   grade: "Grade Value",
//   fromDate: "From Date Value",
//   toDate: "To Date Value",
//   dateOfDispatch: "Date of Dispatch Value",
//   invoiceDate: "Invoice Date Value",
//   season: "Season Value",
//   saleNo: "Sale No Value",
//   auctioneer: "Auctioneer Value",
//   lorryReceiptNo: "Lorry Receipt No Value",
//   lorryNo: "Lorry No Value",
//   invRefNo: "Inv Ref No Value",
//   carrier: "Carrier Value",
//   teaType: "Tea Type Value",
//   subType: "Sub Type Value",
//   category: "Category Value",
//   packageSize: "Package Size Value",
//   packageType: "Package Type Value",
//   packageNo: "Package No Value",
//   totalPackages: "Total Packages Value",
//   grossKgs: "Gross Kgs Value",
//   tareKgs: "Tare Kgs Value",
//   netKgs: "Net Kgs Value",
//   totalNetKgs: "Total Net Kgs Value",
// };

const Modal = () => {
  const dispatch = useDispatch();

  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [handleChnage, setHandleChnage] = useState(false);

  const lotSeriesData = useSelector(
    (state) => state?.lotSeriesReducer?.data?.responseData
  );

  console.log(lotSeriesData, "lotSeriesData");

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const teaType = useSelector(
    (state) => state?.teaType?.teaTypeList?.responseData
  );

  const abc = useSelector((state) => state.category.loading);
  console.log(abc, "abc");
  const kutchaList = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );

  const kutchaListWarning = useSelector(
    (state) => state.kutchaCatalogueReducer.data.message
  );
  const sessionType = useSelector(
    (state) => state?.sessionTypesReducer?.data?.responseData
  );
  console.log(sessionType, "sessionType");

  const statusData = useSelector(
    (state) => state?.category?.statusData?.responseData
  );
  console.log(statusData, ".");
  const markList = useSelector((state) => state?.mark?.data?.responseData);
  const categorystate = useSelector(
    (state) => state?.category?.data?.responseData
  );
  const markType = useSelector((state) => state.mark.markTypeData.responseData);
  const grades = useSelector((state) => state?.grade?.data?.responseData);

  const searchData = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );
  console.log(searchData, "categorystate");
  const allLot = [
    {
      id: 1,
      // lotNo: "Lot Number 123",
      // invoiceNo: "INV-2023-001",
      // origin: "Tea Garden",
      teaTypeName: "Black Tea",
      categoryName: "category name",
      seriesFrom: "1000",
      seriesTo: "2000",
    },
    // Add more AWR objects as needed
  ];

  // const handleExportPDF = () => {
  //   // You need to replace `rows` with the actual data you want to export
  //   const data = rows;

  //   const pdfBlob = (<KutchaCataloguePDF data={data} />).toBlob();
  //   saveAs(pdfBlob, "kutcha_catalogue.pdf");
  // };

  const handleExportExcel = () => {
    const data = rows;

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "KutchaCatalogue");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "kutcha_catalogue.xlsx");
  };
  useEffect(() => {
    // Dispatch the action when the component mounts

    dispatch(
      fetchLotSeriesRequest({
        season: "2023",
        saleNo: 3,
        pageNumber: 1,
        pageSize: 10,
      })
    );
    dispatch(fetchSaleNumbersRequest(formik.values.season));

    // const requestData = [
    //   {
    //     saleNo: 19,
    //     season: "2023",
    //     saleProgramId: 10110,
    //     teaTypeId: 3,
    //     categoryId: 3,
    //     seriesFrom: "1",
    //     seriesTo: "3",
    //     isActive: true,
    //     createdBy: 1,
    //   },
    //   {
    //     saleNo: 19,
    //     season: "2023",
    //     saleProgramId: 10110,
    //     teaTypeId: 2,
    //     categoryId: 3,
    //     seriesFrom: "2",
    //     seriesTo: "3",
    //     isActive: true,
    //     createdBy: 1,
    //   },
    // ];

    // // Dispatch the action to add new lot series
    // dispatch(addLotSeriesRequest(requestData));
  }, []);
  const handleUpdate = () => {
    const requestData = {
      lotNoSeriesID: 6,
      saleNo: 19,
      season: "2023",
      saleProgramId: 10110,
      teaTypeId: 1,
      categoryId: 2,
      seriesFrom: "1",
      seriesTo: "3",
      isActive: true,
      updatedBy: 1,
    };

    // Dispatch the updateLotSeriesRequest action with the updated data
    dispatch(updateLotSeriesRequest(requestData));
  };

  const handleRemove = () => {
    const requestData = {
      lotNoSeriesID: actionData.edit.lotNoSeriesID,
      updatedBy: 1,
    };

    // Dispatch the deleteLotSeriesRequest action with the provided data
    // dispatch(deleteLotSeriesRequest(requestData));
    console.log(actionData.edit, "actionData.edit");

    setOpenDelete(false);
  };
  const formik = useFormik({
    initialValues: initialValues,

    validationSchema,
    onSubmit: async (values) => {
      const formData = {
        season: "2023",
        saleNo: parseInt(values.saleNo),
        pageNumber: 1,
        pageSize: 100,
      };
      // const formData = {
      //   season: "2023",
      //   saleNo: 19,
      //   teaTypeId: 1,
      //   LotNoStatus: 0,
      //   markId: 7,
      //   categoryId: 2,
      //   gradeId: 4,
      //   marketType: 0,
      //   auctioneerId: 10023,
      // };

      // console.log(formData, "GOING");
      // Update form values to the first option for all dropdowns if they are empty
      // if (!values.teaType && teaType.length > 0) {
      //   formik.setFieldValue("teaType", teaType[0].teaTypeId);
      // }
      // if (!values.LotNoStatus && statusData.length > 0) {
      //   formik.setFieldValue("LotNoStatus", statusData[0].Value);
      // }
      // if (!values.grade && gradesList.length > 0) {
      //   formik.setFieldValue("grade", gradesList[0].gradeId);
      // }
      // if (!values.mark && markDataList.length > 0) {
      //   formik.setFieldValue("mark", markDataList[0].markId);
      // }
      // if (!values.category && categoryList.length > 0) {
      //   formik.setFieldValue("category", categoryList[0].categoryId);
      // }

      // // Manually validate the updated form values
      // try {
      //   await validationSchema.validate(values, { abortEarly: false });
      // } catch (errors) {
      //   // Handle validation errors
      //   const errorsMap = {};
      //   errors.inner.forEach((error) => {
      //     errorsMap[error.path] = error.message;
      //   });
      //   formik.setErrors(errorsMap);
      // }
      dispatch(fetchLotSeriesRequest(formData));
      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });

  useEffect(() => {
    // Check for responseData and show toast notification if it's null
    if (kutchaList === null) {
      toast.warning(kutchaListWarning, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  }, [kutchaList, kutchaListWarning]);
  console.log(kutchaListWarning, "mss");
  // Check for responseData and show toast notification if it's null

  const [sellsNo, setSellNo] = useState(1);

  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState(allLot);
  // const [year, setYear] = useState("2023");
  const [sessionTypes, setSessionType] = useState(sessionType); // If using React state hooks

  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [kutchaData, setTeakutchaData] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [mark, setmark] = useState([]);
  const [categoryList, setcategory] = useState([]);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [isDisabled, setIsDisabled] = useState(false);

  const { handleChange, handleBlur, values, touched, errors } = formik;

  console.log(sessionTypes, "sessionTypess");
  // {
  //   id: 1,
  //   // lotNo: "Lot Number 123",
  //   // invoiceNo: "INV-2023-001",
  //   // origin: "Tea Garden",
  //   teaTypeName: "Black Tea",
  //   category: "category name",
  //   seriesFrom: "1000",
  //   seriesTo: "2000",
  // },

  const resetModal = () => {};
  const kutcha = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    { name: "teaTypeName", title: "Tea Type" },
    { name: "categoryName", title: "Category" },
    { name: "seriesFrom", title: "Series From" },
    { name: "seriesTo", title: "Series To" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

  console.log(rows, "rows");
  const handleSessionTypeChange = (selectedSessionType) => {
    setSessionType(selectedSessionType);
  };
  const handleRefresh = () => {};
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = {
      marketType: 0 /* update in future */,
      saleNo: parseInt(formik.values.saleNo),
      LotNoStatus: parseInt(formik.values.LotNoStatus), // Convert to integer
      categoryId: parseInt(formik.values.category), // Convert to integer
      gradeId: parseInt(formik.values.grade), // Convert to integer
      markId: 6, // Convert to integer
      teaTypeId: parseInt(formik.values.teaType), // Convert to integer
      auctioneerId: 10023,
      season: "2023",
    };
    console.log(formData, "GOING");
    dispatch(fetchKutchaCatalogueRequest(formData));
  };
  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setInitialValue({
      saleNo: null,
      season: "2023",
      saleProgramId: null,
      teaTypeId: null,
      categoryId: null,
      seriesFrom: "",
      seriesTo: "",
      isActive: true,
      createdBy: 1,
    });
    setLotSeriesData([]);
    setIsEdit(false);
    setIsDisabled(false);
    setHandleChnage(false);
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
  const handleSampleQtyChange = (value) => {
    // You can update the corresponding row's data in the `rows` state or handle the value as needed
    console.log("Sample Q ty.(Kgs) changed to:", value);
  };

  const SampleTxt = ({ value, onChange }) => {
    return (
      <InputGroup>
        <FormControl
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </InputGroup>
    );
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
        // case "view": {
        //   return dispatch(
        //     fetchSaleProgramDetailsRequest(row.data.saleProgramDetailId)
        //   );
        // }
        case "view": {
          const lotNo = row.data;
          // setSelectedSaleProgram(saleProgramDetail);
          // setIsDisabled(true);
          dispatch(fetchLotSeriesByIdRequest(lotNo.lotNoSeriesID));
          setIsDisabled(true);
          // setIsEdit(true);
          break;
        }
        case "edit": {
          const lotNo = row.data;
          dispatch(fetchLotSeriesByIdRequest(lotNo.lotNoSeriesID));
          // setSelectedSaleProgram(saleProgramDetail);
          setIsDisabled(false);
          setIsEdit(true);
          // setIsEdit(true);
          // dispatch(
          //   fetchSaleProgramDetailsRequest(saleProgramDetail.SaleProgramId)
          // );
        }
        default:
          return "no data";
      }
    }

    // if (!saleProgramList || !saleNumber) {
    //   return (
    //     <div>
    //       <NoData />
    //     </div>
    //   ); // Show a message when no data is available
    // }
    return (
      <>
        <div className="ActionBtn">
          <span onClick={() => handleAction("view")}>
            <VisibilityIcon />
          </span>
          <span onClick={() => handleAction("edit")}>
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setOpenDelete(true);
              setActionData({ ...actionData, edit: row.data });
            }}
          >
            <DeleteIcon />
          </span>
        </div>
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
  useEffect(() => {
    setRows(lotSeriesData);
  }, [lotSeriesData]);
  // console.log(rows,"rows")
  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          onDelete={handleRemove}
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
            <Typography>Lot No Series List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={formik.handleSubmit}>
              <div className="row align-items-end">
                <div className="col-lg-2">
                  <label>Select Season</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="season"
                      value={formik.values.season}
                      onChange={handleChange}
                    >
                      {generateYearOptions()}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.season && formik.touched.season && (
                    <div className="error text-danger">
                      {formik.errors.season}
                    </div>
                  )}
                </div>
                <div className="col-lg-2">
                  <label>Select Sale No.</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="saleNo"
                      value={formik.values.saleNo}
                      onChange={handleChange}
                    >
                      {saleNumber?.map((e) => (
                        <option key={e.SaleNoId} value={e.saleNo}>
                          {e.saleNo}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.saleNo && formik.touched.saleNo && (
                    <div className="error text-danger">
                      {formik.errors.saleNo}
                    </div>
                  )}
                </div>
                <div className="col-auto">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" type="submit">
                      Search
                    </Button>
                    <Button
                      className="SubmitBtn"
                      onClick={() => formik.resetForm()}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
                {/* <div className="col-lg-2">
                  <label>Select Tea Type</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      size="sm"
                      name="teaType"
                      value={formik.values.teaType}
                      onChange={handleChange}
                    >
                      <option value={0}>All</option>
                      {teaTypeList?.length > 0 ? (
                        teaTypeList?.map((item, index) => (
                          <option value={item?.teaTypeId} key={index}>
                            {item.teaTypeName}
                          </option>
                        ))
                      ) : (
                        <option>No Data</option>
                      )}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.teaType && formik.touched.teaType && (
                    <div className="error text-danger">
                      {formik.errors.teaType}
                    </div>
                  )}
                </div>
                <div className="col-lg-2">
                  <label>Lot No status</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      size="sm"
                      name="LotNoStatus"
                      value={formik.values.LotNoStatus}
                      onChange={handleChange}
                    >
                      {statusData?.length > 0
                        ? statusData?.map((item, index) => (
                            <option value={parseInt(item?.Value)}>
                              {item.Name}
                            </option>
                          ))
                        : "No Data"}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.LotNoStatus && formik.touched.LotNoStatus && (
                    <div className="error text-danger">
                      {formik.errors.LotNoStatus}
                    </div>
                  )}
                </div>
                <div className="col-md-2">
                  <div className="FormGrup">
                    <label>Grade</label>
                    <div className="max-width250">
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="grade"
                          value={formik.values.grade}
                          onChange={handleChange}
                        >
                          {gradesList?.length > 0 ? (
                            <>
                              <option value={0}>All</option>
                              {gradesList?.map((item, index) => (
                                <option value={item.gradeId} key={index}>
                                  {item.gradeName}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option>No Data</option>
                          )}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.grade && formik.touched.grade && (
                        <div className="error text-danger">
                          {formik.errors.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FormGrup">
                    <label>Mark</label>
                    <div className="max-width250">
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="mark"
                          value={formik.values.mark}
                          onChange={handleChange}
                        >
                          <option value={0}>All</option>
                          {markDataList?.length > 0 ? (
                            markDataList?.map((item, index) => (
                              <option value={item.markId} key={index}>
                                {item.markName}
                              </option>
                            ))
                          ) : (
                            <option>No Data</option>
                          )}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.mark && formik.touched.mark && (
                        <div className="error text-danger">
                          {formik.errors.mark}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="FormGrup">
                    <label>Category</label>
                    <div className="max-width250">
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="category"
                          value={formik.values.category}
                          onChange={handleChange}
                        >
                          <option value={0}>All</option>
                          {categoryList?.length > 0 ? (
                            categoryList?.map((item, index) => (
                              <option value={item.categoryId} key={index}>
                                {item.categoryCode}
                              </option>
                            ))
                          ) : (
                            <option>No Data</option>
                          )}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.category && formik.touched.category && (
                        <div className="error text-danger">
                          {formik.errors.category}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="FormGrup">
                    <label>MarkType</label>
                    <div className="max-width250">
                      {console.log(markType, "ji")}
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="markType"
                          value={formik.values.markType}
                          onChange={handleChange}
                        >
                          {markType?.length > 0 ? (
                            markType?.map((item, index) => (
                              <option value={item.marketTypeId} key={index}>
                                {item.marketTypeName}
                              </option>
                            ))
                          ) : (
                            <option>No Data</option>
                          )}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.markType && formik.touched.markType && (
                        <div className="error text-danger">
                          {formik.errors.markType}
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}

                <div className="col-lg-2">
                  {/* <PDFDownloadLink
                    document={<KutchaCataloguePDF data={rows} />}
                    fileName="kutcha_catalogue.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? "Loading document..." : "Export as PDF"
                    }
                  </PDFDownloadLink> */}
                </div>
              </div>

              <div className="row pt-3">
                <div className="col-12">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" onClick={handleExportExcel}>
                      Export as Excel
                    </Button>
                  </div>
                </div>
              </div>
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
              <div
                id={rows?.length > 0 ? "invoiceTable" : "invoiceTable" + "c"}
              >
                <TableComponent
                  columns={kutcha}
                  rows={rows?.length > 0 ? rows : []}
                  setRows={setRows}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                  selectionCol={true}
                  sorting={true}
                />
              </div>
            </form>
          </AccordionDetails>
        </Accordion>
        <ToastContainer position="top-center" autoClose={3000} />
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
            <Typography>Lot No Maintenance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AWRForm
              handleAccordionChange={setExpandedTab}
              initialValue={initialValue}
              handleChnage={handleChnage}
              setHandleChnage={setHandleChnage}
              setInitialValue={setInitialValue}
              lotSeriesDataIds={lotSeriesDataIds}
              setLotSeriesData={setLotSeriesData}
              isDisabled={isDisabled}
              isEdit={isEdit}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default Modal;
