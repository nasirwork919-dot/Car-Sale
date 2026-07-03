import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, fail } from "../utils/response";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function bucketByMonth(dates: Date[], months = 6): { month: string; count: number }[] {
  const buckets = new Map<string, number>();
  const keys: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = monthKey(d);
    keys.push(key);
    buckets.set(key, 0);
  }
  for (const date of dates) {
    const key = monthKey(date);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }
  return keys.map((month) => ({ month, count: buckets.get(month) ?? 0 }));
}

export async function userDashboard(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;

  const [
    myVehicles,
    myActiveAuctions,
    myActiveBidRows,
    myOpenClaims,
    myPolicies,
    myBookings,
    myUnreadMessages,
    myUnreadNotifications,
    recentActivity,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { sellerId: userId, status: "ACTIVE", deletedAt: null } }),
    prisma.auction.count({ where: { sellerId: userId, status: "ACTIVE" } }),
    prisma.bid.findMany({
      where: { bidderId: userId, auction: { status: "ACTIVE" } },
      distinct: ["auctionId"],
      select: { auctionId: true },
    }),
    prisma.claim.count({ where: { userId, status: { in: ["OPEN", "REVIEWING"] } } }),
    prisma.insurancePolicy.count({ where: { userId, status: "ACTIVE" } }),
    prisma.booking.count({ where: { userId, date: { gte: startOfToday() } } }),
    prisma.message.count({ where: { receiverId: userId, read: false } }),
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  ok(res, {
    myVehicles,
    myActiveAuctions,
    myActiveBids: myActiveBidRows.length,
    myOpenClaims,
    myPolicies,
    myBookings,
    myUnreadMessages,
    myUnreadNotifications,
    recentActivity,
  });
}

export async function businessDashboard(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;

  const businesses = await prisma.businessProfile.findMany({ where: { userId } });
  if (businesses.length === 0) {
    fail(res, 403, "You do not have a business profile");
    return;
  }
  const businessIds = businesses.map((b) => b.id);

  const [
    totalListings,
    totalSold,
    revenueAgg,
    upcomingBookings,
    recentReviews,
    recentVehicles,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { sellerId: userId, status: "ACTIVE", deletedAt: null } }),
    prisma.vehicle.count({ where: { sellerId: userId, status: "SOLD", deletedAt: null } }),
    prisma.vehicle.aggregate({
      where: { sellerId: userId, status: "SOLD", deletedAt: null },
      _sum: { price: true },
    }),
    prisma.booking.findMany({
      where: { businessId: { in: businessIds }, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 5,
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true, phone: true } } },
    }),
    prisma.review.findMany({
      where: { businessId: { in: businessIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    }),
    prisma.vehicle.findMany({
      where: { sellerId: userId, deletedAt: null, createdAt: { gte: monthsAgo(6) } },
      select: { createdAt: true },
    }),
  ]);

  const totalReviews = businesses.reduce((sum, b) => sum + b.reviewCount, 0);
  const weightedRatingSum = businesses.reduce((sum, b) => sum + b.rating * b.reviewCount, 0);
  const avgRating = totalReviews > 0 ? weightedRatingSum / totalReviews : 0;

  ok(res, {
    totalListings,
    totalSold,
    avgRating,
    totalReviews,
    upcomingBookings,
    recentReviews,
    totalRevenue: revenueAgg._sum.price ?? 0,
    monthlyListings: bucketByMonth(recentVehicles.map((v) => v.createdAt)),
  });
}

