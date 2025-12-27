import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateCredits() {
  console.log("Updating license options with credits...");

  // Update all PERSONAL licenses to 29 credits
  const personal = await prisma.licenseOption.updateMany({
    where: { type: "PERSONAL" },
    data: { credits: 29 }
  });
  console.log(`  Updated ${personal.count} PERSONAL licenses to 29 credits`);

  // Update all EDITORIAL licenses to 99 credits
  const editorial = await prisma.licenseOption.updateMany({
    where: { type: "EDITORIAL" },
    data: { credits: 99 }
  });
  console.log(`  Updated ${editorial.count} EDITORIAL licenses to 99 credits`);

  // Update all COMMERCIAL licenses to 299 credits
  const commercial = await prisma.licenseOption.updateMany({
    where: { type: "COMMERCIAL" },
    data: { credits: 299 }
  });
  console.log(`  Updated ${commercial.count} COMMERCIAL licenses to 299 credits`);

  // Update all EXTENDED licenses to 999 credits
  const extended = await prisma.licenseOption.updateMany({
    where: { type: "EXTENDED" },
    data: { credits: 999 }
  });
  console.log(`  Updated ${extended.count} EXTENDED licenses to 999 credits`);

  // Create wallet for demo buyer if not exists
  const buyer = await prisma.user.findUnique({
    where: { email: "buyer@example.com" }
  });

  if (buyer) {
    await prisma.wallet.upsert({
      where: { userId: buyer.id },
      update: { balance: 500 },
      create: { userId: buyer.id, balance: 500 }
    });
    console.log("  Created wallet for demo buyer with 500 credits");
  }

  console.log("\nDone!");
  await prisma.$disconnect();
  process.exit(0);
}

updateCredits().catch((e) => {
  console.error(e);
  process.exit(1);
});
