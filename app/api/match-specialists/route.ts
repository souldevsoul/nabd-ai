import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

// OpenAI model - MUST use gpt-5-mini-2025-08-07
const OPENAI_MODEL = "gpt-5-mini-2025-08-07";

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Zod schema for matching result
const MatchResultSchema = z.object({
  matches: z.array(z.object({
    taskName: z.string(),
    specialistId: z.string(),
    confidence: z.number(),
    reasoning: z.string(),
  })),
  suggestedTasks: z.array(z.string()),
});

type MatchResult = z.infer<typeof MatchResultSchema>;

// Match specialists using OpenAI
async function matchSpecialistsWithAI(
  userDescription: string,
  availableTasks: { id: string; name: string; displayName: string; description: string; category: string }[],
  specialists: { id: string; firstName: string; rating: number; tasks: { taskId: string; proficiency: number }[] }[]
): Promise<MatchResult> {
  try {
    const response = await getOpenAI().responses.parse({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: "You are an AI specialist matching system for Vertex, a platform connecting users with AI experts. Analyze the user's problem and match with the most suitable specialists based on relevance, rating, and proficiency.",
        },
        {
          role: "user",
          content: `Problem description: "${userDescription}"

Available tasks:
${JSON.stringify(availableTasks.map(t => ({ id: t.id, name: t.name, displayName: t.displayName, description: t.description, category: t.category })), null, 2)}

Available specialists:
${JSON.stringify(specialists.map(s => ({
  id: s.id,
  name: s.firstName,
  rating: s.rating,
  tasks: s.tasks.map(st => ({ taskId: st.taskId, proficiency: st.proficiency }))
})), null, 2)}

Return 3-5 best matches, ordered by confidence.`,
        },
      ],
      text: {
        format: zodTextFormat(MatchResultSchema, "matchResult"),
      },
    });

    const result = response.output_parsed;
    if (!result) {
      throw new Error("No parsed output from OpenAI");
    }

    return result;
  } catch (error) {
    console.error("OpenAI matching error:", error);
    // Fallback: return top-rated specialists
    const topSpecialists = specialists
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return {
      matches: topSpecialists.map(s => ({
        taskName: availableTasks[0]?.displayName || "General AI Task",
        specialistId: s.id,
        confidence: 0.7,
        reasoning: `${s.firstName} is a highly-rated specialist with relevant experience.`,
      })),
      suggestedTasks: availableTasks.slice(0, 3).map(t => t.name),
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const isAuthenticated = !!session?.user?.id;

    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== "string" || description.length < 10) {
      return NextResponse.json(
        { error: "Please provide a detailed description (at least 10 characters)" },
        { status: 400 }
      );
    }

    // Get all tasks
    const tasks = await db.task.findMany({
      select: {
        id: true,
        name: true,
        displayName: true,
        description: true,
        category: true,
        basePrice: true,
      },
    });

    // Get all available specialists with their tasks
    const specialists = await db.specialist.findMany({
      where: { isAvailable: true },
      include: {
        tasks: {
          select: {
            taskId: true,
            proficiency: true,
          },
        },
      },
    });

    // Match using AI
    const matchResult = await matchSpecialistsWithAI(description, tasks, specialists);

    // For authenticated users, create task request in database
    let requestId: string | null = null;
    interface AssignmentItem {
      id: string;
      specialist: {
        id: string;
        firstName: string;
        avatarSeed: string;
        rating: number;
        completedTasks: number;
      };
      taskName: string;
      price: number;
      confidence: number;
      reasoning: string;
    }
    const assignments: AssignmentItem[] = [];

    if (isAuthenticated && session?.user?.id) {
      const taskRequest = await db.taskRequest.create({
        data: {
          userId: session.user.id,
          description,
          status: "MATCHED",
        },
      });
      requestId = taskRequest.id;

      // Create task assignments from matches
      for (const match of matchResult.matches) {
        const specialist = specialists.find(s => s.id === match.specialistId);
        if (specialist) {
          const assignment = await db.taskAssignment.create({
            data: {
              requestId: taskRequest.id,
              specialistId: match.specialistId,
              status: "PENDING",
              price: specialist.hourlyRate,
              confidence: match.confidence,
              reasoning: match.reasoning,
            },
            include: {
              specialist: true,
            },
          });
          assignments.push({
            id: assignment.id,
            specialist: {
              id: assignment.specialist.id,
              firstName: assignment.specialist.firstName,
              avatarSeed: assignment.specialist.avatarSeed,
              rating: assignment.specialist.rating,
              completedTasks: assignment.specialist.completedTasks,
            },
            taskName: match.taskName,
            price: assignment.price,
            confidence: assignment.confidence ?? match.confidence,
            reasoning: assignment.reasoning ?? match.reasoning,
          });
        }
      }
    } else {
      // For anonymous users, just return matches without saving
      for (const match of matchResult.matches) {
        const specialist = specialists.find(s => s.id === match.specialistId);
        if (specialist) {
          assignments.push({
            id: `temp-${specialist.id}`,
            specialist: {
              id: specialist.id,
              firstName: specialist.firstName,
              avatarSeed: specialist.avatarSeed,
              rating: specialist.rating,
              completedTasks: specialist.completedTasks,
            },
            taskName: match.taskName,
            price: specialist.hourlyRate,
            confidence: match.confidence,
            reasoning: match.reasoning,
          });
        }
      }
    }

    return NextResponse.json({
      requestId,
      isAuthenticated,
      matches: assignments,
      suggestedTasks: matchResult.suggestedTasks,
    });
  } catch (error) {
    console.error("Match specialists error:", error);
    return NextResponse.json(
      { error: "Failed to match specialists" },
      { status: 500 }
    );
  }
}