export async function governmentDashboard(req: AuthenticatedRequest, res: Response) {
  const [
    totalRegisteredVehicles,
    totalInspections,
    passedCount,
    failedCount,
    flaggedVehicles,
    recentInspections,
    recentInspectionDates,
    allFraudFlags,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { deletedAt: null } }),
    prisma.inspection.count(),
    prisma.inspection.count({ where: { result: "PASSED" } }),
    prisma.inspection.count({ where: { result: "FAILED" } }),
    prisma.vehicle.count({ where: { status: "FLAGGED" } }),
    prisma.inspection.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        vehicle: { select: { id: true, vin: true, make: true, model: true, year: true } },
        inspector: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.inspection.findMany({ where: { createdAt: { gte: monthsAgo(6) } }, select: { createdAt: true } }),
    prisma.inspection.findMany({ select: { fraudFlags: true } }),
  ]);

  const passRate = totalInspections > 0 ? (passedCount / totalInspections) * 100 : 0;
  const failRate = totalInspections > 0 ? (failedCount / totalInspections) * 100 : 0;

  const flagCounts = new Map<string, number>();
  for (const { fraudFlags } of allFraudFlags) {
    if (Array.isArray(fraudFlags)) {
      for (const flag of fraudFlags) {
        if (typeof flag === "string") {
          flagCounts.set(flag, (flagCounts.get(flag) ?? 0) + 1);
        }
      }
    }
  }
  const topFraudFlags = Array.from(flagCounts.entries())
    .map(([flag, count]) => ({ flag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  ok(res, {
    totalRegisteredVehicles,
    totalInspections,
    passRate,
    failRate,
    flaggedVehicles,
    recentInspections,
    inspectionsByMonth: bucketByMonth(recentInspectionDates.map((i) => i.createdAt)),
    topFraudFlags,
  });
}

export async function policeDashboard(_req: AuthenticatedRequest, res: Response) {
  const [
    totalStolenReports,
    openCases,
    recoveredVehicles,
    closedCases,
    recentReports,
    recentReportDates,
    flaggedVehicleList,
  ] = await Promise.all([
    prisma.stolenReport.count(),
    prisma.stolenReport.count({ where: { status: { in: ["OPEN", "INVESTIGATING"] } } }),
    prisma.stolenReport.count({ where: { status: "RECOVERED" } }),
    prisma.stolenReport.count({ where: { status: "CLOSED" } }),
    prisma.stolenReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        vehicle: { select: { id: true, vin: true, make: true, model: true, year: true } },
        reporter: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.stolenReport.findMany({ where: { createdAt: { gte: monthsAgo(6) } }, select: { createdAt: true } }),
    prisma.vehicle.findMany({
      where: { status: "FLAGGED" },
      include: { seller: { select: { id: true, firstName: true, lastName: true, phone: true } } },
    }),
  ]);

  ok(res, {
    totalStolenReports,
    openCases,
    recoveredVehicles,
    closedCases,
    recentReports,
    reportsByMonth: bucketByMonth(recentReportDates.map((r) => r.createdAt)),
    flaggedVehicles: flaggedVehicleList,
  });
}

export async function insuranceDashboard(_req: AuthenticatedRequest, res: Response) {
  const [
    totalPolicies,
    activePolicies,
    totalClaims,
    openClaims,
    approvedClaims,
    deniedClaims,
    recentClaims,
    recentClaimDates,
    premiumAgg,
  ] = await Promise.all([
    prisma.insurancePolicy.count(),
    prisma.insurancePolicy.count({ where: { status: "ACTIVE" } }),
    prisma.claim.count(),
    prisma.claim.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
    prisma.claim.count({ where: { status: "APPROVED" } }),
    prisma.claim.count({ where: { status: "DENIED" } }),
    prisma.claim.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        vehicle: { select: { id: true, vin: true, make: true, model: true, year: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.claim.findMany({ where: { createdAt: { gte: monthsAgo(6) } }, select: { createdAt: true } }),
    prisma.insurancePolicy.aggregate({ where: { status: "ACTIVE" }, _sum: { premium: true } }),
  ]);

  ok(res, {
    totalPolicies,
    activePolicies,
    totalClaims,
    openClaims,
    approvedClaims,
    deniedClaims,
    recentClaims,
    claimsByMonth: bucketByMonth(recentClaimDates.map((c) => c.createdAt)),
    totalPremiumValue: premiumAgg._sum.premium ?? 0,
  });
}
