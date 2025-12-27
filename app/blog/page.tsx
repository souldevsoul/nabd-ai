"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SlCalender, SlClock, SlUser } from "react-icons/sl";

const blogPosts = [
  {
    slug: "why-authenticity-matters",
    title: "WHY AUTHENTICITY MATTERS MORE THAN EVER IN PHOTOGRAPHY",
    excerpt: "in an age of ai-generated imagery, authentic human photography has become a rare and valuable commodity. here's why it matters.",
    image: "/images/seed/seed-landscape-01.webp",
    author: "S.C.",
    date: "January 15, 2026",
    readTime: "5 min read",
    category: "Industry Insights",
  },
  {
    slug: "exif-data-explained",
    title: "UNDERSTANDING EXIF DATA: YOUR PHOTO'S DIGITAL FINGERPRINT",
    excerpt: "learn how exif metadata proves authenticity and why it's the foundation of trust in human photography.",
    image: "/images/seed/seed-architecture-09.webp",
    author: "M.W.",
    date: "January 10, 2026",
    readTime: "7 min read",
    category: "Education",
  },
  {
    slug: "photographer-revenue-guide",
    title: "MAXIMIZING YOUR EARNINGS AS A VERIFIED PHOTOGRAPHER",
    excerpt: "tips and strategies for photographers looking to build a sustainable income through authentic photography licensing.",
    image: "/images/seed/seed-portrait-04.webp",
    author: "E.R.",
    date: "January 5, 2026",
    readTime: "6 min read",
    category: "Creator Tips",
  },
  {
    slug: "ai-detection-technology",
    title: "HOW WE DETECT AI-GENERATED IMAGES",
    excerpt: "a deep dive into our verification process and the technology behind detecting synthetic imagery.",
    image: "/images/seed/seed-urban-19.webp",
    author: "D.P.",
    date: "December 28, 2025",
    readTime: "8 min read",
    category: "Technology",
  },
  {
    slug: "building-trust-marketplace",
    title: "BUILDING TRUST IN A VISUAL MARKETPLACE",
    excerpt: "how vertex is creating a new standard for authenticity and transparency in stock photography.",
    image: "/images/seed/seed-street-07.webp",
    author: "L.T.",
    date: "December 22, 2025",
    readTime: "4 min read",
    category: "Company",
  },
  {
    slug: "future-of-photography",
    title: "THE FUTURE OF PHOTOGRAPHY IN AN AI WORLD",
    excerpt: "exploring how human photography will evolve and maintain its value alongside ai-generated content.",
    image: "/images/seed/seed-travel-17.webp",
    author: "J.L.",
    date: "December 18, 2025",
    readTime: "10 min read",
    category: "Industry Insights",
  },
];

const categories = ["Барлығы", "Салалық Түсініктер", "Білім", "Жасаушы Кеңестері", "Технология", "Компания"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Барлығы");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const filteredPosts = selectedCategory === "Барлығы"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Электрондық поштаңызды енгізіңіз");
      return;
    }
    setSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Жазылғаныңызға рахмет!");
    setEmail("");
    setSubscribing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-primary/6 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold uppercase tracking-tight">
              <span className="gradient-text">TENSOR</span> БЛОГЫ
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-body font-light">
              шынайы фотография, растау технологиясы және
              тұрақты шығармашылық мансап құру туралы түсініктер.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-display font-bold uppercase tracking-wide transition-all duration-300 ${
                  category === selectedCategory
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="sexy-card grid gap-8 lg:grid-cols-2 items-center"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="text-primary text-xs font-display font-bold uppercase tracking-wide">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wide mt-2 mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 font-light">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <SlUser size={14} />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <SlCalender size={14} />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <SlClock size={14} />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {gridPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <article className="sexy-card h-full">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <span className="text-primary text-xs font-display font-bold uppercase tracking-wide">
                        {post.category}
                      </span>
                      <h3 className="text-base font-display font-bold uppercase tracking-wide mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 font-light line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            !featuredPost && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-light">осы санатта жазбалар табылмады.</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase mb-4">ЖАҢАРТУЛАРМЕН ТАНЫСЫҢЫЗ</h2>
            <p className="text-muted-foreground mb-8 font-light">
              шынайы фотография туралы соңғы түсініктерді поштаңызға алыңыз.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="электрондық поштаңызды енгізіңіз"
                className="flex-1 sexy-input"
              />
              <Button
                type="submit"
                disabled={subscribing}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold uppercase tracking-wide shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {subscribing ? "..." : "Жазылу"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
