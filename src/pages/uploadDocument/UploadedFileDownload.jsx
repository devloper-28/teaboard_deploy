export function uploadedFileDownload(base64Data, fileName) {
  const linkSource = ` data:application/pdf;base64 ,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
