import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import crypto from "crypto";
import OpenAI from "openai";

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

// Analyze image with OpenAI Vision
async function analyzeImageWithVision(imageUrl: string): Promise<{
  title: string;
  description: string;
  tags: string[];
  category: string;
}> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-5-mini-2025-08-07",
      messages: [
        {
          role: "system",
          content: `You are an expert photography curator. Analyze the image and provide:
1. A compelling, professional title (2-5 words, no quotes)
2. A descriptive caption suitable for a stock photography marketplace (1-2 sentences)
3. 5-10 relevant tags for search (lowercase, single words or short phrases)
4. A primary category from: landscape, portrait, street, architecture, food, wildlife, abstract, travel, urban, nature, fashion, sports, events, product, other

Respond in JSON format:
{
  "title": "...",
  "description": "...",
  "tags": ["tag1", "tag2", ...],
  "category": "..."
}`
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low"
              }
            },
            {
              type: "text",
              text: "Analyze this photograph for a professional stock photography marketplace."
            }
          ]
        }
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Vision API error:", error);
    // Fallback values
    return {
      title: "Untitled Photo",
      description: "A beautiful photograph",
      tags: ["photography"],
      category: "other"
    };
  }
}

// Create or get tags
async function getOrCreateTags(tagNames: string[]): Promise<string[]> {
  const tagIds: string[] = [];

  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    let tag = await db.tag.findUnique({ where: { slug } });

    if (!tag) {
      tag = await db.tag.create({
        data: { name, slug }
      });
    }

    tagIds.push(tag.id);
  }

  return tagIds;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true }
    });

    if (!user?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const photographerId = formData.get("photographerId") as string;
    const autoAnalyze = formData.get("autoAnalyze") === "true";

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Use admin as photographer if not specified
    const targetPhotographerId = photographerId || session.user.id;

    const results = [];

    for (const file of files) {
      try {
        // Generate file hash
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

        // Check for duplicate
        const existing = await db.photo.findUnique({ where: { fileHash } });
        if (existing) {
          results.push({
            filename: file.name,
            status: "skipped",
            reason: "duplicate",
            existingId: existing.id
          });
          continue;
        }

        // Upload to Vercel Blob
        const blob = await put(`photos/${fileHash}/${file.name}`, buffer, {
          access: "public",
          contentType: file.type,
        });

        // Generate thumbnail URL (Vercel Blob handles this)
        const thumbnailUrl = blob.url;

        // Analyze with OpenAI Vision if enabled
        let analysis = {
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          description: "",
          tags: [] as string[],
          category: "other"
        };

        if (autoAnalyze && process.env.OPENAI_API_KEY) {
          analysis = await analyzeImageWithVision(blob.url);
        }

        // Create or get tags
        const tagIds = await getOrCreateTags(analysis.tags);

        // Create photo record
        const photo = await db.photo.create({
          data: {
            photographerId: targetPhotographerId,
            title: analysis.title,
            description: analysis.description,
            fileUrl: blob.url,
            thumbnailUrl: thumbnailUrl,
            storageKey: blob.pathname,
            status: "PENDING_REVIEW",
            fileSize: buffer.length,
            mimeType: file.type,
            fileHash,
            tags: {
              create: tagIds.map(tagId => ({ tagId }))
            }
          },
          include: {
            tags: {
              include: { tag: true }
            }
          }
        });

        results.push({
          filename: file.name,
          status: "success",
          photoId: photo.id,
          title: photo.title,
          tags: photo.tags.map(t => t.tag.name),
          url: blob.url
        });

      } catch (fileError) {
        console.error(`Error processing ${file.name}:`, fileError);
        results.push({
          filename: file.name,
          status: "error",
          reason: fileError instanceof Error ? fileError.message : "Unknown error"
        });
      }
    }

    return NextResponse.json({
      processed: results.length,
      results
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
