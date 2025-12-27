"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { VerificationShield } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlMagnifier,
  SlGrid,
  SlGrid as SlLayoutGrid,
  SlCamera,
  SlLocationPin,
  SlClose,
  SlRefresh,
} from "react-icons/sl";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  title: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  category: string;
  location: string | null;
  photographer: {
    name: string | null;
    photographerProfile: {
      handle: string;
      displayName: string | null;
    } | null;
  };
  tags: { tag: { name: string; slug: string } }[];
}

const categories = [
  { value: "all", label: "Барлық Санаттар" },
  { value: "landscape", label: "Көрініс" },
  { value: "portrait", label: "Портрет" },
  { value: "street", label: "Көше" },
  { value: "architecture", label: "Сәулет" },
  { value: "wildlife", label: "Жабайы Табиғат" },
  { value: "food", label: "Тағам" },
  { value: "abstract", label: "Абстракт" },
  { value: "travel", label: "Саяхат" },
  { value: "urban", label: "Қалалық" },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos");
        if (res.ok) {
          const data = await res.json();
          setPhotos(data.photos || []);
        }
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      searchQuery === "" ||
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.photographer.photographerProfile?.displayName || photo.photographer.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      photo.tags.some((t) =>
        t.tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || (photo.category && photo.category.toLowerCase() === selectedCategory);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => photo.tags.some((t) => t.tag.slug === tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  // Get unique tags
  const allTags = [...new Set(photos.flatMap((p) => p.tags.map((t) => t.tag.slug)))].slice(0, 15);
  const tagNames = photos.flatMap((p) => p.tags.map((t) => ({ slug: t.tag.slug, name: t.tag.name })));
  const uniqueTags = allTags.map((slug) => ({
    slug,
    name: tagNames.find((t) => t.slug === slug)?.name || slug,
  }));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero - ASYMMETRIC with Photo Collage Preview */}
        <section className="relative py-20 hero-gradient overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left: Text Content - Asymmetric positioning */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="lg:col-span-7 text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
                  <SlCamera className="text-primary" size={14} />
                  <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Расталған Галерея</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase leading-[0.9] mb-8">
                  <span className="gradient-text block">Расталған</span>
                  <span className="text-foreground font-light mt-2 block">Фотографияны</span>
                  <span className="text-foreground font-light">Зерттеу</span>
                </h1>

                <div className="w-32 h-1 cosmic-line mb-8" />

                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-4 max-w-xl">
                  Әрбір фото расталған. Әрбір жасаушы аталған.
                </p>
                <p className="text-lg text-foreground/70 font-light leading-relaxed max-w-lg">
                  Әлемнен шынайы адам жасаған фотографияны табыңыз.
                </p>

                <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <SlCamera size={16} className="text-primary" />
                    <span>{photos.length} фото</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>100% расталған</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Photo Collage Preview - Asymmetric grid */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="lg:col-span-5 relative h-96 lg:h-[500px] hidden lg:block"
              >
                {/* Asymmetric photo grid preview */}
                <div className="absolute inset-0 grid grid-cols-2 gap-3">
                  {/* Large photo - top left */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="col-span-2 row-span-2 relative overflow-hidden border-2 border-primary/20 backdrop-blur-sm"
                  >
                    {photos[0] && (
                      <Image
                        src={photos[0].thumbnailUrl || photos[0].fileUrl}
                        alt={photos[0].title}
                        fill
                        className="object-cover opacity-40"
                        sizes="400px"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  </motion.div>

                  {/* Small photos - bottom row */}
                  {photos.slice(1, 3).map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="relative overflow-hidden border border-primary/10 backdrop-blur-sm"
                    >
                      <Image
                        src={photo.thumbnailUrl || photo.fileUrl}
                        alt={photo.title}
                        fill
                        className="object-cover opacity-30"
                        sizes="200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                    </motion.div>
                  ))}
                </div>

                {/* Verification badge overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border border-primary/30">
                  <VerificationShield size={16} />
                  <span className="text-xs font-medium text-foreground">Расталған</span>
                </div>
              </motion.div>
            </div>

            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 lg:mt-16"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <SlMagnifier
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Фотолар, фотографтар немесе тегтерді іздеу..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10">
                    <SelectValue placeholder="Санат" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "border-white/10",
                      viewMode === "masonry" && "bg-white/10"
                    )}
                    onClick={() => setViewMode("masonry")}
                  >
                    <SlLayoutGrid size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "border-white/10",
                      viewMode === "grid" && "bg-white/10"
                    )}
                    onClick={() => setViewMode("grid")}
                  >
                    <SlGrid size={18} />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {uniqueTags.map((tag) => (
                  <button
                    key={tag.slug}
                    onClick={() => toggleTag(tag.slug)}
                    className={cn(
                      "rounded-full px-3 py-1 text-sm transition-all",
                      selectedTags.includes(tag.slug)
                        ? "bg-amber-500 text-black"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <SlClose size={14} />
                    Тазалау
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredPhotos.length} фото табылды
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <SlRefresh className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${selectedTags.join("-")}-${viewMode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    viewMode === "masonry" ? "masonry-grid" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  )}
                >
                  {filteredPhotos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={viewMode === "masonry" ? "masonry-item" : ""}
                    >
                      <Link href={`/gallery/${photo.id}`} className="group block">
                        <div className="photo-card">
                          <div
                            className={cn(
                              "relative overflow-hidden rounded-xl",
                              viewMode === "masonry"
                                ? "aspect-[3/4]"
                                : "aspect-square"
                            )}
                          >
                            <Image
                              src={photo.thumbnailUrl || photo.fileUrl}
                              alt={photo.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            {/* Verified badge */}
                            <div className="absolute left-3 top-3">
                              <VerificationShield size={20} />
                            </div>

                            {/* Info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <p className="text-sm text-amber-400 capitalize">
                                {photo.category}
                              </p>
                              <h3 className="text-lg font-semibold text-white truncate">
                                {photo.title}
                              </h3>
                              <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                                <SlCamera size={14} />
                                <span>
                                  {photo.photographer.photographerProfile?.displayName ||
                                    photo.photographer.name ||
                                    "Unknown"}
                                </span>
                              </div>
                              {photo.location && (
                                <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                                  <SlLocationPin size={12} />
                                  <span>{photo.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {!loading && filteredPhotos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <SlCamera size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase">Фотолар табылмады</h3>
                <p className="mt-2 text-muted-foreground">
                  Іздеуіңізді немесе сүзгілеріңізді реттеуді көріңіз
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedTags([]);
                  }}
                >
                  Барлық сүзгілерді тазалау
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
