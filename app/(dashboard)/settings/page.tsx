"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  SlEnvelopeOpen,
  SlLock,
  SlShield,
  SlPaperPlane,
  SlLink,
  SlSocialInstagram,
  SlSocialTwitter,
  SlSocialLinkedin,
  SlCheck,
  SlDocs,
  SlShareAlt,
  SlClose,
} from "react-icons/sl";

interface UserSettings {
  id: string;
  email: string;
  name: string | null;
  telegramUserId: string | null;
  telegramUsername: string | null;
  telegramLinkedAt: string | null;
  photographerProfile: {
    displayName: string;
    handle: string;
    bio: string | null;
    location: string | null;
    websiteUrl: string | null;
    socialInstagram: string | null;
    socialX: string | null;
    socialLinkedin: string | null;
  } | null;
}

interface TelegramLinkToken {
  token: string;
  expiresAt: string;
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [telegramToken, setTelegramToken] = useState<TelegramLinkToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Form refs for controlled inputs
  const nameRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);
  const twitterRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/user/settings");
        const data = await res.json();
        setSettings(data.user);
      } catch {
        toast.error("Failed to load settings");
      }
      setLoading(false);
    };
    fetchSettings();
  }, [refreshKey]);

  const generateTelegramToken = async () => {
    try {
      const res = await fetch("/api/telegram/link", { method: "POST" });
      const data = await res.json();
      setTelegramToken(data);
      toast.success("Link code generated");
    } catch {
      toast.error("Failed to generate link code");
    }
  };

  const unlinkTelegram = async () => {
    try {
      await fetch("/api/telegram/unlink", { method: "POST" });
      setRefreshKey(k => k + 1);
      toast.success("Telegram unlinked");
    } catch {
      toast.error("Failed to unlink Telegram");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: nameRef.current?.value,
      };

      if (settings?.photographerProfile) {
        payload.photographerProfile = {
          displayName: displayNameRef.current?.value,
          bio: bioRef.current?.value,
          location: locationRef.current?.value,
          websiteUrl: websiteRef.current?.value,
          socialInstagram: instagramRef.current?.value,
          socialX: twitterRef.current?.value,
          socialLinkedin: linkedinRef.current?.value,
        };
      }

      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Settings saved successfully");
      setRefreshKey(k => k + 1);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Баптаулар</h1>
        <p className="text-slate-400 mt-2">Аккаунт параметрлері мен интеграцияларды басқарыңыз</p>
      </div>

      {/* Profile Settings */}
      <SettingsSection title="Профиль" description="Жеке ақпаратыңызды жаңартыңыз">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Электрондық пошта</label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <SlEnvelopeOpen className="w-5 h-5 text-slate-500" />
              <span className="text-white">{settings?.email}</span>
              <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
                <SlCheck className="w-3 h-3" /> Расталған
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Көрсетілетін аты</label>
            <input
              ref={nameRef}
              type="text"
              defaultValue={settings?.name || ""}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              placeholder="Сіздің атыңыз"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Telegram Integration */}
      <SettingsSection
        title="Telegram интеграциясы"
        description="Жедел хабарландырулар үшін Telegram аккаунтыңызды қосыңыз"
      >
        {settings?.telegramUserId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="p-3 rounded-full bg-blue-500/20">
                <SlPaperPlane className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold">Telegram қосылды</p>
                  <SlCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-400">
                  @{settings.telegramUsername || "Пайдаланушы"}
                  <span className="text-slate-600 ml-2">
                    {new Date(settings.telegramLinkedAt!).toLocaleDateString()} бастап
                  </span>
                </p>
              </div>
              <button
                onClick={unlinkTelegram}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <SlClose className="w-4 h-4" />
                Ажырату
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700">
              <h4 className="text-white font-medium mb-2">Хабарландыру параметрлері</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-slate-300">Жаңа лицензия сұраулары</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-slate-300">Фото растау жаңартулары</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-slate-300">Төлем хабарландырулары</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <SlPaperPlane className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Telegram қосу</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Лицензия сұраулары, фото растаулар және басқа да жедел хабарландырулар алу үшін Telegram аккаунтыңызды қосыңыз.
                  </p>
                </div>
              </div>
            </div>

            {telegramToken ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
              >
                <h4 className="text-amber-400 font-semibold mb-3">Аккаунтыңызды байланыстырыңыз</h4>
                <ol className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span>Telegram ашып, <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">@VertexBot</code> іздеңіз</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold">2.</span>
                    <span>Ботпен чатты бастаңыз</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold">3.</span>
                    <span>Осы кодты жіберіңіз:</span>
                  </li>
                </ol>
                <div className="mt-4 flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-lg tracking-wider">
                    /link {telegramToken.token}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`/link ${telegramToken.token}`)}
                    className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <SlCheck className="w-5 h-5 text-emerald-400" /> : <SlDocs className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Бұл код {new Date(telegramToken.expiresAt).toLocaleTimeString()} дейін жарамды
                </p>
              </motion.div>
            ) : (
              <button
                onClick={generateTelegramToken}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-colors"
              >
                <SlLink className="w-5 h-5" />
                Байланыс кодын жасау
              </button>
            )}

            <a
              href="https://t.me/VertexBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <SlShareAlt className="w-5 h-5" />
              Telegram-да @VertexBot ашу
            </a>
          </div>
        )}
      </SettingsSection>

      {/* Photographer Profile (if applicable) */}
      {settings?.photographerProfile && (
        <SettingsSection title="Фотограф профилі" description="Ашық профиліңізді реттеңіз">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Көрсетілетін аты</label>
                <input
                  ref={displayNameRef}
                  type="text"
                  defaultValue={settings.photographerProfile.displayName}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Тақырып</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700">
                  <span className="text-slate-500">@</span>
                  <span className="text-white">{settings.photographerProfile.handle}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Өмірбаян</label>
              <textarea
                ref={bioRef}
                defaultValue={settings.photographerProfile.bio || ""}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                placeholder="Фотографияңыз туралы әлемге айтыңыз..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Орналасқан жері</label>
                <input
                  ref={locationRef}
                  type="text"
                  defaultValue={settings.photographerProfile.location || ""}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Қала, Ел"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Веб-сайт</label>
                <input
                  ref={websiteRef}
                  type="url"
                  defaultValue={settings.photographerProfile.websiteUrl || ""}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="https://yoursite.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Әлеуметтік сілтемелер</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700">
                  <SlSocialInstagram className="w-5 h-5 text-pink-400" />
                  <input
                    ref={instagramRef}
                    type="text"
                    defaultValue={settings.photographerProfile.socialInstagram || ""}
                    className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    placeholder="username"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700">
                  <SlSocialTwitter className="w-5 h-5 text-blue-400" />
                  <input
                    ref={twitterRef}
                    type="text"
                    defaultValue={settings.photographerProfile.socialX || ""}
                    className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    placeholder="username"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700">
                  <SlSocialLinkedin className="w-5 h-5 text-blue-500" />
                  <input
                    ref={linkedinRef}
                    type="text"
                    defaultValue={settings.photographerProfile.socialLinkedin || ""}
                    className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>
      )}

      {/* Security */}
      <SettingsSection title="Қауіпсіздік" description="Құпия сөз және қауіпсіздік баптауларын басқарыңыз">
        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-3 w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 text-left transition-colors"
          >
            <SlLock className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-white font-medium">Құпия сөзді өзгерту</p>
              <p className="text-sm text-slate-500">Аккаунтыңызды қауіпсіз ұстау үшін құпия сөзді жаңартыңыз</p>
            </div>
          </button>
          <button
            onClick={() => setShowTwoFactorModal(true)}
            className="flex items-center gap-3 w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 text-left transition-colors"
          >
            <SlShield className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-white font-medium">Екі факторлы аутентификация</p>
              <p className="text-sm text-slate-500">Аккаунтыңызға қосымша қауіпсіздік қабаты қосыңыз</p>
            </div>
          </button>
        </div>
      </SettingsSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? "Сақталуда..." : "Өзгерістерді сақтау"}
        </button>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Құпия сөзді өзгерту</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Ағымдағы құпия сөз</label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="Ағымдағы құпия сөзді енгізіңіз"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Жаңа құпия сөз</label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="Жаңа құпия сөзді енгізіңіз"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Жаңа құпия сөзді растау</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="Жаңа құпия сөзді растаңыз"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ current: "", new: "", confirm: "" });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                >
                  Болдырмау
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isUpdatingPassword || !passwordForm.current || !passwordForm.new}
                  className="flex-1 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  {isUpdatingPassword ? "Жаңартылуда..." : "Құпия сөзді жаңарту"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-Factor Modal */}
      <AnimatePresence>
        {showTwoFactorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTwoFactorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Екі факторлы аутентификация</h3>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                <div className="flex items-start gap-3">
                  <SlShield className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-semibold">Жақын арада</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Екі факторлы аутентификация жақын арада қолжетімді болады. Әзірше аккаунтыңызды қорғау үшін күшті, бірегей құпия сөз қолданыңыз.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowTwoFactorModal(false)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                Жабу
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
