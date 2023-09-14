import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormControl,
  InputGroup,
  Form,
  Table,
  Card,
} from "react-bootstrap";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import * as XLSX from "xlsx"; // Library for Excel file reading
import { saveAs } from "file-saver";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import { format } from "date-fns"; // Import the format function from date-fns

import {
  addInvoiceDetailsRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  fetchSaleProgramListRequest,
  fetchWarehouseUserRequest,
  getSaleNoRequest,
  teaTypeAction,
} from "../../../../store/actions/index";
import { useSelector } from "react-redux";
import { fetchSubTeaTypeRequest } from "../../../../store/actions/teaType/TeaType";
import UploadeFile from "./UploadeFile";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import axiosMain from "../../../../http/axios/axios_main";
import FileUpload from "../../../../components/common/uploadFile/FileUpload";
import { readFileAndCheckHeaders } from "../../../../components/common/uploadFile/utils";

const currentDate = new Date();
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];

const validationSchema = Yup.object().shape({
  mark: Yup.number().required("Please select mark"),
  warehouse: Yup.string().required("Warehouse is required"),
  warehouseName: Yup.string().required("Warehouse Name is required"),
  warehouseAddress: Yup.string().required("Warehouse Address is required"),
  invoiceNo: Yup.string().required("Invoice No is required"),
  invoiceQty: Yup.string().required("Invoice Qty is required"),
  // origin: Yup.string().required("Origin is required"),
  // manufacture: Yup.string().required("Manufacture is required"),
  // grade: Yup.string().required("Grade is required"),

  manufactureFromDate: Yup.date().required("From Date is required"),
  manufactureToDate: Yup.date()
    .required("To Date is required")
    .min(
      Yup.ref("manufactureFromDate"),
      "To Date must be greater than or equal to From Date"
    ),

  dateOfDispatch: Yup.date().required("Date of Dispatch is required"),
  // invoiceDate: Yup.date().required("Invoice Date is required"),
  season: Yup.string().required("Please select Season"),
  saleNo: Yup.string().required("Please select Sale No"),
  auctioneer: Yup.string().required("Auctioneer is required"),
  // lorryReceiptNo: Yup.string().required("Lorry Receipt No is required"),
  // lorryNo: Yup.string().required("Lorry No is required"),
  // invRefNo: Yup.string().required("Inv Ref No is required"),
  // carrier: Yup.string().required("Carrier is required"),
  subType: Yup.number()
    .min(1, "Please select sub tea type")
    .required("Sub Type is required"),
  teaType: Yup.number()
    .min(1, "Please select tea type")
    .required("Tea Type is required"),
  category: Yup.number()
    .required("Category is required")
    .min(1, "Please select Category type"),
  // packageSize: Yup.string().required("Package Size is required"),
  packageType: Yup.string().required("Package Type is required"),
  packageNo: Yup.string()
    .required("Package No is required")
    .test(
      "is-package-range",
      "Enter the appropriate package number.For example, 1-25, 10-50, 001-0030, etc.",
      function (value) {
        if (!/^\d+-\d+$/.test(value)) {
          return false; // Incorrect format, handled by the regular expression test
        }

        const [start, end] = value.split("-");
        return parseInt(start) < parseInt(end);
      }
    ),
  totalPackages: Yup.string().required("Total Packages is required"),
  grossKgs: Yup.number()
    .typeError("Gross Kgs must be a number")
    .positive("Gross Kgs must be a positive number")
    .test(
      "is-numeric-with-decimal",
      "Positive Numeric with two digits after decimal point Non-zero.",
      function (value) {
        return /^\d+(\.\d{1,2})?$/.test(value);
      }
    )
    .min(0.01, "Gross Kgs must be at least 0.01"),

  tareKgs: Yup.number()
    .required("Tare Kgs is required")
    .typeError("Tare KGs must be a number")
    .positive("Tare KGs must be a positive number")
    .test(
      "is-numeric-with-decimal",
      "Positive Numeric with two digits after decimal point Non-zero.",
      function (value) {
        return /^\d+(\.\d{1,2})?$/.test(value);
      }
    )
    .min(0.01, "Gross Kgs must be at least 0.01")
    .lessThan(Yup.ref("grossKgs"), "Tare KGs must be less than Gross KGs"),
  netKgs: Yup.string().required("Net Kgs is required"),
  totalNetKgs: Yup.string().required("Total Net Kgs is required"),
  // gpNo: Yup.string().required("Gp No is required"),
  // gpDate: Yup.string().required("Gp Date is required"),
  // shortExcessWeight: Yup.number()
  //   // .required("Short ExcessWeight is required")
  //   .typeError("Short/Excess Weight must be a number")
  //   .positive("Short/Excess Weight must be a positive number")
  //   .test(
  //     "validate-short-excess-weight",
  //     "Short/Excess Weight should not be greater than (Package No * (Gross Weight - Tare Weight))",
  //     function (value) {
  //       const packageNo = this.resolve(Yup.ref("totalPackages"));
  //       const grossWeight = this.resolve(Yup.ref("grossKgs"));
  //       const tareWeight = this.resolve(Yup.ref("tareKgs"));
  //       const maxShortExcessWeight = packageNo * (grossWeight - tareWeight);
  //       return value <= maxShortExcessWeight;
  //     }
  //   ),
  // locationInsideWarehouse: Yup.string().required(
  //   "location InsideWarehouse is required"
  // ),
  // invoiceRefNo: Yup.string().required("invoiceRefNo is required"),
});

const initialValues = {
  mark: 0,
  warehouse: 0,
  warehouseName: "",
  warehouseAddress: "",
  invoiceNo: null,
  invoiceQty: null,
  // origin: "",
  manufacture: "",
  grade: 0,
  manufactureFromDate: currentDate.toISOString().split("T")[0],
  manufactureToDate: currentDate.toISOString().split("T")[0],
  dateOfDispatch: "",
  invoiceDate: currentDate.toISOString().split("T")[0],
  season: new Date().getFullYear(),
  saleNo: "",
  auctioneer: 10023,
  lorryReceiptNo: "",
  lorryNo: "",
  invRefNo: 0,
  carrier: "",
  teaType: 0,
  subType: 0,
  category: 0,
  packageSize: "",
  packageType: "",
  packageNo: "",
  totalPackages: 0,
  sampleQty: 0,
  grossKgs: null,
  tareKgs: "",
  netKgs: "",
  totalNetKgs: 0,
  gpNo: "",
  gpDate: "",
  shortExcessWeight: 10,
  locationInsideWarehouse: "",
  invoiceRefNo: "",
};

