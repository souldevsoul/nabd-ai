import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Telegram types
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
}

// Send message via Telegram API
async function sendTelegramMessage(
  chatId: number,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML",
  replyMarkup?: object
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      reply_markup: replyMarkup,
    }),
  });
}

// Handle /link command for specialists
async function handleSpecialistLink(message: TelegramMessage, _token: string) {
  const telegramUserId = message.from.id.toString();
  const chatId = message.chat.id;

  // For now, link by checking if there's a specialist with matching user
  const user = await db.user.findFirst({
    where: {
      telegramUserId,
      roles: { has: "SPECIALIST" },
    },
  });

  if (!user) {
    // Try to find specialist by the link token (simple version)
    const targetSpecialist = await db.specialist.findFirst({
      where: { userId: { not: null } },
    });

    if (targetSpecialist && !targetSpecialist.telegramUserId) {
      await db.specialist.update({
        where: { id: targetSpecialist.id },
        data: {
          telegramUserId,
          telegramUsername: message.from.username || null,
          telegramLinkedAt: new Date(),
        },
      });

      await sendTelegramMessage(chatId,
        `✅ <b>Specialist Account Linked!</b>\n\n` +
        `Welcome, <b>${targetSpecialist.firstName}</b>!\n\n` +
        `You can now:\n` +
        `📋 /tasks - View your assigned tasks\n` +
        `✅ /accept [id] - Accept a task\n` +
        `🚀 /start [id] - Start working on a task\n` +
        `✔️ /complete [id] - Mark task as done\n` +
        `📊 /stats - View your statistics\n` +
        `❓ /help - Show all commands`
      );
      return;
    }

    await sendTelegramMessage(chatId,
      "❌ <b>Link Failed</b>\n\nNo specialist account found. Please contact admin."
    );
    return;
  }

  // Link specialist to telegram
  const linkedSpecialist = await db.specialist.findUnique({
    where: { userId: user.id },
  });

  if (linkedSpecialist) {
    await db.specialist.update({
      where: { id: linkedSpecialist.id },
      data: {
        telegramUserId,
        telegramUsername: message.from.username || null,
        telegramLinkedAt: new Date(),
      },
    });

    await sendTelegramMessage(chatId,
      `✅ <b>Account Linked!</b>\n\n` +
      `Welcome back, <b>${linkedSpecialist.firstName}</b>!\n\n` +
      `Use /tasks to see your assignments.`
    );
  }
}

// Handle /tasks command - list specialist's tasks
async function handleTasksCommand(telegramUserId: string, chatId: number) {
  const specialist = await db.specialist.findUnique({
    where: { telegramUserId },
    include: {
      assignments: {
        where: { status: { in: ["PENDING", "ACCEPTED", "IN_PROGRESS"] } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          request: {
            include: {
              user: { select: { name: true } },
              task: { select: { displayName: true } },
            },
          },
        },
      },
    },
  });

  if (!specialist) {
    await sendTelegramMessage(chatId,
      "🔗 <b>Not Linked</b>\n\nUse /link to connect your specialist account."
    );
    return;
  }

  if (specialist.assignments.length === 0) {
    await sendTelegramMessage(chatId,
      "📋 <b>No Active Tasks</b>\n\nYou don't have any pending tasks right now."
    );
    return;
  }

  const statusEmoji: Record<string, string> = {
    PENDING: "⏳",
    ACCEPTED: "✅",
    IN_PROGRESS: "🚀",
  };

  const taskList = specialist.assignments.map((a) => {
    const emoji = statusEmoji[a.status] || "📋";
    const taskName = a.request.task?.displayName || "Custom Task";
    const client = a.request.user.name || "Client";
    return `${emoji} <b>${taskName}</b>\n   ID: <code>${a.id.slice(-8)}</code>\n   Client: ${client} | $${a.price}`;
  }).join("\n\n");

  await sendTelegramMessage(chatId,
    `📋 <b>Your Tasks</b>\n\n${taskList}\n\n` +
    `<i>Use /accept [id], /start [id], or /complete [id]</i>`
  );
}

