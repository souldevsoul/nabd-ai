"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import {
  RiSparklingLine,
  RiTrophyLine,
  RiVipCrownLine,
  RiShieldCheckLine,
  RiUserStarLine,
  RiMoneyDollarCircleLine,
  RiGlobalLine,
  RiAwardLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiStarLine,
  RiTimeLine,
  RiTeamLine,
} from "react-icons/ri";

const benefits = [
  {
    icon: RiMoneyDollarCircleLine,
    title: "Миссия Өтемақысы",
    description: "Миссияға маңызды тәжірибені көрсететін басқару ставкалары. Үздік ғарышкерлер миссия үшін $500+ табады.",
  },
  {
    icon: RiVipCrownLine,
    title: "Жұлдызды Клиенттер",
    description: "Fortune 500 миссия басқару орталықтары мен орбиталық сәттілік бастамалары үшін шешімдерді орналастыру.",
  },
  {
    icon: RiGlobalLine,
    title: "Орбиталық Қамту",
    description: "Жаһандық миссия желісіне қатынас. Кез келген іске қосу орнынан орынға тәуелсіз орналастырулар.",
  },
  {
    icon: RiTimeLine,
    title: "Миссия Автономиясы",
    description: "Траекторияларыңызды таңдаңыз. Қолжетімділік терезелерін орнатыңыз. Толық миссия басқару билігі.",
  },
  {
    icon: RiShieldCheckLine,
    title: "Миссия Қауіпсіздігі",
    description: "Қорғалған платформа операциялары. ORBITA барлық миссия логистикасын және экипаж растауын басқарады.",
  },
  {
    icon: RiTeamLine,
    title: "Экипаж Желісі",
    description: "Миссияға маңызды орналастыруларда элиталық ғарышкерлерге қосылыңыз. Бірлескен орбиталық операциялар.",
  },
];

const requirements = [
  "AI, машиналық оқыту немесе деректер ғылымындағы көрсетілетін тәжірибе",
  "Саладағы кемінде 5 жылдық кәсіби тәжірибе",
  "Табысты іске асырулар немесе кеңес беру жұмыстарының портфолиосы",
  "Ерекше қарым-қатынас және консалтинг қабілеттері",
  "Алдыңғы клиенттерден немесе жұмыс берушілерден кәсіби сілтемелер",
  "Озық деңгей мен клиент қанағаттануына міндеттеме",
];

const process = [
  {
    step: "01",
    title: "Іске Қосуға Дейін",
    description: "Экипаж өтінімін толтырыңыз. Миссия тәжірибесін, техникалық мүмкіндіктерді және траектория тарихын жіберіңіз.",
  },
  {
    step: "02",
    title: "Миссия Шолу",
    description: "Ұшу қолбасшылығы куәліктеріңізді, орналастыру портфолиосын және экипаж сілтемелерін бағалайды.",
  },
  {
    step: "03",
    title: "Экипаж Сұхбаты",
    description: "Таңдалған үміткерлер қабілеттілікті бағалау және экипаж үйлесімділігі үшін миссия басқарумен докингтеледі.",
  },
  {
    step: "04",
    title: "Ұшу Сертификаты",
    description: "Орбиталық платформа қауіпсіздігі үшін жеке куәлік растау және миссия рұқсат хаттамалары.",
  },
  {
    step: "05",
    title: "Іске Қосу",
    description: "Экипажды қабылдау, миссия профилін белсендіру және ORBITA басқару желісіне біріктіру.",
  },
];

const stats = [
  { value: "$500+", label: "Орташа Миссия Бағасы" },
  { value: "< 5%", label: "Экипаж Таңдау Деңгейі" },
  { value: "98%", label: "Миссия Сәттілік Деңгейі" },
  { value: "50+", label: "Жаһандық Іске Қосу Орындары" },
];

