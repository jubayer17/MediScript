// Convert from YYYY-MM-DD to DD/MM/YYYY
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Convert from DD/MM/YYYY to YYYY-MM-DD
export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

// Get today's date in YYYY-MM-DD format (for default values)
export const getTodayYYYYMMDD = () => {
  return new Date().toISOString().slice(0, 10);
};

// Get today's date in DD/MM/YYYY format
export const getTodayDDMMYYYY = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};
