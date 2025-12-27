import Replicate from "replicate";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const OUTPUT_DIR = path.join(process.cwd(), "public/images/seed");

// Photorealistic prompts for seed photos - diverse, professional photography
const photoPrompts = [
  // Landscapes
  {
    prompt: "Professional landscape photography, golden hour over misty mountains, dramatic clouds, crystal clear lake reflection, shot on Hasselblad medium format camera, ultra sharp, National Geographic quality, cinematic lighting, 8k resolution",
    category: "landscape",
  },
  {
    prompt: "Stunning aerial drone photography of turquoise ocean waves crashing on white sand beach, tropical paradise, professional travel photography, vivid colors, ultra realistic, shot on Phase One camera",
    category: "landscape",
  },
  {
    prompt: "Breathtaking autumn forest photography, vibrant red and orange leaves, morning fog between trees, sunbeams through canopy, professional nature photography, Nikon D850, 85mm lens, bokeh background",
    category: "landscape",
  },
  // Portraits
  {
    prompt: "Professional portrait photography of elderly Japanese man with weathered face, deep wrinkles telling stories, warm natural lighting, shallow depth of field, shot on Canon 5D Mark IV, 85mm f/1.4 lens, emotional and authentic",
    category: "portrait",
  },
  {
    prompt: "Fashion editorial portrait of young Black woman with afro hair, golden hour backlighting, urban rooftop setting, professional studio quality, shot on Sony A7R IV, Zeiss lens, high fashion magazine style",
    category: "portrait",
  },
  {
    prompt: "Candid street portrait of Indian street vendor smiling, vibrant colorful market background, authentic documentary photography style, natural lighting, Leica M10, 35mm lens, storytelling image",
    category: "portrait",
  },
  // Street Photography
  {
    prompt: "Rainy night street photography in Tokyo, neon lights reflected on wet pavement, silhouette of person with umbrella, cinematic noir aesthetic, shot on Fujifilm X-T4, moody atmosphere, professional quality",
    category: "street",
  },
  {
    prompt: "New York City street photography, steam rising from manhole, taxi cab blur, dramatic morning light through buildings, documentary style, shot on Leica Q2, Henri Cartier-Bresson inspired",
    category: "street",
  },
  // Architecture
  {
    prompt: "Minimalist architecture photography, modern concrete building with geometric patterns, dramatic shadows, black and white with high contrast, shot on Phase One IQ4, architectural digest quality",
    category: "architecture",
  },
  {
    prompt: "Interior architecture photography of luxury minimalist apartment, floor to ceiling windows, city skyline view at dusk, warm ambient lighting, shot on Sony A7R V with tilt-shift lens, Architectural Digest style",
    category: "architecture",
  },
  // Wildlife
  {
    prompt: "Wildlife photography of majestic lion in golden savanna grass, intense eye contact, shallow depth of field, golden hour lighting, shot on Canon 600mm telephoto lens, National Geographic award winning quality",
    category: "wildlife",
  },
  {
    prompt: "Underwater photography of sea turtle gliding through crystal clear blue water, sunbeams from surface, coral reef below, professional marine photography, shot with underwater housing, Jacques Cousteau quality",
    category: "wildlife",
  },
  // Food
  {
    prompt: "Professional food photography of gourmet sushi platter, dark slate background, dramatic moody lighting, steam rising, shot on Phase One camera with macro lens, Michelin star restaurant quality",
    category: "food",
  },
  {
    prompt: "Artisan coffee latte art photography, rustic wooden table, natural window light, shallow depth of field, warm tones, shot on Hasselblad, food magazine cover quality",
    category: "food",
  },
  // Abstract/Artistic
  {
    prompt: "Abstract macro photography of water droplets on colorful flower petals, rainbow light refraction, extreme close-up, shot on Canon MP-E 65mm macro lens, art gallery quality, vibrant colors",
    category: "abstract",
  },
  {
    prompt: "Long exposure light painting photography, swirling neon colors in dark environment, abstract patterns, shot on tripod with 30 second exposure, professional fine art photography",
    category: "abstract",
  },
  // Travel/Culture
  {
    prompt: "Travel photography of ancient temple at sunrise in Bagan Myanmar, hot air balloons in misty background, golden light, shot on Nikon Z9, cinematic wide angle, Lonely Planet cover quality",
    category: "travel",
  },
  {
    prompt: "Cultural documentary photography of Moroccan spice market, vibrant colors of turmeric and paprika, authentic local vendor, rich textures, shot on Leica SL2, Steve McCurry style",
    category: "travel",
  },
  // Urban/City
  {
    prompt: "Dramatic cityscape photography of Hong Kong at night, dense urban jungle, countless lights, long exposure car trails, shot from Victoria Peak, professional architectural photography, 8k resolution",
    category: "urban",
  },
  {
    prompt: "Industrial photography of abandoned factory, rust and decay, dramatic light rays through broken windows, urban exploration style, shot on medium format camera, moody post-apocalyptic aesthetic",
    category: "urban",
  },
];

