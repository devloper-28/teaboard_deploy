import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMarkTypeRequest } from "../../../../../store/actions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosMain from "../../../../../http/axios/axios_main";

const KutchaTable = ({ rows, setRows }) => {
  const initialData = [
    {
      KutchaCatalogId: 84,
      LotNo: "RO14AHM2023123-S",
      invoiceId: 10240,
      invoiceNo: "PQ12",
      teaTypeId: 1,
      teaTypeName: "sdfsdfsdaaaa",
      subTeaTypeId: 2,
      subTeaTypeName: "fgdfgdfg",
      categoryId: 3,
      categoryName: "string04",
      markId: 9,
      markName: "ICnjRUkVs",
      gradeId: 3,
      gradeName: "string1211",
      marketTypeId: 1,
      marketTypeName: "Small",
      sessionTypeId: 1,
      sessionTypeName: "Normal",
      packageType: "test",
      packageNo: "10-20",
      totalPackages: 11,
      SampleQty: null,
      grossKgs: 10.0,
      tareKgs: 5.0,
      netKgs: 5.0,
      invoiceWeight: 55.0,
      shortExcessWeight: 10.0,
      manufactureFromDate: "2023-02-03T17:16:40",
      manufactureToDate: "2023-03-02T17:16:40",
      gpNo: "test23",
      gpDate: "2023-02-15T17:16:40",
      basePrice: 300.0,
      auctioneerValuation: 370.0,
      reservePrice: 320.0,
      priceIncrement: 1.0,
      markPackageComments: "Package Comments",
      lotComments: "Lot Comments",
      qualityComments: "Quality Comments",
      qualityCertification: "Quality Certificate",
      brewColor: "",
      ageOfProducts: 0.0,
      brewersComments: "",
      gardenCertification: "Garden Certification",
      wareHouseUserRegId: 3,
      wareHouseName: "ABC",
      locationInsideWarehouse: "",
      remarks: "",
      lastModifiedBy: 6,
      MarketType: null,
      SystemBasePrice: 325.0,
      factoryId: 6,
      lastModifiedBy: "factry11",
    },
  ];

  const [data, setData] = useState(rows?.length > 0 ? rows : []);
  const [selectedData, setSelectedData] = useState([]);
  const [checked, setChecked] = useState(false);

  const [editing, setEditing] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    setData(rows);
  }, [rows]);
  const handleCheckboxChange = (id) => {
    const isChecked = selectedData.some((item) => item.KutchaCatalogId === id);

    if (isChecked) {
      // If the checkbox is checked, remove the data from selectedData
      setSelectedData(
        selectedData.filter((item) => item.KutchaCatalogId !== id)
      );
    } else {
      // If the checkbox is unchecked, add the data to selectedData
      const data2 = data.find((item) => item.KutchaCatalogId === id);
      setSelectedData([...selectedData, data2]);
    }
  };

  const handleDeleteSelected = async () => {
    // setData((prevData) => prevData.filter((item) => !item.selected));
    console.log(
      data.map((ele) => ele.KutchaCatalogId).join(", "),
      data,
      "checkedDatacheckedDatacheckedData"
    );

    if (data?.length > 0) {
      try {
        const response = await axiosMain.post(
          "/preauction/KutchaCatalogue/DeleteKutchaCatalogueDetails",
          {
            season: data?.at(0)?.season,
            saleNo: data?.at(0)?.saleNo,
            KutchaCatalogIds: selectedData
              .map((ele) => ele.KutchaCatalogId)
              .join(", "),
            userId: data?.at(0)?.auctioneerId,
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("An error occurred while deleting.");
      }
    } else {
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSaveCell = (id, field, value) => {
    console.log(id, field, value, "id, field, value");
    if (
      field?.toString() === "SampleQty" ||
      field?.toString() === "grossKgs" ||
      field?.toString() === "shortExcessWeight" ||
      field?.toString() === "basePrice" ||
      field?.toString() === "reservePrice"
    ) {
      let isValid = /^\d+(\.\d{1,2})?$/.test(value.toString());
      if (isValid) {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        // console.log("Sample Qwantity is able to dasimal");
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Two digits after decimal point allowed.",
        }));
        return;
      }
    }
    if (field?.toString() === "grossKgs") {
      const dataList = data
        .filter((item) => item.KutchaCatalogId === id)
        ?.at(0);

      let greatestValue = Math.max(
        parseFloat(value),
        parseFloat(dataList.SampleQty)
      );

      if (
        greatestValue === parseFloat(value) &&
        parseFloat(value) !== parseFloat(dataList.SampleQty)
      ) {
        let netKgsValue = value - dataList.tareKgs;

        let noOfKgs = dataList.totalPackages * netKgsValue;
        let smapQty = dataList.SampleQty + dataList.shortExcessWeight;
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? {
                  ...item,
                  [field]: value,
                  netKgs: value - dataList.tareKgs,
                  invoiceWeight: noOfKgs - smapQty,
                }
              : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? {
                  ...item,
                  [field]: value,
                  netKgs: value - dataList.tareKgs,
                  invoiceWeight: noOfKgs - smapQty,
                }
              : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          grossKgs: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? { ...item, [field]: value, netKgs: 0, invoiceWeight: 0 }
              : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? { ...item, [field]: value, netKgs: 0, invoiceWeight: 0 }
              : item
          )
        );
        // console.log("Sample Qwantity is able to dasimal");
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          grossKgs: "Gross Weight cannot be less than sampling Qty.",
        }));
      }

      console.log(
        parseFloat(dataList.SampleQty),
        field,
        "dataListdataListdataList"
      );
    } else {
      // console.log(data);
      setData((prevData) =>
        prevData.map((item) =>
          item.KutchaCatalogId === id ? { ...item, [field]: value } : item
        )
      );
      setSelectedData((prevData) =>
        prevData.map((item) =>
          item.KutchaCatalogId === id ? { ...item, [field]: value } : item
        )
      );
    }

    if (
      field?.toString() === "auctioneerValuation" ||
      field?.toString() === "markPackageComments" ||
      field?.toString() === "lotComments" ||
      field?.toString() === "qualityComments"
    ) {
      const regex = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-|]+$/;

      if (regex.test(value) || value === "") {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        // console.log("Sample Qwantity is able to dasimal");
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Two digits after decimal point allowed.",
        }));
        return;
      }
    }

    // if (!value) {
    //   setValidationErrors((prevErrors) => ({
    //     ...prevErrors,
    //     [field]: "Field is required.",
    //   }));
    //   return;
    // }

    // setValidationErrors((prevErrors) => ({
    //   ...prevErrors,
    //   [field]: "", // Clear the error message
    // }));
  };
  // const handleSaveCell = (id, field, value) => {
  //   setData((prevData) =>
  //     prevData.map((item) =>
  //       item.KutchaCatalogId === id ? { ...item, [field]: value } : item
  //     )
  //   );
  // };

  // Extract property names from the first data object
  const propertyNames = [
    "LotNo",
    "invoiceNo",
    "teaTypeName",
    "subTeaTypeName",
    "categoryName",
    "markName",
    "gradeName",
    "marketTypeName",
    "packageType",
    "packageNo",
    "totalPackages",
    "SampleQty",
    "grossKgs",
    "tareKgs",
    "netKgs",
    "invoiceWeight",
    "shortExcessWeight",
    "manufactureFromDate",
    "manufactureToDate",
    "gpNo",
    "gpDate",
    "basePrice",
    "reservePrice",
    "auctioneerValuation",
    "markPackageComments",
    "lotComments",
    "qualityComments",
    "qualityCertification",
    "priceIncrement",
    "brewColor",
    "ageOfProducts",
    "brewersComments",
    "gardenCertification",
    "wareHouseUserRegId",
    "wareHouseName",
    "locationInsideWarehouse",
    "remarks",
    "lastModifiedBy",
    "marketTypeName",
    "SystemBasePrice",
    "factoryId",
    "lastModifiedBy",
  ];
  const nonEditableColumns = [
    "KutchaCatalogId",
    "LotNo",
    "invoiceId",
    "invoiceNo",
    "teaTypeId",
    "subTeaTypeId",
    "subTeaTypeName",
    "categoryId",
    "categoryName",
    "markId",
    "markName",
    "tareKgs",
    "netKgs",
    "invoiceWeight",
    "shortExcessWeight",
    "manufactureFromDate",
    "manufactureToDate",
    "gpNo",
    "gpDate",
    "gradeId",
    "gradeName",
    "marketTypeId",
    "marketTypeName",
    "sessionTypeId",
    "sessionTypeName",
    "packageType",
    "packageNo",
    "totalPackages",
    "teaTypeName",
  ]; // Add column names that are not editable

  useEffect(() => {
    dispatch(fetchMarkTypeRequest());
    // dispatch(fetchWarehouseUserRequest());

    //     dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
  }, []);

  const markType = useSelector((state) => state.mark.markTypeData.responseData);

  return (
    <div>
      <table className="table table-responsive">
        <thead>
          <tr>
            <th></th>
            {/* {propertyNames?.map((propertyName) => (
              <th key={propertyName}>{propertyName}</th>
            ))} */}
            <th>Lot Number</th>
            <th>Invoice Number </th>
            <th>Tea Type </th>
            <th>Subtea Type</th>
            <th>Category</th>
            <th>Mark</th>
            <th>Grade</th>
            <th>Market Type</th>
            <th>Package Type</th>
            <th>Package Number</th>
            <th>Total Packages</th>
            <th>Sample Quantity</th>
            <th>Gross Kilograms</th>
            <th>Tare Kilograms</th>
            <th>Net Kilograms</th>
            <th>Invoice Weight</th>
            <th>Short/Excess Weight</th>
            <th>Manufacture Date From</th>
            <th>Manufacture Date To</th>
            <th>GP Number</th>
            <th>GP Date</th>
            <th>Base Price</th>
            <th>Reserve Price</th>
            <th>Auctioneer Valuation</th>
            <th>Mark Package Comments</th>
            <th>Lot Comments</th>
            <th>Quality Comments</th>
            <th>Quality Certification</th>
            <th>Price Increment</th>
            <th>Brew Color</th>
            <th>Age of Products</th>
            <th>Brewer's Comments</th>
            <th>Garden Certification</th>
            <th>Warehouse User Registration ID</th>
            <th>Warehouse</th>
            <th>Location Inside Warehouse</th>
            <th>Remarks</th>
            <th>Last Modified By</th>
            <th>Market Type Duplicate</th>
            <th>System Base Price</th>
            <th>Factory ID</th>
            <th>Last Modified Date By</th>
          </tr>
        </thead>
        <tbody>
          {rows?.length > 0 ? (
            data?.map((item) => (
              <tr key={item.KutchaCatalogId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedData.some(
                      (selectedItem) =>
                        selectedItem.KutchaCatalogId === item.KutchaCatalogId
                    )}
                    onChange={() => {
                      setChecked(!checked);

                      handleCheckboxChange(item.KutchaCatalogId);
                    }}
                  />
                </td>
                {propertyNames.map((propertyName) => (
                  <td key={`${item.KutchaCatalogId}-${propertyName}`}>
                    {nonEditableColumns.includes(propertyName) ? (
                      item[propertyName]
                    ) : propertyName === "gpDate" &&
                      selectedData.some(
                        (obj) => obj.KutchaCatalogId === item.KutchaCatalogId
                      ) ? (
                      editing ? (
                        <input
                          type="date"
                          value={item[propertyName]}
                          onChange={(e) =>
                            handleSaveCell(
                              item.KutchaCatalogId,
                              propertyName,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        item[propertyName]
                      )
                    ) : editing &&
                      propertyName === "MarketType" &&
                      selectedData.some(
                        (obj) => obj.KutchaCatalogId === item.KutchaCatalogId
                      ) ? (
                      <select
                        value={item[propertyName]}
                        onChange={(e) =>
                          handleSaveCell(
                            item.KutchaCatalogId,
                            propertyName,
                            e.target.value
                          )
                        }
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
                      </select>
                    ) : editing &&
                      propertyName === "subTeaTypeId" &&
                      selectedData.some(
                        (obj) => obj.KutchaCatalogId === item.KutchaCatalogId
                      ) ? (
                      <select
                        value={item[propertyName]}
                        onChange={(e) =>
                          handleSaveCell(
                            item.KutchaCatalogId,
                            propertyName,
                            e.target.value
                          )
                        }
                      >
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                      </select>
                    ) : editing &&
                      selectedData.some(
                        (obj) => obj.KutchaCatalogId === item.KutchaCatalogId
                      ) ? (
                      <>
                        <input
                          type="text"
                          value={item[propertyName]}
                          onChange={(e) =>
                            handleSaveCell(
                              item.KutchaCatalogId,
                              propertyName,
                              e.target.value
                            )
                          }
                        />
                        {validationErrors[propertyName] && (
                          <div className="ValidationError">
                            {validationErrors[propertyName]}
                          </div>
                        )}
                      </>
                    ) : propertyName === "SystemBasePrice" ? (
                      10
                    ) : (
                      item[propertyName]
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={53}>
                <div className="NoData">No Data</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="row">
        <div className="col-12">
          <div className="BtnGroup">
            {data?.length > 0 ? (
              <button className="SubmitBtn" onClick={handleDeleteSelected}>
                Delete Selected
              </button>
            ) : (
              ""
            )}

            {rows?.length > 0 ? (
              editing && selectedData.length > 0 ? (
                <button
                  onClick={() => {
                    handleEditToggle();

                    const updatedData = selectedData.map((ele) => {
                      let data = {
                        KutchaCatalogId: ele.KutchaCatalogId,
                        SampleQty: parseFloat(ele.SampleQty),
                        basePrice: parseFloat(ele.basePrice),
                        reservePrice: parseFloat(ele.reservePrice),
                        auctioneerValuation: parseFloat(
                          ele.auctioneerValuation
                        ),
                        priceIncrement: parseFloat(ele.priceIncrement),
                        markPackageComments: ele.markPackageComments,
                        lotComments: ele.lotComments,
                        qualityComments: ele.qualityComments,
                        qualityCertification: ele.qualityCertification,
                        brewColor: ele.brewColor,
                        ageOfProducts: parseFloat(ele.ageOfProducts),
                        brewersComments: ele.brewersComments,
                        gardenCertification: ele.gardenCertification,
                        locationInsideWarehouse: ele.locationInsideWarehouse,
                        remarks: ele.remarks,
                        SystemBasePrice: parseFloat(ele.SystemBasePrice),
                        updatedBy: 10056,
                      };
                      return data;
                    });
                    console.log(
                      // updatedData.some((ele) => isNaN(ele.SampleQty)),
                      // updatedData.map((ele) =>
                      //   isNaN(ele.SampleQty)
                      //     ? toast.warning("Please Enter sample qty")
                      //     : ""
                      // ),
                      updatedData.map((ele) => isNaN(ele.SampleQty)),
                      "updatedDataupdatedData"
                    );
                    if (updatedData.some((ele) => isNaN(ele.SampleQty))) {
                      toast.warning("Please Enter sample qty");
                    } else {
                      axiosMain
                        .post(
                          "/preauction/KutchaCatalogue/UpdateKutchaCatalogueDetails",
                          updatedData
                        )
                        .then((res) => toast.success(res.data.message))
                        .catch((error) => toast.error(error.data.message));
                    }

                    // console.log(data, updatedData, "datadata");
                  }}
                >
                  Save Changes
                </button>
              ) : (
                <button className="SubmitBtn" onClick={handleEditToggle}>
                  Edit
                </button>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KutchaTable;
