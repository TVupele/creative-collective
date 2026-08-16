-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "collection" TEXT;

-- CreateIndex
CREATE INDEX "Product_status_collection_idx" ON "Product"("status", "collection");
