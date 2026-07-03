-- DropForeignKey
ALTER TABLE "transport_requests" DROP CONSTRAINT "transport_requests_vehicleId_fkey";

-- AlterTable
ALTER TABLE "transport_requests" ALTER COLUMN "vehicleId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "auctions_status_idx" ON "auctions"("status");

-- CreateIndex
CREATE INDEX "auctions_sellerId_idx" ON "auctions"("sellerId");

-- CreateIndex
CREATE INDEX "auctions_vehicleId_idx" ON "auctions"("vehicleId");

-- CreateIndex
CREATE INDEX "auctions_endTime_idx" ON "auctions"("endTime");

-- CreateIndex
CREATE INDEX "bids_auctionId_idx" ON "bids"("auctionId");

-- CreateIndex
CREATE INDEX "bids_bidderId_idx" ON "bids"("bidderId");

-- CreateIndex
CREATE INDEX "claims_policyId_idx" ON "claims"("policyId");

-- CreateIndex
CREATE INDEX "claims_userId_idx" ON "claims"("userId");

-- CreateIndex
CREATE INDEX "claims_vehicleId_idx" ON "claims"("vehicleId");

-- CreateIndex
CREATE INDEX "claims_status_idx" ON "claims"("status");

-- CreateIndex
CREATE INDEX "inspections_vehicleId_idx" ON "inspections"("vehicleId");

-- CreateIndex
CREATE INDEX "inspections_inspectorId_idx" ON "inspections"("inspectorId");

-- CreateIndex
CREATE INDEX "inspections_centerId_idx" ON "inspections"("centerId");

-- CreateIndex
CREATE INDEX "inspections_result_idx" ON "inspections"("result");

-- CreateIndex
CREATE INDEX "insurance_policies_userId_idx" ON "insurance_policies"("userId");

-- CreateIndex
CREATE INDEX "insurance_policies_vehicleId_idx" ON "insurance_policies"("vehicleId");

-- CreateIndex
CREATE INDEX "insurance_policies_status_idx" ON "insurance_policies"("status");

-- CreateIndex
CREATE INDEX "ownership_transfers_vehicleId_idx" ON "ownership_transfers"("vehicleId");

-- CreateIndex
CREATE INDEX "ownership_transfers_fromUserId_idx" ON "ownership_transfers"("fromUserId");

-- CreateIndex
CREATE INDEX "ownership_transfers_toUserId_idx" ON "ownership_transfers"("toUserId");

-- CreateIndex
CREATE INDEX "ownership_transfers_status_idx" ON "ownership_transfers"("status");

-- CreateIndex
CREATE INDEX "stolen_reports_vehicleId_idx" ON "stolen_reports"("vehicleId");

-- CreateIndex
CREATE INDEX "stolen_reports_reporterId_idx" ON "stolen_reports"("reporterId");

-- CreateIndex
CREATE INDEX "stolen_reports_status_idx" ON "stolen_reports"("status");

-- CreateIndex
CREATE INDEX "transport_offers_requestId_idx" ON "transport_offers"("requestId");

-- CreateIndex
CREATE INDEX "transport_offers_carrierId_idx" ON "transport_offers"("carrierId");

-- CreateIndex
CREATE INDEX "transport_requests_requesterId_idx" ON "transport_requests"("requesterId");

-- CreateIndex
CREATE INDEX "transport_requests_status_idx" ON "transport_requests"("status");

-- CreateIndex
CREATE INDEX "transport_requests_originCountry_idx" ON "transport_requests"("originCountry");

-- CreateIndex
CREATE INDEX "transport_requests_destCountry_idx" ON "transport_requests"("destCountry");

-- CreateIndex
CREATE INDEX "transport_requests_transportType_idx" ON "transport_requests"("transportType");

-- AddForeignKey
ALTER TABLE "transport_requests" ADD CONSTRAINT "transport_requests_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

