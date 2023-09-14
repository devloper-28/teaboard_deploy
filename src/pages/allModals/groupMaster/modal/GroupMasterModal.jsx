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
import GroupMasterForm from "./form/Form";
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
  // // mark: Yup.string().required("Mark is required"),
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
  // season: "2023",
  // saleNo: "",
  groupCode: "",
  groupName: ""
};
const createinitialValues = {

  groupCode: "",
  groupName: ""
};

const GroupMasterModal = () => {
  const dispatch = useDispatch();

  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValues, setInitialValue] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [groupCodeListdata, setGroupCodeList] = useState([]);
  const [groupid, setgroupid] = useState(0);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "GroupMaster");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "GroupMaster.xlsx");
  };
  ///samar
  const groupCodeList = useSelector(
    (state) => state?.groupMaster?.buyerGroups?.data?.responseData
  );
  console.log(groupCodeList, "Gropu datas.......................");
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
    // dispatch(fetchSaleNumbersRequest(formik.values.season));
    dispatch(fetchBuyerGroups(1));

  }, []);

  useEffect(() => {
    setGroupCodeList(groupCodeList)
  }, [groupCodeList])

  //bind group
 const bindGroupsList=()=>{
  axiosMain.post("/preauction/GroupMaster/BindGroups?buyerUserId="+1 )
  .then((response) => {
    // Handle the successful response here
    console.log('Response:', response.data);
   console.log("after update group bind",response.data.responseData);
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
      const formData = {
        // season: "2023",
        // saleNo: parseInt(values.saleNo),
        // pageNumber: 1,
        // pageSize: 100,
        groupName: values.groupName,
        groupCode: values.groupCode,
        buyerUserId: 1
      };
      let listdata = [];
      axiosMain.post("/preauction/GroupMaster/GetGroupMasterList", formData)
        .then((response) => {
          // Handle the successful response here
          console.log('Response:', response.data);
          if (response.data.responseData) {
            listdata = response.data.responseData.map((item, index) => {
              return { ...item, srNo: index + 1 };
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
  //for create formik

  const createformik = useFormik({
    initialValues: createinitialValues,

    validationSchema: createvalidationSchema,
    onSubmit: (values) => {

      let url = "";
      let formData = [];
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
// Get the current week number
const currentWeek = Math.ceil(((currentDate - new Date(currentYear, 0, 1)) / 86400000 + 1) / 7);
console.log(currentYear,currentWeek,"currentWeek")
      if (isEdit === false) {
        formData = {
          season:currentYear?.toString(),
          saleNo:currentWeek,
          groupName: values.groupName,
          groupCode: values.groupCode,
          createdBy: 1,
          buyerUserId: 1
        };
        url = "/preauction/GroupMaster/CreateGroupMaster";
      }
      else {
        formData = {
           season:currentYear?.toString(),
          saleNo:currentWeek,
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
    { name: "srNo", title: "Sr No." },
    { name: "groupCode", title: "Group Code" },
    { name: "groupName", title: "Group Name" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
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

  // const AWRCheckBox = (data) => {
  //   const handleChange = (e) => {
  //     setRows((prevRows) =>
  //       prevRows.map((row) =>
  //         row.id === data.data.id ? { ...row, checked: e.target.checked } : row
  //       )
  //     );

  //     const allChecked = rows.every((row) => row.checked);
  //     setSelectAllRow(allChecked);
  //   };
  //   useEffect(() => {
  //     const allChecked = rows.every((row) => row.checked);
  //     setSelectAllRow(allChecked);
  //   }, [rows]);

  //   return (
  //     <>
  //       <Form.Check
  //         type="checkbox"
  //         id="custom-switch"
  //         checked={data.data.checked}
  //         onChange={handleChange}
  //       />
  //     </>
  //   );
  // };
  useEffect(() => {
    //setRows(lotSeriesData);
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
            <Typography>Group Master List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={formik.handleSubmit}>
              <div className="row align-items-end">
                <div className="col-lg-2">
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
                </div>
                <div className="col-lg-2">
                  <label>Select Group Name</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="groupName"
                      value={formik.values.groupName}
                      onChange={handleChange}
                    >
                      <option value="">Please Select</option>
                      {groupCodeListdata?.at(0)?.names?.map((e) => (
                        <option key={e.groupName} value={e.groupName}>
                          {e.groupName}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.groupName && formik.touched.groupName && (
                    <div className="error text-danger">
                      {formik.errors.groupName}
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
                      onClick={() => {
                        formik.resetForm();
                        formik.setFieldValue("groupCode", "");
                        formik.setFieldValue("groupName", "");
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
            <Typography>Manage Group Master</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={createformik.handleSubmit}>
              <div className="row">
                <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                  <FormLabel>Group Code</FormLabel>
                  <FormControl
                    as="input"
                    type="text"
                    id="groupCode"
                    name="groupCode"
                    disabled={isDisabled}
                    onChange={createformik.handleChange}
                    value={createformik.values.groupCode}
                  />
                  {createformik.touched.groupCode && createformik.errors.groupCode ? (
                    <div className="error text-danger">{createformik.errors.groupCode}</div>
                  ) : null}
                </FormGroup>



                <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                  <FormLabel>Group Name</FormLabel>
                  <FormControl
                    as="input"
                    type="text"
                    id="groupName"
                    name="groupName"
                    disabled={isDisabled}
                    onChange={createformik.handleChange}
                    value={createformik.values.groupName}
                  />
                  {createformik.errors.groupName && createformik.touched.groupName && (
                    <div className="error text-danger">
                      {createformik.errors.groupName}
                    </div>
                  )}
                </FormGroup>


              </div>
              <div className="BtnGroup">

                {isDisabled === true ? "" : isEdit === true ? (
                  <>
                    <Button className="SubmitBtn" type="submit">
                      Update
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="submit" className="SubmitBtn">Submit</Button>
                  </>
                )}
              </div>

            </form>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default GroupMasterModal;
