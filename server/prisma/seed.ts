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
