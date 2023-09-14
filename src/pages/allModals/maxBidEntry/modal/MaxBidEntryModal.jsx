import React, { useEffect, useState, useRef } from "react";
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
import MaxBidEntryTable from "../MaxBidEntryDataTable/MaxBidEntryTable";
import { readFileAndCheckHeaders } from "../../../../components/common/uploadFile/utils";

const validationSchema = Yup.object().shape({
  saleNo: Yup.number().min(1, "Please select Sale No")
    .required("Sale No is required"),
  season: Yup.string()
    .required("Seasonis required"),
  saleDate: Yup.string()
    .required("Sale Date is required"),
  sessionTime: Yup.string()
    .required("Session Time is required"),
  // // LotNoStatus: Yup.string().required("Lot Number is required"),
  // // category: Yup.string().required("Category is required"),
  // saleNo: Yup.string().required("Sale No is required"),
  // // season: Yup.string().required("Season is required"),
  // // teaType: Yup.string().required("Tea Type is required"),
  // // grade: Yup.string().required("Grade is required"),
  // // markType: Yup.string().required("Mark Type is required"),
});
const createvalidationSchema = Yup.object().shape({
  groupCode: Yup.string()
    .required('Group Code is required')
    //.min(3, 'Group Code must be at least 3 characters')
    .max(10, 'Group Code must not exceed 10 characters'),
  groupName: Yup.string()
    .required('Group Name is required')
    .max(10, 'Group Name must not exceed 10 characters'),
});
const initialValues = {
  season: "",
  saleNo: "",
  saleDate: "",
  auctioner: "",
  sessionType: "",
  sessionTime: ""
};
const createinitialValues = {

  groupCode: "",
  groupName: ""
};

