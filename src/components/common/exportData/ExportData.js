import React from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

const ExportData = ({ data, exportType }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Define columns for the table
    const columns = Object.keys(data[0]);

    // Define rows for the table
    const rows = data.map((row) => Object.values(row));

    // Add the table to the PDF
    doc.autoTable({
      head: [columns],
      body: rows,
    });

    // Add other content if needed
    doc.text(10, 10, "PDF Export Content");

    // Save the PDF
    doc.save("exported.pdf");
  };

  const columns = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
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
      name: "packageNo",
      title: "No Of Packages",
    },
    // {
    //   name: "noofpackage",
    //   title: "No Of Packages",
    // },

    {
      name: "netKgs",
      title: "Net Weight",
    },
    {
      name: "totalSampleQty",
      title: "Total Sample Qty",
    },
    {
      name: "totalShortQty",
      title: "Total Short Qty",
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

  const exportToHTML = () => {
    // Create an HTML table from the data and columns
    const tableHTML = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Data Exported to HTML Table</h1>
          <tabl>
            <thead>
              <tr>
                ${columns.map((column) => `<th>${column.title}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${columns
                    .map((column) => `<td>${row[column.name]}</td>`)
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Create a Blob from the HTML table
    const blob = new Blob([tableHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "exported.html";

    // Trigger a click event to download the file
    link.click();
  };

  return (
    <div>
      {exportType === "excel" && (
        <button onClick={exportToExcel}>Export to Excel</button>
      )}
      {exportType === "pdf" && (
        <button onClick={exportToPDF}>Export to PDF</button>
      )}
      {exportType === "html" && (
        <button onClick={exportToHTML}>Export to HTML</button>
      )}
      {exportType === "all" && (
        <div className="row">
          <div className="col-md-4">
            <button onClick={exportToExcel}>Export to Excel</button>

            <button onClick={exportToPDF}>Export to PDF</button>

            <button onClick={exportToHTML}>Export to HTML</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData;
