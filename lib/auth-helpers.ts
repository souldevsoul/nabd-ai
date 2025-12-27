import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";

export type ConversationAccess = {
  canView: boolean;
  canSend: boolean;
  canModerate: boolean;
  role: "owner" | "specialist" | "admin" | "none";
  assignmentStatus?: string;
};

/**
 * Check if a user has access to a task assignment conversation
 */
export async function getConversationAccess(
  userId: string,
  userRoles: UserRole[],
  assignmentId: string
): Promise<ConversationAccess> {
  // Admin always has full access
  if (userRoles.includes("ADMIN")) {
    const assignment = await db.taskAssignment.findUnique({
      where: { id: assignmentId },
      select: { status: true },
    });
    return {
      canView: true,
      canSend: true,
      canModerate: true,
      role: "admin",
      assignmentStatus: assignment?.status,
    };
  }

  // Fetch the assignment with related data for authorization
  const assignment = await db.taskAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      request: { select: { userId: true, status: true } },
      specialist: { select: { userId: true } },
    },
  });

  if (!assignment) {
    return { canView: false, canSend: false, canModerate: false, role: "none" };
  }

  // Check if user is task owner (BUYER)
  const isOwner = assignment.request.userId === userId;

  // Check if user is assigned specialist
  const isSpecialist = assignment.specialist.userId === userId;

  if (!isOwner && !isSpecialist) {
    return { canView: false, canSend: false, canModerate: false, role: "none" };
  }

  // Check if task allows messaging (only active tasks)
  const activeStatuses = ["ACCEPTED", "IN_PROGRESS"];
  const canSend = activeStatuses.includes(assignment.status);

  return {
    canView: true,
    canSend,
    canModerate: false,
    role: isOwner ? "owner" : "specialist",
    assignmentStatus: assignment.status,
  };
}
