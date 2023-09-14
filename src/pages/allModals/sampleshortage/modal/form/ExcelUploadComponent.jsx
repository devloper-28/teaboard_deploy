import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableComponent from "../../../../../components/tableComponent/TableComponent";
import axiosMain from "../../../../../http/axios/axios_main";
import MenualForm from "./MenualForm";

function ExcelUploadComponent({ isDisable, isEdit }) {
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [viewData, setViewData] = useState([]);

  const fileInputRef = useRef(null);

  const isValid = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet in the Excel file contains data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet data into a JSON object
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData, "jsonDatajsonData");

        // Check for mandatory columns and blank cells
        const mandatoryColumns = [
          "InspectionChgs",
          "LOTNO",
          "PACKAGENO",
          "ReInspectionChgs",
          "SAMPLEWT",
          "SHORTWT",
        ];
        let isValidData = true;

        jsonData.forEach((row, rowIndex) => {
          for (const column of mandatoryColumns) {
            if (!row[column] === "") {
              toast.error(`Row ${rowIndex + 2}: ${column} is missing data`);
              isValidData = false;
              fileInputRef.current.value = "";
            }
          }
        });
        let fileData = jsonData.map((ele) => {
          let data = {
            LotNo: ele.LOTNO?.toString(),
            packageNo: ele.PACKAGENO?.toString(),
            createdBy: 1,
          };
          return data;
        });

        axiosMain
          .post("/preauction/SampleShortage/CheckPackageNoByLotNo", fileData)
          .then((res) => {
            if (res.data.statusCode === 200) {
              toast.success(res.data.message);
              isValidData = true;
            } else {
              toast.error(res.data.message);
              isValidData = false;
            }
          });
        return isValidData;
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error("Please select one or more files to upload");
      return;
    }
    fileInputRef.current.value = "";

    // console.log(rows, "rowrowrow");
    let data = rows.map((ele) => {
      let results = {
        LotNo: ele.LOTNO?.toString(),
        packageNo: ele.PACKAGENO?.toString(),
        sampleWeight: parseFloat(ele.SAMPLEWT),
        shortWeight: parseFloat(ele.SHORTWT),
        inspectionCharges: parseFloat(ele.InspectionChgs),
        reInspectionCharges: parseFloat(ele.ReInspectionChgs),
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
      };

      return results;
    });

    axiosMain
      .post("/preauction/SampleShortage/UploadSampleShortage", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.message);
          setRows([]);
        } else {
          toast.error(res.data.message);
        }
      });
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((selectedFile) => {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error(
          `The file ${selectedFile.name} size should not exceed 10MB`
        );
        return;
      }

      const fileNameParts = selectedFile.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (fileExtension !== "xls" && fileExtension !== "xlsx") {
        toast.error(`Only Excel files are allowed for ${selectedFile.name}`);
        return;
      }

      // Your validation logic for predefined format here

      // If validation fails, display the error message
      if (!isValid(selectedFile)) {
        toast.error(`Validation is unsuccessful for ${selectedFile.name}`);
        return;
      }

      processFile(selectedFile);
      toast.success(`File ${selectedFile.name} uploaded successfully`);
    });

    setFiles(selectedFiles);
    // handleSubmit();
  };

  const processFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet in the Excel file contains data
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet data into a JSON object
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Check for mandatory columns and blank cells
      // jsonData.forEach((row, rowIndex) => {
      //   if (!row["MandatoryColumn1"] || !row["MandatoryColumn2"]) {
      //     toast.error(
      //       `Row ${rowIndex + 2}: Mandatory columns are missing data`
      //     );
      //   }
      // });

      // Process jsonData further or save it as needed
      console.log("JSON Data:", jsonData);
      setRows([...rows, ...jsonData]);
    };

    reader.readAsArrayBuffer(file);
  };

  const sampleshortage = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },

    {
      name: "LOTNO",
      title: "Lot No",
    },
    {
      name: "PACKAGENO",
      title: "Package No",
    },
    {
      name: "InspectionChgs",
      title: "InspectionChages",
    },
    {
      name: "ReInspectionChgs",
      title: "Mark",
    },
    {
      name: "SAMPLEWT",
      title: "Grade",
    },
    {
      name: "SHORTWT",
      title: "Category",
    },

    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
  ];

  const createMenually = () => {
    let data = rows.map((ele) => {
      let rowData = {
        LotNo: ele.LOTNO?.toString(),
        packageNo: ele.PACKAGENO?.toString(),
        createdBy: 1,
      };
      return rowData;
    });

    axiosMain
      .post("/preauction/SampleShortage/CheckPackageNoByLotNo", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          // toast.success(res.data.message);

          let data = rows.map((ele) => {
            let results = {
              LotNo: ele.LOTNO?.toString(),
              packageNo: ele.PACKAGENO?.toString(),
              sampleWeight: parseFloat(ele.SAMPLEWT),
              shortWeight: parseFloat(ele.SHORTWT),
              inspectionCharges: parseFloat(ele.InspectionChgs),
              reInspectionCharges: parseFloat(ele.ReInspectionChgs),
              isActive: true,
              createdBy: 1,
              updatedBy: 1,
            };

            return results;
          });
          axiosMain
            .post("/preauction/SampleShortage/UploadSampleShortage", data)
            .then((res) => {
              if (res.data.statusCode === 200) {
                toast.success(res.data.message);
              } else {
                toast.error(res.data.message);
              }
            });
        } else {
          toast.error(res.data.massage);
        }
      });

    console.log(rows, "rowsrows");
  };

  return (
    <div>
      <MenualForm
        rows={rows}
        setRows={setRows}
        handleSubmit={createMenually}
        viewData={viewData}
        isDisable={isDisable}
        isEdit={isEdit}
      />

      {isDisable || isEdit ? (
        ""
      ) : (
        <>
          <input
            type="file"
            accept=".xls,.xlsx"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <button onClick={handleSubmit}>Upload</button>

          <div id="invoiceTable">
            <TableComponent
              columns={sampleshortage}
              rows={rows}
              setRows={setRows}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
              selectionCol={true}
              sorting={true}
            />
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default ExcelUploadComponent;