export default function BecomePartnerPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden starfield">
      <Header />

      {/* Hero Section - FULL-WIDTH with Text Overlay on Background Pattern */}
      <section className="relative min-h-screen bg-background flex items-center overflow-hidden">
        {/* Full-width cosmic background pattern */}
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="absolute inset-0 constellation opacity-40 pointer-events-none" />

        {/* Large geometric pattern overlay */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 border-4 border-primary rotate-45" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 border-4 border-aurora rounded-full" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 border-4 border-primary" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-primary/20 rounded-full" />
        </div>

        {/* Animated rocket launch visual */}
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 0.08 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 right-1/4 w-96 h-96 hidden xl:block"
        >
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-48 border-l-4 border-r-4 border-primary" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-24 border-t-4 border-primary" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)'}} />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-t from-primary via-aurora to-transparent blur-3xl"
            />
          </div>
        </motion.div>

        {/* Content overlay - centered but full-width feel */}
        <div className="relative w-full px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-6 py-3 mb-10 border-2 border-primary/40 bg-primary/10 backdrop-blur-sm"
            >
              <RiVipCrownLine className="text-primary" size={16} />
              <span className="text-sm tracking-[0.4em] uppercase text-primary font-bold">
                Экипаж Жалдауы
              </span>
            </motion.div>

            {/* Main headline - larger and bolder */}
            <h1 className="font-display text-6xl md:text-8xl xl:text-9xl font-light text-foreground leading-[0.9] tracking-tight mb-8">
              <span className="block">Экипажқа</span>
              <span className="block font-bold gradient-text mt-4">Қосылыңыз</span>
            </h1>

            {/* Cosmic divider */}
            <div className="mx-auto w-40 h-1 cosmic-line mb-10" />

            <p className="text-muted-foreground text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-6">
              ORBITA маңызды орбиталық орналастыруларға миссияға дайын AI ғарышкерлерін іздейді.
            </p>
            <p className="text-foreground/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-16">
              Егер сіз миссияға қабілетті және озық деңгейге ұмтылатын болсаңыз, іске қосу реттілігін аяқтаңыз.
            </p>

            {/* CTA Button */}
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-4 px-14 py-7 bg-secondary text-secondary-foreground font-display text-base tracking-[0.3em] uppercase shadow-2xl shadow-secondary/40 hover:shadow-3xl hover:shadow-secondary/50 transition-all duration-500 border-2 border-secondary/50"
              >
                Іске Қосу Реттілігін Аяқтау
                <RiArrowRightLine
                  className="group-hover:translate-x-2 transition-transform duration-500"
                  size={20}
                />
              </motion.button>
            </Link>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-base"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center">
                  <RiShieldCheckLine size={18} className="text-primary" />
                </div>
                <span className="tracking-wider font-light">Толық Тексерілген</span>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center">
                  <RiAwardLine size={18} className="text-primary" />
                </div>
                <span className="tracking-wider font-light">Эксклюзивті Желі</span>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center">
                  <RiStarLine size={18} className="text-primary" />
                </div>
                <span className="tracking-wider font-light">Премиум Өтемақы</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 bg-background border-y border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
                  {item.value}
                </div>
                <div className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="mb-20 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
              <RiTrophyLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
                Экипаж Артықшылықтары
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
              Неліктен <span className="font-bold gradient-text">Ғарышкерлер</span> ORBITA Таңдайды
            </h2>
            <div className="w-24 h-0.5 cosmic-line mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className="elite-card group"
              >
                <benefit.icon
                  className="text-primary mb-6 group-hover:scale-110 transition-transform duration-500"
                  size={32}
                />
                <h3 className="font-display font-bold text-foreground mb-3 text-lg tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-32 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
              <RiUserStarLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
                Экипаж Талаптары
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
              Миссия <span className="font-bold gradient-text">Дайындығы</span>
            </h2>
            <div className="w-24 h-0.5 cosmic-line mx-auto mt-6" />
            <p className="text-muted-foreground text-lg font-light mt-8 max-w-2xl mx-auto">
              ORBITA миссияға маңызды стандарттарды сақтайды. Біздің экипаж таңдау деңгейі орбиталық озық деңгейді көрсетеді.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="elite-card"
          >
            <div className="space-y-6">
              {requirements.map((requirement, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <RiCheckboxCircleLine className="text-primary mt-1 flex-shrink-0" size={20} />
                  <p className="text-foreground/80 font-light leading-relaxed">{requirement}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
              <RiSparklingLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
                Іске Қосу Реттілігі
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
              <span className="font-bold gradient-text">Орбитаға</span> Траектория
            </h2>
            <div className="w-24 h-0.5 cosmic-line mx-auto mt-6" />
          </motion.div>

          <div className="space-y-0">
            {process.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className="group border-t border-border last:border-b py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center hover:bg-muted/30 transition-all duration-700 px-8 -mx-8"
              >
                <div className="md:col-span-2">
                  <span className="text-5xl font-display font-extralight text-primary/30 group-hover:text-primary transition-colors duration-700">
                    {item.step}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-500">
                    {item.title}
                  </h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-background border-t border-border relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rotate-45 hidden lg:block" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-primary/10 rotate-12 hidden lg:block" />

        <div className="relative max-w-5xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-12 border border-primary/30 bg-primary/5">
              <RiVipCrownLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
                Экипаж Жалдауы
              </span>
            </div>

            <h2 className="font-display text-5xl md:text-7xl font-light text-foreground mb-4">
              Сіз
            </h2>
            <h2 className="font-display text-5xl md:text-7xl font-bold gradient-text mb-10">
              Миссияға Дайынсыз Ба?
            </h2>

            <div className="w-32 h-0.5 cosmic-line mx-auto mb-10" />

            <p className="text-muted-foreground text-lg md:text-xl font-light mb-14 max-w-3xl mx-auto leading-relaxed">
              Біз маңызды орбиталық орналастыруларға миссияға қабілетті AI ғарышкерлерін жалдаймыз.
              <span className="block mt-3 text-foreground/80">
                Іске қосу реттілігі қатал. Миссиялар жұлдызды.
              </span>
            </p>

            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-4 px-14 py-6 bg-secondary text-secondary-foreground font-display text-sm tracking-widest uppercase shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-500"
              >
                Іске Қосу Реттілігін Аяқтау
                <RiArrowRightLine
                  className="group-hover:translate-x-2 transition-transform duration-500"
                  size={20}
                />
              </motion.button>
            </Link>

            <p className="text-muted-foreground text-sm mt-10 tracking-wide font-mono">
              Өтінімдер үздіксіз негізде қаралады. Миссия рұқсаты 10 жұмыс күні ішінде.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
