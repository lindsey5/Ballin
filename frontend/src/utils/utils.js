import * as XLSX from "xlsx";

export function formatToPeso(number){
  const formatted =  number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `₱${formatted}`
}

export const formatTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const exportData = ({ dataToExport, filename, sheetname,}) => {
  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetname);

  XLSX.writeFile(workbook, filename);
}