const MaxBidEntryModal = () => {
  const dispatch = useDispatch();

  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValues, setInitialValue] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [groupCodeListdata, setGroupCodeList] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  //const [saleNumber, setsaleNumber] = useState([]);
  const [groupid, setgroupid] = useState(0);
  const [propertyNameList, setPropertyNameList] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

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
    const data = rows;

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "MaxBidEntry");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "MaxBidEntry.xlsx");
  };
  // useEffect(() => {
  //   formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  // }, [saleDates]);

  useEffect(() => {
    // Dispatch the action when the component mounts
    formik.resetForm();
    formik.setFieldValue("auctioner", "0");
    formik.setFieldValue("saleNo", "0");
    formik.setFieldValue("sessionType", "0");
    formik.setFieldValue("season", "");
    formik.setFieldValue("saleDate", "");
    formik.setFieldValue("sessionTime", "");
    setRows([]);

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
  const savetabledata = () => {
    console.log(rows, "samardas");
    let savedata = [];

    rows.map((items) => {
      const Newdatas = {
        SaleProgramId: parseInt(items.SaleProgramId),
        auctionCenterId: 2,
        kutchaCatalogId: parseInt(items.auctionCatalogId),
        sessionTypeId: parseInt(items.sessionTypeId),
        teaTypeId: parseInt(items.teaTypeId),
        categoryId: parseInt(items.categoryId),
        markId: parseInt(items.markId),
        gradeId: parseInt(items.gradeId),
        invoiceId: parseInt(items.invoiceId),
        auctionCatalogId: parseInt(items.auctionCatalogId),
        interestedToBid: 1,
        maxBid: 120,
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
        buyerUserId: 1,
        status: parseInt(items.status),
        LotNo: items.LotNo

      }
      savedata.push(Newdatas);

    });
    axiosMain.post("/preauction/MaxBidEntry/UpdateMaxBidEntry", savedata)
      .then((response) => {
        // Handle the successful response here
        console.log('Response:', response.data);

      })

      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }
  //bind group
  const bindGroupsList = () => {
    axiosMain.post("/preauction/GroupMaster/BindGroups?buyerUserId=" + 1)
      .then((response) => {
        // Handle the successful response here
        console.log('Response:', response.data);
        console.log("after update group bind", response.data.responseData);
        setGroupCodeList(response.data.responseData);
        setRows([]);
      })

      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  };

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

    validationSchema,
    onSubmit: async (values) => {
      let datatime;
      if (values.sessionTime !== "" && values.sessionTime !== undefined) {
        datatime = values.sessionTime.split('-');
      }
      const formData = {

        season: values.season,
        saleNo: values.saleNo !== "" ? parseInt(values.saleNo) : 0,
        saleDate: values.saleDate,
        auctioneerId: values.auctioner !== "" ? parseInt(values.auctioner) : 0,
        sessionTypeId: values.sessionType !== "" ? parseInt(values.sessionType) : 0,

        sessionStartTime: datatime[0].slice(0, -5),
        sessionEndTime: datatime[1].slice(0, -4)

      };
      let listdata = [];
      axiosMain.post("/preauction/MaxBidEntry/GetMaxBidEntryList", formData)
        .then((response) => {
          // Handle the successful response here
          console.log('Response:', response.data);
          if (response.data.responseData) {
            listdata = response.data.responseData.map((item, index) => {
              return { ...item, interestedtobid: '0', maxbid: 0 };
            });
          }
          setRows(listdata);
        })
        .catch((error) => {
          // Handle any errors here
          console.error('Error:', error);
        });


      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });

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
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    const saledate = formik.values.saleDate;
    if (saleNo !== "" && season !== "" && saleNo !== undefined && season !== undefined && saledate !== undefined && saledate !== "") {
      const dataparam = {
        season: season,
        saleNo: parseInt(saleNo),
        auctionDate: "2023-09-13T00:00:00"
      };
      axiosMain
        .post("/preauction/Common/BindSessionTime", dataparam)
        .then((response) => {
          console.log(response, "bind session time")
          setSessionTime(response.data.responseData);
        })
        .catch((error) => {
          // Handle errors here
        });
    }
  }, [formik.values.saleNo, formik.values.season, formik.values.saleDate]);

  useEffect(() => {
    const season = formik.values.season;
    if (season !== "" & season !== undefined) {
      dispatch(fetchSaleNumbersRequest(formik.values.season));
    }
  }, [formik.values.season])

  //for create formik

  const createformik = useFormik({
    initialValues: createinitialValues,

    validationSchema: createvalidationSchema,
    onSubmit: (values) => {

      let url = "";
      let formData = [];

      if (isEdit === false) {
        formData = {
          groupName: values.groupName,
          groupCode: values.groupCode,
          createdBy: 15,
          buyerUserId: 1
        };
        url = "/preauction/GroupMaster/CreateGroupMaster";
      }
      else {
        formData = {
          groupId: groupid,
          groupName: values.groupName,
          groupCode: values.groupCode,
          updatedBy: 15,
          buyerUserId: 1,

        };
        url = "/preauction/GroupMaster/UpdateGroupMaster";
      }

      axiosMain.post(url, formData)
        .then((response) => {
          // Handle the successful response here
          console.log('Response:', response.data);
          if (response.data.statusCode == 200) {
            toast.success(response.data.message);
            bindGroupsList();
            createformik.resetForm();
            setIsEdit(false);
          }
          else
            toast.error(response.data.message);

        })
        .catch((error) => {
          // Handle any errors here
          console.error('Error:', error);
        });


      //console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
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
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    { name: "LotNo", title: "Lot No" },
    { name: "teaTypeName", title: "Tea Type" },
    { name: "categoryName", title: "Category" },

    { name: "markName", title: "Mark" },
    { name: "gradeName", title: "Grade" },
    { name: "invoiceNo", title: "Invoice No" },
    //{ name: "totalPackages", title: "Total Packeges" },
    { name: "basePrice", title: "Base Price for Normal Auction" },
    { name: "basePrice", title: "Base Price for PRS Auction" },
    { name: "priceIncrement", title: "Price Increment" },
    { name: "LSP_SP", title: "LSP/SP" },
    // {name: "interestedtobid", title: "Interested To BID",type: "select",
    // options: [
    //   { label: "N", value: "N" },
    //   { label: "Y", value: "Y" },
    // ],
    // required: false,
    // className: "FormGroup"},
    {
      name: "interestedtobid",
      title: "Interested To Bid",
      getCellValue: ({ ...row }) => <DdlArea data={row} />,
    },
    {
      name: "maxbid",
      title: "Max Bid",
      getCellValue: ({ value, setValue, isDisabled, ...row }) => (
        <InputArea
          // value={value}
          value={row.maxBid}
          onChange={setValue} // Pass a function to update the value
          isDisabled={isDisabled}
          row={row}
        />
      )
    },
    //{name: "maxbid", title: "Max Bid",getCellValue: ({ ...row }) => <InputArea data={row} />,},
    { name: "invoiceNo", title: "Invoice No" },
    { name: "createdBy", title: "Created By" },
    { name: "updatedBy", title: "last Modified By" },
    { name: "sessionTypeName", title: "Session Type" },
    { name: "status", title: "Status" },
    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
  ];

  console.log(rows, "rows");



  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    //setLotSeriesData([]);
    setIsEdit(false);

    createformik.resetForm();
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
  const ActionArea = (row) => {
    function handleAction(action) {

      setExpandedTab("panel2");

      switch (action) {
        case "view": {
          const lotNo = row.data.groupId;

          //setgroupid(lotNo);
          axiosMain.post("/preauction/GroupMaster/GetGroupMasterById?groupId=" + lotNo)
            .then((response) => {
              // Handle the successful response here
              console.log('EditResponse:', response.data.responseData[0]);

              createformik.setFieldValue("groupName", response.data.responseData[0].groupName)
              createformik.setFieldValue("groupCode", response.data.responseData[0].groupCode)


            })
            .catch((error) => {
              // Handle any errors here
              console.error('Error:', error);
            });
          setIsDisabled(true);
          break;
        }
        case "edit": {
          setIsDisabled(false);
          const lotNo = row.data.groupId;

          setgroupid(lotNo);
          axiosMain.post("/preauction/GroupMaster/GetGroupMasterById?groupId=" + lotNo)
            .then((response) => {
              // Handle the successful response here
              console.log('EditResponse:', response.data.responseData[0]);

              createformik.setFieldValue("groupName", response.data.responseData[0].groupName)
              createformik.setFieldValue("groupCode", response.data.responseData[0].groupCode)


            })
            .catch((error) => {
              // Handle any errors here
              console.error('Error:', error);
            });
          // setSelectedSaleProgram(saleProgramDetail);
          //setIsDisabled(false);
          setIsEdit(true);

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
          {/* <span
            onClick={() => {
              setOpenDelete(true);
              setActionData({ ...actionData, edit: row.data });
            }}
          >
            <DeleteIcon />
          </span> */}
        </div>
      </>
    );
  };

  const InputArea = ({ value, onChange, isDisabled, row }) => {
    const handleChange = (event) => {
      if (event.target.value !== "") {
        row.maxbid = parseInt(event.target.value);
      }


    };
    if (row.interestedtobid === '0') {
      //isDisabled=true;
    }
    else
      isDisabled = false;
    return (
      <FormGroup>
        <FormControl
          type="number"
          id="maxbid"
          name="maxbid"
          disabled={isDisabled}
          onChange={handleChange}
          value={value}
        />
      </FormGroup>
    );
  };


  const DdlArea = (row) => {
    const [selectedValue, setSelectedValue] = useState(0);
    setSelectedValue(row.interestedToBid);
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      row.data.interestedtobid = event.target.value;
      // You can also update your 'data' object here if needed
      // data.inbid = event.target.value;
      console.log(row, "row all")
    };
    return (
      <>
        <InputGroup>
          <FormControl
            as="select"
            name="inbid"
            // value="inbid"
            value={selectedValue}
            onChange={handleChange}
          //onChange={handleChange}
          >
            <option value={0}>N</option>
            <option value={1}>Y</option>
          </FormControl>
        </InputGroup>
      </>
    )
  };
  useEffect(() => {
    setSessionType(sessionType);
  }, [sessionType])

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
  // console.log(rows,"rows")

  //Export button


  const propertyNames = [
    {
      name: "lotNo",
      title: "Lot No",
    },
    { name: "interestedToBid", title: "Interested To Bid" },
    {
      name: "maxBidPrice",
      title: "Max Bid Price",
    },
    { name: "sessionType", title: "Session Type" },
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
  function findDuplicateInvoiceNumbers(arrayOfObjects) {
    const invoiceNumbers = new Map();
    const duplicateInvoices = [];

    arrayOfObjects.forEach((obj) => {
      if (invoiceNumbers.has(obj.LotNo)) {
        duplicateInvoices.push(obj.LotNo);
      }
      invoiceNumbers.set(obj.LotNo, true);
    });

    return duplicateInvoices;
  }
  function requiredvalidation(arrayOfObjects) {


    arrayOfObjects.forEach((obj) => {
      if (obj.LotNo !== "" && obj.LotNo !== undefined) {
        if ((obj.interestedToBid === "" && obj.interestedToBid === undefined) || (obj.maxBid === "" && obj.maxBid === undefined)) {
          return 0;
        }
        else
          return 1;
      }
      else
        return 1;

    });

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
          console.log(data, "datadata")

          const dataList = filteredData.map((ele) => {
            const {
              lotno,
              interestedToBid,
              maxbidprice,
              sessionType
            } = fixKeyNames(ele);

            let data = {
              auctionCenterId: 2,
              LotNo: lotno?.toString(),
              interestedToBid: interestedToBid?.toString() === "Y" ? 1 : 0,
              maxBid: maxbidprice !== "" && maxbidprice !== undefined ? parseInt(maxbidprice) : 0,
              //sessiontype:sessionType?.toString(),
              isActive: true,
              createdBy: 1,
              updatedBy: 1,
              buyerUserId: 1,
              status: 1,

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

      //allData(mergedArray);
      // if (invoiceData?.length > 0) {
      //   setInvoiceData([...invoiceData, ...dataList]);
      // } else {
      setInvoiceData([...invoiceData, ...mergedArray]);
      //}
      console.log(...mergedArray, "mergedArraymergedArray");
      console.log(invoiceData, "invoiceDatainvoiceData")
    } catch (error) {
      toast.error(error);
    }
    // validation(uploadedData);
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];




  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
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
            <Typography>Max Bid Entry List</Typography>
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
                      <option value="">Please Select Season</option>
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
                      <option value="0">Please Select Sale No</option>
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
                  <label>Select Sale Date.</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="saleDate"
                      value={formik.values.saleDate}
                      onChange={handleChange}
                    >
                      <option value="">Please Select Sale Date</option>
                      {saleDates?.map((e) => (
                        <option key={e.saleDate} value={e.saleDate}>
                          {e.saleDate}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.saleDate && formik.touched.saleDate && (
                    <div className="error text-danger">
                      {formik.errors.saleDate}
                    </div>
                  )}
                </div>

                <div className="col-lg-2">
                  <label>Select Auctioner.</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="auctioner"
                      value={formik.values.auctioner}
                      onChange={handleChange}
                    >
                      <option value="0">Select Auctioneer</option>

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
                  </InputGroup>
                  {formik.errors.auctioner && formik.touched.auctioner && (
                    <div className="error text-danger">
                      {formik.errors.auctioner}
                    </div>
                  )}
                </div>

                <div className="col-lg-2">
                  <label>Select Session Type.</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="sessionType"
                      value={formik.values.sessionType}
                      onChange={handleChange}
                    >
                      <option value="0">Select Session Type</option>
                      {sessionTypes?.length > 0
                        ? sessionTypes?.map((item, index) => (
                          <option value={item?.sessionTypeId}>
                            {item.sessionTypeName}
                          </option>
                        ))
                        : "No Data"}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.sessionType && formik.touched.sessionType && (
                    <div className="error text-danger">
                      {formik.errors.sessionType}
                    </div>
                  )}
                </div>

                <div className="col-lg-2">
                  <label>Select Session Time.</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="sessionTime"
                      value={formik.values.sessionTime}
                      onChange={handleChange}
                    >
                      <option value="">Select Session Time</option>
                      {sessionTime?.length > 0
                        ? sessionTime?.map((item, index) => (
                          <option value={item?.SessionTime}>
                            {item.SessionTime}
                          </option>
                        ))
                        : "No Data"}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.sessionTime && formik.touched.sessionTime && (
                    <div className="error text-danger">
                      {formik.errors.sessionTime}
                    </div>
                  )}
                </div>

                {/* <div className="col-lg-2">
                  <label>Select Group Code</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="groupCode"
                      value={formik.values.groupCode}
                      onChange={handleChange}
                    >
                      <option value="">Please Select</option>

                      {groupCodeListdata?.at(0)?.codes?.map((e) => (
                        <option key={e.groupCode} value={e.groupCode}>
                          {e.groupCode}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.groupCode && formik.touched.groupCode && (
                    <div className="error text-danger">
                      {formik.errors.groupCode}
                    </div>
                  )}
                </div> */}
                <div className="col-auto">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" type="submit">
                      Search
                    </Button>
                    <Button
                      className="SubmitBtn"
                      onClick={() => {
                        formik.resetForm();
                        formik.setFieldValue("auctioner", "0");
                        formik.setFieldValue("saleNo", "0");
                        formik.setFieldValue("sessionType", "0");
                        formik.setFieldValue("season", "");
                        formik.setFieldValue("sessionTime", "");
                        formik.setFieldValue("saleDate", "");
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
                {/* <TableComponent
                  columns={kutcha}
                  rows={rows?.length > 0 ? rows : []}
                  setRows={setRows}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                  selectionCol={true}
                  sorting={true}
                /> */}
              </div>
              <MaxBidEntryTable rows={rows} setRows={setRows} />
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
            <Typography>Manage Max Bid Entry</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={createformik.handleSubmit}>

              <div className="col-md-12 ">
                <div class="browse-file FileUpload">
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


                          const duplicates =
                            findDuplicateInvoiceNumbers(invoiceData);
                          //   const isValid= requiredvalidation(invoiceData);
                          // if(isValid===0)
                          // {
                          //   toast.error(
                          //    "Please Choose Max Bid And Interested To Bid!")
                          // }

                          if (duplicates.length > 0) {
                            toast.error(
                              "Lot No" +
                              " " +
                              duplicates.join(", ") +
                              " " +
                              "is already exist"
                            );
                            return false;
                          } else {

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
                              "/preauction/MaxBidEntry/UploadMaxBidEntry",
                              invoiceData
                            )
                            .then((response) => {
                              if (response.data.statusCode === 200) {
                                toast.success(response.data.message);
                                handleAccordionChange("panel1");
                                //setInvoiceData([]);
                              }
                             else if (response.data.statusCode === 204) {
                              //else
                                toast.warning(response.data.message);
                              }
                              else
                              toast.error(response.data.message);
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
                        toast.error("Please Upload Max Bid Entry ");
                      }
                    }}
                  >
                    Create
                  </Button>
                  <div>
      <a
        href="/maxbidentryformat.xlsx" // Replace with the actual path to your Excel file
        download="MaxBidEntryFormat.xlsx" // Specify the desired file name for download
      >
        Download Excel
      </a>
    </div>
                </div>
              </div>

            </form>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default MaxBidEntryModal;
