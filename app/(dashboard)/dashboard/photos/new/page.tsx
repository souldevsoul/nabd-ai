"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlCloudUpload,
  SlClose,
  SlCheck,
  SlPicture,
  SlRefresh,
  SlArrowLeft,
  SlDiamond,
  SlMagicWand,
  SlCamera,
  SlEnergy,
  SlPaperPlane,
} from "react-icons/sl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function NewPhotoPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<"idle" | "uploading" | "analyzing" | "done">("idle");
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/")
    );

    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    setUploadPhase("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 60) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("autoAnalyze", autoAnalyze.toString());

      setUploadProgress(70);
      setUploadPhase("analyzing");

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadProgress(100);
      setUploadPhase("done");

      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Photo uploaded successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
      setUploadPhase("idle");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
          >
            <SlArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Басқару тақтаа оралу
          </Link>
          <h1 className="text-3xl font-bold text-white">Фотосурет жүктеу</h1>
          <p className="text-slate-400 mt-2">
            Шыайы фотографияңыз әлемمع бөлісіңіз
          </p>
        </motion.div>

        {/* AI Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-slate-800 backdrop-blur-sm"
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: autoAnalyze ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className={`p-3 rounded-xl transition-colors ${autoAnalyze ? "bg-amber-500/20" : "bg-slate-800"}`}
              >
                <SlMagicWand className={`w-6 h-6 transition-colors ${autoAnalyze ? "text-amber-400" : "text-slate-500"}`} />
              </motion.div>
              <div>
                <p className="font-semibold text-white">AI автотегтеу</p>
                <p className="text-sm text-slate-500">
                  GPT-4.1 Vision ينشئ العنوان والوصف والعلامات
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={autoAnalyze}
                onChange={(e) => setAutoAnalyze(e.target.checked)}
                className="sr-only"
              />
              <motion.div
                animate={{ backgroundColor: autoAnalyze ? "rgb(245, 158, 11)" : "rgb(63, 63, 70)" }}
                className="w-14 h-7 rounded-full p-1"
              >
                <motion.div
                  animate={{ x: autoAnalyze ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-primary-foreground shadow-lg"
                />
              </motion.div>
            </div>
          </label>
        </motion.div>

        {/* Drop Zone */}
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
                dragActive
                  ? "border-amber-500 bg-amber-500/10 scale-[1.02]"
                  : "border-slate-700 hover:border-slate-600 hover:bg-slate-900/50"
              }`}
            >
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileSelect}
                className="sr-only"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ y: dragActive ? -5 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`p-5 rounded-2xl transition-colors ${dragActive ? "bg-amber-500/20" : "bg-slate-800"}`}
                  >
                    <SlCamera className={`w-10 h-10 transition-colors ${dragActive ? "text-amber-400" : "text-slate-400"}`} />
                  </motion.div>
                  <div>
                    <p className="text-xl font-medium text-white">
                      Фотоңыз ода тастаңыз
                    </p>
                    <p className="text-slate-500 mt-2">
                      أو <span className="text-amber-500 hover:underline">файлдар шолыңыз</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>JPG</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>PNG</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>WebP</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>Up to 10MB</span>
                  </div>
                </div>
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group">
                <img
                  src={preview || ""}
                  alt="Preview"
                  className="w-full h-auto max-h-[400px] object-contain transition-transform group-hover:scale-[1.02]"
                />
                {!uploading && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setUploadPhase("idle");
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-red-500/80 transition-colors group"
                  >
                    <SlClose className="w-5 h-5 text-white" />
                  </button>
                )}

                {/* Upload Progress Overlay */}
                {uploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="p-4 rounded-full bg-amber-500/20 mb-4"
                    >
                      {uploadPhase === "analyzing" ? (
                        <SlDiamond className="w-8 h-8 text-amber-400" />
                      ) : uploadPhase === "done" ? (
                        <SlCheck className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <SlCloudUpload className="w-8 h-8 text-amber-400" />
                      )}
                    </motion.div>
                    <p className="text-white font-semibold text-lg">
                      {uploadPhase === "uploading" && "Жүктелуде..."}
                      {uploadPhase === "analyzing" && "AI جارٍ التحليل..."}
                      {uploadPhase === "done" && "Дайы!"}
                    </p>
                    <div className="w-48 h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className={`h-full rounded-full ${uploadPhase === "done" ? "bg-emerald-500" : "bg-amber-500"}`}
                      />
                    </div>
                    <p className="text-slate-500 text-sm mt-2">{Math.round(uploadProgress)}%</p>
                  </motion.div>
                )}
              </div>

              {/* Form Fields */}
              {!autoAnalyze && !uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">العنوان</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Фотоңызإلى тақырып егізіңіз"
                      className="bg-slate-900 border-slate-700 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Сипаттама</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Фотоңыз сипаттаңыз..."
                      rows={3}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                </motion.div>
              )}

              {autoAnalyze && !uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <SlDiamond className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">AI автоталдау қосулы</p>
                      <p className="text-sm text-slate-400">
                        العنوان, сипаттама жәе тегтер автоматты түрде жасала
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex gap-4"
        >
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 h-12 text-base shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <SlRefresh className="w-5 h-5 mr-2 animate-spin" />
                جارٍ المعالجة...
              </>
            ) : (
              <>
                <SlEnergy className="w-5 h-5 mr-2" />
                Фотосуретті жүктеу
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={uploading}
            className="border-slate-700 hover:bg-slate-800 h-12 px-6"
          >
            إلغاء
          </Button>
        </motion.div>

        {/* Telegram Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"
        >
          <div className="flex items-center gap-3">
            <SlPaperPlane className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-slate-400">
                <span className="text-blue-400 font-medium">Кеңес:</span> يمكنك أيضاً تحميل الصور مباشرة عبر Telegram!
              </p>
            </div>
            <Link
              href="/dashboard"
              className="ml-auto text-sm text-blue-400 hover:underline whitespace-nowrap"
            >
              توصيل Telegram
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
