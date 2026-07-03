-- AlterTable
ALTER TABLE "business_profiles" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT;

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_businessId_idx" ON "bookings"("businessId");

-- CreateIndex
CREATE INDEX "business_profiles_businessType_idx" ON "business_profiles"("businessType");

-- CreateIndex
CREATE INDEX "business_profiles_country_idx" ON "business_profiles"("country");

-- CreateIndex
CREATE INDEX "business_profiles_city_idx" ON "business_profiles"("city");

-- CreateIndex
CREATE INDEX "business_profiles_verified_idx" ON "business_profiles"("verified");

-- CreateIndex
CREATE INDEX "business_profiles_rating_idx" ON "business_profiles"("rating");

-- CreateIndex
CREATE INDEX "reviews_businessId_idx" ON "reviews"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_reviewerId_businessId_key" ON "reviews"("reviewerId", "businessId");

-- CreateIndex
CREATE INDEX "vehicles_status_idx" ON "vehicles"("status");

-- CreateIndex
CREATE INDEX "vehicles_make_idx" ON "vehicles"("make");

-- CreateIndex
CREATE INDEX "vehicles_model_idx" ON "vehicles"("model");

-- CreateIndex
CREATE INDEX "vehicles_year_idx" ON "vehicles"("year");

-- CreateIndex
CREATE INDEX "vehicles_price_idx" ON "vehicles"("price");

-- CreateIndex
CREATE INDEX "vehicles_mileage_idx" ON "vehicles"("mileage");

-- CreateIndex
CREATE INDEX "vehicles_country_idx" ON "vehicles"("country");

-- CreateIndex
CREATE INDEX "vehicles_city_idx" ON "vehicles"("city");

-- CreateIndex
CREATE INDEX "vehicles_condition_idx" ON "vehicles"("condition");

-- CreateIndex
CREATE INDEX "vehicles_fuelType_idx" ON "vehicles"("fuelType");

-- CreateIndex
CREATE INDEX "vehicles_transmission_idx" ON "vehicles"("transmission");

-- CreateIndex
CREATE INDEX "vehicles_bodyType_idx" ON "vehicles"("bodyType");

-- CreateIndex
CREATE INDEX "vehicles_sellerId_idx" ON "vehicles"("sellerId");

-- CreateIndex
CREATE INDEX "vehicles_createdAt_idx" ON "vehicles"("createdAt");

