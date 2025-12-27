"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlPaperPlane, SlBubble } from "react-icons/sl";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  createdAt: string;
  content: string;
  senderRole: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface TaskChatProps {
  assignmentId: string;
  currentUserId: string;
  canSend: boolean;
  initialMessages?: Message[];
  specialistName?: string;
}

export function TaskChat({
  assignmentId,
  currentUserId,
  canSend,
  initialMessages = [],
  specialistName,
}: TaskChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(!initialMessages.length);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and polling
  useEffect(() => {
    if (!initialMessages.length) {
      fetchMessages();
    }

    // Poll for new messages every 5 seconds
    pollIntervalRef.current = setInterval(fetchMessages, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [assignmentId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending || !canSend) return;

    setSending(true);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Бүгі";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "الأمس";
    }
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  if (loading) {
    return (
      <div className="flex flex-col h-[400px] items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px] border border-border rounded-xl bg-muted/30">
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <SlBubble className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-muted-foreground">Әлі хабарлар жоқ</h3>
            <p className="text-sm text-muted-foreground/70">
              {canSend
                ? `${specialistName || "мамаمع"} әңгіме бастаңыз`
                : "الدردشة غير متاحة لهذه المهمة"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date divider */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{date}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((message) => {
                    const isOwn = message.sender.id === currentUserId;
                    const isAdmin = message.senderRole === "ADMIN";

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          isOwn && "flex-row-reverse"
                        )}
                      >
                        {/* Avatar */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
                            isAdmin
                              ? "bg-purple-500/20 text-purple-500"
                              : isOwn
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {message.sender.name?.charAt(0).toUpperCase() || "?"}
                        </div>

                        {/* Message bubble */}
                        <div
                          className={cn(
                            "max-w-[70%] rounded-xl px-4 py-2",
                            isAdmin
                              ? "bg-purple-500/10 border border-purple-500/20"
                              : isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {/* Sender name */}
                          <div
                            className={cn(
                              "text-xs mb-1",
                              isOwn
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {isAdmin && (
                              <span className="text-purple-500 font-medium">
                                المسؤول ·{" "}
                              </span>
                            )}
                            {message.sender.name || "Белгісіз"}
                          </div>

                          {/* Content */}
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>

                          {/* Time */}
                          <div
                            className={cn(
                              "text-[10px] mt-1",
                              isOwn
                                ? "text-primary-foreground/50"
                                : "text-muted-foreground/50"
                            )}
                          >
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      {canSend ? (
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Хабарлама жазыңыз..."
              className="min-h-[44px] max-h-[120px] resize-none"
              disabled={sending}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              size="icon"
              className="flex-shrink-0"
            >
              <SlPaperPlane className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            اضغط Enter للإرسال، Shift+Enter لسطر جديد
          </p>
        </div>
      ) : (
        <div className="p-4 border-t border-border bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            الدردشة متاحة فقط للمهام النشطة
          </p>
        </div>
      )}
    </div>
  );
}
