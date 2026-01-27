import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data: any[], filename = "data.xlsx") => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write workbook to a binary string
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Save the Excel file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, filename);
};