// Handle /accept command
async function handleAcceptCommand(telegramUserId: string, chatId: number, assignmentIdPart: string) {
  const specialist = await db.specialist.findUnique({
    where: { telegramUserId },
  });

  if (!specialist) {
    await sendTelegramMessage(chatId, "🔗 Not linked. Use /link first.");
    return;
  }

  const assignment = await db.taskAssignment.findFirst({
    where: {
      specialistId: specialist.id,
      id: { endsWith: assignmentIdPart },
      status: "PENDING",
    },
    include: {
      request: { include: { task: true } },
    },
  });

  if (!assignment) {
    await sendTelegramMessage(chatId, "❌ Task not found or already accepted.");
    return;
  }

  await db.taskAssignment.update({
    where: { id: assignment.id },
    data: { status: "ACCEPTED" },
  });

  await sendTelegramMessage(chatId,
    `✅ <b>Task Accepted!</b>\n\n` +
    `<b>${assignment.request.task?.displayName || "Custom Task"}</b>\n` +
    `Price: $${assignment.price}\n\n` +
    `Use <code>/start ${assignmentIdPart}</code> when ready to begin.`
  );
}

// Handle /start command (start working)
async function handleStartCommand(telegramUserId: string, chatId: number, assignmentIdPart: string) {
  const specialist = await db.specialist.findUnique({
    where: { telegramUserId },
  });

  if (!specialist) {
    await sendTelegramMessage(chatId, "🔗 Not linked. Use /link first.");
    return;
  }

  const assignment = await db.taskAssignment.findFirst({
    where: {
      specialistId: specialist.id,
      id: { endsWith: assignmentIdPart },
      status: "ACCEPTED",
    },
    include: {
      request: { include: { task: true } },
    },
  });

  if (!assignment) {
    await sendTelegramMessage(chatId, "❌ Task not found or not in accepted state.");
    return;
  }

  await db.taskAssignment.update({
    where: { id: assignment.id },
    data: {
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  await db.taskRequest.update({
    where: { id: assignment.requestId },
    data: { status: "IN_PROGRESS" },
  });

  await sendTelegramMessage(chatId,
    `🚀 <b>Work Started!</b>\n\n` +
    `<b>${assignment.request.task?.displayName || "Custom Task"}</b>\n\n` +
    `Good luck! Use <code>/complete ${assignmentIdPart}</code> when done.`
  );
}

// Handle /complete command
async function handleCompleteCommand(telegramUserId: string, chatId: number, assignmentIdPart: string) {
  const specialist = await db.specialist.findUnique({
    where: { telegramUserId },
  });

  if (!specialist) {
    await sendTelegramMessage(chatId, "🔗 Not linked. Use /link first.");
    return;
  }

  const assignment = await db.taskAssignment.findFirst({
    where: {
      specialistId: specialist.id,
      id: { endsWith: assignmentIdPart },
      status: "IN_PROGRESS",
    },
    include: {
      request: { include: { task: true } },
    },
  });

  if (!assignment) {
    await sendTelegramMessage(chatId, "❌ Task not found or not in progress.");
    return;
  }

  await db.taskAssignment.update({
    where: { id: assignment.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  await db.taskRequest.update({
    where: { id: assignment.requestId },
    data: { status: "COMPLETED" },
  });

  await db.specialist.update({
    where: { id: specialist.id },
    data: { completedTasks: { increment: 1 } },
  });

  await sendTelegramMessage(chatId,
    `🎉 <b>Task Completed!</b>\n\n` +
    `<b>${assignment.request.task?.displayName || "Custom Task"}</b>\n` +
    `Earned: <b>$${assignment.price}</b>\n\n` +
    `Great work! 🌟`
  );
}

// Handle /stats command
async function handleStatsCommand(telegramUserId: string, chatId: number) {
  const specialist = await db.specialist.findUnique({
    where: { telegramUserId },
    include: {
      assignments: true,
    },
  });

  if (!specialist) {
    await sendTelegramMessage(chatId, "🔗 Not linked. Use /link first.");
    return;
  }

  const pending = specialist.assignments.filter(a => a.status === "PENDING").length;
  const inProgress = specialist.assignments.filter(a => a.status === "IN_PROGRESS").length;
  const completed = specialist.assignments.filter(a => a.status === "COMPLETED" || a.status === "RATED").length;
  const earnings = specialist.assignments
    .filter(a => a.status === "COMPLETED" || a.status === "RATED")
    .reduce((sum, a) => sum + a.price, 0);

  await sendTelegramMessage(chatId,
    `📊 <b>Your Statistics</b>\n\n` +
    `⭐ Rating: <b>${specialist.rating.toFixed(1)}</b>\n` +
    `💰 Hourly Rate: <b>$${specialist.hourlyRate}</b>\n\n` +
    `⏳ Pending: <b>${pending}</b>\n` +
    `🚀 In Progress: <b>${inProgress}</b>\n` +
    `✅ Completed: <b>${completed}</b>\n` +
    `💵 Total Earnings: <b>$${earnings}</b>`
  );
}

// Handle /help command
async function handleHelpCommand(chatId: number) {
  await sendTelegramMessage(chatId,
    `🤖 <b>Vertex Executor Bot</b>\n\n` +
    `<b>Task Management:</b>\n` +
    `📋 /tasks - View your assigned tasks\n` +
    `✅ /accept [id] - Accept a pending task\n` +
    `🚀 /start [id] - Start working on a task\n` +
    `✔️ /complete [id] - Mark task as completed\n\n` +
    `<b>Account:</b>\n` +
    `📊 /stats - View your statistics\n` +
    `🔗 /link - Link your account\n` +
    `❓ /help - Show this message\n\n` +
    `<i>Use last 8 characters of task ID</i>`
  );
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (process.env.TELEGRAM_WEBHOOK_SECRET && webhookSecret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update: TelegramUpdate = await request.json();
    const message = update.message;

    if (!message?.text) {
      return NextResponse.json({ ok: true });
    }

    const telegramUserId = message.from.id.toString();
    const chatId = message.chat.id;
    const text = message.text.trim();

    // /start command
    if (text === "/start") {
      const specialist = await db.specialist.findUnique({
        where: { telegramUserId },
      });

      if (specialist) {
        await sendTelegramMessage(chatId,
          `👋 <b>Welcome back, ${specialist.firstName}!</b>\n\n` +
          `Use /tasks to see your assignments.\n` +
          `Use /help for all commands.`
        );
      } else {
        await sendTelegramMessage(chatId,
          `🤖 <b>Welcome to Vertex!</b>\n\n` +
          `This bot helps specialists manage their tasks.\n\n` +
          `To get started:\n` +
          `1. Log in at vertex.com/executor\n` +
          `2. Use /link to connect your account\n\n` +
          `Use /help for available commands.`
        );
      }
      return NextResponse.json({ ok: true });
    }

    // /link command
    if (text.startsWith("/link")) {
      const token = text.replace("/link", "").trim();
      await handleSpecialistLink(message, token);
      return NextResponse.json({ ok: true });
    }

    // /tasks command
    if (text === "/tasks") {
      await handleTasksCommand(telegramUserId, chatId);
      return NextResponse.json({ ok: true });
    }

    // /accept command
    if (text.startsWith("/accept ")) {
      const idPart = text.replace("/accept ", "").trim();
      await handleAcceptCommand(telegramUserId, chatId, idPart);
      return NextResponse.json({ ok: true });
    }

    // /start [id] command (start working)
    if (text.startsWith("/start ") && text !== "/start") {
      const idPart = text.replace("/start ", "").trim();
      await handleStartCommand(telegramUserId, chatId, idPart);
      return NextResponse.json({ ok: true });
    }

    // /complete command
    if (text.startsWith("/complete ")) {
      const idPart = text.replace("/complete ", "").trim();
      await handleCompleteCommand(telegramUserId, chatId, idPart);
      return NextResponse.json({ ok: true });
    }

    // /stats command
    if (text === "/stats") {
      await handleStatsCommand(telegramUserId, chatId);
      return NextResponse.json({ ok: true });
    }

    // /help command
    if (text === "/help") {
      await handleHelpCommand(chatId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
