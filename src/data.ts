/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle, Part, Lead, Appointment, AdvisoryExpert } from './types';

export const VEHICLES: Vehicle[] = [
  {
    vin: 'WP0AB2A92MS299212',
    year: 2021,
    make: 'Porsche',
    model: '911 Carrera S',
    trim: 'Premium Coupe',
    price: 124500,
    mileage: 4203,
    engine: '3.0L Flat-6 Twin-Turbo',
    transmission: '8-Speed PDK',
    driveType: 'RWD',
    location: 'Los Angeles, CA',
    extColor: 'Chalk Grey',
    intColor: 'Black/Bordeaux Leather',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABa4TtkrKpcbeyzuM0vdFmilJqYMenDtCPoRmgiGqDpqeYvNX5hkzH0Sh50gKq4q_9egArc4t4blhdkutYmoG2ciTDGYBEnO8LHByWcyetA7fDlNC3aF4j-PG2M7Ijb9pw6g2xejDNoGS1csSv1oO1A6c4sYRFGycK-Kt_j2YSCsgRMvOopcWKbBLaOXQ9buO_oM6vgNMVxJrL3uZ2GospN_kebDksmLjdwWixt9FTRnF6GlSuefTt2qwpX2IJHPxk7fqXTUSqlGXB',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClca3kowRnH_wWupca2EYm9kw6despGZtiXSQECwFDJw0MwM7l3QVrE-ifZbSSg6Ws2yxPTl6pbMP2IwW8nV6Xudp8PaR1rCtUHeyhe0sjzyfVE71sXcSzoeQl34OqeNNV97M4Gcue_-ev8FplDiedPCBC_EuzAOspq11a75-CRgV3dB_keQ4jl8HRSgeH0gbTtH1kIP02bWj1ptZYHANXGHbzAOxf6sB_hU5gab0LQ75ymXHELXn4uIWLv70Gek2lkkDq5yhjY35W',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFWhf6XB98KFKzZQIKtvQ3TzW756wbGAX6rFByScMHI6LaqPGtfovdE6XIBfAniP7BFm6EBQ0GMIzaKPZSavKENfWXmY_hKANcvLn8bjv51fDjdC_yiUopQ5hvKbKd-FSQg_oEZLQPGAgRDhr8zIH2W8h1uSsQutC7qVVLMvz6MTIYvqBq5oAWtzW2u8-fP1cEKsHNp-HS8TUncFyfSN51saATSC5NRnUk4f1VW9FLXoT8tEhybf4Cd-CpD5s1t7U_h8W8SUx-em03'
    ],
    certified: true,
    status: 'Available',
    riskScore: 'Low',
    valuation: 138450,
    marketPrice: 126900
  },
  {
    vin: 'WBA53BJ0XPX881270',
    year: 2023,
    make: 'BMW',
    model: 'M5 Competition',
    trim: 'TwinPower Turbo',
    price: 104250,
    mileage: 12402,
    engine: '4.4L V8 Twin-Turbo',
    transmission: '8-Speed M Steptronic',
    driveType: 'xDrive AWD',
    location: 'Chicago, IL',
    extColor: 'Marina Bay Blue',
    intColor: 'Silverstone Full Merino',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArIjEK3eKRi8Z3ctS2QnleUk31P9oGxSUg5OPE_A054nGAE0nzBA1qzG44yFiSUOLnR6g4UyZhW2zwY5N71dGFuUy540tQnANDkDd6waO9xH-KkrXtixOIA16DJz5SqfW0VtBJqRNAlLbS2SvlkwkFpEfbGtdNvGj2A8iZSo843q24qFyVMGCc1M8GCoxKcmZ00-zlmBPiUCofP4N9urIb305AlQ5HsrbhoiCkkaFaFpgP0Sw_hlesV2izvjEN3dAr5xxRmsEBkhym',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-s-b_id5pYQeEaRwqyyDCKHw5rs3sSYwdPn3JlpfyNp6ReNofRVWQorZWBxAFtk3E8rgIWvVd05LdJHGL2fSJSxRWH9ifM9e2LQy5XWEqoOTIS-dgkMBFWijOSgaVV3C71s_56-vcoM3K1DygP1zL5CAJP-lfg4_3-XIgBOKImngP6f10i5jcp43dAfQs6U4U1jSaFzUTbN45MKOZWrUmqT_6_xV3BO2i1SrMQsxPeSiywEUrtDBNOXdVQ4tKoUa-POztt8OLoOtI'
    ],
    certified: true,
    status: 'Available',
    riskScore: 'Low',
    valuation: 108500,
    marketPrice: 106200
  },
  {
    vin: '5YJSA1E4XPF231495',
    year: 2023,
    make: 'Tesla',
    model: 'Model S',
    trim: 'Plaid Tri-Motor',
    price: 89500,
    mileage: 3150,
    engine: 'Tri-Motor Electric',
    transmission: 'Single Speed Direct-Drive',
    driveType: 'AWD',
    location: 'San Jose, CA',
    extColor: 'Prinstine White',
    intColor: 'Ultra White Premium',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCLDdK4i1dku1NX78pzaBrxPT1y2YKYIKAMYbcCtJi2G5N5kKDNug5J5dlA95AoiPdnwasK8qO39CUd_AH91d9fVtdGC0IY26Px-q-uZXPKBRXdwdEwD5S3walX32NApMSZuFGa5n65AvZnrgDNOfgpO-zez7zkx3iULYUO_7ONBRzJZ7q-JRxwPZvBjaOlWR0mWOfPB4HiU9j2u8wkj96SNw-k21Mz24bmH67lgIhp2ejcl-GwdGZmq3FlPJ8OLoDf3lC5KUzRmHZ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5qss7nKXLiDfrAiCJZv6njoIxWWALqhrtwuJlh5O7HQkzmqQJXZf0xJnXePFZXGoTeYftYeahRwTvtg-8MuDsxU2t80e7DkFTP7RpqISDG9TDB-LSnFjSGGhUID7vnQ5bhMOT4oK_TauiTJd8g-UmbJ_oAa1ujsNISmAv2PfZUzS_guxncitI3FBpBl6XT1lprOQlteP3sXQDtPAI0BJHVsa7Dd2sv2-J03LYACA8-DZQmLSoA5pfInkenj6HJdZSX3dEOjWq65WV'
    ],
    certified: true,
    status: 'Available',
    riskScore: 'Low',
    valuation: 94000,
    marketPrice: 91500
  },
  {
    vin: 'SAJGV2RE8MA124850',
    year: 2022,
    make: 'Land Rover',
    model: 'Range Rover Sport',
    trim: 'Autobiography V8',
    price: 89900,
    mileage: 18210,
    engine: '4.4L Twin-Turbo V8',
    transmission: '8-Speed Automatic',
    driveType: '4WD',
    location: 'Miami, FL',
    extColor: 'Belgravia Green',
    intColor: 'Caraway Luxury Leather',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7t9eH-Ld3Kcynvcytn2HRg3pnj0jrAvF-YAm9kwJ7IjxzPS8HgXAWs9IG-gLiwUcDyaJ6_YPed8FgwQ_ZgJess4W1MpkdHPOIsGsGxIfq5wCjamSVEX4IdaJdGBjzKMTjiGAvoRU14L0q0BvPV3KkkA4s5s-lW5PhxCXRnOGZajD3O15q32MA4CiStwVcWE-DacG7BocZ4fSIKa7WhFAD8a7f-ewrMZ9ZOdZ8UqOWsQmsbQsQSXNFhZ78Yc_MH35LBqAjg82X5Vy7',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBRZA1QjLB6ez6tfomG_51Sa3sFQgPicOHAA-2izdDHs3bmd_ATQdHbqFqgmaSiASTShMsMiyl3V7ehMooUv7LhU52SjkWxzs7VUtfAj0Q8aYN8LYvNxXRqjD4Zh7EEALrrSquEY5vZJkjPn2QXfCafXpOREOeD-fv76D0xPqBETKJkStPq63Uq3xRmEjCS3wt0ar4JArDacRYgzdSIPyfOPE8nXeOINsLFyCyNU6onZne4nBcspu1sBXgXgCCphZ4-J7aUn0rCT3lH'
    ],
    certified: true,
    status: 'Reserved',
    riskScore: 'Medium',
    valuation: 96000,
    marketPrice: 91500
  },
  {
    vin: 'WAUB8AF21MN05XXXX',
    year: 2021,
    make: 'Audi',
    model: 'RS6 Avant',
    trim: 'Launch Edition',
    price: 92400,
    mileage: 24800,
    engine: '4.0L TFSI Twin-Turbo V8',
    transmission: '8-Speed Tiptronic',
    driveType: 'Quattro AWD',
    location: 'Miami, FL',
    extColor: 'Nardo Grey',
    intColor: 'Black Valcona Leather',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4AKwQs7ZocsWRDFrXtOFvWG6bgKRkwAQWPXJ_m4Rvy06azTasH5Ij5S9QTWMSeoQj1RniV-dJLT1V-Qpiz2bga-bEuWAfCV62bpA_VkY3p4ASIvCycwWETOGp7K2YFRf9l3SGSHvX9BHdhnigy4-mgEe6OPGvKeJ7Y6GmXGV9cVPSCd81mBux0ex24AwVwweoXJt2OdJDpBGFYGupItH3UzbCxi-BDfV7BXy7sNoccZUIZ9ObcEk2PzmdgvE_eg_mCtdDNHe2BmX'
    ],
    certified: false,
    status: 'Pending Inspection',
    riskScore: 'High',
    valuation: 94500,
    marketPrice: 93100
  },
  {
    vin: 'WDDYF7HA4FA399021',
    year: 2022,
    make: 'Mercedes-Benz',
    model: 'AMG GT Black Series',
    trim: 'V8 Biturbo',
    price: 325000,
    mileage: 1850,
    engine: '4.0L V8 Biturbo',
    transmission: '7-Speed AMG SPEEDSHIFT',
    driveType: 'RWD',
    location: 'Houston, TX',
    extColor: 'Magma Beam Orange',
    intColor: 'Exclusive Nappa/DINAMICA Black',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800'
    ],
    certified: true,
    status: 'Available',
    riskScore: 'Low',
    valuation: 345000,
    marketPrice: 329000
  }
];

