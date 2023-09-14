import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axiosMain from "../../../../../http/axios/axios_main";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  InspectionChgs: Yup.string()
    .required("Please enter appropriate Inspection Charges.")
    .test(
      "is-numeric-or-float",
      "Invalid value for InspectionChgs",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
  LOTNO: Yup.string().required("LOTNO is required"),
  PACKAGENO: Yup.string().required("PACKAGENO is required"),
  ReInspectionChgs: Yup.string()
    .required("ReInspectionChgs is required")
    .test(
      "is-numeric-or-float",
      "Please enter appropriate Re-inspection Charges.",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
  SAMPLEWT: Yup.string()
    .required("SAMPLEWT is required")
    .test(
      "is-numeric-or-float",
      "Please enter appropriate Sample Weight.",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
  SHORTWT: Yup.string()
    .required("SHORTWT is required")
    .test(
      "is-numeric-or-float",
      "Please enter appropriate Short Weight.",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
});

const MenualForm = ({ rows, setRows, handleSubmit, isDisable, isEdit }) => {
  const [viewDataList, setViewDataList] = useState([
    {
      LotNo: "Sach123AHM20231710-S ",
      categoryId: 10131,
      categoryName: "Crush Tear And Curl",
      gradeId: 4,
      gradeName: "Grade3",
      inspectionCharges: 10,
      invoiceId: 0,
      invoiceNo: "TEST11152",
      markId: 40,
      markName: "Orange",
      netKgs: 53,
      packageNo: "10-20",
      reInspectionCharges: 10,
      saleNo: 17,
      sampleWeight: "54",
      season: "2023",
      shortWeight: 2,
      shortWeightId: 0,
      teaTypeId: 85,
      teaTypeName: "Leaf",
      totalPackages: 11,
      totalSampleQty: 5,
      totalShortQty: 2,
    },
    {
      LotNo: "Sach123AHM20231710-S ",
      categoryId: 10131,
      categoryName: "Crush Tear And Curl",
      gradeId: 4,
      gradeName: "Grade3",
      inspectionCharges: 10,
      invoiceId: 0,
      invoiceNo: "TEST11152",
      markId: 40,
      markName: "Orange",
      netKgs: 53,
      packageNo: "10-20",
      reInspectionCharges: 10,
      saleNo: 17,
      sampleWeight: "54",
      season: "2023",
      shortWeight: 2,
      shortWeightId: 0,
      teaTypeId: 85,
      teaTypeName: "Leaf",
      totalPackages: 11,
      totalSampleQty: 5,
      totalShortQty: 2,
    },
  ]);
  const viewData = useSelector(
    (state) => state?.sampleShortageReducer?.data?.responseData
  );
  // useEffect(() => {
  //   setViewDataList([]);
  // }, []);

  console.log(isDisable, "isDisableisDisable");
  const formik = useFormik({
    initialValues: {
      InspectionChgs: "",
      LOTNO: "",
      PACKAGENO: "",
      ReInspectionChgs: "",
      SAMPLEWT: "",
      SHORTWT: "",
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      // Call the API to create data
      setRows([...rows, values]);
      // let updatedData = rows;

      // //   console.log(values, "rowsrows");
      // if (isEdit) {

      // }
    },
  });
  useEffect(() => {
    if (viewData?.length > 0) setViewDataList(viewData);
    else setViewDataList([]);

    if (isEdit) {
      formik.setFieldValue("PACKAGENO", viewData?.at(0)?.packageNo);
      formik.setFieldValue("SAMPLEWT", viewData?.at(0)?.sampleWeight);
      formik.setFieldValue("SHORTWT", viewData?.at(0)?.shortWeight);
      formik.setFieldValue(
        "InspectionChgs",
        viewData?.at(0)?.inspectionCharges
      );
      formik.setFieldValue(
        "ReInspectionChgs",
        viewData?.at(0).reInspectionCharges
      );
    } else {
      formik.setFieldValue("PACKAGENO", "");
    }
  }, [viewData]);
  console.log(viewDataList, "viewDataListviewDataList");
  const sampleshortage = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    {
      name: "season",
      title: "Season",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    // {
    //   name: "markName",
    //   title: "Mark",
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
    {
      name: "netKgs",
      title: "Net Weight",
    },
    {
      name: "totalSampleQty",
      title: "Total Sample Qty",
    },
    {
      name: "sampleWeight",
      title: "Sample Weight",
    },
    {
      name: "totalShortQty",
      title: "Total Short Qty",
    },
    {
      name: "shortWeight",
      title: "Short Weight",
    },
    {
      name: "inspectionCharges",
      title: "Inspection Charges",
    },
    {
      name: "reInspectionCharges",
      title: "Re-Inspection Charges",
    },
  ];

  // const handleInputChange = (event, name) => {
  //   const newData = viewDataList.map((item) => {
  //     if (item.name === name) {
  //       return { ...item, lotno: event.target.value };
  //     }
  //     return item;
  //   });
  //   setViewDataList(newData);
  // };

  const handleInputChange = (event, rowIndex, fieldName) => {
    const newValue = event.target.value;
    setViewDataList((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][fieldName] = newValue;
      return newData;
    });
  };

  const handlePrintData = () => {
    let data = viewDataList.map((ele) => {
      let result = {
        LotNo: ele.LotNo,
        packageNo: ele.ShortPackageNo,
        sampleWeight: parseFloat(ele.sampleWeight),
        shortWeight: parseFloat(ele.shortWeight),
        inspectionCharges: parseFloat(ele.inspectionCharges),
        reInspectionCharges: parseFloat(ele.reInspectionCharges),
        isActive: true,
        createdBy: 10056,
        updatedBy: 10056,
      };
      return result;
    });
    let fileData = data.map((ele) => {
      let data = {
        LotNo: ele.LotNo?.toString(),
        packageNo: ele.packageNo?.toString(),
        createdBy: 1,
      };
      return data;
    });

    axiosMain
      .post("/preauction/SampleShortage/CheckPackageNoByLotNo", fileData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          // toast.success(res.data.message);
          axiosMain
            .post("/preauction/SampleShortage/UpdateSampleShortage", data)
            .then((res) => {
              if (res.data.statusCode === 200) {
                toast.success(res.data.message);
              } else {
                toast.error(res.data.message);
              }
            });
          // .catch((error) => toast.error(error.data.errors));
        } else {
          toast.error(res.data.message);
        }
      });

    // console.log(data);
  };
  const sampleshortageUpdate = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    // {
    //   name: "season",
    //   title: "Season",
    // },
    // {
    //   name: "saleNo",
    //   title: "Sale No",
    // },
    // {
    //   name: "markName",
    //   title: "Mark",
    // },
    {
      name: "LotNo",
      title: "Lot No",
    },
    {
      name: "markName",
      title: "Mark",
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
      name: "categoryName",
      title: "Category",
    },
    {
      name: "netKgs",
      title: "Net Weight",
    },
    {
      name: "gradeName",
      title: "Grade",
    },

    {
      name: "invoicePackageNo",
      title: "Package No",
    },
    // {
    //   name: "sampleWeight",
    //   title: "Sample Weight",
    // },
    // {
    //   name: "shortWeight",
    //   title: "Short Weight",
    // },
    // {
    //   name: "inspectionCharges",
    //   title: "Inspection Charges",
    // },
    // {
    //   name: "reInspectionCharges",
    //   title: "Re-Inspection Charges",
    // },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        {viewDataList?.length > 0 && isDisable
          ? sampleshortage?.map((key, index) => (
              <div key={key.name} className="col-md-4">
                <label>{key.title}</label>
                <br />
                <input
                  type="text"
                  value={viewDataList?.at(0)[key?.name]}
                  // value={viewDataList[key.name]}
                  // onChange={(e) => handleInputChange(e, key)}
                  disabled
                />
              </div>
            ))
          : isEdit
          ? ""
          : // <>
            //   <div className="col-md-4">
            //     <label htmlFor="LOTNO">LOTNO</label>
            //     <br />
            //     <input
            //       type="text"
            //       id="LOTNO"
            //       name="LOTNO"
            //       onChange={formik.handleChange}
            //       onBlur={formik.handleBlur}
            //       value={formik.values.LOTNO}
            //     />
            //     {formik.touched.LOTNO && formik.errors.LOTNO && (
            //       <div className="error text-danger">{formik.errors.LOTNO}</div>
            //     )}
            //   </div>

            //   <div className="col-md-4">
            //     <label htmlFor="PACKAGENO">PACKAGENO</label>
            //     <br />
            //     <input
            //       type="text"
            //       id="PACKAGENO"
            //       name="PACKAGENO"
            //       onChange={formik.handleChange}
            //       onBlur={formik.handleBlur}
            //       value={formik.values.PACKAGENO}
            //     />
            //     {formik.touched.PACKAGENO && formik.errors.PACKAGENO && (
            //       <div className="error text-danger">
            //         {formik.errors.PACKAGENO}
            //       </div>
            //     )}
            //   </div>
            //   <div className="col-md-4">
            //     <label htmlFor="InspectionChgs">Inspection Charges</label>
            //     <br />
            //     <input
            //       type="text"
            //       id="InspectionChgs"
            //       name="InspectionChgs"
            //       onChange={formik.handleChange}
            //       onBlur={formik.handleBlur}
            //       value={formik.values.InspectionChgs}
            //     />
            //     {formik.touched.InspectionChgs &&
            //       formik.errors.InspectionChgs && (
            //         <div className="error text-danger">
            //           {formik.errors.InspectionChgs}
            //         </div>
            //       )}
            //   </div>

            //   <div className="col-md-4">
            //     <label htmlFor="ReInspectionChgs">Re-Inspection Charges</label>
            //     <br />
            //     <input
            //       type="text"
            //       id="ReInspectionChgs"
            //       name="ReInspectionChgs"
            //       onChange={formik.handleChange}
            //       onBlur={formik.handleBlur}
            //       value={formik.values.ReInspectionChgs}
            //     />
            //     {formik.touched.ReInspectionChgs &&
            //       formik.errors.ReInspectionChgs && (
            //         <div className="error text-danger">
            //           {formik.errors.ReInspectionChgs}
            //         </div>
            //       )}
            //   </div>

            //   <div className="col-md-4">
            //     <label htmlFor="SAMPLEWT">SAMPLEWT</label>
            //     <br />
            //     <input
            //       type="text"
            //       id="SAMPLEWT"
            //       name="SAMPLEWT"
            //       onChange={formik.handleChange}
            //       onBlur={formik.handleBlur}
            //       value={formik.values.SAMPLEWT}
            //     />
            //     {formik.touched.SAMPLEWT && formik.errors.SAMPLEWT && (
            //       <div className="error text-danger">
            //         {formik.errors.SAMPLEWT}
            //       </div>
            //     )}
            //   </div>

            //   <div className="col-md-4">
            //     <label htmlFor="SHORTWT">SHORTWT</label>
            //     <br />
            //     <input
            //       type="text"
            //       id="SHORTWT"
            //       name="SHORTWT"
            //       onChange={formik.handleChange}
            //       onBlur={formik.handleBlur}
            //       value={formik.values.SHORTWT}
            //     />
            //     {formik.touched.SHORTWT && formik.errors.SHORTWT && (
            //       <div className="error text-danger">{formik.errors.SHORTWT}</div>
            //     )}
            //   </div>
            // </>
            ""}
      </div>
      {viewDataList?.length > 0 && isEdit ? (
        <>
          <div className="row">
            {sampleshortageUpdate?.map((key, index) => (
              <div key={key.name} className="col-md-4">
                <label>{key.title}</label>
                <br />
                <input
                  type="text"
                  value={viewDataList.at(0)[key.name]}
                  // value={viewDataList[key.name]}
                  // onChange={(e) => handleInputChange(e, key)}
                  disabled
                />
              </div>
            ))}
          </div>

          <br />
          <table>
            <thead>
              <tr>
                <th>Package No</th>
                <th>Sample Weight</th>
                <th>Short Weight</th>
                <th>Inspection Charges</th>
                <th>Re-Inspection Charges</th>
              </tr>
            </thead>
            <tbody>
              {viewDataList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.ShortPackageNo}
                      onChange={(event) =>
                        handleInputChange(event, index, "ShortPackageNo")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.sampleWeight}
                      onChange={(event) =>
                        handleInputChange(event, index, "sampleWeight")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.shortWeight}
                      onChange={(event) =>
                        handleInputChange(event, index, "shortWeight")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.inspectionCharges}
                      onChange={(event) =>
                        handleInputChange(event, index, "inspectionCharges")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.reInspectionCharges}
                      onChange={(event) =>
                        handleInputChange(event, index, "reInspectionCharges")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        ""
      )}
      {isDisable ? (
        ""
      ) : isEdit ? (
        <button type="button" onClick={handlePrintData}>
          Update
        </button>
      ) : (
        <>
          {" "}
          {/* <button type="submit">Add</button>
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              handleSubmit();
            }}
          >
            Create
          </button> */}
        </>
      )}
    </form>
  );
};

export default MenualForm;
