/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'guest' | 'personal' | 'business' | 'insurance' | 'workshop' | 'logistics' | 'government' | 'police';

export interface Vehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number;
  mileage: number;
  engine: string;
  transmission: string;
  driveType: string;
  location: string;
  extColor: string;
  intColor: string;
  images: string[];
  certified: boolean;
  status: 'Available' | 'Reserved' | 'Sold' | 'Pending Inspection' | 'Customs Pending';
  riskScore: 'Low' | 'Medium' | 'High';
  valuation: number;
  marketPrice: number;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
  isDamagedCategory?: boolean;
  damageSeverity?: 'Minor' | 'Moderate' | 'Severe' | 'Critical' | 'Salvage';
  damageDetails?: string;
  requiredRepairs?: string[];
  description?: string;
  descriptions?: Record<'EN' | 'ES' | 'DE' | 'AR' | 'UR' | 'ZH', string>;
}

export interface Part {
  sku: string;
  name: string;
  vehicleCompat: string;
  condition: string;
  price: number;
  stock: number;
  image: string;
  interchangeId: string;
  category?: string;
}

export interface Lead {
  id: string;
  name: string;
  initials: string;
  inquiry: string;
  status: 'Qualified' | 'Closing' | 'New Lead';
  time: string;
}

export interface Appointment {
  time: string;
  instructor?: string;
  student?: string;
  status: 'Confirmed' | 'In Progress' | 'Pending' | 'Ready for Test';
  activity: string;
  initials?: string;
}

export interface AdvisoryExpert {
  id: string;
  name: string;
  title: string;
  firm: string;
  rating: number;
  specialties: string[];
  bio: string;
  image: string;
}