export const PARTS: Part[] = [
  {
    sku: 'MP-4S-18245',
    name: 'Michelin Pilot Sport 4S (245/40ZR18)',
    vehicleCompat: 'Porsche 911, Audi RS6, BMW M5',
    condition: 'Brand New (Summer Sport)',
    price: 310.00,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'MICH-PS4S-245-40-18',
    category: 'Summer Performance'
  },
  {
    sku: 'PZ-C3-20305',
    name: 'Pirelli P Zero Corsa (305/30ZR20) Extreme',
    vehicleCompat: 'Porsche 911 Turbo S, Audi R8, Ferrari F8',
    condition: 'Brand New (Ultra Track)',
    price: 465.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'PIRE-PZ-305-30-20',
    category: 'Track & Competition'
  },
  {
    sku: 'BP-E8-V8350',
    name: 'JustCar Twin-Power V8 Sport Engine Block',
    vehicleCompat: 'BMW M3, Audi S5, Mercedes C63, Porsche 911',
    condition: 'OEM Factory Certified',
    price: 3450.00,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'OEM-V8-TWIN-TURBO-550',
    category: 'Summer Performance'
  }
];

export const LEADS: Lead[] = [
  { id: '99281-XM', name: 'Jonathan Davis', initials: 'JD', inquiry: 'Inquired: Mercedes S-Class S580', status: 'Qualified', time: '2 hours ago' },
  { id: '44102-AQ', name: 'Elena Martinez', initials: 'EM', inquiry: 'Document Review: Porsche 911 GT3', status: 'Closing', time: '5 hours ago' },
  { id: '33100-BB', name: 'Robert King', initials: 'RK', inquiry: 'General Inquiry: Auction Terms & Escrow', status: 'New Lead', time: '1 day ago' }
];

