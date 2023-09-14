import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel, ToastContainer } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";

import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Accordion,
  FormGroup,
} from "@mui/material";
import { SelectAll } from "@mui/icons-material";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";

import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  addLotSeriesRequest,
  deleteLotSeriesRequest,
  fetchBuyerGroups,
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
import axiosMain from "../../../../http/axios/axios_main";


const validationSchema = Yup.object().shape({
  
  season: Yup.string().required("Season is required"),
  saleNo: Yup.number()
  .min(1, "Please select Sale No").required("Sale No is required"),
  teaType: Yup.number()
  .min(1, "Please select tea type")
  .required("Sale Date is required"),
  
});

const initialValues = {
  season: 0,
  saleNo: 0,
  teaType: 0,
};


const TeaQualityReportModal = () => {
  const dispatch = useDispatch();

  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValues, setInitialValue] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [groupCodeListdata, setGroupCodeList] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  //const [saleNumber, setsaleNumber] = useState([]);
  const [groupid, setgroupid] = useState(0);


  const [saleDates, setSaleDates] = useState([]);

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
    
    //let newRows = rows.filter(item => item !== "invoiceId");
    let newRows = rows.map((items) => {
      return {
      SaleYear:items.SaleYear,
      saleNo:items.saleNo,
      LotNo:items.LotNo,
  
      TeaType:items.TeaType,
      FactoryType:items.FactoryType,
      Mark:items.Mark,
      
      MarkLocation:items.MarkLocation,
      InvoiceNo:items.InvoiceNo,
      Grade:items.Grade,
      Category:items.Category,
      PackageType:items.PackageType,
      ManufactureFrom:items.ManufactureFrom,
      ManufactureTo:items.ManufactureTo,
      QualityCertification:items.QualityCertification,
      BrewColor:items.BrewColor,
      AgeofProduct:items.AgeofProduct,
      BrewersComments:items.BrewersComments,
      GardenCertification:items.GardenCertification,

      };
    });    
    const data = newRows;

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "TeaQualityReport");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "TeaQualityReport.xlsx");
  };
  // useEffect(() => {
  //   formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  // }, [saleDates]);

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
    dispatch(fetchSaleNumbersRequest(2023));
    dispatch(fetchBuyerGroups(1));
    dispatch(fetchSessionTypeRequest());
    dispatch(fetchMarkTypeRequest());
    dispatch(teaTypeAction());
    axiosMain
      .post("/preauction/Common/BindAuctioneer")
      .then((response) => {
        // Handle the API response here
        setAuctioneer(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });

  }, []);

  // useEffect(() => {
  //   setGroupCodeList(groupCodeList)
  // }, [groupCodeList])
 
 

  const handleRemove = () => {
    const requestData = {
      lotNoSeriesID: actionData.edit.lotNoSeriesID,
      updatedBy: 1,
    };

    // Dispatch the deleteLotSeriesRequest action with the provided data
    dispatch(deleteLotSeriesRequest(requestData));
    setOpenDelete(false);
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      //  if(values.sessionTime!=="")
      //   {
      //     let data=values.sessionTime.split('-');
      //   }
      const formData = {
        
        Season: values.season,
        SaleNo: values.saleNo !== "" ? parseInt(values.saleNo) : 0,
        TeaTypeId:values.teaType !== "" ? parseInt(values.teaType) : 0
      };
      let listdata = [];
      axiosMain.post("/preauction/PreAuctionStatusReport/GetTeaQualityParameterReport", formData)
        .then((response) => {
          // Handle the successful response here
          console.log('Response:', response.data);
          // if (response.data.responseData) {
          //   listdata = response.data.responseData.map((item, index) => {
          //     return { ...item, interestedtobid: '0',maxbid:0 };
          //   });
          // }
          setRows(response.data.responseData);
        })
        .catch((error) => {
          // Handle any errors here
          console.error('Error:', error);
        });


      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });
useEffect(()=>{
  formik.resetForm();
                        formik.setFieldValue("season", "");
                        formik.setFieldValue("saleNo", "0");
                        formik.setFieldValue("teaType", "85");
                        setRows([])
}, [])
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;

    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetSaleDateAndTeaType`;

    // Making the POST request using Axios
    if (saleNo !== "" && season !== "" && saleNo !== undefined && season !== undefined) {
      axiosMain
        .post(apiUrl, { saleNo: parseInt(saleNo), season: season })
        .then((response) => {
          // Handle the API response here
          setSaleDates(response?.data?.responseData);
        })
        .catch((error) => {
          // Handle errors here
        });


      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);
  //bind session time
  // useEffect(() => {
  //   const saleNo = formik.values.saleNo;
  //   const season = formik.values.season;
  //   const saledate = formik.values.saleDate;
  //   if (saleNo !== "" && season !== "" && saleNo !== undefined && season !== undefined && saledate !== undefined && saledate !== "") {
  //     const dataparam = {
  //       season: season,
  //       saleNo: parseInt(saleNo),
  //       auctionDate: "2023-09-13T00:00:00"
  //     };
  //     axiosMain
  //       .post("/preauction/Common/BindSessionTime", dataparam)
  //       .then((response) => {
  //         console.log(response, "bind session time")
  //         setSessionTime(response.data.responseData);
  //       })
  //       .catch((error) => {
  //         // Handle errors here
  //       });
  //   }
  // }, [formik.values.saleNo, formik.values.season, formik.values.saleDate]);

  useEffect(() => {
    const season = formik.values.season;
    if (season !== "" & season !== undefined) {
      dispatch(fetchSaleNumbersRequest(formik.values.season));
    }
  }, [formik.values.season])

  //for create formik

  
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
  const [rows, setRows] = useState([]);
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
  const [sessionTime, setSessionTime] = useState(sessionType);
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


  const kutcha = [
    
    { name: "SaleYear", title: "Sale Year" },
    { name: "saleNo", title: "Sale No" },
    { name: "LotNo", title: "Lot No" },

    { name: "TeaType", title: "Tea Type" },
    { name: "FactoryType", title: "Factory Type" },
    { name: "Mark", title: "Mark" },
    //{ name: "totalPackages", title: "Total Packeges" },
    { name: "MarkLocation", title: "Mark Location" },
    { name: "InvoiceNo", title: "Invoice No" },
    { name: "Grade", title: "Grade" },
    { name: "Category", title: "Category" },
    { name: "PackageType", title: "Packege Type" },
    { name: "ManufactureFrom", title: "Manufacture From" },
    { name: "ManufactureTo", title: "Manufacture To" },
    { name: "QualityCertification", title: "Quality Certification" },
    { name: "BrewColor", title: "Brew Color" },
    { name: "AgeofProduct", title: "Age Of Product" },
    { name: "BrewersComments", title: "Brewers Comments" },
    { name: "GardenCertification", title: "Garden Certification" },
  ];

  console.log(rows, "rows");

useEffect(()=>{
  console.log(teaType,"teaType")
  setTeaTeatypeList(teaType);
},[teaType])

  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);
  
    
  
    
  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    //setLotSeriesData([]);
    setIsEdit(false);

    setIsDisabled(false);
    // if(panel==="panel1")
    // {
    //   formik.resetForm()
    // formik.setFieldValue("groupCode", "")
    // formik.setFieldValue("groupName", "")
    // setRows([]);
    // }

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
 

  
 
  useEffect(() => {
    setSessionType(sessionType);
  }, [sessionType])

 

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
            <Typography>Tea Quality Report</Typography>
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
                      onChange={formik.handleChange}
                    >
                      <option value="" selected>Please Select Season</option>
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
                      <option value={0} selected>Please Select Sale No</option>
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
               

               <br></br>
                <div className="col-auto">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" type="submit">
                      Search
                    </Button>
                    <Button
                      className="SubmitBtn"
                      onClick={() => {
                        formik.resetForm();
                        formik.setFieldValue("season", "");
                        formik.setFieldValue("saleNo", "0");
                        formik.setFieldValue("teaType", "0");
                        setRows([]);
                      }}
                    >
                      Clear
                    </Button>
                   
                  </div>
                </div>




                <div className="col-lg-2">

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
        
      </div>
    </>
  );
};

export default TeaQualityReportModal;
