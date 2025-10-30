export interface Resource {
  category: string;
  name: string;
  tags?: Array<string>;
  description?: string;
  eligibility?: string;
  latLng?: [number, number];
  lat?: number;
  lng?: number;
  address?: string;
  hoursOfOperation?: string;
  phone?: string;
  website?: string;
  email?: string;
  socialMedia?: Array<string>;
  donations?: string;
  donationItems?: Array<string>;
  directFunding?: Array<string>;
  lastUpdated?: Date;
  startDate?: Date;
  endDate?: Date;
  distanceMi?: number;
  [key: string]: any;
}

// Helper derived type if you later want parsed numbers
export interface ResourceWithCoords extends Resource {
  latNumber?: number;
  lngNumber?: number;
  
}