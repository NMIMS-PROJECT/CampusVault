-- Add bundlePrice column to Company table
ALTER TABLE "public"."Company" ADD COLUMN "bundlePrice" INTEGER NOT NULL DEFAULT 50;

-- Create CompanyUnlock table
CREATE TABLE "public"."CompanyUnlock" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyUnlock_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint
CREATE UNIQUE INDEX "CompanyUnlock_companyId_userId_key" ON "public"."CompanyUnlock"("companyId", "userId");

-- Add foreign key constraints
ALTER TABLE "public"."CompanyUnlock" ADD CONSTRAINT "CompanyUnlock_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."CompanyUnlock" ADD CONSTRAINT "CompanyUnlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
