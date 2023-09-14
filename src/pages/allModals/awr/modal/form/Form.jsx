import React, { useEffect, useState } from "react";
import { Button, Card, FormControl, InputGroup, Table } from "react-bootstrap";
import CustomeFormCreater from "../../../../../components/common/formCreater/CustomeFormCreater";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  addAwrRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsRequest,
  fetchMarkRequest,
  fetchSaleProgramListRequest,
  fetchSubTeaTypeRequest,
  fetchWarehouseUserRequest,
  teaTypeAction,
  uploadSampleShortageRequest,
} from "../../../../../store/actions";
import { fetchSaleNumbersRequest } from "../../../../../store/actions/createdSaleNo/CreatedSaleNo";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { setRef } from "@mui/material";
import FileUpload from "../../../../../components/common/uploadFile/FileUpload";
import { readFileAndCheckHeaders } from "../../../../../components/common/uploadFile/utils";
import { useRef } from "react";
import TableComponent from "../../../../../components/tableComponent/TableComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosMain from "../../../../../http/axios/axios_main";

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const currentWeek = Math.ceil(
  ((currentDate - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

const validationSchema = Yup.object().shape({
  gatePassQuantity: Yup.number().required("Gate Pass Quantity is required"),
  // awrRefNo: Yup.string().required("AWR Ref No is required"),
  arrivalDate: Yup.date().required("Arrival Date is required"),
  awrDate: Yup.date().required("AWR Date is required"),
  catalogClosingDate: Yup.date().required("Catalog Closing Date is required"),
  invoiceDate: Yup.date().required("Invoice Date is required"),
  // gpNumber: Yup.string().required("gate Pass Number is required"),
  // gpDate: Yup.date().required("gate Pass Date is required"),
});

// const handleSubmit = (fromData) => {
//   // setUploadedData(fromData);
//   const data = {
//     season: fromData.season,
//     saleNo: fromData.saleNo,
//     gpQty: 800,
//     awrReferenceNo: fromData.awrReferenceNo,
//     markId: fromData.mark,
//     wareHouseUserRegId: fromData.wareHouseUserRegId,
//     arrivalDate: fromData.arrivalDate,
//     awrDate: fromData.awrDate,
//     catalogClosingDate: fromData.catalogClosingDate,
//     invoiceDate: fromData.invoiceDate,
//     factoryName: fromData.factoryName,
//     gradeId: fromData.gradeId,
//     awrInvoices: fromData.awrInvoices,
//   };
//   console.log(data);
// };
const initialValues = {
  season: currentYear?.toString(),
  saleNo: "",
  SaleProgramId: 0,
  gatePassQuantity: null,
  awrRefNo: "",
  mark: "",
  warehouse: "",
  arrivalDate: "",
  awrDate: "",
  catalogClosingDate: "",
  invoiceDate: "",
  manufacture: "",
  grade: 0,
  gpNo: "",
  gpDate: "",
  awrInvoices: [],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];

function AWRForm({ isDisabled }) {
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [subTeaTypeNo, setSubTeaTypeNo] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [saleprogram, setsaleprogrm] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [handleChnage, setHandleChnage] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sampleList, setSampleList] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [validationData, setValidationData] = useState([]);
  const fileInputRef = useRef(null);
  const [propertyNameList, setPropertyNameList] = useState([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      setPropertyNameList(propertyNames);

      // console.log("values");
      // handleSubmit(values);
      // const formData = values.awrInvoices?.map((ele) => {
      //   return {
      //     invoiceId: 10100,
      //     markId: 10,
      //     season: "2023",
      //     teaTypeId: 1,
      //     SaleProgramId: 10108,
      //     wareHouseUserRegId: 3,
      //     auctioneerId: 10023,
      //     categoryId: 2,
      //     manufactureFromDate: "2023-02-03T17:16:40.000",
      //     manufactureToDate: "2023-03-02T17:16:40.000",
      //     dateOfDispatch: "2023-07-30T17:16:40",
      //     invoiceDate: "2023-07-30T17:16:40.000",
      //     carrier: "tes",
      //     lorryReceiptNo: "test",
      //     lorryNo: "test",
      //     invoiceNo: "PQR90",
      //     arrivalDate: "2023-07-26T17:16:40",
      //     awrDate: "2023-07-27T19:16:40",
      //     awrReferenceNo: "AWR012",
      //     subTeaTypeId: 2,
      //     gradeId: 4,
      //     packageType: "test",
      //     packageSize: "11X22X33",
      //     packageNo: "20-50",
      //     totalPackages: 31,
      //     grossKgs: 10,
      //     tareKgs: 5,
      //     netKgs: 5,
      //     totalNetKgs: 155,
      //     gpNo: "test12",
      //     gpDate: "2023-07-28T17:16:40",
      //     shortExcessWeight: 10,
      //     locationInsideWarehouse: "test",
      //     isActive: true,
      //     createdBy: 1,
      //     invoiceRefNo: "123ABC",
      //     invoiceQty: 155,
      //     updatedBy: 1,
      //     updatedOn: "2023-07-24T17:16:40",
      //   };
      // });

      const {
        arrivalDate,
        awrDate,
        awrRefNo,
        gatePassQuantity,
        SaleProgramId,
      } = values;
      let awrData = {
        season: values.season,
        saleNo: parseInt(values.saleNo),
        invoiceDate: values.invoiceDate,
        SaleProgramId: SaleProgramId,
        arrivalDate: arrivalDate,
        awrDate: awrDate,
        awrRefNo: awrRefNo,
        gatePassQuantity: gatePassQuantity,
        createdBy: 1,
        packageType: "15",
        gradeId: parseInt(formik.values.grade),
      };

      const data = values.awrInvoices?.map((ele) => {
        if (ele.gpNo == null || ele.gpNo === "") {
          ele.gpNo = values.gpNo;
          ele.gpDate = values.gpDate;
          return {
            ...ele,
            ...awrData,
          };
        } else {
          return {
            ...ele,
            ...awrData,
          };
        }
      });

      setTableData([...tableData, data[0]]);

      formik.resetForm();
      setHandleChnage(true); // Reset the "handleChange" flag as well

      // console.log(data, "hello");
    },
    validateOnBlur: true, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: true,
  });

  const dispatch = useDispatch();

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
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);

  const invoiceData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );

  console.log(invoiceData, "invoiceData");

  useEffect(() => {
    dispatch(teaTypeAction());
    dispatch(fetchMarkRequest());
    dispatch(fetchWarehouseUserRequest());
    dispatch(fetchGradeRequest());
    // dispatch(fetchSaleProgramListRequest(saleData));
    dispatch(fetchCategoryRequest());
    dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, []);

  useEffect(() => {
    setTeaTeatypeList(teaType);
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSaleNo(saleNumber);
    setSubTeaTypeNo(subTeaType);
    setCategory(category);
  }, [
    teaType,
    subTeaType,
    markList,
    warehouseUsersList,
    grades,
    saleNumber,
    category,
  ]);

  const ExecelpropertyNames = [
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

  const handleSubmit = (fromData) => {
    const data = {
      season: fromData.season,
      saleNo: fromData.saleNo,
      gpQty: 800,
      awrReferenceNo: fromData.awrRefNo,
      markId: fromData.mark,
      wareHouseUserRegId: fromData.warehouse,
      arrivalDate: fromData.arrivalDate,
      awrDate: fromData.awrDate,
      catalogClosingDate: fromData.catalogClosingDate,
      invoiceDate: fromData.invoiceDate,
      factoryName: fromData.manufacture,
      gradeId: fromData.grade,
      awrInvoices: fromData.awrInvoices,
    };
    console.log(data);
    // Place the API call or further processing logic here
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    formik.handleSubmit();
  };

  useEffect(() => {
    formik.setFieldValue("awrInvoices", invoiceData || []);
  }, [invoiceData]);

  useEffect(() => {
    if (formik.values.awrDate !== "") {
      const parsedDate1 = new Date(formik.values.awrDate);
      const parsedDate2 = new Date(formik.values.catalogClosingDate);
      if (parsedDate1 <= parsedDate2) {
        formik.setFieldValue("awrDate", formik.values.awrDate);
      } else {
        formik.setFieldValue("awrDate", "");
        toast.error("Arrival Date must me lessthen catlog closing date");
      }
    } else {
      formik.setFieldValue("awrDate", "");
    }
  }, [formik.values.awrDate]);

  useEffect(() => {
    // console.log(formik.values.warehouse, "formik.values.warehouse");
    if (formik.values.mark !== "") {
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
    } else {
      console.log("Mark is missing");
    }
  }, [formik.values.mark]);

  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${saleNo}&season=${season}`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "") {
      axiosMain
        .post(apiUrl, { saleNo: parseInt(saleNo), season: season })
        .then((response) => {
          // Handle the API response here
          formik.setFieldValue(
            "catalogClosingDate",
            response?.data?.responseData[0]?.catalogClosingDate?.split("T")[0]
          );
          formik.setFieldValue(
            "SaleProgramId",
            response?.data?.responseData[0]?.SaleProgramId
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

  const columns = [
    "Season",
    "Sale No.",
    "Warehouse",
    "Warehouse Name",
    "Auctioneer",
    "Grade",
    "Period of Manufacture (From Date)",
    "Period of Manufacture (To Date)",
    "Date of Dispatch",
    "Invoice No.",
    "Invoice Date",
    "Lorry Receipt No.",
    "Lorry No.",
    "Carrier",
    "Basic / A.D.E.",
    "Cess",
    "Total Duty Payable",
    "Arrival Date",
    "AWR Date",
    "AWR Ref. No.",
    "Tea Type",
    "Sub Type",
    "Category",
    "Package Size",
    "Package Type",
    "Package No.",
    "Total Packages",
    "Gross KGs",
    "Tare KGs",
    "Net KGs",
    "Total Net KGs",
    "GP No.",
    "GP Date",
    "Short/Excess Weight",
    "Location inside Warehouse",
  ];
  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear; i > currentYear - 7; i--) {
      options.push({ label: i, value: i });
    }

    return options;
  }

  // const handleFileUpload = (e) => {
  //   const { values, handleChange, handleSubmit, errors: formikErrors } = formik;

  //   const files = Array.from(e.target.files);
  //   const validFiles = files.filter(
  //     (file) =>
  //       file.type === "application/vnd.ms-excel" ||
  //       file.type ===
  //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //   );

  //   if (validFiles.length > 0) {
  //     setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       fileUpload: null,
  //     }));
  //   } else {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       fileUpload: "Please select valid Excel files",
  //     }));
  //   }
  // };

  const fields = [
    {
      label: "Seson",
      name: "seson",
      type: isDisabled === true ? "disable" : "select",
      options: generateYearOptions(),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Sell No",
      name: "saleNo",
      type: isDisabled === true ? "disable" : "select",
      options: saleNo?.map((ele) => {
        return { label: ele.saleNo, value: ele.saleNo };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Gate Pass Quantity",
      name: "gatePassQuantity",
      type: isDisabled === true ? "disable" : "disable",
      required: true,
      className: "FormGroup",
    },
    {
      label: "AWR Ref No",
      name: "awrRefNo",
      type: "disable",
      required: true,
      className: "FormGroup",
    },
    {
      label: "MARK",
      name: "mark",
      type: isDisabled === true ? "disable" : "select",
      options: markDataList?.map((ele) => {
        return { label: ele.markName, value: ele.markId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Warehouse",
      name: "warehouse",
      type: isDisabled === true ? "disable" : "select",
      options: warehouseUserList?.map((ele) => {
        return { label: ele.wareHouseName, value: ele.wareHouseUserRegId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Arrival Date",
      name: "arrivalDate",
      type: isDisabled === true ? "disable" : "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "AWR Date",
      name: "awrDate",
      type: isDisabled === true ? "disable" : "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Catalog Closing Date",
      name: "catalogClosingDate",
      type: isDisabled === true ? "disable" : "disable",
      value: formik.values.catalogClosingDate,
      required: true,
      className: "FormGroup",
    },
    {
      label: "Invoice Date",
      name: "invoiceDate",
      type: isDisabled === true ? "disable" : "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Manufacture",
      name: "manufacture",
      type: isDisabled === true ? "disable" : "disable",
      value: formik.values.manufacture,
      required: false,
      className: "FormGroup",
    },
    {
      label: "Grade",
      name: "grade",
      type: isDisabled === true ? "disable" : "select",
      options: gradesList?.map((ele) => {
        return { label: ele.gradeName, value: ele.gradeId };
      }),
      required: false,
      className: "FormGroup",
    },
  ];

  const handleButtonClick = () => {
    formik.handleReset();
    setHandleChnage(false); // Reset the "handleChange" flag as well
    setPropertyNameList(ExecelpropertyNames);

    fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;

    for (const file of files) {
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );

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

  const Controlls = () => {
    return (
      <>
        <div className="BtnGroup">
          <Button
            onClick={() => {
              if (tableData?.length > 0) {
                // let tableDatas = tableData?.map((ele) => {
                //   ele.gpDate + "" + ele.gpNo;
                // });
                // tableData[0].gpDate = formik.values.gpDate;
                // tableData[0].gpNo = formik.values.gpNo.toString();
                dispatch(addAwrRequest(tableData));

                // axios
                //   .post(
                //     "/preauction/AWRDetails/UploadAWRDetails",
                //     tableData
                //   )
                //   .then((res) => {
                //     if (res.data.statusCode === 200) {
                //       toast.success(res.data.message);
                //     }
                //   });
              } else {
                toast.error("Add Awr to create AWR");
              }
            }}
            className="SubmitBtn"
          >
            Create
          </Button>
          <Button type="submit" className="SubmitBtn">
            Add
          </Button>
          <Button
            className="SubmitBtn"
            onClick={() => {
              if (
                formik.values.saleNo !== null &&
                formik.values.mark !== "" &&
                formik.values.warehouse !== "" &&
                formik.values.invoiceDate !== ""
              ) {
                axiosMain
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
                      invoiceDate: formik.values.invoiceDate,
                    }
                  )
                  .then((res) => {
                    const data = res.data.responseData?.map(
                      (ele) => ele.totalWeight
                    );
                    // console.log(
                    //   ,"res"
                    // );

                    if (data?.length > 0) {
                      toast.success("AWR Details Filled");

                      let gpq = data.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue;
                      });
                      formik.setFieldValue("gatePassQuantity", gpq);
                      formik.setFieldValue(
                        "awrInvoices",
                        res.data.responseData
                      );
                    } else {
                      toast.error("AWR Details Not Filled");
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
          </Button>

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
          </label> */}
        </div>
      </>
    );
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };
  const propertyName = [
    "inspectionchgs",
    "lotno",
    "packageno",
    "reinspectionchgs",
    "samplewt",
    "shortwt",
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

  function excelDateToJSDate(excelDate) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds per day
    const excelStartDate = new Date(1900, 0, 1); // Excel date system starts from January 1, 1900
    const excelDays = excelDate - 1; // Excel date is 1-based

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
  function totalNetKagesCalculation(totalPackage, netKags, sampleQty) {
    const result = totalPackage * netKags;

    return result - sampleQty;
  }
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
              // auctioneerCode,
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
              arrivalDate: excelDateToJSDate(arrivalDate),
              awrDate: excelDateToJSDate(awrDate),
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
              gpNo: gpNo.toString(),
              gpDate: excelDateToJSDate(gpDate),
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
      if (fileData?.length > 0) {
        setFileData([...fileData, ...dataList]);
      } else {
        setFileData([...dataList]);
      }

      console.log(data, dataList, "dataF");
    }
  };

  const validation = async (uploadedData) => {
    const updatedFileData = [];
    if (fileData.length > 0) {
      for (const { fileName, data } of uploadedData) {
        if (data && data.length > 0) {
          const missingProperties = propertyName.filter((propertyName) => {
            return !data.some((obj) => propertyName in obj);
          });

          const filteredData = data.filter((obj) => {
            // Check if any key in the object has a defined value
            return Object.values(obj).some((value) => value !== undefined);
          });

          if (missingProperties.length === 0 && filteredData.length > 0) {
            // console.log(`All properties are present in file '${fileName}'`);
            toast.success(`All properties are present in file ${fileName}`);
            updatedFileData.push(filteredData);
            // Continue with processing the data
            // ... rest of your code ...
          } else {
            // console.log(
            //   `Missing properties in file '${fileName}':`,
            //   missingProperties
            // );

            // Handle the case where properties are missing
            toast.error(
              `Missing properties in file '${fileName}': ${missingProperties.join(
                ", "
              )}`
            );
          }
        } else {
          // Handle the case where the data array is empty
          toast.error(`No data found in file '${fileName}'`);
        }
      }
    } else {
      toast.error(`No file found in fields`);
    }
    const mergedArray = updatedFileData.reduce((result, currentArray) => {
      return result.concat(currentArray);
    }, []);
    // console.log(mergedArray, "updatedFileData");

    setValidationData([...sampleList, ...mergedArray]);
  };

  const handleAddData = () => {
    // You can call this function when the "Add Data" button is clicked

    const fileInput = document.getElementById("fileInput");

    if (fileData?.length > 0 && validationData?.length > 0) {
      // handleData(/* Your uploaded data here */);
      fileInput.value = "";
      setSampleList(validationData);
      setFileData([]);
      toast.success("Data added successfully!");
    } else {
      toast.error("Data validation failed! Cannot add data.");
    }
  };

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

  const propertyNames = [
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
      title: "Tea Type ID",
      getCellValue: ({ ...row }) => (
        <span>
          {teaTypeList?.map((ele) =>
            ele.teaTypeId == row?.teaTypeId ? ele.teaTypeName : ""
          )}
        </span>
      ),
    },
    { name: "saleNo", title: "Sale No" },
    { name: "wareHouseUserRegId", title: "Warehouse User Registration ID" },
    // { name: "auctioneerId", title: "Auctioneer ID" },
    { name: "categoryId", title: "Category" },
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
    { name: "subTeaTypeId", title: "Sub Tea Type" },
    { name: "gradeId", title: "Grade" },
    { name: "packageType", title: "Package Type" },
    { name: "packageSize", title: "Package Size" },
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
            setFileData(
              [...fileData].filter(
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

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <CustomeFormCreater
              fields={fields}
              initialValues={initialValues}
              validationSchema={validationSchema}
              // handleSubmit={() => handleSubmit()}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              handleFileRemove={handleFileRemove}
              formik={formik}
              Controlls={Controlls}
              setHandleChnage={setHandleChnage}
            />
          </div>
          {/* <div className="col-md-6">
                {uploadedFiles.length > 0 && (
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
                )}
              </div> */}
        </div>

        {/* <div className="row mt-3">
          <div className="col-md-12">
            <Card className="mt-3 FileUploadBox">
              <Card.Body>
                <Card.Title>File Upload</Card.Title>
                {/* <div className="row">
                  <div className="col-lg-auto">
                    <div className="FileUpload">
                      <FileUpload
                        id="fileInput"
                        handleData={handleData}
                        readFileAndCheckHeaders={readFileAndCheckHeaders}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="BtnGroup">
                      <Button
                        className="SubmitBtn"
                        onClick={() => handleAddData()}
                      >
                        Add
                      </Button>

                      <Button
                        className="SubmitBtn"
                        onClick={() => validation(fileData)}
                      >
                        Validate
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div> */}

        <div className="row">
          <div className="col-md-12 mt-3">
            <div className="row mt-3">
              <div className="col-md-12">
                <div class="browse-file FileUpload">
                  {/* <FileUpload
              id="fileInput"
              handleData={handleData}
              readFileAndCheckHeaders={readFileAndCheckHeaders}
            /> */}
                  <button
                    className="SubmitBtn"
                    type="button"
                    onClick={handleButtonClick}
                  >
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
                    onClick={() => {
                      if (fileData?.length > 0) {
                        const toastMessages = fileData?.map((obj, index) => {
                          let rowNo = index + 1;
                          const fromDateParts =
                            obj.manufactureFromDate.split("-");
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
                            findDuplicateInvoiceNumbers(fileData);

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
                          } else if (
                            obj.gpDate === null ||
                            obj.gpNo === null ||
                            obj.awrDate === null ||
                            obj.arrivalDate === null
                          ) {
                            toast.error(
                              "Any AWR field is missing from gpdate,gpno,arrival date, awr date" +
                                rowNo
                            );
                          } else {
                            // console.log(
                            //   toastMessages,
                            //   "invoiceDatainvoiceDatainvoiceData"
                            // );\

                            return true;
                          }
                        });

                        const allTrue = toastMessages.every(
                          (element) => element === true
                        );

                        if (allTrue) {
                          console.log(fileData, "fileDatafileDatafileData");
                          axiosMain
                            .post(
                              "/preauction/AWRDetails/UploadAWRDetails",
                              fileData
                            )
                            .then((response) => {
                              if (response.data.statusCode === 200) {
                                toast.success(response.data.message);
                                setFileData([]);
                              }
                              if (response.data.statusCode === 403) {
                                toast.warning(response.data.message);
                              }
                              if (response.data.statusCode === 204) {
                                toast.warning(response.data.message);
                              }
                              // Handle the response data or success
                            })
                            .catch((error) => {
                              toast.error("Something went wrong", error);
                              // Handle errors here
                            });

                          // console.log(invoiceData, "datadatadata");
                        } else {
                          console.log("Not all elements are true.");
                        }

                        console.log(toastMessages, "toastMessages");
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

            <div className="TableBox">
              {fileData?.length > 0 ? (
                <TableComponent
                  columns={propertyNameList}
                  rows={fileData}
                  setRows={setFileData}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                  selectionCol={true}
                  sorting={true}
                />
              ) : tableData?.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      {Object.keys(tableData[0])?.map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((data, index) => (
                      <tr key={index}>
                        {Object.entries(data).map(([key, value], i) => (
                          <td key={i}>
                            {key === "gpDate" ? (
                              // <input
                              //   type="date"
                              //   name="gpDate"
                              //   id="gpDate"
                              //   value={formik.values.gpDate || ""} // Set the default value to the first option
                              //   onChange={(e) => {
                              //     formik.handleChange(e);
                              //   }}
                              //   required
                              //   max={formik.values.arrivalDate || ""}
                              // />
                              <input
                                type="date"
                                name="gpDate"
                                id="gpDate"
                                value={tableData[index].gpDate || ""}
                                onChange={(e) => {
                                  const newTableData = [...tableData];
                                  newTableData[index].gpDate = e.target.value;
                                  setTableData(newTableData);
                                }}
                                required
                                max={tableData[index].arrivalDate || ""}
                                // max={formik.values.arrivalDate[index] || ""}
                              />
                            ) : key === "gpNo" ? (
                              <input
                                type="text"
                                name="gpNo"
                                id="gpNo"
                                value={tableData[index].gpNo || ""}
                                onChange={(e) => {
                                  const newTableData = [...tableData];
                                  newTableData[index].gpNo = e.target.value;
                                  setTableData(newTableData);
                                }}
                                required
                              />
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <>
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th>catalogClosingDate</th>
                        <th>invoiceId</th>
                        <th>invoiceNo</th>
                        <th>gpNo</th>
                        <th>gpDate</th>
                        <th>Origin</th>
                        <th>categoryName</th>
                        <th>teaTypeName</th>
                        <th>subTeaTypeName</th>
                        <th>markName</th>
                        <th>grossKgs</th>
                        <th>tareKgs</th>
                        <th>netKgs</th>
                        <th>totalPackages</th>
                        <th>packageNo</th>
                        <th>shortExcessWeight</th>
                        <th>totalWeight</th>
                        <th>locationInsideWarehouse</th>
                        <th>manufactureFromDate</th>
                        <th>manufactureToDate</th>
                        <th>dateOfDispatch</th>
                        <th>carrier</th>
                        <th>lorryReceiptNo</th>
                        <th>lorryNo</th>
                        <th>season</th>
                        <th>saleNo</th>
                        <th>invoiceDate</th>
                        <th>SaleProgramId</th>
                        <th>arrivalDate</th>
                        <th>awrDate</th>
                        <th>awrRefNo</th>
                        <th>gatePassQuantity</th>
                        <th>createdBy</th>
                        <th>packageType</th>
                        <th>gradeId</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={35}>
                          <div className="NoData">No Data</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default AWRForm;