// Logo prompt for aperture/eye hybrid
const logoPrompt = {
  prompt: "Minimalist logo design for photography brand called Vertex, combining camera aperture blades with human eye iris, warm amber and gold gradient colors, sleek modern design, on pure black background, vector style clean lines, professional brand identity, symmetric, centered composition",
};

async function generateImage(prompt: string, filename: string): Promise<string | null> {
  console.log(`Generating: ${filename}`);

  try {
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          go_fast: true,
          num_outputs: 1,
          aspect_ratio: "3:2",
          output_format: "webp",
          output_quality: 90,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      const imageUrl = output[0];

      // Fetch the image
      const response = await fetch(imageUrl as string);
      const buffer = await response.arrayBuffer();

      // Save to disk
      const filePath = path.join(OUTPUT_DIR, filename);
      await writeFile(filePath, Buffer.from(buffer));

      console.log(`  ✓ Saved: ${filename}`);
      return filePath;
    }

    return null;
  } catch (error) {
    console.error(`  ✗ Error generating ${filename}:`, error);
    return null;
  }
}

async function generateLogo(): Promise<string | null> {
  console.log("\n🎨 Generating Vertex Logo...\n");

  try {
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: logoPrompt.prompt,
          go_fast: true,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "png",
          output_quality: 100,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      const imageUrl = output[0];
      const response = await fetch(imageUrl as string);
      const buffer = await response.arrayBuffer();

      const logoPath = path.join(process.cwd(), "public/images/logo-generated.png");
      await writeFile(logoPath, Buffer.from(buffer));

      console.log("  ✓ Logo saved to public/images/logo-generated.png\n");
      return logoPath;
    }

    return null;
  } catch (error) {
    console.error("  ✗ Error generating logo:", error);
    return null;
  }
}

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  Vertex Asset Generator             ║");
  console.log("║  Using Replicate API                     ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Generate logo first
  await generateLogo();

  // Generate seed photos
  console.log("📸 Generating Seed Photos...\n");

  const results: { filename: string; category: string; path: string | null }[] = [];

  for (let i = 0; i < photoPrompts.length; i++) {
    const { prompt, category } = photoPrompts[i];
    const filename = `seed-${category}-${String(i + 1).padStart(2, "0")}.webp`;

    const filePath = await generateImage(prompt, filename);
    results.push({ filename, category, path: filePath });

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Summary
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  Generation Complete                     ║");
  console.log("╚══════════════════════════════════════════╝\n");

  const successful = results.filter((r) => r.path !== null).length;
  console.log(`Generated ${successful}/${photoPrompts.length} images successfully.`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Generate JSON manifest for seed script
  const manifest = results
    .filter((r) => r.path !== null)
    .map((r) => ({
      filename: r.filename,
      category: r.category,
      url: `/images/seed/${r.filename}`,
    }));

  await writeFile(
    path.join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("📄 Manifest saved to public/images/seed/manifest.json\n");
}

main().catch(console.error);
