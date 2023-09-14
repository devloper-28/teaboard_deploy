import React, { useEffect, useState } from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import CustomeFormCreater from "../../../../../components/common/formCreater/CustomeFormCreater";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  addLotSeriesRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsRequest,
  fetchMarkRequest,
  fetchSaleProgramListRequest,
  fetchSubTeaTypeRequest,
  fetchWarehouseUserRequest,
  teaTypeAction,
  updateLotSeriesRequest,
} from "../../../../../store/actions";
// import { fetchSaleNumbersRequest } from "../../../../../store/actions/createdSaleNo/CreatedSaleNo";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { setRef } from "@mui/material";
import axiosMain from "../../../../../http/axios/axios_main";

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const validationSchema = Yup.object().shape({
  saleNo: Yup.number().required("sale No is required"),
  teaTypeId: Yup.number().required("Tea Type is required"),
  categoryId: Yup.number().required("Category is required"),
  seriesFrom: Yup.number().required("Series From is required"),
  seriesTo: Yup.number()
    .required("Series To is required")
    .test(
      "is-greater",
      "Series To must be greater than Series From",
      function (value) {
        const { seriesFrom } = this.parent; // Access the value of seriesFrom
        return value > seriesFrom; // Return true if seriesTo is greater than seriesFrom
      }
    ),
});

const initialValues = {
  saleNo: null,
  season: currentYear.toString(),
  saleProgramId: null,
  teaTypeId: null,
  categoryId: null,
  seriesFrom: "",
  seriesTo: "",
  isActive: true,
  createdBy: 1,
};

