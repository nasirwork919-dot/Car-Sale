-- CreateIndex
CREATE INDEX "documents_userId_idx" ON "documents"("userId");

-- CreateIndex
CREATE INDEX "documents_vehicleId_idx" ON "documents"("vehicleId");

-- CreateIndex
CREATE INDEX "documents_type_idx" ON "documents"("type");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "messages_receiverId_idx" ON "messages"("receiverId");

-- CreateIndex
CREATE INDEX "messages_vehicleId_idx" ON "messages"("vehicleId");

-- CreateIndex
CREATE INDEX "messages_receiverId_read_idx" ON "messages"("receiverId", "read");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "spare_parts_businessId_idx" ON "spare_parts"("businessId");

-- CreateIndex
CREATE INDEX "spare_parts_condition_idx" ON "spare_parts"("condition");

-- CreateIndex
CREATE INDEX "spare_parts_oem_idx" ON "spare_parts"("oem");

