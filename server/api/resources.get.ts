interface GoogleSheetsResponse {
  values?: string[][];
}

// Map Google Sheets column names to camelCase
const columnMap: Record<string, string> = {
  'Category': 'category',
  'Name': 'name',
  'Tags': 'tags',
  'Description': 'description',
  'Eligibility': 'eligibility',
  'LatLng': 'latLng',
  'Lat': 'lat',
  'Lng': 'lng',
  'Address': 'address',
  'Hours of Operation': 'hoursOfOperation',
  'Phone': 'phone',
  'Website': 'website',
  'Email': 'email',
  'Social Media': 'socialMedia',
  'Donations': 'donations',
  'Last Updated': 'lastUpdated',
};

export default defineEventHandler(async (event) => {
  const data = await getSheet();
  const rows = data.values;
  const resources = [];

  if (rows) {
    const columns = rows.shift(); // Remove header row

    if (columns) {
      for (const row of rows) {
        const resource: { [key: string]: string } = {};
        columns.forEach((col, index) => {
          const camelKey = columnMap[col] || col;
          resource[camelKey] = row[index] || "";
        });
        resources.push(resource);
      }
    }
  }

  return resources;
})

const getSheet = async (): Promise<GoogleSheetsResponse> => {
  const sheetUrl =
    "https://sheets.googleapis.com/v4/spreadsheets/" +
    process.env.SHEET_ID +
    "/values/" +
    process.env.TAB_NAME +
    "?alt=json&key=" +
    process.env.GDRIVE_API_KEY;
  const data = await $fetch<GoogleSheetsResponse>(sheetUrl);
  return data;
};