#!/bin/bash
set -e

npm install
npx prisma generate --schema=server/prisma/schema.prisma
npx prisma migrate deploy --schema=server/prisma/schema.prisma
