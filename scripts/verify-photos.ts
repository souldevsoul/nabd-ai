import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check current photo statuses
  const photos = await prisma.photo.findMany({
    select: { id: true, title: true, status: true }
  });
  
  console.log(`Found ${photos.length} photos`);
  console.log("Status breakdown:");
  const statuses: Record<string, number> = {};
  photos.forEach(p => {
    statuses[p.status] = (statuses[p.status] || 0) + 1;
  });
  console.log(statuses);
  
  // Verify all pending photos
  const updated = await prisma.photo.updateMany({
    where: { status: "PENDING_REVIEW" },
    data: { 
      status: "VERIFIED",
      verifiedAt: new Date(),
      verificationScore: 95
    }
  });
  
  console.log(`\nVerified ${updated.count} photos`);
  
  await prisma.$disconnect();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
