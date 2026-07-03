/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle } from '../types';

export interface BackendVehiclePhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface BackendSeller {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface BackendVehicle {
  id: string;
  sellerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  bodyType: string;
  engineSize?: number | null;
  power?: number | null;
  price: number;
  currency: string;
  country: string;
  city: string;
  status: 'ACTIVE' | 'SOLD' | 'RESERVED' | 'FLAGGED' | 'PENDING_INSPECTION' | 'DELETED' | string;
  condition: 'NEW' | 'USED' | 'DAMAGED' | 'SALVAGE' | string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  photos?: BackendVehiclePhoto[];
  seller?: BackendSeller;
}

const STATUS_MAP: Record<string, Vehicle['status']> = {
  ACTIVE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Sold',
  PENDING_INSPECTION: 'Pending Inspection',
  FLAGGED: 'Reserved',
  DELETED: 'Sold',
};

const CONDITION_MAP: Record<string, NonNullable<Vehicle['condition']>> = {
  NEW: 'Excellent',
  USED: 'Good',
  DAMAGED: 'Damaged',
  SALVAGE: 'Damaged',
};

export interface MappedVehicle extends Vehicle {
  __id: string;
  __sellerId: string;
  __seller?: BackendSeller;
  __raw: BackendVehicle;
}

export function mapBackendVehicle(v: BackendVehicle): MappedVehicle {
  const photos = (v.photos || []).slice().sort((a, b) => a.order - b.order);
  const images = photos.length > 0 ? photos.map((p) => p.url) : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'];

  return {
    vin: v.vin,
    year: v.year,
    make: v.make,
    model: v.model,
    trim: v.bodyType || '',
    price: v.price,
    mileage: v.mileage,
    engine: v.engineSize ? `${v.engineSize}L` : '—',
    transmission: v.transmission,
    driveType: v.fuelType,
    location: [v.city, v.country].filter(Boolean).join(', '),
    extColor: v.color,
    intColor: v.color,
    images,
    certified: false,
    status: STATUS_MAP[v.status] || 'Available',
    riskScore: v.status === 'FLAGGED' ? 'High' : 'Low',
    valuation: v.price,
    marketPrice: v.price,
    condition: CONDITION_MAP[v.condition] || 'Good',
    description: v.description || undefined,
    __id: v.id,
    __sellerId: v.sellerId,
    __seller: v.seller,
    __raw: v,
  };
}

export function mapBackendVehicles(list: BackendVehicle[]): MappedVehicle[] {
  return (list || []).map(mapBackendVehicle);
}