export const APPOINTMENTS: Appointment[] = [
  { time: '09:00 AM', instructor: 'Robert Jones', initials: 'RJ', student: 'David Chen', status: 'Confirmed', activity: 'Highway Merging Lesson' },
  { time: '10:30 AM', instructor: 'Sarah Miller', initials: 'SM', student: 'Emma Wilson', status: 'In Progress', activity: 'Parallel Parking Practice' },
  { time: '01:00 PM', instructor: 'Alex Lee', initials: 'AL', student: 'Tom Hardy', status: 'Pending', activity: 'Defensive Driving Drills' }
];

export const EXPERTS: AdvisoryExpert[] = [
  {
    id: 'EXP-MARCUS',
    name: 'Marcus Vane, Esq.',
    title: 'Senior International Customs Attorney',
    firm: 'Vane & Partners LLP',
    rating: 4.9,
    specialties: ['Customs Law', 'VAT Recovery', 'International Arbitration'],
    bio: '15 years of experience handling arbitration for major European OEMs and structuring tax-optimized cross-border logistics lanes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwiyS957p984uU7CZZsHL5W04MZ7dqKn2De-xcAweKjWt19qDKzStH6PlEHKxwyRpfDzoz5LDRADkgPZ2GZ7LjJ2ZhJPLHOgoQbVVYytRx6SAxIARsNe_9oP8WOewdETL9DwLxRN3uoNYup3g6cbeyYKURZpgW2L_x8XyaW7k745qstNJXOH-U16l2rI0DhGZ1qSMH0_HEvnLaL_IRBZ-rqESI4r0zgVpalsawgq3q4wu817tSYMQTm7gt_tvTfVBKBfZ83Xmchnmh'
  },
  {
    id: 'EXP-ELENA',
    name: 'Elena Rossi',
    title: 'Certified Customs Broker',
    firm: 'Global Logistics Advisory Group',
    rating: 5.0,
    specialties: ['Dismantler Licensing', 'Import Bonds', 'Customs Tariff Clearance'],
    bio: 'Specialist in Middle Eastern and African vehicle import protocols, ensuring zero delays at international customs gates.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmPFFViNVoXLa3kv3lknglFPrfcKgp1mhWGOn_6wLWira0KcYe3fD7HZNpzrfWXIl5_TIxfdoNzw2VkiGvXhHqi-CtLRjCH3dQn8OvzfpAdOlTvDNv6ns4vr0yZISHX87UF8FYJ_Rlg1Vs2A09cqA3p6OJqh4iAGfQZ2h2pZA8gIWo_BrDMKftffPjoRCFjXTDug4h7KLd_TdHbz1dvRdiGiBAQ8ZEGlKKCav6yuoV_CTreLsEU-K4vVVnxcQjmVeQaEByEIrNSD4y'
  }
];