const CreateInvoiceForm = ({
  isDisabled,
  invoiceResponseData,
  viewData,
  srNo,
  handleAccordionChange,
  invoiceStatusLable,
  receivedDateLable,
}) => {
  const [formInitialData, setFormInitialData] = useState(initialValues);
  const [saleprogrmId, setsaleprogrmId] = useState(null);
  const [catalogClosingDate, setCatalogClosingDate] = useState(null);

  const manuallypropertyNames = [
    {
      name: "markId",
      title: "Mark",
      getCellValue: ({ ...row }) => (
        <span>
          {markDataList?.map((ele) =>
            ele.markId == row?.markId ? ele.markName : ""
          )}
        </span>
      ),
    },
    { name: "season", title: "Season" },
    {
      name: "teaType",
      title: "Tea Type",
      getCellValue: ({ ...row }) => (
        <span>
          {teaTypeList?.map((ele) =>
            ele.teaTypeId == row?.teaTypeId ? ele.teaTypeName : ""
          )}
        </span>
      ),
    },
    { name: "saleNo", title: "Sale No" },
    {
      name: "wareHouseUserReg",
      title: "Warehouse User Registration",
      getCellValue: ({ ...row }) => (
        <span>
          {warehouseUserList?.map((ele) =>
            ele.wareHouseUserRegId === row?.wareHouseUserRegId
              ? ele.wareHouseName
              : ""
          )}
        </span>
      ),
    },
    // { name: "auctioneerId", title: "Auctioneer ID" },
    {
      name: "categoryId",
      title: "Category",
      getCellValue: ({ ...row }) => (
        <span>
          {category?.map((ele) =>
            ele.categoryId === row?.categoryId ? ele.categoryName : ""
          )}
        </span>
      ),
    },
    { name: "manufactureFromDate", title: "Manufacture From Date" },
    { name: "manufactureToDate", title: "Manufacture To Date" },
    { name: "dateOfDispatch", title: "Date of Dispatch" },
    { name: "invoiceDate", title: "Invoice Date" },
    { name: "carrier", title: "Carrier" },
    { name: "lorryReceiptNo", title: "Lorry Receipt Number" },
    { name: "lorryNo", title: "Lorry Number" },
    { name: "invoiceNo", title: "Invoice Number" },
    { name: "arrivalDate", title: "Arrival Date" },
    { name: "awrDate", title: "AWR Date" },
    { name: "awrReferenceNo", title: "AWR Reference Number" },
    {
      name: "subTeaTypeId",
      title: "Sub Tea Type",
      getCellValue: ({ ...row }) => (
        <span>
          {subTeaType?.map((ele) =>
            ele.subTeaTypeId === row?.subTeaTypeId ? ele.subTeaTypeName : ""
          )}
        </span>
      ),
    },
    {
      name: "gradeId",
      title: "Grade",
      getCellValue: ({ ...row }) => (
        <span>
          {gradesList?.map((ele) =>
            ele.gradeId === row?.gradeId ? ele.gradeName : ""
          )}
        </span>
      ),
    },
    {
      name: "packageType",
      title: "Package Type",
      getCellValue: ({ ...row }) => <span>Paper sacks</span>,
    },
    {
      name: "packageSize",
      title: "Package Size",
      getCellValue: ({ ...row }) => <span> 27x21x11</span>,
    },
    { name: "packageNo", title: "Package Number" },
    { name: "totalPackages", title: "Total Packages" },
    { name: "grossKgs", title: "Gross Kgs" },
    { name: "tareKgs", title: "Tare Kgs" },
    { name: "netKgs", title: "Net Kgs" },
    { name: "totalNetKgs", title: "Total Net Kgs" },
    { name: "gpNo", title: "GP Number" },
    { name: "gpDate", title: "GP Date" },
    { name: "shortExcessWeight", title: "Short Excess Weight" },
    { name: "locationInsideWarehouse", title: "Location Inside Warehouse" },
    // {
    //   name: "isActive",
    //   title: "Is Active",
    //   getCellValue: ({ ...row }) => (
    //     <span>{row.isActive == true ? "true" : "false"}</span>
    //   ),
    // },
    // { name: "createdBy", title: "Created By" },
    { name: "invoiceQty", title: "Invoice Qty" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setPropertyNameList(manuallypropertyNames);
      if (viewData.data.responseData?.length > 0) {
        const apiUrlCatagory =
          "/preauction/InvoiceDetails/UpdateInvoiceDetails";

        const data = {
          markId: parseInt(values?.mark),
          season: values?.season.toString(),
          teaTypeId: parseInt(values?.teaType),
          // SaleProgramId: parseInt(values?.saleNo),
          SaleProgramId: saleprogrmId,
          wareHouseUserRegId: parseInt(values?.warehouse),
          auctioneerId: parseInt(values?.auctioneer),
          categoryId: parseInt(values?.category),
          manufactureFromDate: values?.manufactureFromDate,
          manufactureToDate: values?.manufactureToDate,
          dateOfDispatch: values?.dateOfDispatch,
          invoiceDate: values?.invoiceDate,
          carrier: values?.carrier,
          lorryReceiptNo: values?.lorryReceiptNo,
          lorryNo: values?.lorryNo,
          invoiceNo: values?.invoiceNo,
          arrivalDate: null,
          awrDate: null,
          awrReferenceNo: null,
          subTeaTypeId: parseInt(values?.subType),
          gradeId:
            parseInt(values?.grade) === 0
              ? gradesList?.at(0)?.gradeId
              : parseInt(values?.grade),
          packageType: values?.packageType,
          packageSize: values?.packageSize,
          packageNo: values?.packageNo,
          totalPackages: parseInt(values?.totalPackages),
          grossKgs: parseInt(values?.grossKgs),
          tareKgs: parseInt(values?.tareKgs),
          netKgs: parseInt(values?.netKgs),
          totalNetKgs: parseInt(values?.totalNetKgs),
          gpNo: null,
          gpDate: null,
          shortExcessWeight: parseInt(values?.shortExcessWeight),
          locationInsideWarehouse: values?.locationInsideWarehouse,
          isActive: true,
          createdBy: 10023,
          updatedBy: 1,
          invoiceRefNo: values?.invoiceRefNo,
          invoiceQty: parseInt(values?.invoiceQty),
          DataFlag: "",
          TeaType: "",
          Category: "",
          Grade: "",
          Mark: "",
          SubTeaType: "",
          Warehouse: "",
          Auctioneer: "",
        };

        axiosMain
          .post(apiUrlCatagory, [data])
          .then((response) => {
            // Handle the API response here'

            // setSelectedSalePrograms({
            //   ...selectedSalePrograms,
            //   categoryId: response?.data?.responseData[0].categoryId,
            // });
            if (response.data.statusCode === 200) {
              toast.success(response.data.message);
              handleAccordionChange("panel1");
              setInvoiceData([]);
            } else {
              toast.error(response.data.message);
            }
            // console.log(response, "invresponse");
          })
          .catch((error) => {
            // Handle errors here
          });
        setPropertyNameList(manuallypropertyNames);
        console.log(values, data, "updateDa");
      } else {
        const data = {
          markId: parseInt(values?.mark),
          season: values?.season.toString(),
          teaTypeId: parseInt(values?.teaType),
          // SaleProgramId: parseInt(values?.saleNo),
          SaleProgramId: saleprogrmId,
          wareHouseUserRegId: parseInt(values?.warehouse),
          auctioneerId: parseInt(values?.auctioneer),
          categoryId: parseInt(values?.category),
          manufactureFromDate: values?.manufactureFromDate,
          manufactureToDate: values?.manufactureToDate,
          dateOfDispatch: values?.dateOfDispatch,
          invoiceDate: values?.invoiceDate,
          carrier: values?.carrier,
          lorryReceiptNo: values?.lorryReceiptNo,
          lorryNo: values?.lorryNo,
          invoiceNo: values?.invoiceNo,
          arrivalDate: null,
          awrDate: null,
          awrReferenceNo: null,
          subTeaTypeId: parseInt(values?.subType),
          gradeId:
            parseInt(values?.grade) === 0
              ? gradesList?.at(0)?.gradeId
              : parseInt(values?.grade),
          packageType: values?.packageType,
          packageSize: values?.packageSize,
          packageNo: values?.packageNo,
          totalPackages: parseInt(values?.totalPackages),
          grossKgs: parseInt(values?.grossKgs),
          tareKgs: parseInt(values?.tareKgs),
          netKgs: parseInt(values?.netKgs),
          totalNetKgs: parseInt(values?.totalNetKgs),
          gpNo: null,
          gpDate: null,
          shortExcessWeight: parseInt(values?.shortExcessWeight),
          locationInsideWarehouse: values?.locationInsideWarehouse,
          isActive: true,
          createdBy: 10023,
          invoiceRefNo: values?.invoiceRefNo,
          invoiceQty: parseInt(values?.invoiceQty),
          DataFlag: "",
          TeaType: "",
          Category: "",
          Grade: "",
          Mark: "",
          SubTeaType: "",
          Warehouse: "",
          Auctioneer: "",
        };
        setInvoiceData([...invoiceData, data]);
      }

      resetForm();
      // setInvoiceData([]);
      // invoiceData.push(data)

      // const data = [{
      //   markId: 8,
      //   season: "2023",
      //   teaTypeId: 1,
      //   SaleProgramId: 10012,
      //   wareHouseUserRegId: 3,
      //   auctioneerId: 10023,
      //   categoryId: 2,
      //   manufactureFromDate: "2023-02-03T17:16:40",
      //   manufacturemanufactureToDate: "2023-03-02T17:16:40",
      //   dateOfDispatch: "2023-07-30T17:16:40",
      //   invoiceDate: "2023-07-20T17:16:40",
      //   carrier: "tes",
      //   lorryReceiptNo: "test",
      //   lorryNo: "test",
      //   invoiceNo: "ABC61",
      //   arrivalDate: "2023-07-17T17:16:40",
      //   awrDate: "2023-07-17T17:16:40",
      //   awrReferenceNo: "AWR02",
      //   subTeaTypeId: 2,
      //   gradeId: 4,
      //   packageType: "test",
      //   packageSize: 1,
      //   packageNo: 1,
      //   totalPackages: 2,
      //   grossKgs: 10,
      //   tareKgs: 5,
      //   netKgs: 0,
      //   totalNetKgs: 0,
      //   gpNo: "test",
      //   gpDate: "2023-07-17T17:16:40",
      //   shortExcessWeight: 10,
      //   locationInsideWarehouse: "test",
      //   isActive: true,
      //   createdBy: 1,
      //   invoiceRefNo: "123ABC",
      //   invoiceQty: 100,
      // }];
      // Handle form submission here
      // console.log(data, "😒😒😒");
    },
  });
  console.log(parseInt(saleprogrmId), "saleee");
  useEffect(() => {
    let data = viewData.data.responseData?.at(0);
    console.log(data, "viewData");

    if (viewData?.data?.responseData?.length > 0) {
      // formik.initialValues = data;
      // formik.setValues({...formik.values,
      //   mark: data.mark,
      //   warehouseName: "",
      //   invoiceNo: null,
      //   invoiceQty: null,
      //   manufacture: data.manufacturerName,
      //   grade: data.gradeName,
      //   manufactureFromDate: "",
      //   manufactureToDate: "",
      //   dateOfDispatch: "",
      //   invoiceDate: "",
      //   season: new Date().getFullYear(),
      //   saleNo: "",
      //   lorryReceiptNo: "",
      //   lorryNo: "",
      //   carrier: "",
      //   teaType: data.teaTypeName,
      //   subType: 0,
      //   category: 0,
      //   packageSize: "",
      //   packageType: "",
      //   packageNo: "",
      //   totalPackages: 0,
      //   sampleQty: 0,
      //   grossKgs: null,
      //   tareKgs: "",
      //   netKgs: "",
      //   totalNetKgs: "",
      //   gpNo: "",
      //   gpDate: "",
      //   shortExcessWeight: 10,
      //   locationInsideWarehouse: "",
      //   invoiceRefNo: "",
      // })
      console.log(data, "viewData");

      formik.setValues({
        ...formik.values,
        mark: data.mark,
        warehouse: data.warehouse,
        warehouseName: data.warehouseName,
        warehouseAddress: data.address,
        invoiceNo: data.invoiceNo,
        invoiceQty: data.invoiceQty,
        manufacture: data.manufacturerName,
        grade: data.grade,
        manufactureFromDate:
          viewData.data.responseData?.length > 0
            ? viewData.data.responseData
                ?.at(0)
                ?.manufactureFromDate?.split("T")[0]
            : "",
        manufactureToDate: data.manufactureToDate,
        dateOfDispatch: data.dateOfDispatch,
        invoiceDate: data.invoiceDate,
        season: data.season,
        saleNo: data.saleNo,
        lorryReceiptNo: data.lorryReceiptNo,
        lorryNo: data.lorryNo,
        carrier: data.carrier,
        teaType: data.teaType,
        subType: data.subTeaType,
        category: data.category,
        packageSize: data.packageSize,
        packageType: data.packageType,
        packageNo: data.packageNo,
        totalPackages: data.totalPackages,
        sampleQty: 0,
        grossKgs: data.grossKgs,
        tareKgs: data.tareKgs,
        netKgs: data.netKgs,
        totalNetKgs: data.totalNetKgs,
        gpNo: data.gpNo,
        gpDate: data.gpDate,
        locationInsideWarehouse: data.locationInsideWarehouse,
        invoiceRefNo: data.invoiceRefNo,
      });

      console.log(data.subTeaType, data.totalNetKgs, "data.subTeaType");
    } else {
      console.log(viewData, "viewData");
    }

    // console.log(viewData, "viewData");
  }, [viewData]);
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [subTeaTypeNo, setSubTeaTypeNo] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [FileErrors, setErrors] = useState({});
  const [invoiceData, setInvoiceData] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [sampleList, setSampleList] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [validationData, setValidationData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  const [propertyNameList, setPropertyNameList] = useState([]);

  const saleData = {
    season: "2023",
    saleNo: 0,
    pageNumber: 2,
    pageSize: 10,
  };

  // const [formData, setFormData] = useState();

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );
  const subTeaType = useSelector((state) => state.teaType.data.responseData);

  const markList = useSelector((state) => state.mark.data.responseData);
  const warehouseUsersList = useSelector(
    (state) => state.warehouseUser.data.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  const saleNumber = useSelector(
    (state) => state?.auction?.saleNumber?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);
  console.log(saleNumber, "😒😒😒F");

  const fileInputRef = useRef(null);

  const propertyNames = [
    {
      name: "Mark",
      title: "Mark",
    },
    { name: "season", title: "Season" },
    {
      name: "TeaType",
      title: "Tea Type",
    },
    { name: "saleNo", title: "Sale No" },
    {
      name: "Warehouse",
      title: "Warehouse User Registration",
    },
    // { name: "auctioneerId", title: "Auctioneer ID" },
    {
      name: "Category",
      title: "Category",
    },
    { name: "manufactureFromDate", title: "Manufacture From Date" },
    { name: "manufactureToDate", title: "Manufacture To Date" },
    { name: "dateOfDispatch", title: "Date of Dispatch" },
    { name: "invoiceDate", title: "Invoice Date" },
    { name: "carrier", title: "Carrier" },
    { name: "lorryReceiptNo", title: "Lorry Receipt Number" },
    { name: "lorryNo", title: "Lorry Number" },
    { name: "invoiceNo", title: "Invoice Number" },
    { name: "arrivalDate", title: "Arrival Date" },
    { name: "awrDate", title: "AWR Date" },
    { name: "awrReferenceNo", title: "AWR Reference Number" },
    {
      name: "SubTeaType",
      title: "Sub Tea Type",
    },
    {
      name: "Grade",
      title: "Grade",
    },
    {
      name: "packageType",
      title: "Package Type",
      getCellValue: ({ ...row }) => <span>Paper sacks</span>,
    },
    {
      name: "packageSize",
      title: "Package Size",
      getCellValue: ({ ...row }) => <span> 27x21x11</span>,
    },
    { name: "packageNo", title: "Package Number" },
    { name: "totalPackages", title: "Total Packages" },
    { name: "grossKgs", title: "Gross Kgs" },
    { name: "tareKgs", title: "Tare Kgs" },
    { name: "netKgs", title: "Net Kgs" },
    { name: "totalNetKgs", title: "Total Net Kgs" },
    { name: "gpNo", title: "GP Number" },
    { name: "gpDate", title: "GP Date" },
    { name: "shortExcessWeight", title: "Short Excess Weight" },
    { name: "locationInsideWarehouse", title: "Location Inside Warehouse" },
    // {
    //   name: "isActive",
    //   title: "Is Active",
    //   getCellValue: ({ ...row }) => (
    //     <span>{row.isActive == true ? "true" : "false"}</span>
    //   ),
    // },
    // { name: "createdBy", title: "Created By" },
    { name: "invoiceQty", title: "Invoice Qty" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

  // const handleFileRemove = (index) => {
  //   setUploadedFiles((prevFiles) => {
  //     const updatedFiles = [...prevFiles];
  //     updatedFiles.splice(index, 1);
  //     return updatedFiles;
  //   });
  //   setInvoiceData([]);
  // };
  // console.log(teaType);
  const dispatch = useDispatch();

  const { handleChange, handleBlur, values, touched, errors } = formik;

  useEffect(() => {
    dispatch(teaTypeAction());
    dispatch(fetchMarkRequest());
    dispatch(fetchWarehouseUserRequest());
    dispatch(fetchGradeRequest());
    // dispatch(fetchSaleProgramListRequest(saleData));
    axiosMain
      .post(
        `/preauction/Common/BindSaleNoBySeason?season=${formik.values.season}`
      )
      .then((res) => setSaleNo(res.data.responseData))
      .catch((err) => toast.error(err));
    dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
    dispatch(fetchCategoryRequest());

    axiosMain
      .post("/preauction/Common/BindAuctioneer", {})
      .then((response) => {
        // Handle the API response here
        setAuctioneer(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });

    if (isDisabled === true) {
      formik.setValues(viewData);
    } else {
      formik.setValues(initialValues);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
  }, [formik.values.teaType]);

  useEffect(() => {
    setTeaTeatypeList(teaType);
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSubTeaTypeNo(subTeaType);
    setCategory(category);
    formik.setFieldValue(
      "warehouse",
      warehouseUsersList?.at(0)?.wareHouseUserRegId
    );
    formik.setFieldValue("auctioneerId", auctioneer?.at(0)?.userId);

    formik.setFieldValue("mark", markList?.at(0)?.markId);
  }, [teaType, subTeaType, markList, warehouseUsersList, grades, category]);

  const ActionArea = (row) => {
    // const indexs = invoiceData.indexOf(row.data.SaleProgramId);

    return (
      <>
        {/* <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            // handleAction("edit");
            formik.setValues(row.data);
          }}
        >
          <EditIcon />
        </Button> */}
        <Button
          className="action-btn"
          onClick={() => {
            // console.log(indexs, row.data, "invData");
            setInvoiceData(
              [...invoiceData].filter(
                (ele) => ele.invoiceNo !== row.data.invoiceNo
              )
            );
            // console.log(row,"invData")
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
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  }

  function resetFunction() {
    formik.resetForm();
  }
  const totalPackagesCalculation = (pkgNo) => {
    const firstValue = parseInt(pkgNo?.split("-")[0]);
    const secondValue = parseInt(pkgNo?.split("-")[1]);
    console.log(pkgNo, firstValue - secondValue, "pkgNopkgNo");
    if (firstValue > secondValue) {
      toast.error("package from has to be greater than package to.");
    } else {
      let result = secondValue - firstValue;
      if (result + 1 <= 0) {
        toast.error("package from has to be greater than zero.");
      } else {
        return result + 1;
      }
    }
  };

  function netKagesCalculation(gross, tare) {
    if (gross > tare) {
      return gross - tare;
    } else {
      toast.error("Tare KGs cannot be greater than or equal to Gross KGs");
    }
  }

  function totalNetKagesCalculation(totalPackage, netKags, sampleQty) {
    const result = totalPackage * netKags;

    return result - sampleQty;
  }
  const hasMatchingHeaders = (data1, data2) => {
    if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
      return false;
    }

    const headers1 = Object.keys(data1[0]);
    const headers2 = Object.keys(data2[0]);

    return (
      headers1.length === headers2.length &&
      headers1.every((header) => headers2.includes(header))
    );
  };

  // console.log(invoiceData, "hi");

  function toCamelCase(str) {
    return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
  }
  function convertKeysToCamelCaseArray(dataArray) {
    return dataArray.map((dataObj) => {
      const newObj = {};
      for (const key in dataObj) {
        if (dataObj.hasOwnProperty(key)) {
          const camelCaseKey = toCamelCase(key);
          newObj[camelCaseKey] = dataObj[key];
        }
      }
      return console.log(newObj, "hi");
    });
  }

  useEffect(() => {
    // console.log(formik.values.warehouse, "formik.values.warehouse");
    axiosMain
      .post(
        `/preauction/InvoiceDetails/GetWareHouseAddress?wareHouseUserRegId=${formik.values.warehouse}`,
        { wareHouseUserRegId: parseInt(formik.values.warehouse) }
      )
      .then((response) => {
        response.data.responseData?.map((ele) =>
          formik.setFieldValue("warehouseAddress", ele.address)
        );
        response.data.responseData?.map((ele) =>
          formik.setFieldValue("warehouseName", ele.wareHouseName)
        );
      })
      .catch((err) => console.log(err));
  }, [formik.values.warehouse]);

  useEffect(() => {
    // console.log(formik.values.warehouse, "formik.values.warehouse");
    axiosMain
      .post(
        `/preauction/InvoiceDetails/GetManufacturerName?markId=${formik.values.mark}`,
        { markId: parseInt(formik.values.mark) }
      )
      .then((response) => {
        response.data.responseData?.map((ele) =>
          formik.setFieldValue("manufacture", ele.manufacturerName)
        );
      })
      .catch((err) => console.log(err));
  }, [formik.values.mark]);

  useEffect(() => {
    const firstValue = parseInt(formik.values.packageNo?.split("-")[0]);
    const secondValue = parseInt(formik.values.packageNo?.split("-")[1]);
    let result = firstValue - secondValue;
    if (firstValue > secondValue) {
      result = firstValue - secondValue;
    } else {
      result = secondValue - firstValue;
    }
    formik.setFieldValue("totalPackages", result + 1);
    // console.log(, "formik.values");
  }, [formik.values.packageNo]);

  useEffect(() => {
    const gross = formik.values.grossKgs;
    const tare = formik.values.tareKgs;

    if (gross > tare) {
      formik.setFieldValue("netKgs", gross - tare);
    } else {
      formik.setFieldValue("netKgs", 0);
    }
  }, [formik.values.grossKgs, formik.values.tareKgs]);

  useEffect(() => {
    const totalPackage = formik.values.totalPackages;
    const netKags = parseInt(formik.values.netKgs);
    const sampleQty = formik.values.sampleQty;
    const result = totalPackage * netKags;

    formik.setFieldValue("totalNetKgs", result - sampleQty);
    console.log("totalNetKgs", result, sampleQty);
  }, [formik.values.grossKgs, formik.values.tareKgs, , formik.values.netKgs]);

  useEffect(() => {
    const totalPackage = formik.values.totalPackages;
    const netKags = parseInt(formik.values.netKgs);
    const sampleQty = formik.values.sampleQty;

    const result = totalPackage * netKags;
    formik.setFieldValue("invoiceQty", result - sampleQty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.sampleQty,
    formik.values.netKgs,
    formik.values.tareKgs,
    formik.values.packageNo,
  ]);
  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    console.log(saleNo, season, "sas");
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${saleNo}&season=${season}`;

    // Data to be sent in the POST request

    if (saleNo !== undefined && saleNo !== "") {
      // Making the POST request using Axios

      axiosMain
        .post(apiUrl, { saleNo: parseInt(saleNo), season: season.toString() })
        .then((response) => {
          // Handle the API response here
          const isCatalogClosingDateGreater =
            new Date(response?.data?.responseData[0]?.catalogClosingDate) >
            new Date();

          console.log(
            isCatalogClosingDateGreater,
            response?.data?.responseData[0]?.catalogClosingDate,
            "11111"
          );

          if (isCatalogClosingDateGreater) {
            setCatalogClosingDate(
              response?.data?.responseData[0]?.catalogClosingDate
            );
          } else {
            // toast.error("Max Limit Catalog Closing Date");
            // setCatalogClosingDate(
            //   response?.data?.responseData[0]?.catalogClosingDate
            // );\
            toast.error(" Catalog Closing Date is expier");

            console.log(
              response?.data?.responseData[0]?.catalogClosingDate,
              "11111"
            );
          }
        })
        .catch((error) => {
          // Handle errors here
        });
    }

    // Cleanup function, in case you need to cancel the request
    return () => {
      // Cancel the request (if necessary) to avoid memory leaks
    };
  }, [formik.values.saleNo, formik.values.season]);

  function BindSaleprogramId(saleNos, seasons) {
    const saleNo = saleNos;
    const season = seasons;
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${saleNo}&season=${season}`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    axiosMain
      .post(apiUrl, { saleNo: parseInt(saleNo), season: season.toString() })
      .then((response) => {
        // Handle the API response here
        // setsaleprogrmId();
        // console.log(
        //   invoiceData.filter(
        //     (ele) =>
        //     (ele.SaleProgramId =
        //       response?.data?.responseData[0]?.SaleProgramId)
        // ),
        //   "response?.data?.responseData[0]?.SaleProgramId"
        // );

        let data = validationData.filter(
          (ele) =>
            (ele.SaleProgramId = response?.data?.responseData[0]?.SaleProgramId)
        );

        setsaleprogrmId(data);
      })
      .catch((error) => {
        // Handle errors here
        console.log(error);
      });
  }

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
        .post(apiUrl, { saleNo: parseInt(saleNo), season: season.toString() })
        .then((response) => {
          // Handle the API response here
          formik.setFieldValue(
            "teaType",
            response?.data?.responseData[0]?.teaTypeId
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
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL

    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${saleNo}&season=${season}`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    axiosMain
      .post(apiUrl, { saleNo: parseInt(saleNo), season: season.toString() })
      .then((response) => {
        // Handle the API response here
        // setsaleprogrmId();
        // console.log(
        //   invoiceData.filter(
        //     (ele) =>
        //     (ele.SaleProgramId =
        //       response?.data?.responseData[0]?.SaleProgramId)
        // ),
        //   "response?.data?.responseData[0]?.SaleProgramId"
        // );

        setsaleprogrmId(response?.data?.responseData[0]?.SaleProgramId);
      })
      .catch((error) => {
        // Handle errors here
        console.log(error);
      });
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    if (saleprogrmId?.length > 0) {
      setInvoiceData(saleprogrmId);
    } else {
      console.log(saleprogrmId);
    }
  }, [saleprogrmId]);

  const propertyName = [
    "mark",
    "warehouseCode",
    "inv.No",
    "grade",
    "periodOfManufactureFrom",
    "periodOfManufactureTo",
    "dateOfDispatch",
    "invoiceDate",
    "season",
    "saleNo",
    "auctioneerCode",
    "lorryReceiptNo",
    "lorryNo",
    "carrier",
    "teaType",
    "subType",
    "category",
    "packageSize",
    "packageType",
    "packageNos",
    "grossKgs",
    "tareKgs",
    "netKgs",
    "gpNo",
    "gpDate",
    "short/excessWeight",
    "locationInsideWarehouse",
  ];

  function fixKeyNames(obj) {
    const newObj = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let fixedKey = key.replace("/", "_"); // Replace '/' with '_'
        fixedKey = fixedKey.replace(".No", "No");
        newObj[fixedKey] = obj[key];
      }
    }

    return newObj;
  }

  // function excelDateToJSDate(excelDate) {
  //   const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds per day
  //   const excelStartDate = new Date(1900, 0, 1); // Excel date system starts from January 1, 1900
  //   const excelDays = excelDate - 1; // Excel date is 1-based

  //   const jsTimestamp = excelStartDate.getTime() + excelDays * MS_PER_DAY;
  //   const jsDate = new Date(jsTimestamp);

  //   const day = jsDate.getDate().toString().padStart(2, "0");
  //   const month = (jsDate.getMonth() + 1).toString().padStart(2, "0");
  //   const year = jsDate.getFullYear();

  //   return `${year}-${month}-${day}`;
  // }

  function excelDateToJSDate(excelDate) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds per day
    const excelStartDate = new Date(1899, 11, 30); // Excel's incorrect leap year handling
    const excelDays = excelDate; // Excel date is 1-based

    const jsTimestamp = excelStartDate.getTime() + excelDays * MS_PER_DAY;
    const jsDate = new Date(jsTimestamp);

    const day = jsDate.getDate().toString().padStart(2, "0");
    const month = (jsDate.getMonth() + 1).toString().padStart(2, "0");
    const year = jsDate.getFullYear();

    return `${year}-${month}-${day}`;
  }

  function netKagesCalculation(gross, tare) {
    if (gross > tare) {
      return gross - tare;
    } else {
      toast.error("Tare KGs cannot be greater than or equal to Gross KGs");
    }
  }

  function totalNetKagesCalculation(totalPackage, netKags, sampleQty) {
    const result = totalPackage * netKags;

    return result - sampleQty;
  }

  // function getSaleProgramId(saleNos) {
  //   const saleNo = saleNos;
  //   const season = new Date().getFullYear().toString();
  //   // API endpoint URL
  //   const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${saleNo}&season=${season}`;

  //   // Data to be sent in the POST request

  //   // Making the POST request using Axios

  // }

  useEffect(() => {
    // if (invoiceData.length > 0) {
    //   invoiceData.map((item) => {
    //     const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${item.saleNo}&season=${item.season}`;

    //     // Data to be sent in the POST request

    //     // Making the POST request using Axios
    //     axios
    //       .post(apiUrl, {
    //         saleNo: parseInt(item.saleNo),
    //         season: item.season.toString(),
    //       })
    //       .then((response) => {
    //         // Handle the API response here
    //         // setsaleprogrmId();
    //         // console.log(
    //         //   invoiceData.filter(
    //         //     (ele) =>
    //         //     (ele.SaleProgramId =
    //         //       response?.data?.responseData[0]?.SaleProgramId)
    //         // ),
    //         //   "response?.data?.responseData[0]?.SaleProgramId"
    //         // );

    //         // let data = invoiceData.filter(
    //         //   (ele) =>
    //         //     (ele.SaleProgramId =
    //         //
    //         // );

    //         item.SaleProgramId = response?.data?.responseData[0]?.SaleProgramId;

    //         // console.log(
    //         //   response?.data?.responseData[0]?.SaleProgramId,
    //         //   "response?.data?.responseData[0]?.SaleProgramId)"
    //         // );
    //       })
    //       .catch((error) => {
    //         // Handle errors here
    //         console.log(error);
    //       });
    //   });
    // }
    setTableData(invoiceData);
  }, [invoiceData]);

  // useEffect(() => {
  //   if (fileData !== []) {
  //     validation(fileData);
  //   }
  // }, [fileData]);

  const handleData = async (uploadedData) => {
    try {
      const updatedFileData = [];
      // if (fileData.length > 0) {
      uploadedData.map(({ fileName, data }, index) => {
        if (data && data.length > 0) {
          const filteredData = data.filter((obj) => {
            // Check if any key in the object has a defined value
            return Object.values(obj).some((value) => value !== undefined);
          });

          const dataList = filteredData.map((ele) => {
            const {
              arrivalDate,
              auctioneerCode,
              awrDate,
              carrier,
              category,
              dateOfDispatch,
              gpDate,
              gpNo,
              grade,
              grossKgs,
              invNo,
              invoiceDate,
              locationInsideWarehouse,
              lorryNo,
              lorryReceiptNo,
              mark,
              netKgs,
              packageNos,
              packageSize,
              packageType,
              periodOfManufactureFrom,
              periodOfManufactureTo,
              saleNo,
              season,
              subType,
              tareKgs,
              teaType,
              totalNetKgs,
              totalPackages,
              warehouseAddress,
              short_excessWeight,
              warehouseCode,
              warehouseName,
            } = fixKeyNames(ele);

            let data = {
              markId: 0,
              season: season?.toString(),
              teaTypeId: 0,
              saleNo: parseInt(saleNo),
              SaleProgramId: "",
              wareHouseUserRegId: 0,
              auctioneerId: 10056,
              categoryId: 0,
              manufactureFromDate: excelDateToJSDate(periodOfManufactureFrom),
              manufactureToDate: excelDateToJSDate(periodOfManufactureTo),
              dateOfDispatch: excelDateToJSDate(dateOfDispatch),
              invoiceDate: excelDateToJSDate(invoiceDate),
              carrier: carrier.toString(),
              lorryReceiptNo: lorryReceiptNo.toString(),
              lorryNo: lorryNo.toString(),
              invoiceNo: invNo.toString(),
              arrivalDate: null,
              awrDate: null,
              awrReferenceNo: null,
              subTeaTypeId: 0,
              gradeId: 0,
              // parseInt(grade) === 0
              //   ? gradesList?.at(0)?.gradeId
              //   : parseInt(grade),
              packageType: packageType.toString(),
              packageSize: packageSize.toString(),
              packageNo: packageNos.toString(),
              totalPackages: totalPackagesCalculation(packageNos.toString()),
              grossKgs: parseInt(grossKgs),
              tareKgs: parseInt(tareKgs),
              netKgs: netKagesCalculation(
                parseInt(grossKgs),
                parseInt(tareKgs)
              ),
              totalNetKgs: totalNetKagesCalculation(
                totalPackagesCalculation(packageNos.toString()),
                netKagesCalculation(parseInt(grossKgs), parseInt(tareKgs)),
                0
              ),
              invoiceQty: totalNetKagesCalculation(
                totalPackagesCalculation(packageNos.toString()),
                netKagesCalculation(parseInt(grossKgs), parseInt(tareKgs)),
                0
              ),
              gpNo: null,
              gpDate: null,
              shortExcessWeight: short_excessWeight,
              locationInsideWarehouse: locationInsideWarehouse.toString(),
              isActive: true,
              createdBy: 10056,
              SampleQty: 0,
              DataFlag: "Excel",
              TeaType: teaType,
              Category: category,
              Grade: grade,
              Mark: mark,
              SubTeaType: subType,
              Warehouse: warehouseCode,
              Auctioneer: auctioneerCode,
            };

            return data;
          });

          updatedFileData.push(dataList);
          // updatedFileData.push(filteredData);
        } else {
          // Handle the case where the data array is empty
          toast.error(`No data found in file '${fileName}'`);
        }
      });
      // } else {
      //   toast.error(`No file found in fields`);
      // }
      const mergedArray = updatedFileData.reduce((result, currentArray) => {
        return result.concat(currentArray);
      }, []);
      console.log(updatedFileData?.at(0), "updatedFileData");

      allData(mergedArray);
      console.log(mergedArray, "mergedArraymergedArray");
    } catch (error) {
      toast.error(error);
    }
    // validation(uploadedData);
  };

  const allData = (dataList) => {
    if (dataList.length > 0) {
      const data = dataList.map((item) => {
        const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${item.saleNo}&season=${item.season}`;

        // Data to be sent in the POST request

        // Making the POST request using Axios
        axiosMain
          .post(apiUrl, {
            saleNo: parseInt(item.saleNo),
            season: item.season.toString(),
          })
          .then((response) => {
            // Handle the API response here
            // setsaleprogrmId();
            // console.log(
            //   dataList.filter(
            //     (ele) =>
            //     (ele.SaleProgramId =
            //       response?.data?.responseData[0]?.SaleProgramId)
            // ),
            //   "response?.data?.responseData[0]?.SaleProgramId"
            // );

            // let data = dataList.filter(
            //   (ele) =>
            //     (ele.SaleProgramId =
            //
            // );

            item.SaleProgramId = response?.data?.responseData[0]?.SaleProgramId;

            // console.log(
            //   response?.data?.responseData[0]?.SaleProgramId,
            //   "response?.data?.responseData[0]?.SaleProgramId)"
            // );
            document.getElementById("file-upload").value = "";
          })
          .catch((error) => {
            // Handle errors here
            console.log(error);
          });
      });
      if (invoiceData?.length > 0) {
        setInvoiceData([...invoiceData, ...dataList]);
      } else {
        setInvoiceData([...dataList]);
      }

      console.log(data, dataList, "dataF");
    }
  };

  // const validation = async (uploadedData) => {
  //   try {
  //     const updatedFileData = [];
  //     // if (fileData.length > 0) {
  //     uploadedData.map(({ fileName, data }, index) => {
  //       if (data && data.length > 0) {
  //         const filteredData = data.filter((obj) => {
  //           // Check if any key in the object has a defined value
  //           return Object.values(obj).some((value) => value !== undefined);
  //         });
  //       } else {
  //         // Handle the case where the data array is empty
  //         toast.error(`No data found in file '${fileName}'`);
  //       }
  //     });
  //     // } else {
  //     //   toast.error(`No file found in fields`);
  //     // }
  //     const mergedArray = updatedFileData.reduce((result, currentArray) => {
  //       return result.concat(currentArray);
  //     }, []);
  //     console.log(updatedFileData?.at(0), "updatedFileData");

  //     allData(mergedArray);
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };
  function validateMandatoryFields(arrayOfObjects, mandatoryFields) {
    const missingFields = [];

    arrayOfObjects.forEach((obj, index) => {
      const missingInObject = mandatoryFields.filter(
        (field) => !obj.hasOwnProperty(field)
      );
      if (missingInObject.length > 0) {
        missingFields.push({ index, missingFields: missingInObject });
      }
    });

    if (missingFields.length > 0) {
      // Handle missing fields, such as showing a toast message
      missingFields.forEach((entry) => {
        const missingFieldList = entry.missingFields.join(", ");
        const toastMessage = `Please select/enter  '${missingFieldList}' in row no.  ${
          entry.index + 1
        }`;

        toast.error(toastMessage);
      });

      return false;
    }

    return true;
  }

  // const handleFileUpload = (e) => {
  //   const files = e.target.files;

  //   if (files.size > MAX_FILE_SIZE) {
  //     const maxSizeInMB = MAX_FILE_SIZE / (1024 * 1024);
  //     const errorMessage = `The file size should not exceed ${maxSizeInMB} MB`;

  //     toast.error(errorMessage);
  //   } else {
  //     const promises = Array.from(files).map((file) =>
  //       readFileAndCheckHeaders(file)
  //     );

  //     Promise.allSettled(promises).then((results) => {
  //       const fulfilledResults = results.filter(
  //         (result) => result.status === "fulfilled"
  //       );
  //       const dataFromFiles = fulfilledResults.map((result) => result.value);

  //       handleData(dataFromFiles);
  //     });
  //   }
  // };

  const handleFileUpload = (e) => {
    const files = e.target.files;

    for (const file of files) {
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      setPropertyNameList(propertyNames);
      if (!ALLOWED_EXTENSIONS.includes("." + fileExtension.toLowerCase())) {
        toast.error(
          `File '${fileName}' is not allowed. Only Excel files are accepted.`
        );
      } else if (fileSize > MAX_FILE_SIZE) {
        toast.error(
          `File '${fileName}' exceeds the maximum allowed size of 10 MB.`
        );
      } else {
        const promises = Array.from(files).map((file) =>
          readFileAndCheckHeaders(file)
        );

        Promise.allSettled(promises).then((results) => {
          const fulfilledResults = results.filter(
            (result) => result.status === "fulfilled"
          );
          const dataFromFiles = fulfilledResults.map((result) => result.value);

          handleData(dataFromFiles);
        });
      }
    }
  };
  const handleAddData = () => {
    const fileInput = document.getElementById("fileInput");

    if (fileData?.length > 0 && validationData?.length > 0) {
      // handleData(/* Your uploaded data here */);
      fileInput.value = "";
      setInvoiceData(validationData);
      BindSaleprogramId(
        validationData[0].saleNo,
        validationData[0].season,
        validationData
      );

      // console.log(validationData, "validationData");
      setValidationData([]);
      setFileData([]);
      toast.success("Data added successfully!");
    } else {
      toast.error("Data validation failed! Cannot add data.");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  }

  console.log(
    catalogClosingDate,
    // new Date(catalogClosingDate?.toString()).toLocaleDateString("en-GB"),
    "new Date(catalogClosingDate).toLocaleDateString(en-GB)"
  );
  function findDuplicateInvoiceNumbers(arrayOfObjects) {
    const invoiceNumbers = new Map();
    const duplicateInvoices = [];

    arrayOfObjects.forEach((obj) => {
      if (invoiceNumbers.has(obj.invoiceNo)) {
        duplicateInvoices.push(obj.invoiceNo);
      }
      invoiceNumbers.set(obj.invoiceNo, true);
    });

    return duplicateInvoices;
  }
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="Invoice-Maintenance cust-filed row">
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                <div>
                  Mark
                  <span
                    className={`${
                      formik.errors.mark && formik.touched.mark
                        ? "error text-danger"
                        : ""
                    }`}
                  >
                    *
                  </span>
                </div>
              </label>
              <div className="max-width250">
                <InputGroup>
                  <FormControl
                    as="select"
                    disabled={isDisabled}
                    name="mark"
                    value={formik.values.mark}
                    onChange={handleChange}
                  >
                    {markDataList?.length > 0
                      ? markDataList?.map((item, index) => (
                          <option value={item.markId} key={index}>
                            {item.markCode}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.mark && formik.touched.mark && (
                  <div className="error text-danger">{formik.errors.mark}</div>
                )}
              </div>
            </div>
          </div>
          {srNo !== null ? (
            <>
              <div className="FormGrup">
                <label>SR No</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="0"
                        name="srNo"
                        value={srNo + 1}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>

              <div className="FormGrup">
                <label>Invoice Status</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="-"
                        name="invoiceStatus"
                        value={invoiceStatusLable}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>

              <div className="FormGrup">
                <label>Origin</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="-"
                        name="origin"
                        value="-"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Season *</label>
              <div>
                <InputGroup>
                  <FormControl
                    as="select"
                    name="season"
                    value={formik.values.season}
                    onChange={handleChange}
                    disabled={
                      viewData.data.responseData?.length > 0 ? true : isDisabled
                    }
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
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Sale no
                <span
                  className={`${
                    formik.errors.saleNo && formik.touched.saleNo
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div className="max-width250">
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData.data.responseData?.length > 0 ? true : isDisabled
                    }
                    as="select"
                    name="saleNo"
                    value={formik.values.saleNo}
                    onChange={handleChange}
                  >
                    {saleNo?.length > 0
                      ? saleNo?.map((item, index) => (
                          <option value={item.SaleProgramId} key={index}>
                            {item.saleNo}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.saleNo && formik.touched.saleNo && (
                  <div className="error text-danger">
                    {formik.errors.saleNo}
                  </div>
                )}
              </div>
            </div>
          </div>
          {srNo !== null ? (
            <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
              <div className="FormGrup">
                <label>Received Date</label>
                <div className="max-width250">
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          disabled
                          type="date"
                          value={receivedDateLable?.split("T")?.at(0)}
                          placeholder="-"
                          name="origin"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                </div>
                {formik.errors.saleNo && formik.touched.saleNo && (
                  <div className="error text-danger">
                    {formik.errors.saleNo}
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Warehouse{" "}
                <span
                  className={`${
                    formik.errors.warehouse && formik.touched.warehouse
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={isDisabled}
                    as="select"
                    name="warehouse"
                    value={formik.values.warehouse}
                    onChange={handleChange}
                  >
                    {warehouseUserList?.length > 0
                      ? warehouseUserList?.map((item, index) => (
                          <option value={item.wareHouseUserRegId} key={index}>
                            {item.wareHouseCode}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.warehouse && formik.touched.warehouse && (
                  <div className="error text-danger">
                    {formik.errors.warehouse}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Warehouse Name</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled
                      type="text"
                      placeholder="Warehouse Name"
                      name="warehouseName"
                      value={formik.values.warehouseName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {/* {formik.errors.warehouseName &&
                    formik.touched.warehouseName && (
                      <div className="error text-danger">
                        {formik.errors.warehouseName}
                      </div>
                    )} */}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Warehouse Address</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                      as="textarea"
                      disabled
                      rows={2}
                      placeholder="Warehouse Address"
                      name="warehouseAddress"
                      value={formik.values.warehouseAddress}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {/* {formik.errors.warehouseAddress &&
                    formik.touched.warehouseAddress && (
                      <div className="error text-danger">
                        {formik.errors.warehouseAddress}
                      </div>
                    )} */}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Manufacture
                <span
                  className={`${
                    formik.errors.manufacture && formik.touched.manufacture
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      disabled
                      name="manufacture"
                      value={formik.values.manufacture}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.manufacture && formik.touched.manufacture && (
                    <div className="error text-danger">
                      {formik.errors.manufacture}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Auctioneer</label>
              <div>
                <Form>
                  <InputGroup>
                    <FormControl
                      disabled={isDisabled}
                      as="select"
                      name="grade"
                      value={formik.values.grade}
                      onChange={handleChange}
                    >
                      {auctioneer?.map((item, index) => (
                        <option value={item.userId} key={item.userId}>
                          {item.userName}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.auctioneer && formik.touched.auctioneer && (
                    <div className="error text-danger">
                      {formik.errors.auctioneer}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Grade</label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData.data.responseData?.length > 0 ? true : isDisabled
                    }
                    as="select"
                    name="grade"
                    value={formik.values.grade}
                    onChange={handleChange}
                  >
                    {gradesList?.length > 0
                      ? gradesList?.map((item, index) => (
                          <option value={item.gradeId} key={index}>
                            {item.gradeCode}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.grade && formik.touched.grade && (
                  <div className="error text-danger">{formik.errors.grade}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Period of Manufacture From</label>
              <div className="DateGroup">
                <input
                  type="date"
                  id="fromDate"
                  value={
                    formik.values.manufactureFromDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  name="manufactureFromDate"
                  onChange={handleChange}
                  disabled={isDisabled}
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                />
                {formik.errors.manufactureFromDate &&
                  formik.touched.manufactureFromDate && (
                    <div className="error text-danger">
                      {formik.errors.manufactureFromDate}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Period of Manufacture To</label>
              <div className="max-width250 d-flex">
                <input
                  type="date"
                  id="manufactureToDate"
                  disabled={isDisabled}
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                  value={
                    formik.values.manufactureToDate?.split("T")[0] ||
                    currentDate.toISOString().split("T")[0]
                  }
                  name="manufactureToDate"
                  onChange={handleChange}
                  min={formik.values.manufactureFromDate?.split("T")[0]}
                  max={formik.values.invoiceDate?.split("T")[0]}
                />
                {formik.errors.manufactureToDate &&
                  formik.touched.manufactureToDate && (
                    <div className="error text-danger">
                      {formik.errors.manufactureToDate}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Date of dispatch{" "}
                <span
                  className={`${
                    formik.errors.dateOfDispatch &&
                    formik.touched.dateOfDispatch
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <input
                  type="date"
                  disabled={isDisabled}
                  name="dateOfDispatch"
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                  value={
                    formik.values.dateOfDispatch?.split("T")[0] || new Date()
                  }
                  onChange={handleChange}
                  min={formik.values.invoiceDate}
                  max={catalogClosingDate}
                />
                {formik.errors.dateOfDispatch &&
                  formik.touched.dateOfDispatch && (
                    <div className="error text-danger">
                      {formik.errors.dateOfDispatch}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Invoice No{" "}
                <span
                  className={`${
                    formik.errors.invoiceNo && formik.touched.invoiceNo
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      disabled={
                        viewData.data.responseData?.length > 0
                          ? true
                          : isDisabled
                      }
                      name="invoiceNo"
                      placeholder="PQR90"
                      value={formik.values.invoiceNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.invoiceNo && formik.touched.invoiceNo && (
                    <div className="error text-danger">
                      {formik.errors.invoiceNo}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Invoice Qty.{" (Invoice Weight)"}</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      disabled
                      name="invoiceQty"
                      placeholder="Invoice Qty. (Invoice Weight)"
                      value={
                        viewData.data.responseData?.length > 0
                          ? viewData.data.responseData?.at(0)?.invoiceQty
                          : formik.values.invoiceQty || 0
                      }
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.invoiceQty && formik.touched.invoiceQty && (
                    <div className="error text-danger">
                      {formik.errors.invoiceQty}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Invoice Date</label>
              <div className="max-width250">
                <input
                  type="date"
                  name="invoiceDate"
                  disabled={isDisabled}
                  value={formik.values.invoiceDate?.split("T")[0]}
                  onChange={handleChange}
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                  max={catalogClosingDate?.split("T")[0]}
                  // max={"2023-09-13"}
                />
                {formik.errors.invoiceDate && formik.touched.invoiceDate && (
                  <div className="error text-danger">
                    {formik.errors.invoiceDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Lorry Receipt No</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={isDisabled}
                      type="text"
                      name="lorryReceiptNo"
                      placeholder="Lorry Receipt No"
                      value={formik.values.lorryReceiptNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.lorryReceiptNo &&
                    formik.touched.lorryReceiptNo && (
                      <div className="error text-danger">
                        {formik.errors.lorryReceiptNo}
                      </div>
                    )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Lorry No</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={isDisabled}
                      type="text"
                      name="lorryNo"
                      placeholder="Lorry No"
                      value={formik.values.lorryNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.lorryNo && formik.touched.lorryNo && (
                    <div className="error text-danger">
                      {formik.errors.lorryNo}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Inv. Ref. No.</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={
                        viewData.data.responseData?.length > 0
                          ? true
                          : isDisabled
                      }
                      type="text"
                      placeholder="123ABC"
                      name="invoiceRefNo"
                      value={formik.values.invoiceRefNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.invoiceRefNo &&
                    formik.touched.invoiceRefNo && (
                      <div className="error text-danger">
                        {formik.errors.invoiceRefNo}
                      </div>
                    )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Carrier</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={isDisabled}
                      type="text"
                      name="carrier"
                      value={formik.values.carrier}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.carrier && formik.touched.carrier && (
                    <div className="error text-danger">
                      {formik.errors.carrier}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Tea Type{" "}
                <span
                  className={`${
                    formik.errors.teaType && formik.touched.teaType
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={isDisabled}
                    as="select"
                    name="teaType"
                    value={formik.values.teaType}
                    onChange={handleChange}
                  >
                    <option value={0}>Select tea type</option>
                    {teaTypeList?.length > 0
                      ? teaTypeList?.map((item, index) => (
                          <option value={item.teaTypeId}>
                            {item.teaTypeName}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.teaType && formik.touched.teaType && (
                  <div className="error text-danger">
                    {formik.errors.teaType}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Sub Type{" "}
                <span
                  className={`${
                    formik.errors.subType && formik.touched.subType
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData.data.responseData?.length > 0 ? true : isDisabled
                    }
                    as="select"
                    name="subType"
                    value={formik.values.subType}
                    onChange={handleChange}
                  >
                    <option value={0}>Select sub tea type</option>

                    {subTeaTypeNo?.length > 0
                      ? subTeaTypeNo?.map((item, index) => (
                          <option value={item.subTeaTypeId} key={index}>
                            {item.subTeaTypeName}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.subType && formik.touched.subType && (
                  <div className="error text-danger">
                    {formik.errors.subType}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Category{" "}
                <span
                  className={`${
                    formik.errors.category && formik.touched.category
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData.data.responseData?.length > 0 ? true : isDisabled
                    }
                    as="select"
                    name="category"
                    value={formik.values.category}
                    onChange={handleChange}
                  >
                    <option></option>
                    {catagory?.length > 0
                      ? catagory?.map((item, index) => (
                          <option value={item.categoryId} key={index}>
                            {item.categoryCode}
                          </option>
                        ))
                      : "No Data"}
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
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Package Size</label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData.data.responseData?.length > 0 ? true : isDisabled
                    }
                    as="select"
                    name="packageSize"
                    value={formik.values.packageSize}
                    onChange={handleChange}
                  >
                    <option value="">Select Package Size</option>
                    <option value={14}>27x21x11</option>
                  </FormControl>
                </InputGroup>
                {formik.errors.packageSize && formik.touched.packageSize && (
                  <div className="error text-danger">
                    {formik.errors.packageSize}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Package Type{" "}
                <span
                  className={`${
                    formik.errors.packageType && formik.touched.packageType
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData.data.responseData?.length > 0 ? true : isDisabled
                    }
                    as="select"
                    name="packageType"
                    value={formik.values.packageType}
                    onChange={handleChange}
                  >
                    <option value="">Select Package Type</option>
                    <option value={15}>Paper sacks</option>
                  </FormControl>
                </InputGroup>
                {formik.errors.packageType && formik.touched.packageType && (
                  <div className="error text-danger">
                    {formik.errors.packageType}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Package No.{" "}
                <span
                  className={`${
                    formik.errors.packageNo && formik.touched.packageNo
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={
                        viewData.data.responseData?.length > 0
                          ? true
                          : isDisabled
                      }
                      type="text"
                      name="packageNo"
                      value={formik.values.packageNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.packageNo && formik.touched.packageNo && (
                    <div className="error text-danger">
                      {formik.errors.packageNo}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Total Packages</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled
                      type="text"
                      name="totalPackages"
                      value={formik.values.totalPackages || 0}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.totalPackages &&
                    formik.touched.totalPackages && (
                      <div className="error text-danger">
                        {formik.errors.totalPackages}
                      </div>
                    )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Gross Kgs{" "}
                <span
                  className={`${
                    formik.errors.grossKgs && formik.touched.grossKgs
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={
                        viewData.data.responseData?.length > 0
                          ? true
                          : isDisabled
                      }
                      type="text"
                      name="grossKgs"
                      placeholder="Gross Kgs"
                      value={formik.values.grossKgs}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.grossKgs && formik.touched.grossKgs && (
                    <div className="error text-danger">
                      {formik.errors.grossKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Tare KGs{" "}
                <span
                  className={`${
                    formik.errors.tareKgs && formik.touched.tareKgs
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={
                        viewData.data.responseData?.length > 0
                          ? true
                          : isDisabled
                      }
                      type="text"
                      name="tareKgs"
                      placeholder="1000"
                      value={formik.values.tareKgs}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.tareKgs && formik.touched.tareKgs && (
                    <div className="error text-danger">
                      {formik.errors.tareKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Net KGs</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled
                      type="text"
                      name="netKgs"
                      placeholder="Net KGs"
                      value={formik.values.netKgs}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.netKgs && formik.touched.netKgs && (
                    <div className="error text-danger">
                      {formik.errors.netKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Total Net KGs</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      name="totalNetKgs"
                      placeholder="Total Net KGs"
                      value={formik.values.totalNetKgs || 0}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>
                  {formik.errors.totalNetKgs && formik.touched.totalNetKgs && (
                    <div className="error text-danger">
                      {formik.errors.totalNetKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          {isDisabled === true ? (
            ""
          ) : (
            <>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>GP No.</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="text"
                          disabled={
                            viewData.data.responseData?.length > 0
                              ? true
                              : isDisabled
                          }
                          name="gpNo"
                          placeholder="104532342210"
                          value={formik.values.gpNo}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {formik.errors.gpNo && formik.touched.gpNo && (
                        <div className="error text-danger">
                          {formik.errors.gpNo}
                        </div>
                      )}
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>GP Date</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="date"
                          disabled={
                            viewData.data.responseData?.length > 0
                              ? true
                              : isDisabled
                          }
                          name="gpDate"
                          value={formik.values.gpDate}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {formik.errors.gpDate && formik.touched.gpDate && (
                        <div className="error text-danger">
                          {formik.errors.gpDate}
                        </div>
                      )}
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>Short/Excess Weight</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="text"
                          disabled={
                            viewData.data.responseData?.length > 0
                              ? true
                              : isDisabled
                          }
                          name="shortExcessWeight"
                          value={formik.values.shortExcessWeight}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {formik.errors.shortExcessWeight &&
                        formik.touched.shortExcessWeight && (
                          <div className="error text-danger">
                            {formik.errors.shortExcessWeight}
                          </div>
                        )}
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>Location inside Warehouse</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="textareya"
                          disabled={
                            viewData.data.responseData?.length > 0
                              ? true
                              : isDisabled
                          }
                          name="locationInsideWarehouse"
                          value={formik.values.locationInsideWarehouse}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {formik.errors.locationInsideWarehouse &&
                        formik.touched.locationInsideWarehouse && (
                          <div className="error text-danger">
                            {formik.errors.locationInsideWarehouse}
                          </div>
                        )}
                    </Form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="row">
          <div className="col-12">
            <div className="BtnGroup">
              {isDisabled === true ? (
                ""
              ) : viewData.data.responseData?.length > 0 && srNo === null ? (
                <Button className="SubmitBtn" type="submit">
                  Updatefff
                </Button>
              ) : isDisabled === true ? (
                ""
              ) : (
                <>
                  <Button
                    className="SubmitBtn"
                    type="button"
                    onClick={() => {
                      if (invoiceData.length > 0) {
                        // dispatch(addInvoiceDetailsRequest(invoiceData));

                        axiosMain
                          .post(
                            "/preauction/InvoiceDetails/AddInvoiceDetails",
                            invoiceData
                          )
                          .then((res) => {
                            if (res.data.statusCode === 204) {
                              toast.error(res.data.message);
                            } else if (res.data.statusCode === 200) {
                              toast.success(res.data.message);
                              handleAccordionChange("panel1");
                              setInvoiceData([]);
                            } else if (res.data.statusCode === 403) {
                              toast.warning(res.data.message);
                            } else {
                              // toast.error(invoiceResponseData.message);
                            }
                          });

                        console.log(invoiceResponseData, "invoiceResponseData");
                      } else {
                        toast.error("Please First add invoice");
                      }
                    }}
                  >
                    Create
                  </Button>
                  <Button className="SubmitBtn" type="submit">
                    Add
                  </Button>
                </>
              )}
              {/* <Button className="SubmitBtn">
                <ImportExportIcon />
              </Button> 
              {/* <UploadeFile
                handleData={handleData}
                readFileAndCheckHeaders={readFileAndCheckHeaders}
              /> */}

              {/* <Button>
                <PictureAsPdfIcon />
              </Button> */}
            </div>
          </div>
        </div>
      </form>
      {viewData.data.responseData?.length > 0 && isDisabled === true ? (
        ""
      ) : (
        <div className="row mt-3 ">
          <div className="col-md-12 ">
            <div className="browse-file FileUpload">
              {/* <FileUpload
              id="fileInput"
              handleData={handleData}
              readFileAndCheckHeaders={readFileAndCheckHeaders}
            /> */}
              <button className="SubmitBtn" onClick={handleButtonClick}>
                Browse
              </button>
              <input
                type="file"
                id="file-upload"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".xls,.xlsx"
              />
              <Button
                className="SubmitBtn creat-btn"
                type="button"
                onClick={() => {
                  if (invoiceData.length > 0) {
                    const toastMessages = invoiceData.map((obj, index) => {
                      let rowNo = index + 1;
                      const fromDateParts = obj.manufactureFromDate.split("-");
                      const toDateParts = obj.manufactureToDate.split("-");

                      const fromDate =
                        fromDateParts[2] +
                        "-" +
                        fromDateParts[1] +
                        "-" +
                        fromDateParts[0];
                      const toDate =
                        toDateParts[2] +
                        "-" +
                        toDateParts[1] +
                        "-" +
                        toDateParts[0];

                      // console.log(
                      //   obj.manufactureFromDate.split("-"),
                      //   fromDateParts[2]+"-"+fromDateParts[1]+"-"+fromDateParts[0],
                      //   new Date(toDate) >= new Date(fromDate),
                      //   // fromDate,
                      //   // obj.manufactureToDate,
                      //   // toDate,
                      //   "obj.manufactureFromDate,obj.manufactureToDate"
                      // );

                      const duplicates =
                        findDuplicateInvoiceNumbers(invoiceData);

                      // const isValid = validateMandatoryFields(
                      //   invoiceData,
                      //   propertyName
                      // );

                      if (toDate < fromDate) {
                        toast.error(
                          "Greater than or equal to From Date. Row No  " +
                            toDate +
                            "<" +
                            fromDate +
                            rowNo
                        );
                        return false;
                      } else if (duplicates.length > 0) {
                        toast.error(
                          "Invoise No" +
                            " " +
                            duplicates.join(", ") +
                            " " +
                            "is already exist"
                        );
                        return false;
                      } else {
                        // console.log(
                        //   toastMessages,
                        //   "invoiceDatainvoiceDatainvoiceData"
                        // );\
                        // axiosMain
                        //   .post(
                        //     " /preauction/InvoiceDetails/AddInvoiceDetails",
                        //     invoiceData
                        //   )
                        //   .then((response) => {
                        //     if (response.data.statusCode === 204) {
                        //       toast.success("Invoice submitted successfully");
                        //     }
                        //     // Handle the response data or success
                        //   })
                        //   .catch((error) => {
                        //     toast.error("API call failed:", error);
                        //     // Handle errors here
                        //   });
                        return true;
                      }
                    });

                    const allTrue = toastMessages.every(
                      (element) => element === true
                    );
                    console.log(allTrue, "allTrueallTrueallTrueallTrue");

                    if (allTrue) {
                      axiosMain
                        .post(
                          "/preauction/InvoiceDetails/AddInvoiceDetails",
                          invoiceData
                        )
                        .then((response) => {
                          if (response.data.statusCode === 200) {
                            toast.success(response.data.message);
                            handleAccordionChange("panel1");
                            setInvoiceData([]);
                          }
                          if (response.data.statusCode === 403) {
                            toast.warning(response.data.message);
                          }
                          // Handle the response data or success
                        })
                        .catch((error) => {
                          toast.error("API call failed:", error);
                          // Handle errors here
                        });

                      // console.log(invoiceData, "datadatadata");
                    } else {
                      console.log("Not all elements are true.");
                    }

                    console.log(toastMessages, "toastMessages");
                  } else {
                    toast.error("Please Upload invoice ");
                  }
                }}
              >
                Create
              </Button>
            </div>
          </div>
          {/* <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                
              </div>
              {/* <div className="col-md-6">
                <Button
                  className="SubmitBtn"
                  onClick={() => validation(fileData)}
                >
                  Validate
                </Button>
                <div
                  id="loader"
                  className="spinner-border text-light"
                  style={{ display: "none" }}
                ></div>
              </div> 
            </div>
          </div> */}
        </div>
      )}

      <ToastContainer />
      {/* {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>File Name</th>
                <th>File Type</th>
                <th>File Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>{file.type}</td>
                  <td>{Math.round(file.size / 1024)} KB</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleFileRemove(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table> 
        </div>
              )}*/}
      {isDisabled === false && (
        <div className="row p-2">
          <div className="col-12">
            <div className="TableBox">
              <TableComponent
                columns={propertyNameList}
                rows={tableData}
                setRows={setTableData}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateInvoiceForm;
