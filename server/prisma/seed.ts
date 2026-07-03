import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";

const SALT_ROUNDS = 10;

const MAKES = [
  { make: "Toyota", model: "Camry" },
  { make: "Honda", model: "Civic" },
  { make: "Ford", model: "F-150" },
  { make: "BMW", model: "3 Series" },
  { make: "Mercedes-Benz", model: "C-Class" },
  { make: "Volkswagen", model: "Golf" },
  { make: "Audi", model: "A4" },
  { make: "Nissan", model: "Altima" },
  { make: "Hyundai", model: "Elantra" },
  { make: "Kia", model: "Sportage" },
];

const CITIES = [
  { country: "USA", city: "New York" },
  { country: "USA", city: "Los Angeles" },
  { country: "UK", city: "London" },
  { country: "Germany", city: "Berlin" },
  { country: "UAE", city: "Dubai" },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomVin(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let vin = "";
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  return vin;
}

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", SALT_ROUNDS);

  const seedUsers = [
    { email: "personal@justcarsale.com", firstName: "Pat", lastName: "Personal", role: "PERSONAL" as const },
    { email: "business@justcarsale.com", firstName: "Bailey", lastName: "Business", role: "BUSINESS" as const },
    { email: "insurance@justcarsale.com", firstName: "Ivy", lastName: "Insurance", role: "INSURANCE" as const },
    { email: "workshop@justcarsale.com", firstName: "Wes", lastName: "Workshop", role: "WORKSHOP" as const },
    { email: "government@justcarsale.com", firstName: "Gale", lastName: "Government", role: "GOVERNMENT" as const },
  ];

  const users = [];
  for (const seedUser of seedUsers) {
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: {},
      create: {
        email: seedUser.email,
        passwordHash,
        firstName: seedUser.firstName,
        lastName: seedUser.lastName,
        role: seedUser.role,
        emailVerified: true,
        country: "USA",
        city: "New York",
      },
    });
    users.push(user);
  }
  console.log(`Seeded ${users.length} users`);

  const businessSeller = users.find((u) => u.role === "BUSINESS")!;

  const businessDefs = [
    { businessType: "DEALER" as const, businessName: "Prime Auto Dealers", slug: "prime-auto-dealers" },
    { businessType: "WORKSHOP" as const, businessName: "Precision Auto Workshop", slug: "precision-auto-workshop" },
    { businessType: "TIRE_SHOP" as const, businessName: "City Tire Center", slug: "city-tire-center" },
  ];

  const businesses = [];
  for (const def of businessDefs) {
    const business = await prisma.businessProfile.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        userId: businessSeller.id,
        businessType: def.businessType,
        businessName: def.businessName,
        slug: def.slug,
        verified: true,
        rating: 4.5,
        reviewCount: 12,
      },
    });
    businesses.push(business);
  }
  console.log(`Seeded ${businesses.length} businesses`);

  const seller = users.find((u) => u.role === "PERSONAL")!;

  const vehicles = [];
  for (let i = 0; i < 20; i++) {
    const { make, model } = randomFrom(MAKES);
    const { country, city } = randomFrom(CITIES);
    const vehicle = await prisma.vehicle.create({
      data: {
        sellerId: seller.id,
        vin: randomVin(),
        make,
        model,
        year: 2015 + Math.floor(Math.random() * 10),
        mileage: Math.floor(Math.random() * 150000),
        fuelType: randomFrom(["Gasoline", "Diesel", "Hybrid", "Electric"]),
        transmission: randomFrom(["Automatic", "Manual"]),
        color: randomFrom(["Black", "White", "Silver", "Red", "Blue"]),
        bodyType: randomFrom(["Sedan", "SUV", "Truck", "Coupe", "Hatchback"]),
        price: 8000 + Math.floor(Math.random() * 40000),
        currency: "USD",
        country,
        city,
        condition: "USED",
        status: "ACTIVE",
        description: `Well-maintained ${make} ${model}, single owner, full service history.`,
      },
    });
    vehicles.push(vehicle);
  }
  console.log(`Seeded ${vehicles.length} vehicles`);

  const auctionCount = 5;
  for (let i = 0; i < auctionCount; i++) {
    const vehicle = vehicles[i];
    const startingPrice = vehicle.price * 0.7;
    await prisma.auction.create({
      data: {
        vehicleId: vehicle.id,
        sellerId: vehicle.sellerId,
        startingPrice,
        reservePrice: vehicle.price * 0.9,
        currentBid: startingPrice,
        duration: randomFrom(["H24", "H48", "D7"] as const),
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        depositRequired: 200,
      },
    });
  }
  console.log(`Seeded ${auctionCount} auctions`);

  const PHOTO_URLS = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
    "https://images.unsplash.com/photo-1494905998402-395d579af36f",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
  ];

  const businessSeller2 = users.find((u) => u.role === "WORKSHOP") ?? businessSeller;

  const extraVehicles = [];
  for (let i = 0; i < 10; i++) {
    const { make, model } = randomFrom(MAKES);
    const { country, city } = randomFrom(CITIES);
    const vehicle = await prisma.vehicle.create({
      data: {
        sellerId: randomFrom([seller, businessSeller, businessSeller2]).id,
        vin: randomVin(),
        make,
        model,
        year: 2015 + Math.floor(Math.random() * 10),
        mileage: Math.floor(Math.random() * 150000),
        fuelType: randomFrom(["Gasoline", "Diesel", "Hybrid", "Electric"]),
        transmission: randomFrom(["Automatic", "Manual"]),
        color: randomFrom(["Black", "White", "Silver", "Red", "Blue"]),
        bodyType: randomFrom(["Sedan", "SUV", "Truck", "Coupe", "Hatchback"]),
        price: 8000 + Math.floor(Math.random() * 40000),
        currency: "USD",
        country,
        city,
        condition: randomFrom(["NEW", "USED", "DAMAGED", "EXPORT"] as const),
        status: "ACTIVE",
        description: `Well-maintained ${make} ${model}, single owner, full service history.`,
        photos: {
          create: [0, 1, 2].map((idx) => ({
            url: `${randomFrom(PHOTO_URLS)}?auto=format&fit=crop&w=1200&q=80&sig=${i}-${idx}`,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
      },
    });
    extraVehicles.push(vehicle);
  }
  console.log(`Seeded ${extraVehicles.length} extra vehicles with photos`);

  const extraBusinessDefs = [
    {
      businessType: "RENTAL" as const,
      businessName: "Metro Car Rentals",
      slug: "metro-car-rentals",
      country: "USA",
      city: "New York",
    },
    {
      businessType: "DETAILING" as const,
      businessName: "ShineWorks Detailing",
      slug: "shineworks-detailing",
      country: "UK",
      city: "London",
    },
  ];

  const extraBusinesses = [];
  for (const def of extraBusinessDefs) {
    const business = await prisma.businessProfile.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        userId: businessSeller.id,
        businessType: def.businessType,
        businessName: def.businessName,
        slug: def.slug,
        country: def.country,
        city: def.city,
        verified: true,
        rating: 0,
        reviewCount: 0,
      },
    });
    extraBusinesses.push(business);
  }
  console.log(`Seeded ${extraBusinesses.length} extra businesses`);

  const allBusinesses = [...businesses, ...extraBusinesses];
  const reviewers = users.filter((u) => u.id !== businessSeller.id);
  const reviewComments = [
    "Great service, highly recommend!",
    "Fast and professional, will come back.",
    "Good experience overall, fair pricing.",
    "Excellent communication throughout the process.",
    "Solid work, would use again.",
  ];

  let reviewCount = 0;
  for (let i = 0; i < 5 && i < reviewers.length; i++) {
    const business = allBusinesses[i % allBusinesses.length];
    const reviewer = reviewers[i];
    const exists = await prisma.review.findUnique({
      where: { reviewerId_businessId: { reviewerId: reviewer.id, businessId: business.id } },
    });
    if (exists) continue;
    await prisma.review.create({
      data: {
        reviewerId: reviewer.id,
        businessId: business.id,
        rating: 3 + Math.floor(Math.random() * 3),
        comment: reviewComments[i],
      },
    });
    reviewCount += 1;
  }

  for (const business of allBusinesses) {
    const agg = await prisma.review.aggregate({
      where: { businessId: business.id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    if (agg._count.rating > 0) {
      await prisma.businessProfile.update({
        where: { id: business.id },
        data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count.rating },
      });
    }
  }
  console.log(`Seeded ${reviewCount} reviews`);

  const inspector = users.find((u) => u.role === "GOVERNMENT")!;
  const inspectionDefs = [
    { vehicle: vehicles[0], result: "PASSED" as const, mileage: vehicles[0].mileage, notes: "No issues found." },
    { vehicle: vehicles[1], result: "FAILED" as const, mileage: vehicles[1].mileage, notes: "Brake wear beyond limit." },
    { vehicle: vehicles[2], result: "REINSPECTION" as const, mileage: vehicles[2].mileage, notes: "Emissions retest required." },
  ];
  const inspections = [];
  for (const def of inspectionDefs) {
    const inspection = await prisma.inspection.create({
      data: {
        vehicleId: def.vehicle.id,
        inspectorId: inspector.id,
        result: def.result,
        mileageRecorded: def.mileage,
        notes: def.notes,
        fraudFlags: [],
      },
    });
    inspections.push(inspection);
  }
  console.log(`Seeded ${inspections.length} inspections`);

  const insurer = users.find((u) => u.role === "INSURANCE")!;
  const policyDefs = [
    { vehicle: vehicles[3], policyNumber: "POL-1001", coverageType: "Comprehensive", deductible: 500, premium: 1200 },
    { vehicle: vehicles[4], policyNumber: "POL-1002", coverageType: "Liability", deductible: 250, premium: 700 },
    { vehicle: vehicles[5], policyNumber: "POL-1003", coverageType: "Collision", deductible: 1000, premium: 950 },
  ];
  const insurancePolicies = [];
  for (const def of policyDefs) {
    const policy = await prisma.insurancePolicy.upsert({
      where: { policyNumber: def.policyNumber },
      update: {},
      create: {
        userId: def.vehicle.sellerId,
        vehicleId: def.vehicle.id,
        insurerId: insurer.id,
        policyNumber: def.policyNumber,
        coverageType: def.coverageType,
        deductible: def.deductible,
        premium: def.premium,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    });
    insurancePolicies.push(policy);
  }
  console.log(`Seeded ${insurancePolicies.length} insurance policies`);

  const transferDefs = [
    { vehicle: vehicles[6], from: seller, to: businessSeller },
    { vehicle: vehicles[7], from: businessSeller, to: seller },
  ];
  let transferCount = 0;
  for (const def of transferDefs) {
    const existing = await prisma.ownershipTransfer.findFirst({
      where: { vehicleId: def.vehicle.id, fromUserId: def.from.id, toUserId: def.to.id },
    });
    if (existing) continue;
    await prisma.ownershipTransfer.create({
      data: {
        vehicleId: def.vehicle.id,
        fromUserId: def.from.id,
        toUserId: def.to.id,
        transferDate: new Date(),
        status: "PENDING",
      },
    });
    transferCount += 1;
  }
  console.log(`Seeded ${transferCount} ownership transfers`);

  const stolenVehicle = vehicles[8];
  const existingReport = await prisma.stolenReport.findFirst({ where: { vehicleId: stolenVehicle.id } });
  if (!existingReport) {
    await prisma.stolenReport.create({
      data: {
        vehicleId: stolenVehicle.id,
        reporterId: stolenVehicle.sellerId,
        incidentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        policeRef: "PR-2026-00123",
        description: "Vehicle stolen overnight from driveway.",
        status: "OPEN",
      },
    });
    await prisma.vehicle.update({ where: { id: stolenVehicle.id }, data: { status: "FLAGGED" } });
    console.log("Seeded 1 stolen report");
  } else {
    console.log("Stolen report already seeded");
  }

  console.log("Seed complete. Sample login: personal@justcarsale.com / Password123!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
