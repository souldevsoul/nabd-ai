import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SlDocs, SlKey, SlBulb, SlShield, SlBookOpen, SlDocs as SlTerminal } from "react-icons/sl";

export const metadata: Metadata = {
  title: "وثائق API",
  description: "NABD-тің тексерілге صورةсуреттері біздің REST API арқылы қолдабаларыңызإلى біріктіріңіз.",
};

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/photos",
    description: "List all verified photos with pagination and filtering",
  },
  {
    method: "GET",
    path: "/api/v1/photos/:id",
    description: "Get details of a specific photo including EXIF data",
  },
  {
    method: "GET",
    path: "/api/v1/photos/search",
    description: "Search photos by keywords, tags, or photographer",
  },
  {
    method: "GET",
    path: "/api/v1/photographers",
    description: "List verified photographers",
  },
  {
    method: "GET",
    path: "/api/v1/photographers/:id",
    description: "Get photographer profile and portfolio",
  },
  {
    method: "POST",
    path: "/api/v1/downloads",
    description: "Generate download link for purchased photo",
  },
  {
    method: "GET",
    path: "/api/v1/licenses/:id",
    description: "Verify license status and usage rights",
  },
];

const codeExample = `// Example: Search for landscape photos
const response = await fetch('https://api.vertex.com/v1/photos/search', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  params: {
    q: 'landscape mountain',
    category: 'nature',
    limit: 20,
    verified: true
  }
});

const { photos, pagination } = await response.json();

// Each photo includes verification data
photos.forEach(photo => {
  console.log(photo.id, photo.title);
  console.log('Verified:', photo.verificationStatus);
  console.log('Camera:', photo.exif.cameraMake, photo.exif.cameraModel);
});`;

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex rounded-xl bg-amber-500/10 p-3 text-amber-400 mb-6">
              <SlDocs size={32} />
            </div>
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              <span className="gradient-text">API</span> وثائق
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-light">
              موثق، أصلي صورةсуреттерді қолдабаларыңызإلى біріктіріңіз.
              REST API كامل مع قدرات المصادقة والبحث والتنزيل.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link href="/register?plan=pro">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2">
                  <SlKey size={18} />
                  احصل على مفتاح API
                </Button>
              </Link>
              <Link href="#endpoints">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 gap-2">
                  <SlBookOpen size={18} />
                  عرض نقاط النهاية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: SlBulb,
                title: "Fast & Reliable",
                description: "99.9% uptime SLA with global CDN distribution for fast image delivery.",
              },
              {
                icon: SlShield,
                title: "Verified Content",
                description: "Every photo includes verification metadata proving authenticity.",
              },
              {
                icon: SlTerminal,
                title: "Developer Friendly",
                description: "RESTful design, comprehensive docs, and SDKs for popular languages.",
              },
            ].map((feature) => (
              <div key={feature.title} className="stat-card">
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 w-fit mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">المصادقة</h2>
          <div className="stat-card">
            <p className="text-muted-foreground mb-4">
              All API requests require authentication using a Bearer token. Include your
              API key in the Authorization header:
            </p>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-amber-400">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </pre>
            <p className="text-sm text-muted-foreground mt-4">
              API keys are available with Pro and Enterprise plans. Each key has configurable
              rate limits and permissions.
            </p>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">نقاط النهاية</h2>
          <div className="space-y-3">
            {endpoints.map((endpoint, i) => (
              <div key={i} className="stat-card">
                <div className="flex items-start gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                      endpoint.method === "GET"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <div>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                    <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">مثال: البحث عن الصور</h2>
          <div className="stat-card">
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-muted-foreground">{codeExample}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Response Format */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">تنسيق الاستجابة</h2>
          <div className="stat-card">
            <p className="text-muted-foreground mb-4">
              All responses are in JSON format. Photo objects include:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { field: "id", desc: "Unique photo identifier" },
                { field: "title", desc: "Photo title" },
                { field: "description", desc: "Full description" },
                { field: "fileUrl", desc: "URL to full-resolution image" },
                { field: "thumbnailUrl", desc: "URL to thumbnail" },
                { field: "verificationStatus", desc: "VERIFIED | PENDING | REJECTED" },
                { field: "verificationScore", desc: "Authenticity confidence (0-100)" },
                { field: "exif", desc: "Camera metadata object" },
                { field: "photographer", desc: "Creator information" },
                { field: "licenses", desc: "Available license options" },
                { field: "tags", desc: "Array of tags/categories" },
                { field: "createdAt", desc: "Upload timestamp" },
              ].map((item) => (
                <div key={item.field} className="flex gap-2 text-sm">
                  <code className="text-amber-400">{item.field}</code>
                  <span className="text-muted-foreground">- {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">حدود المعدل</h2>
          <div className="stat-card">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-bold text-amber-400">Pro Plan</h3>
                <p className="text-2xl font-black mt-2">1,000</p>
                <p className="text-sm text-muted-foreground">requests/hour</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-400">Enterprise</h3>
                <p className="text-2xl font-black mt-2">10,000</p>
                <p className="text-sm text-muted-foreground">requests/hour</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-400">Custom</h3>
                <p className="text-2xl font-black mt-2">Unlimited</p>
                <p className="text-sm text-muted-foreground">Contact sales</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Rate limit headers are included in all responses. Exceeding limits returns 429 status.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">هل أنت جاهز للتكامل؟</h2>
          <p className="text-muted-foreground mb-8">
            ابدأ مع API اليوم. الوثائق الكاملة والدعم متضمنة.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register?plan=pro">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                احصل على وصول API
              </Button>
            </Link>
            <Link href="/contact?type=business">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                اتصل بالمبيعات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
