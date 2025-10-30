import { Resource } from "~/types/resource";

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
  'Donation Items': 'donationItems',
  'Last Updated': 'lastUpdated',
  'Start Date': 'startDate',
  'End Date': 'endDate',
};

export default defineEventHandler(async (event) => {
  const data = await getSheet();
  const rows = data.values;
  const resources: Resource[] = [];

  if (rows) {
    const columns = rows.shift(); // Remove header row

    if (columns) {
      for (const row of rows) {
        const resource: Resource = {} as Resource;

        columns.forEach((col, index) => {
          const camelKey = columnMap[col] || col;
          const value = row[index];
          
          // Convert values based on Resource type requirements
          if (camelKey === 'lat' || camelKey === 'lng') {
            resource[camelKey] = value ? parseFloat(value) : undefined;
          }
          else if (camelKey === 'latLng') {
            resource[camelKey] = value
              ? value.split(',').map(coord => parseFloat(coord.trim())) as [number, number]
              : undefined;
          } else if (camelKey === 'tags' || camelKey === 'donationItems' || camelKey === 'socialMedia') {
            resource[camelKey] = value ? value.split(',').map(item => item.trim()) : [];
          } else if (camelKey === 'lastUpdated' || camelKey === 'startDate' || camelKey === 'endDate') {
            resource[camelKey] = value ? new Date(value) : undefined;
          } else {
            resource[camelKey] = value || undefined;
          }
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