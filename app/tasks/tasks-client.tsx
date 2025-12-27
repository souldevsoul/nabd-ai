"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  RiRobot2Line, RiMessage2Line, RiBrainLine, RiSettings3Line, RiEditLine, RiFileList3Line,
  RiPieChart2Line, RiDashboard3Line, RiEye2Line, RiImageLine, RiFocus3Line, RiFileTextLine,
  RiVoiceprintLine, RiRefreshLine, RiGitBranchLine, RiPlugLine, RiDatabase2Line,
  RiCloudLine, RiCodeSSlashLine, RiArrowRightLine, RiTeamLine, RiSparklingLine,
} from "react-icons/ri";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "ai-agent-development": RiRobot2Line,
  "chatbot-development": RiMessage2Line,
  "ml-model-training": RiBrainLine,
  "llm-fine-tuning": RiSettings3Line,
  "prompt-engineering": RiEditLine,
  "rag-systems": RiFileList3Line,
  "data-analysis": RiPieChart2Line,
  "ai-dashboards": RiDashboard3Line,
  "computer-vision": RiEye2Line,
  "image-processing": RiImageLine,
  "object-detection": RiFocus3Line,
  "nlp-processing": RiFileTextLine,
  "document-ai": RiFileTextLine,
  "voice-ai": RiVoiceprintLine,
  "ai-automation": RiRefreshLine,
  "workflow-automation": RiGitBranchLine,
  "data-pipeline": RiPlugLine,
  "database-optimization": RiDatabase2Line,
  "api-integration": RiCloudLine,
  "system-integration": RiPlugLine,
  "python-ml": RiCodeSSlashLine,
};

interface Task {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  basePrice: number;
  _count: { specialists: number };
}

