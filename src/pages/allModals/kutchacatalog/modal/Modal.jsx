import React, { useEffect, useRef, useState } from "react";
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
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import AWRForm from "./form/Form";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchKutchaCatalogueRequest,
  fetchMarkRequest,
  fetchMarkTypeRequest,
  fetchSaleNumbersRequest,
  fetchSessionTypeRequest,
  fetchStatusRequest,
  generateLotNoRequest,
  getSaleNoRequest,
  teaTypeAction,
  updateKutchaCatalogueRequest,
} from "../../../../store/actions";
import { useDispatch } from "react-redux";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import KutchaCataloguePDF from "../KutchaCataloguePDF";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KutchaTable from "./kutchaDataTable/KutchaTable";
import axiosMain from "../../../../http/axios/axios_main";

const currentYear = new Date().getFullYear();

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
  LotNoStatus: 0,
  season: currentYear,
  saleNo: "",
  teaType: 0,
  mark: 0,
  grade: 0,
  category: 0,
  markType: 1,
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
  const inputRefs = useRef({});

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const teaType = useSelector(
    (state) => state?.teaType?.teaTypeList?.responseData
  );

  const abc = useSelector((state) => state.category.loading);
  console.log(abc, "abc");
  const kutchaList = useSelector(
    (state) => state.kutchaCatalogueReducer.data.responseData
  );
  const kutchaListWarning = useSelector(
    (state) => state.kutchaCatalogueReducer.data.message
  );
  const sessionType = useSelector(
    (state) => state.sessionTypesReducer.data.responseData
  );

  console.log(sessionType, "sessionType");
  const [apiMessage, setApiMessage] = useState("");

  const statusData = useSelector(
    (state) => state.category.statusData.responseData
  );
  console.log(statusData, ".");
  const markList = useSelector((state) => state.mark.data.responseData);
  const categorystate = useSelector(
    (state) => state?.category?.data?.responseData
  );
  const markType = useSelector((state) => state.mark.markTypeData.responseData);
  const grades = useSelector((state) => state?.grade?.data?.responseData);

  const searchData = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );
  console.log(searchData, "categorystate");
  const allKutcha = [
    {
      id: 1,
      lotNo: "Lot Number 123",
      invoiceNo: "INV-2023-001",
      origin: "Tea Garden",
      teaTypeName: "Black Tea",

      subTeaTypeName: "Assam",
      categoryName: "Organic",
      markName: "Fresh",
      sessionType: "Summer",
      gradeName: "Grade A",
      packageType: "Box",
      packageNo: "P12345",
      noOfPackages: "50",
      sampleQtyKgs: "2.5",
      grossKgs: "500",
      tareKgs: "25",
      netKgs: "475",
      invoiceWeight: "470",
      shortExcessWeight: "5",
      manufactureFromDate: "2023-06-01",
      manufactureToDate: "2023-06-15",
      gpNo: "GP-2023-001",
      gpDate: "2023-06-20",
      basePrice: "$10",
      auctioneerValuation: "$15",
      reservePrice: "$12",
      priceIncrement: "$2",
      markPackageComments: "Good quality packaging",
      lotComments: "Fresh and aromatic tea",
      qualityComments: "High-quality tea leaves",
      qualityCertification: "ISO 9001:2015",
      brewColor: "Dark Brown",
      ageOfProductsInMonths: "6",
      brewersComments: "Excellent taste and aroma",
      gardenCertification: "Organic Certified",
      warehouse: "Warehouse A",
      locationInsideWarehouse: "Shelf 2, Row 5",
      remarks: "None",
      lastModifiedBy: "John Doe",
      marketType: "Wholesale",
      systemBasePrice: "$8",
    },
    // Add more AWR objects as needed
  ];
  // useEffect(() => {}, [searchData]);
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

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema,
    onSubmit: async (values) => {
      const formData = {
        marketTypeId: parseInt(values.markType) /* update in future */,
        saleNo: parseInt(values.saleNo),
        LotNoStatus: parseInt(values.LotNoStatus), // Convert to integer
        categoryId: parseInt(values.category), // Convert to integer
        gradeId: parseInt(values.grade), // Convert to integer
        markId: parseInt(values.mark), // Convert to integer
        teaTypeId: parseInt(values.teaType), // Convert to integer
        auctioneerId: 10056,
        season: "2023",
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

      // Check for responseData and show toast notification if it's null
      // if (kutchaList === null || kutchaList?.length === 0) {
      //   toast.warning(kutchaListWarning, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 3000,
      //   });
      // } else {
      //   setRows(kutchaList);
      // }

      // console.log(formData, "GOING");
      // Update form values to the first option for all dropdowns if they are empty
      if (!values.teaType && teaType.length > 0) {
        formik.setFieldValue("teaType", teaType[0].teaTypeId);
      }
      if (!values.LotNoStatus && statusData.length > 0) {
        formik.setFieldValue("LotNoStatus", statusData[0].Value);
      }
      if (!values.grade && gradesList.length > 0) {
        formik.setFieldValue("grade", gradesList[0].gradeId);
      }
      if (!values.mark && markDataList.length > 0) {
        formik.setFieldValue("mark", markDataList[0].markId);
      }
      if (!values.category && categoryList.length > 0) {
        formik.setFieldValue("category", categoryList[0].categoryId);
      }

      // Manually validate the updated form values
      try {
        await validationSchema.validate(values, { abortEarly: false });
      } catch (errors) {
        // Handle validation errors
        const errorsMap = {};
        errors.inner.forEach((error) => {
          errorsMap[error.path] = error.message;
        });
        formik.setErrors(errorsMap);
      }
      dispatch(fetchKutchaCatalogueRequest(formData));
      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });

  console.log(kutchaListWarning, "mss");
  // Check for responseData and show toast notification if it's null

  const [sellsNo, setSellNo] = useState(1);

  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState([]);
  // const [year, setYear] = useState("2023");
  const [sessionTypes, setSessionType] = useState([]); // If using React state hooks

  const [teaTypeList, setTeaTeatypeList] = useState([]);
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
  const [openConformationModal, setOpenConformationModal] = useState(false);
  const { handleChange, handleBlur, values, touched, errors } = formik;
  const [tableData, setTableData] = useState(null);
  const [fieldData, setFieldData] = useState({});
  const [updatedData, setUpdatedDataList] = useState([]);
  const [markTypeValue, setMarkTypeValue] = useState("0");

  useEffect(() => {
    dispatch(teaTypeAction());
    dispatch(fetchMarkTypeRequest());
    dispatch(fetchMarkRequest());
    // dispatch(fetchWarehouseUserRequest());
    dispatch(fetchGradeRequest());
    dispatch(fetchSaleNumbersRequest(formik.values.season));
    dispatch(fetchCategoryRequest());
    dispatch(fetchStatusRequest(6));

    //     dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
  }, []);

  useEffect(() => {
    setRows(kutchaList);
    setUpdatedDataList(kutchaList);
    setmark(markType);
    setGradesList(grades);
    setMarkDataList(markList);
    setTeaTeatypeList(teaType);
    setcategory(categorystate);
    setSessionType(sessionType);
    console.log(gradesList, kutchaList, teaTypeList, markList, "gtt");
  }, [
    gradesList,
    grades,
    categorystate,
    teaTypeList,
    teaType,
    markList,
    markType,
  ]);
  console.log(sessionTypes, "sessionTypess");

  const SampleTxt = ({ rowIndex, name, value, onChange, disabled }) => {
    return (
      <InputGroup>
        <FormControl
          disabled={disabled ? disabled : false}
          name={name}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setTableData((prevData) => {
              const updatedData = [...prevData];
              updatedData[rowIndex][name] = e.target.value;
              return updatedData;
            });
          }}
        />
      </InputGroup>
    );
  };

  // Function to handle input value changes
  // const handleInputChange = (key, value) => {
  //   console.log(key, value, rows, "nnnn");
  //   // const data = { key: key, value: value };
  //   let columnsName = kutcha.some((ele) => ele.name === key);
  //   const data = [...rows];
  //   const updatedItem = [...data].map(
  //     (item, index) => (item[key.toString()] = value)
  //   );

  //   console.log(updatedItem, "ndnnn");

  //   const updatedDataList = rows.map((item) =>
  //     kutcha.some((ele) => ele.name === key) ? {} : item
  //   );
  //   setUpdatedData(updatedDataList);
  // };

  // Function to handle input value changes

  function updateObjectByKey(arrayOfObjects, keyName, newValue) {
    return arrayOfObjects?.map((obj) => {
      if (obj.hasOwnProperty(keyName)) {
        return {
          ...obj,
          [keyName]: newValue,
        };
      }
      return obj;
    });
  }
  const handleInputChange = (key, value) => {
    let updatedDataList = updateObjectByKey(updatedData, key, value);

    const formData = updatedDataList?.map((item) => {
      return {
        KutchaCatalogId:
          item.KutchaCatalogId == null ? "" : item.KutchaCatalogId,
        SampleQty: item.SampleQty == null ? 0 : parseFloat(item.SampleQty),
        basePrice: item.basePrice == null ? 0 : parseFloat(item.basePrice),
        reservePrice:
          item.reservePrice == null ? 0 : parseFloat(item.reservePrice),
        auctioneerValuation:
          item.auctioneerValuation == null
            ? 0
            : parseFloat(item.auctioneerValuation),
        priceIncrement:
          item.priceIncrement == null ? 0 : parseInt(item.priceIncrement),
        markPackageComments:
          item.markPackageComments == null ? "" : item.markPackageComments,
        lotComments: item.lotComments == null ? "" : item.lotComments,
        qualityComments:
          item.qualityComments == null ? "" : item.qualityComments,
        qualityCertification:
          item.qualityCertification == null ? "" : item.qualityCertification,
        brewColor: item.brewColor == null ? "" : item.brewColor,
        ageOfProducts:
          item.ageOfProducts == null ? 0 : parseInt(item.ageOfProducts),
        brewersComments:
          item.brewersComments == null ? "" : item.brewersComments,
        gardenCertification:
          item.gardenCertification == null ? "" : item.gardenCertification,
        locationInsideWarehouse:
          item.locationInsideWarehouse == null
            ? ""
            : item.locationInsideWarehouse,
        remarks: item.remarks == null ? "" : item.remarks,
        // lastModifiedBy:
        //   item.lastModifiedBy == null ? "" : parseInt(item.lastModifiedBy),
        SystemBasePrice:
          item.SystemBasePrice == null ? "" : parseFloat(item.SystemBasePrice),
        // MarketType: item.MarketType == null ? "" : item.MarketType,
        updatedBy: 10056,
      };
    });
    console.log(formData, "updatedDataList");
    setUpdatedDataList(formData);
  };

  // console.log(updatedData,"updatedData")

  // const kutcha = [
  //   // {
  //   //   name: "select",
  //   //   title: "Select",
  //   //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
  //   // },
  //   { name: "LotNo", title: "Lot No " },
  //   { name: "invoiceNo", title: "Invoice No" },
  //   { name: "origin", title: "origin" },
  //   { name: "teaTypeName", title: "Tea Type" },
  //   { name: "subTeaTypeName", title: "Sub Tea Type" },
  //   { name: "categoryName", title: "Category" },
  //   { name: "markName", title: "Mark" },
  //   {
  //     name: "sessionType",
  //     title: "Session Type",
  //     getCellValue: (row) => {
  //       console.log(row, "sessionTypes");
  //       // const data=row?.at(0)
  //       if (row.sessionTypeId === null) {
  //         return (
  //           <InputGroup>
  //             <FormControl
  //               as="select"
  //               name="sessionType"
  //               value={sessionTypes}
  //               onChange={(e) => handleSessionTypeChange(e.target.value)}
  //               required
  //             >
  //               {sessionType?.map((type) => (
  //                 <option key={type.sessionTypeId} value={type.sessionTypeName}>
  //                   {type.sessionTypeName}
  //                 </option>
  //               ))}
  //             </FormControl>
  //           </InputGroup>
  //         );
  //       } else {
  //         <span>{row.sessionTypeId}</span>;
  //       }
  //     },
  //   },

  //   { name: "gradeName", title: "Grade" },
  //   { name: "packageType", title: "Package Type" },
  //   { name: "packageNo", title: "Package No." },
  //   {
  //     name: "totalPackages",
  //     title: "No. of Packages",
  //   },
  //   {
  //     name: "SampleQty",
  //     title: "Sample Qty.(Kgs)",
  //   },
  //   { name: "grossKgs", title: "Gross Weight" },
  //   { name: "tareKgs", title: "Tare Weight" },
  //   { name: "netKgs", title: "Net Weight" },
  //   { name: "invoiceWeight", title: "Invoice Weight" },
  //   { name: "shortExcessWeight", title: "Short/Excess Weight" },
  //   { name: "manufactureFromDate", title: "Manufacture From Date" },
  //   { name: "manufactureToDate", title: "Manufacture To Date" },
  //   { name: "gpNo", title: "GP No" },
  //   { name: "gpDate", title: "GP Date" },
  //   {
  //     name: "basePrice",
  //     title: "Base Price",
  //   },
  //   {
  //     name: "auctioneerValuation",
  //     title: "Auctioneer Valuation",
  //   },
  //   {
  //     name: "reservePrice",
  //     title: "Reserve Price",
  //   },
  //   {
  //     name: "priceIncrement",
  //     title: "Price Increment",
  //   },
  //   {
  //     name: "markPackageComments",
  //     title: "Mark & Package Comments",
  //   },
  //   {
  //     name: "lotComments",
  //     title: "Lot Comments",
  //   },
  //   {
  //     name: "qualityComments",
  //     title: "Quality Comments",
  //   },
  //   {
  //     name: "qualityCertification",
  //     title: "Quality Certification",
  //   },
  //   {
  //     name: "brewColor",
  //     title: "Brew Color",
  //   },
  //   {
  //     name: "ageOfProducts",
  //     title: "Age of Products (In Months)",
  //   },
  //   {
  //     name: "brewersComments",
  //     title: "Brewers Comments",
  //   },
  //   {
  //     name: "gardenCertification",
  //     title: "Garden Certification",
  //   },
  //   {
  //     name: "wareHouseName",
  //     title: "Warehouse",
  //   },
  //   {
  //     name: "locationInsideWarehouse",
  //     title: "Location Inside Warehouse",
  //   },
  //   {
  //     name: "remarks",
  //     title: "Remarks",
  //   },
  //   {
  //     name: "lastModifiedBy",
  //     title: "Last Modified By",
  //   },
  //   {
  //     name: "marketTypeName",
  //     title: "Market Type",
  //   },
  //   {
  //     name: "SystemBasePrice",
  //     title: "System Base Price",
  //   },

  //   // {
  //   //   name: "action",
  //   //   title: "Action",
  //   //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
  //   // },
  // ];

  const handleSessionTypeChange = (selectedSessionType) => {
    setSessionType(selectedSessionType);
  };

  // const handleRefresh = () => {};
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
      auctioneerId: 10056,
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
  // console.log(tableData, "tableData", rows, "rows");

  const useFieldData = () => {
    const updateFieldData = (rowIndex, columnName, value) => {
      const key = `${rowIndex}-${columnName}`;
      setFieldData((prevData) => ({ ...prevData, [key]: value }));
    };

    return { fieldData, updateFieldData };
  };

  // const TableComponent = ({ columns, data }) => {
  //   return (
  //     <table className="table table-responsive">
  //       <thead>
  //         <tr>
  //           {columns?.map((column) => (
  //             <th key={column.name}>{column.title}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {data?.map((row,rowIndex) => (
  //           <tr key={rowIndex}>
  //             {columns?.map((column) => {
  //               return (
  //                 <td key={column.name}>
  //                   {column.getCellValue ? (
  //                     column.getCellValue(row,rowIndex)
  //                   ) : row[column.name] === null ? (
  //                     <input
  //                       type="text"
  //                       value={row[column.name] || ""}
  //                       onChange={(e) =>
  //                         console.log(rowIndex, column.name, e.target.value)
  //                       }
  //                       required={column.required} // Use the 'required' attribute here
  //                     />
  //                   ) : (
  //                     row[column.name]
  //                   )}
  //                 </td>
  //               );
  //             })}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  // };
  const handleSampleQtyChange = (name, value) => {
    // You can update the corresponding row's data in the `rows` state or handle the value as needed

    console.log("Sample Q ty.(Kgs) changed to:", value);

    setTableData({
      ...tableData,
      [name]: value,
    });
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
    if (kutchaList?.length > 0) {
      setRows(kutchaList);
    } else {
      setRows([]);
    }
  }, [kutchaList]);

  // handle Update
  // const getEmptyFields = (rows, kutcha) => {
  //   const emptyFields = rows.map((item) =>
  //     kutcha.filter(
  //       (column) => item[column.name] === null || item[column.name] === ""
  //     )
  //   );
  //   return emptyFields.map((column) => column.title);
  // };

  // const handleUpdate = () => {
  //   const emptyFields = getEmptyFields(updatedData, kutcha);

  //   console.log(updatedData, emptyFields, "updatedData");
  //   if (emptyFields.length === 0) {
  //     // Perform your update action here
  //     toast.success("All fields are filled. Proceed with the update.");
  //     setRows(updatedData)
  //   } else {
  //     toast.error("Please fill fields before updating.");
  //   }
  // };

  const handleUpdate = () => {
    // console.log(updatedData, "updatedDataList");
    dispatch(updateKutchaCatalogueRequest(updatedData));
  };

  // console.log(rows,"rows")
  return (
    <>
      <div>
        <DeleteConfirmationModal
          show={openDelete}
          onDelete={() => {
            setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />
        <ConfirmationModal
          show={openConformationModal}
          title="Are you sure you want to Generate Lot no. ?"
          onYes={() => {
            if (
              formik.values.markType !== "A" ||
              formik.values.LotNoStatus === 0
            ) {
              const data = {
                season: formik.values.season.toString(),
                saleNo: parseInt(formik.values.saleNo),
                teaTypeId: parseInt(formik.values.teaType),
                markId: parseInt(formik.values.mark),
                auctionCenterId: 1,
                userId: 10056,
                marketTypeId: parseInt(formik.values.markType),
                categoryId: parseInt(formik.values.category),
                gradeId: parseInt(formik.values.grade),
                auctioneerId: 10056,
              };
              console.log(data, "datadata");
              dispatch(generateLotNoRequest(data));
              axiosMain
                .post("/preauction/KutchaCatalogue/GenerateLotNo", data)
                .then((res) => {
                  toast.success(res.data.message);
                })
                .catch((error) => {
                  toast.error(error.data.message);
                });
            } else {
              toast.error(
                "Lot No Status must be pendding or Mark type All is not valid to genarate Lot No "
              );
            }
            setOpenConformationModal(false);
          }}
          onHide={() => setOpenConformationModal(false)}
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
            <Typography>Kutcha Catalog List</Typography>
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
                <div className="col-lg-2">
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
                      onChange={(e) => {
                        handleChange(e);
                        setMarkTypeValue(e.target.value);
                      }}
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
                                {item.categoryName}
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
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          {/* <option value="A">All</option> */}

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
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" type="submit">
                      Search
                    </Button>

                    {markTypeValue === "0" ? (
                      <Button
                        className="SubmitBtn"
                        onClick={() => setOpenConformationModal(true)}
                      >
                        Generate Lot No
                      </Button>
                    ) : (
                      ""
                    )}

                    <Button
                      className="SubmitBtn"
                      onClick={() => formik.resetForm()}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <strong>Lot Count :</strong>
                  {kutchaList?.length === null ? 0 : kutchaList?.length}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2">
                  <Button className="SubmitBtn" onClick={handleExportExcel}>
                    Export as Excel
                  </Button>
                </div>
              </div>
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

              {/* <div>
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
              </div> */}
            </form>
            <div id={rows?.length > 0 ? "invoiceTable" : "invoiceTable" + "c"}>
              {/* <TableComponent
                columns={kutcha}
                rows={rows}
                setRows={setRows}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              /> */}
              {/* <TableComponent columns={kutcha} data={rows} />
               */}
              <KutchaTable rows={rows} setRows={setRows} />
            </div>
          </AccordionDetails>
        </Accordion>
        <ToastContainer />
        {/* <Accordion
          expanded={expandedTab === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>AWR Maintenance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AWRForm />
          </AccordionDetails>
        </Accordion> */}
      </div>
    </>
  );
};

export default Modal;
