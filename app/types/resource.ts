export interface Resource {
  category: string;
  name: string;
  tags?: string;
  description?: string;
  eligibility?: string;
  latLng?: string;
  lat?: string;
  lng?: string;
  address?: string;
  hoursOfOperation?: string;
  phone?: string;
  website?: string;
  email?: string;
  socialMedia?: string;
  donations?: string;
}

// Helper derived type if you later want parsed numbers
export interface ResourceWithCoords extends Resource {
  latNumber?: number;
  lngNumber?: number;
}