export function TasksClient({ tasks }: { tasks: Task[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(tasks.map((t) => t.category))).sort();
  const filteredTasks = selectedCategory ? tasks.filter((t) => t.category === selectedCategory) : tasks;

  const tasksByCategory = filteredTasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="min-h-screen bg-background starfield">
      <Header />

      {/* Hero - RIGHT-ALIGNED with Mission Control Graphics */}
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />

        {/* Mission Control Graphics on Left */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-20 w-1/3 h-full hidden lg:block"
        >
          <div className="relative w-full h-full opacity-10">
            {/* Radar circles */}
            <div className="absolute top-32 left-20 w-80 h-80 border-2 border-primary/30 rounded-full" />
            <div className="absolute top-44 left-32 w-56 h-56 border-2 border-aurora/20 rounded-full" />
            <div className="absolute top-56 left-44 w-32 h-32 border-2 border-primary/20 rounded-full" />

            {/* Grid lines */}
            <div className="absolute top-32 left-20 w-80 h-px bg-primary/20" />
            <div className="absolute top-32 left-20 h-80 w-px bg-primary/20" />

            {/* Dashboard elements */}
            <RiDashboard3Line className="absolute top-24 left-16 w-48 h-48 text-primary/20" />
            <RiPieChart2Line className="absolute top-64 left-24 w-32 h-32 text-aurora/15" />
          </div>
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-8">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="ml-auto max-w-2xl text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-primary/30 bg-primary/5">
              <RiSparklingLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">كتالوج المهام</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] mb-6">
              المهمة
              <span className="block font-bold gradient-text mt-2">الحمولات</span>
            </h1>

            <div className="w-32 h-1 cosmic-line ml-auto mb-8" />

            <p className="text-muted-foreground text-xl font-light leading-relaxed mb-4">
              حلول ذكاء اصطناعي حيوية للمهمة من أجل النجاح المداري.
            </p>
            <p className="text-foreground/70 text-lg font-light leading-relaxed">
              موثوقية عصر الفضاء. نتائج نجمية.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`font-display tracking-wider uppercase text-xs transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-secondary text-secondary-foreground"
                  : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              الكل المهمةлар ({tasks.length})
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`font-display tracking-wider uppercase text-xs transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-secondary text-secondary-foreground"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {cat} ({tasks.filter((t) => t.category === cat).length})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Tasks Grid */}
      <section className="py-12 pb-32">
        <div className="mx-auto max-w-7xl px-8">
          {Object.entries(tasksByCategory).map(([category, categoryTasks], ci) => (
            <div key={category} className="mb-20 last:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1 }}
                className="flex items-center gap-4 mb-10"
              >
                <div className="w-12 h-0.5 gold-line" />
                <h2 className="font-display text-2xl font-bold tracking-wide uppercase">
                  {category}
                </h2>
                <span className="text-sm text-muted-foreground font-light">
                  ({categoryTasks.length} مهمة)
                </span>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTasks.map((task, i) => {
                  const Icon = iconMap[task.name] || RiCodeSSlashLine;
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.6 }}
                      whileHover={{ y: -4 }}
                      className="elite-card group relative overflow-hidden rocket-hover"
                    >
                      {/* HUD frame corners */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/20 group-hover:border-primary/60 transition-colors duration-500" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/20 group-hover:border-primary/60 transition-colors duration-500" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/20 group-hover:border-primary/60 transition-colors duration-500" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/20 group-hover:border-primary/60 transition-colors duration-500" />

                      <div className="relative">
                        <div className="flex items-start gap-4">
                          <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500"
                          >
                            <Icon size={22} className="text-primary" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-bold tracking-wide text-sm mb-1 truncate group-hover:text-primary transition-colors duration-300">
                              {task.displayName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                              <RiTeamLine size={12} />
                              <span>{task._count.specialists} رائد فضاء</span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-5 text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
                          {task.description}
                        </p>

                        <div className="mt-6 pt-6 border-t border-border group-hover:border-primary/20 transition-colors duration-500 flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-display font-bold text-foreground">{task.basePrice}</span>
                            <span className="text-sm text-muted-foreground ml-1">رصيد</span>
                          </div>
                          <Link href={`/request?task=${task.name}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="font-display tracking-wider uppercase text-xs gap-2 border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                            >
                              نشر
                              <RiArrowRightLine size={12} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Request CTA - Enhanced */}
      <section className="py-32 bg-gradient-to-tr from-navy/30 via-background to-navy/40 border-t border-primary/20 relative overflow-hidden">
        {/* Starfield background */}
        <div className="absolute inset-0 constellation opacity-50" />

        {/* Animated trajectory lines */}
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 hidden lg:block"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M 0,200 Q 400,50 800,200 T 1600,200"
              stroke="currentColor"
              className="text-primary/30"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M 0,300 Q 400,150 800,300 T 1600,300"
              stroke="currentColor"
              className="text-aurora/20"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        <div className="mx-auto max-w-4xl px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 border-2 border-primary/40 bg-primary/10 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <RiSparklingLine className="text-primary" size={16} />
              </motion.div>
              <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">Арайы المهمة</span>
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-6 leading-tight">
              مسار مخصص
              <span className="block font-bold gradient-text mt-2">مطلوب؟</span>
            </h2>

            <div className="w-32 h-1 cosmic-line mx-auto mb-8" />

            <p className="text-muted-foreground text-lg font-light mb-4 leading-relaxed max-w-2xl mx-auto">
              المهمة параметрлеріңіз туралы бізге хабарлаңыз, біз экипаж тізіміе идеал رائد فضاءді таإلىйыдаймыз.
            </p>
            <p className="text-foreground/60 text-base font-light mb-12 leading-relaxed max-w-xl mx-auto">
              المهمة брифигі. AI сәйкестедіру. Экипаж іріктеу.
            </p>

            <Link href="/request">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="px-12 py-7 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display tracking-[0.2em] uppercase text-sm shadow-2xl shadow-secondary/30 border border-secondary/50">
                  طلب طاقم
                  <RiArrowRightLine className="ml-3" size={18} />
                </Button>
              </motion.div>
            </Link>

            <div className="mt-10 flex items-center justify-center gap-8 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>مطابقة الذكاء الاصطناعي</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-aurora rounded-full animate-pulse" />
                <span>تعيين سريع</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
