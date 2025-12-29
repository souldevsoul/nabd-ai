import { Metadata } from "next";
import { db } from "@/lib/db";
import { SpecialistsClient } from "./specialists-client";

export const metadata: Metadata = {
  title: "قائمة الأطباء - نبض",
  description: "تعرف على فريقنا من الأطباء والاستشاريين المتخصصين في الذكاء الاصطناعي الطبي.",
};

async function getSpecialists() {
  const specialists = await db.specialist.findMany({
    where: {
      isAvailable: true,
    },
    include: {
      tasks: {
        include: {
          task: true,
        },
      },
    },
    orderBy: {
      rating: "desc",
    },
    take: 20,
  });
  return specialists;
}

async function getCategories() {
  const tasks = await db.task.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });
  return tasks.map((t) => t.category);
}

export default async function SpecialistsPage() {
  const specialists = await getSpecialists();
  const categories = await getCategories();

  return <SpecialistsClient specialists={specialists} categories={categories} />;
}
