import React, { useEffect, useState } from "react";
import Modal from "../../../../components/common/Modal";
import CommonTable from "../../../../components/tableComponent/CommonTable";
import { Button, Card, Form, FormControl, InputGroup } from "react-bootstrap";
import Accordion from "@mui/material/Accordion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AuctionCard from "../maintanance/Maintananse";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  fetchSaleProgramDetailsRequest,
  fetchSaleProgramListRequest,
  getSaleNoRequest,
} from "../../../../store/actions";
import NoData from "../../../../components/nodata/NoData";
import { FileUpload, SettingsCellOutlined } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import axiosMain from "../../../../http/axios/axios_main";
import DownloadFile from "../../../../components/common/download/DownloadFile";
import ConfirmationModalWithExcel from "../../../../components/common/ConfirmationModalWithExcel";

const currentDate = new Date().toISOString()?.split("T")[0];

const getMinDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split("T")[0];
};

function SaleModal() {
  const dispatch = useDispatch();
  const saleProgramList = useSelector(
    (state) => state.sale.saleProgramList.responseData
  );
  const [saleNumber, setSaleNumber] = useState([]);

  //form hooks

  const [selectedSaleProgram, setSelectedSaleProgram] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [numRows, setNumRows] = useState(1); // State to track the number of rows
  const [saleDate, setSaleDate] = useState("");
  const [rows, setRows] = useState(saleProgramList);
  const [totalCount, setTotalCount] = useState(0);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [selectedSaleNo, setSelectedSaleNo] = useState(1);
  const [closingDate, setClosingDate] = useState(
    getMinDate() ? getMinDate() : ""
  );
  const [publishingDate, setPublishingDate] = useState(getMinDate());
  const [openDelete, setOpenDelete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [year, setYears] = useState(currentDate?.split("-")[0]);
  const [sellsNo, setSellNo] = useState(0);
  const [selectedSalePrograms, setSelectedSalePrograms] = useState([]);
  const [saleProgramDetailList, setSaleProgramDetailList] = useState([]);

  const salesNo = useSelector(
    (state) => state?.auction?.saleNumber?.responseData
  );

  useEffect(() => {
    setRows(saleProgramList);
  }, [saleProgramList]);
  useEffect(() => {
    dispatch(fetchSaleProgramListRequest({ season, pageNumber, pageSize }));
    dispatch(getSaleNoRequest());
  }, []);

  useEffect(() => {
    axiosMain
      .post(`/preauction/Common/BindAllSaleNoBySeason?season=${season}`)
      .then((res) => setSaleNumber(res.data.responseData))
      .catch((err) => toast.error(err));
  }, [salesNo]);

  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [expanded, setExpanded] = useState("panel1");

  const [originalRows, setOriginalRows] = useState([]);

  const resateForm = () => {
    setYears(currentDate?.split("-")[0]);
    setNumRows(1);
    setSelectedSaleNo(1);
    setSaleDate(currentDate);
    setPublishingDate(currentDate);
    setClosingDate(currentDate);
    setUploadedFiles([]);
    setIsDisabled(false);
    setSelectedSaleProgram([]);
    setSelectedSalePrograms([]);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setIsDisabled(false);
    setIsEdit(false);
    setSelectedSaleProgram([]);
    setSelectedSalePrograms([]);
    setSaleProgramDetailList([]);
    setYears(currentDate?.split("-")[0]);
    setNumRows(1);
    setSelectedSaleNo(1);
    setSaleDate(currentDate);
    setPublishingDate(currentDate);
    setClosingDate(currentDate);
    setUploadedFiles([]);
    setIsDisabled(false);
  };
  const handleYearChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: parseInt(value), // Convert the value to an integer
    }));
  };
  const season = new Date().getFullYear().toString();
  const saleNo = "";
  const pageNumber = 1;
  const pageSize = 200;

  // Dispatch the action on component mount

  const handleRefresh = () => {
    dispatch(fetchSaleProgramListRequest({ season, pageNumber, pageSize }));
  };

  useEffect(() => {
    setRows(searchData);
  }, [searchData]);

  // console.log(saleProgramList, "POLO");
  const data = [
    { id: 1, name: "John", age: 25 },
    { id: 2, name: "Jane", age: 30 },
    { id: 3, name: "Alice", age: 28 },
  ];

  const columns = ["ID", "Name", "Age"];

  const handleDelete = (row) => {
    // Delete the row from the data array
    console.log("Deleting row:", row);
  };
  const [formData, setFormData] = useState({
    age1: "",
    age2: "",
    age3: "",
    age4: "",
    age5: "",
    age6: "",
    age7: "",
    age8: "",
    age9: "",
    age10: "",
    age11: "",
    age12: "",
    age13: "",
    age14: "",
    age15: "",
  });

  function getSaleProgramById(SaleProgramIds) {
    axiosMain
      .post(
        `/preauction/SaleProgram/GetSaleProgramById`,
        SaleProgramIds.toString()
      )
      .then((response) => {
        if (response.status === 200) {
          const saleProgram = response.data;
          const { SaleProgramId, documentDetails } =
            saleProgram.responseData?.at(0); // Assuming the response contains the SaleProgram data
          console.log("Sale Program:", saleProgram.responseData);

          let data = {
            SaleProgramId: SaleProgramId,
            updatedBy: 1,
            createdBy: 1,
            documentList: documentDetails,
          };
          setActionData({ ...actionData, delete: data });
        } else {
          toast.error("API call failed.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        toast.error("An error occurred.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }
  const handleDownload = (documentName, documentBytes) => {
    // Decode base64 encoded documentBytes
    const decodedBytes = atob(documentBytes);

    // Create a Blob from the decoded bytes
    const blob = new Blob([
      new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))),
    ]);

    // Create an object URL from the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Create a hidden anchor element
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = blobUrl;
    anchor.download = documentName;

    // Append anchor to the body
    document.body.appendChild(anchor);

    // Programmatically click the anchor element
    anchor.click();

    // Clean up: remove the anchor and revoke the object URL
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  };
  function downloaDocumentById(SaleProgramIds) {
    axiosMain
      .post(
        `/preauction/SaleProgram/GetSaleProgramById`,
        SaleProgramIds.toString()
      )
      .then((response) => {
        if (response.status === 200) {
          const saleProgram = response.data;
          const { SaleProgramId, documentDetails } =
            saleProgram.responseData?.at(0); // Assuming the response contains the SaleProgram data
          console.log("Sale Program:", saleProgram.responseData);
          documentDetails?.map((ele) =>
            handleDownload(ele.documentName, ele.documentBytes)
          );
        } else {
          toast.error("API call failed.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        toast.error("An error occurred.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }

  const handleSearch = () => {
    // Filter the originalRows data based on the selected values in the form

    const data = {
      season: year,
      saleNo: parseInt(sellsNo),
      pageNumber: 1,
      pageSize: 1000,
    };

    try {
      axiosMain
        .post("/preauction/SaleProgram/GetSaleProgramList", data)
        .then((response) => setSearchData(response.data.responseData));
    } catch (error) {
      console.error("Error calling POST API:", error);
    }

    console.log(data, "😘");

    // Update the rows state with the filtered data
    // setRows(filteredRows);
  };

  const ActionArea = (row) => {
    function handleAction(action) {
      setExpanded("panel2");

      switch (action) {
        // case "view": {
        //   return dispatch(
        //     fetchSaleProgramDetailsRequest(row.data.saleProgramDetailId)
        //   );
        // }
        case "view": {
          const saleProgramDetail = row.data;
          setSelectedSaleProgram(saleProgramDetail);
          setIsDisabled(true);
          dispatch(
            fetchSaleProgramDetailsRequest(saleProgramDetail.SaleProgramId)
          );
          break;
        }
        case "edit": {
          const saleProgramDetail = row.data;
          setSelectedSaleProgram(saleProgramDetail);
          setIsDisabled(false);
          setIsEdit(true);
          dispatch(
            fetchSaleProgramDetailsRequest(saleProgramDetail.SaleProgramId)
          );
        }
        default:
          return "no data";
      }
    }

    if (!saleProgramList || !saleNumber) {
      return (
        <div>
          <NoData />
        </div>
      ); // Show a message when no data is available
    }
    return (
      <>
        <div className="ActionBtn">
          <span onClick={() => handleAction("view")}>
            <VisibilityIcon />
          </span>
          <span onClick={() => handleAction("edit")}>
            <EditIcon />
          </span>
          {row.data.status === 3 ? (
            ""
          ) : (
            <span
              onClick={() => {
                setOpenDelete(true);
                // setActionData({ ...actionData, edit: row.data });
                getSaleProgramById(row.data.SaleProgramId);
              }}
            >
              <DeleteIcon />
            </span>
          )}

          <span
            onClick={() => {
              downloaDocumentById(row.data.SaleProgramId);
            }}
          >
            <i className="fa fa-download"></i>
          </span>
        </div>
      </>
    );
  };
  const sellPrograms = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <InvoiceCheckBox data={row} />,
    // },

    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <InvoiceCheckBox data={row} />,
    // },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    {
      name: "saleDate",
      title: "Sale Date",
      getCellValue: ({ ...row }) => {
        return new Date(row.saleDate).toLocaleDateString("en-GB");
      },
    },
    {
      name: "buyersPromptDate",
      title: "Buyer Prompt Date",
      getCellValue: ({ ...row }) => {
        return new Date(row.buyersPromptDate).toLocaleDateString("en-GB");
      },
    },
    {
      name: "sellersPromptDate",
      title: "Seller Prompt Date",
      getCellValue: ({ ...row }) => {
        return new Date(row.sellersPromptDate).toLocaleDateString("en-GB");
      },
    },
    {
      name: "status",
      title: "Status",
      getCellValue: ({ status }) => {
        switch (status) {
          case 0: {
            return "Pending";
          }
          case 1: {
            return "Active";
          }
          case 2: {
            return "Completed";
          }
          case 3: {
            return "Cancelled";
          }
          default:
            return "-";
        }
      },
    },
    // {
    //   name: "mark",
    //   title: "Mark",
    // },
    // {
    //   name: "warehouseName",
    //   title: "Warehouse Name",
    // },
    // {
    //   name: "grade",
    //   title: "Grade",
    // },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

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
  return (
    <div>
      <ConfirmationModalWithExcel
        show={openDelete}
        remarkShow={true}
        setRemark={(data) =>
          setActionData({
            ...actionData,
            remarks: data,
          })
        }
        onDelete={(e, datas) => {
          //e setRows([
          //   ...rows?.filter(
          //     (ele) => ele.invoiceNo !== actionData.edit.invoiceNo
          //   ),
          // ]);
          e.preventDefault();

          const data = {
            SaleProgramId: actionData.delete.SaleProgramId,
            updatedBy: 1,
            remarks: actionData.remarks,
            createdBy: 1,
            documentList: datas,
          };

          console.log(actionData, "actionData.edit");
          let docBrif = datas.filter((ele) => ele.documentBrief === "");

          if (actionData.remarks !== undefined && actionData.remarks !== "") {
            console.log(data);

            axiosMain
              .post("/preauction/SaleProgram/CancelSaleProgram", data)
              .then((response) => {
                if (response.data.statusCode === 200) {
                  toast.success(response.data.message);
                } else {
                  toast.warning(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
              })
              .catch((error) => {
                toast.error("An error occurred.", {
                  position: toast.POSITION.TOP_RIGHT,
                });
              });
            setUploadedFiles([]);
            setOpenDelete(false);
          } else {
            toast.error("remark is require");
          }

          // axios
          //   .post(
          //     "https://teaboard.procuretiger.com/TEABOARD/preauction/SaleProgram/CancelSaleProgram",
          //     actionData.edit
          //   )
          //   .then((response) => {
          //     if (response.data.status === 200) {
          //       toast.success("API call successful!");
          //     } else {
          //       toast.error("API call failed.", {
          //         position: toast.POSITION.TOP_RIGHT,
          //       });
          //     }
          //   })
          //   .catch((error) => {
          //     toast.error("An error occurred.", {
          //       position: toast.POSITION.TOP_RIGHT,
          //     });
          //   });
        }}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        onHide={() => setOpenDelete(false)}
      />
      <Accordion
        expanded={expanded === "panel1"}
        className={`${expanded === "panel1" ? "active" : ""}`}
        onChange={handleChange("panel1")}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>List</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="row align-items-end">
            <div className="col-lg-1 col-xxl-2">
              <label>Select Season</label>
              <InputGroup>
                <FormControl
                  as="select"
                  name="age1"
                  value={year}
                  onChange={(e) => setYears(e.target.value)}
                >
                  {generateYearOptions()}
                </FormControl>
              </InputGroup>
            </div>
            <div className="col-lg-2">
              <label>Select Sale No.</label>
              <InputGroup>
                <FormControl
                  as="select"
                  name="age2"
                  value={sellsNo}
                  onChange={(e) => setSellNo(e.target.value)}
                >
                  <option value={0}>All</option>
                  {saleNumber?.length > 0
                    ? saleNumber?.map((e) => (
                        <option key={e.SaleNoId} value={e.saleNo}>
                          {e.saleNo}
                        </option>
                      ))
                    : 0}
                </FormControl>
              </InputGroup>
            </div>
            <div className="col-lg-auto">
              <div className="BtnGroup">
                <Button className="SubmitBtn" onClick={handleSearch}>
                  Search
                </Button>
                &nbsp;
                <Button className="SubmitBtn" onClick={() => handleRefresh()}>
                  <i className="fa fa-refresh"></i>
                </Button>
                <Button
                  className="SubmitBtn"
                  onClick={() => {
                    setYears(currentDate?.split("-")[0]);
                    setSellNo(0);
                    const data = {
                      season: new Date().getFullYear().toString(),
                      saleNo: 0,
                      pageNumber: 1,
                      pageSize: 1000,
                    };

                    try {
                      axiosMain
                        .post(
                          "/preauction/SaleProgram/GetSaleProgramList",
                          data
                        )
                        .then((response) =>
                          setSearchData(response.data.responseData)
                        );
                    } catch (error) {
                      console.error("Error calling POST API:", error);
                    }
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
          <div
            id="invoiceTable"
            className="mt-2"
            style={{ height: "300px", overflow: "scroll " }}
          >
            {(rows?.length <= 0 && rows == []) || undefined || null ? (
              "No data"
            ) : (
              <TableComponent
                columns={sellPrograms}
                rows={rows?.length > 0 ? rows : []}
                //setRows={setRows}
                addpagination={true}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              />
            )}
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
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={`${expanded === "panel2" ? "active" : ""}`}
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Maintenance</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AuctionCard
            resateForm={resateForm}
            currentDate={currentDate}
            rows={saleProgramList}
            saleDates={saleDate}
            setSaleDates={setSaleDate}
            formData={formData}
            year={year}
            saleNumber={saleNumber}
            setSelectedSaleProgram={setSelectedSaleProgram}
            handleYearChange={handleYearChange}
            generateYearOptions={generateYearOptions}
            actionData={actionData}
            selectedSaleProgram={selectedSaleProgram}
            isDisabled={isDisabled}
            isEdit={isEdit}
            setYears={setYears}
            setSelectedSalePrograms={setSelectedSalePrograms}
            selectedSalePrograms={selectedSalePrograms}
            saleProgramDetailList={saleProgramDetailList}
            setSaleProgramDetailList={setSaleProgramDetailList}
            selectedSaleNo={selectedSaleNo}
            setSelectedSaleNo={setSelectedSaleNo}
            publishingDate={publishingDate}
            setPublishingDate={setPublishingDate}
            closingDate={isEdit === true ? closingDate : closingDate}
            setClosingDate={setClosingDate}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            numRows={numRows}
            setNumRows={setNumRows}
            handleChange={handleChange}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default SaleModal;
