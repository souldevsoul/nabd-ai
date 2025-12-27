"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  SlCloudDownload,
  SlDoc,
  SlRefresh,
  SlBag,
  SlCamera,
  SlCalender,
  SlArrowRight,
} from "react-icons/sl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Purchase {
  id: string;
  createdAt: string;
  creditsCost: number;
  downloadToken: string;
  downloadCount: number;
  maxDownloads: number;
  status: string;
  photo: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    fileUrl: string;
    photographer: {
      name: string | null;
      photographerProfile: {
        displayName: string | null;
        handle: string;
      } | null;
    };
  };
  licenseOption: {
    type: string;
    name: string;
    usageTerms: string | null;
  };
}

const licenseColors: Record<string, string> = {
  PERSONAL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  EDITORIAL: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  COMMERCIAL: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  EXTENDED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch("/api/purchases");
        if (res.ok) {
          const data = await res.json();
          setPurchases(data.purchases || []);
        }
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  const handleDownload = async (token: string, title: string) => {
    try {
      const res = await fetch(`/api/photos/download/${token}`);
      const data = await res.json();

      if (res.ok && data.download?.url) {
        const link = document.createElement("a");
        link.href = data.download.url;
        link.download = data.download.filename || `${title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Refresh to update download count
        const updatedPurchases = purchases.map((p) =>
          p.downloadToken === token
            ? { ...p, downloadCount: p.downloadCount + 1 }
            : p
        );
        setPurchases(updatedPurchases);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SlRefresh className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Менің сатып алуларым</h1>
        <p className="text-slate-400 mt-1">
          Лицензияланған фотосуреттерді жүктеп алыңыз және басқарыңыз
        </p>
      </div>

      {/* Purchases Grid */}
      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase, index) => {
            const photographerName =
              purchase.photo.photographer.photographerProfile?.displayName ||
              purchase.photo.photographer.name ||
              "Unknown";
            const remainingDownloads =
              purchase.maxDownloads - purchase.downloadCount;

            return (
              <motion.div
                key={purchase.id}
                className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Image */}
                <Link href={`/gallery/${purchase.photo.id}`} className="block relative aspect-[4/3] group">
                  <Image
                    src={purchase.photo.thumbnailUrl || purchase.photo.fileUrl}
                    alt={purchase.photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        licenseColors[purchase.licenseOption.type] ||
                          "bg-slate-800 text-slate-300"
                      )}
                    >
                      {purchase.licenseOption.name}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <SlArrowRight className="w-5 h-5 text-white" />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-white truncate">
                      {purchase.photo.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                      <SlCamera className="w-3.5 h-3.5" />
                      <span>{photographerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-slate-400">
                      <SlCalender className="w-3.5 h-3.5" />
                      <span>
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <SlDoc className="w-3.5 h-3.5" />
                      <span>{remainingDownloads} жүктеп алу қалды</span>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      handleDownload(purchase.downloadToken, purchase.photo.title)
                    }
                    disabled={remainingDownloads <= 0}
                    className={cn(
                      "w-full",
                      remainingDownloads > 0
                        ? "bg-amber-500 hover:bg-amber-400 text-black"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <SlCloudDownload className="w-4 h-4 mr-2" />
                    {remainingDownloads > 0 ? "Жүктеу" : "Лимит аяқталды"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <SlBag className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Сатып алулар жоқ
          </h3>
          <p className="text-slate-400 mb-6">
            Галереяны қарап, жинағыңызды құру үшін фотосуреттер сатып алыңыз
          </p>
          <Link href="/gallery">
            <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
              Галереяны қарау
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
