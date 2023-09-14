import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "../../assets/css/uploadDocumentAdmin.css";
import $ from "jquery";

const UploadMultipleDocuments = ({
  onFileSelect,
  inputId,
  uploadedFiles,
  setUploadedFiles,
  uploadDocumentError,
}) => {
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const newFiles = [];

    for (const file of files) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
      } else if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10 MB.");
      } else {
        const base64Content = await fileToBase64(file);
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        newFiles.push({
          documentContent: base64Content,
          documentName: file.name,
          documentSize: fileSizeInMB + " " + "MB",
        });
      }
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onFileSelect([...uploadedFiles, ...newFiles]);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Content = reader.result.split(",")[1]; // Remove the data URI prefix
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
    onFileSelect(uploadedFiles.filter((file, idx) => idx !== index));
    $(`${inputId}`).replaceWith($(`${inputId}`).val("").clone(true));
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
    onFileSelect([]);
  };

  return (
    <>
      <Card className="mt-3 FileUploadBox">
        <Card.Body>
          <Card.Title>File Upload</Card.Title>
          <div className="FileUpload">
            <div className="FormGroup">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf"
                id={inputId}
              />
              <div>
                <button
                  onClick={() => {
                    removeAllFiles();
                  }}
                >
                  Remove All
                </button>
              </div>
            </div>
          </div>
          {uploadDocumentError && (
            <p className="errorLabel">{uploadDocumentError}</p>
          )}

          {/* Render file type icons based on uploaded files */}
        </Card.Body>

        <div className="row px-3 mb-2">
          {uploadedFiles?.map((file, index) => (
            <div className="col-md-auto">
              <div className="UploadedFile" key={index}>
                <div>
                  {/* {renderFileTypeIcon(file)} */}
                  <span>{file.documentName}</span>
                </div>
                <i
                  className="fa fa-times"
                  onClick={() => removeFile(index)}
                ></i>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default UploadMultipleDocuments;