function AWRForm({
  initialValue,
  setInitialValue,
  lotSeriesDataIds,
  setLotSeriesData,
  isDisabled,
  isEdit,
  handleAccordionChange,
  handleChnage, setHandleChnage
}) {
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [subTeaTypeNo, setSubTeaTypeNo] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [saleprogram, setsaleprogrm] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [teaTypeList, setTeaTeatypeList] = useState([]);

  const lotSeriesDataId = useSelector(
    (state) => state.lotSeriesReducer.dataById.responseData
  );
  const lotseriesData = useSelector((state) => state.lotSeriesReducer);
  console.log(lotseriesData, "lotSeriesDataId");
  useEffect(() => {
    if (lotSeriesDataId?.length > 0) {
      setInitialValue(lotSeriesDataId[0]);
      setLotSeriesData(lotSeriesDataId);
    } else {
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
    }
  }, [lotSeriesDataId]);

  const formik = useFormik({
      initialValues: {
      saleNo: null,
      season: "2023",
      saleProgramId: null,
      teaTypeId: null,
      categoryId: null,
      seriesFrom: "",
      seriesTo: "",
      isActive: true,
      createdBy: 1,
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // console.log("values");
      // handleSubmit(values);

      if (isEdit === true) {
        const {
          saleNo,
          season,
          saleProgramId,
          teaTypeId,
          categoryId,
          seriesFrom,
          seriesTo,
        } = values;
        const updateData = {
          lotNoSeriesID: values.lotNoSeriesID,
          saleNo: parseInt(saleNo),
          season: season,
          saleProgramId: saleProgramId,
          teaTypeId: parseInt(teaTypeId),
          categoryId: parseInt(categoryId),
          seriesFrom: parseInt(seriesFrom),
          seriesTo: parseInt(seriesTo),
          auctioneerId: 10056,
          isActive: true,
          updatedBy: 1,
        };
        dispatch(updateLotSeriesRequest(updateData));
      } else {
        const {
          saleNo,
          season,
          saleProgramId,
          teaTypeId,
          categoryId,
          seriesFrom,
          seriesTo,
          isActive,
          createdBy,
        } = values;

        const data = {
          saleNo: parseInt(saleNo),
          season: season,
          saleProgramId: saleProgramId,
          teaTypeId: parseInt(teaTypeId),
          categoryId: parseInt(categoryId),
          seriesFrom: parseInt(seriesFrom),
          seriesTo: parseInt(seriesTo),
          isActive: isActive,
          auctioneerId: 10056,

          createdBy: createdBy,
        };
        setTableData([...tableData, data]);
      }
      resetForm();
    },
    validateOnBlur: true, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: true,
  });

  // resetModal = () => {
  //   formik.setValues({
  //     saleNo: null,
  //     season: currentYear.toString(),
  //     saleProgramId: null,
  //     teaTypeId: null,
  //     categoryId: null,
  //     seriesFrom: "",
  //     seriesTo: "",
  //     isActive: true,
  //     createdBy: 1,
  //   });
  //   setInitialValue({});
  //   lotSeriesDataId = [];
  // };

  useEffect(() => {
    formik.setValues(
      initialValue === []
        ? {
            saleNo: null,
            season: "2023",
            saleProgramId: null,
            teaTypeId: null,
            categoryId: null,
            seriesFrom: "",
            seriesTo: "",
            isActive: true,
            createdBy: 1,
          }
        : initialValue
    );
  }, [initialValue]);

  // useEffect(() => {
  //   if (lotSeriesDataId?.teaTypeId) {
  //     formik.values.teaTypeId = initialValue.teaTypeId;
  //     formik.values.categoryId = initialValue.categoryId;
  //     formik.values.seriesFrom = parseInt(initialValue.seriesFrom);
  //     formik.values.seriesTo = parseInt(initialValue.seriesTo);
  //   } else {
  //     formik.values.teaTypeId = null;
  //     formik.values.categoryId = null;
  //     formik.values.seriesFrom = "";
  //     formik.values.seriesTo = "";
  //   }
  // }, [lotSeriesDataId, initialValue]);

  console.log(formik.values, initialValue, "formik");

  const [tableData, setTableData] = useState([]);
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
    // dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
    dispatch(fetchCategoryRequest());
    // dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, []);

  useEffect(() => {
    setTeaTeatypeList(teaType);
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSubTeaTypeNo(subTeaType);
    setCategory(category);
    axiosMain
      .post(`/preauction/Common/BindSaleNoBySeason?season=${currentYear}`)
      .then((res) => setSaleNo(res.data.responseData))
      .catch((err) => console.log(err));
  }, [teaType, subTeaType, markList, warehouseUsersList, grades, category]);
  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${saleNo}&season=${season}`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "" && saleNo !== null && season !== "") {
      axiosMain
        .post(apiUrl, { saleNo: parseInt(saleNo), season: season })
        .then((response) => {
          // Handle the API response here
          formik.setFieldValue(
            "saleProgramId",
            response?.data?.responseData[0]?.SaleProgramId
          );
        })
        .catch(() => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo]);

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

  const fields =
    lotSeriesDataIds?.length > 0
      ? [
          {
            label: "Category",
            name: "categoryId",
            type: isDisabled === true ? "disable" : "select",
            options: catagory?.map((ele) => {
              return { label: ele.categoryName, value: ele.categoryId };
            }),
            required: true,
            className: "FormGroup",
          },
          {
            label: "Tea Type",
            name: "teaTypeId",
            type: isDisabled === true ? "disable" : "select",
            options: teaTypeList?.map((ele) => {
              return { label: ele.teaTypeName, value: ele.teaTypeId };
            }),
            required: true,
            className: "FormGroup",
          },
          {
            label: "Series From",
            name: "seriesFrom",
            type: isDisabled === true ? "disable" : "number",
            required: true,
            className: "FormGroup",
          },
          {
            label: "Series To",
            name: "seriesTo",
            type: isDisabled === true ? "disable" : "number",
            required: true,
            className: "FormGroup",
          },
        ]
      : [
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
            label: "Category",
            name: "categoryId",
            type: "select",
            options: catagory?.map((ele) => {
              return { label: ele.categoryName, value: ele.categoryId };
            }),
            required: true,
            className: "FormGroup",
          },
          {
            label: "Tea Type",
            name: "teaTypeId",
            type: "select",
            options: teaTypeList?.map((ele) => {
              return { label: ele.teaTypeName, value: ele.teaTypeId };
            }),
            required: true,
            className: "FormGroup",
          },
          {
            label: "Series From",
            name: "seriesFrom",
            type: "number",
            required: true,
            className: "FormGroup",
          },
          {
            label: "Series To",
            name: "seriesTo",
            type: "number",
            required: true,
            className: "FormGroup",
          },
        ];

  const Controlls = () => {
    return (
      <>
        <div className="BtnGroup">
          {isEdit === true ? (
            <>
              <Button className="SubmitBtn" type="submit">
                Update
              </Button>
            </>
          ) : (
            <>
              <Button
                className="SubmitBtn"
                onClick={() => {
                  if (tableData.length > 0) {
                    dispatch(addLotSeriesRequest(tableData));
                  } else {
                    toast.error("Please Add Lot");
                  }
                  console.log(lotseriesData, "lotseriesDatalotseriesData");

                  if (lotseriesData.data.statusCode === 403) {
                    toast.warning(lotseriesData.data.message);
                    return;
                  }
                  if (lotseriesData.data.statusCode === 200) {
                    toast.success(lotseriesData.data.message);
                    handleAccordionChange("panel1");
                    formik.resetForm();
                    setTableData([]);
                    setHandleChnage(false);
                    return;
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

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
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
            </div>
          </form>
        </div>
        <div className="col-md-12">
          <div className="TableBox">
            {lotSeriesDataIds?.length > 0 ? (
              ""
            ) : tableData?.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Tea Type</th>
                    <th>Category</th>
                    <th>Series From</th>
                    <th>Series To</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((value) => (
                    <tr>
                      <td>
                        {teaTypeList.map((ele) =>
                          ele.teaTypeId === value.teaTypeId
                            ? ele.teaTypeName
                            : ""
                        )}
                      </td>
                      <td>
                        {catagory.map((ele) =>
                          ele.categoryId === value.categoryId
                            ? ele.categoryName
                            : ""
                        )}
                      </td>
                      <td>{value.seriesFrom}</td>
                      <td>{value.seriesTo}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <>
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th>Tea Type</th>
                      <th>Category</th>
                      <th>Series From</th>
                      <th>Series To</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4}>
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
      <ToastContainer />
    </div>
  );
}

export default AWRForm;
